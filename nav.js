/* APEX Robotics Academy — Static Navigation (no auth)
   Pure frontend — no login, no backend, no API calls.
*/
(function () {
  'use strict';

  var NAV = [
    '<nav class="nav" id="navbar">',
      '<div class="nav-inner">',

        '<a class="nav-logo" href="index.html">',
          '<span class="nav-logo-name">APEX ROBOTICS ACADEMY</span>',
          '<span class="nav-logo-tag">Learn \u00b7 Build \u00b7 Innovate</span>',
        '</a>',

        '<ul class="nav-links">',
          '<li><a href="index.html">Home</a></li>',
          '<li><a href="about.html">About</a></li>',
          '<li><a href="curriculum.html">Curriculum</a></li>',
          '<li><a href="projects.html">Projects</a></li>',
          '<li><a href="contact.html">Contact</a></li>',
        '</ul>',

        '<div class="nav-ctas">',
          '<a href="login.html"     class="btn btn-ghost btn-sm">Login</a>',
          '<a href="signup.html"    class="btn btn-primary btn-sm">Sign Up</a>',
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
      '<div class="nav-mobile-ctas">',
        '<a href="login.html"  class="btn btn-ghost btn-full" style="justify-content:center">Login</a>',
        '<a href="signup.html" class="btn btn-primary btn-full" style="justify-content:center">Sign Up</a>',
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
        spans[0].style.transform = open ? 'translateY(5.5px) rotate(45deg)'  : '';
        spans[1].style.opacity   = open ? '0' : '';
        spans[2].style.transform = open ? 'translateY(-5.5px) rotate(-45deg)': '';
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
  });
})();
