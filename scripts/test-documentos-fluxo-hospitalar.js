#!/usr/bin/env node
/**
 * Documentos A4 e continuidade do Tratamento hospitalar.
 *
 * node scripts/test-documentos-fluxo-hospitalar.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
let failures = 0;

function read (rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function pass (message) {
  console.log('  OK   ' + message);
}

function fail (message) {
  failures += 1;
  console.error('  FAIL ' + message);
}

console.log('=== MedHub — documentos e fluxo hospitalar ===\n');

/* 1. Todos os geradores de documento usam A4 e margens controladas. */
const emerg = read('emergency-guide.js');
const consultas = read('consultas.js');
const hospital = read('tratamento-hospitalar.js');

if (emerg.includes('@page { size: A4; margin: 15mm; }') &&
    emerg.includes('<main class="print-document">') &&
    emerg.includes('.doc-sign { margin-top: auto;')) {
  pass('PDF de protocolo usa A4, margens fixas e assinatura no fim');
} else {
  fail('formatação A4 ausente no PDF de protocolo');
}

if (consultas.includes('@page { size: A4; margin: 15mm; }') &&
    consultas.includes('c.summaryHtml') &&
    consultas.includes('c.desfecho')) {
  pass('Atendimentos realizados reexporta o resumo estruturado com desfecho');
} else {
  fail('reexportação do atendimento perdeu formato ou desfecho');
}

if (hospital.includes('@page { size: A4; margin: 0; }') &&
    hospital.includes('min-height: 297mm') &&
    hospital.includes('Finalizar ficha e salvar paciente')) {
  pass('prescrição hospitalar mantém folha A4 e fechamento explícito');
} else {
  fail('prescrição hospitalar fora do padrão A4/fechamento');
}

/* 2. Exercita unidade → receita curada e unidade → salvar ficha. */
const dom = new JSDOM(`<!doctype html><html><body>
  <div id="th-selection-bar"></div>
  <div id="th-condition-content"></div>
</body></html>`, { url: 'https://www.medhub.ia.br/app.html' });

dom.window.Element.prototype.scrollIntoView = function () {};
dom.window.__alerts = [];
dom.window.alert = message => dom.window.__alerts.push(String(message || ''));
dom.window.__confirmed = true;
dom.window.confirm = () => dom.window.__confirmed;
dom.window.__sections = [];
dom.window.showSection = id => dom.window.__sections.push(id);
dom.window.__rxOpened = [];
dom.window.rxGetCatalogEntry = id => (
  ['asma-broncoespasmo', 'dpoc-exacerbada'].includes(id)
    ? { id, source: 'complete' }
    : { id, source: 'reference' }
);
dom.window.rxShowCombinedConditions = ids => dom.window.__rxOpened.push(...ids);
dom.window.rxGetDoctorName = () => 'Claudio Scorcine';
dom.window.rxGetStoredCrmDisplay = () => 'CRM-SP 265955';
dom.window.__saved = [];
dom.window.consultasRegisterEmergencyProtocol = async payload => {
  dom.window.__saved.push(payload);
  return { ok: true, cloudSaved: true };
};
dom.window.__finished = 0;
dom.window.novoAtendimentoFinishEncounter = () => { dom.window.__finished += 1; };
dom.window.sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
  nome: 'Paciente Teste',
  idade: '40',
  queixas: ['Dispneia'],
  startedAt: '2026-08-16T09:00:00-03:00'
}));

const context = vm.createContext(dom.window);
vm.runInContext([
  read('clinical-pathway-meta.js'),
  read('tratamento-hospitalar.js')
].join('\n'), context);

function evalIn (code) {
  return vm.runInContext(code, context);
}

const asma = evalIn(`(() => {
  currentThConditionId = 'asma-broncoespasmo';
  const panel = thEnsureNextStepPanel();
  thShowNextStep();
  const bloqueadoAntes = panel.querySelector('#th-next-step-home').disabled;
  const outcomesAntes = [...panel.querySelector('#th-next-step-outcome').options]
    .filter(o => o.value && !o.disabled).map(o => o.value);
  const improved = panel.querySelector('#th-next-step-improved');
  improved.value = 'sim';
  improved.dispatchEvent(new window.Event('change', { bubbles: true }));
  return {
    bloqueadoAntes,
    homeDisabled: panel.querySelector('#th-next-step-home').disabled,
    outcomesAntes,
    outcomes: [...panel.querySelector('#th-next-step-outcome').options]
      .filter(o => o.value && !o.disabled).map(o => o.value),
    opened: thOpenHomePrescription()
  };
})()`);

if (asma.bloqueadoAntes && !asma.outcomesAntes.includes('alta') &&
    !asma.homeDisabled && asma.opened &&
    asma.outcomes.join(',') === 'alta,observacao,internacao,transferencia' &&
    dom.window.__rxOpened.includes('asma-broncoespasmo')) {
  pass('asma exige melhora e só então segue para a receita ambulatorial curada');
} else {
  fail('transição segura para receita de casa falhou: ' + JSON.stringify(asma));
}

const eap = evalIn(`(() => {
  currentThConditionId = 'edema-pulmao-ic';
  thShowNextStep();
  const panel = document.getElementById('th-next-step');
  return {
    homeDisabled: panel.querySelector('#th-next-step-home').disabled,
    outcomes: [...panel.querySelector('#th-next-step-outcome').options]
      .filter(o => o.value && !o.disabled).map(o => o.value)
  };
})()`);

if (eap.homeDisabled && eap.outcomes.join(',') === 'observacao,internacao,transferencia') {
  pass('condição hospitalar bloqueia alta e receita domiciliar automática');
} else {
  fail('EAP permitiu saída inadequada: ' + JSON.stringify(eap));
}

const finalizePromise = evalIn(`(async () => {
  currentThConditionId = 'asma-broncoespasmo';
  thShowNextStep();
  document.getElementById('th-next-step-outcome').value = 'alta';
  return thFinalizeEncounter();
})()`);

Promise.resolve(finalizePromise).then(ok => {
  const saved = dom.window.__saved[0] || {};
  if (ok && saved.desfecho === 'alta' &&
      /Tratamento hospitalar/.test(saved.summaryHtml || '') &&
      dom.window.__finished === 1) {
    pass('finalização salva ficha, desfecho e só então encerra o paciente');
  } else {
    fail('finalização hospitalar incompleta: ' + JSON.stringify({
      ok, saved, finished: dom.window.__finished
    }));
  }

  console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
  process.exit(failures ? 1 : 0);
});
