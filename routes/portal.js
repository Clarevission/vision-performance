const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = express.Router();
const db = require('../lib/db');
const { sendMail } = require('../lib/mailer');

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

// POST /api/portal/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const { rows } = await db.query(
      'SELECT pu.*, c.name AS company_name, c.plan FROM portal_users pu JOIN companies c ON pu.company_id = c.id WHERE pu.email = $1',
      [email.toLowerCase().trim()]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
    req.session.userId = user.id;
    req.session.companyId = user.company_id;
    req.session.role = user.role;
    res.json({ ok: true, user: { name: user.name, email: user.email, company: user.company_name, role: user.role } });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/portal/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// GET /api/portal/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT pu.name, pu.email, pu.role, c.name AS company_name, c.plan FROM portal_users pu JOIN companies c ON pu.company_id = c.id WHERE pu.id = $1',
      [req.session.userId]
    );
    if (!rows[0]) return res.status(401).json({ error: 'Not found' });
    res.json({ user: { name: rows[0].name, email: rows[0].email, company: rows[0].company_name, plan: rows[0].plan, role: rows[0].role } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/portal/dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  const cid = req.session.companyId;
  try {
    const [empR, orderR, compR, recentR] = await Promise.all([
      db.query('SELECT COUNT(*) FROM employees WHERE company_id=$1 AND eligible=true', [cid]),
      db.query("SELECT COUNT(*) FROM orders WHERE company_id=$1 AND status='pending'", [cid]),
      db.query("SELECT ROUND(100.0*COUNT(*) FILTER (WHERE status='complete')/NULLIF(COUNT(*),0)) AS rate FROM orders WHERE company_id=$1", [cid]),
      db.query("SELECT o.id, e.name AS employee_name, o.frame_name, o.order_date, o.status, o.compliance_type FROM orders o LEFT JOIN employees e ON o.employee_id=e.id WHERE o.company_id=$1 ORDER BY o.order_date DESC LIMIT 8", [cid]),
    ]);
    res.json({
      totalEmployees: parseInt(empR.rows[0].count),
      pendingOrders: parseInt(orderR.rows[0].count),
      complianceRate: parseInt(compR.rows[0].rate) || 0,
      recentOrders: recentR.rows,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/portal/employees
router.get('/employees', requireAuth, async (req, res) => {
  const cid = req.session.companyId;
  try {
    const { rows } = await db.query(
      'SELECT e.*, (SELECT COUNT(*) FROM orders o WHERE o.employee_id=e.id) AS order_count FROM employees e WHERE e.company_id=$1 ORDER BY e.name',
      [cid]
    );
    res.json({ employees: rows });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/portal/orders
router.get('/orders', requireAuth, async (req, res) => {
  const cid = req.session.companyId;
  try {
    const { rows } = await db.query(
      'SELECT o.*, e.name AS employee_name FROM orders o LEFT JOIN employees e ON o.employee_id=e.id WHERE o.company_id=$1 ORDER BY o.order_date DESC',
      [cid]
    );
    res.json({ orders: rows });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/portal/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const { rows } = await db.query(
      'SELECT id, name FROM portal_users WHERE email=$1',
      [email.toLowerCase().trim()]
    );
    // Always return ok — never reveal whether email exists
    if (!rows[0]) return res.json({ ok: true });
    // Invalidate any existing unused tokens for this user
    await db.query('UPDATE password_reset_tokens SET used=true WHERE user_id=$1 AND used=false', [rows[0].id]);
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await db.query(
      'INSERT INTO password_reset_tokens(user_id,token,expires_at) VALUES($1,$2,$3)',
      [rows[0].id, token, expires]
    );
    const origin = process.env.APP_ORIGIN || 'https://visionperformanceinc.ca';
    const resetUrl = `${origin}/portal?token=${token}`;
    await sendMail({
      to: email,
      subject: 'Reset your Vision Performance Portal password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#0a0e1a;">Password Reset Request</h2>
          <p>Hi ${rows[0].name || 'there'},</p>
          <p>Click the button below to reset your Client Portal password. This link expires in <strong>1 hour</strong>.</p>
          <p style="margin:32px 0;">
            <a href="${resetUrl}" style="background:#FF6A00;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">Reset My Password</a>
          </p>
          <p style="color:#666;font-size:13px;">Or copy this link: ${resetUrl}</p>
          <p style="color:#666;font-size:13px;">If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Vision Performance Inc. · Edmonton, Alberta, Canada</p>
        </div>`,
      text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
    });
    res.json({ ok: true });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/portal/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  try {
    const { rows } = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token=$1 AND used=false AND expires_at > NOW()',
      [token]
    );
    if (!rows[0]) return res.status(400).json({ error: 'This reset link is invalid or has expired. Please request a new one.' });
    const hash = await bcrypt.hash(password, 12);
    await db.query('UPDATE portal_users SET password_hash=$1 WHERE id=$2', [hash, rows[0].user_id]);
    await db.query('UPDATE password_reset_tokens SET used=true WHERE id=$1', [rows[0].id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('Reset password error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/portal/compliance
router.get('/compliance', requireAuth, async (req, res) => {
  const cid = req.session.companyId;
  try {
    const [docsR, statsR] = await Promise.all([
      db.query('SELECT * FROM compliance_docs WHERE company_id=$1 ORDER BY issue_date DESC', [cid]),
      db.query("SELECT compliance_type, COUNT(*) FROM orders WHERE company_id=$1 AND status='complete' GROUP BY compliance_type", [cid]),
    ]);
    res.json({ docs: docsR.rows, stats: statsR.rows });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
