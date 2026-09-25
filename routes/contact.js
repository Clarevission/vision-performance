'use strict';
const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');
const db = require('../lib/db');

const router = express.Router();

// Enquiry categories offered by the corporate contact form (value → label).
const TOPICS = {
  'occupational-vision': 'Occupational vision program',
  'mobile-clinics': 'Mobile vision clinics (planned)',
  'safety-eyewear': 'Prescription safety eyewear program',
  'visual-ergonomics': 'Visual ergonomics & digital eye strain',
  'workplace-eye-health': 'Workplace eye-health education',
  safetyos: 'VPI SafetyOS',
  mires: 'VPI Mires',
  partnership: 'Partnership or investment',
  resources: 'Resources & guides',
  careers: 'Careers',
  media: 'Media',
  general: 'General enquiry',
};
const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

// Native (no-JavaScript) form posts get an HTML response; fetch() callers get JSON.
const wantsHtml = req => Boolean(req.is('application/x-www-form-urlencoded')) && req.accepts(['json', 'html']) === 'html';

function fail(req, res, status, error) {
  if (wantsHtml(req)) {
    return res.status(status).type('html').send(
      `<!DOCTYPE html><html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<meta name="robots" content="noindex"><title>Message not sent | Vision Performance Inc.</title></head>` +
      `<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.6">` +
      `<h1>Your message was not sent</h1><p>${escape(error)}</p><p><a href="/contact">Return to the contact form</a></p></body></html>`);
  }
  return res.status(status).json({ error });
}

router.post('/', async (req, res) => {
  const body = req.body || {};
  const { name, email, message } = body;

  // Honeypot: bots fill hidden fields. Pretend success and store nothing.
  if (body.website) {
    return wantsHtml(req) ? res.redirect(303, '/contact/thank-you') : res.json({ message: 'Message sent.' });
  }

  if (!name || !email || !message) return fail(req, res, 400, 'Name, email, and message are required.');
  if (!isEmail(String(email))) return fail(req, res, 400, 'Please enter a valid email address.');

  // Accept the new `topic` field; fall back to the legacy free-text `subject`.
  let subjectLabel;
  if (body.topic !== undefined) {
    if (!TOPICS[body.topic]) return fail(req, res, 400, 'Please choose what your message is about.');
    subjectLabel = TOPICS[body.topic];
  } else {
    subjectLabel = trim(String(body.subject || 'General Enquiry')).slice(0, 200);
  }
  const phone = trim(String(body.phone || ''));
  if (phone && !PHONE_RE.test(phone)) return fail(req, res, 400, 'Please enter a valid phone number, or leave it blank.');

  // Raw values for DB storage (trim + length only)
  const rawName    = trim(String(name)).slice(0, 120);
  const rawCompany = trim(String(body.organization || body.company || '')).slice(0, 120) || null;
  const rawRole    = trim(String(body.role || '')).slice(0, 120) || null;
  const rawMessage = trim(String(message)).slice(0, 4000);
  const rawEmail   = trim(String(email)).toLowerCase().slice(0, 254);
  const rawPhone   = phone.slice(0, 50) || null;

  // HTML-escaped values for email templates
  const safe = v => (v ? escape(v) : '—');

  try {
    await db.query(
      `INSERT INTO enquiries (type, name, email, phone, company, subject, message, notes)
       VALUES ('contact', $1, $2, $3, $4, $5, $6, $7)`,
      [rawName, rawEmail, rawPhone, rawCompany, subjectLabel, rawMessage, rawRole ? `Role: ${rawRole}` : null]
    );
  } catch (dbErr) {
    console.error('Contact DB save error:', dbErr.message);
  }

  const row = (label, value, shade) =>
    `<tr${shade ? ' style="background:#f9f9f9"' : ''}><td style="padding:8px;color:#666;width:160px;vertical-align:top"><strong>${label}</strong></td>` +
    `<td style="padding:8px;white-space:pre-wrap">${value}</td></tr>`;
  const html = `
    <h2 style="color:#0A1F44;font-family:sans-serif;">New enquiry: ${safe(subjectLabel)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      ${row('Name', safe(rawName))}
      ${row('Organization', safe(rawCompany), true)}
      ${row('Role', safe(rawRole))}
      ${row('Email', `<a href="mailto:${escape(rawEmail)}">${escape(rawEmail)}</a>`, true)}
      ${row('Phone', safe(rawPhone))}
      ${row('Topic', safe(subjectLabel), true)}
      ${row('Message', safe(rawMessage))}
    </table>`;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformanceinc.ca',
      subject: `[Enquiry] ${subjectLabel} — ${rawName}`,
      html,
      text: `Name: ${rawName}\nOrganization: ${rawCompany || ''}\nRole: ${rawRole || ''}\nEmail: ${rawEmail}\nPhone: ${rawPhone || ''}\nTopic: ${subjectLabel}\n\n${rawMessage}`,
    });
    await sendMail({
      to: rawEmail,
      subject: 'We received your message — Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safe(rawName)},</p>
             <p style="font-family:sans-serif">Thanks for contacting Vision Performance Inc. about "${safe(subjectLabel)}". We aim to reply within one business day.</p>
             <p style="font-family:sans-serif">— Vision Performance Inc.</p>`,
      text: `Hi ${rawName},\n\nThanks for contacting Vision Performance Inc. about "${subjectLabel}". We aim to reply within one business day.\n\n— Vision Performance Inc.`,
    });
  } catch (err) {
    console.error('Contact mail error:', err.message);
    return fail(req, res, 500, 'We could not send your message. Please email us directly at info@visionperformanceinc.ca.');
  }

  if (wantsHtml(req)) return res.redirect(303, '/contact/thank-you');
  res.json({ message: 'Message sent.' });
});

module.exports = router;
module.exports.TOPICS = TOPICS;
