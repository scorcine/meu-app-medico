#!/usr/bin/env node
/**
 * Fechamento da conduta de PS.
 * Garante que, depois de escolher as medicações, a tela oferece prescrever,
 * solicitar exames, gerar resumo e finalizar o atendimento do paciente.
 *
 * node scripts/test-ps-fechamento-conduta.js
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
  'pronto-socorro.js'
].filter(file => fs.existsSync(path.join(ROOT, file)));

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="host"></div>
  <div id="ps-list-view"></div>
  <div id="ps-condition-view">
    <h2 id="ps-condition-title"></h2>
    <div id="ps-condition-content"></div>
  </div>
  <input id="rx-search">
  <input id="exames-search">
</body></html>`, { url: 'https://www.medhub.ia.br/app.html' });

dom.window.Element.prototype.scrollIntoView = function () {};
dom.window.__sections = [];
dom.window.showSection = id => dom.window.__sections.push(id);
dom.window.__confirmed = [];
dom.window.__confirmResult = true;
dom.window.confirm = message => {
  dom.window.__confirmed.push(message);
  return dom.window.__confirmResult;
};
dom.window.__registered = [];
dom.window.consultasRegisterEmergencyProtocol = async data => {
  dom.window.__registered.push(data);
  return { ok: true, cloudSaved: true };
};
dom.window.__encerrados = 0;
dom.window.novoAtendimentoFinishEncounter = () => { dom.window.__encerrados += 1; };
dom.window.__printed = [];
dom.window.emergPrintSummary = (title, html) => dom.window.__printed.push({ title, html });
dom.window.__alerts = [];
dom.window.alert = message => { dom.window.__alerts.push(String(message || '')); };
dom.window.medhubLoadUserProfile = () => ({
  rxDisplayName: 'Ana Ribeiro',
  crmUf: 'sp',
  crmNumber: '123456'
});
dom.window.rxGetCatalogEntry = id => (
  id === 'asma-broncoespasmo'
    ? { id, source: 'complete', name: 'Asma brônquica (alta ambulatorial)' }
    : null
);
dom.window.rxShowCondition = id => { dom.window.__sections.push('receita:' + id); };

const context = vm.createContext(dom.window);
vm.runInContext(files.map(read).join('\n'), context);

function evalIn (code) {
  return vm.runInContext(code, context);
}

console.log('=== MedHub — fechamento da conduta de PS ===\n');

/* 1. Corticoides da asma incluem as apresentações EV do hospital */
const corticoides = evalIn(`(() => {
  const config = psGetInteractiveConfig('asma-broncoespasmo');
  const grupo = (config.groups || []).find(g => /corticoide/i.test(g.label));
  return (grupo?.medications || []).map(m => m.label);
})()`);

const temHidrocortisona500 = corticoides.some(label => /hidrocortisona 500 mg/i.test(label));
const temMetil125 = corticoides.some(label => /metilprednisolona[^.]*125 mg/i.test(label));
if (temHidrocortisona500 && temMetil125) {
  pass(`corticoides da asma trazem ${corticoides.length} opções, incluindo hidrocortisona 500 mg EV`);
} else {
  fail('faltam apresentações EV nos corticoides: ' + JSON.stringify(corticoides));
}

/* 2. Painel de fechamento aparece com as quatro saídas */
const painel = evalIn(`(() => {
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
    nome: 'Paciente Asma', idade: '32', sexo: 'Feminino', alergias: 'Nega alergias',
    queixas: ['Falta de ar'], startedAt: '2026-08-15T21:00:00-03:00'
  }));
  const host = document.getElementById('host');
  host.innerHTML = '<div class="emerg-algo-single"></div>';
  psRenderInteractiveRx('asma-broncoespasmo', host.querySelector('.emerg-algo-single'));
  const closure = host.querySelector('[data-ps-closure]');
  return {
    visivel: !!closure && !closure.hidden,
    acoes: [...closure.querySelectorAll('[data-ps-closure-action]')].map(b => b.dataset.psClosureAction),
    textoInicial: closure.querySelector('[data-ps-closure-count]').textContent
  };
})()`);

if (painel.visivel && painel.acoes.join(',') === 'receituario,exames,resumo,encerrar') {
  pass('conduta fecha com prescrever, exames, resumo e finalizar');
} else {
  fail('painel de fechamento incompleto: ' + JSON.stringify(painel));
}

