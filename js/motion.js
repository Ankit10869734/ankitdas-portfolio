/* Scroll-driven intro (GSAP ScrollTrigger scrubs one timeline, so it plays forward and in reverse),
   Lenis smooth scrolling, and the section reveals. Falls back to a static hero if GSAP is unavailable
   or the visitor prefers reduced motion. */
(function () {
  var d = document, root = d.documentElement;
  var $ = function (s) { return d.querySelector(s); }, $$ = function (s) { return [].slice.call(d.querySelectorAll(s)); };
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var animated = hasGsap && !rm;
  if (!animated) root.classList.add('static');
  $('#year').textContent = new Date().getFullYear();

  /* photo: fall back to a monogram card if the image file is missing */
  var ph = $('.ph'), im = $('.ph img');
  function nophoto() { ph.classList.add('no'); }
  im.addEventListener('error', nophoto);
  if (im.complete && !im.naturalWidth) nophoto();

  /* split the name into letters for the reveal and the variable-weight hover */
  var chs = [];
  $$('.name .w').forEach(function (w) {
    var t = w.textContent; w.textContent = '';
    t.split('').forEach(function (c) {
      var s = d.createElement('span'); s.className = 'ch'; s.textContent = c;
      w.appendChild(s); chs.push(s);
    });
  });
  requestAnimationFrame(function () { d.body.classList.add('ready'); });

  var intro = $('#home'), stage = $('.stage'), txt = $('.hero-txt'), cue = $('#cue'), bar = $('#bar');
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function run() { return Math.max(intro.offsetHeight - stage.clientHeight, 1); }

  /* ---------- smooth scrolling ---------- */
  var lenis = null;
  if (animated && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(y) {
    if (lenis) lenis.scrollTo(y, { duration: 1.7, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else scrollTo({ top: y, behavior: rm ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1), el = id && d.getElementById(id);
      if (!id || id === 'home') { e.preventDefault(); goTo(0); return; }
      if (el) { e.preventDefault(); goTo(el.getBoundingClientRect().top + scrollY - 64); }
    });
  });
  var enterY = function () { return run() * 0.8; };   /* scroll position where photo and text are both visible */
  cue.addEventListener('click', function () { goTo(enterY()); });

  /* ---------- intro timeline ---------- */
  var gate = $('#gate'), portal = $('#portal'), gt = $('#gateT'), gb = $('#gateB'), cnt = $('#cnt'), tp = { p: 0 };
  var P = { a: 0, b: 0, w: 0, c: 0 }, maxR = 0, prog = 0;
  function sizeMax() { maxR = Math.hypot(innerWidth, innerHeight) / 2 + 12; }
  function draw() {
    var r = P.b > 0 ? lerp(150, maxR, P.b) : lerp(70, 150, P.a);
    gate.style.setProperty('--r', r + 'px');
    portal.style.width = portal.style.height = (2 * r + 4) + 'px';
    var done = P.b > 0.995;
    gate.style.visibility = portal.style.visibility = done ? 'hidden' : 'visible';
  }
  function weight() { gt.style.fontVariationSettings = '"wght" ' + Math.round(100 + 800 * P.w) + ',"opsz" 144'; }
  function count() { cnt.textContent = String(Math.round(P.c)).padStart(3, '0'); }

  if (animated) {
    sizeMax(); draw(); weight(); count();
    /* explicit start states: staggered fromTo only hides the first target reliably */
    gsap.set(chs, { yPercent: 75, rotation: 8, opacity: 0 });
    gsap.set('.m>span', { yPercent: 105 });
    gsap.set(['.pill', '.lead', '.cta'], { y: 30, opacity: 0 });
    ScrollTrigger.addEventListener('refresh', sizeMax);
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: intro, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: function (self) {
          prog = self.progress;
          txt.style.pointerEvents = prog > 0.62 ? '' : 'none';
          cue.style.pointerEvents = prog > 0.1 ? 'none' : '';
        }
      }
    });
    /* A: ring opens, title gains weight */
    tl.to(P, { a: 1, duration: 0.22, ease: 'power2.out', onUpdate: draw }, 0)
      .to(P, { w: 1, duration: 0.3, onUpdate: weight }, 0)
      .to(P, { c: 100, duration: 0.58, onUpdate: count }, 0)
      .to(cue, { opacity: 0, y: 14, duration: 0.07 }, 0)
      /* B: portal opens over the home scene */
      .to(P, { b: 1, duration: 0.36, ease: 'power2.in', onUpdate: draw }, 0.22)
      .to(gt, { scale: 2.6, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.26)
      .to(gb, { opacity: 0, duration: 0.1 }, 0.22)
      .fromTo('.home', { scale: 1.35 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0.2)
      /* photo flies in with perspective */
      .fromTo(ph, { opacity: 0, x: 180, scale: 0.78, rotationY: -80, rotationX: 8, rotationZ: 4, transformPerspective: 1400 },
        { opacity: 1, x: 0, scale: 1, rotationY: -22, rotationX: 8, rotationZ: 4, duration: 0.34, ease: 'power3.out' }, 0.4)
      /* C: text arrives above the photo */
      .fromTo('.pill', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.54)
      .fromTo(chs, { yPercent: 75, rotation: 8, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 0.12, stagger: 0.008, ease: 'power3.out' }, 0.56)
      .fromTo('.m>span', { yPercent: 105 }, { yPercent: 0, duration: 0.1, stagger: 0.025, ease: 'power3.out' }, 0.64)
      .fromTo('.lead,.cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.1, stagger: 0.03, ease: 'power2.out' }, 0.7)
      /* D (0.74 to 0.86): hold, photo and text both visible. E: photo fades away so the text reads cleanly */
      .to(ph, { opacity: 0, y: -70, scale: 0.92, rotationY: -34, duration: 0.14, ease: 'power1.in' }, 0.86);

    /* keyboard users: focusing a hero control jumps to the finished scene */
    txt.addEventListener('focusin', function () { if (prog < 0.7) goTo(enterY()); });
  }

  /* ---------- letters swell toward the pointer (desktop) ---------- */
  var px = -1e4, py = 0;
  if (fine && !rm) {
    addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; }, { passive: true });
    (function loop() {
      var s = scrollY, r = run();
      if (!animated || (s > r * 0.5 && s < r * 1.6)) chs.forEach(function (c) {
        var b = c.getBoundingClientRect(), w = px > -1e3 ? 900 - Math.min(Math.hypot(px - b.left - b.width / 2, py - b.top - b.height / 2) / .45, 650) : 450;
        c.style.fontVariationSettings = '"wght" ' + Math.round(w) + ',"opsz" 144';
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- sections: rounded-clip open and fold-out reveal (reversible) ---------- */
  var clips = $$('.clip'), pops = $$('.rv'), queued = false;
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function measure() {
    pops.forEach(function (el) { el.style.transform = ''; el.style.opacity = ''; });
    pops.forEach(function (el) { el._top = el.getBoundingClientRect().top + scrollY; el._h = el.offsetHeight; });
  }
  function sc() {
    queued = false;
    var y = scrollY, vh = innerHeight, max = d.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    clips.forEach(function (c) {
      var q = rm ? 1 : clamp((vh - c.getBoundingClientRect().top) / (vh * .55)), e = 1 - ease(q);
      c.style.clipPath = q >= 1 ? 'none' : 'inset(0 ' + e * 40 + 'px round ' + e * 90 + 'px ' + e * 90 + 'px 0 0)';
    });
    pops.forEach(function (el) {
      if (rm) return;
      var top = el._top - y, en = clamp((vh - top) / (vh * .55)), ex = clamp((top + el._h) / (vh * .3)), q = Math.min(en, ex);
      if (q >= 1) { el.style.transform = ''; el.style.opacity = ''; el.classList.add('in'); return; }
      var a = en < 1 ? -(1 - en) : (1 - ex);
      el.style.transformOrigin = a < 0 ? '50% 100%' : '50% 0%';
      el.style.transform = 'perspective(1100px) rotateX(' + a * 70 + 'deg) translateY(' + Math.abs(a) * 50 + 'px) scale(' + (1 - Math.abs(a) * .08) + ')';
      el.style.opacity = q;
      el.classList.toggle('in', q > .6);
    });
  }
  function refresh() { measure(); sc(); }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(sc); } }, { passive: true });
  addEventListener('resize', refresh); addEventListener('load', function () { if (animated) ScrollTrigger.refresh(); refresh(); });
  if (animated) ScrollTrigger.addEventListener('refresh', refresh);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (animated) ScrollTrigger.refresh(); refresh(); });
  refresh();

  /* active nav link */
  if ('IntersectionObserver' in window) {
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) $$('.links a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); }); });
    }, { threshold: .35 });
    $$('main section[id]').forEach(function (e) { o.observe(e); });
  }

  /* type tester */
  var tt = $('#tt'), tw = $('#tw'), ts = $('#ts');
  function up() { tt.style.fontVariationSettings = '"wght" ' + tw.value + ',"opsz" 144'; tt.style.fontSize = ts.value + 'px'; }
  tw.oninput = ts.oninput = up; up();

  /* mobile menu */
  var mb = $('#menuBtn'), ln = $('#links');
  mb.onclick = function () { mb.setAttribute('aria-expanded', ln.classList.toggle('open')); };
  $$('.links a').forEach(function (a) { a.addEventListener('click', function () { ln.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { ln.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
})();
