const express = require('express');
const { isEmail, escape, trim } = require('validator');
const { sendMail } = require('../lib/mailer');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, company, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const safeName = escape(trim(name)).slice(0, 120);
  const safeCompany = escape(trim(company || '')).slice(0, 120);
  const safeSubject = escape(trim(subject || 'General Enquiry')).slice(0, 200);
  const safeMessage = escape(trim(message)).slice(0, 4000);
  const safeEmail = trim(email).toLowerCase().slice(0, 254);

  const html = `
    <h2 style="color:#FF6A00;font-family:sans-serif;">New Contact Form Submission</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;color:#666;width:160px"><strong>Name</strong></td><td style="padding:8px">${safeName}</td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Company</strong></td><td style="padding:8px">${safeCompany || '—'}</td></tr>
      <tr><td style="padding:8px;color:#666"><strong>Email</strong></td><td style="padding:8px"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      <tr style="background:#f9f9f9"><td style="padding:8px;color:#666"><strong>Subject</strong></td><td style="padding:8px">${safeSubject}</td></tr>
      <tr><td style="padding:8px;color:#666;vertical-align:top"><strong>Message</strong></td><td style="padding:8px;white-space:pre-wrap">${safeMessage}</td></tr>
    </table>
  `;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || 'info@visionperformanceinc.ca',
      subject: `[Contact] ${safeSubject} — ${safeName}`,
      html,
      text: `Name: ${safeName}\nCompany: ${safeCompany}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\n\n${safeMessage}`,
    });

    // Auto-reply to sender
    await sendMail({
      to: safeEmail,
      subject: 'We received your message — Vision Performance Inc.',
      html: `<p style="font-family:sans-serif">Hi ${safeName},</p>
             <p style="font-family:sans-serif">Thanks for reaching out. Our team will respond within 1 business day.</p>
             <p style="font-family:sans-serif">— Vision Performance Team</p>`,
      text: `Hi ${safeName},\n\nThanks for reaching out. Our team will respond within 1 business day.\n\n— Vision Performance Team`,
    });

    res.json({ message: "Message sent! We'll respond within 1 business day." });
  } catch (err) {
    console.error('Contact mail error:', err);
    res.status(500).json({ error: 'Failed to send your message. Please email us directly at info@visionperformanceinc.ca' });
  }
});

module.exports = router;