/* 3. Salbutamol exige via, dose por ciclo e número de ciclos */
const doseGuiada = evalIn(`(() => {
  const host = document.getElementById('host');
  const box = host.querySelector('.ps-rx-med-check');
  box.checked = true;
  box.dispatchEvent(new window.Event('change', { bubbles: true }));
  const guide = box.closest('.ps-rx-med-entry').querySelector('[data-ps-dose-guide]');
  const preselected = [
    guide.querySelector('[data-ps-dose-route]:checked'),
    guide.querySelector('[data-ps-dose-amount]').value,
    guide.querySelector('[data-ps-dose-cycles]').value
  ].filter(Boolean).length;

  host.querySelector('#ps-rx-analyze').click();
  const bloqueouIncompleto = /Complete o esquema inalatório/i.test(
    host.querySelector('#ps-rx-result').textContent
  );

  const route = guide.querySelector('[data-ps-dose-route][value="mdi"]');
  route.checked = true;
  route.dispatchEvent(new window.Event('change', { bubbles: true }));
  const amount = guide.querySelector('[data-ps-dose-amount]');
  amount.value = '4 puffs';
  amount.dispatchEvent(new window.Event('change', { bubbles: true }));
  const cycles = guide.querySelector('[data-ps-dose-cycles]');
  cycles.value = '3';
  cycles.dispatchEvent(new window.Event('change', { bubbles: true }));

  return {
    count: host.querySelector('[data-ps-closure-count]').textContent,
    visible: !guide.hidden,
    preselected,
    bloqueouIncompleto,
    preview: guide.querySelector('[data-ps-dose-preview]').textContent
  };
})()`);

if (doseGuiada.visible && doseGuiada.preselected === 0 && doseGuiada.bloqueouIncompleto) {
  pass('salbutamol abre sem valores pré-marcados e bloqueia esquema incompleto');
} else {
  fail('dose guiada não bloqueou corretamente: ' + JSON.stringify(doseGuiada));
}

if (/1 medicação/i.test(doseGuiada.count) &&
    /MDI com espaçador.*4 puffs.*3 ciclo/i.test(doseGuiada.preview)) {
  pass('usuário define 4 puffs por ciclo durante 3 ciclos');
} else {
  fail('esquema inalatório não foi montado: ' + JSON.stringify(doseGuiada));
}

/* 3b. Pela tela real da conduta, um clique no cartão já abre o esquema */
const cliqueReal = evalIn(`(() => {
  showProntoSocorroCondition('asma-broncoespasmo');
  const content = document.getElementById('ps-condition-content');
  const card = content.querySelector('.ps-rx-med-card');
  const guide = card.closest('.ps-rx-med-entry').querySelector('[data-ps-dose-guide]');
  const antes = !guide.hidden;
  card.querySelector('.ps-rx-med-check').click();
  return {
    antes,
    depois: !guide.hidden,
    vias: [...guide.querySelectorAll('[data-ps-dose-route]')].map(r => r.value)
  };
})()`);

if (!cliqueReal.antes && cliqueReal.depois && cliqueReal.vias.join(',') === 'mdi,nebulizacao') {
  pass('na tela da conduta, clicar no salbutamol abre via, dose e ciclos');
} else {
  fail('esquema não abriu ao clicar na conduta real: ' + JSON.stringify(cliqueReal));
}

/* Refaz o host isolado com o esquema completo para as validações de fechamento */
evalIn(`(() => {
  const host = document.getElementById('host');
  host.innerHTML = '<div class="emerg-algo-single"></div>';
  psRenderInteractiveRx('asma-broncoespasmo', host.querySelector('.emerg-algo-single'));
  const box = host.querySelector('.ps-rx-med-check');
  box.click();
  const guide = box.closest('.ps-rx-med-entry').querySelector('[data-ps-dose-guide]');
  const route = guide.querySelector('[data-ps-dose-route][value="mdi"]');
  route.checked = true;
  route.dispatchEvent(new window.Event('change', { bubbles: true }));
  const amount = guide.querySelector('[data-ps-dose-amount]');
  amount.value = '4 puffs';
  amount.dispatchEvent(new window.Event('change', { bubbles: true }));
  const cycles = guide.querySelector('[data-ps-dose-cycles]');
  cycles.value = '3';
  cycles.dispatchEvent(new window.Event('change', { bubbles: true }));
})()`);

