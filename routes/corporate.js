'use strict';
const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');
const db = require('../lib/db');

const router = express.Router();

const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

router.post('/', async (req, res) => {
  const { company, contact, email, phone, employees, date, location, notes } = req.body;

  if (!company || !contact || !email || !phone) {
    return res.status(400).json({ error: 'Company name, contact person, email, and phone are required.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }

  const raw = (v, max = 300) => trim(v || '').slice(0, max) || null;
  const rawEmail = trim(email).toLowerCase().slice(0, 254);
  const safe = (v) => v ? escape(v) : null;

  const rawContact   = raw(contact);
  const rawCompany   = raw(company);
  const rawPhone     = raw(phone, 30);
  const rawEmployees = raw(employees, 50);
  const rawDate      = raw(date, 100);
  const rawLocation  = raw(location);
  const rawNotes     = raw(notes, 2000);

  try {
    await db.query(
      `INSERT INTO enquiries (type, name, email, phone, company, employees, preferred_date, location, notes)
       VALUES ('corporate', $1, $2, $3, $4, $5, $6, $7, $8)`,
      [rawContact, rawEmail, rawPhone, rawCompany, rawEmployees, rawDate, rawLocation, rawNotes]
    );
  } catch (dbErr) {
    console.error('Corporate DB save error:', dbErr);
  }

  const html = `
    <h2 style="color:#FF6A00;font-family:sans-serif;">New Corporate Program Request</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#666;width:200px"><strong>Company</strong></td><td style="padding:8px">${safe(rawCompany)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Contact Person</strong></td><td style="padding:8px">${safe(rawContact)}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Email</strong></td><td style="padding:8px"><a href="mailto:${rawEmail}">${rawEmail}</a></td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Phone</strong></td><td style="padding:8px">${safe(rawPhone)}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Employees</strong></td><td style="padding:8px">${safe(rawEmployees) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Preferred Start</strong></td><td style="padding:8px">${safe(rawDate) || '—'}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Worksite Location(s)</strong></td><td style="padding:8px">${safe(rawLocation) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;vertical-align:top"><strong>Notes</strong></td><td style="padding:8px;white-space:pre-wrap">${safe(rawNotes) || '—'}</td></tr>
    </table>
  `;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformanceinc.ca',
      subject: `[Corporate Quote] ${rawCompany} — ${rawEmployees || 'Unknown size'}`,
      html,
      text: `Company: ${rawCompany}\nContact: ${rawContact}\nEmail: ${rawEmail}\nPhone: ${rawPhone}\nEmployees: ${rawEmployees || ''}\nStart Date: ${rawDate || ''}\nLocation: ${rawLocation || ''}\nNotes: ${rawNotes || ''}`,
    });
    await sendMail({
      to: rawEmail,
      subject: 'Corporate Program Request Received — Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safe(rawContact)},</p>
             <p style="font-family:sans-serif">Thank you for your interest in a corporate vision program for <strong>${safe(rawCompany)}</strong>. A Vision Performance representative will be in touch within 1 business day with a customized proposal.</p>
             <p style="font-family:sans-serif">— Vision Performance Team</p>`,
      text: `Hi ${rawContact},\n\nThank you for your interest in a corporate vision program for ${rawCompany}. A Vision Performance representative will be in touch within 1 business day with a customized proposal.\n\n— Vision Performance Team`,
    });
    res.json({ message: "Corporate program request submitted! A representative will be in touch shortly." });
  } catch (err) {
    console.error('Corporate mail error:', err);
    res.status(500).json({ error: 'Failed to submit your request. Please email us at info@visionperformanceinc.ca' });
  }
});

module.exports = router;
