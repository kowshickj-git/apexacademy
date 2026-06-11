/* APEX Robotics Academy — Toast Notification System
   ─────────────────────────────────────────────────
   No dependencies. Matches the site's dark design system.
   Usage:
     ApexToast.success('Title', 'Message');
     ApexToast.error('Title', 'Message');
     const t = ApexToast.loading('Sending…');  t.dismiss();
     ApexToast.info('Title', 'Message');
*/
(function () {
  'use strict';

  /* ── Inject styles ──────────────────────────────────────── */
  if (!document.getElementById('apex-toast-css')) {
    var s = document.createElement('style');
    s.id = 'apex-toast-css';
    s.textContent = [
      '#apex-toast-host{',
        'position:fixed;',
        'top:calc(var(--nav-h,68px) + 14px);',
        'left:50%;',
        'transform:translateX(-50%);',
        'z-index:9800;',
        'display:flex;',
        'flex-direction:column;',
        'align-items:center;',
        'gap:8px;',
        'pointer-events:none;',
        'width:420px;',
        'max-width:calc(100vw - 1.5rem);',
      '}',
      '.apex-toast{',
        'pointer-events:all;',
        'width:100%;',
        'background:#18181B;',
        'border-radius:12px;',
        'display:flex;',
        'align-items:flex-start;',
        'gap:10px;',
        'padding:13px 13px 13px 0;',
        'box-shadow:0 8px 32px rgba(0,0,0,.6),0 2px 8px rgba(0,0,0,.35);',
        'animation:apexTIn .3s cubic-bezier(.16,1,.3,1) both;',
        'position:relative;overflow:hidden;',
      '}',
      '.apex-toast.apex-out{animation:apexTOut .22s cubic-bezier(.4,0,1,1) both;}',
      '.apex-t-accent{width:3px;align-self:stretch;border-radius:12px 0 0 12px;flex-shrink:0;}',
      '.apex-t-icon{',
        'width:34px;height:34px;border-radius:8px;',
        'display:flex;align-items:center;justify-content:center;flex-shrink:0;',
      '}',
      '.apex-t-body{flex:1;min-width:0;}',
      '.apex-t-title{',
        'font-family:Inter,-apple-system,sans-serif;',
        'font-size:13.5px;font-weight:600;color:#fff;line-height:1.3;',
      '}',
      '.apex-t-msg{',
        'font-family:Inter,-apple-system,sans-serif;',
        'font-size:12.5px;color:#A1A1AA;line-height:1.4;margin-top:2px;',
      '}',
      '.apex-t-close{',
        'width:26px;height:26px;border-radius:6px;',
        'background:rgba(255,255,255,.06);border:none;',
        'color:#71717A;font-size:16px;line-height:1;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'flex-shrink:0;transition:background .15s,color .15s;margin-right:4px;',
        'font-family:inherit;',
      '}',
      '.apex-t-close:hover{background:rgba(255,255,255,.13);color:#fff;}',
      '.apex-spin{animation:apexSpin 1s linear infinite;}',
      '@keyframes apexTIn{from{opacity:0;transform:translateY(-14px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '@keyframes apexTOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-10px) scale(.96)}}',
      '@keyframes apexSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Container ──────────────────────────────────────────── */
  function host() {
    var h = document.getElementById('apex-toast-host');
    if (!h) {
      h = document.createElement('div');
      h.id = 'apex-toast-host';
      document.body.appendChild(h);
    }
    return h;
  }

  /* ── Type configs ───────────────────────────────────────── */
  var TYPES = {
    success: {
      accent:    '#10B981',
      iconBg:    'rgba(16,185,129,.15)',
      iconColor: '#10B981',
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    },
    error: {
      accent:    '#f87171',
      iconBg:    'rgba(248,113,113,.15)',
      iconColor: '#f87171',
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    },
    loading: {
      accent:    '#0EA5E9',
      iconBg:    'rgba(14,165,233,.15)',
      iconColor: '#0EA5E9',
      icon: '<svg class="apex-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 11-6.22-8.56"/></svg>',
    },
    info: {
      accent:    '#0EA5E9',
      iconBg:    'rgba(14,165,233,.15)',
      iconColor: '#0EA5E9',
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    },
  };

  /* ── Core show ──────────────────────────────────────────── */
  function show(opts) {
    var type     = opts.type     || 'info';
    var title    = opts.title    || '';
    var message  = opts.message  || '';
    var duration = (opts.duration !== undefined) ? opts.duration : 4500;

    var cfg = TYPES[type] || TYPES.info;
    var el  = document.createElement('div');
    el.className = 'apex-toast';
    el.setAttribute('role', 'alert');
    el.style.border = '1px solid ' + cfg.accent + '44';

    var accent = document.createElement('div');
    accent.className = 'apex-t-accent';
    accent.style.background = cfg.accent;

    var icon = document.createElement('div');
    icon.className = 'apex-t-icon';
    icon.style.background  = cfg.iconBg;
    icon.style.color       = cfg.iconColor;
    icon.innerHTML = cfg.icon;

    var body = document.createElement('div');
    body.className = 'apex-t-body';
    if (title) {
      var t = document.createElement('div');
      t.className   = 'apex-t-title';
      t.textContent = title;
      body.appendChild(t);
    }
    if (message) {
      var m = document.createElement('div');
      m.className   = 'apex-t-msg';
      m.textContent = message;
      body.appendChild(m);
    }

    var close = document.createElement('button');
    close.className   = 'apex-t-close';
    close.setAttribute('aria-label', 'Dismiss');
    close.innerHTML   = '&times;';
    close.onclick     = function () { dismiss(el); };

    el.appendChild(accent);
    el.appendChild(icon);
    el.appendChild(body);
    el.appendChild(close);
    host().appendChild(el);

    var timer = null;
    if (duration > 0) timer = setTimeout(function () { dismiss(el); }, duration);

    return {
      dismiss: function () { clearTimeout(timer); dismiss(el); },
      update:  function (newOpts) { clearTimeout(timer); dismiss(el); return show(newOpts); },
    };
  }

  function dismiss(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('apex-out');
    setTimeout(function () { el.parentNode && el.parentNode.removeChild(el); }, 230);
  }

  /* ── Public API ─────────────────────────────────────────── */
  window.ApexToast = {
    show:    show,
    success: function (title, msg, dur) { return show({ type: 'success', title: title, message: msg, duration: dur }); },
    error:   function (title, msg, dur) { return show({ type: 'error',   title: title, message: msg, duration: dur }); },
    loading: function (title, msg)      { return show({ type: 'loading', title: title, message: msg, duration: 0 }); },
    info:    function (title, msg, dur) { return show({ type: 'info',    title: title, message: msg, duration: dur }); },
  };
})();
