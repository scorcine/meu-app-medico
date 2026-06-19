#!/usr/bin/env node
/**
 * Configura produção na Vercel de forma semi-automática:
 * 1. Stripe (produto + preços + portal) via setup-stripe
 * 2. JWT aleatório
 * 3. Envia variáveis para a Vercel (Production + Preview)
 * 4. Deploy em produção
 *
 * Pré-requisitos (uma vez):
 *   npx vercel login
 *   npx vercel link
 *   Vercel → Storage → KV → conectar ao projeto (KV não cria só via CLI)
 *
 * Uso:
 *   npm run setup:production
 *   ou setup-production.bat
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const SITE_URL = process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br';
const ENVS = ['production', 'preview'];

function log (msg) {
  console.log(msg);
}

function fail (msg) {
  console.error('\n❌ ' + msg + '\n');
  process.exit(1);
}

function run (cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: opts.silent ? 'pipe' : 'inherit',
    input: opts.input,
    env: { ...process.env, ...opts.env }
  });
  return {
    ok: res.status === 0,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    status: res.status
  };
}

function parseEnvFile (filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  fs.readFileSync(filePath, 'utf8').split(/\r?\n/).forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 1) return;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  });
  return out;
}

function ensureVercelLinked () {
  const projectJson = path.join(ROOT, '.vercel', 'project.json');
  if (fs.existsSync(projectJson)) return true;

  log('\n🔗 Projeto ainda não vinculado à Vercel. Executando vercel link...\n');
  const link = run('npx', ['vercel', 'link', '--yes'], { env: process.env });
  if (!link.ok) {
    fail('Não foi possível vincular. Rode manualmente: npx vercel login && npx vercel link');
  }
  return true;
}

function ensureStripeSetup () {
  const env = parseEnvFile(ENV_PATH);
  if (env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_MONTHLY && env.STRIPE_PRICE_ANNUAL) {
    log('✓ Stripe já configurado em .env');
    return env;
  }

  log('\n💳 Configurando Stripe (produto + preços)...\n');
  const setup = run('npm', ['run', 'setup:stripe'], { env: process.env });
  if (!setup.ok) fail('Setup Stripe falhou. Verifique stripe-key.local.txt ou STRIPE_SECRET_KEY.');

  return parseEnvFile(ENV_PATH);
}

function generateJwtSecret () {
  return crypto.randomBytes(48).toString('base64url');
}

function vercelEnvSet (name, value) {
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

function vercelEnvSetPlain (name, value) {
  for (const envName of ENVS) {
    run('npx', [
      'vercel', 'env', 'add', name, envName,
      '--value', value,
      '--yes',
      '--force',
      '--no-sensitive'
    ], { silent: true });
  }
}

function listProductionEnv () {
  const res = run('npx', ['vercel', 'env', 'list', 'production'], { silent: true });
  return res.stdout + res.stderr;
}

function pushEnvToVercel (vars) {
  log('\n☁️  Enviando variáveis para a Vercel (production + preview)...\n');

  const sensitive = new Set([
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'MEDHUB_JWT_SECRET',
    'KV_REST_API_TOKEN'
  ]);

  Object.entries(vars).forEach(([key, value]) => {
    if (!value) return;
    if (sensitive.has(key)) {
      vercelEnvSet(key, value);
    } else {
      vercelEnvSetPlain(key, value);
    }
    log('  ✓ ' + key);
  });
}

function checkKvLinked () {
  const listing = listProductionEnv();
  const hasUrl = /KV_REST_API_URL/i.test(listing);
  const hasToken = /KV_REST_API_TOKEN/i.test(listing);
  return hasUrl && hasToken;
}

function tryInstallKvIntegration () {
  log('\n🗄️  Tentando criar KV (Upstash) via Vercel CLI...\n');
  const region = process.env.MEDHUB_KV_REGION || 'gru1';
  const res = run('npx', [
    'vercel', 'integration', 'add', 'upstash/upstash-kv',
    '-m', 'primaryRegion=' + region,
    '-p', 'free',
    '-n', 'medhub-kv',
    '--claim',
    '--non-interactive'
  ], { silent: true });

  const out = (res.stdout || '') + (res.stderr || '');
  if (res.ok || checkKvLinked()) {
    log('✓ KV provisionado e conectado\n');
    return true;
  }

  const termsMatch = out.match(/https:\/\/vercel\.com[^\s"]+accept-terms\/upstash[^\s"]*/i);
  if (/integration_terms_acceptance_required/i.test(out) && termsMatch) {
    log('⚠️  Aceite os termos do marketplace Upstash (uma vez):\n');
    log('   ' + termsMatch[0] + '\n');
    log('Depois rode de novo: npm run setup:production\n');
    return false;
  }

  if (/action_required/i.test(out)) {
    log('⚠️  Ação manual necessária na Vercel. Saída:\n' + out.slice(0, 800) + '\n');
  }
  return checkKvLinked();
}

