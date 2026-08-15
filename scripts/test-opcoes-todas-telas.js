#!/usr/bin/env node
/**
 * Opções terapêuticas em todas as telas.
 * node scripts/test-opcoes-todas-telas.js
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

function pass (detail) {
  console.log('  OK   ' + detail);
}

function fail (detail) {
  failures += 1;
  console.error('  FAIL ' + detail);
}

function contextFor (html, files) {
  const dom = new JSDOM(html, { url: 'https://www.medhub.ia.br/app.html' });
  const context = vm.createContext(dom.window);
  vm.runInContext(files.map(read).join('\n'), context);
  return { dom, context, run: code => vm.runInContext(code, context) };
}

async function testHospital () {
  const ui = contextFor(`<!doctype html><html><body>
    <section id="th-list-view"></section>
    <section id="th-condition-view" hidden></section>
    <h2 id="th-condition-title"></h2>
    <div id="th-condition-content"></div>
    <button id="th-back"></button>
    <div id="th-selection-bar"><span id="th-selection-count"></span>
      <div class="rx-selection-actions">
        <button id="th-clear-selection"></button>
        <button id="th-copy-selection"></button>
        <button id="th-generate-prescription"></button>
      </div>
    </div>
  </body></html>`, [
    'tratamento-hospitalar-content-1.js',
    'tratamento-hospitalar-content-2.js',
    'tratamento-hospitalar.js'
  ]);

  await ui.run(`showTratamentoHospitalarCondition('asma-broncoespasmo', { skipGate: true })`);
  const result = ui.run(`(() => {
    const content = document.getElementById('th-condition-content');
    const meds = [...content.querySelectorAll('[data-th-med]')];
    const routeRows = [...content.querySelectorAll('.th-med-routes')]
      .filter(row => row.querySelectorAll('input[data-th-route]').length > 1);
    return {
      meds: meds.length,
      checkedMeds: meds.filter(input => input.checked).length,
      stepTitles: content.querySelectorAll('.th-med-step-title').length,
      hints: content.querySelectorAll('.th-med-choice-hint').length,
      multiRoutes: routeRows.length,
      checkedRoutes: routeRows.reduce((n, row) =>
        n + row.querySelectorAll('input[data-th-route]:checked').length, 0)
    };
  })()`);

  if (result.meds > 0 && result.checkedMeds === 0) {
    pass(`Tratamento na unidade: ${result.meds} medicamentos clicáveis e nada pré-marcado`);
  } else {
    fail('Tratamento na unidade pré-marcou medicamento: ' + JSON.stringify(result));
  }
  if (result.stepTitles > 0 && result.hints > 0) {
    pass('Tratamento na unidade agrupa e orienta a escolha por etapa');
  } else {
    fail('Tratamento na unidade sem título/dica de etapa: ' + JSON.stringify(result));
  }
  if (result.multiRoutes > 0 && result.checkedRoutes === 0) {
    pass(`${result.multiRoutes} opções com múltiplas vias aguardam escolha do usuário`);
  } else {
    fail('Via múltipla veio pré-selecionada: ' + JSON.stringify(result));
  }

  const routeChoice = ui.run(`(() => {
    const content = document.getElementById('th-condition-content');
    const item = [...content.querySelectorAll('.th-med-item')].find(node =>
      node.querySelectorAll('input[data-th-route]').length > 1
    );
    const med = item.querySelector('[data-th-med]');
    med.checked = true;
    med.dispatchEvent(new Event('change', { bubbles: true }));
    const before = {
      count: document.getElementById('th-selection-count').textContent,
      disabled: document.getElementById('th-generate-prescription').disabled
    };
    const route = item.querySelector('input[data-th-route]');
    route.checked = true;
    route.dispatchEvent(new Event('change', { bubbles: true }));
    return {
      before,
      after: {
        count: document.getElementById('th-selection-count').textContent,
        disabled: document.getElementById('th-generate-prescription').disabled
      }
    };
  })()`);

  if (routeChoice.before.disabled && /escolha a via/i.test(routeChoice.before.count)) {
    pass('Tratamento aguarda a via disponível antes de gerar');
  } else {
    fail('Tratamento não aguardou escolha da via: ' + JSON.stringify(routeChoice));
  }
  if (!routeChoice.after.disabled) pass('Escolher a via libera a prescrição');
  else fail('Prescrição não foi liberada após escolher a via');
}

function testHomePrescription () {
  const ui = contextFor('<!doctype html><html><body><div id="picker"></div></body></html>', [
    'med-apresentacoes-vo.js',
    'receituario-data.js',
    'receituario.js'
  ]);

  const result = ui.run(`(() => {
    rxSelectedMedKeys.clear();
    const option = {
      id: 'teste',
      noVoExpand: true,
      meds: [
        { id: 'dipirona', text: 'Dipirona 500 mg VO', classes: [] },
        { id: 'paracetamol', text: 'Paracetamol 750 mg VO', classes: [], exclusiveGroup: 'analgesico' },
        { id: 'ibuprofeno', text: 'Ibuprofeno 400 mg VO', classes: [], exclusiveGroup: 'analgesico' }
      ]
    };
    const picker = document.getElementById('picker');
    picker.innerHTML = rxBuildMedsPickerHtml('teste', option, 'Sintomáticos');
    const inputs = [...picker.querySelectorAll('input')];
    return {
      inputs: inputs.length,
      checked: inputs.filter(input => input.checked).length,
      radios: inputs.filter(input => input.type === 'radio').length,
      checkboxes: inputs.filter(input => input.type === 'checkbox').length
    };
  })()`);

  if (result.inputs === 3 && result.checked === 0) {
    pass('Receituário para casa: todas as opções aparecem e nada vem pré-marcado');
  } else {
    fail('Receituário marcou opção automaticamente: ' + JSON.stringify(result));
  }
  if (result.radios === 2 && result.checkboxes === 1) {
    pass('Receituário mantém alternativas OU e itens associáveis clicáveis');
  } else {
    fail('Receituário não distinguiu alternativas: ' + JSON.stringify(result));
  }

  const source = read('receituario.js');
  if (!source.includes('rxAutoSelectMedsForOption')) {
    pass('Abrir um esquema não seleciona medicamentos automaticamente');
  } else {
    fail('Ainda existe seleção automática no Receituário');
  }
}

function testEmergencyGuide () {
  const ui = contextFor(`<!doctype html><html><body>
    <div id="root">
      <h4>Conduta</h4>
      <ol class="emerg-steps">
        <li><strong>Broncodilatador</strong>
          <ul>
            <li><strong>1ª linha:</strong> salbutamol inalatório</li>
            <li><strong>Alternativa:</strong> salbutamol + ipratrópio</li>
            <li><strong>Refratário:</strong> magnésio EV</li>
          </ul>
        </li>
      </ol>
      <div class="emerg-choice-grid">
        <span class="emerg-flow-step">Opção A do grid</span>
        <span class="emerg-flow-step">Opção B do grid</span>
      </div>
    </div>
  </body></html>`, ['emergency-guide.js']);

  const result = ui.run(`(() => {
    const root = document.getElementById('root');
    initEmergProtocolExperience(root, 'teste', { id: 'opcoes', name: 'Teste' });
    const actions = [...root.querySelectorAll('[data-emerg-action]')];
    const options = [...root.querySelectorAll('[data-emerg-option][data-emerg-action]')];
    const sequenceOnly = actions.filter(action => action.dataset.emergOption == null);
    const nested = root.querySelector('[data-emerg-option]');
    const parent = nested.parentElement.closest('[data-emerg-action]');
    const gridStep = root.querySelector('.emerg-choice-grid .emerg-flow-step');
    nested.click();
    return {
      actions: actions.length,
      options: options.length,
      sequenceOnly: sequenceOnly.length,
      gridIsOption: !!gridStep?.dataset.emergOption,
      status: root.querySelector('.emerg-page-status')?.textContent || '',
      checkedInitiallyExceptClick: actions.filter(action => action !== nested && action.getAttribute('aria-checked') === 'true').length,
      nestedChecked: nested.getAttribute('aria-checked'),
      parentChecked: parent && parent.getAttribute('aria-checked'),
      hints: root.querySelectorAll('.emerg-option-hint').length
    };
  })()`);

  if (result.actions >= 6 && result.options >= 5 && result.hints === 2) {
    pass('Guia de emergência transforma etapas e alternativas em opções clicáveis');
  } else {
    fail('Guia não tornou todas as opções clicáveis: ' + JSON.stringify(result));
  }
  if (result.sequenceOnly === 1 && result.gridIsOption) {
    pass('Choice-grid e alternativas ficam fora do checklist sequencial');
  } else {
    fail('Choice-grid ainda misturado com sequência: ' + JSON.stringify(result));
  }
  if (/condutas/.test(result.status) && /opções/.test(result.status)) {
    pass('Status separa contagem de condutas e de opções');
  } else {
    fail('Status não separou condutas/opções: ' + JSON.stringify(result));
  }
  if (result.nestedChecked === 'true' && result.parentChecked === 'false' &&
      result.checkedInitiallyExceptClick === 0) {
    pass('Clicar numa alternativa não marca o passo pai nem outra opção');
  } else {
    fail('Clique em alternativa vazou para outro passo: ' + JSON.stringify(result));
  }
}

(async () => {
  console.log('=== MedHub — opções em todas as telas ===\n');
  await testHospital();
  testHomePrescription();
  testEmergencyGuide();
  console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
  process.exit(failures ? 1 : 0);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
