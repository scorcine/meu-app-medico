#!/usr/bin/env node
/**
 * Cria cupons de cortesia MedHub no Stripe (100% off por 1, 3 ou 12 meses).
 * Gera códigos promocionais para usar no checkout.
 *
 * Uso: npm run setup:stripe-coupons
 * (mesma chave STRIPE_SECRET_KEY do setup:stripe)
 */

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const PROMOS = [
  { code: 'MEDHUB1MES', months: 1, label: 'MedHub — 1 mês cortesia' },
  { code: 'MEDHUB3MESES', months: 3, label: 'MedHub — 3 meses cortesia (embaixador)' },
  { code: 'MEDHUB12MESES', months: 12, label: 'MedHub — 12 meses cortesia (embaixador)' }
];

function getSecretKey () {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return null;
  const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find(l => /^STRIPE_SECRET_KEY=/.test(l));
  if (!line) return null;
  return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
}

async function findPromoByCode (stripe, code) {
  const list = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
  return list.data[0] || null;
}

async function ensurePromo (stripe, spec) {
  const existing = await findPromoByCode(stripe, spec.code);
  if (existing) {
    console.log('✓ Já existe:', spec.code, '→', existing.id);
    return existing;
  }

  const coupon = await stripe.coupons.create({
    name: spec.label,
    percent_off: 100,
    duration: 'repeating',
    duration_in_months: spec.months,
    metadata: { medhub: 'cortesia', medhub_months: String(spec.months) }
  });

  const promo = await stripe.promotionCodes.create({
    coupon: coupon.id,
    code: spec.code,
    metadata: { medhub: 'cortesia' }
  });

  console.log('✓ Criado:', spec.code, '→', promo.id, `(${spec.months} mês(es) grátis, sem cartão no checkout)`);
  return promo;
}

async function main () {
  const key = getSecretKey();
  if (!key) {
    console.error('❌ STRIPE_SECRET_KEY não encontrada. Rode npm run setup:stripe antes.');
    process.exit(1);
  }

  const stripe = new Stripe(key, { apiVersion: '2024-06-20' });
  console.log('\nMedHub — cupons de cortesia (100% off, checkout sem cartão se total = R$ 0)\n');

  for (const spec of PROMOS) {
    await ensurePromo(stripe, spec);
  }

  console.log('\nNo Stripe Dashboard: Produtos → Cupons / Códigos promocionais');
  console.log('Limite de usos: edite cada código (ex.: max 1 uso por embaixador).\n');
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
