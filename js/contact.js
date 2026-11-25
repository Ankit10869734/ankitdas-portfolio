/* Contact form: calls the EmailJS REST API directly (no SDK/CDN to fail) and shows the real error. */
(function () {
  var C = window.SITE_CONFIG, E = C.emailjs, f = document.getElementById('contactForm');
  if (!f) return;
  var st = document.getElementById('st'), b = document.getElementById('sendBtn'), lb = document.getElementById('sendLbl');
  function say(h, c) { st.className = c || ''; st.innerHTML = h; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mailto(v) {
    return 'mailto:' + C.contactEmail + '?subject=' + encodeURIComponent('Portfolio message from ' + v.name) +
      '&body=' + encodeURIComponent(v.message + '\n\n' + v.name + '\n' + v.email + (v.phone ? '\n' + v.phone : ''));
  }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (id) { return document.getElementById(id).value.trim(); };
    var v = { name: g('fName'), email: g('fEmail'), phone: g('fPhone'), message: g('fMsg') }, errs = [];
    if (v.name.length < 2) errs.push('Please enter your name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errs.push('Please enter a valid email');
    if (v.message.length < 10) errs.push('Message needs at least 10 characters');
    if (errs.length) return say(errs.join('. ') + '.', 'err');
    if (f.elements.company.value) return say('Thanks!', 'ok'); /* honeypot */
    b.disabled = true; lb.textContent = 'Sending…'; say('');
    var p = {
      from_name: v.name, name: v.name, user_name: v.name,
      from_email: v.email, email: v.email, user_email: v.email, reply_to: v.email,
      phone: v.phone, message: v.message, subject: 'Portfolio message from ' + v.name,
      to_name: C.toName, to_email: C.contactEmail, time: new Date().toLocaleString()
    };
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: E.serviceID, template_id: E.templateID, user_id: E.publicKey, template_params: p })
    }).then(function (r) {
      return r.text().then(function (t) { if (!r.ok) throw new Error(r.status + ' ' + t); });
    }).then(function () {
      say('Thanks! Your message is on its way.', 'ok'); f.reset();
    }).catch(function (err) {
      console.error('EmailJS error:', err);
      say('Could not send (' + esc(err.message) + '). <a href="' + mailto(v) + '">Email me directly</a>.', 'err');
    }).then(function () { b.disabled = false; lb.textContent = 'Send message'; });
  });
})();
