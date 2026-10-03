const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const UAParser = require('ua-parser-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const DEFAULT_CONFIG = {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123456',
    dailyLimit: 1,
    telegramLink: 'https://t.me/your_default_support' // 请改成你的默认飞机链接
};

const readJson = (filePath, defaultVal = {}) => {
    try {
        if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) { console.error(`读取失败: ${filePath}`, e); }
    return defaultVal;
};

const writeJson = (filePath, data) => {
    try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8'); } 
    catch (e) { console.error(`写入失败: ${filePath}`, e); }
};

let config = readJson(CONFIG_FILE, DEFAULT_CONFIG);
let configChanged = false;
for (let key in DEFAULT_CONFIG) {
    if (config[key] === undefined) { config[key] = DEFAULT_CONFIG[key]; configChanged = true; }
}
if (configChanged) writeJson(CONFIG_FILE, config);

let records = readJson(RECORDS_FILE, []);
let players = readJson(PLAYERS_FILE, {});
const adminTokens = new Map();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token || !adminTokens.has(token)) return res.status(401).json({ error: '未授权或 Token 已过期' });
    next();
};

// ================= 公共 API =================
app.get('/api/public-settings', (req, res) => {
    res.json({ telegramLink: config.telegramLink || '' });
});

app.get('/api/player-state', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const today = new Date().toISOString().split('T')[0];
    const playerKey = `${ip}_${today}`;
    if (!players[playerKey]) {
        players[playerKey] = { spinsLeft: 3, pending: 0, balance: 0, roundClaimed: false };
        writeJson(PLAYERS_FILE, players);
    }
    res.json({ ...players[playerKey], dailyLimit: config.dailyLimit });
});

app.get('/api/my-withdrawals', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    res.json(records.filter(r => r.ip === ip).slice(-10).reverse());
});

app.post('/api/spin', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const today = new Date().toISOString().split('T')[0];
    const playerKey = `${ip}_${today}`;
    let player = players[playerKey];
    if (!player) return res.status(400).json({ error: '玩家不存在' });
    if (player.spinsLeft <= 0) return res.status(400).json({ error: '今日免费旋转次数已用完' });

    const SYM_IDS = ['btc', 'eth', 'sol', 'doge', 'usdt', 'trx'];
    const MATCH_POOL = [2, 3, 4];
    const PAYOUT_BY_MATCH = { 2: 10, 3: 30, 4: 200, 5: 10000 };
    const matchCount = MATCH_POOL[Math.floor(Math.random() * MATCH_POOL.length)];
    const winningSym = SYM_IDS[Math.floor(Math.random() * SYM_IDS.length)];
    const result = Array(5).fill(null).map(() => SYM_IDS[Math.floor(Math.random() * SYM_IDS.length)]);
    let placed = 0;
    while (placed < matchCount) {
        const pos = Math.floor(Math.random() * 5);
        if (result[pos] !== winningSym) { result[pos] = winningSym; placed++; }
    }
    const actualMatch = result.filter(s => s === winningSym).length;
    const payout = PAYOUT_BY_MATCH[actualMatch] || 0;
    player.spinsLeft -= 1;
    if (payout > 0) player.pending += payout;
    writeJson(PLAYERS_FILE, players);
    res.json({ result, matchCount: actualMatch, payout, spinsLeft: player.spinsLeft, pending: player.pending });
});

app.post('/api/claim', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const today = new Date().toISOString().split('T')[0];
    const playerKey = `${ip}_${today}`;
    let player = players[playerKey];
    if (!player || player.pending <= 0) return res.status(400).json({ error: '没有可领取的奖金' });
    player.balance += player.pending;
    player.pending = 0;
    writeJson(PLAYERS_FILE, players);
    res.json({ balance: player.balance, success: true });
});

