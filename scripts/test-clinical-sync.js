#!/usr/bin/env node
/**
 * Teste E2E do sync clínico na nuvem — simula dois aparelhos com a mesma conta.
 *
 * Uso:
 *   node scripts/test-clinical-sync.js
 *   node scripts/test-clinical-sync.js --email teste@medhub.app --password MedHubTeste2026!
 */

const BASE = process.env.MEDHUB_SITE_URL || 'https://www.medhub.ia.br';

function parseArgs () {
  const args = process.argv.slice(2);
  const out = {
    email: process.env.MEDHUB_TEST_EMAIL || 'teste@medhub.app',
    password: process.env.MEDHUB_TEST_PASSWORD || 'MedHubTeste2026!'
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) out.email = args[++i];
    else if (args[i] === '--password' && args[i + 1]) out.password = args[++i];
  }
  return out;
}

async function login (email, password) {
  const res = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Login falhou: ' + (data.error || res.status));
  return data.token;
}

async function pushClinical (token, entries, updatedAt, force) {
  const res = await fetch(BASE + '/api/auth/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ action: 'syncClinical', entries, updatedAt, force: !!force })
  });
  return { status: res.status, data: await res.json() };
}

async function pullClinical (token) {
  const res = await fetch(BASE + '/api/auth/me?clinical=1', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Pull falhou: ' + (data.error || res.status));
  return data.clinical;
}

async function main () {
  const { email, password } = parseArgs();
  console.log('=== MedHub — teste sync clínico (2 aparelhos) ===\n');
  console.log('Conta:', email);

  const tokenA = await login(email, password);
  console.log('  OK   Aparelho A — login');

  const key = 'medhub-anamneses-' + email.toLowerCase();
  const payloadA = JSON.stringify([{ id: 'sync-test', paciente: 'Paciente Sync', savedAt: new Date().toISOString() }]);
  const t1 = new Date().toISOString();
  const pushA = await pushClinical(tokenA, { [key]: payloadA }, t1, true);
  if (pushA.status !== 200 || !pushA.data.ok) {
    throw new Error('Push A falhou: ' + JSON.stringify(pushA.data));
  }
  console.log('  OK   Aparelho A — push (' + pushA.data.entryCount + ' chaves)');

  const tokenB = await login(email, password);
  console.log('  OK   Aparelho B — login (mesma conta)');

  const cloud = await pullClinical(tokenB);
  if (!cloud?.entries?.[key]) {
    throw new Error('Aparelho B não recebeu dados do push A');
  }
  if (cloud.entries[key] !== payloadA) {
    throw new Error('Conteúdo divergente entre push A e pull B');
  }
  console.log('  OK   Aparelho B — pull confere com push A');

  const payloadB = JSON.stringify([{ id: 'sync-test-2', paciente: 'Atualizado no B', savedAt: new Date().toISOString() }]);
  const t2 = new Date(Date.now() + 1000).toISOString();
  const pushB = await pushClinical(tokenB, { [key]: payloadB }, t2, true);
  if (pushB.status !== 200) throw new Error('Push B falhou');

  const cloud2 = await pullClinical(tokenA);
  if (cloud2.entries[key] !== payloadB) {
    throw new Error('Aparelho A não viu atualização do B');
  }
  console.log('  OK   Aparelho A — pull confere com push B');

  console.log('\nSync clínico OK (push/pull bidirecional).\n');
}

main().catch(err => {
  console.error('\nFAIL', err.message || err);
  process.exit(1);
});
