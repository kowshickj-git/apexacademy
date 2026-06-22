/* APEX Robotics Academy — Shared Navigation */
(function () {
  const NAV = `
<nav class="nav" id="navbar">
  <div class="nav-inner">
    <a class="nav-logo" href="index.html">
      <span class="nav-logo-name">APEX ROBOTICS ACADEMY</span>
      <span class="nav-logo-tag">Learn · Build · Innovate</span>
    </a>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="curriculum.html">Curriculum</a></li>
      <li style="position:relative">
        <a href="/lessons/voltage" style="display:inline-flex;align-items:center;gap:.4rem;color:#10B981;font-weight:700;font-size:13.5px;padding:.45rem .9rem;border-radius:999px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.28);letter-spacing:.01em;transition:background .18s,border-color .18s" onmouseover="this.style.background='rgba(16,185,129,.18)';this.style.borderColor='rgba(16,185,129,.45)'" onmouseout="this.style.background='rgba(16,185,129,.1)';this.style.borderColor='rgba(16,185,129,.28)'">
          <span style="font-size:13px">⚡</span>
          Lessons
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style="opacity:.7;transition:transform .2s" class="lessons-chevron">
            <path d="M2.5 4l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <div class="nav-dropdown lessons-dropdown" style="min-width:240px;padding:.5rem">
          <div style="padding:.35rem .65rem .5rem;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:.35rem">
            <p style="font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);font-family:'JetBrains Mono',monospace;font-weight:600">Interactive Lessons</p>
          </div>
          <a href="/lessons/voltage" style="display:flex;align-items:center;gap:.75rem;padding:.6rem .65rem;border-radius:8px;text-decoration:none;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='transparent'">
            <div style="width:32px;height:32px;border-radius:8px;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px">⚡</div>
            <div style="min-width:0">
              <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.15rem">
                <span style="font-size:12.5px;font-weight:600;color:#fff">Voltage Fundamentals</span>
                <span style="font-size:8.5px;font-weight:700;letter-spacing:.08em;padding:.1rem .45rem;border-radius:999px;background:rgba(16,185,129,.15);color:#10B981;border:1px solid rgba(16,185,129,.3)">LIVE</span>
              </div>
              <p style="font-size:11px;color:rgba(255,255,255,.38);font-family:'JetBrains Mono',monospace">L01 · Beginner · 5 min</p>
            </div>
          </a>
          <a href="/lessons/current" style="display:flex;align-items:center;gap:.75rem;padding:.6rem .65rem;border-radius:8px;text-decoration:none;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='transparent'">
            <div style="width:32px;height:32px;border-radius:8px;background:rgba(14,165,233,.12);border:1px solid rgba(14,165,233,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px">⚡</div>
            <div style="min-width:0">
              <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.15rem">
                <span style="font-size:12.5px;font-weight:600;color:#fff">Current Fundamentals</span>
                <span style="font-size:8.5px;font-weight:700;letter-spacing:.08em;padding:.1rem .45rem;border-radius:999px;background:rgba(14,165,233,.15);color:#0EA5E9;border:1px solid rgba(14,165,233,.3)">LIVE</span>
              </div>
              <p style="font-size:11px;color:rgba(255,255,255,.38);font-family:'JetBrains Mono',monospace">L02 · Beginner · 5 min</p>
            </div>
          </a>
          <div style="padding:.35rem .65rem 0;margin-top:.35rem;border-top:1px solid rgba(255,255,255,.06)">
            <p style="font-size:11px;color:rgba(255,255,255,.22)">More lessons coming soon…</p>
          </div>
        </div>
      </li>
      <li><a href="/lab" style="display:inline-flex;align-items:center;gap:.4rem;color:#0EA5E9;font-weight:700;font-size:13.5px;padding:.45rem .9rem;border-radius:999px;background:rgba(14,165,233,.1);border:1px solid rgba(14,165,233,.28);letter-spacing:.01em;transition:background .18s,border-color .18s" onmouseover="this.style.background='rgba(14,165,233,.18)';this.style.borderColor='rgba(14,165,233,.45)'" onmouseout="this.style.background='rgba(14,165,233,.1)';this.style.borderColor='rgba(14,165,233,.28)'"><span style="font-size:13px">🔬</span>Circuit Lab<span style="font-size:8.5px;font-weight:700;letter-spacing:.08em;padding:.1rem .4rem;border-radius:999px;background:rgba(14,165,233,.18);color:#0EA5E9;border:1px solid rgba(14,165,233,.35)">NEW</span></a></li>
      <li><a href="/electronics/playground" style="display:inline-flex;align-items:center;gap:.4rem;color:#10B981;font-weight:700;font-size:13.5px;padding:.45rem .9rem;border-radius:999px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.28);letter-spacing:.01em;transition:background .18s,border-color .18s" onmouseover="this.style.background='rgba(16,185,129,.18)';this.style.borderColor='rgba(16,185,129,.45)'" onmouseout="this.style.background='rgba(16,185,129,.1)';this.style.borderColor='rgba(16,185,129,.28)'"><span style="font-size:13px">🔌</span>Playground<span style="font-size:8.5px;font-weight:700;letter-spacing:.08em;padding:.1rem .4rem;border-radius:999px;background:rgba(16,185,129,.18);color:#10B981;border:1px solid rgba(16,185,129,.35)">NEW</span></a></li>
      <li><a href="projects.html">Projects</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <div class="nav-ctas">
      <a href="book-demo.html" class="btn btn-ghost">Book Demo</a>
      <a href="enroll.html" class="btn btn-primary">Enroll Now</a>
    </div>
    <div class="nav-hamburger" id="nav-burger" aria-label="Menu" role="button" tabindex="0" aria-expanded="false">
      <span></span><span></span><span></span>
    </div>
  </div>
</nav>
<div class="nav-mobile" id="nav-mobile" role="navigation">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="curriculum.html">Curriculum</a>
  <div style="padding:.4rem 1rem .2rem;margin-top:.2rem">
    <p style="font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(16,185,129,.6);font-family:'JetBrains Mono',monospace;font-weight:600">⚡ Interactive Lessons</p>
  </div>
  <a href="/lessons/voltage" style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px">
    <span style="font-size:18px;flex-shrink:0">⚡</span>
    <span>
      <span style="display:block;font-size:14px;font-weight:600;color:#fff">Voltage Fundamentals</span>
      <span style="display:block;font-size:11px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace">L01 · 5 min · <span style="color:#10B981">LIVE</span></span>
    </span>
  </a>
  <a href="/lessons/current" style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px">
    <span style="font-size:18px;flex-shrink:0">⚡</span>
    <span>
      <span style="display:block;font-size:14px;font-weight:600;color:#fff">Current Fundamentals</span>
      <span style="display:block;font-size:11px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace">L02 · 5 min · <span style="color:#0EA5E9">LIVE</span></span>
    </span>
  </a>
  <a href="/lab" style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px">
    <span style="font-size:18px;flex-shrink:0">🔬</span>
    <span>
      <span style="display:block;font-size:14px;font-weight:600;color:#fff">Circuit Lab</span>
      <span style="display:block;font-size:11px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace">Build &amp; simulate · <span style="color:#0EA5E9">NEW</span></span>
    </span>
  </a>
  <a href="/electronics/playground" style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px">
    <span style="font-size:18px;flex-shrink:0">🔌</span>
    <span>
      <span style="display:block;font-size:14px;font-weight:600;color:#fff">Arduino Playground</span>
      <span style="display:block;font-size:11px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace">Code &amp; simulate · <span style="color:#10B981">NEW</span></span>
    </span>
  </a>
  <a href="projects.html">Projects</a>
  <div class="nav-mobile-sep"></div>
  <a href="contact.html">Contact</a>
  <div class="nav-mobile-ctas">
    <a href="book-demo.html" class="btn btn-ghost btn-full" style="justify-content:center">Book Demo</a>
    <a href="enroll.html" class="btn btn-primary btn-full" style="justify-content:center">Enroll Now</a>
  </div>
</div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', NAV);

    /* ── Active state ── */
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a[href], .nav-mobile a[href]').forEach(a => {
      if (a.getAttribute('href') === page) {
        a.classList.add('active');
        a.style.color = 'var(--primary)';
      }
    });

    /* ── Highlight Lessons link when on a lesson page ── */
    if (location.pathname.startsWith('/lessons/')) {
      const lessonsLink = document.querySelector('.nav-links a[href="/lessons/voltage"]');
      if (lessonsLink) {
        lessonsLink.style.opacity = '1';
      }
    }

    /* ── Scroll ── */
    const nb = document.getElementById('navbar');
    const onScroll = () => nb && nb.classList.toggle('scrolled', scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Lessons dropdown: keep open on click (touch-friendly) ── */
    const lessonsLi = document.querySelector('.nav-links li:has(.lessons-dropdown)');
    const lessonsDropdown = document.querySelector('.lessons-dropdown');
    if (lessonsLi && lessonsDropdown) {
      let pinned = false;
      lessonsLi.addEventListener('click', function(e) {
        // If clicking the chevron/label (not a lesson link), toggle pin
        if (!e.target.closest('a[href^="/lessons/"]')) {
          e.preventDefault();
          pinned = !pinned;
          lessonsDropdown.style.display = pinned ? 'block' : '';
        }
      });
      document.addEventListener('click', function(e) {
        if (!lessonsLi.contains(e.target)) {
          pinned = false;
          lessonsDropdown.style.display = '';
        }
      });
    }

    /* ── Mobile toggle ── */
    const burger = document.getElementById('nav-burger');
    const mobile = document.getElementById('nav-mobile');
    const burgerSpans = burger ? burger.querySelectorAll('span') : [];

    function toggleMenu(open) {
      if (!mobile) return;
      mobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger && burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (burgerSpans.length === 3) {
        if (open) {
          burgerSpans[0].style.transform = 'translateY(5.5px) rotate(45deg)';
          burgerSpans[1].style.opacity   = '0';
          burgerSpans[2].style.transform = 'translateY(-5.5px) rotate(-45deg)';
        } else {
          burgerSpans[0].style.transform = '';
          burgerSpans[1].style.opacity   = '';
          burgerSpans[2].style.transform = '';
        }
      }
    }

    if (burger) {
      burger.addEventListener('click', () => toggleMenu(!mobile.classList.contains('open')));
      burger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(!mobile.classList.contains('open')); } });
    }

    /* close on link click */
    mobile && mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

    /* close on backdrop tap */
    mobile && mobile.addEventListener('click', function(e) { if (e.target === mobile) toggleMenu(false); });

    /* swipe-down to close */
    if (mobile) {
      let touchStartY = 0;
      mobile.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
      mobile.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientY - touchStartY;
        if (diff > 60) toggleMenu(false);
      }, { passive: true });
    }

    /* close on Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobile && mobile.classList.contains('open')) toggleMenu(false);
    });

    /* ── Back gesture → home (all non-home static pages) ── */
    const isHome = location.pathname === '/' || location.pathname.endsWith('index.html');
    const isLesson = location.pathname.startsWith('/lessons/');
    if (!isHome && !isLesson) {
      window.history.pushState(null, '');
      window.addEventListener('popstate', function(e) {
        e.stopImmediatePropagation();
        window.location.replace('index.html');
      }, { capture: true });
    }
  });
})();
