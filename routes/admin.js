// Admin API — protected by ADMIN_KEY env var
// Used by VPI staff to manage clients, employees, and orders
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../lib/db');
const fs = require('fs');
const path = require('path');

function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'] || req.body?.adminKey;
  if (!key || key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });
  next();
}

// POST /api/admin/setup — run schema
router.post('/setup', requireAdmin, async (req, res) => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../lib/schema.sql'), 'utf8');
    await db.query(sql);
    res.json({ ok: true, message: 'Schema created' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/companies
router.post('/companies', requireAdmin, async (req, res) => {
  const { name, plan = 'standard', industry } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const { rows } = await db.query('INSERT INTO companies(name,plan,industry) VALUES($1,$2,$3) RETURNING *', [name, plan, industry]);
    res.json({ company: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/companies
router.get('/companies', requireAdmin, async (req, res) => {
  const { rows } = await db.query('SELECT c.*, (SELECT COUNT(*) FROM employees WHERE company_id=c.id) AS emp_count FROM companies c ORDER BY c.name');
  res.json({ companies: rows });
});

// POST /api/admin/users — create portal login
router.post('/users', requireAdmin, async (req, res) => {
  const { company_id, email, password, name, role = 'client' } = req.body;
  if (!company_id || !email || !password) return res.status(400).json({ error: 'company_id, email, password required' });
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      'INSERT INTO portal_users(company_id,email,password_hash,name,role) VALUES($1,$2,$3,$4,$5) RETURNING id,email,name,role',
      [company_id, email.toLowerCase(), hash, name, role]
    );
    res.json({ user: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/employees
router.post('/employees', requireAdmin, async (req, res) => {
  const { company_id, name, employee_id, department, job_title, eligible = true, enrolled_at } = req.body;
  if (!company_id || !name) return res.status(400).json({ error: 'company_id, name required' });
  try {
    const { rows } = await db.query(
      'INSERT INTO employees(company_id,name,employee_id,department,job_title,eligible,enrolled_at) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [company_id, name, employee_id, department, job_title, eligible, enrolled_at]
    );
    res.json({ employee: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/orders
router.post('/orders', requireAdmin, async (req, res) => {
  const { company_id, employee_id, employee_name, frame_name, lens_type, order_date, status = 'pending', compliance_type, notes } = req.body;
  if (!company_id) return res.status(400).json({ error: 'company_id required' });
  try {
    const { rows } = await db.query(
      'INSERT INTO orders(company_id,employee_id,employee_name,frame_name,lens_type,order_date,status,compliance_type,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [company_id, employee_id, employee_name, frame_name, lens_type, order_date, status, compliance_type, notes]
    );
    res.json({ order: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/orders/:id
router.patch('/orders/:id', requireAdmin, async (req, res) => {
  const { status, notes } = req.body;
  try {
    const { rows } = await db.query('UPDATE orders SET status=$1, notes=$2 WHERE id=$3 RETURNING *', [status, notes, req.params.id]);
    res.json({ order: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/compliance-docs
router.post('/compliance-docs', requireAdmin, async (req, res) => {
  const { company_id, title, doc_type, file_url, issue_date } = req.body;
  if (!company_id || !title) return res.status(400).json({ error: 'company_id, title required' });
  try {
    const { rows } = await db.query(
      'INSERT INTO compliance_docs(company_id,title,doc_type,file_url,issue_date) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [company_id, title, doc_type, file_url, issue_date]
    );
    res.json({ doc: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/employees/:id
router.delete('/employees/:id', requireAdmin, async (req, res) => {
  await db.query('DELETE FROM employees WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
