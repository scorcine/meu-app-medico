#!/usr/bin/env node
/**
 * Ativa vendas reais: exige sk_live_, configura Stripe + webhook + Vercel + deploy.
 *
 * Pré-requisito:
 *   stripe-key.local.txt com uma linha sk_live_...
 *   (Stripe → Alternar para conta de produção → Developers → Chaves de API)
 *
 * Uso:
 *   npm run setup:stripe-live
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const KEY_FILE = path.join(ROOT, 'stripe-key.local.txt');

function readStripeKey () {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();
  if (!fs.existsSync(KEY_FILE)) return null;
  const raw = fs.readFileSync(KEY_FILE, 'utf8');
  const line = raw.split(/\r?\n/).find(l => {
    const t = l.trim();
    return t.startsWith('sk_') || /^STRIPE_SECRET_KEY=/.test(t);
  });
  if (!line) return null;
  if (line.trim().startsWith('sk_')) return line.trim();
  return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
}

function run (cmd, args) {
  const res = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: 'inherit',
    env: process.env
  });
  if (res.status !== 0) process.exit(res.status || 1);
}

function main () {
  const key = readStripeKey();

  console.log('\n=== MedHub — ativar vendas Live (Stripe + Vercel) ===\n');

  if (!key) {
    console.error('❌ Chave Stripe não encontrada.\n');
    console.error('1. Stripe Dashboard → Alternar para conta de produção');
    console.error('2. Developers → Chaves de API → copie sk_live_...');
    console.error('3. Salve em stripe-key.local.txt (uma linha) na raiz do projeto');
    console.error('4. Rode: npm run setup:stripe-live\n');
    process.exit(1);
  }

  if (key.includes('_test_')) {
    console.error('❌ A chave em stripe-key.local.txt ainda é de TESTE (sk_test_).\n');
    console.error('Troque por sk_live_... no Stripe (modo produção) e rode de novo.\n');
    process.exit(1);
  }

  if (!key.startsWith('sk_live_')) {
    console.error('❌ A chave deve começar com sk_live_\n');
    process.exit(1);
  }

  console.log('✓ Chave Live detectada\n');
  process.env.STRIPE_SECRET_KEY = key;

  console.log('→ Produto e preços Live no Stripe...\n');
  run('node', [path.join(__dirname, 'setup-stripe.js')]);

  console.log('\n→ Webhook Live + STRIPE_WEBHOOK_SECRET na Vercel...\n');
  run('node', [path.join(__dirname, 'setup-stripe-webhook.js'), '--no-deploy']);

  console.log('\n→ Variáveis + deploy produção...\n');
  run('node', [path.join(__dirname, 'setup-production.js')]);

  console.log('\n✅ Vendas Live configuradas.');
  console.log('   Teste: https://www.medhub.ia.br/#planos');
  console.log('   Use cartão real · mesmo e-mail no cadastro após pagamento.\n');
}

main();
