#!/usr/bin/env node
/**
 * Cura em lote (opcional): todos os usuários com assinatura ativa
 * e sem perfil completo recebem perfil automático.
 *
 * Uso:
 *   node scripts/heal-all-profiles.js
 *   node scripts/heal-all-profiles.js --dry-run
 */
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

const dryRun = process.argv.includes('--dry-run');
const { kv } = require('@vercel/kv');
const { getSubscriptionStatus } = require('../api/_subscription');
const { ensurePaidUserProfile, publicProfile, profileOnboardingComplete } = require('../api/_profile');

async function listUserEmails () {
  const keys = await kv.keys('medhub:user:*');
  return keys.map(k => k.replace(/^medhub:user:/, '')).filter(Boolean);
}

(async () => {
  const emails = await listUserEmails();
  console.log('Usuários:', emails.length, dryRun ? '(dry-run)' : '');

  let healed = 0;
  let already = 0;
  let skipped = 0;

  for (const email of emails) {
    const user = await kv.get('medhub:user:' + email);
    if (!user) {
      skipped++;
      continue;
    }
    const sub = await getSubscriptionStatus(email, { user, loadUser: false });
    if (!sub.active && !sub.devBypass) {
      skipped++;
      continue;
    }

    if (dryRun) {
      const raw = await kv.get('medhub:profile:' + email);
      const ok = raw && profileOnboardingComplete(raw);
      console.log(ok ? 'OK ' : 'HEAL', email, ok ? '' : '(sem perfil completo)');
      if (!ok) healed++;
      else already++;
      continue;
    }

    const before = await kv.get('medhub:profile:' + email);
    const wasComplete = before && profileOnboardingComplete(before);
    const profile = await ensurePaidUserProfile(email, user, sub);
    if (profileOnboardingComplete(profile)) {
      if (wasComplete) already++;
      else {
        healed++;
        console.log('HEAL', email, publicProfile(profile)?.userType);
      }
    } else {
      skipped++;
      console.log('SKIP', email, 'não liberável');
    }
  }

  console.log(JSON.stringify({ healed, already, skipped, total: emails.length, dryRun }, null, 2));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
