const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');

const router = express.Router();

router.post('/', async (req, res) => {
  const { org, contact, email, phone, employees, date, address, notes } = req.body;

  if (!org || !contact || !email || !address) {
    return res.status(400).json({ error: 'Organization, contact name, email, and site address are required.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const safe = (v, max = 300) => escape(trim(v || '')).slice(0, max);
  const safeEmail = trim(email).toLowerCase().slice(0, 254);

  const html = `
    <h2 style="color:#FF6A00;font-family:sans-serif;">New Mobile Clinic Request</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#666;width:180px"><strong>Organization</strong></td><td style="padding:8px">${safe(org)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Contact Person</strong></td><td style="padding:8px">${safe(contact)}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Email</strong></td><td style="padding:8px"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Phone</strong></td><td style="padding:8px">${safe(phone) || '—'}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Employees</strong></td><td style="padding:8px">${safe(employees) || '—'}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Preferred Date</strong></td><td style="padding:8px">${safe(date) || '—'}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Site Address</strong></td><td style="padding:8px">${safe(address)}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666;vertical-align:top"><strong>Notes</strong></td><td style="padding:8px;white-space:pre-wrap">${safe(notes, 2000) || '—'}</td></tr>
    </table>
  `;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformance.ca',
      subject: `[Mobile Clinic Request] ${safe(org)} — ${safe(employees) || 'Unknown size'}`,
      html,
      text: `Organization: ${safe(org)}\nContact: ${safe(contact)}\nEmail: ${safeEmail}\nPhone: ${safe(phone)}\nEmployees: ${safe(employees)}\nDate: ${safe(date)}\nAddress: ${safe(address)}\nNotes: ${safe(notes, 2000)}`,
    });

    await sendMail({
      to: safeEmail,
      subject: 'Mobile Clinic Request Received — Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safe(contact)},</p>
             <p style="font-family:sans-serif">Thank you for requesting a mobile clinic visit for <strong>${safe(org)}</strong>. Our team will contact you within 1 business day to confirm your site visit details.</p>
             <p style="font-family:sans-serif">— Vision Performance Team</p>`,
      text: `Hi ${safe(contact)},\n\nThank you for requesting a mobile clinic visit for ${safe(org)}. Our team will contact you within 1 business day to confirm your site visit details.\n\n— Vision Performance Team`,
    });

    res.json({ message: "Mobile clinic request submitted! We'll contact you within 1 business day." });
  } catch (err) {
    console.error('Mobile clinic mail error:', err);
    res.status(500).json({ error: 'Failed to submit your request. Please email us at info@visionperformance.ca' });
  }
});

module.exports = router;
