// ===================== NEXUS SLOT · 客服 + Safari 拦截 + 提现记录弹窗 =====================
(function(){
    const T = k => (typeof window.__t === 'function') ? window.__t(k) : k;

    // 1. 读取后台配置的飞机链接
    fetch('/api/public-settings')
        .then(res => res.json())
        .then(data => {
            if (data.telegramLink) {
                const floatBtn = document.getElementById('floatingTgBtn');
                if (floatBtn) { floatBtn.href = data.telegramLink; floatBtn.style.display = 'flex'; }
                const modalBtn = document.getElementById('modalContactBtn');
                if (modalBtn) { modalBtn.href = data.telegramLink; modalBtn.style.display = 'inline-block'; }
                // ★ 提现记录弹窗里的客服按钮
                const myRecordsContactBtn = document.getElementById('myRecordsContactBtn');
                if (myRecordsContactBtn) { myRecordsContactBtn.href = data.telegramLink; myRecordsContactBtn.style.display = 'block'; }
            }
        })
        .catch(err => console.warn('加载客服配置失败', err));

    // 2. 复制链接工具
    window.forceCopyLink = function(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try {
            const ok = document.execCommand('copy');
            ok ? alert(T('safari_alert_copied')) : prompt(T('copy_fail_prompt'), text);
        } catch (err) {
            prompt(T('copy_fail_prompt'), text);
        }
        document.body.removeChild(ta);
    };

    // 3. Safari 强制拦截（iOS 非 Safari 无法旋转）
    document.addEventListener('DOMContentLoaded', function() {
        const spinBtn = document.getElementById('spinBtn');
        if (!spinBtn) return;
        spinBtn.addEventListener('click', function(e) {
            const ua = navigator.userAgent;
            const isIOS = /iPhone|iPad|iPod/.test(ua);
            const isNotSafari = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) || (isIOS && !/Safari/.test(ua));
            if (isIOS && isNotSafari) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                const link = window.location.href;
                if (confirm(T('safari_alert_body'))) {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(link)
                            .then(() => alert(T('safari_alert_copied')))
                            .catch(() => window.forceCopyLink(link));
                    } else {
                        window.forceCopyLink(link);
                    }
                }
                return false;
            }
        }, true);
    });

    // 4. 我的提现记录弹窗
    const modal = document.getElementById('myRecordsModal');
    const listBox = document.getElementById('myRecordsList');
    const closeBtn = document.getElementById('myRecordsCloseBtn');
    const viewBtn = document.getElementById('viewMyRecordsBtn');

    if (!modal || !listBox) return;

    function openMR() { modal.classList.add('open'); }
    function closeMR() { modal.classList.remove('open'); }
    function closeConfirm() {
        const c = document.getElementById('confirmModal');
        if (c) c.classList.remove('open');
    }

    async function loadMyRecords(){
        listBox.innerHTML = '<div style="text-align:center;color:rgba(200,210,230,.6);padding:20px 0;font-size:13px;">' + T('loading') + '</div>';
        try {
            const res = await fetch('/api/my-withdrawals');
            const data = await res.json();
            if (!Array.isArray(data) || !data.length) {
                listBox.innerHTML = '<div style="text-align:center;color:rgba(200,210,230,.5);padding:20px 0;font-size:13px;">' + T('no_records') + '</div>';
                return;
            }
            listBox.innerHTML = data.map((r, i) => {
                const st = r.auditStatus || r.status || 'pending';
                const status = st === 'approved' ? T('status_approved') : (st === 'rejected' ? T('status_rejected') : T('status_pending'));
                const statusColor = st === 'approved' ? '#00FFAA' : (st === 'rejected' ? '#ff5a7a' : '#FFD700');
                const time = r.createdAt ? new Date(r.createdAt).toLocaleString(undefined, {hour12:false}) : '—';
                return `
                  <div style="padding:12px;margin-bottom:10px;border-radius:10px;background:rgba(8,10,16,.7);border:1px solid rgba(0,240,255,.2);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                      <span style="font-family:Orbitron,sans-serif;font-size:10px;color:#7AF7FF;letter-spacing:.06em;">#${i+1}</span>
                      <span style="font-family:Orbitron,sans-serif;font-size:10px;color:${statusColor};letter-spacing:.06em;">${status}</span>
                    </div>
                    <div style="font-size:10px;color:rgba(200,210,230,.6);margin-bottom:3px;">${T('label_addr')}</div>
                    <div style="font-family:monospace;font-size:11px;color:#7AF7FF;word-break:break-all;margin-bottom:6px;">${r.address || '—'}</div>
                    <div style="font-size:10px;color:rgba(200,210,230,.6);margin-bottom:3px;">${T('label_amount')}</div>
                    <div style="font-family:Orbitron,sans-serif;font-size:14px;color:#FFD700;font-weight:700;margin-bottom:6px;">+${r.balance || r.amount || '0.00'} USDT</div>
                    <div style="font-size:10px;color:rgba(200,210,230,.6);margin-bottom:3px;">${T('label_time')}</div>
                    <div style="font-family:monospace;font-size:11px;color:#c084fc;">${time}</div>
                  </div>
                `;
            }).join('');
        } catch(e) {
            listBox.innerHTML = '<div style="text-align:center;color:#ff8aa0;padding:20px 0;font-size:13px;">' + T('load_failed') + '</div>';
        }
    }

    // 暴露给 game.js 调用
    window.__reloadMyRecords = loadMyRecords;
    window.__openMyRecords = function(){ loadMyRecords(); openMR(); };

    if (viewBtn) {
        viewBtn.addEventListener('click', () => { closeConfirm(); loadMyRecords(); openMR(); });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeMR);
    if (modal) modal.addEventListener('click', e => { if(e.target === modal) closeMR(); });

    // 顶部余额可点击 → 打开提现记录
    const walletBtn = document.getElementById('walletBtn');
    if (walletBtn) {
        walletBtn.style.cursor = 'pointer';
        walletBtn.addEventListener('click', () => {
            if (typeof window.__openMyRecords === 'function') window.__openMyRecords();
        });
    }
})();
