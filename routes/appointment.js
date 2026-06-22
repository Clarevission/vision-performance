'use strict';
const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');
const db = require('../lib/db');

const router = express.Router();

const EXAM_TYPES = ['In-Clinic Eye Exam', 'Digital Eye Consultation', 'Occupational Vision Assessment'];
const TIMES = ['Morning (8am–12pm)', 'Afternoon (12pm–4pm)', 'Late Afternoon (4pm–6pm)'];

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

  const safe = (v, max = 300) => escape(trim(v || '')).slice(0, max);
  const safeEmail = trim(email).toLowerCase().slice(0, 254);

  try {
    await db.query(
      `INSERT INTO enquiries (type, name, email, phone, exam_type, preferred_date, preferred_time, notes)
       VALUES ('appointment', $1, $2, $3, $4, $5, $6, $7)`,
      [safe(name), safeEmail, safe(phone) || null, exam_type, safe(preferred_date) || null,
       preferred_time || null, safe(notes, 1000) || null]
    );
  } catch (dbErr) {
    console.error('Appointment DB save error:', dbErr);
  }

  const html = `
    <h2 style="color:#FF6A00;font-family:sans-serif;">New Appointment Request</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#666;width:180px"><strong>Name</strong></td><td style="padding:8px">${safe(name)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Email</strong></td><td style="padding:8px"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Phone</strong></td><td style="padding:8px">${safe(phone) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Exam Type</strong></td><td style="padding:8px">${exam_type}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Preferred Date</strong></td><td style="padding:8px">${safe(preferred_date) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Preferred Time</strong></td><td style="padding:8px">${preferred_time || '—'}</td></tr>
      <tr><td style="padding:8px;color:#666;vertical-align:top"><strong>Notes</strong></td><td style="padding:8px;white-space:pre-wrap">${safe(notes, 1000) || '—'}</td></tr>
    </table>
  `;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformanceinc.ca',
      subject: `[Appointment Request] ${exam_type} — ${safe(name)}`,
      html,
      text: `Name: ${safe(name)}\nEmail: ${safeEmail}\nPhone: ${safe(phone)}\nExam Type: ${exam_type}\nPreferred Date: ${safe(preferred_date)}\nPreferred Time: ${preferred_time}\nNotes: ${safe(notes, 1000)}`,
    });
    await sendMail({
      to: safeEmail,
      subject: 'Appointment Request Received — Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safe(name)},</p>
             <p style="font-family:sans-serif">Thank you for requesting a <strong>${exam_type}</strong> with Vision Performance Inc. Our team will confirm your appointment within 1 business day.</p>
             <p style="font-family:sans-serif">— Vision Performance Team</p>`,
      text: `Hi ${safe(name)},\n\nThank you for requesting a ${exam_type} with Vision Performance Inc. Our team will confirm your appointment within 1 business day.\n\n— Vision Performance Team`,
    });
    res.json({ message: "Appointment request received! We'll confirm within 1 business day." });
  } catch (err) {
    console.error('Appointment mail error:', err);
    res.status(500).json({ error: 'Failed to submit your request. Please email us at info@visionperformanceinc.ca' });
  }
});

module.exports = router;
