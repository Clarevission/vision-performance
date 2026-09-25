/* Vision Performance Inc. — corporate site behaviour (progressive enhancement). */
(function () {
  'use strict';

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- Analytics dispatcher (no third-party script is loaded) ---------- */
  // Events: contact_cta, safetyos_click, mires_click, occupational_vision_enquiry,
  // mobile_clinic_enquiry, enquiry_submitted, resource_request, phone_click, email_click.
  window.vpiTrack = function (event, props) {
    var payload = Object.assign({ event: event, page: location.pathname }, props || {});
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    document.dispatchEvent(new CustomEvent('vpi:track', { detail: payload }));
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el || !el.getAttribute('data-track')) return;
    window.vpiTrack(el.getAttribute('data-track'), { location: el.getAttribute('data-track-location') || '' });
  });

  /* ---------- Legacy hash URLs from the old single-page site ---------- */
  if (location.pathname === '/' && location.hash) {
    var legacy = {
      '#shop': '/solutions/prescription-safety-eyewear/styles', '#mobile': '/mobile-clinics',
      '#industrial': '/solutions/occupational-vision', '#book': '/contact', '#about': '/about',
      '#contact': '/contact', '#learn': '/resources', '#privacy': '/privacy'
    };
    if (legacy[location.hash]) { location.replace(legacy[location.hash]); return; }
  }

  /* ---------- Announcement ---------- */
  var announce = document.querySelector('[data-announce]');
  if (announce) {
    var key = 'vpi-announce-' + announce.getAttribute('data-announce');
    if (store.get(key)) announce.hidden = true;
    var close = announce.querySelector('.announce__close');
    if (close) {
      close.hidden = false;
      close.addEventListener('click', function () { announce.hidden = true; store.set(key, '1'); });
    }
  }

  /* ---------- Desktop dropdowns (disclosure pattern) ---------- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.primary-nav__trigger'));
  function closeMenus(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = true;
    });
  }
  triggers.forEach(function (t) {
    var panel = document.getElementById(t.getAttribute('aria-controls'));
    t.addEventListener('click', function () {
      var open = t.getAttribute('aria-expanded') !== 'true';
      closeMenus(t);
      t.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenus(); t.focus(); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.activeElement && document.activeElement.classList.contains('primary-nav__trigger')) closeMenus();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.primary-nav__item')) closeMenus();
  });
  document.addEventListener('focusin', function (e) {
    if (!e.target.closest('.primary-nav__item')) closeMenus();
  });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-expanded', 'false');
    var label = toggle.querySelector('.menu-toggle__label');
    var icon = toggle.querySelector('use');
    var header = document.querySelector('.site-header');
    var setOpen = function (open) {
      // Start the panel at the header's current bottom edge (the announcement bar may sit above it).
      if (open) mobileNav.style.top = Math.max(0, header.getBoundingClientRect().bottom) + 'px';
      toggle.setAttribute('aria-expanded', String(open));
      mobileNav.hidden = !open;
      document.body.classList.toggle('nav-open', open);
      if (label) label.textContent = open ? 'Close' : 'Menu';
      if (icon) icon.setAttribute('href', open ? '#i-close' : '#i-menu');
      if (open) { var first = mobileNav.querySelector('a, summary'); if (first) first.focus(); }
    };
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === ' ') { e.preventDefault(); toggle.click(); }
    });
    document.addEventListener('keydown', function (e) {
      if (mobileNav.hidden) return;
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); return; }
      if (e.key !== 'Tab') return;
      var f = [toggle].concat(Array.prototype.filter.call(
        mobileNav.querySelectorAll('a, summary, button'), function (el) { return el.offsetParent !== null; }));
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (mq) { if (mq.matches) setOpen(false); });
  }

  /* ---------- Safety eyewear shortlist ---------- */
  var SHORTLIST_KEY = 'vpi-eyewear-shortlist';
  function readShortlist() {
    try { var v = JSON.parse(store.get(SHORTLIST_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function writeShortlist(list) { if (list.length) store.set(SHORTLIST_KEY, JSON.stringify(list)); else store.del(SHORTLIST_KEY); }

  var toggles = document.querySelectorAll('.shortlist-toggle');
  var bar = document.querySelector('[data-shortlist-bar]');
  if (toggles.length) {
    var renderShortlist = function () {
      var list = readShortlist();
      var ids = list.map(function (i) { return i.id; });
      Array.prototype.forEach.call(toggles, function (b) {
        b.setAttribute('aria-pressed', String(ids.indexOf(b.getAttribute('data-shortlist')) !== -1));
      });
      if (!bar) return;
      bar.hidden = !list.length;
      bar.querySelector('[data-shortlist-count]').textContent = list.length + (list.length === 1 ? ' item' : ' items');
      bar.querySelector('[data-shortlist-items]').textContent = list.map(function (i) { return i.label; }).join(' · ');
    };
    Array.prototype.forEach.call(toggles, function (b) {
      b.addEventListener('click', function () {
        var list = readShortlist();
        var id = b.getAttribute('data-shortlist');
        var at = list.findIndex(function (i) { return i.id === id; });
        if (at === -1) list.push({ id: id, label: b.getAttribute('data-label') }); else list.splice(at, 1);
        writeShortlist(list);
        renderShortlist();
      });
    });
    if (bar) {
      bar.querySelector('[data-shortlist-clear]').addEventListener('click', function () { writeShortlist([]); renderShortlist(); });
    }
    renderShortlist();
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.setAttribute('novalidate', '');
    var params = new URLSearchParams(location.search);
    var topic = form.querySelector('[name="topic"]');
    var message = form.querySelector('[name="message"]');
    var requested = params.get('topic');
    if (requested && topic.querySelector('option[value="' + requested.replace(/[^a-z-]/g, '') + '"]')) topic.value = requested;

    // Guide requests from /resources: only known guide ids prefill the message.
    var GUIDES = {
      'safety-eyewear-programs': "Prescription safety eyewear programs: an employer's guide",
      'csa-z94-3-eyewear': 'Choosing safety eyewear with CSA Z94.3 in mind',
      'digital-eye-strain': 'Digital eye strain and visual ergonomics at work',
      'shift-remote-crews': 'Planning eye care for shift-based and remote crews',
      'hse-connected-record': 'Connecting incidents, hazards and corrective actions',
      'clinic-software': 'Choosing practice management software for an eye clinic'
    };
    var guide = params.get('guide');
    if (guide && Object.prototype.hasOwnProperty.call(GUIDES, guide) && !message.value) {
      topic.value = 'resources';
      message.value = 'Please send me "' + GUIDES[guide] + '" when it is published.\n';
    }

    var shortlist = readShortlist();
    if ((requested === 'safety-eyewear' || params.has('shortlist')) && shortlist.length && !message.value) {
      topic.value = 'safety-eyewear';
      message.value = 'We are interested in a prescription safety eyewear program. Styles and lens features we shortlisted:\n' +
        shortlist.map(function (i) { return '- ' + i.label; }).join('\n') +
        '\n\nApproximate number of employees:\nWork environments / hazards:\n';
    }

    var summary = form.querySelector('[data-error-summary]');
    var status = form.querySelector('[data-form-status]');
    var submit = form.querySelector('[type="submit"]');
    var PHONE = /^[\d\s+\-().]{7,20}$/;
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var setError = function (field, msg) {
      var err = document.getElementById(field.id + '-error');
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) {
        err.textContent = msg || '';
        err.hidden = !msg;
        var described = (field.getAttribute('aria-describedby') || '').split(' ').filter(function (d) { return d && d !== err.id; });
        if (msg) described.push(err.id);
        if (described.length) field.setAttribute('aria-describedby', described.join(' ')); else field.removeAttribute('aria-describedby');
      }
    };
    var validate = function () {
      var errors = [];
      var check = function (name, test, msg) {
        var field = form.querySelector('[name="' + name + '"]');
        var ok = test(field.value.trim());
        setError(field, ok ? '' : msg);
        if (!ok) errors.push({ field: field, msg: msg });
      };
      check('name', function (v) { return v.length > 0; }, 'Enter your full name.');
      check('email', function (v) { return EMAIL.test(v); }, 'Enter a valid email address, like name@company.ca.');
      check('phone', function (v) { return !v || PHONE.test(v); }, 'Enter a valid phone number, or leave it blank.');
      check('topic', function (v) { return v.length > 0; }, 'Choose what your message is about.');
      check('message', function (v) { return v.length > 0; }, 'Enter a message.');
      return errors;
    };
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, '');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form__status';
      var errors = validate();
      if (errors.length) {
        var ul = summary.querySelector('ul');
        ul.innerHTML = '';
        errors.forEach(function (er) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + er.field.id;
          a.textContent = er.msg;
          a.addEventListener('click', function (ev) { ev.preventDefault(); er.field.focus(); });
          li.appendChild(a);
          ul.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v); });
      submit.setAttribute('aria-busy', 'true');
      submit.disabled = true;
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; });
      }).then(function (res) {
        if (res.ok) {
          status.className = 'form__status is-success';
          status.textContent = "Thank you. Your message has been sent. We aim to reply by email within one business day.";
          var t = data.topic;
          window.vpiTrack('enquiry_submitted', { topic: t });
          if (t === 'occupational-vision') window.vpiTrack('occupational_vision_enquiry');
          if (t === 'mobile-clinics') window.vpiTrack('mobile_clinic_enquiry');
          if (t === 'resources') window.vpiTrack('resource_request');
          if (t === 'safety-eyewear') writeShortlist([]);
          form.reset();
        } else {
          status.className = 'form__status is-error';
          status.textContent = (res.body && res.body.error) || 'Something went wrong. Please try again, or email info@visionperformanceinc.ca.';
        }
      }).catch(function () {
        status.className = 'form__status is-error';
        status.textContent = 'We could not reach the server. Please check your connection, or email info@visionperformanceinc.ca.';
      }).then(function () {
        submit.removeAttribute('aria-busy');
        submit.disabled = false;
      });
    });
  }
})();
