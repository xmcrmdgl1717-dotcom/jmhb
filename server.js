const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== 配置 =====
const DATA_DIR = path.join(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const TOKEN_TTL = 24 * 60 * 60 * 1000;

// ===== 数据初始化 =====
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RECORDS_FILE)) fs.writeFileSync(RECORDS_FILE, '[]', 'utf8');
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ adminPassword: DEFAULT_PASSWORD }, null, 2), 'utf8');
}

function readRecords() {
  try { return JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf8')); }
  catch { return []; }
}
function writeRecords(records) {
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf8');
}
function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); }
  catch { return { adminPassword: DEFAULT_PASSWORD }; }
}
function writeConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

// ===== 中间件 =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== Token 管理 =====
const tokens = new Map();
function issueToken() {
  const token = crypto.randomBytes(24).toString('hex');
  tokens.set(token, Date.now() + TOKEN_TTL);
  return token;
}
function verifyToken(token) {
  if (!token) return false;
  const exp = tokens.get(token);
  if (!exp) return false;
  if (Date.now() > exp) { tokens.delete(token); return false; }
  return true;
}
function getTokenFromReq(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

// ===== 提交记录（公开）=====
app.post('/api/records', (req, res) => {
  const { address, balance, timestamp } = req.body || {};
  if (!address || typeof address !== 'string' || !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
    return res.status(400).json({ ok: false, error: 'invalid address' });
  }
  const records = readRecords();
  const now = new Date();
  const record = {
    address,
    balance: String(balance || '0.00'),
    time: timestamp || now.toISOString(),
    time_local: now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()
  };
  records.unshift(record);
  if (records.length > 5000) records.length = 5000;
  writeRecords(records);
  console.log('[新记录]', record.address, record.balance, record.ip);
  res.json({ ok: true });
});

// ===== 管理员登录 =====
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  const config = readConfig();
  if (password !== config.adminPassword) {
    return res.status(401).json({ ok: false, error: 'wrong password' });
  }
  const token = issueToken();
  res.json({ token });
});

// ===== 读取记录（需鉴权）=====
app.get('/api/records', (req, res) => {
  const token = getTokenFromReq(req);
  if (!verifyToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  res.json({ records: readRecords() });
});

// ===== 修改密码（需鉴权）=====
app.post('/api/change-password', (req, res) => {
  const token = getTokenFromReq(req);
  if (!verifyToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ ok: false, error: 'missing fields' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ ok: false, error: 'password too short' });
  }
  const config = readConfig();
  if (oldPassword !== config.adminPassword) {
    return res.status(401).json({ ok: false, error: 'wrong old password' });
  }
  config.adminPassword = newPassword;
  writeConfig(config);
  console.log('[密码已修改]');
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
