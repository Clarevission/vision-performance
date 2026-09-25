const crypto = require('crypto');

const COOKIE_NAME = 'vpi_auth';
const MAX_AGE_MS  = 8 * 60 * 60 * 1000; // 8 hours

// Never sign production cookies with a secret that is published in the repository.
// If SESSION_SECRET is missing in production, use a random per-process secret: logins
// still work, sessions simply end when the server restarts, and cookies can't be forged.
let fallbackSecret;
function secret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV !== 'production') return 'vpi-dev-secret-change-me';
  if (!fallbackSecret) {
    fallbackSecret = crypto.randomBytes(32).toString('hex');
    console.warn('[auth] SESSION_SECRET is not set: using a random per-process secret. Set SESSION_SECRET in the hosting dashboard.');
  }
  return fallbackSecret;
}

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig  = crypto.createHmac('sha256', secret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verify(token) {
  if (!token) return null;
  const dot  = token.lastIndexOf('.');
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig  = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', secret()).update(data).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch { return null; }
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx < 1) return;
    try {
      out[decodeURIComponent(pair.slice(0, idx).trim())] =
        decodeURIComponent(pair.slice(idx + 1).trim());
    } catch {}
  });
  return out;
}

function setAuthCookie(res, payload) {
  const token = sign({ ...payload, exp: Date.now() + MAX_AGE_MS });
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_MS / 1000}` +
    (process.env.NODE_ENV === 'production' ? '; Secure' : '')
  );
}

function clearAuthCookie(res) {
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0` +
    (process.env.NODE_ENV === 'production' ? '; Secure' : '')
  );
}

function getAuthPayload(req) {
  const cookies = parseCookies(req);
  return verify(cookies[COOKIE_NAME] || '');
}

module.exports = { setAuthCookie, clearAuthCookie, getAuthPayload };
