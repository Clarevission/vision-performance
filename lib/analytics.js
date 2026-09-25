'use strict';
// Optional, cookieless page-view analytics (Cloudflare Web Analytics).
// Off unless CF_ANALYTICS_TOKEN is set in the environment. When it is set, the beacon
// script, the CSP allowances and the privacy-policy paragraph all switch on together,
// so the site never loads analytics without disclosing it.
const TOKEN = /^[a-f0-9]{32}$/i;

function analytics(token) {
  if (!token || !TOKEN.test(token)) {
    return { enabled: false, tag: '', notice: '', scriptSrc: [], connectSrc: [] };
  }
  return {
    enabled: true,
    tag: `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${token}"}'></script>`,
    notice: '<p>We count page views with Cloudflare Web Analytics. It doesn\'t use cookies or local storage, and it doesn\'t identify you or follow you across other websites.</p>',
    scriptSrc: ['https://static.cloudflareinsights.com'],
    connectSrc: ['https://cloudflareinsights.com'],
  };
}

module.exports = { analytics, current: analytics(process.env.CF_ANALYTICS_TOKEN) };
