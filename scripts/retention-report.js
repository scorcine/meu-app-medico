#!/usr/bin/env node
/**
 * Relatório de retenção: quem usa o app vs quem só cadastrou.
 *
 * Uso: npm run retention:report
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

const { kv } = require('@vercel/kv');
const { userKey, normalizeEmail } = require('../api/_auth');
const { getUserActivity, activityHasRealUsage, publicActivity } = require('../api/_activity-kv');
const { getCustomerIdByEmail, getCustomerBilling } = require('../api/_billing-kv');
const { daysUntilDate } = require('../api/_retention');

function pad (value, width) {
  const s = String(value ?? '');
  return s.length >= width ? s.slice(0, width) : s + ' '.repeat(width - s.length);
}

async function main () {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('KV não configurado. Use .env.local ou .env.production.local');
    process.exit(1);
  }

  const keys = await kv.keys('medhub:user:*');
  const rows = [];

  for (const key of keys) {
    const user = await kv.get(key);
    if (!user?.email) continue;

    const email = normalizeEmail(user.email);
    const activity = await getUserActivity(email);
    const pub = publicActivity(activity, user.createdAt);
    const customerId = user.stripeCustomerId || await getCustomerIdByEmail(email);
    const billing = customerId ? await getCustomerBilling(customerId) : null;

    const courtesyDays = billing?.courtesyEndsAt || billing?.currentPeriodEnd
      ? daysUntilDate(billing.courtesyEndsAt || billing.currentPeriodEnd)
      : null;

    rows.push({
      email,
      name: user.name || '',
      created: (user.createdAt || '').slice(0, 10),
      used: pub.hasUsedApp ? 'sim' : 'nao',
      sessions: pub.sessionCount,
      sections: (pub.sectionsUsed || []).join(', ') || '—',
      lastActive: pub.lastActiveAt ? pub.lastActiveAt.slice(0, 10) : '—',
      plan: billing?.plan || '—',
      courtesy: billing?.isCourtesy ? 'sim' : 'nao',
      daysLeft: courtesyDays != null ? String(courtesyDays) : '—',
      active: billing?.active ? 'sim' : 'nao'
    });
  }

  rows.sort((a, b) => a.email.localeCompare(b.email));

  console.log('\nMedHub — retenção e uso (' + rows.length + ' contas)\n');
  console.log(
    pad('E-mail', 34) +
    pad('Usou?', 6) +
    pad('Sess.', 6) +
    pad('Dias', 5) +
    pad('Cort.', 6) +
    'Último módulo / atividade'
  );
  console.log('-'.repeat(100));

  let usedCount = 0;
  let unusedCount = 0;

  for (const row of rows) {
    if (row.used === 'sim') usedCount += 1;
    else unusedCount += 1;
    console.log(
      pad(row.email, 34) +
      pad(row.used, 6) +
      pad(row.sessions, 6) +
      pad(row.daysLeft, 5) +
      pad(row.courtesy, 6) +
      (row.sections !== '—' ? row.sections : row.lastActive)
    );
  }

  console.log('\nResumo: ' + usedCount + ' usam o app · ' + unusedCount + ' só cadastraram\n');
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
