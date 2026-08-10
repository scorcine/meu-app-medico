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

const email = String(process.argv[2] || '').trim().toLowerCase();
if (!email) {
  console.error('Uso: node scripts/_check-profile.js email@exemplo.com');
  process.exit(1);
}

const { kv } = require('@vercel/kv');
const { getProfessionalProfile, publicProfile } = require('../api/_profile');
const { getUser } = require('../api/_users');

(async () => {
  const user = await getUser(email);
  const raw = await kv.get('medhub:profile:' + email);
  const profile = await getProfessionalProfile(email, user?.name);
  console.log(JSON.stringify({
    user: user ? { email: user.email, name: user.name } : null,
    raw,
    profile: publicProfile(profile)
  }, null, 2));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
