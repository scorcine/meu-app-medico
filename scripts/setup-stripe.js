#!/usr/bin/env node
/**
 * Cria produto MedHub Pro, preços mensal/anual e configura o Customer Portal no Stripe.
 *
 * Uso:
 *   set STRIPE_SECRET_KEY=sk_test_...   (Windows CMD)
 *   $env:STRIPE_SECRET_KEY="sk_test_..." (PowerShell)
 *   npm run setup:stripe
 *
 * Ou: node scripts/setup-stripe.js sk_test_...
 */

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const MONTHLY_CENTS = Number(process.env.MEDHUB_PRICE_MONTHLY_CENTS || 2990);
const ANNUAL_CENTS = Number(process.env.MEDHUB_PRICE_ANNUAL_CENTS || 30498);
const PRODUCT_NAME = 'MedHub Pro';
const PRODUCT_DESC = 'Assinatura médico solo — acesso completo ao MedHub';

function getSecretKey () {
  const arg = process.argv.find(a => a.startsWith('sk_'));
  if (arg) return arg.trim();
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();

  const root = path.join(__dirname, '..');
  const keyFiles = ['stripe-key.local.txt', '.env'];
  for (const name of keyFiles) {
    const filePath = path.join(root, name);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, 'utf8');
    const line = raw.split(/\r?\n/).find(l => {
      const t = l.trim();
      if (t.startsWith('sk_')) return true;
      const m = t.match(/^STRIPE_SECRET_KEY=(.+)$/);
      return m && m[1].trim().startsWith('sk_');
    });
    if (!line) continue;
    if (line.trim().startsWith('sk_')) return line.trim();
    return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
  }

  return null;
}

async function findProduct (stripe) {
  let startingAfter;
  for (let i = 0; i < 10; i++) {
    const list = await stripe.products.list({ limit: 100, active: true, starting_after: startingAfter });
    const hit = list.data.find(p => p.metadata?.medhub === 'pro' || p.name === PRODUCT_NAME);
    if (hit) return hit;
    if (!list.has_more) break;
    startingAfter = list.data[list.data.length - 1].id;
  }
  return null;
}

async function findPrice (stripe, productId, interval) {
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  return prices.data.find(p =>
    p.currency === 'brl' &&
    p.recurring?.interval === interval &&
    p.unit_amount === (interval === 'month' ? MONTHLY_CENTS : ANNUAL_CENTS)
  );
}

async function ensurePortal (stripe) {
  const existing = await stripe.billingPortal.configurations.list({ limit: 1 });
  if (existing.data.length) {
    return existing.data[0];
  }

  return stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'MedHub Pro — gerenciar assinatura'
    },
    features: {
      customer_update: { enabled: true, allowed_updates: ['email', 'name'] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: 'at_period_end' }
    }
  });
}

function writeEnvSnippet (vars) {
  const root = path.join(__dirname, '..');
  const envPath = path.join(root, '.env');
  const lines = [
    '# Gerado por npm run setup:stripe — NÃO commite este arquivo',
    `STRIPE_SECRET_KEY=${vars.secretKey}`,
    `STRIPE_PRICE_MONTHLY=${vars.monthlyPriceId}`,
    `STRIPE_PRICE_ANNUAL=${vars.annualPriceId}`,
    `MEDHUB_SITE_URL=${vars.siteUrl}`,
    `MEDHUB_PRICE_MONTHLY_CENTS=${MONTHLY_CENTS}`,
    `MEDHUB_PRICE_ANNUAL_CENTS=${ANNUAL_CENTS}`,
    `MEDHUB_PRICE_MONTHLY_DISPLAY=R$ 29,90`,
    `MEDHUB_PRICE_ANNUAL_DISPLAY=R$ 304,98`,
    ''
  ].join('\n');

  fs.writeFileSync(envPath, lines, 'utf8');
  return envPath;
}

