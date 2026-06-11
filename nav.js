/* APEX Robotics Academy — Auth-aware Navigation */
(function () {
  'use strict';

  var NAV = [
    '<nav class="nav" id="navbar">',
      '<div class="nav-inner">',

        '<a class="nav-logo" href="index.html">',
          '<span class="nav-logo-name">APEX ROBOTICS ACADEMY</span>',
          '<span class="nav-logo-tag">Learn · Build · Innovate</span>',
        '</a>',

        '<ul class="nav-links">',
          '<li><a href="index.html">Home</a></li>',
          '<li><a href="about.html">About</a></li>',
          '<li><a href="curriculum.html">Curriculum</a></li>',
          '<li><a href="projects.html">Projects</a></li>',
          '<li><a href="contact.html">Contact</a></li>',
        '</ul>',

        '<div class="nav-ctas" id="nav-ctas" style="display:flex;align-items:center;gap:.6rem;flex-shrink:0">',
          '<a href="login.html"  class="btn btn-ghost"   style="padding:.45rem 1.1rem;font-size:13.5px;font-weight:500">Login</a>',
          '<a href="signup.html" class="btn btn-primary" style="padding:.45rem 1.1rem;font-size:13.5px;font-weight:500">Sign Up</a>',
        '</div>',

        '<div class="nav-hamburger" id="nav-burger" aria-label="Menu" role="button" tabindex="0" aria-expanded="false">',
          '<span></span><span></span><span></span>',
        '</div>',

      '</div>',
    '</nav>',

    '<div class="nav-mobile" id="nav-mobile" role="navigation">',
      '<a href="index.html">Home</a>',
      '<a href="about.html">About</a>',
      '<a href="curriculum.html">Curriculum</a>',
      '<a href="projects.html">Projects</a>',
      '<a href="contact.html">Contact</a>',
      '<div class="nav-mobile-sep"></div>',
      '<div class="nav-mobile-ctas" id="nav-mobile-ctas" style="display:flex;flex-direction:column;gap:.6rem;padding:0 1.25rem 1.25rem">',
        '<a href="login.html"  class="btn btn-ghost btn-full"   style="justify-content:center;font-size:15px;font-weight:500;padding:.65rem 1rem">Login</a>',
        '<a href="signup.html" class="btn btn-primary btn-full" style="justify-content:center;font-size:15px;font-weight:500;padding:.65rem 1rem">Sign Up</a>',
      '</div>',
    '</div>',
  ].join('');

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertAdjacentHTML('afterbegin', NAV);

    /* Active link highlight */
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (a) {
      if (a.getAttribute('href') === page) {
        a.classList.add('active');
        a.style.color = 'var(--primary)';
      }
    });

    /* Scroll effect */
    var nb = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
      nb && nb.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    /* Hamburger */
    var burger = document.getElementById('nav-burger');
    var mobile = document.getElementById('nav-mobile');
    var spans  = burger ? burger.querySelectorAll('span') : [];

    function toggleMenu(open) {
      if (!mobile) return;
      mobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger && burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (spans.length === 3) {
        spans[0].style.transform = open ? 'translateY(5.5px) rotate(45deg)'   : '';
        spans[1].style.opacity   = open ? '0' : '';
        spans[2].style.transform = open ? 'translateY(-5.5px) rotate(-45deg)' : '';
      }
    }

    burger && burger.addEventListener('click', function () { toggleMenu(!mobile.classList.contains('open')); });
    burger && burger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(!mobile.classList.contains('open')); }
    });
    mobile && mobile.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobile && mobile.classList.contains('open')) toggleMenu(false);
    });

    /* ── Auth state ─────────────────────────────────────── */
    if (typeof apexGetSession === 'function') {
      apexGetSession().then(function (session) {
        if (session) renderLoggedIn(session.user);
      });
    }
    if (typeof onAuthChange === 'function') {
      onAuthChange(function (session) {
        if (session) renderLoggedIn(session.user);
        else renderLoggedOut();
      });
    }
  });

  /* ── Render helpers ─────────────────────────────────── */
  function getDisplayName(user) {
    var meta = user.user_metadata || {};
    if (meta.first_name) return meta.first_name;
    if (meta.name)       return meta.name.split(' ')[0];
    return user.email ? user.email.split('@')[0] : 'User';
  }

  function renderLoggedIn(user) {
    var name     = getDisplayName(user);
    var initials = name.substring(0, 2).toUpperCase();

    var desktopCtas = document.getElementById('nav-ctas');
    if (desktopCtas) {
      desktopCtas.innerHTML =
        '<div style="display:flex;align-items:center;gap:.6rem">' +
          '<div style="display:flex;align-items:center;gap:.5rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-ctrl);padding:.35rem .75rem .35rem .45rem">' +
            '<div style="width:26px;height:26px;border-radius:50%;background:var(--pdim);border:1px solid rgba(16,185,129,.35);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--primary);flex-shrink:0">' + initials + '</div>' +
            '<span style="font-size:13px;font-weight:500;color:var(--text);max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + name + '</span>' +
          '</div>' +
          '<button onclick="apexSignOut()" class="btn btn-ghost" style="padding:.45rem 1rem;font-size:13px;font-weight:500">Logout</button>' +
        '</div>';
    }

    var mobileCtas = document.getElementById('nav-mobile-ctas');
    if (mobileCtas) {
      mobileCtas.innerHTML =
        '<div style="padding:0 1.25rem 1.25rem">' +
          '<p style="font-size:12.5px;color:var(--muted);margin-bottom:.75rem">Signed in as <strong style="color:var(--text)">' + (user.email || name) + '</strong></p>' +
          '<button onclick="apexSignOut()" class="btn btn-ghost btn-full" style="justify-content:center;font-size:15px;font-weight:500;padding:.65rem 1rem;width:100%;cursor:pointer">Logout</button>' +
        '</div>';
    }
  }

  function renderLoggedOut() {
    var desktopCtas = document.getElementById('nav-ctas');
    if (desktopCtas) {
      desktopCtas.innerHTML =
        '<a href="login.html"  class="btn btn-ghost"   style="padding:.45rem 1.1rem;font-size:13.5px;font-weight:500">Login</a>' +
        '<a href="signup.html" class="btn btn-primary" style="padding:.45rem 1.1rem;font-size:13.5px;font-weight:500">Sign Up</a>';
    }
    var mobileCtas = document.getElementById('nav-mobile-ctas');
    if (mobileCtas) {
      mobileCtas.innerHTML =
        '<a href="login.html"  class="btn btn-ghost btn-full"   style="justify-content:center;font-size:15px;font-weight:500;padding:.65rem 1rem">Login</a>' +
        '<a href="signup.html" class="btn btn-primary btn-full" style="justify-content:center;font-size:15px;font-weight:500;padding:.65rem 1rem">Sign Up</a>';
    }
  }

})();
