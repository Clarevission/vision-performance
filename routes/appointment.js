'use strict';
const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');
const db = require('../lib/db');

const router = express.Router();

const EXAM_TYPES = ['In-Clinic Eye Exam', 'Digital Eye Consultation', 'Occupational Vision Assessment'];
const TIMES = ['Morning (8am–12pm)', 'Afternoon (12pm–4pm)', 'Late Afternoon (4pm–6pm)'];
const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

router.post('/', async (req, res) => {
  const { name, email, phone, exam_type, preferred_date, preferred_time, notes } = req.body;

  if (!name || !email || !exam_type) {
    return res.status(400).json({ error: 'Name, email, and exam type are required.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!EXAM_TYPES.includes(exam_type)) {
    return res.status(400).json({ error: 'Invalid exam type.' });
  }
  if (preferred_time && !TIMES.includes(preferred_time)) {
    return res.status(400).json({ error: 'Invalid preferred time.' });
  }
  if (phone && !PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }
  if (preferred_date) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const chosen = new Date(preferred_date);
    if (!isNaN(chosen) && chosen < today) {
      return res.status(400).json({ error: 'Preferred date cannot be in the past.' });
    }
  }

  const raw = (v, max = 300) => trim(v || '').slice(0, max) || null;
  const rawEmail = trim(email).toLowerCase().slice(0, 254);
  const safe = (v) => v ? escape(v) : null;

  const rawName  = raw(name);
  const rawPhone = raw(phone, 30);
  const rawDate  = raw(preferred_date, 100);
  const rawNotes = raw(notes, 1000);

  try {
    await db.query(
      `INSERT INTO enquiries (type, name, email, phone, exam_type, preferred_date, preferred_time, notes)
       VALUES ('appointment', $1, $2, $3, $4, $5, $6, $7)`,
      [rawName, rawEmail, rawPhone, exam_type, rawDate, preferred_time || null, rawNotes]
    );
  } catch (dbErr) {
    console.error('Appointment DB save error:', dbErr);
  }

  const html = `
    <h2 style="color:#FF6A00;font-family:sans-serif;">New Appointment Request</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#666;width:180px"><strong>Name</strong></td><td style="padding:8px">${safe(rawName)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Email</strong></td><td style="padding:8px"><a href="mailto:${rawEmail}">${rawEmail}</a></td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Phone</strong></td><td style="padding:8px">${safe(rawPhone) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Exam Type</strong></td><td style="padding:8px">${escape(exam_type)}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Preferred Date</strong></td><td style="padding:8px">${safe(rawDate) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Preferred Time</strong></td><td style="padding:8px">${preferred_time ? escape(preferred_time) : '—'}</td></tr>
      <tr><td style="padding:8px;color:#666;vertical-align:top"><strong>Notes</strong></td><td style="padding:8px;white-space:pre-wrap">${safe(rawNotes) || '—'}</td></tr>
    </table>
  `;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformanceinc.ca',
      subject: `[Appointment Request] ${exam_type} — ${rawName}`,
      html,
      text: `Name: ${rawName}\nEmail: ${rawEmail}\nPhone: ${rawPhone || ''}\nExam Type: ${exam_type}\nPreferred Date: ${rawDate || ''}\nPreferred Time: ${preferred_time || ''}\nNotes: ${rawNotes || ''}`,
    });
    await sendMail({
      to: rawEmail,
      subject: 'Appointment Request Received — Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safe(rawName)},</p>
             <p style="font-family:sans-serif">Thank you for requesting a <strong>${escape(exam_type)}</strong> with Vision Performance Inc. Our team will confirm your appointment within 1 business day.</p>
             <p style="font-family:sans-serif">— Vision Performance Team</p>`,
      text: `Hi ${rawName},\n\nThank you for requesting a ${exam_type} with Vision Performance Inc. Our team will confirm your appointment within 1 business day.\n\n— Vision Performance Team`,
    });
    res.json({ message: "Appointment request received! We'll confirm within 1 business day." });
  } catch (err) {
    console.error('Appointment mail error:', err);
    res.status(500).json({ error: 'Failed to submit your request. Please email us at info@visionperformanceinc.ca' });
  }
});

module.exports = router;
