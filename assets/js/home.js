/**
 * Home hero: pointer parallax (--px/--py), spotlight, logo nudge,
 * canvas node network (edges + soft cursor repulsion). Respects prefers-reduced-motion.
 */
(function () {
  var hero = document.querySelector('.home-hero');
  if (!hero) return;

  var spotlight = document.getElementById('home-spotlight');
  var logo = document.querySelector('.js-parallax-logo');
  var canvas = document.querySelector('.js-home-canvas');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  var smx = mx;
  var smy = my;
  var rafId = 0;
  var smooth = 0.1;
  var ctx;
  var particles;
  var linkDist = 110;
  var linkDistSq = linkDist * linkDist;
  var particleCount = 52;
  var dpr = 1;
  var cw = 0;
  var ch = 0;
  var mouseIn = false;
  var heroRectCache = { left: 0, top: 0 };

  function setHeroPointer(clientX, clientY) {
    if (mqReduce.matches) return;
    var rect = hero.getBoundingClientRect();
    var px = (clientX - rect.left) / Math.max(rect.width, 1);
    var py = (clientY - rect.top) / Math.max(rect.height, 1);
    hero.style.setProperty('--px', Math.max(0, Math.min(1, px)).toFixed(4));
    hero.style.setProperty('--py', Math.max(0, Math.min(1, py)).toFixed(4));
  }

  function updateSpotlight(clientX, clientY) {
    if (!spotlight || mqReduce.matches) return;
    var x = (clientX / window.innerWidth) * 100;
    var y = (clientY / window.innerHeight) * 100;
    spotlight.style.setProperty('--sx', x + '%');
    spotlight.style.setProperty('--sy', y + '%');
  }

  function nudgeLogo(clientX, clientY) {
    if (!logo || mqReduce.matches) return;
    var dx = (clientX - window.innerWidth / 2) / 52;
    var dy = (clientY - window.innerHeight / 2) / 52;
    logo.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  }

  function tick() {
    rafId = 0;
    if (mqReduce.matches) return;

    smx += (mx - smx) * smooth;
    smy += (my - smy) * smooth;

    updateSpotlight(smx, smy);
    nudgeLogo(smx, smy);
    if (mouseIn) setHeroPointer(smx, smy);

    if (Math.abs(mx - smx) > 0.2 || Math.abs(my - smy) > 0.2) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function scheduleTick() {
    if (mqReduce.matches) return;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = hero.getBoundingClientRect();
    heroRectCache = { left: rect.left, top: rect.top };
    cw = Math.floor(rect.width);
    ch = Math.floor(rect.height);
    canvas.width = Math.floor(cw * dpr);
    canvas.height = Math.floor(ch * dpr);
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    if (!particles || particles.length !== particleCount) {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * Math.max(cw, 1),
          y: Math.random() * Math.max(ch, 1),
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
        });
      }
    } else {
      for (var j = 0; j < particles.length; j++) {
        particles[j].x = Math.min(Math.max(particles[j].x, 0), Math.max(cw, 1));
        particles[j].y = Math.min(Math.max(particles[j].y, 0), Math.max(ch, 1));
      }
    }
  }

  function stepParticles() {
    if (!ctx || !particles) return;
    var rect = heroRectCache;
    var mxLocal = smx - rect.left;
    var myLocal = smy - rect.top;
    var repelR = 120;
    var repelR2 = repelR * repelR;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > cw) {
        p.vx *= -1;
        p.x = Math.max(0, Math.min(cw, p.x));
      }
      if (p.y < 0 || p.y > ch) {
        p.vy *= -1;
        p.y = Math.max(0, Math.min(ch, p.y));
      }

      if (mouseIn) {
        var dx = p.x - mxLocal;
        var dy = p.y - myLocal;
        var d2 = dx * dx + dy * dy;
        if (d2 > 0 && d2 < repelR2) {
          var d = Math.sqrt(d2);
          var f = (repelR - d) / repelR * 0.08;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }
      }
    }
  }

  function drawParticles() {
    if (!ctx || !particles) return;
    ctx.clearRect(0, 0, cw, ch);

    ctx.lineWidth = 1;
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i];
        var b = particles[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < linkDistSq) {
          var alpha = (1 - d2 / linkDistSq) * 0.22;
          ctx.strokeStyle = 'rgba(0, 200, 175, ' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = 'rgba(140, 210, 200, 0.35)';
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function canvasLoop() {
    if (mqReduce.matches) return;
    var r = hero.getBoundingClientRect();
    heroRectCache = { left: r.left, top: r.top };
    stepParticles();
    drawParticles();
    requestAnimationFrame(canvasLoop);
  }

  function startCanvas() {
    if (!canvas || mqReduce.matches) return;
    ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    if (window.innerWidth < 720) {
      particleCount = 32;
      linkDist = 95;
      linkDistSq = linkDist * linkDist;
    }
    resizeCanvas();
    window.addEventListener(
      'resize',
      function () {
        resizeCanvas();
      },
      { passive: true }
    );
    requestAnimationFrame(canvasLoop);
  }

  hero.addEventListener(
    'mousemove',
    function (e) {
      mx = e.clientX;
      my = e.clientY;
      mouseIn = true;
      scheduleTick();
    },
    { passive: true }
  );

  hero.addEventListener(
    'mouseenter',
    function () {
      mouseIn = true;
    },
    { passive: true }
  );

  hero.addEventListener(
    'mouseleave',
    function () {
      mouseIn = false;
      mx = window.innerWidth / 2;
      my = window.innerHeight / 2;
      hero.style.setProperty('--px', '0.5');
      hero.style.setProperty('--py', '0.45');
      scheduleTick();
    },
    { passive: true }
  );

  hero.addEventListener(
    'touchmove',
    function (e) {
      if (!e.touches || !e.touches[0]) return;
      mx = e.touches[0].clientX;
      my = e.touches[0].clientY;
      mouseIn = true;
      scheduleTick();
    },
    { passive: true }
  );

  startCanvas();

  if (!mqReduce.matches) {
    hero.style.setProperty('--px', '0.5');
    hero.style.setProperty('--py', '0.45');
  }
})();