app.post('/api/withdraw', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const today = new Date().toISOString().split('T')[0];
    const playerKey = `${ip}_${today}`;
    const { address, amount } = req.body;
    if (!address || !address.startsWith('T') || address.length !== 34) return res.status(400).json({ error: 'TRC20 地址格式不正确' });
    if (!amount || amount <= 0) return res.status(400).json({ error: '提现金额错误' });
    let player = players[playerKey];
    if (!player || player.balance < amount) return res.status(400).json({ error: '余额不足' });

    const ua = req.headers['user-agent'] || '';
    const parser = new UAParser(ua);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    
    const newRecord = {
        id: Date.now(), address, amount, status: 'pending',
        createdAt: new Date().toISOString(), ip: ip,
        os: `${os.name || '未知'} ${os.version || ''}`.trim(),
        browser: `${browser.name || '未知'} ${browser.version || ''}`.trim()
    };
    records.push(newRecord);
    player.balance -= amount;
    writeJson(RECORDS_FILE, records);
    writeJson(PLAYERS_FILE, players);
    res.json({ success: true, record: newRecord });
});

// ================= 管理员 API =================
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === config.adminPassword) {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        adminTokens.set(token, Date.now() + 24 * 60 * 60 * 1000);
        return res.json({ token });
    }
    res.status(401).json({ error: '密码错误' });
});

app.get('/api/records', authenticateToken, (req, res) => res.json(records.reverse()));

app.get('/api/config', authenticateToken, (req, res) => res.json({ dailyLimit: config.dailyLimit, telegramLink: config.telegramLink }));

app.post('/api/config', authenticateToken, (req, res) => {
    const { dailyLimit } = req.body;
    if (dailyLimit >= 1 && dailyLimit <= 100) {
        config.dailyLimit = dailyLimit;
        writeJson(CONFIG_FILE, config);
        return res.json({ success: true });
    }
    res.status(400).json({ error: '限制范围必须在1-100之间' });
});

app.post('/api/admin/settings', authenticateToken, (req, res) => {
    const { telegramLink } = req.body;
    if (typeof telegramLink !== 'string') return res.status(400).json({ error: '无效链接' });
    config.telegramLink = telegramLink;
    writeJson(CONFIG_FILE, config);
    res.json({ success: true });
});

app.post('/api/change-password', authenticateToken, (req, res) => {
    const { newPassword } = req.body;
    if (newPassword && newPassword.length >= 6) {
        config.adminPassword = newPassword;
        writeJson(CONFIG_FILE, config);
        return res.json({ success: true });
    }
    res.status(400).json({ error: '密码长度至少6位' });
});

app.post('/api/audit', authenticateToken, (req, res) => {
    const { id, action } = req.body;
    const record = records.find(r => r.id === id);
    if (!record) return res.status(404).json({ error: '记录不存在' });
    if (record.status !== 'pending') return res.status(400).json({ error: '该记录已审核' });
    record.status = action === 'approve' ? 'approved' : 'rejected';
    record.auditedAt = new Date().toISOString();
    if (action === 'reject') {
        const ip = record.ip;
        const today = new Date(record.createdAt).toISOString().split('T')[0];
        const playerKey = `${ip}_${today}`;
        if (players[playerKey]) { players[playerKey].balance += record.amount; writeJson(PLAYERS_FILE, players); }
    }
    writeJson(RECORDS_FILE, records);
    res.json({ success: true });
});

app.post('/api/audit-batch', authenticateToken, (req, res) => {
    const { ids, action } = req.body;
    let count = 0;
    ids.forEach(id => {
        const record = records.find(r => r.id === id);
        if (record && record.status === 'pending') {
            record.status = action === 'approve' ? 'approved' : 'rejected';
            record.auditedAt = new Date().toISOString();
            if (action === 'reject') {
                const ip = record.ip;
                const today = new Date(record.createdAt).toISOString().split('T')[0];
                const playerKey = `${ip}_${today}`;
                if (players[playerKey]) players[playerKey].balance += record.amount;
            }
            count++;
        }
    });
    writeJson(RECORDS_FILE, records);
    writeJson(PLAYERS_FILE, players);
    res.json({ success: true, count });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
