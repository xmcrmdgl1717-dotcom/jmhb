const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

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

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RECORDS_FILE)) fs.writeFileSync(RECORDS_FILE, '[]', 'utf8');
if (!fs.existsSync(CONFIG_FILE)) fs.writeFileSync(CONFIG_FILE, JSON.stringify({ adminPassword: DEFAULT_PASSWORD, dailyLimit: 1 }, null, 2), 'utf8');
if (!fs.existsSync(PLAYERS_FILE)) fs.writeFileSync(PLAYERS_FILE, '{}', 'utf8');

function readJSON(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }
function readRecords() { return readJSON(RECORDS_FILE, []); }
function writeRecords(r) { writeJSON(RECORDS_FILE, r); }
function readConfig() { const c = readJSON(CONFIG_FILE, { adminPassword: DEFAULT_PASSWORD, dailyLimit: 1 }); if (c.dailyLimit === undefined) c.dailyLimit = 1; return c; }
function writeConfig(c) { writeJSON(CONFIG_FILE, c); }
function readPlayers() { return readJSON(PLAYERS_FILE, {}); }
function writePlayers(p) { writeJSON(PLAYERS_FILE, p); }

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getClientIP(req) { return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
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
  return { result, winId, match: topMatch, payout: PAYOUT_BY_MATCH[topMatch] || 0 };
}
function getServerDate() {
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return bj.toISOString().slice(0, 10);
}
function detectDevice(ua) {
  if (!ua) return 'unknown';
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return 'ios';
  if (/android/.test(s)) return 'android';
  return 'unknown';
}
function genId() {
  return Date.now().toString(36) + '-' + crypto.randomBytes(4).toString('hex');
}

function playerKey(ip) { return ip + '_' + getServerDate(); }

function normalizePlayer(p) {
  if (!p || typeof p !== 'object') return null;
  if (!Array.isArray(p.withdrawals)) p.withdrawals = [];
  if (typeof p.balance !== 'number') p.balance = Number(p.balance) || 0;
  if (typeof p.pending !== 'number') p.pending = Number(p.pending) || 0;
  if (typeof p.roundsUsed !== 'number') p.roundsUsed = Number(p.roundsUsed) || 0;
  if (typeof p.spinsUsed !== 'number') p.spinsUsed = Number(p.spinsUsed) || 0;
  if (typeof p.address !== 'string') p.address = '';
  if (typeof p.country !== 'string') p.country = '';
  if (typeof p.canExtract !== 'boolean') p.canExtract = !!p.canExtract;
  return p;
}

function getOrCreatePlayer(ip) {
  const players = readPlayers();
  const key = playerKey(ip);
  if (!players[key]) {
    players[key] = {
      ip, date: getServerDate(),
      roundsUsed: 0, spinsUsed: 0,
      balance: 0, pending: 0,
      canExtract: false, withdrawn: false,
      address: '', country: '',
      withdrawals: [],
      createdAt: new Date().toISOString()
    };
    writePlayers(players);
  } else {
    normalizePlayer(players[key]);
  }
  return players[key];
}
function savePlayer(ip, data) {
  const players = readPlayers();
  players[playerKey(ip)] = data;
  writePlayers(players);
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let changed = false;
  Object.keys(players).forEach(k => {
    if (players[k].createdAt && players[k].createdAt < cutoff) { delete players[k]; changed = true; }
  });
  if (changed) writePlayers(players);
}

// 兼容老记录：补 id 和 auditStatus
function normalizeRecords(records) {
  let changed = false;
  records.forEach(r => {
    if (!r.id) { r.id = genId(); changed = true; }
    if (!r.auditStatus) { r.auditStatus = 'pending'; changed = true; }
  });
  if (changed) writeRecords(records);
  return records;
}