function openKvHelp () {
  log('\n⚠️  KV (login na nuvem) ainda não está no projeto.\n');
  log('Opção A — CLI (recomendado): aceite os termos Upstash e rode:');
  log('  npm run setup:production\n');
  log('Opção B — Dashboard:');
  log('  1. Vercel Dashboard → seu projeto → Storage');
  log('  2. Create Database → KV (Upstash) → Connect to project');
  log('  3. Rode de novo: npm run setup:production\n');
  log('URL: https://vercel.com/dashboard → meu-app-medico → Storage\n');
}

async function main () {
  log('\n=== MedHub — setup automático de produção ===\n');

  ensureVercelLinked();
  const stripeEnv = ensureStripeSetup();

  const jwt = stripeEnv.MEDHUB_JWT_SECRET || generateJwtSecret();

  const vars = {
    STRIPE_SECRET_KEY: stripeEnv.STRIPE_SECRET_KEY,
    STRIPE_PRICE_MONTHLY: stripeEnv.STRIPE_PRICE_MONTHLY,
    STRIPE_PRICE_ANNUAL: stripeEnv.STRIPE_PRICE_ANNUAL,
    MEDHUB_SITE_URL: stripeEnv.MEDHUB_SITE_URL || SITE_URL,
    MEDHUB_PRICE_MONTHLY_CENTS: stripeEnv.MEDHUB_PRICE_MONTHLY_CENTS || '2990',
    MEDHUB_PRICE_ANNUAL_CENTS: stripeEnv.MEDHUB_PRICE_ANNUAL_CENTS || '30498',
    MEDHUB_PRICE_MONTHLY_DISPLAY: stripeEnv.MEDHUB_PRICE_MONTHLY_DISPLAY || 'R$ 29,90',
    MEDHUB_PRICE_ANNUAL_DISPLAY: stripeEnv.MEDHUB_PRICE_ANNUAL_DISPLAY || 'R$ 304,98',
    MEDHUB_JWT_SECRET: jwt,
    MEDHUB_TERMS_VERSION: stripeEnv.MEDHUB_TERMS_VERSION || '2026-06-07-v1',
    MEDHUB_PRIVACY_VERSION: stripeEnv.MEDHUB_PRIVACY_VERSION || '2026-06-07-v1',
    MEDHUB_GUARANTEE_DAYS: stripeEnv.MEDHUB_GUARANTEE_DAYS || '7'
  };

  if (stripeEnv.STRIPE_WEBHOOK_SECRET) {
    vars.STRIPE_WEBHOOK_SECRET = stripeEnv.STRIPE_WEBHOOK_SECRET;
  }

  pushEnvToVercel(vars);

  if (!stripeEnv.STRIPE_WEBHOOK_SECRET) {
    log('\n🔔 Configurando webhook Stripe...\n');
    const wh = run('node', [path.join(__dirname, 'setup-stripe-webhook.js'), '--no-deploy'], { silent: false });
    if (wh.ok) {
      Object.assign(stripeEnv, parseEnvFile(ENV_PATH));
      if (stripeEnv.STRIPE_WEBHOOK_SECRET) {
        pushEnvToVercel({ STRIPE_WEBHOOK_SECRET: stripeEnv.STRIPE_WEBHOOK_SECRET });
        log('✓ STRIPE_WEBHOOK_SECRET\n');
      }
    } else {
      log('⚠️  Webhook não configurado. Rode: npm run setup:stripe-webhook\n');
    }
  }

  if (!stripeEnv.MEDHUB_JWT_SECRET) {
    fs.appendFileSync(ENV_PATH, 'MEDHUB_JWT_SECRET=' + jwt + '\n', 'utf8');
    log('\n✓ MEDHUB_JWT_SECRET gravado em .env (local)\n');
  }

  const kvOk = checkKvLinked() || tryInstallKvIntegration();
  if (!kvOk) {
    openKvHelp();
    log('Stripe e JWT já foram enviados. Após conectar o KV, rode este script de novo e o deploy será feito.\n');
    log('🚀 Publicando alterações parciais (Stripe ativo, login aguarda KV)...\n');
    run('npx', ['vercel', 'deploy', '--prod', '--yes']);
    process.exit(0);
  }

  log('✓ KV detectado na Vercel (KV_REST_API_*)\n');

  log('🚀 Publicando em produção...\n');
  const deploy = run('npx', ['vercel', 'deploy', '--prod', '--yes']);
  if (!deploy.ok) fail('Deploy falhou. Tente: npx vercel deploy --prod');

  log('\n✅ Pronto! Teste: ' + SITE_URL);
  log('   Status: ' + SITE_URL + '/api/billing-config (deve mostrar ready: true)\n');
}

main().catch(err => {
  fail(err.message || String(err));
});
