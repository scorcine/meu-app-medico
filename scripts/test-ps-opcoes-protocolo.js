#!/usr/bin/env node
/**
 * Opções terapêuticas das condutas de PS.
 * Verifica que cada etapa do protocolo mostra suas alternativas clicáveis,
 * que nada vem pré-selecionado e que combinar linhas gera aviso (não bloqueio).
 *
 * node scripts/test-ps-opcoes-protocolo.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
let failures = 0;

function pass (detail) {
  console.log('  OK   ' + detail);
}

function fail (detail) {
  failures += 1;
  console.error('  FAIL ' + detail);
}

function read (rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

const files = [
  'med-apresentacoes-vo.js',
  'ps-drug-meta-gaps.js',
  'med-promoted-meta.js',
  'pronto-socorro-interactive-drugs.js',
  'pronto-socorro-interactive-data.js',
  'pronto-socorro-interactive-etiology.js',
  'pronto-socorro-interactive-core.js',
  ...fs.readdirSync(ROOT).filter(f => /^pronto-socorro-content.*\.js$/.test(f)).sort(),
  'pronto-socorro.js'
].filter(file => fs.existsSync(path.join(ROOT, file)));

const dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>', {
  url: 'https://www.medhub.ia.br/app.html'
});
const context = vm.createContext(dom.window);
vm.runInContext(files.map(read).join('\n'), context);

function evalIn (code) {
  return vm.runInContext(code, context);
}

console.log('=== MedHub — opções terapêuticas do protocolo ===\n');

/* 1. Asma: cada etapa vira um grupo com suas alternativas */
const asma = evalIn(`(() => {
  const config = psGetInteractiveConfig('asma-broncoespasmo');
  return {
    grupos: (config.groups || []).map(g => ({ label: g.label, hint: !!g.hint, opcoes: g.medications.length })),
    total: config.medications.length
  };
})()`);

if (asma.grupos.length >= 2) pass(`asma tem ${asma.grupos.length} etapas: ${asma.grupos.map(g => g.label).join(' · ')}`);
else fail(`asma ficou com ${asma.grupos.length} grupo(s) — etapas não foram separadas`);

if (asma.grupos.every(g => g.hint)) pass('toda etapa traz a dica de escolher a opção disponível');
else fail('etapa sem dica de escolha');

/* 2. Nada pré-selecionado ao abrir a conduta */
const render = evalIn(`(() => {
  const host = document.getElementById('host');
  host.innerHTML = '<div class="emerg-algo-single"></div>';
  const ok = psRenderInteractiveRx('asma-broncoespasmo', host.querySelector('.emerg-algo-single'));
  const boxes = [...host.querySelectorAll('.ps-rx-med-check')];
  return {
    ok,
    total: boxes.length,
    marcados: boxes.filter(b => b.checked).length,
    grupos: host.querySelectorAll('.ps-rx-fieldset--etiology').length,
    dicas: host.querySelectorAll('.ps-rx-group-hint').length
  };
})()`);

if (render.ok && render.total >= 6) pass(`${render.total} opções clicáveis em ${render.grupos} etapas`);
else fail(`renderização incompleta: ${JSON.stringify(render)}`);

if (render.marcados === 0) pass('nenhuma opção vem marcada — a escolha é do usuário');
else fail(`${render.marcados} opção(ões) já vinham marcadas`);

/* 3. Combinar 1ª linha e alternativa da mesma etapa avisa, não bloqueia */
const analise = evalIn(`(() => {
  const config = psGetInteractiveConfig('asma-broncoespasmo');
  const broncos = (config.groups || [])[0];
  const ids = broncos.medications.slice(0, 2).map(m => m.id);
  const res = psValidatePrescription('asma-broncoespasmo', config, ids, {});
  return {
    etapa: broncos.label,
    status: res.status,
    textos: res.messages.map(m => m.severity + ': ' + m.text)
  };
})()`);

if (analise.status === 'warning') pass(`1ª linha + alternativa em "${analise.etapa}" gera aviso (antes era erro)`);
else fail(`status inesperado ao combinar linhas: ${analise.status} — ${JSON.stringify(analise.textos)}`);

if (analise.textos.some(t => /salbutamol/i.test(t))) pass('aviso aponta a droga repetida nas duas opções');
else fail('sem aviso de droga repetida: ' + JSON.stringify(analise.textos));

/* 4. Uma opção por etapa em etapas diferentes não deve virar aviso de excesso */
const combinado = evalIn(`(() => {
  const config = psGetInteractiveConfig('asma-broncoespasmo');
  const grupos = (config.groups || []).filter(g => g.medications.length);
  const ids = grupos.slice(0, 3).map(g => g.medications[0].id);
  const res = psValidatePrescription('asma-broncoespasmo', config, ids, {});
  return { ids: ids.length, textos: res.messages.map(m => m.text) };
})()`);

if (!combinado.textos.some(t => /três ou mais opções/i.test(t))) {
  pass(`${combinado.ids} etapas com uma opção cada não gera alerta de excesso`);
} else {
  fail('alerta de excesso disparou com uma opção por etapa: ' + JSON.stringify(combinado.textos));
}

/* 4b. Conduta curada sem etapas agrupa por linha e continua avisando ao misturar linhas */
const curada = evalIn(`(() => {
  const config = psGetInteractiveConfig('cefaleias');
  const grupos = (config.groups || []).map(g => g.label);
  const primeira = (config.groups || []).find(g => /1ª linha/i.test(g.label));
  const alternativa = (config.groups || []).find(g => /alternativa/i.test(g.label));
  const ids = [primeira.medications[0].id, alternativa.medications[0].id];
  const res = psValidatePrescription('cefaleias', config, ids, { subtype: 'tensional' });
  return { grupos, status: res.status, textos: res.messages.map(m => m.text) };
})()`);

if (curada.grupos.some(label => /1ª linha/i.test(label))) pass(`cefaleias agrupada por linha: ${curada.grupos.join(' · ')}`);
else fail('cefaleias não foi agrupada por linha: ' + JSON.stringify(curada.grupos));

if (curada.textos.some(t => /uma linha por vez|linhas? diferentes/i.test(t))) {
  pass('misturar 1ª linha e alternativa ainda avisa nas condutas curadas');
} else {
  fail('sem aviso ao misturar linhas: ' + JSON.stringify(curada.textos));
}

/* 5. Todas as condutas com opções mantêm etapas nomeadas e sem grupo vazio */
const cobertura = evalIn(`(() => {
  const semEtapa = [];
  const vazio = [];
  PS_CONDITIONS.forEach(cond => {
    const config = psGetInteractiveConfig(cond.id);
    if (!config || !config.medications || !config.medications.length) return;
    const grupos = config.groups || [];
    if (!grupos.length) { semEtapa.push(cond.id); return; }
    if (grupos.some(g => !(g.medications || []).length && (g.autoStep || g.tierGroup))) vazio.push(cond.id);
  });
  return { semEtapa, vazio };
})()`);

if (!cobertura.semEtapa.length) pass('toda conduta interativa expõe suas etapas');
else fail(`${cobertura.semEtapa.length} conduta(s) sem etapas: ${cobertura.semEtapa.slice(0, 6).join(', ')}`);

if (!cobertura.vazio.length) pass('nenhuma etapa vazia gerada');
else fail(`etapas vazias em: ${cobertura.vazio.slice(0, 6).join(', ')}`);

console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
process.exit(failures ? 1 : 0);
