#!/usr/bin/env node
/**
 * Guia de emergência: escore prioritário e encaminhamento clínico.
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
    <section id="section-novo-atendimento"></section>
  </body></html>`, { url: 'https://www.medhub.ia.br/app.html' });

  dom.window.Element.prototype.scrollIntoView = function () {};
  dom.window.showSection = function () {};
  dom.window.novoAtendimentoShowStep = function () {};

  const sources = [
    'calculators-cardio.js',
    'calculators-risco.js',
    'calculators-urgencia.js',
    'calculators-neuro.js',
    'calculators-endocrino.js',
    'calculators-obstetricia.js'
  ].map(rel => fs.readFileSync(path.join(ROOT, rel), 'utf8'));

  sources.push(`
    var CALC_FORMS = Object.assign({},
      typeof CALC_CARDIO !== 'undefined' ? CALC_CARDIO : {},
      typeof CALC_RISCO !== 'undefined' ? CALC_RISCO : {},
      typeof CALC_URGENCIA !== 'undefined' ? CALC_URGENCIA : {},
      typeof CALC_NEURO !== 'undefined' ? CALC_NEURO : {},
      typeof CALC_ENDOCRINO !== 'undefined' ? CALC_ENDOCRINO : {},
      typeof CALC_OBSTETRICIA !== 'undefined' ? CALC_OBSTETRICIA : {}
    );
  `);
  sources.push(fs.readFileSync(path.join(ROOT, 'emergency-guide.js'), 'utf8'));

  const context = vm.createContext(dom.window);
  vm.runInContext(sources.join('\n'), context);
  return { dom, run: code => vm.runInContext(code, context) };
}

function pageTitles (ui) {
  return ui.run(`([...document.querySelectorAll('.emerg-protocol-page')].map(p => {
    const h4 = p.querySelector('h4');
    return h4 ? h4.textContent.trim() : (p.textContent.trim().slice(0, 40));
  }))`);
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
      options: panel ? [...panel.querySelectorAll('[data-emerg-next]')].map(b => b.textContent.trim()) : [],
      classification: sessionStorage.getItem('medhub-chest-classification')
    };
  })()`);
}

function testScorePriorityChest () {
  const ui = buildUi();
  const result = ui.run(`(() => {
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('dor-inicial');
    const content = document.getElementById('emerg-topic-content');
    const pages = [...content.querySelectorAll('.emerg-protocol-page')];
    const heartPage = pages.findIndex(page => page.querySelector('form[data-emerg-calc="heart"]'));
    const aasPage = pages.findIndex(page => /acetilsalicílico|AAS/i.test(page.textContent));
    return {
      calcIds: [...content.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc),
      heartPage,
      aasPage,
      pages: pages.map(p => (p.querySelector('h4') || { textContent: 'Condutas iniciais' }).textContent.trim())
    };
  })()`);

  if (result.calcIds.includes('heart') && !result.calcIds.includes('grace') && !result.calcIds.includes('timi-ua')) {
    pass('Dor torácica prioriza HEART e não inventa GRACE/TIMI na triagem');
  } else {
    fail('Escores errados na dor torácica: ' + JSON.stringify(result.calcIds));
  }
  if (result.heartPage >= 0 && (result.aasPage < 0 || result.heartPage <= result.aasPage)) {
    pass('HEART aparece antes (ou junto) da conduta com AAS');
  } else {
    fail('HEART ainda vem depois da conduta: ' + JSON.stringify(result));
  }
}

function testScoreEarlyNstemiSepse () {
  const ui = buildUi();
  const nstemi = ui.run(`(() => {
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('nstemi-ua');
    const pages = [...document.querySelectorAll('.emerg-protocol-page')];
    const scorePage = pages.findIndex(p => /Classificar com escores|GRACE/i.test(p.querySelector('h4')?.textContent || '') && p.querySelector('form[data-emerg-calc="grace"]'));
    const drugPage = pages.findIndex(p => /Conduta após a estratificação/i.test(p.textContent));
    return {
      calcIds: [...document.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc),
      scorePage,
      drugPage
    };
  })()`);

  if (nstemi.calcIds.includes('grace') && !nstemi.calcIds.includes('timi-ua') &&
      nstemi.scorePage >= 0 && nstemi.scorePage < nstemi.drugPage) {
    pass('NSTEMI coloca GRACE antes da anticoagulação e não inventa TIMI');
  } else {
    fail('Ordem NSTEMI incorreta: ' + JSON.stringify(nstemi));
  }

  const sepse = ui.run(`(() => {
    showEmergenciaTopic('sepse');
    showEmergenciaProtocol('bundle-hora1');
    const pages = [...document.querySelectorAll('.emerg-protocol-page')];
    const scorePage = pages.findIndex(p => p.querySelector('form[data-emerg-calc="qsofa"]'));
    const bundlePage = pages.findIndex(p => /Bundle Hora-1/i.test(p.querySelector('h4')?.textContent || ''));
    return { scorePage, bundlePage, calcIds: [...document.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc) };
  })()`);

  if (sepse.calcIds.includes('qsofa') && sepse.calcIds.includes('sofa') &&
      sepse.scorePage >= 0 && sepse.scorePage < sepse.bundlePage) {
    pass('Sepse reconhece com qSOFA/SOFA antes do bundle');
  } else {
    fail('Ordem sepse incorreta: ' + JSON.stringify(sepse));
  }
}

function testNoInventedStemiTimi () {
  const ui = buildUi();
  const result = ui.run(`(() => {
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('stemi');
    return [...document.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc);
  })()`);
  if (!result.includes('timi-stemi')) {
    pass('STEMI não ganha TIMI inventado pelo texto ausente');
  } else {
    fail('TIMI STEMI ainda foi injetado: ' + JSON.stringify(result));
  }
}

function testStemiGuidedMedicationFlow () {
  const ui = buildUi();
  const result = ui.run(`(() => {
    sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
      nome: 'Paciente teste', idade: '78 anos', queixas: ['Dor torácica']
    }));
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('stemi');

    document.querySelector('[data-stemi-open="contra"]').click();
    const contraItems = document.querySelectorAll('.emerg-stemi-contra-list li').length;
    document.querySelector('[data-stemi-contra="clear"]').click();
    const fibrinolyticTrigger = document.querySelector('[data-stemi-open="fibrinolytic"]');
    const unlocked = fibrinolyticTrigger.getAttribute('aria-disabled') === 'false';

    fibrinolyticTrigger.click();
    const fibrinolyticPanel = document.querySelector('[data-stemi-panel="fibrinolytic"]');
    fibrinolyticPanel.querySelector('[data-stemi-weight]').value = '72';
    fibrinolyticPanel.querySelector('[data-stemi-fibrinolytic="tenecteplase"]').click();
    const tenecteplase = fibrinolyticPanel.querySelector('[data-stemi-result]').textContent;

    document.querySelector('[data-stemi-open="p2y12-pci"]').click();
    const pciPanel = document.querySelector('[data-stemi-panel="p2y12-pci"]');
    pciPanel.querySelector('[data-stemi-p2="ticagrelor"]').click();
    const ticagrelor = pciPanel.querySelector('[data-stemi-result]').textContent;

    document.querySelector('[data-stemi-open="p2y12-lysis"]').click();
    const lysisPanel = document.querySelector('[data-stemi-panel="p2y12-lysis"]');
    const lysisChoices = lysisPanel.querySelectorAll('[data-stemi-p2]').length;
    lysisPanel.querySelector('[data-stemi-p2="clopidogrel"]').click();
    const clopidogrel = lysisPanel.querySelector('[data-stemi-result]').textContent;

    return { contraItems, unlocked, tenecteplase, ticagrelor, lysisChoices, clopidogrel };
  })()`);

  if (result.contraItems >= 8 && result.unlocked) {
    pass('STEMI exige revisão das contraindicações antes de liberar o fibrinolítico');
  } else {
    fail('Gate de contraindicações do STEMI falhou: ' + JSON.stringify(result));
  }
  if (/20 mg \(4 mL\)/i.test(result.tenecteplase) && /meia dose/i.test(result.tenecteplase)) {
    pass('Tenecteplase calcula dose e volume automaticamente por peso e idade');
  } else {
    fail('Cálculo da tenecteplase incorreto: ' + JSON.stringify(result.tenecteplase));
  }
  if (/180 mg/i.test(result.ticagrelor) && /não diluir/i.test(result.ticagrelor)) {
    pass('Escolha do P2Y12 para ICP mostra dose e preparo imediatamente');
  } else {
    fail('Dose do P2Y12 para ICP ausente: ' + JSON.stringify(result.ticagrelor));
  }
  if (result.lysisChoices === 1 && /75 mg VO agora, sem dose de ataque/i.test(result.clopidogrel)) {
    pass('Fibrinólise limita P2Y12 ao clopidogrel e ajusta a dose para >75 anos');
  } else {
    fail('P2Y12 da fibrinólise incorreto: ' + JSON.stringify(result));
  }
}

function testGraceStaysEarly () {
  const ui = buildUi();
  const nstemi = ui.run(`(() => {
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('nstemi-ua');
    const pages = [...document.querySelectorAll('.emerg-protocol-page')];
    return {
      gracePage: pages.findIndex(p => p.querySelector('form[data-emerg-calc="grace"]')),
      total: pages.length
    };
  })()`);
  if (nstemi.gracePage >= 0 && nstemi.gracePage < nstemi.total - 1) {
    pass('GRACE fica nas etapas iniciais do NSTEMI, nunca como última');
  } else {
    fail('GRACE ficou no fim do NSTEMI: ' + JSON.stringify(nstemi));
  }

  const ecg = ui.run(`(() => {
    showEmergenciaProtocol('ecg-modelos');
    return [...document.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc);
  })()`);
  if (!ecg.includes('grace')) {
    pass('Revisão de ECG não pede GRACE de novo no fim do fluxo');
  } else {
    fail('GRACE reaparece na revisão de ECG: ' + JSON.stringify(ecg));
  }
}

function testClosureSummary () {
  const ui = buildUi();
  const result = ui.run(`(() => {
    sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
      nome: 'Maria Teste', idade: '61 anos', sexo: 'Feminino', queixas: ['Dor torácica']
    }));
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('nstemi-ua');

    const content = document.getElementById('emerg-topic-content');
    const firstAction = content.querySelector('[data-emerg-action]');
    const acao = firstAction.textContent.replace(/\\s+/g, ' ').trim();
    firstAction.click();

    const next = content.querySelector('.emerg-page-next');
    const pages = content.querySelectorAll('.emerg-protocol-page').length;
    for (let i = 0; i < pages; i++) next.click();

    const closure = content.querySelector('.emerg-protocol-closure');
    const confirmacoes = [...closure.querySelectorAll('[data-emerg-closure]')].map(b => b.dataset.emergClosure);
    closure.querySelector('[data-emerg-closure="hemodinamica"]').click();
    closure.querySelector('[data-emerg-summary]').click();

    const resumo = closure.querySelector('[data-emerg-summary-out]');
    return {
      closureVisible: !closure.hidden,
      confirmacoes,
      titulo: document.getElementById('emerg-topic-title').textContent,
      acao,
      resumo: resumo.textContent.replace(/\\s+/g, ' ').trim(),
      podeImprimir: !!resumo.querySelector('[data-emerg-print]'),
      podeCopiar: !!resumo.querySelector('[data-emerg-copy]'),
      proximoVisivel: !document.querySelector('.emerg-protocol-next').hidden
    };
  })()`);

  if (result.closureVisible && result.confirmacoes.join(',') === 'medicacao,hemodinamica,transferencia,reavaliacao') {
    pass('Concluir pede confirmação de medicação, hemodinâmica, transferência e reavaliação');
  } else {
    fail('Etapa de confirmação ausente: ' + JSON.stringify(result));
  }
  if (/NSTEMI/i.test(result.titulo) && !/ECG/i.test(result.titulo)) {
    pass('Concluir não pula sozinho para outro protocolo');
  } else {
    fail('Protocolo avançou sem confirmação: ' + JSON.stringify(result.titulo));
  }
  if (result.resumo.includes('Maria Teste') &&
      result.resumo.includes('Hemodinâmica acionada') &&
      result.resumo.includes(result.acao) &&
      result.podeImprimir && result.podeCopiar) {
    pass('Resumo final documenta paciente, condutas e confirmações com imprimir/copiar');
  } else {
    fail('Resumo final incompleto: ' + JSON.stringify(result));
  }
  if (result.proximoVisivel) {
    pass('Depois do resumo o próximo protocolo continua disponível como escolha');
  } else {
    fail('Encaminhamento desapareceu após o resumo: ' + JSON.stringify(result));
  }
}

function testStemiReperfusionBeforeFinalize () {
  const ui = buildUi();
  const result = ui.run(`(() => {
    showEmergenciaTopic('sca');
    showEmergenciaProtocol('stemi');
    const content = document.getElementById('emerg-topic-content');
    const next = content.querySelector('.emerg-page-next');
    const pages = content.querySelectorAll('.emerg-protocol-page').length;
    for (let i = 0; i < pages; i++) next.click();

    content.querySelector('[data-emerg-summary]').click();
    const reperfusion = content.querySelector('[data-emerg-reperfusion]');
    const printBefore = !content.querySelector('.emerg-summary-actions').classList.contains('is-pending');
    reperfusion.querySelector('[data-emerg-reperfusion-open]').click();
    const criteria = reperfusion.querySelector('[data-emerg-reperfusion-panel]').textContent;
    reperfusion.querySelector('[data-emerg-reperfusion-value="failure"]').click();
    const finalizeVisible = !reperfusion.querySelector('[data-emerg-finalize]').hidden;
    reperfusion.querySelector('[data-emerg-finalize]').click();

    return {
      reperfusionVisible: !reperfusion.hidden,
      printBefore,
      criteria,
      finalizeVisible,
      finalized: !reperfusion.querySelector('[data-emerg-finalized-status]').hidden,
      summary: content.querySelector('[data-emerg-summary-out]').textContent,
      printAfter: !content.querySelector('.emerg-summary-actions').classList.contains('is-pending'),
      hasUnexpectedNext: !content.querySelector('.emerg-protocol-next').hidden
    };
  })()`);

  if (result.reperfusionVisible && !result.printBefore &&
      /redução ≥50%|reducao ≥50%/i.test(result.criteria) &&
      /ICP de resgate/i.test(result.criteria)) {
    pass('STEMI exige critérios de reperfusão antes de liberar impressão/finalização');
  } else {
    fail('Etapa de reperfusão incompleta: ' + JSON.stringify(result));
  }
  if (result.finalizeVisible && result.finalized && result.printAfter &&
      /Falha ou suspeita de falha de reperfusão/i.test(result.summary)) {
    pass('Resultado da reperfusão entra no resumo e libera Finalizar protocolo');
  } else {
    fail('Finalização após reperfusão falhou: ' + JSON.stringify(result));
  }
  if (!result.hasUnexpectedNext) {
    pass('STEMI termina após reperfusão sem desviar para modelos de ECG');
  } else {
    fail('STEMI ainda oferece desvio indevido ao finalizar');
  }
}

function testBranchingHandoff () {
  const ui = buildUi();
  ui.run(`showEmergenciaTopic('sca'); showEmergenciaProtocol('dor-inicial');`);
  const finished = finishProtocol(ui);

  if (finished.panelHidden === false && finished.options.length === 3 &&
      finished.options.join(' | ').includes('STEMI') &&
      finished.options.join(' | ').includes('não cardíaca')) {
    pass('Concluir a dor torácica oferece STEMI, NSTEMI/AI ou baixo risco/não cardíaca');
  } else {
    fail('Encaminhamento após dor torácica falhou: ' + JSON.stringify(finished));
  }

  const navigated = ui.run(`(() => {
    document.querySelector('[data-emerg-next="0"]').click();
    return {
      title: document.getElementById('emerg-topic-title').textContent,
      classification: sessionStorage.getItem('medhub-chest-classification')
    };
  })()`);

  if (/STEMI/.test(navigated.title) && navigated.classification === 'stemi') {
    pass('Escolher STEMI grava a classificação e abre o protocolo');
  } else {
    fail('Ramo STEMI não abriu: ' + JSON.stringify(navigated));
  }
}

function testNoArrayFallbackAutoOpen () {
  const ui = buildUi();
  ui.run(`showEmergenciaTopic('sepse'); showEmergenciaProtocol('norepi-map');`);
  const finished = finishProtocol(ui);

  if (/Noradrenalina/i.test(finished.title) && (!finished.options || finished.options.length === 0)) {
    pass('Sem mapa clínico, concluir não abre o próximo protocolo do catálogo');
  } else {
    fail('Ainda há avanço automático por ordem: ' + JSON.stringify(finished));
  }
}

function testNoInventedScoresOnBls () {
  const ui = buildUi();
  const result = ui.run(`(() => {
    showEmergenciaTopic('parada-cardio');
    showEmergenciaProtocol('bls-adulto');
    return {
      calcIds: [...document.querySelectorAll('form[data-emerg-calc]')].map(f => f.dataset.emergCalc),
      scorePage: /Classificar com escores/.test(document.getElementById('emerg-topic-content').textContent)
    };
  })()`);

  if (!result.calcIds.length && !result.scorePage) {
    pass('Protocolo sem escore validado (BLS) não ganha calculadora inventada');
  } else {
    fail('BLS recebeu escore indevido: ' + JSON.stringify(result));
  }
}

function testReorderMtpTromboliseDka () {
  const ui = buildUi();

  const mtp = ui.run(`(() => {
    showEmergenciaTopic('trauma');
    showEmergenciaProtocol('mtp-transfusao');
    const pages = [...document.querySelectorAll('.emerg-protocol-page')];
    return {
      activate: pages.findIndex(p => /Quando acionar MTP/i.test(p.textContent)),
      txa: pages.findIndex(p => /Conduta após acionar/i.test(p.textContent))
    };
  })()`);
  if (mtp.activate >= 0 && mtp.activate < mtp.txa) pass('MTP aciona critérios antes de TXA/transfisão');
  else fail('MTP ainda trata antes de acionar: ' + JSON.stringify(mtp));

  const lise = ui.run(`(() => {
    showEmergenciaTopic('avc');
    showEmergenciaProtocol('trombolise');
    const pages = [...document.querySelectorAll('.emerg-protocol-page')];
    return {
      abs: pages.findIndex(p => /Contraindicações absolutas/i.test(p.textContent)),
      dose: pages.findIndex(p => /Dose e monitorização/i.test(p.textContent))
    };
  })()`);
  if (lise.abs >= 0 && lise.abs < lise.dose) pass('Trombólise revisa ABS/REL antes da dose de alteplase');
  else fail('Trombólise ainda doseia antes das CI: ' + JSON.stringify(lise));

  const dka = ui.run(`(() => {
    showEmergenciaTopic('reacoes-metabolicas');
    showEmergenciaProtocol('dka-hhs');
    const pages = [...document.querySelectorAll('.emerg-protocol-page')];
    return {
      diff: pages.findIndex(p => /Cetoacidose diabética vs/i.test(p.textContent)),
      tx: pages.findIndex(p => /Conduta após a classificação/i.test(p.textContent))
    };
  })()`);
  if (dka.diff >= 0 && dka.diff < dka.tx) pass('DKA/HHS classifica o fenótipo antes da insulina');
  else fail('DKA/HHS ainda trata antes de classificar: ' + JSON.stringify(dka));
}

console.log('=== MedHub — escores prioritários e encaminhamento clínico ===\n');
testScorePriorityChest();
testScoreEarlyNstemiSepse();
testNoInventedStemiTimi();
testStemiGuidedMedicationFlow();
testGraceStaysEarly();
testClosureSummary();
testStemiReperfusionBeforeFinalize();
testBranchingHandoff();
testNoArrayFallbackAutoOpen();
testNoInventedScoresOnBls();
testReorderMtpTromboliseDka();
console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
process.exit(failures ? 1 : 0);
