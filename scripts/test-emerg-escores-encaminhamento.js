#!/usr/bin/env node
/**
 * Guia de emergência: escore de decisão dentro do protocolo e encaminhamento
 * automático para o próximo protocolo ao concluir.
 * node scripts/test-emerg-escores-encaminhamento.js
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

function buildUi () {
  const dom = new JSDOM(`<!doctype html><html><body>
    <section id="emerg-categories-view"><div id="emerg-topic-grid"></div></section>
    <section id="emerg-topic-view" hidden>
      <h2 id="emerg-topic-title"></h2>
      <button id="emerg-topic-back"></button>
      <div id="emerg-topic-content"></div>
    </section>
  </body></html>`, { url: 'https://www.medhub.ia.br/app.html' });

  dom.window.Element.prototype.scrollIntoView = function () {};

  const sources = [
    'calculators-cardio.js',
    'calculators-risco.js'
  ].map(rel => fs.readFileSync(path.join(ROOT, rel), 'utf8'));

  sources.push('var CALC_FORMS = Object.assign({}, CALC_CARDIO, CALC_RISCO);');
  sources.push(fs.readFileSync(path.join(ROOT, 'emergency-guide.js'), 'utf8'));

  const context = vm.createContext(dom.window);
  vm.runInContext(sources.join('\n'), context);
  return { dom, run: code => vm.runInContext(code, context) };
}

function testScoreInsideProtocol () {
  const ui = buildUi();

  const result = ui.run(`(() => {
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('dor-inicial');
    const content = document.getElementById('emerg-topic-content');
    const heart = content.querySelector('form[data-emerg-calc="heart"]');
    const pages = [...content.querySelectorAll('.emerg-protocol-page')];
    return {
      calcIds: [...content.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc),
      heartFields: heart ? heart.querySelectorAll('select, input').length : 0,
      scorePage: pages.some(page => /Escores de decisão/.test(page.textContent)),
      preResult: heart ? heart.parentElement.querySelector('.calc-result').hidden : null
    };
  })()`);

  if (result.calcIds.includes('heart') && result.heartFields >= 5) {
    pass('Dor torácica inicial abre o HEART Score já dentro do protocolo');
  } else {
    fail('HEART Score não apareceu na dor torácica: ' + JSON.stringify(result));
  }
  if (result.calcIds.includes('grace')) {
    pass('GRACE também fica disponível para classificar a SCA');
  } else {
    fail('GRACE ausente na dor torácica: ' + JSON.stringify(result));
  }
  if (result.scorePage && result.preResult === true) {
    pass('Escores viram uma etapa do protocolo e nada é calculado sem o usuário');
  } else {
    fail('Etapa de escores não criada corretamente: ' + JSON.stringify(result));
  }

  /* jsdom não expõe form['campo']; o submit é validado aqui e o cálculo com um form simulado */
  const calculated = ui.run(`(() => {
    const heart = document.querySelector('form[data-emerg-calc="heart"]');
    heart.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const out = heart.parentElement.querySelector('.calc-result');
    const fake = {
      hist: { value: '2' }, ecg: { value: '2' }, rf: { value: '2' },
      trop: { value: '2' }, idade: { value: '70' }
    };
    return {
      hidden: out.hidden,
      submitted: out.textContent,
      computed: CALC_FORMS.heart.calculate(fake)
    };
  })()`);

  if (!calculated.hidden && /HEART Score/.test(calculated.submitted)) {
    pass('O botão de calcular dentro do protocolo devolve o resultado do escore');
  } else {
    fail('Submit do escore não devolveu resultado: ' + JSON.stringify(calculated));
  }
  if (/HEART Score:<\/strong> 10\/10/.test(calculated.computed) && /Alto/.test(calculated.computed)) {
    pass('HEART 10/10 classifica como alto risco (internação e estratificação invasiva)');
  } else {
    fail('HEART não classificou o risco: ' + JSON.stringify(calculated.computed));
  }
}

function finishProtocol (ui) {
  return ui.run(`(() => {
    const content = document.getElementById('emerg-topic-content');
    const next = content.querySelector('.emerg-page-next');
    const pages = content.querySelectorAll('.emerg-protocol-page').length;
    for (let i = 0; i < pages + 1; i++) next.click();
    const panel = document.querySelector('.emerg-protocol-next');
    return {
      title: document.getElementById('emerg-topic-title').textContent,
      panelHidden: panel ? panel.hidden : null,
      options: panel ? [...panel.querySelectorAll('[data-emerg-next]')].map(b => b.textContent.trim()) : []
    };
  })()`);
}

function testBranchingHandoff () {
  const ui = buildUi();
  ui.run(`showEmergenciaTopic('sca'); showEmergenciaProtocol('dor-inicial');`);
  const finished = finishProtocol(ui);

  if (finished.panelHidden === false && finished.options.length === 2 &&
      finished.options.join(' | ').includes('STEMI')) {
    pass('Concluir a dor torácica oferece STEMI ou NSTEMI/Angina instável');
  } else {
    fail('Encaminhamento após dor torácica falhou: ' + JSON.stringify(finished));
  }

  const navigated = ui.run(`(() => {
    document.querySelector('[data-emerg-next="0"]').click();
    return {
      title: document.getElementById('emerg-topic-title').textContent,
      calcIds: [...document.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc)
    };
  })()`);

  if (/STEMI/.test(navigated.title) && navigated.calcIds.includes('timi-stemi')) {
    pass('Escolher o ramo abre o protocolo seguinte já com seu escore');
  } else {
    fail('Ramo escolhido não abriu o protocolo: ' + JSON.stringify(navigated));
  }
}

function testSingleNextAutoOpens () {
  const ui = buildUi();
  ui.run(`showEmergenciaTopic('sepse'); showEmergenciaProtocol('norepi-map');`);
  const finished = finishProtocol(ui);

  if (/Lactato/i.test(finished.title)) {
    pass('Com um único caminho possível, concluir já abre o protocolo seguinte');
  } else {
    fail('Protocolo seguinte não abriu automaticamente: ' + JSON.stringify(finished));
  }
}

function testNoInventedScores () {
  const ui = buildUi();
  const result = ui.run(`(() => {
    showEmergenciaTopic('parada-cardio');
    showEmergenciaProtocol('bls-adulto');
    const content = document.getElementById('emerg-topic-content');
    return {
      calcIds: [...content.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc),
      scorePage: /Escores de decisão/.test(content.textContent)
    };
  })()`);

  if (!result.calcIds.length && !result.scorePage) {
    pass('Protocolo sem escore validado (BLS) não ganha calculadora inventada');
  } else {
    fail('BLS recebeu escore indevido: ' + JSON.stringify(result));
  }
}

console.log('=== MedHub — escores e encaminhamento no guia de emergência ===\n');
testScoreInsideProtocol();
testBranchingHandoff();
testSingleNextAutoOpens();
testNoInventedScores();
console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
process.exit(failures ? 1 : 0);
