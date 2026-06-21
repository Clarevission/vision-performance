const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../lib/db');

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
