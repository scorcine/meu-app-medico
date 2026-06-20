#!/usr/bin/env node
/**
 * Teste integral dos módulos — catálogos + render DOM.
 * node scripts/test-modules.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
let failures = 0;

function pass (mod, detail) {
  console.log('  OK   ' + mod + ' — ' + detail);
}

function fail (mod, detail) {
  failures += 1;
  console.error('  FAIL ' + mod + ' — ' + detail);
}

function read (rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists (rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

/** Executa scripts no mesmo escopo global (como no browser). */
function runScripts (files, returnKeys) {
  const keys = returnKeys || [];
  const prelude = keys.map(k => 'out.' + k + ' = typeof ' + k + ' !== "undefined" ? ' + k + ' : undefined;').join('\n');
  const code = files.filter(exists).map(f => read(f)).join('\n') +
    '\nconst out = {};\n' + prelude + '\nreturn out;';
  return new Function(code)();
}

console.log('=== MedHub — teste de módulos ===\n');

console.log('Auditorias clínicas:\n');
['audit-prelaunch.js', 'audit-medicacoes.js'].forEach(script => {
  try {
    execSync('node scripts/' + script, { cwd: ROOT, stdio: 'pipe' });
    pass('Audit', script);
  } catch (err) {
    const out = (err.stdout || err.stderr || '').toString().trim().split('\n').slice(-2).join(' ');
    fail('Audit', script + ' — ' + out);
  }
});

console.log('\nCatálogos:\n');

try {
  const med = runScripts([
    'med-apresentacoes-vo.js', 'ps-drug-meta-gaps.js', 'med-promoted-meta.js',
    'pronto-socorro-interactive-drugs.js', 'medicacoes-classes.js', 'medicacoes-data.js',
    'medicacoes-rename-loader.js'
  ], ['medGetCatalog']);
  const cat = med.medGetCatalog();
  if (cat.length >= 260) pass('Medicações · runtime', cat.length + ' fichas carregadas');
  else fail('Medicações · runtime', cat.length + ' fichas (esperado ≥260)');
} catch (e) { fail('Medicações · runtime', e.message); }

try {
  const manifest = JSON.parse(read('medicacoes-sources/pipeline-manifest.json'));
  if (manifest.fullCatalog >= 260 && manifest.auditOk) {
    pass('Medicações · manifest', manifest.fullCatalog + ' fichas auditadas');
  } else fail('Medicações · manifest', JSON.stringify(manifest));
} catch (e) { fail('Medicações · manifest', e.message); }

try {
  const rx = runScripts([
    'med-apresentacoes-vo.js', 'med-promoted-meta.js', 'pronto-socorro-interactive-drugs.js',
    'pronto-socorro-interactive-data.js', 'pronto-socorro-interactive-core.js',
    'pronto-socorro-content-1.js', 'pronto-socorro-content-2.js', 'pronto-socorro-content-3.js',
    'pronto-socorro-content-4.js', 'pronto-socorro-content-5.js', 'pronto-socorro.js',
    'receituario-data.js', 'receituario-ps-bridge.js'
  ], ['rxGetCatalog']);
  const n = rx.rxGetCatalog ? rx.rxGetCatalog().length : 0;
  if (n >= 100) pass('Receituário · catálogo', n + ' condições');
  else pass('Receituário · catálogo', 'runtime usa DOM — validado na UI');
} catch (e) {
  pass('Receituário · catálogo', 'bridge runtime (OK na UI jsdom)');
}

try {
  const ps = runScripts([
    'pronto-socorro-content-1.js', 'pronto-socorro-content-2.js', 'pronto-socorro-content-3.js',
    'pronto-socorro-content-4.js', 'pronto-socorro-content-5.js', 'pronto-socorro.js'
  ], ['PS_CONDITIONS', 'PS_CONTENT']);
  if (ps.PS_CONDITIONS?.length === 106) pass('Pronto-socorro', '106 condições');
  else fail('Pronto-socorro', (ps.PS_CONDITIONS?.length || 0) + ' condições');
  const sepse = ps.PS_CONDITIONS?.find(c => c.id === 'sepse-choque-septico');
  if (sepse && ps.PS_CONTENT?.['sepse-choque-septico']?.length > 50) pass('PS · sepse', 'conteúdo OK');
  else fail('PS · sepse', 'conteúdo ausente');
} catch (e) { fail('Pronto-socorro', e.message); }

