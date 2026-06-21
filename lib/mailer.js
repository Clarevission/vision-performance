const { Resend } = require('resend');

let resend;

function getClient() {
  if (resend) return resend;
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
    return resend;
  }
  return null;
}

async function sendMail({ to, subject, html, text }) {
  const from = process.env.MAIL_FROM || 'Vision Performance <info@visionperformanceinc.ca>';
  const client = getClient();

  if (!client) {
    // Dev fallback — log to console when RESEND_API_KEY not set
    console.log('\n[MAIL] Would send email (set RESEND_API_KEY to enable):');
    console.log('  From:', from);
    console.log('  To:', to);
    console.log('  Subject:', subject);
    console.log('  Body:', text || '(html only)');
    return { id: 'dev-preview' };
  }

  const { data, error } = await client.emails.send({ from, to, subject, html, text });
  if (error) throw new Error(error.message);
  return data;
}

module.exports = { sendMail };
