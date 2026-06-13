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

    /* ── Scroll ── */
    const nb = document.getElementById('navbar');
    const onScroll = () => nb && nb.classList.toggle('scrolled', scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });

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
  });
})();
