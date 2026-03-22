/**
 * Home hero: smoothed pointer response, parallax layers, logo nudge, scroll reveal.
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

  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  var smx = mx;
  var smy = my;
  var scrollY = 0;
  var rafId = 0;
  var smooth = 0.11;

  function updateSpotlight(clientX, clientY) {
    if (!spotlight || mqReduce.matches) return;
    var x = (clientX / window.innerWidth) * 100;
    var y = (clientY / window.innerHeight) * 100;
    spotlight.style.setProperty('--sx', x + '%');
    spotlight.style.setProperty('--sy', y + '%');
  }

  function nudgeLogo(clientX, clientY) {
    if (!logo || mqReduce.matches) return;
    var dx = (clientX - window.innerWidth / 2) / 56;
    var dy = (clientY - window.innerHeight / 2) / 56;
    logo.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  }

  function applyLayerParallax(clientX, clientY) {
    if (!layers.length || mqReduce.matches) return;
    var nx = clientX / window.innerWidth - 0.5;
    var ny = clientY / window.innerHeight - 0.5;
    var sy = scrollY;
    layers.forEach(function (el) {
      var m = parseFloat(el.getAttribute('data-parallax') || '0.5');
      var tx = nx * 2 * 11 * m + sy * 0.032 * m;
      var ty = ny * 2 * 9 * m + sy * 0.02 * m;
      el.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    });
  }

  function tick() {
    rafId = 0;
    if (mqReduce.matches) return;

    smx += (mx - smx) * smooth;
    smy += (my - smy) * smooth;

    updateSpotlight(smx, smy);
    nudgeLogo(smx, smy);
    applyLayerParallax(smx, smy);

    if (Math.abs(mx - smx) > 0.2 || Math.abs(my - smy) > 0.2) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function scheduleTick() {
    if (mqReduce.matches) return;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  hero.addEventListener(
    'mousemove',
    function (e) {
      mx = e.clientX;
      my = e.clientY;
      scheduleTick();
    },
    { passive: true }
  );

  hero.addEventListener(
    'mouseleave',
    function () {
      mx = window.innerWidth / 2;
      my = window.innerHeight / 2;
      scheduleTick();
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    function () {
      scrollY = window.scrollY || window.pageYOffset || 0;
      scheduleTick();
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
