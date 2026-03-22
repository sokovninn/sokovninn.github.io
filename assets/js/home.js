/**
 * Home hero: spotlight, subtle logo parallax, scroll reveal.
 * Respects prefers-reduced-motion.
 */
(function () {
  var hero = document.querySelector('.home-hero');
  if (!hero) return;

  var spotlight = document.getElementById('home-spotlight');
  var logo = document.querySelector('.js-parallax-logo');
  var panel = document.querySelector('.home-panel');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

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

  hero.addEventListener(
    'mousemove',
    function (e) {
      moveSpotlight(e.clientX, e.clientY);
      nudgeLogo(e.clientX, e.clientY);
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
