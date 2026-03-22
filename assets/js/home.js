/**
 * Home hero: smoothed pointer response, spotlight follow, logo nudge.
 * Respects prefers-reduced-motion.
 */
(function () {
  var hero = document.querySelector('.home-hero');
  if (!hero) return;

  var spotlight = document.getElementById('home-spotlight');
  var logo = document.querySelector('.js-parallax-logo');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  var smx = mx;
  var smy = my;
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

  function tick() {
    rafId = 0;
    if (mqReduce.matches) return;

    smx += (mx - smx) * smooth;
    smy += (my - smy) * smooth;

    updateSpotlight(smx, smy);
    nudgeLogo(smx, smy);

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
})();
