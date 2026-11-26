/* Contact form. Delivery order:
   1) EmailJS REST API (straight to the inbox)
   2) Netlify Forms (stored in the Netlify dashboard; works with no third-party account)
   3) If both fail, a clear message with a direct mailto link, so a visitor can always reach me. */
(function () {
  var C = window.SITE_CONFIG, E = C.emailjs, f = document.getElementById('contactForm');
  if (!f) return;
  var st = document.getElementById('st'), b = document.getElementById('sendBtn'), lb = document.getElementById('sendLbl');
  function say(h, c) { st.className = c || ''; st.innerHTML = h; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mailto(v) {
    return 'mailto:' + C.contactEmail + '?subject=' + encodeURIComponent('Portfolio enquiry from ' + v.name) +
      '&body=' + encodeURIComponent(v.message + '\n\n' + v.name + '\n' + v.email + (v.phone ? '\n' + v.phone : ''));
  }
  function timed(url, opts, ms) {
    var ctl = 'AbortController' in window ? new AbortController() : null, t;
    if (ctl) { opts.signal = ctl.signal; t = setTimeout(function () { ctl.abort(); }, ms); }
    return fetch(url, opts).then(function (r) { clearTimeout(t); return r; }, function (e) { clearTimeout(t); throw e; });
  }
  function viaEmailJS(v) {
    var p = {
      from_name: v.name, name: v.name, user_name: v.name,
      from_email: v.email, email: v.email, user_email: v.email, reply_to: v.email,
      phone: v.phone, message: v.message, subject: 'Portfolio enquiry from ' + v.name,
      to_name: C.toName, to_email: C.contactEmail, time: new Date().toLocaleString()
    };
    return timed('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: E.serviceID, template_id: E.templateID, user_id: E.publicKey, template_params: p })
    }, 12000).then(function (r) {
      return r.text().then(function (t) { if (!r.ok) throw new Error('EmailJS ' + r.status + ' ' + t); });
    });
  }
  function viaNetlify(v) {
    var body = new URLSearchParams({ 'form-name': 'contact', name: v.name, email: v.email, phone: v.phone, message: v.message }).toString();
    return timed('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body }, 12000).then(function (r) {
      if (!r.ok) throw new Error('Netlify Forms ' + r.status);
    });
  }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (id) { return document.getElementById(id).value.trim(); };
    var v = { name: g('fName'), email: g('fEmail'), phone: g('fPhone'), message: g('fMsg') }, errs = [];
    if (v.name.length < 2) errs.push('Please enter your name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errs.push('Please enter a valid email address');
    if (v.message.length < 10) errs.push('Message must be at least 10 characters');
    if (errs.length) return say(errs.join('. ') + '.', 'err');
    if (f.elements.company.value) return say('Thank you.', 'ok'); /* honeypot */
    b.disabled = true; lb.textContent = 'Sending…'; say('');
    viaEmailJS(v).catch(function (err) {
      console.warn('Primary route failed, trying fallback:', err);
      return viaNetlify(v);
    }).then(function () {
      say('Thank you. Your message has been sent and I will respond shortly.', 'ok'); f.reset();
    }).catch(function (err) {
      console.error('Contact form delivery failed:', err);
      say('Your message could not be delivered automatically. Please email me directly at <a href="' + mailto(v) + '">' + esc(C.contactEmail) + '</a>.', 'err');
    }).then(function () { b.disabled = false; lb.textContent = 'Send message'; });
  });
})();
