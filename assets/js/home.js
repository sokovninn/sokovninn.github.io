/**
 * Home hero: parallax SVG layers, spotlight, logo nudge, scroll reveal.
 * Respects prefers-reduced-motion.
 */
(function () {
  var hero = document.querySelector('.home-hero');
  if (!hero) return;

  var spotlight = document.getElementById('home-spotlight');
  var logo = document.querySelector('.js-parallax-logo');
  var layers = document.querySelectorAll('.js-parallax-layer');
  var panel = document.querySelector('.home-panel');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var mx = typeof window.innerWidth === 'number' ? window.innerWidth / 2 : 0;
  var my = typeof window.innerHeight === 'number' ? window.innerHeight / 2 : 0;
  var scrollY = 0;
  var raf = 0;

  function moveSpotlight(clientX, clientY) {
    if (!spotlight || mqReduce.matches) return;
    var x = (clientX / window.innerWidth) * 100;
    var y = (clientY / window.innerHeight) * 100;
    spotlight.style.setProperty('--sx', x + '%');
    spotlight.style.setProperty('--sy', y + '%');
  }

  function nudgeLogo(clientX, clientY) {
    if (!logo || mqReduce.matches) return;
    var dx = (clientX - window.innerWidth / 2) / 50;
    var dy = (clientY - window.innerHeight / 2) / 50;
    logo.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  }

  function applyLayerParallax() {
    if (!layers.length || mqReduce.matches) return;
    var nx = mx / window.innerWidth - 0.5;
    var ny = my / window.innerHeight - 0.5;
    var sy = scrollY;
    layers.forEach(function (el) {
      var m = parseFloat(el.getAttribute('data-parallax') || '0.5');
      var tx = nx * 2 * 20 * m + sy * 0.045 * m;
      var ty = ny * 2 * 14 * m + sy * 0.028 * m;
      el.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    });
  }

  function scheduleParallax() {
    if (mqReduce.matches) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      raf = 0;
      applyLayerParallax();
    });
  }

  hero.addEventListener(
    'mousemove',
    function (e) {
      mx = e.clientX;
      my = e.clientY;
      moveSpotlight(mx, my);
      nudgeLogo(mx, my);
      scheduleParallax();
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    function () {
      scrollY = window.scrollY || window.pageYOffset || 0;
      scheduleParallax();
    },
    { passive: true }
  );

  if (panel && 'IntersectionObserver' in window && !mqReduce.matches) {
    panel.classList.add('home-panel--observe');
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(panel);
  } else if (panel) {
    panel.classList.add('is-visible');
  }
})();