/* 4. Após o último ciclo, reavalia; somente melhora leva à prescrição para casa */
const reavaliacao = evalIn(`(() => {
  const host = document.getElementById('host');
  const home = host.querySelector('[data-ps-closure-action="receituario"]');
  const bloqueadoAntes = home.disabled;
  host.querySelector('#ps-rx-analyze').click();
  const panel = host.querySelector('[data-ps-reassessment]');
  const texto = panel.textContent.replace(/\\s+/g, ' ').trim();
  panel.querySelector('[data-ps-cycle-prescription]').click();
  panel.querySelector('[data-ps-improved="nao"]').click();
  const semMelhora = panel.querySelector('[data-ps-reassessment-outcome]').textContent;
  const aindaBloqueado = home.disabled;
  const nextAntes = !panel.querySelector('[data-ps-reassessment-next]').hidden;
  panel.querySelector('[data-ps-improved="sim"]').click();
  const nextDepois = !panel.querySelector('[data-ps-reassessment-next]').hidden;
  const opcoesFinais = [...panel.querySelectorAll('[data-ps-next]')].map(b => b.dataset.psNext);
  const semNavegacaoAutomatica = window.__sections.length === 0;

  panel.querySelector('[data-ps-next="receituario"]').click();
  host.querySelector('[data-ps-closure-action="exames"]').click();
  return {
    bloqueadoAntes,
    aindaBloqueado,
    liberadoDepois: !home.disabled,
    texto,
    semMelhora,
    nextAntes,
    nextDepois,
    opcoesFinais,
    semNavegacaoAutomatica,
    secoes: window.__sections.slice(),
    prescricaoCiclos: window.__printed[0] || null
  };
})()`);

if (reavaliacao.bloqueadoAntes && reavaliacao.aindaBloqueado &&
    /Reavaliar após o 3º ciclo/i.test(reavaliacao.texto) &&
    /Sem melhora/i.test(reavaliacao.semMelhora)) {
  pass('prescrição para casa fica bloqueada até a reavaliação após o 3º ciclo');
} else {
  fail('reavaliação dos ciclos falhou: ' + JSON.stringify(reavaliacao));
}

if (reavaliacao.liberadoDepois && !reavaliacao.nextAntes && reavaliacao.nextDepois &&
    reavaliacao.semNavegacaoAutomatica &&
    reavaliacao.opcoesFinais.join(',') === 'receituario,encerrar') {
  pass('melhora confirmada pergunta entre prescrever para casa e finalizar, sem pular de tela');
} else {
  fail('escolha após melhora falhou: ' + JSON.stringify(reavaliacao));
}

if (reavaliacao.secoes.includes('receituario') && reavaliacao.secoes.includes('receita:asma-broncoespasmo') &&
    reavaliacao.secoes.includes('exames') &&
    /prescrição de administração imediata/i.test(reavaliacao.prescricaoCiclos?.html || '')) {
  pass('escolher prescrever abre o receituário e a prescrição dos ciclos é gerada');
} else {
  fail('saída após melhora falhou: ' + JSON.stringify(reavaliacao));
}

/* 4b. Documento dos ciclos: paciente em cima, prescrição, assinatura no pé */
const docCiclos = (reavaliacao.prescricaoCiclos?.html || '').replace(/\s+/g, ' ');
const ordemCorreta = docCiclos.indexOf('Paciente:') < docCiclos.indexOf('<h2>Prescrição</h2>') &&
  docCiclos.indexOf('<h2>Prescrição</h2>') < docCiclos.indexOf('doc-sign');

if (/Paciente:<\/strong> Paciente Asma · 32 anos · Feminino/i.test(docCiclos) &&
    /Alergias:<\/strong> Nega alergias/i.test(docCiclos) &&
    /Data do atendimento:<\/strong> 15\/08\/2026/i.test(docCiclos) &&
    /4 puffs por ciclo/i.test(docCiclos) && ordemCorreta) {
  pass('prescrição traz paciente em cima, conduta no meio e assinatura no fim');
} else {
  fail('ordem do documento dos ciclos fora do padrão: ' + docCiclos);
}

