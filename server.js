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

const SPINS_PER_ROUND = 3;
const PAYOUT_BY_MATCH = {2: 10, 3: 30, 4: 200, 5: 10000};
const MATCH_POOL = [2, 3, 4];
const SYM_IDS = ['btc', 'eth', 'sol', 'doge', 'usdt', 'trx'];

// ===== 数据初始化 =====
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RECORDS_FILE)) fs.writeFileSync(RECORDS_FILE, '[]', 'utf8');
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ adminPassword: DEFAULT_PASSWORD, dailyLimit: 1 }, null, 2), 'utf8');
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
function readConfig() {
  const c = readJSON(CONFIG_FILE, { adminPassword: DEFAULT_PASSWORD, dailyLimit: 1 });
  if (c.dailyLimit === undefined) c.dailyLimit = 1;
  return c;
}
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

// 服务器日期（北京时间 YYYY-MM-DD）
function getServerDate() {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return bj.toISOString().slice(0, 10);
}

// ===== 玩家状态管理（key = IP_日期）=====
function playerKey(ip) {
  return ip + '_' + getServerDate();
}

function getOrCreatePlayer(ip) {
  const players = readPlayers();
  const key = playerKey(ip);
  if (!players[key]) {
    players[key] = {
      ip,
      date: getServerDate(),
      roundsUsed: 0,      // 已完成的轮数
      spinsUsed: 0,       // 当前轮已用的 spin 次数
      balance: 0,
      pending: 0,
      canExtract: false,
      withdrawn: false,
      address: '',
      country: '',
      createdAt: new Date().toISOString()
    };
    writePlayers(players);
  }
  return players[key];
}
function savePlayer(ip, data) {
  const players = readPlayers();
  const key = playerKey(ip);
  players[key] = data;
  writePlayers(players);
  // 清理 7 天前的旧记录
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let changed = false;
  Object.keys(players).forEach(k => {
    if (players[k].createdAt && players[k].createdAt < cutoff) {
      delete players[k];
      changed = true;
    }
  });
  if (changed) writePlayers(players);
}

// ===== 玩家状态查询 =====
app.get('/api/player-state', (req, res) => {
  const ip = getClientIP(req);
  const config = readConfig();
  const p = getOrCreatePlayer(ip);

  // 当天能玩多少轮
  const dailyLimit = config.dailyLimit || 1;
  const roundsLeft = Math.max(0, dailyLimit - p.roundsUsed);
  // 当前轮剩余 spin
  const spinsLeft = p.spinsUsed >= SPINS_PER_ROUND ? 0 : (SPINS_PER_ROUND - p.spinsUsed);
  const canPlayToday = roundsLeft > 0 || p.spinsUsed > 0;

  res.json({
    roundsUsed: p.roundsUsed,
    roundsLeft,
    dailyLimit,
    spinsUsed: p.spinsUsed,
    spinsLeft,
    balance: p.balance,
    canExtract: p.canExtract || p.spinsUsed >= SPINS_PER_ROUND,
    withdrawn: p.withdrawn,
    locked: !canPlayToday,
    address: p.address || '',
    country: p.country || ''
  });
});

// ===== 旋转 =====
app.post('/api/spin', (req, res) => {
  const ip = getClientIP(req);
  const config = readConfig();
  const dailyLimit = config.dailyLimit || 1;
  const p = getOrCreatePlayer(ip);
  const { country } = req.body || {};
  if (country && !p.country) p.country = country;

  // 已提交提现
  if (p.withdrawn) {
    return res.status(403).json({ ok: false, error: 'locked' });
  }
  // 当天轮数用完
  if (p.roundsUsed >= dailyLimit && p.spinsUsed === 0) {
    return res.status(403).json({ ok: false, error: 'no_spins' });
  }
  // 当前轮还有未领取的奖金
  if (p.pending > 0) {
    return res.status(400).json({ ok: false, error: 'unclaimed' });
  }
  // 当前轮已用完 3 次 spin，必须先提现
  if (p.spinsUsed >= SPINS_PER_ROUND) {
    return res.status(403).json({ ok: false, error: 'round_done' });
  }

  const outcome = generateOutcome();
  p.spinsUsed += 1;
  p.pending = outcome.payout;
  if (p.spinsUsed >= SPINS_PER_ROUND) p.canExtract = true;
  savePlayer(ip, p);

  res.json({
    ok: true,
    result: outcome.result,
    winId: outcome.winId,
    match: outcome.match,
    payout: outcome.payout,
    spinsUsed: p.spinsUsed,
    spinsLeft: Math.max(0, SPINS_PER_ROUND - p.spinsUsed),
    canExtract: p.canExtract,
    roundsUsed: p.roundsUsed,
    roundsLeft: Math.max(0, dailyLimit - p.roundsUsed),
    dailyLimit
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
  const { address, userAgent, language, visitTime, country } = req.body || {};
  if (!address || typeof address !== 'string' || !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
    return res.status(400).json({ ok: false, error: 'invalid address' });
  }
  const p = getOrCreatePlayer(ip);
  if (p.spinsUsed < SPINS_PER_ROUND) {
    return res.status(400).json({ ok: false, error: 'not_finished' });
  }

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
    language: language || '',
    country: country || p.country || ''
  });
  if (records.length > 5000) records.length = 5000;
  writeRecords(records);

  // 本轮结束，轮数 +1，重置当前轮状态
  p.roundsUsed += 1;
  p.spinsUsed = 0;
  p.canExtract = false;
  p.pending = 0;
  if (country) p.country = country;
  savePlayer(ip, p);

  res.json({ ok: true, balance: p.balance, roundsUsed: p.roundsUsed });
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

// ===== 读取/修改每日次数配置 =====
app.get('/api/config', (req, res) => {
  const token = getTokenFromReq(req);
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const config = readConfig();
  res.json({ dailyLimit: config.dailyLimit || 1 });
});

app.post('/api/config', (req, res) => {
  const token = getTokenFromReq(req);
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const { dailyLimit } = req.body || {};
  const n = parseInt(dailyLimit, 10);
  if (isNaN(n) || n < 1 || n > 100) {
    return res.status(400).json({ ok: false, error: 'invalid dailyLimit (1-100)' });
  }
  const config = readConfig();
  config.dailyLimit = n;
  writeConfig(config);
  res.json({ ok: true, dailyLimit: n });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
