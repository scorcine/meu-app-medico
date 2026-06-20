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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

['.env.production.local', '.env.local', '.env'].forEach(loadEnv);

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/_check-sub.js email@exemplo.com');
  process.exit(1);
}

const { getSubscriptionStatus } = require('../api/_subscription');
const { getCustomerIdByEmail, getCustomerBilling } = require('../api/_billing-kv');
const { getUser } = require('../api/_users');

(async () => {
  const norm = email.trim().toLowerCase();
  const user = await getUser(norm);
  const customerId = await getCustomerIdByEmail(norm);
  const billing = customerId ? await getCustomerBilling(customerId) : null;
  const sub = await getSubscriptionStatus(norm, { user, loadUser: false });

  console.log(JSON.stringify({ user: user ? { email: user.email, name: user.name } : null, customerId, billing, sub }, null, 2));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