// ===== 玩家状态查询 =====
app.get('/api/player-state', (req, res) => {
  const ip = getClientIP(req);
  const config = readConfig();
  const p = getOrCreatePlayer(ip);
  const dailyLimit = config.dailyLimit || 1;
  const roundsLeft = Math.max(0, dailyLimit - p.roundsUsed);
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
    country: p.country || '',
    withdrawals: p.withdrawals || []
  });
});

// ===== 我的提现记录（按 IP 从 records.json 查，含审核状态）=====
app.get('/api/my-withdrawals', (req, res) => {
  const ip = getClientIP(req);
  const records = normalizeRecords(readRecords());
  const mine = records.filter(r => r.ip === ip).map(r => ({
    id: r.id,
    address: r.address,
    amount: r.balance,
    at: r.time,
    at_local: r.time_local,
    status: r.auditStatus || 'pending'
  }));
  res.json({ withdrawals: mine });
});

// ===== 旋转 =====
app.post('/api/spin', (req, res) => {
  const ip = getClientIP(req);
  const config = readConfig();
  const dailyLimit = config.dailyLimit || 1;
  const p = getOrCreatePlayer(ip);
  const { country } = req.body || {};
  if (country && !p.country) p.country = country;

  if (p.roundsUsed >= dailyLimit && p.spinsUsed === 0) return res.status(403).json({ ok: false, error: 'no_spins' });
  if (p.pending > 0) return res.status(400).json({ ok: false, error: 'unclaimed' });
  if (p.spinsUsed >= SPINS_PER_ROUND) return res.status(403).json({ ok: false, error: 'round_done' });

  const outcome = generateOutcome();
  p.spinsUsed += 1;
  p.pending = outcome.payout;
  if (p.spinsUsed >= SPINS_PER_ROUND) p.canExtract = true;
  savePlayer(ip, p);

  res.json({
    ok: true,
    result: outcome.result, winId: outcome.winId,
    match: outcome.match, payout: outcome.payout,
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

// ===== 提交提现（扣款 + 记录）=====
app.post('/api/withdraw', (req, res) => {
  const ip = getClientIP(req);
  const { address, userAgent, language, visitTime, country } = req.body || {};
  if (!address || typeof address !== 'string' || !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
    return res.status(400).json({ ok: false, error: 'invalid address' });
  }
  const p = getOrCreatePlayer(ip);
  if (p.spinsUsed < SPINS_PER_ROUND) return res.status(400).json({ ok: false, error: 'not_finished' });

  const withdrawAmount = Number(p.balance.toFixed(2));
  if (withdrawAmount <= 0) return res.status(400).json({ ok: false, error: 'zero_balance' });

  const now = new Date();
  const visitDate = visitTime ? new Date(visitTime) : null;
  const localTime = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  const records = normalizeRecords(readRecords());
  const newRecord = {
    id: genId(),
    address,
    balance: String(withdrawAmount),
    time: now.toISOString(),
    time_local: localTime,
    visit_time: visitDate ? visitDate.toISOString() : '',
    visit_time_local: visitDate ? visitDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '',
    ip,
    userAgent: userAgent || '',
    language: language || '',
    country: country || p.country || '',
    device: detectDevice(userAgent || ''),
    auditStatus: 'pending'
  };
  records.unshift(newRecord);
  if (records.length > 5000) records.length = 5000;
  writeRecords(records);

  p.balance = Number((p.balance - withdrawAmount).toFixed(2));
  if (p.balance < 0) p.balance = 0;
  p.withdrawals.push({
    id: newRecord.id,
    amount: withdrawAmount,
    address,
    at: now.toISOString(),
    at_local: localTime,
    status: 'pending'
  });
  p.roundsUsed += 1;
  p.spinsUsed = 0;
  p.canExtract = false;
  p.pending = 0;
  if (country) p.country = country;
  savePlayer(ip, p);

  res.json({ ok: true, balance: p.balance, roundsUsed: p.roundsUsed, withdrawals: p.withdrawals });
});

// ===== 管理员 =====
const tokens = new Map();
function issueToken() { const t = crypto.randomBytes(24).toString('hex'); tokens.set(t, Date.now() + TOKEN_TTL); return t; }
function verifyToken(token) { if (!token) return false; const exp = tokens.get(token); if (!exp) return false; if (Date.now() > exp) { tokens.delete(token); return false; } return true; }
function getTokenFromReq(req) { const auth = req.headers.authorization || ''; return auth.startsWith('Bearer ') ? auth.slice(7) : ''; }

app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (password !== readConfig().adminPassword) return res.status(401).json({ ok: false, error: 'wrong password' });
  res.json({ token: issueToken() });
});
app.get('/api/records', (req, res) => {
  if (!verifyToken(getTokenFromReq(req))) return res.status(401).json({ ok: false, error: 'unauthorized' });
  res.json({ records: normalizeRecords(readRecords()) });
});
app.post('/api/change-password', (req, res) => {
  if (!verifyToken(getTokenFromReq(req))) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ ok: false, error: 'missing fields' });
  if (newPassword.length < 6) return res.status(400).json({ ok: false, error: 'password too short' });
  const config = readConfig();
  if (oldPassword !== config.adminPassword) return res.status(401).json({ ok: false, error: 'wrong old password' });
  config.adminPassword = newPassword;
  writeConfig(config);
  res.json({ ok: true });
});
app.get('/api/config', (req, res) => {
  if (!verifyToken(getTokenFromReq(req))) return res.status(401).json({ ok: false, error: 'unauthorized' });
  res.json({ dailyLimit: readConfig().dailyLimit || 1 });
});
app.post('/api/config', (req, res) => {
  if (!verifyToken(getTokenFromReq(req))) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const n = parseInt(req.body && req.body.dailyLimit, 10);
  if (isNaN(n) || n < 1 || n > 100) return res.status(400).json({ ok: false, error: 'invalid dailyLimit (1-100)' });
  const config = readConfig(); config.dailyLimit = n; writeConfig(config);
  res.json({ ok: true, dailyLimit: n });
});

