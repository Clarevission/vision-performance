'use strict';
const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');
const db = require('../lib/db');

const router = express.Router();

const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

router.post('/', async (req, res) => {
  const { org, contact, email, phone, employees, date, address, notes } = req.body;

  if (!org || !contact || !email || !address) {
    return res.status(400).json({ error: 'Organization, contact name, email, and site address are required.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (phone && !PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }

  const raw = (v, max = 300) => trim(v || '').slice(0, max) || null;
  const rawEmail = trim(email).toLowerCase().slice(0, 254);
  const safe = (v) => v ? escape(v) : null;

  const rawContact  = raw(contact);
  const rawOrg      = raw(org);
  const rawPhone    = raw(phone, 30);
  const rawEmployees = raw(employees, 50);
  const rawDate     = raw(date, 100);
  const rawAddress  = raw(address);
  const rawNotes    = raw(notes, 2000);

  try {
    await db.query(
      `INSERT INTO enquiries (type, name, email, phone, org, employees, preferred_date, address, notes)
       VALUES ('mobile', $1, $2, $3, $4, $5, $6, $7, $8)`,
      [rawContact, rawEmail, rawPhone, rawOrg, rawEmployees, rawDate, rawAddress, rawNotes]
    );
  } catch (dbErr) {
    console.error('Mobile DB save error:', dbErr);
  }

  const html = `
    <h2 style="color:#FF6A00;font-family:sans-serif;">New Mobile Clinic Request</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#666;width:180px"><strong>Organization</strong></td><td style="padding:8px">${safe(rawOrg)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Contact Person</strong></td><td style="padding:8px">${safe(rawContact)}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Email</strong></td><td style="padding:8px"><a href="mailto:${rawEmail}">${rawEmail}</a></td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Phone</strong></td><td style="padding:8px">${safe(rawPhone) || '—'}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Employees</strong></td><td style="padding:8px">${safe(rawEmployees) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Preferred Date</strong></td><td style="padding:8px">${safe(rawDate) || '—'}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Site Address</strong></td><td style="padding:8px">${safe(rawAddress)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;vertical-align:top"><strong>Notes</strong></td><td style="padding:8px;white-space:pre-wrap">${safe(rawNotes) || '—'}</td></tr>
    </table>
  `;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformanceinc.ca',
      subject: `[Mobile Clinic Request] ${rawOrg} — ${rawEmployees || 'Unknown size'}`,
      html,
      text: `Organization: ${rawOrg}\nContact: ${rawContact}\nEmail: ${rawEmail}\nPhone: ${rawPhone || ''}\nEmployees: ${rawEmployees || ''}\nDate: ${rawDate || ''}\nAddress: ${rawAddress}\nNotes: ${rawNotes || ''}`,
    });
    await sendMail({
      to: rawEmail,
      subject: 'Mobile Clinic Request Received — Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safe(rawContact)},</p>
             <p style="font-family:sans-serif">Thank you for requesting a mobile clinic visit for <strong>${safe(rawOrg)}</strong>. Our team will contact you within 1 business day to confirm your site visit details.</p>
             <p style="font-family:sans-serif">— Vision Performance Team</p>`,
      text: `Hi ${rawContact},\n\nThank you for requesting a mobile clinic visit for ${rawOrg}. Our team will contact you within 1 business day to confirm your site visit details.\n\n— Vision Performance Team`,
    });
    res.json({ message: "Mobile clinic request submitted! We'll contact you within 1 business day." });
  } catch (err) {
    console.error('Mobile clinic mail error:', err);
    res.status(500).json({ error: 'Failed to submit your request. Please email us at info@visionperformanceinc.ca' });
  }
});

module.exports = router;
