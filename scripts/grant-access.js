#!/usr/bin/env node
/**
 * Libera acesso admin: assinatura ativa no KV + opcional reset de senha.
 *
 * Uso:
 *   node scripts/grant-access.js --email seu@email.com
 *   node scripts/grant-access.js --email seu@email.com --password NovaSenha123
 *   node scripts/grant-access.js --email seu@email.com --list
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

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
const { hashPassword, userKey, normalizeEmail } = require('../api/_auth');
const { saveCustomerBilling } = require('../api/_billing-kv');
const { getStripe, findCustomerByEmail, getActiveSubscription } = require('../api/_stripe');

function parseArgs () {
  const args = process.argv.slice(2);
  const out = { list: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) out.email = args[++i];
    else if (args[i] === '--password' && args[i + 1]) out.password = args[++i];
    else if (args[i] === '--name' && args[i + 1]) out.name = args[++i];
    else if (args[i] === '--list') out.list = true;
  }
  return out;
}

async function listAll () {
  const patterns = ['medhub:user:*', 'medhub:stripe:email:*'];
  for (const pattern of patterns) {
    const keys = await kv.keys(pattern);
    console.log(pattern, '→', keys.length);
    for (const k of keys) {
      const val = await kv.get(k);
      if (k.startsWith('medhub:user:')) {
        console.log('  user:', val?.email, val?.name);
      } else {
        console.log('  billing:', k.replace('medhub:stripe:email:', ''), '→', val);
      }
    }
  }

  const stripe = getStripe();
  if (stripe) {
    const customers = await stripe.customers.list({ limit: 20 });
    console.log('\nStripe customers:', customers.data.length);
    customers.data.forEach(c => console.log('  ', c.email, c.id));
  }
}

async function grantAccess ({ email, password, name }) {
  const norm = normalizeEmail(email);
  if (!norm) throw new Error('Informe --email valido.');

  let user = await kv.get(userKey(norm));
  const stripe = getStripe();

  let customerId = user?.stripeCustomerId || null;
  if (!customerId) {
    customerId = await kv.get('medhub:stripe:email:' + norm);
  }
  if (!customerId && stripe) {
    const customer = await findCustomerByEmail(stripe, norm);
    customerId = customer?.id || null;
  }
  if (!customerId) {
    customerId = 'manual_' + norm.replace(/[^a-z0-9]/g, '_');
    console.log('Aviso: sem cliente Stripe — usando ID manual para bypass de assinatura.');
  }

  let subActive = true;
  let subscriptionId = user?.stripeSubscriptionId || 'manual_sub';
  let plan = 'monthly';
  let status = 'active';

  if (stripe && customerId && !customerId.startsWith('manual_')) {
    const sub = await getActiveSubscription(stripe, customerId);
    if (sub) {
      subscriptionId = sub.id;
      status = sub.status;
      subActive = ['active', 'trialing'].includes(sub.status);
      plan = sub.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly';
    }
  }

  await saveCustomerBilling({
    email: norm,
    customerId,
    subscriptionId,
    status,
    plan: 'annual',
    active: true,
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'admin_grant'
  });

  if (!user) {
    if (!password || password.length < 8) {
      console.log('\nPronto! Assinatura ativa no KV por 1 ano.');
      console.log('E-mail:', norm);
      console.log('Conta ainda nao criada — o usuario pode cadastrar em login com este e-mail.');
      console.log('Login: https://meu-app-medico.vercel.app/login.html');
      return;
    }
    user = {
      name: name || norm.split('@')[0],
      email: norm,
      ...hashPassword(password),
      stripeCustomerId: customerId.startsWith('manual_') ? null : customerId,
      stripeSubscriptionId: subscriptionId.startsWith('manual_') ? null : subscriptionId,
      termsVersion: process.env.MEDHUB_TERMS_VERSION || '2026-06-07-v1',
      privacyVersion: process.env.MEDHUB_PRIVACY_VERSION || '2026-06-07-v1',
      createdAt: new Date().toISOString()
    };
    console.log('Conta criada no KV.');
  } else if (password) {
    Object.assign(user, hashPassword(password));
    console.log('Senha redefinida.');
  }

  user.stripeCustomerId = customerId.startsWith('manual_') ? user.stripeCustomerId : customerId;
  user.stripeSubscriptionId = subscriptionId.startsWith('manual_') ? user.stripeSubscriptionId : subscriptionId;
  user.termsVersion = process.env.MEDHUB_TERMS_VERSION || user.termsVersion || '2026-06-07-v1';
  user.privacyVersion = process.env.MEDHUB_PRIVACY_VERSION || user.privacyVersion || '2026-06-07-v1';

  await kv.set(userKey(norm), user);

  console.log('\nPronto!');
  console.log('E-mail:', norm);
  console.log('Assinatura: ativa (KV)');
  console.log('Login: https://meu-app-medico.vercel.app/login.html');
  if (password) console.log('Senha definida — use a informada no comando.');
}

async function main () {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('KV nao configurado. Rode: npx vercel env pull .env.production.local --environment=production');
    process.exit(1);
  }

  const args = parseArgs();
  if (args.list) {
    await listAll();
    return;
  }
  if (!args.email) {
    console.log('Uso: node scripts/grant-access.js --email seu@email.com [--password NovaSenha123] [--list]');
    process.exit(1);
  }
  await grantAccess(args);
}

main().catch(err => {
  console.error('Erro:', err.message || err);
  process.exit(1);
});
