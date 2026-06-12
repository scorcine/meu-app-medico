#!/usr/bin/env node
/** Teste produção — login, sessão e estrutura de todos os módulos */
const BASE = 'https://meu-app-medico.vercel.app';
let failures = 0;

function pass (a, b) { console.log('  OK   ' + a + ' — ' + b); }
function fail (a, b) { console.error('  FAIL ' + a + ' — ' + b); failures++; }

const MODULES = [
  { id: 'inicio' },
  { id: 'receituario', grid: 'rx-condition-grid' },
  { id: 'medicacoes', grid: 'med-drug-grid' },
  { id: 'exames', grid: 'exames-topic-grid' },
  { id: 'interpretacao-exame', grid: 'interp-topic-grid' },
  { id: 'guia-emergencia', grid: 'emerg-topic-grid' },
  { id: 'pronto-socorro', grid: 'ps-condition-grid' },
  { id: 'tratamento-hospitalar', grid: 'th-condition-grid' },
  { id: 'calc-essenciais', grid: 'calc-category-grid' },
  { id: 'calc-pediatrica', form: 'ped-peso' },
  { id: 'anamnese', form: 'anamnese-form' },
  { id: 'pacientes', form: 'pac-form' },
  { id: 'consultas', form: 'cons-form' }
];

async function main () {
  console.log('=== MedHub — teste produção ===\n');

  const login = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'scorcine@gmail.com', password: 'MedHub2026!' })
  });
  if (!login.ok) { fail('Login', String(login.status)); process.exit(1); }
  pass('Login', '200 OK');
  const { token, subscription } = await login.json();
  if (subscription?.active) pass('Assinatura', 'ativa');
  else fail('Assinatura', JSON.stringify(subscription));

  const me = await fetch(BASE + '/api/auth/me', { headers: { Authorization: 'Bearer ' + token } });
  if (me.ok) pass('/api/auth/me', 'sessão válida');
  else fail('/api/auth/me', String(me.status));

  const billing = await fetch(BASE + '/api/billing-config');
  const bill = await billing.json();
  if (bill.checkoutEnabled) pass('Stripe', 'checkout ativo');
  else fail('Stripe', JSON.stringify(bill));

  const appHtml = await fetch(BASE + '/app.html').then(r => r.text());
  if (appHtml.includes('section-receituario')) pass('app.html', 'OK');
  else fail('app.html', 'incompleto');

  console.log('\nMódulos (painéis):\n');
  MODULES.forEach(m => {
    if (!appHtml.includes('id="section-' + m.id + '"')) {
      fail('Painel · ' + m.id, 'ausente');
      return;
    }
    if (m.grid && !appHtml.includes('id="' + m.grid + '"')) {
      fail('Grid · ' + m.id, m.grid);
      return;
    }
    if (m.form && !appHtml.includes('id="' + m.form + '"')) {
      fail('Form · ' + m.id, m.form);
      return;
    }
    pass('Módulo · ' + m.id, 'estrutura OK');
  });

  const assets = ['app.js', 'pronto-socorro.js', 'medicacoes.js', 'receituario.js', 'emergency-guide.js', 'exames.js', 'interpretacao-exame.js'];
  console.log('\nAssets JS:\n');
  for (const src of assets) {
    const r = await fetch(BASE + '/' + src);
    if (r.ok && (await r.text()).length > 500) pass('JS', src);
    else fail('JS', src + ' ' + r.status);
  }

  console.log('\n' + (failures ? failures + ' falha(s).' : 'Produção OK.'));
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
