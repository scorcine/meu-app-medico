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
    process.env[key] = val;
  });
}
['.env.production.local', '.env.local', '.env'].forEach(loadEnv);
const { kv } = require('@vercel/kv');
const email = process.argv[2] || 'scorcine@gmail.com';
const terms = process.argv[3] || '2026-06-07-v2';
const privacy = process.argv[4] || terms;

(async () => {
  const key = 'medhub:user:' + email.trim().toLowerCase();
  const user = await kv.get(key);
  if (!user) throw new Error('Usuario nao encontrado: ' + email);
  user.termsVersion = terms;
  user.privacyVersion = privacy;
  await kv.set(key, user);
  console.log('OK', email, terms);
})().catch(err => { console.error(err.message); process.exit(1); });
