#!/usr/bin/env node
/**
 * Configura e-mail de recuperação de senha (Resend) na Vercel.
 *
 * 1. Crie conta em https://resend.com
 * 2. API Keys → Create → copie re_...
 * 3. Salve em resend-key.local.txt (uma linha) OU:
 *    set RESEND_API_KEY=re_...
 * 4. npm run setup:resend
 *
 * Sem domínio verificado: só envia para o e-mail da sua conta Resend (teste).
 * Produção: verifique domínio em Resend e use MEDHUB_EMAIL_FROM=MedHub <contato@seudominio.com.br>
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const DEFAULT_FROM = 'MedHub <onboarding@resend.dev>';
const ENVS = ['production', 'preview'];

function run (cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: opts.silent ? 'pipe' : 'inherit',
    env: { ...process.env, ...opts.env }
  });
}

function getApiKey () {
  if (process.env.RESEND_API_KEY?.startsWith('re_')) {
    return process.env.RESEND_API_KEY.trim();
  }

  const keyFile = path.join(ROOT, 'resend-key.local.txt');
  if (fs.existsSync(keyFile)) {
    const line = fs.readFileSync(keyFile, 'utf8').split(/\r?\n/).find(l => l.trim().startsWith('re_'));
    if (line) return line.trim();
  }

  if (fs.existsSync(ENV_PATH)) {
    const match = fs.readFileSync(ENV_PATH, 'utf8').match(/^RESEND_API_KEY=(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }

  return null;
}

function vercelEnvSet (name, value, sensitive) {
  for (const envName of ENVS) {
    const args = [
      'vercel', 'env', 'add', name, envName,
      '--value', value,
      '--yes', '--force'
    ];
    if (sensitive) args.push('--sensitive');
    else args.push('--no-sensitive');
    run('npx', args, { silent: true });
  }
}

function upsertEnvFile (key, value) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const re = new RegExp('^' + key + '=.*$', 'm');
  const line = key + '=' + value;
  content = re.test(content) ? content.replace(re, line) : content + (content.endsWith('\n') || !content ? '' : '\n') + line + '\n';
  fs.writeFileSync(ENV_PATH, content, 'utf8');
}

async function testResend (apiKey, from) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: ['delivered@resend.dev'],
      subject: 'MedHub — teste Resend',
      html: '<p>Configuração Resend OK.</p>'
    })
  });
  return { ok: res.ok, status: res.status, body: await res.text() };
}

async function main () {
  console.log('\n=== MedHub — setup Resend (e-mail) ===\n');

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ Chave Resend não encontrada.\n');
    console.error('1. https://resend.com/api-keys → Create API Key');
    console.error('2. Cole em resend-key.local.txt (uma linha: re_...)');
    console.error('3. Rode de novo: npm run setup:resend\n');
    process.exit(1);
  }

  const from = process.env.MEDHUB_EMAIL_FROM || DEFAULT_FROM;

  console.log('☁️  Enviando variáveis para a Vercel...\n');
  vercelEnvSet('RESEND_API_KEY', apiKey, true);
  vercelEnvSet('MEDHUB_EMAIL_FROM', from, false);
  console.log('  ✓ RESEND_API_KEY');
  console.log('  ✓ MEDHUB_EMAIL_FROM=' + from);

  upsertEnvFile('RESEND_API_KEY', apiKey);
  upsertEnvFile('MEDHUB_EMAIL_FROM', from);
  console.log('\n✓ Gravado em .env (local)\n');

  console.log('📧 Testando API Resend...');
  const test = await testResend(apiKey, from);
  if (test.ok) {
    console.log('✓ Resend respondeu OK\n');
  } else {
    console.warn('⚠️  Teste Resend:', test.status, test.body.slice(0, 200), '\n');
  }

  console.log('🚀 Publicando...\n');
  const deploy = run('npx', ['vercel', 'deploy', '--prod', '--yes']);
  if (deploy.status !== 0) {
    console.error('Deploy falhou. Rode: npx vercel deploy --prod');
    process.exit(1);
  }

  console.log('\n✅ Pronto! Teste: https://meu-app-medico.vercel.app/reset-password.html');
  console.log('   /api/auth/config → passwordResetEnabled: true\n');
  console.log('Nota: sem domínio verificado no Resend, e-mails só vão para o e-mail da sua conta Resend.\n');
}

main().catch(err => {
  console.error('\n❌', err.message || err);
  process.exit(1);
});