async function main () {
  const secretKey = getSecretKey();
  if (!secretKey) {
    console.error('\n❌ Chave Stripe não encontrada.\n');
    console.error('Opção mais fácil: crie o arquivo stripe-key.local.txt na raiz do projeto');
    console.error('com UMA linha — sua chave secreta (sk_test_... ou sk_live_...).\n');
    console.error('Depois rode: npm run setup:stripe\n');
    console.error('Ou no PowerShell:');
    console.error('  $env:STRIPE_SECRET_KEY="sk_test_..."');
    console.error('  npm run setup:stripe\n');
    process.exit(1);
  }

  if (!secretKey.startsWith('sk_')) {
    console.error('❌ A chave deve começar com sk_test_ ou sk_live_');
    process.exit(1);
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
  const mode = secretKey.includes('_test_') ? 'TESTE' : 'PRODUÇÃO';

  console.log(`\n=== MedHub — setup Stripe (${mode}) ===\n`);

  let product = await findProduct(stripe);
  if (product) {
    console.log('✓ Produto já existe:', product.id, '—', product.name);
  } else {
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      description: PRODUCT_DESC,
      metadata: { medhub: 'pro' }
    });
    console.log('✓ Produto criado:', product.id, '—', product.name);
  }

  let monthly = await findPrice(stripe, product.id, 'month');
  if (monthly) {
    console.log('✓ Preço mensal já existe:', monthly.id, '—', formatBrl(MONTHLY_CENTS) + '/mês');
  } else {
    monthly = await stripe.prices.create({
      product: product.id,
      currency: 'brl',
      unit_amount: MONTHLY_CENTS,
      recurring: { interval: 'month' },
      metadata: { medhub_plan: 'monthly' }
    });
    console.log('✓ Preço mensal criado:', monthly.id, '—', formatBrl(MONTHLY_CENTS) + '/mês');
  }

  let annual = await findPrice(stripe, product.id, 'year');
  if (annual) {
    console.log('✓ Preço anual já existe:', annual.id, '—', formatBrl(ANNUAL_CENTS) + '/ano');
  } else {
    annual = await stripe.prices.create({
      product: product.id,
      currency: 'brl',
      unit_amount: ANNUAL_CENTS,
      recurring: { interval: 'year' },
      metadata: { medhub_plan: 'annual' }
    });
    console.log('✓ Preço anual criado:', annual.id, '—', formatBrl(ANNUAL_CENTS) + '/ano');
  }

  const portal = await ensurePortal(stripe);
  console.log('✓ Customer Portal configurado:', portal.id);

  const siteUrl = process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br';

  console.log('\n--- Cole na Vercel (Settings → Environment Variables) ---\n');
  console.log(`STRIPE_SECRET_KEY=${secretKey}`);
  console.log(`STRIPE_PRICE_MONTHLY=${monthly.id}`);
  console.log(`STRIPE_PRICE_ANNUAL=${annual.id}`);
  console.log(`MEDHUB_SITE_URL=${siteUrl}`);
  console.log(`MEDHUB_PRICE_MONTHLY_CENTS=${MONTHLY_CENTS}`);
  console.log(`MEDHUB_PRICE_ANNUAL_CENTS=${ANNUAL_CENTS}`);
  console.log('MEDHUB_PRICE_MONTHLY_DISPLAY=R$ 29,90');
  console.log('MEDHUB_PRICE_ANNUAL_DISPLAY=R$ 304,98');

  const envPath = writeEnvSnippet({
    secretKey,
    monthlyPriceId: monthly.id,
    annualPriceId: annual.id,
    siteUrl
  });

  console.log('\n✓ Arquivo local gravado:', envPath, '(gitignore — não vai pro GitHub)');
  console.log('\nPróximo: redeploy na Vercel e teste em /pricing.html\n');
}

function formatBrl (cents) {
  return 'R$ ' + (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message || err);
  if (err.type === 'StripeAuthenticationError') {
    console.error('   Verifique se a STRIPE_SECRET_KEY está correta.');
  }
  process.exit(1);
});
