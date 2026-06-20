const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');

const router = express.Router();

router.post('/', async (req, res) => {
  const { company, contact, email, phone, employees, date, location, notes } = req.body;

  if (!company || !contact || !email || !phone) {
    return res.status(400).json({ error: 'Company name, contact person, email, and phone are required.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const safe = (v, max = 300) => escape(trim(v || '')).slice(0, max);
  const safeEmail = trim(email).toLowerCase().slice(0, 254);

  const html = `
    <h2 style="color:#FF6A00;font-family:sans-serif;">New Corporate Program Request</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#666;width:200px"><strong>Company</strong></td><td style="padding:8px">${safe(company)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Contact Person</strong></td><td style="padding:8px">${safe(contact)}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Email</strong></td><td style="padding:8px"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Phone</strong></td><td style="padding:8px">${safe(phone)}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Employees</strong></td><td style="padding:8px">${safe(employees) || 'â€”'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Preferred Start</strong></td><td style="padding:8px">${safe(date) || 'â€”'}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Worksite Location(s)</strong></td><td style="padding:8px">${safe(location) || 'â€”'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;vertical-align:top"><strong>Notes</strong></td><td style="padding:8px;white-space:pre-wrap">${safe(notes, 2000) || 'â€”'}</td></tr>
    </table>
  `;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformanceinc.ca',
      subject: `[Corporate Quote] ${safe(company)} â€” ${safe(employees) || 'Unknown size'}`,
      html,
      text: `Company: ${safe(company)}\nContact: ${safe(contact)}\nEmail: ${safeEmail}\nPhone: ${safe(phone)}\nEmployees: ${safe(employees)}\nStart Date: ${safe(date)}\nLocation: ${safe(location)}\nNotes: ${safe(notes, 2000)}`,
    });

    await sendMail({
      to: safeEmail,
      subject: 'Corporate Program Request Received â€” Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safe(contact)},</p>
             <p style="font-family:sans-serif">Thank you for your interest in a corporate vision program for <strong>${safe(company)}</strong>. A Vision Performance representative will be in touch within 1 business day with a customized proposal.</p>
             <p style="font-family:sans-serif">â€” Vision Performance Team</p>`,
      text: `Hi ${safe(contact)},\n\nThank you for your interest in a corporate vision program for ${safe(company)}. A Vision Performance representative will be in touch within 1 business day with a customized proposal.\n\nâ€” Vision Performance Team`,
    });

    res.json({ message: "Corporate program request submitted! A representative will be in touch shortly." });
  } catch (err) {
    console.error('Corporate mail error:', err);
    res.status(500).json({ error: 'Failed to submit your request. Please email us at info@visionperformanceinc.ca' });
  }
});

module.exports = router;
