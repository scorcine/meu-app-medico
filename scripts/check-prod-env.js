#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', '.env.production.local');
if (!fs.existsSync(p)) { console.log('no production env'); process.exit(1); }
fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach(line => {
  if (line.startsWith('STRIPE_SECRET_KEY=')) {
    const v = line.slice('STRIPE_SECRET_KEY='.length).replace(/^"|"$/g, '');
    console.log('STRIPE:', v.startsWith('sk_live') ? 'LIVE' : v.startsWith('sk_test') ? 'TEST' : 'UNKNOWN');
  }
  if (line.startsWith('KV_REST_API_URL=')) {
    console.log('KV_URL:', line.split('=')[1].replace(/^"|"$/g, ''));
  }
  if (line.startsWith('MEDHUB_ALLOW_DEV_BYPASS=')) console.log(line.split('=')[0] + '=set');
});
