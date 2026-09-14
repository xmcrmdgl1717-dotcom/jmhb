const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== 配置 =====
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const DATA_FILE = path.join(__dirname, 'data', 'records.json');
const TOKEN_TTL = 24 * 60 * 60 * 1000;

// ===== 中间件 =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== 数据存储 =====
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}
function readRecords() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function writeRecords(records) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

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
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'wrong password' });
  }
  const token = issueToken();
  res.json({ token });
});

// ===== 读取记录（需鉴权）=====
app.get('/api/records', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!verifyToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  res.json({ records: readRecords() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`   Admin password: ${ADMIN_PASSWORD}`);
});