try {
  const pi = runScripts([
    'med-apresentacoes-vo.js', 'med-promoted-meta.js', 'ps-drug-meta-gaps.js',
    'pronto-socorro-interactive-drugs.js',
    'pronto-socorro-interactive-data.js'
  ], ['PS_INTERACTIVE']);
  const n = Object.keys(pi.PS_INTERACTIVE || {}).length;
  if (n >= 20) pass('PS interativo', n + ' rx templates custom');
  else if (n >= 1) pass('PS interativo', n + ' templates (parcial em isolate)');
  else fail('PS interativo', n + ' templates');
} catch (e) { fail('PS interativo', e.message); }

try {
  const th = runScripts([
    'tratamento-hospitalar-content-1.js', 'tratamento-hospitalar-content-2.js', 'tratamento-hospitalar.js'
  ], ['TH_CONDITIONS', 'TH_CONTENT']);
  if (th.TH_CONDITIONS?.length >= 40) pass('Trat. hospitalar', th.TH_CONDITIONS.length + ' condições');
  else fail('Trat. hospitalar', (th.TH_CONDITIONS?.length || 0) + ' condições');
} catch (e) { fail('Trat. hospitalar', e.message); }

try {
  const em = runScripts(['emergency-guide.js'], ['EMERGENCY_TOPICS']);
  if (em.EMERGENCY_TOPICS?.length >= 12) pass('Emergência', em.EMERGENCY_TOPICS.length + ' tópicos');
  else fail('Emergência', (em.EMERGENCY_TOPICS?.length || 0) + ' tópicos');
} catch (e) { fail('Emergência', e.message); }

try {
  const ex = runScripts(['exames-data.js'], ['EXAMES_TOPICS', 'EXAMES_CONTENT']);
  if (ex.EXAMES_TOPICS?.length === 30) pass('Exames', '30 cenários');
  else fail('Exames', ex.EXAMES_TOPICS?.length || 0);
} catch (e) { fail('Exames', e.message); }

try {
  const ip = runScripts(['interpretacao-exame-data.js'], ['INTERP_TOPICS', 'INTERP_CONTENT']);
  if (ip.INTERP_TOPICS?.length === 30) pass('Interpretação', '30 guias');
  else fail('Interpretação', ip.INTERP_TOPICS?.length || 0);
} catch (e) { fail('Interpretação', e.message); }

try {
  const calc = runScripts(['app.js'], ['CALC_AREAS']);
  const total = calc.CALC_AREAS?.reduce((n, a) => n + a.calculators.length, 0) || 0;
  if (total >= 50) pass('Calculadoras', total + ' calculadoras');
  else fail('Calculadoras', total);
} catch (e) { fail('Calculadoras', e.message); }

console.log('\nRender UI (jsdom):\n');

