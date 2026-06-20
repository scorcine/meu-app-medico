#!/usr/bin/env node
/**
 * Desativa acesso de teste ou convite (assinatura no KV).
 *
 * Uso:
 *   node scripts/revoke-access.js --email teste@medhub.app
 *   node scripts/revoke-access.js --email teste@medhub.app --delete-user
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
const { saveCustomerBilling, getCustomerIdByEmail, getCustomerBilling } = require('../api/_billing-kv');

function parseArgs () {
  const args = process.argv.slice(2);
  const out = { deleteUser: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) out.email = args[++i];
    else if (args[i] === '--delete-user') out.deleteUser = true;
  }
  return out;
}

async function revokeAccess ({ email, deleteUser }) {
  const norm = normalizeEmail(email);
  if (!norm) throw new Error('Informe --email valido.');

  const user = await kv.get(userKey(norm));
  let customerId = user?.stripeCustomerId || await getCustomerIdByEmail(norm);

  if (!customerId) {
    customerId = 'manual_' + norm.replace(/[^a-z0-9]/g, '_');
  }

  const prev = await getCustomerBilling(customerId);

  await saveCustomerBilling({
    email: norm,
    customerId,
    subscriptionId: prev?.subscriptionId || user?.stripeSubscriptionId || 'manual_sub',
    status: 'revoked',
    plan: prev?.plan || 'monthly',
    active: false,
    currentPeriodEnd: prev?.currentPeriodEnd || null,
    updatedAt: new Date().toISOString(),
    source: 'admin_revoke'
  });

  if (deleteUser) {
    await kv.del(userKey(norm));
    await kv.del('medhub:profile:' + norm);
    await kv.del('medhub:clinical:' + norm);
    console.log('Conta removida do KV:', norm);
  } else {
    console.log('Assinatura desativada no KV:', norm);
    console.log('A conta permanece — login redireciona para planos.');
  }

  console.log('\nPara reativar: npm run grant:access -- --email ' + norm);
}

async function main () {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('KV nao configurado. Rode: npx vercel env pull .env.production.local --environment=production');
    process.exit(1);
  }

  const args = parseArgs();
  if (!args.email) {
    console.log('Uso: node scripts/revoke-access.js --email teste@medhub.app [--delete-user]');
    process.exit(1);
  }

  await revokeAccess(args);
}

main().catch(err => {
  console.error('Erro:', err.message || err);
  process.exit(1);
});