// ===== 单条审核 =====
app.post('/api/audit', (req, res) => {
  if (!verifyToken(getTokenFromReq(req))) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const { id, status } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: 'missing id' });
  if (!['pending', 'approved', 'rejected'].includes(status)) return res.status(400).json({ ok: false, error: 'invalid status' });
  const records = normalizeRecords(readRecords());
  const r = records.find(x => x.id === id);
  if (!r) return res.status(404).json({ ok: false, error: 'record not found' });
  r.auditStatus = status;
  r.auditAt = new Date().toISOString();
  writeRecords(records);
  // 同步到 players.json 里对应的 withdrawal
  syncPlayerWithdrawal(id, status);
  res.json({ ok: true });
});

// ===== 批量审核 =====
app.post('/api/audit-batch', (req, res) => {
  if (!verifyToken(getTokenFromReq(req))) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const { ids, status } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ ok: false, error: 'missing ids' });
  if (!['pending', 'approved', 'rejected'].includes(status)) return res.status(400).json({ ok: false, error: 'invalid status' });
  const records = normalizeRecords(readRecords());
  const now = new Date().toISOString();
  let n = 0;
  records.forEach(r => {
    if (ids.includes(r.id)) {
      r.auditStatus = status;
      r.auditAt = now;
      n++;
      syncPlayerWithdrawal(r.id, status);
    }
  });
  writeRecords(records);
  res.json({ ok: true, updated: n });
});

// 同步 players.json 里的 withdrawal 状态
function syncPlayerWithdrawal(recordId, status) {
  const players = readPlayers();
  let changed = false;
  Object.keys(players).forEach(k => {
    const p = players[k];
    if (p && Array.isArray(p.withdrawals)) {
      p.withdrawals.forEach(w => {
        if (w.id === recordId) { w.status = status; changed = true; }
      });
    }
  });
  if (changed) writePlayers(players);
}

app.listen(PORT, () => { console.log(`✅ Server running at http://localhost:${PORT}`); });
