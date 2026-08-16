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
  'pronto-socorro-interactive-core.js',
  ...fs.readdirSync(ROOT).filter(f => /^pronto-socorro-content.*\.js$/.test(f)).sort(),
  'pronto-socorro.js'
].filter(file => fs.existsSync(path.join(ROOT, file)));

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="host"></div>
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

/* 3. Marcar medicação atualiza a contagem do fechamento */
const contagem = evalIn(`(() => {
  const host = document.getElementById('host');
  const box = host.querySelector('.ps-rx-med-check');
  box.checked = true;
  box.dispatchEvent(new window.Event('change', { bubbles: true }));
  return host.querySelector('[data-ps-closure-count]').textContent;
})()`);

if (/1 medicação/i.test(contagem)) pass('fechamento conta a medicação marcada');
else fail('contagem não atualizou: ' + contagem);

/* 4. Prescrever e pedir exames levam às telas com a busca preenchida */
const navegacao = evalIn(`(() => {
  const host = document.getElementById('host');
  host.querySelector('[data-ps-closure-action="receituario"]').click();
  host.querySelector('[data-ps-closure-action="exames"]').click();
  return { secoes: window.__sections.slice() };
})()`);

if (navegacao.secoes.includes('receituario') && navegacao.secoes.includes('exames')) {
  pass('fechamento abre receituário e exames');
} else {
  fail('navegação do fechamento falhou: ' + JSON.stringify(navegacao));
}

/* 5. Resumo imprimível com paciente e conduta escolhida */
const resumo = evalIn(`(() => {
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
    nome: 'Paciente Asma', idade: '32', sexo: 'Feminino', alergias: 'Nega alergias',
    queixas: ['Falta de ar'], startedAt: '2026-08-15T21:00:00-03:00'
  }));
  const host = document.getElementById('host');
  host.querySelector('[data-ps-closure-action="resumo"]').click();
  const out = host.querySelector('[data-ps-closure-summary]');
  out.querySelector('[data-ps-summary-print]').click();
  return {
    texto: out.textContent.replace(/\\s+/g, ' ').trim(),
    pdf: window.__printed[0] || null
  };
})()`);

if (/Paciente Asma/.test(resumo.texto) && /salbutamol/i.test(resumo.texto) &&
    resumo.pdf && /Paciente Asma/.test(resumo.pdf.html)) {
  pass('resumo mostra paciente e conduta escolhida e gera PDF');
} else {
  fail('resumo incompleto: ' + JSON.stringify(resumo));
}

/* 6. Finalizar pede confirmação, salva o atendimento e encerra o paciente */
const encerrar = evalIn(`(() => {
  const host = document.getElementById('host');
  window.__confirmResult = false;
  host.querySelector('[data-ps-closure-action="encerrar"]').click();
  const semSalvar = window.__registered.length === 0 && window.__encerrados === 0;

  window.__confirmResult = true;
  host.querySelector('[data-ps-closure-action="encerrar"]').click();
  return { semSalvar, confirmacao: window.__confirmed[0] || '' };
})()`);

setTimeout(() => {
  const final = evalIn(`(() => {
    const host = document.getElementById('host');
    return {
      registros: window.__registered.length,
      protocolo: window.__registered[0]?.protocolo || '',
      paciente: window.__registered[0]?.pacienteNome || '',
      encerrados: window.__encerrados,
      status: host.querySelector('[data-ps-closure-status]').textContent
    };
  })()`);

  if (encerrar.semSalvar && /Tem certeza que quer finalizar/i.test(encerrar.confirmacao)) {
    pass('cancelar a confirmação não encerra nem salva o atendimento');
  } else {
    fail('confirmação de encerramento falhou: ' + JSON.stringify(encerrar));
  }

  if (final.registros === 1 && /asma/i.test(final.protocolo) &&
      final.paciente === 'Paciente Asma' && final.encerrados === 1 && /nuvem/i.test(final.status)) {
    pass('finalizar salva em Atendimentos realizados e encerra o paciente');
  } else {
    fail('encerramento incompleto: ' + JSON.stringify(final));
  }

  console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
  process.exit(failures ? 1 : 0);
}, 120);
