#!/usr/bin/env node
/**
 * Registra o endpoint de webhook do Stripe na Vercel e grava STRIPE_WEBHOOK_SECRET.
 *
 * Uso:
 *   npm run setup:stripe-webhook
 *   npm run setup:stripe-webhook -- --no-deploy
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Stripe = require('stripe');

const ROOT = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const SITE_URL = process.env.MEDHUB_SITE_URL || 'https://meu-app-medico.vercel.app';
const WEBHOOK_PATH = '/api/stripe-webhook';
const EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
];
const ENVS = ['production', 'preview'];

function getSecretKey () {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();

  const keyFiles = ['stripe-key.local.txt', '.env'];
  for (const name of keyFiles) {
    const filePath = path.join(ROOT, name);
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

function run (cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: opts.silent ? 'pipe' : 'inherit',
    env: { ...process.env, ...opts.env }
  });
}

function upsertEnvFile (key, value) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const re = new RegExp('^' + key + '=.*$', 'm');
  const line = key + '=' + value;
  content = re.test(content)
    ? content.replace(re, line)
    : (content.endsWith('\n') || !content ? content : content + '\n') + line + '\n';
  fs.writeFileSync(ENV_PATH, content, 'utf8');
}

function pushToVercel (name, value) {
  for (const envName of ENVS) {
    run('npx', [
      'vercel', 'env', 'add', name, envName,
      '--value', value,
      '--yes',
      '--force',
      '--sensitive'
    ], { silent: true });
  }
}

async function findWebhookByUrl (stripe, url) {
  let startingAfter;
  for (let i = 0; i < 10; i++) {
    const list = await stripe.webhookEndpoints.list({ limit: 100, starting_after: startingAfter });
    const hit = list.data.find(w => w.url === url);
    if (hit) return hit;
    if (!list.has_more) break;
    startingAfter = list.data[list.data.length - 1].id;
  }
  return null;
}

async function main () {
  const noDeploy = process.argv.includes('--no-deploy');
  const secretKey = getSecretKey();
  if (!secretKey) {
    console.error('\n❌ STRIPE_SECRET_KEY não encontrada. Rode npm run setup:stripe primeiro.\n');
    process.exit(1);
  }

  const webhookUrl = SITE_URL.replace(/\/$/, '') + WEBHOOK_PATH;
  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
  const mode = secretKey.includes('_test_') ? 'TESTE' : 'PRODUÇÃO';

  console.log('\n=== MedHub — webhook Stripe (' + mode + ') ===\n');
  console.log('URL:', webhookUrl, '\n');

  let endpoint = await findWebhookByUrl(stripe, webhookUrl);
  if (endpoint) {
    endpoint = await stripe.webhookEndpoints.update(endpoint.id, {
      enabled_events: EVENTS,
      disabled: false
    });
    console.log('✓ Webhook já existia, eventos atualizados:', endpoint.id);
  } else {
    endpoint = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: EVENTS,
      description: 'MedHub Pro — assinaturas'
    });
    console.log('✓ Webhook criado:', endpoint.id);
  }

  const signingSecret = endpoint.secret;
  if (!signingSecret) {
    console.error('\n❌ Stripe não retornou signing secret. Veja Dashboard → Developers → Webhooks.\n');
    process.exit(1);
  }

  upsertEnvFile('STRIPE_WEBHOOK_SECRET', signingSecret);
  console.log('✓ STRIPE_WEBHOOK_SECRET gravado em .env');

  console.log('\n☁️  Enviando STRIPE_WEBHOOK_SECRET para a Vercel...\n');
  pushToVercel('STRIPE_WEBHOOK_SECRET', signingSecret);
  console.log('✓ Variável enviada (production + preview)');

  if (noDeploy) {
    console.log('\n✅ Webhook configurado (deploy omitido).\n');
    return;
  }

  console.log('\n🚀 Publicando em produção...\n');
  const deploy = run('npx', ['vercel', 'deploy', '--prod', '--yes']);
  if (deploy.status !== 0) {
    console.error('\n⚠️  Deploy falhou. Rode: npx vercel deploy --prod\n');
    process.exit(1);
  }

  console.log('\n✅ Webhook configurado.');
  console.log('   Teste no Stripe Dashboard → Webhooks →', endpoint.id);
  console.log('   Endpoint:', webhookUrl, '\n');
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message || err);
  process.exit(1);
});
