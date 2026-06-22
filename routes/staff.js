'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const db = require('../lib/db');
const { setAuthCookie, clearAuthCookie, getAuthPayload } = require('../lib/auth');

const router = express.Router();

function requireStaff(req, res, next) {
  const auth = getAuthPayload(req);
  if (!auth || auth.role !== 'admin') return res.status(401).json({ error: 'Unauthorized' });
  req.auth = auth;
  next();
}

// ── AUTH ──
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'Invalid email address.' });

  try {
    const { rows } = await db.query(
      'SELECT id, email, name, password_hash, role FROM portal_users WHERE email=$1',
      [email.toLowerCase().trim()]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Staff accounts only.' });
    }
    setAuthCookie(res, { id: user.id, email: user.email, name: user.name, role: user.role });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Staff login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireStaff, (req, res) => {
  res.json({ user: req.auth });
});

// ── ENQUIRIES ──
router.get('/enquiries', requireStaff, async (req, res) => {
  const { type, status, limit = 100, offset = 0 } = req.query;
  const conditions = [];
  const params = [];

  if (type && ['contact','mobile','corporate','appointment'].includes(type)) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }
  if (status && ['new','in_progress','closed'].includes(status)) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  params.push(Math.min(Number(limit) || 100, 200));
  params.push(Number(offset) || 0);

  try {
    const { rows } = await db.query(
      `SELECT * FROM enquiries ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const countRes = await db.query(`SELECT COUNT(*) FROM enquiries ${where}`, params.slice(0, -2));
    res.json({ enquiries: rows, total: parseInt(countRes.rows[0].count, 10) });
  } catch (err) {
    console.error('Enquiries fetch error:', err);
    res.status(500).json({ error: 'Failed to load enquiries.' });
  }
});

router.patch('/enquiries/:id', requireStaff, async (req, res) => {
  const { status, staff_notes } = req.body;
  const validStatuses = ['new', 'in_progress', 'closed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  try {
    const { rows } = await db.query(
      `UPDATE enquiries SET
        status = COALESCE($1, status),
        staff_notes = COALESCE($2, staff_notes),
        updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status || null, staff_notes !== undefined ? staff_notes : null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found.' });
    res.json({ enquiry: rows[0] });
  } catch (err) {
    console.error('Enquiry update error:', err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

// ── STATS ──
router.get('/stats', requireStaff, async (req, res) => {
  try {
    const [totals, byType, byStatus, recent] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM enquiries'),
      db.query('SELECT type, COUNT(*) AS count FROM enquiries GROUP BY type ORDER BY count DESC'),
      db.query('SELECT status, COUNT(*) AS count FROM enquiries GROUP BY status'),
      db.query(`SELECT COUNT(*) AS count FROM enquiries WHERE created_at >= NOW() - INTERVAL '24 hours'`),
    ]);
    res.json({
      total:     parseInt(totals.rows[0].total, 10),
      last24h:   parseInt(recent.rows[0].count, 10),
      byType:    byType.rows,
      byStatus:  byStatus.rows,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to load stats.' });
  }
});

module.exports = router;
