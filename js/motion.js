/* Motion inspired by Casa di Solare: variable-weight letters, rounded clip reveals, expanding orb, line reveals. */
(function () {
  var d = document, $ = function (s) { return d.querySelector(s); }, $$ = function (s) { return [].slice.call(d.querySelectorAll(s)); };
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  $('#year').textContent = new Date().getFullYear();
  var nav = $('.nav');
  function updateNav() { nav.classList.toggle('scrolled', scrollY > 40); }
  addEventListener('scroll', updateNav, { passive: true }); updateNav();

  /* split hero name into letters */
  var chs = [];
  $$('.name .w').forEach(function (w) {
    var t = w.textContent; w.textContent = '';
    t.split('').forEach(function (c) {
      var s = d.createElement('span'); s.className = 'ch'; s.textContent = c; s.style.setProperty('--i', chs.length);
      w.appendChild(s); chs.push(s);
    });
  });
  requestAnimationFrame(function () { setTimeout(function () { d.body.classList.add('ready'); }, 80); });

  /* letters swell toward the pointer (auto-wave on touch) */
  var px = -1e4, py = 0;
  addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; }, { passive: true });
  (function loop(t) {
    if (!rm && scrollY < innerHeight * 1.1) chs.forEach(function (c, i) {
      var w;
      if (fine && px > -1e3) {
        var r = c.getBoundingClientRect();
        w = 900 - Math.min(Math.hypot(px - r.left - r.width / 2, py - r.top - r.height / 2) / .45, 700);
      } else w = 500 + Math.sin(t / 700 + i * .7) * 300;
      c.style.fontVariationSettings = '"wght" ' + Math.round(w) + ',"opsz" 144';
    });
    requestAnimationFrame(loop);
  })(0);

  /* scroll: progress bar, orb grows, hero fades, sections open from rounded clip */
  var bar = $('#bar'), orb = $('#orb'), hero = $('.hero-in'), clips = $$('.clip'), queued = false;
  function sc() {
    queued = false;
    var y = scrollY, vh = innerHeight, max = d.documentElement.scrollHeight - vh, p = Math.min(y / vh, 1.2);
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (!rm) {
      orb.style.transform = 'translate(-50%,-50%) scale(' + (1 + p * 5) + ')';
      var o = Math.max(1 - p * 1.1, 0);
      hero.style.opacity = o; hero.style.transform = 'translateY(' + y * .25 + 'px)'; hero.style.pointerEvents = o < .15 ? 'none' : '';
    }
    clips.forEach(function (s) {
      var q = rm ? 1 : Math.max(0, Math.min(1, (vh - s.getBoundingClientRect().top) / (vh * .55))), e = 1 - q;
      s.style.clipPath = q >= 1 ? 'none' : 'inset(0 ' + e * 40 + 'px round ' + e * 90 + 'px ' + e * 90 + 'px 0 0)';
    });
  }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(sc); } }, { passive: true });
  addEventListener('resize', sc); sc();

  /* reveal + count-up + active nav */
  function io(sel, fn, opt) {
    var els = $$(sel);
    if (!('IntersectionObserver' in window)) return els.forEach(function (e) { fn(e, true); });
    var o = new IntersectionObserver(function (es) { es.forEach(function (en) { fn(en.target, en.isIntersecting, o); }); }, opt);
    els.forEach(function (e) { o.observe(e); });
  }
  io('.rv', function (el, on, o) { if (on) { el.classList.add('in'); o && o.unobserve(el); } }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  io('[data-count]', function (el, on, o) {
    if (!on) return; o && o.unobserve(el);
    var end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '', t0 = performance.now();
    (function step(n) {
      var t = rm ? 1 : Math.min((n - t0) / 1400, 1);
      el.textContent = (end * (1 - Math.pow(1 - t, 3))).toFixed(dec) + suf;
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }, { threshold: .6 });
  io('main section[id]', function (el, on) {
    if (!on) return;
    $$('.links a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + el.id); });
  }, { threshold: .35 });

  /* project cards: accent fill grows from the pointer */
  $$('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* type tester (Solare-style sliders) */
  var tt = $('#tt'), tw = $('#tw'), ts = $('#ts');
  function up() { tt.style.fontVariationSettings = '"wght" ' + tw.value + ',"opsz" 144'; tt.style.fontSize = ts.value + 'px'; }
  tw.oninput = ts.oninput = up; up();

  /* mobile menu */
  var mb = $('#menuBtn'), ln = $('#links');
  mb.onclick = function () { mb.setAttribute('aria-expanded', ln.classList.toggle('open')); };
  $$('.links a').forEach(function (a) { a.addEventListener('click', function () { ln.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') ln.classList.remove('open'); });
})();
