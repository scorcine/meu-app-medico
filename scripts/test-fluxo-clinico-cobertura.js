#!/usr/bin/env node
/**
 * Cobertura do fluxo clínico por condição.
 * Garante que toda doença do PS tem schema curado, que escores não são inventados
 * e que a receita de casa nunca copia a dose hospitalar.
 *
 * node scripts/test-fluxo-clinico-cobertura.js
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
  'clinical-pathway-meta.js',
  'pronto-socorro-interactive-core.js',
  ...fs.readdirSync(ROOT).filter(f => /^pronto-socorro-content.*\.js$/.test(f)).sort(),
  'pronto-socorro.js',
  'receituario-data.js',
  'receituario-ps-bridge.js'
].filter(file => fs.existsSync(path.join(ROOT, file)));

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://www.medhub.ia.br/app.html'
});
const context = vm.createContext(dom.window);
vm.runInContext(files.map(read).join('\n'), context);

function evalIn (code) {
  return vm.runInContext(code, context);
}

console.log('=== MedHub — cobertura do fluxo clínico ===\n');

const report = evalIn('clinicalPathwayCoverageReport()');

if (report.missing.length === 0 && report.total >= 100) {
  pass(`todas as ${report.total} condições do PS têm schema clínico curado`);
} else {
  fail('faltam schemas: ' + JSON.stringify({ total: report.total, missing: report.missing }));
}

if (report.withScores.length >= 5) {
  pass(`${report.withScores.length} condições com escore explícito (sem inventar associação)`);
} else {
  fail('poucas condições com escore: ' + report.withScores.length);
}

const hospitalLeak = evalIn(`(() => {
  const leaks = [];
  rxGetCatalog().forEach(cond => {
    if (cond.source === 'complete') return;
    (cond.groups || []).forEach(g => (g.options || []).forEach(opt => {
      (opt.meds || []).forEach(m => {
        const t = String(m.text || '');
        if (/nebuliza|\\b(EV|IV|IM)\\b|4\\s*[–-]\\s*8\\s*puffs?/i.test(t) &&
            !/não copie|não gera receita|modelo ambulatorial pendente|adapte VO/i.test(t)) {
          leaks.push({ id: cond.id, text: t });
        }
      });
    }));
  });
  return leaks;
})()`);

if (!hospitalLeak.length) {
  pass('nenhuma receita de casa não-curada contém dose hospitalar');
} else {
  fail('vazamento hospital→casa: ' + JSON.stringify(hospitalLeak.slice(0, 8)));
}

const curated = evalIn(`(() => {
  return ['asma-broncoespasmo', 'dpoc-exacerbada', 'cefaleias', 'amigdalite-bacteriana', 'cistite-itu-baixa', 'lombalgia-ciatalgia', 'gonorreia-clamidia', 'violencia-sexual-pep']
    .map(id => ({ id, mode: clinicalPathwayGet(id).homeRx, source: rxGetCatalogEntry(id)?.source }));
})()`);

if (curated.every(c => c.mode === 'curated' && c.source === 'complete')) {
  pass(`${curated.length} receitas ambulatoriais curadas disponíveis para alta`);
} else {
  fail('receitas curadas inconsistentes: ' + JSON.stringify(curated));
}

const pneumonia = evalIn('clinicalPathwayGet("pneumonia-comunitaria")');
const eap = evalIn('clinicalPathwayGet("edema-agudo-pulmao")');
const sca = evalIn('clinicalPathwayGet("sca-iam")');

if (pneumonia.scores.includes('curb65') && pneumonia.requiresImprovementForDischarge &&
    eap.hospitalOnly && !eap.outcomes.includes('alta') &&
    sca.hospitalOnly && sca.scores.includes('heart')) {
  pass('pneumonia, EAP e SCA têm decisão hospitalar e desfechos coerentes');
} else {
  fail('decisões hospitalares inconsistentes: ' + JSON.stringify({ pneumonia, eap, sca }));
}

const asmaPanel = evalIn(`(() => {
  const host = document.createElement('div');
  host.innerHTML = '<div class="emerg-algo-single"></div>';
  document.body.appendChild(host);
  psRenderInteractiveRx('asma-broncoespasmo', host.querySelector('.emerg-algo-single'));
  return {
    outcomes: [...host.querySelectorAll('[data-ps-outcome]')].map(b => b.dataset.psOutcome),
    homeDisabled: host.querySelector('[data-ps-closure-action="receituario"]').disabled,
    finishLabel: host.querySelector('[data-ps-closure-action="encerrar"] strong').textContent
  };
})()`);

if (asmaPanel.outcomes.join(',') === 'alta,observacao,internacao,transferencia' &&
    asmaPanel.homeDisabled &&
    /Finalizar ficha e salvar paciente/i.test(asmaPanel.finishLabel)) {
  pass('fechamento da asma exige desfecho e bloqueia receita até a melhora');
} else {
  fail('painel de fechamento incompleto: ' + JSON.stringify(asmaPanel));
}

console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
process.exit(failures ? 1 : 0);