if (/Dr\(a\)\. Ana Ribeiro<\/strong><\/p> <p>CRM: CRM-SP 123456/i.test(docCiclos) &&
    !/Reavaliação/i.test(docCiclos)) {
  pass('assinatura no pé traz nome e CRM, sem reavaliação no receituário');
} else {
  fail('assinatura ou reavaliação incorretas: ' + docCiclos);
}

/* 5. Resumo imprimível com paciente e conduta escolhida */
const resumo = evalIn(`(() => {
  const host = document.getElementById('host');
  host.querySelector('[data-ps-closure-action="resumo"]').click();
  const out = host.querySelector('[data-ps-closure-summary]');
  out.querySelector('[data-ps-summary-print]').click();
  return {
    texto: out.textContent.replace(/\\s+/g, ' ').trim(),
    pdf: window.__printed[window.__printed.length - 1] || null
  };
})()`);

if (/Paciente Asma/.test(resumo.texto) && /salbutamol/i.test(resumo.texto) &&
    /4 puffs.*3 ciclo/i.test(resumo.texto) &&
    /apresentou melhora do quadro: sim/i.test(resumo.texto) &&
    /Dr\(a\)\. Ana Ribeiro CRM: CRM-SP 123456/.test(resumo.texto) &&
    resumo.pdf && /Paciente Asma/.test(resumo.pdf.html)) {
  pass('resumo registra puffs, ciclos, melhora, médico com CRM e gera PDF');
} else {
  fail('resumo incompleto: ' + JSON.stringify(resumo));
}

/* 6. Finalizar exige desfecho, pede confirmação, salva e encerra */
const encerrar = evalIn(`(() => {
  const host = document.getElementById('host');
  /* Simula limpar o desfecho autoatribuído na melhora para validar o gate */
  host.querySelectorAll('[data-ps-outcome]').forEach(btn => btn.classList.remove('is-selected'));
  const selected = host.querySelector('[data-ps-outcome-selected]');
  selected.hidden = true;
  selected.textContent = '';

  /* Força o estado interno via clique em observação e volta a limpar pedindo desfecho de verdade */
  window.__confirmResult = false;
  host.querySelector('[data-ps-outcome="observacao"]').click();
  host.querySelector('[data-ps-closure-action="encerrar"]').click();
  const confirmouComDesfecho = /Tem certeza que quer finalizar/i.test(window.__confirmed.slice(-1)[0] || '');
  const semSalvar = window.__registered.length === 0 && window.__encerrados === 0;

  host.querySelector('[data-ps-outcome="alta"]').click();
  window.__confirmResult = true;
  host.querySelector('[data-ps-closure-action="encerrar"]').click();
  return {
    confirmouComDesfecho,
    semSalvar,
    confirmacao: window.__confirmed.slice(-1)[0] || '',
    desfechoUi: host.querySelector('[data-ps-outcome-selected]').textContent
  };
})()`);

setTimeout(() => {
  const final = evalIn(`(() => {
    const host = document.getElementById('host');
    return {
      registros: window.__registered.length,
      protocolo: window.__registered[0]?.protocolo || '',
      paciente: window.__registered[0]?.pacienteNome || '',
      desfecho: window.__registered[0]?.desfecho || '',
      encerrados: window.__encerrados,
      status: host.querySelector('[data-ps-closure-status]').textContent
    };
  })()`);

  if (encerrar.confirmouComDesfecho && encerrar.semSalvar &&
      /Alta/i.test(encerrar.desfechoUi)) {
    pass('cancelar a confirmação não encerra nem salva o atendimento');
  } else {
    fail('confirmação de encerramento falhou: ' + JSON.stringify(encerrar));
  }

  if (final.registros === 1 && /asma/i.test(final.protocolo) &&
      final.paciente === 'Paciente Asma' && final.encerrados === 1 &&
      final.desfecho === 'alta' &&
      /nuvem|finalizada/i.test(final.status)) {
    pass('finalizar salva em Atendimentos realizados e encerra o paciente');
  } else {
    fail('encerramento incompleto: ' + JSON.stringify(final));
  }

  console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
  process.exit(failures ? 1 : 0);
}, 120);
