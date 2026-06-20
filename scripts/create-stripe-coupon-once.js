#!/usr/bin/env node
/**
 * Cria um cupom de cortesia MedHub (100% off, 1 mês) com uso único.
 *
 * Uso:
 *   npm run create:stripe-coupon-once
 *   npm run create:stripe-coupon-once -- --code MEDHUBJOAO1
 *   npm run create:stripe-coupon-once -- --months 3
 *
 * Chave: STRIPE_SECRET_KEY ou stripe-key.local.txt / .env
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Stripe = require('stripe');

const ROOT = path.join(__dirname, '..');
const KEY_FILE = path.join(ROOT, 'stripe-key.local.txt');

function getSecretKey () {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();
  if (fs.existsSync(KEY_FILE)) {
    const raw = fs.readFileSync(KEY_FILE, 'utf8');
    const line = raw.split(/\r?\n/).find(l => {
      const t = l.trim();
      return t.startsWith('sk_') || /^STRIPE_SECRET_KEY=/.test(t);
    });
    if (line) {
      if (line.trim().startsWith('sk_')) return line.trim();
      return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find(l => /^STRIPE_SECRET_KEY=/.test(l));
    if (line) return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
  }
  return null;
}

function parseArgs () {
  const args = process.argv.slice(2);
  const out = { months: 1, code: '' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--months' && args[i + 1]) {
      out.months = Math.max(1, Math.min(12, Number(args[++i]) || 1));
    } else if (args[i] === '--code' && args[i + 1]) {
      out.code = String(args[++i]).trim().toUpperCase();
    }
  }
  return out;
}

function defaultCode () {
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return 'MEDHUB1M-' + suffix;
}

async function findPromoByCode (stripe, code) {
  const list = await stripe.promotionCodes.list({ code, limit: 1 });
  return list.data[0] || null;
}

async function main () {
  const key = getSecretKey();
  if (!key) {
    console.error('❌ STRIPE_SECRET_KEY não encontrada (stripe-key.local.txt ou .env).');
    process.exit(1);
  }

  const { months, code: requestedCode } = parseArgs();
  const code = (requestedCode || defaultCode()).slice(0, 40);
  const stripe = new Stripe(key, { apiVersion: '2024-06-20' });
  const mode = key.includes('_live_') ? 'LIVE' : 'TEST';

  const existing = await findPromoByCode(stripe, code);
  if (existing) {
    console.error('❌ Código já existe no Stripe:', code);
    process.exit(1);
  }

  const coupon = await stripe.coupons.create({
    name: `MedHub — ${months} mês(es) cortesia (uso único)`,
    percent_off: 100,
    duration: 'repeating',
    duration_in_months: months,
    max_redemptions: 1,
    metadata: { medhub: 'cortesia', medhub_months: String(months), medhub_single_use: '1' }
  });

  const promo = await stripe.promotionCodes.create({
    coupon: coupon.id,
    code,
    max_redemptions: 1,
    metadata: { medhub: 'cortesia', medhub_single_use: '1' }
  });

  console.log('');
  console.log('MedHub — cupom de uso único criado (' + mode + ')');
  console.log('==========================================');
  console.log('Código para cadastro:', code);
  console.log('Benefício: ' + months + ' mês(es) grátis (100% off)');
  console.log('Usos: 1 (não reutilizável)');
  console.log('Onde usar: register.html → "Coloque seu cupom de desconto aqui"');
  console.log('Promotion code ID:', promo.id);
  console.log('');
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