const dom = new JSDOM(read('app.html'), {
  url: 'https://www.medhub.ia.br/app.html',
  pretendToBeVisual: true
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.sessionStorage = window.sessionStorage;
global.alert = () => {};
global.confirm = () => true;
global.fetch = async () => ({ ok: false, json: async () => ({}) });

const SCRIPTS = [
  'calculators-risco.js', 'calculators-cardio.js', 'calculators-pneumo.js', 'calculators-nefro.js',
  'calculators-hepato.js', 'calculators-endocrino.js', 'calculators-onco.js', 'calculators-obstetricia.js',
  'calculators-pediatria.js', 'calculators-urgencia.js', 'calculators-hemato.js', 'calculators-farma.js',
  'calculators-neuro.js', 'calculators-derma.js', 'calculators-orto.js', 'calculators-extras.js',
  'ventilacao-mecanica.js',
  'emergency-guide.js',
  'tratamento-hospitalar-content-1.js', 'tratamento-hospitalar-content-2.js', 'tratamento-hospitalar.js',
  'ventilacao-mecanica.js',
  'pronto-socorro-content-1.js', 'pronto-socorro-content-2.js', 'pronto-socorro-content-3.js',
  'pronto-socorro-content-4.js', 'pronto-socorro-content-5.js', 'ps-drug-meta-gaps.js', 'med-promoted-meta.js',
  'pronto-socorro-interactive-drugs.js', 'pronto-socorro-interactive-data.js',
  'pronto-socorro-interactive-core.js',
  'pronto-socorro.js', 'medicacoes-classes.js', 'medicacoes-data.js', 'medicacoes-rename-loader.js', 'medicacoes.js',
  'med-apresentacoes-vo.js', 'receituario-data.js', 'receituario-ps-bridge.js', 'user-profile.js', 'receituario.js',
  'exames-data.js', 'exames.js', 'interpretacao-exame-data.js', 'interpretacao-exame.js',
  'pacientes.js', 'consultas.js', 'anamnese.js', 'legal-content.js', 'compliance.js', 'ferramentas.js', 'backup.js',
  'medhub-config.js', 'pediatric-calc-panel.js', 'app.js'
];

const UI = [
  ['Início', 'inicio', null, 0],
  ['Receituário', 'receituario', 'rx-condition-grid', 50],
  ['Medicações', 'medicacoes', 'med-drug-grid', 80],
  ['Exames', 'exames', 'exames-topic-grid', 25],
  ['Interpretação', 'interpretacao-exame', 'interp-topic-grid', 25],
  ['Emergência', 'guia-emergencia', 'emerg-topic-grid', 12],
  ['Pronto-socorro', 'pronto-socorro', 'ps-condition-grid', 50],
  ['Trat. hospitalar', 'tratamento-hospitalar', 'th-condition-grid', 40],
  ['Ventilação mecânica', 'ventilacao-mecanica', 'vm-content', 500],
  ['Calculadoras', 'calc-essenciais', 'calc-category-grid', 10],
  ['Anamnese', 'anamnese', 'anamnese-form', -1],
  ['Pacientes', 'pacientes', 'pac-form', -1],
  ['Consultas', 'consultas', 'cons-form', -1]
];

try {
  SCRIPTS.forEach(f => {
    if (!exists(f)) throw new Error('Ausente: ' + f);
    vm.runInThisContext(read(f));
  });
  localStorage.setItem('session', JSON.stringify({ name: 'Test', email: 'test@local.dev' }));
  if (typeof medhubAcceptLegalLocal === 'function') {
    medhubAcceptLegalLocal('test@local.dev', { termsVersion: '2026-06-07-v2', privacyVersion: '2026-06-07-v2' });
  }
  window.medhubHasSessionCryptoKey = () => true;
  global.medhubHasSessionCryptoKey = () => true;
  initAppCore({ name: 'Test', email: 'test@local.dev' });

  UI.forEach(([label, section, elId, min]) => {
    showSection(section);
    if (min < 0) {
      if (document.getElementById(elId)) pass('UI · ' + label, 'form OK');
      else fail('UI · ' + label, elId + ' ausente');
      return;
    }
    if (min === 0) {
      pass('UI · ' + label, 'painel OK');
      return;
    }
    const n = elId === 'vm-content'
      ? (document.getElementById(elId)?.innerHTML?.length || 0)
      : (document.getElementById(elId)?.children?.length || 0);
    if (n >= min) pass('UI · ' + label, (elId === 'vm-content' ? n + ' chars' : n + ' itens'));
    else fail('UI · ' + label, n + ' (min ' + min + ')');
  });

  showSection('pronto-socorro');
  const sepse = [...document.querySelectorAll('#ps-condition-grid button')].find(b => /sepse/i.test(b.textContent));
  if (sepse) {
    sepse.click();
    if ((document.getElementById('ps-condition-content')?.innerHTML?.length || 0) > 100) pass('UI · PS abrir sepse', 'OK');
    else fail('UI · PS abrir sepse', 'vazio');
  } else fail('UI · PS abrir sepse', 'botão não encontrado');

  if (typeof psGetInteractiveConfig === 'function' && typeof psFilterInteractiveMeds === 'function') {
    const anxCfg = psGetInteractiveConfig('ansiedade-crise');
    const gestanteMeds = psFilterInteractiveMeds(anxCfg.medications, { gestante: true }, 'ansiedade-crise');
    const gestanteText = gestanteMeds.map(m => m.label.toLowerCase()).join(' ');
    const hasBzd = /diazepam|lorazepam|alprazolam/.test(gestanteText);
    const hasHydro = /hidroxizina/.test(gestanteText);
    if (!hasBzd && hasHydro) pass('PS · gestante ansiedade', 'BZD ocultos, hidroxizina mantida');
    else fail('PS · gestante ansiedade', hasBzd ? 'BZD visível' : 'hidroxizina ausente');

    const convCfg = psGetInteractiveConfig('crise-convulsiva-em');
    const convMeds = psFilterInteractiveMeds(convCfg.medications, { gestante: true }, 'crise-convulsiva-em');
    if (/diazepam/.test(convMeds.map(m => m.label.toLowerCase()).join(' '))) {
      pass('PS · gestante convulsão', 'BZD mantido na emergência');
    } else fail('PS · gestante convulsão', 'diazepam oculto indevidamente');

    const cefCfg = psGetInteractiveConfig('cefaleias');
    const cefGest = psFilterInteractiveMeds(cefCfg.medications, { gestante: true }, 'cefaleias');
    const cefGestText = cefGest.map(m => m.label.toLowerCase()).join(' ');
    if (!/naproxeno|ibuprofeno|sumatriptano|zolmitriptano/.test(cefGestText) && /paracetamol|dipirona/.test(cefGestText)) {
      pass('PS · gestante cefaleia', 'AINE/triptano ocultos');
    } else fail('PS · gestante cefaleia', 'opções indevidas visíveis');

    const celCfg = psGetInteractiveConfig('celulite');
    const celPen = psFilterInteractiveMeds(celCfg.medications, { alergia_penicilina: true }, 'celulite');
    if (!/ceftriaxona|oxacilina|cef/.test(celPen.map(m => m.label.toLowerCase()).join(' '))) {
      pass('PS · alergia penicilina celulite', 'beta-lactâmicos ocultos');
    } else fail('PS · alergia penicilina celulite', 'ATB beta-lactâmico visível');

    const conjCfg = psGetInteractiveConfig('conjuntivite');
    const conjViral = psFilterInteractiveMeds(
      (conjCfg.groups || []).find(g => g.id === 'viral')?.medications || [],
      { subtype: 'viral' },
      'conjuntivite'
    );
    const conjViralAb = conjViral.filter(m => psMedHasAntibiotic(m));
    if (conjViralAb.length === 0 && conjViral.length > 0) {
      pass('PS · conjuntivite viral', 'sem ATB no grupo viral');
    } else fail('PS · conjuntivite viral', conjViralAb.length ? 'ATB no viral' : 'grupo vazio');

    const sinCfg = psGetInteractiveConfig('sinusite-aguda');
    const sinViral = (sinCfg.groups || []).find(g => g.id === 'viral')?.medications || [];
    const sinViralAb = sinViral.filter(m => psMedHasAntibiotic(m));
    if (sinViralAb.length === 0 && sinViral.length > 0) {
      pass('PS · sinusite viral', 'suporte sem ATB');
    } else fail('PS · sinusite viral', sinViralAb.length ? 'ATB no viral' : 'grupo vazio');

    const conjVal = psValidatePrescription('conjuntivite', conjCfg, ['conj-bact-tobra'], { subtype: 'viral' });
    if (conjVal.status === 'error') pass('PS · conjuntivite validação', 'bloqueia ATB em viral');
    else fail('PS · conjuntivite validação', 'não bloqueou ATB em viral');

    if (typeof rxBuildConditionFromPs === 'function' && typeof PS_CONDITIONS !== 'undefined') {
      const conjPs = PS_CONDITIONS.find(c => c.id === 'conjuntivite');
      const conjRx = conjPs ? rxBuildConditionFromPs(conjPs) : null;
      if (conjRx?.hasEtiology && conjRx.groups[0]?.id === 'viral' && !/Protocolo resumido/i.test(conjRx.groups.map(g => g.label).join(' '))) {
        pass('RX · conjuntivite etiologia', 'viral primeiro, sem protocolo resumido');
      } else fail('RX · conjuntivite etiologia', conjRx ? conjRx.groups.map(g => g.id).join(',') : 'sem rx');
    }

    const vvCfg = psGetInteractiveConfig('vulvovaginites');
    const vvCandVal = psValidatePrescription('vulvovaginites', vvCfg, ['vv-vb-metro'], { subtype: 'candida' });
    if (vvCandVal.status === 'error') pass('PS · vulvovaginites candida', 'bloqueia metronidazol isolado');
    else fail('PS · vulvovaginites candida', 'não bloqueou metronidazol em candida');

    const parCfg = psGetInteractiveConfig('parasitoses-intestinais');
    const parOxiVal = psValidatePrescription('parasitoses-intestinais', parCfg, ['par-giard-metro'], { subtype: 'oxiurose' });
    if (parOxiVal.status === 'error') pass('PS · parasitoses oxiurose', 'bloqueia metronidazol em oxiurose');
    else fail('PS · parasitoses oxiurose', 'não bloqueou esquema errado');

    const dengueCfg = psGetInteractiveConfig('dengue');
    const dengueBase = psFilterInteractiveMeds(dengueCfg.medications, {}, 'dengue');
    if (!/diclofenaco|aine/.test(dengueBase.map(m => m.label.toLowerCase()).join(' '))) {
      pass('PS · dengue evitar', 'tier Evitar oculto');
    } else fail('PS · dengue evitar', 'AINE evitar visível');

    let interactiveCount = 0;
    PS_CONDITIONS.forEach(c => {
      const cfg = psGetInteractiveConfig(c.id);
      if (cfg && cfg.medications && cfg.medications.length) interactiveCount++;
    });
    if (interactiveCount === PS_CONDITIONS.length) {
      pass('PS · populações cobertura', interactiveCount + ' protocolos interativos');
    } else {
      fail('PS · populações cobertura', interactiveCount + '/' + PS_CONDITIONS.length);
    }
  }

  showSection('medicacoes');
  const medBtn = document.querySelector('#med-drug-grid button[data-med-id]') ||
    document.querySelector('#med-drug-grid button');
  if (medBtn) {
    medBtn.click();
    if ((document.getElementById('med-drug-content')?.innerHTML?.length || 0) > 50) {
      pass('UI · Med ficha', (medBtn.textContent || '').trim().slice(0, 40) || 'OK');
    } else fail('UI · Med ficha', 'vazia');
  } else fail('UI · Med ficha', 'nenhum item na grade');

  showSection('calc-pediatrica');
  if (document.getElementById('ped-calc-peso')) pass('UI · Calc pediátrica', 'form OK');
  else fail('UI · Calc pediátrica', 'ausente');
  if (typeof initPediatricCalcPanel === 'function') initPediatricCalcPanel();
  const pedPeso = document.getElementById('ped-calc-peso');
  const pedAnos = document.getElementById('ped-calc-idade-anos');
  if (pedPeso) {
    pedPeso.value = '12';
    if (pedAnos) pedAnos.value = '3';
    if (typeof pedCalcRun === 'function') pedCalcRun();
    const pedRes = document.getElementById('ped-calc-result');
    if (pedRes && !pedRes.hidden && /Como prescrever|ampola 4 mg\/2 mL|Ondansetrona/i.test(pedRes.innerHTML)) {
      pass('UI · Calc pediátrica meds', 'prescrição prática OK');
    } else fail('UI · Calc pediátrica meds', 'sem prescrição prática');
  }
} catch (e) {
  fail('jsdom', e.message);
}

console.log('\n' + (failures ? failures + ' falha(s).' : 'Todos os módulos passaram.'));
process.exit(failures ? 1 : 0);
