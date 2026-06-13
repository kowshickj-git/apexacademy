/**
 * APEX ROBOTICS ACADEMY — Premium Page Transition System
 * Cinematic curtain sweep matching the site's design language.
 * Pure JS/CSS — no dependencies. GPU-accelerated, 60fps.
 */
(function () {
  'use strict';

  /* ── Inject styles ──────────────────────────────────────── */
  var CSS = [
    '#apex-curtain{',
      'position:fixed;inset:0;z-index:9000;pointer-events:none;',
      'transform:translateX(-105%);',
      'will-change:transform;',
      '-webkit-backface-visibility:hidden;backface-visibility:hidden;',
      'overflow:hidden;',
    '}',

    /* Main curtain fill */
    '#apex-curtain-fill{',
      'position:absolute;inset:0;',
      'background:linear-gradient(108deg,',
        '#050507 0%,',
        '#07100d 45%,',
        '#060d10 70%,',
        '#050507 100%',
      ');',
    '}',

    /* Subtle grid overlay */
    '#apex-curtain-grid{',
      'position:absolute;inset:0;',
      'background-image:',
        'linear-gradient(rgba(16,185,129,.035) 1px,transparent 1px),',
        'linear-gradient(90deg,rgba(16,185,129,.035) 1px,transparent 1px);',
      'background-size:56px 56px;',
    '}',

    /* Ambient glow blobs */
    '#apex-curtain-glow{',
      'position:absolute;inset:0;pointer-events:none;',
      'background:',
        'radial-gradient(ellipse 60% 80% at 25% 50%,rgba(16,185,129,.07) 0%,transparent 70%),',
        'radial-gradient(ellipse 50% 60% at 75% 50%,rgba(14,165,233,.05) 0%,transparent 70%);',
    '}',

    /* Leading-edge glow line (right side of curtain) */
    '#apex-curtain-edge{',
      'position:absolute;top:0;right:0;bottom:0;width:3px;',
      'background:linear-gradient(180deg,#0EA5E9 0%,#10B981 50%,#0EA5E9 100%);',
      'box-shadow:',
        '0 0 12px 6px rgba(16,185,129,.65),',
        '0 0 40px 16px rgba(14,165,233,.35),',
        '0 0 80px 32px rgba(16,185,129,.2);',
    '}',

    /* Brand mark shown mid-transition */
    '#apex-curtain-brand{',
      'position:absolute;bottom:1.75rem;left:50%;transform:translateX(-50%);',
      'text-align:center;opacity:0;transition:opacity .25s ease;',
      'white-space:nowrap;',
    '}',
    '#apex-curtain.apex-visible #apex-curtain-brand{opacity:1}',
    '#apex-curtain-brand-name{',
      'font-family:"Inter",-apple-system,sans-serif;',
      'font-size:10px;font-weight:700;letter-spacing:.22em;',
      'color:rgba(255,255,255,.35);text-transform:uppercase;',
    '}',
    '#apex-curtain-bar{',
      'width:32px;height:1.5px;margin:.45rem auto 0;border-radius:2px;',
      'background:linear-gradient(90deg,#10B981,#0EA5E9);',
    '}',

    /* Page body exit */
    'body.apex-page-exit{',
      'animation:apex-exit-anim .22s cubic-bezier(.4,0,1,1) forwards;',
    '}',
    '@keyframes apex-exit-anim{',
      'from{opacity:1;transform:scale(1)}',
      'to{opacity:.88;transform:scale(.987)}',
    '}',
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.id = 'apex-transition-styles';
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ── Build curtain DOM ──────────────────────────────────── */
  var curtain = document.createElement('div');
  curtain.id = 'apex-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = [
    '<div id="apex-curtain-fill"></div>',
    '<div id="apex-curtain-grid"></div>',
    '<div id="apex-curtain-glow"></div>',
    '<div id="apex-curtain-edge"></div>',
    '<div id="apex-curtain-brand">',
      '<div id="apex-curtain-brand-name">APEX ROBOTICS ACADEMY</div>',
      '<div id="apex-curtain-bar"></div>',
    '</div>',
  ].join('');
  document.body.appendChild(curtain);

  /* ── Easing curves ──────────────────────────────────────── */
  var EASE_IN  = 'cubic-bezier(0.76,0,0.24,1)';
  var EASE_OUT = 'cubic-bezier(0.16,1,0.3,1)';

  /* ── Helper: set curtain transform instantly ────────────── */
  function setCurtainInstant(tx) {
    curtain.style.transition = 'none';
    curtain.style.transform  = 'translateX(' + tx + '%)';
  }

  /* ── ENTER: curtain sweeps right, revealing new page ─────── */
  function playEnter() {
    setCurtainInstant(0);
    curtain.classList.add('apex-visible');

    // Double rAF ensures browser paints before animating
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.style.transition = 'transform .52s ' + EASE_OUT;
        curtain.style.transform  = 'translateX(105%)';

        // Hide brand before edge leaves
        setTimeout(function () {
          curtain.classList.remove('apex-visible');
        }, 160);

        // Reset curtain off-screen after done
        setTimeout(function () {
          curtain.style.transition = 'none';
          curtain.style.transform  = 'translateX(-105%)';
        }, 620);

        // Stagger page content in
        setTimeout(staggerReveal, 80);
      });
    });
  }

  /* ── EXIT: curtain sweeps in from left, then navigate ────── */
  function playExit(href) {
    if (document.body.classList.contains('apex-transitioning')) return;
    document.body.classList.add('apex-transitioning');

    // Slight body scale-down
    document.body.classList.add('apex-page-exit');

    // Curtain starts off left
    setCurtainInstant(-105);
    curtain.classList.add('apex-visible');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.style.transition = 'transform .4s ' + EASE_IN;
        curtain.style.transform  = 'translateX(0%)';
      });
    });

    // Navigate once curtain fully covers screen
    setTimeout(function () {
      try { sessionStorage.setItem('apex-tr', '1'); } catch (e) {}
      window.location.href = href;
    }, 380);
  }

  /* ── STAGGER reveal for new page content ────────────────── */
  function staggerReveal() {
    // Only animate elements that DON'T already have their own animations
    var SELECTORS = [
      '.section-header>*',
      '.stat-item',
      '.card:not(.anim-fade-up)',
      '.level-card',
    ];

    var delay  = 0;
    var seen   = new WeakSet ? new WeakSet() : { has: function(){return false;}, add: function(){} };
    var H      = window.innerHeight;

    SELECTORS.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(function (el) {
          if (seen.has(el)) return;
          // Skip elements that already have CSS entrance animations
          if (el.classList.contains('anim-fade-up')) return;
          // Only first screenful
          var rect = el.getBoundingClientRect();
          if (rect.top > H * 1.15 || rect.bottom < -100) return;
          seen.add(el);

          el.style.opacity   = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = [
            'opacity .5s cubic-bezier(0.22,1,0.36,1) ' + delay + 'ms',
            'transform .5s cubic-bezier(0.22,1,0.36,1) ' + delay + 'ms',
          ].join(',');

          // Trigger in next frame
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              el.style.opacity   = '1';
              el.style.transform = 'translateY(0)';
            });
          });

          // Clean up inline styles after animation completes
          (function (element, d) {
            setTimeout(function () {
              element.style.opacity   = '';
              element.style.transform = '';
              element.style.transition = '';
            }, d + 650);
          }(el, delay));

          delay = Math.min(delay + 32, 300);
        });
      } catch (e) {}
    });
  }

  /* ── Link interception ──────────────────────────────────── */
  function isTransitionable(href) {
    if (!href) return false;
    if (href.charAt(0) === '#') return false;
    if (/^(mailto|tel|javascript):/.test(href)) return false;
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (url.pathname === window.location.pathname && url.hash) return false;
      return true;
    } catch (e) { return false; }
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) {
      // Fallback for older browsers
      var node = e.target;
      while (node && node.tagName !== 'A') node = node.parentNode;
      if (node && node.href) a = node;
    }
    if (!a) return;
    if (a.target === '_blank' || a.getAttribute('target') === '_blank') return;
    var href = a.getAttribute('href');
    if (!isTransitionable(href)) return;
    e.preventDefault();
    playExit(href);
  }, true);

  /* ── Init on page load ──────────────────────────────────── */
  var fromTransition = false;
  try { fromTransition = sessionStorage.getItem('apex-tr') === '1'; sessionStorage.removeItem('apex-tr'); } catch (e) {}

  if (fromTransition) {
    // Curtain already covers — play enter when DOM ready
    setCurtainInstant(0);
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(playEnter, 40);
    });
    if (document.readyState !== 'loading') {
      setTimeout(playEnter, 40);
    }
  } else {
    // First visit — no body fade needed
  }

})();
