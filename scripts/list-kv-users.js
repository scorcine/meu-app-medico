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

loadEnv('.env.production.local');
loadEnv('.env.local');
loadEnv('.env');

const { kv } = require('@vercel/kv');

async function main () {
  if (!process.env.KV_REST_API_URL) {
    console.error('KV_REST_API_URL missing');
    process.exit(1);
  }

  const patterns = ['*', 'medhub:*', 'medhub:user:*'];
  for (const pattern of patterns) {
    try {
      const keys = await kv.keys(pattern);
      console.log('Pattern', pattern, '→', keys.length, 'keys');
      keys.slice(0, 30).forEach(k => console.log('  ', k));
    } catch (err) {
      console.log('Pattern', pattern, 'error:', err.message);
    }
  }

  const userKeys = await kv.keys('medhub:user:*');
  console.log('Users:', userKeys.length);
  for (const k of userKeys) {
    const u = await kv.get(k);
    console.log('-', u?.email, '|', u?.name, '| stripe:', u?.stripeCustomerId || 'none');
  }

  const emailKeys = await kv.keys('medhub:stripe:email:*');
  console.log('\nBilling emails:', emailKeys.length);
  for (const k of emailKeys) {
    const email = k.replace('medhub:stripe:email:', '');
    const cid = await kv.get(k);
    const bill = cid ? await kv.get('medhub:stripe:customer:' + cid) : null;
    console.log('-', email, '| active:', bill?.active, '| status:', bill?.status, '| customer:', cid);
  }
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
