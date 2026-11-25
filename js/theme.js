/* Dynamic theme + colour: random hue every visit, light/dark follows system, both switchable. */
(function () {
  var r = document.documentElement, mq = matchMedia('(prefers-color-scheme: light)'), store = null;
  try { store = localStorage.getItem('theme'); } catch (e) {}
  function theme(t) {
    r.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name=theme-color]');
    if (m) m.content = t === 'light' ? '#ffffff' : '#0d1117';
  }
  function hue(h) { r.style.setProperty('--h', h); }
  hue(Math.floor(Math.random() * 360));
  theme(store || (mq.matches ? 'light' : 'dark'));
  if (mq.addEventListener) mq.addEventListener('change', function (e) { if (!store) theme(e.matches ? 'light' : 'dark'); });
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('themeBtn').onclick = function () {
      var t = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      store = t; try { localStorage.setItem('theme', t); } catch (e) {}
      theme(t);
    };
    document.getElementById('hueBtn').onclick = function () {
      hue((parseInt(getComputedStyle(r).getPropertyValue('--h'), 10) + 47 + Math.floor(Math.random() * 120)) % 360);
    };
  });
})();
