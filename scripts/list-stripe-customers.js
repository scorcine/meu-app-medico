#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
function loadEnv (file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 1) return;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (val && !process.env[key]) process.env[key] = val;
  });
}
['.env.production.local', '.env.local', '.env'].forEach(loadEnv);
const { getStripe } = require('../api/_stripe');
(async () => {
  const stripe = getStripe();
  if (!stripe) { console.log('no stripe'); return; }
  const customers = await stripe.customers.list({ limit: 100 });
  console.log('customers', customers.data.length);
  customers.data.forEach(c => console.log(c.email, c.id));
  const sessions = await stripe.checkout.sessions.list({ limit: 20 });
  console.log('checkout sessions', sessions.data.length);
  sessions.data.forEach(s => console.log(s.customer_details?.email || s.customer_email, s.payment_status, s.status));
})().catch(e => console.error(e.message));
