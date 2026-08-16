#!/usr/bin/env node
/**
 * Cobertura queixa -> fluxograma.
 * Garante que cada queixa da lista de "Novo atendimento" abre pelo menos um
 * fluxograma e que nenhum protocolo do guia ou conduta de PS fica órfão.
 *
 * node scripts/test-queixa-fluxogramas.js
 */

const fs = require('fs');
const path = require('path');

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

const PS_CONTENT_FILES = fs.readdirSync(ROOT)
  .filter(file => /^pronto-socorro-content.*\.js$/.test(file))
  .sort();

const files = [
  'emergency-guide.js',
  ...PS_CONTENT_FILES,
  'pronto-socorro.js',
  'med-apresentacoes-vo.js',
  'tratamento-hospitalar.js',
  'receituario-data.js',
  'receituario-ps-bridge.js',
  'novo-atendimento.js'
];

const exposed = [
  'EMERGENCY_TOPICS', 'PS_CONDITIONS',
  'novoAtendimentoEmergencyMatches', 'novoAtendimentoPsMatches',
  'novoAtendimentoTermos', 'NOVO_ATENDIMENTO_PS_ROUTES'
];

const prelude = exposed
  .map(key => `out.${key} = typeof ${key} !== 'undefined' ? ${key} : undefined;`)
  .join('\n');

const vm = require('vm');
const { JSDOM } = require('jsdom');

/* DOM mínimo do passo "Queixa(s)" para validar lógica e renderização juntas */
const dom = new JSDOM(`<!doctype html><html><body>
  <form id="novo-atendimento-form"></form>
  <div id="novo-atendimento-queixas-list"></div>
  <p id="novo-atendimento-queixas-empty"></p>
  <section id="novo-atendimento-protocolo" hidden></section>
  <div id="novo-atendimento-resume" hidden>
    <span id="novo-atendimento-resume-text"></span>
    <button type="button" id="novo-atendimento-resume-btn"></button>
    <button type="button" id="novo-atendimento-resume-discard"></button>
  </div>
  <div id="calc-area-content"></div>
</body></html>`, { url: 'https://www.medhub.ia.br/app.html' });

const context = vm.createContext(dom.window);
vm.runInContext(files.map(read).join('\n'), context);

function evalIn (code) {
  return vm.runInContext(code, context);
}

const app = evalIn(`(() => { const out = {};\n${prelude}\nreturn out; })()`);

const {
  EMERGENCY_TOPICS,
  PS_CONDITIONS,
  novoAtendimentoEmergencyMatches,
  novoAtendimentoPsMatches,
  NOVO_ATENDIMENTO_PS_ROUTES
} = app;

function suggestions (queixa) {
  return [
    ...novoAtendimentoEmergencyMatches([queixa]).map(route => `emerg:${route.topic}:${route.protocol}`),
    ...novoAtendimentoPsMatches([queixa]).map(condition => `ps:${condition.id}`)
  ];
}

console.log('=== MedHub — queixa x fluxograma ===\n');

/* 1. Toda queixa da lista de sugestões do formulário resolve em algo */
const queixasComuns = [...read('app.html').matchAll(/<option value="([^"]+)"><\/option>/g)]
  .map(match => match[1]);
const datalistBlock = read('app.html').split('id="novo-atendimento-queixas-comuns"')[1] || '';
const queixasFormulario = [...datalistBlock.split('</datalist>')[0].matchAll(/value="([^"]+)"/g)]
  .map(match => match[1]);

console.log('Queixas do formulário (' + queixasFormulario.length + '):\n');
queixasFormulario.forEach(queixa => {
  const hits = suggestions(queixa);
  if (hits.length) pass(`${queixa} — ${hits.length} conduta(s)`);
  else fail(`${queixa} — nenhuma conduta sugerida`);
});

/* 2. Termos leigos e variações de escrita */
console.log('\nVariações de linguagem:\n');
const variacoes = [
  ['falta de ar há 2 dias', 'ps:asma-broncoespasmo'],
  ['dor no peito', 'emerg:sca:dor-inicial'],
  ['dor de cabeça forte', 'ps:cefaleias'],
  ['vômitos', 'ps:vomitos-agudos'],
  ['náuseas', 'ps:vomitos-agudos'],
  ['bebê com chiado', 'emerg:pediatrica:bronquiolite'],
  ['bateu a cabeça', 'emerg:trauma:pecarn-tce'],
  ['pressão alta', 'emerg:pressao-arritmias:crise-hipertensiva'],
  ['açúcar baixo', 'emerg:reacoes-metabolicas:hipoglicemia-grave'],
  ['perda de força de um lado', 'emerg:avc:fast'],
  ['sangue nas fezes', 'ps:hda'],
  ['picada de cobra', 'ps:acidente-ofidico'],
  ['dor ao urinar', 'ps:cistite-itu-baixa'],
  ['convulsão', 'ps:crise-convulsiva-em'],
  ['desmaio', 'ps:sincope'],
  ['perna inchada', 'ps:tvp'],
  ['coceira na pele', 'ps:alergia-anafilaxia'],
  ['choque séptico', 'emerg:sepse:bundle-hora1'],
  ['parada cardiorrespiratória', 'emerg:parada-cardio:acls-adulto'],
  ['dispneia', 'ps:asma-broncoespasmo']
];

variacoes.forEach(([queixa, esperado]) => {
  const hits = suggestions(queixa);
  if (hits.some(hit => hit.startsWith(esperado))) pass(`${queixa} → ${esperado}`);
  else fail(`${queixa} → esperado ${esperado}; obtido: ${hits.slice(0, 5).join(', ') || 'nada'}`);
});

/* 3. Todo protocolo do guia é alcançável pelo próprio nome */
console.log('\nProtocolos do guia de emergência:\n');
let protocolos = 0;
let protocolosOrfaos = [];
EMERGENCY_TOPICS.forEach(topic => {
  (topic.protocols || []).forEach(protocol => {
    protocolos += 1;
    const alvo = `emerg:${topic.id}:${protocol.id}`;
    if (!suggestions(protocol.name).includes(alvo)) protocolosOrfaos.push(`${topic.id}/${protocol.id}`);
  });
});
if (protocolosOrfaos.length) fail(`${protocolosOrfaos.length}/${protocolos} sem rota: ${protocolosOrfaos.join(', ')}`);
else pass(`${protocolos} protocolos alcançáveis pelo nome`);

/* 4. Toda conduta de PS é alcançável pelo próprio nome */
console.log('\nCondutas de Prescrições de PS:\n');
const psOrfaos = PS_CONDITIONS
  .filter(condition => !suggestions(condition.name).includes(`ps:${condition.id}`))
  .map(condition => condition.id);
if (psOrfaos.length) fail(`${psOrfaos.length}/${PS_CONDITIONS.length} sem rota: ${psOrfaos.join(', ')}`);
else pass(`${PS_CONDITIONS.length} condutas alcançáveis pelo nome`);

/* 5. Ids citados no mapa curado existem */
const psIds = new Set(PS_CONDITIONS.map(condition => condition.id));
const idsInvalidos = [...new Set(
  NOVO_ATENDIMENTO_PS_ROUTES.flatMap(route => route.ps).filter(id => !psIds.has(id))
)];
if (idsInvalidos.length) fail(`ids inexistentes no mapa de queixas: ${idsInvalidos.join(', ')}`);
else pass('mapa curado de queixas aponta só para condutas existentes');

/* 6. Sem queixa reconhecida não deve haver sugestão inventada */
const semSentido = suggestions('zzz qwerty');
if (semSentido.length) fail(`queixa sem sentido gerou ${semSentido.length} sugestão(ões): ${semSentido.slice(0, 3).join(', ')}`);
else pass('queixa desconhecida não gera sugestão falsa');

/* 7. Renderização e cliques no passo das queixas */
console.log('\nInterface do passo Queixa(s):\n');

const render = evalIn(`(() => {
  window.aberturas = [];
  window.showSection = id => window.aberturas.push('section:' + id);
  window.initProntoSocorro = () => {};
  window.initGuiaEmergencia = () => {};
  window.showProntoSocorroCondition = id => window.aberturas.push('ps:' + id);
  window.showEmergenciaTopic = id => window.aberturas.push('topic:' + id);
  window.showEmergenciaProtocol = id => window.aberturas.push('protocol:' + id);

  novoAtendimentoQueixas = ['Dispneia'];
  novoAtendimentoRenderQueixas();

  const painel = document.getElementById('novo-atendimento-protocolo');
  return {
    hidden: painel.hidden,
    emergCards: painel.querySelectorAll('[data-open-emergency-protocol]').length,
    psCards: painel.querySelectorAll('[data-open-ps-condition]').length,
    primeiraPs: painel.querySelector('[data-open-ps-condition]')?.dataset.openPsCondition || ''
  };
})()`);

if (!render.hidden && render.psCards > 0) {
  pass(`queixa "Dispneia" renderiza ${render.emergCards} fluxograma(s) e ${render.psCards} conduta(s) de PS`);
} else {
  fail(`queixa "Dispneia" não renderizou cartões (hidden=${render.hidden}, ps=${render.psCards})`);
}

const cliques = evalIn(`(() => {
  const painel = document.getElementById('novo-atendimento-protocolo');
  painel.querySelector('[data-open-ps-condition]').click();
  painel.querySelector('[data-open-emergency-protocol]')?.click();
  return window.aberturas;
})()`);

if (cliques.includes('section:pronto-socorro')) pass('cartão de PS navega para Prescrições de PS');
else fail('cartão de PS não navegou: ' + JSON.stringify(cliques));

/* 8. Queixa ativa fica disponível para o seletor de foco do fluxograma */
const queixaAtiva = evalIn(`(() => {
  novoAtendimentoQueixas = ['Pneumonia'];
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({ nome: 'Teste', queixas: [] }));
  novoAtendimentoRenderQueixas();
  const queixa = sessionStorage.getItem('medhub-active-queixa');
  const foco = typeof emergPickerSuggestion === 'function'
    ? emergPickerSuggestion('foco-sepse', [{ value: 'pulmonar' }, { value: 'urinario' }])
    : null;
  return { queixa, foco };
})()`);

if (queixaAtiva.queixa === 'Pneumonia') pass('queixa ativa gravada na sessão para os protocolos');
else fail('queixa ativa não gravada: ' + queixaAtiva.queixa);

if (queixaAtiva.foco === 'pulmonar') pass('seletor de foco da sepse sugere “pulmonar” para pneumonia');
else fail('sugestão de foco incorreta: ' + queixaAtiva.foco);

/* 9. Continuar para tratamento também resolve sintomas genéricos via diferenciais */
console.log('\nContinuar para tratamento:\n');
const tratamento = evalIn(`(() => {
  const nomes = novoAtendimentoPsMatches(['Dispneia']).map(c => c.name);
  const termos = ['Dispneia', ...nomes];
  const th = typeof thMatchConditions === 'function' ? thMatchConditions(termos).map(c => c.id) : [];
  return { th, nomes: nomes.slice(0, 3) };
})()`);

if (tratamento.th.includes('asma-broncoespasmo') || tratamento.th.includes('pneumonia')) {
  pass(`"Dispneia" abre tratamento na unidade: ${tratamento.th.slice(0, 4).join(', ')}`);
} else {
  fail(`tratamento na unidade não casou com Dispneia: ${JSON.stringify(tratamento)}`);
}

/* 10. Dor torácica exige classificação antes do tratamento */
console.log('\nGate de dor torácica:\n');
const chestGate = evalIn(`(() => {
  sessionStorage.removeItem('medhub-chest-classification');
  novoAtendimentoQueixas = ['Dor torácica'];
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({ nome: 'Teste', queixas: ['Dor torácica'], step: 'queixas' }));
  const precisa = novoAtendimentoRequiresChestGate();
  window.aberturas = [];
  window.showSection = id => window.aberturas.push('section:' + id);
  window.showEmergenciaTopic = id => window.aberturas.push('topic:' + id);
  window.showEmergenciaProtocol = id => window.aberturas.push('protocol:' + id);
  novoAtendimentoSaveQueixas();
  const draft = JSON.parse(sessionStorage.getItem('medhub-new-encounter-draft') || '{}');
  return { precisa, step: draft.step, aberturas: window.aberturas.slice() };
})()`);

if (chestGate.precisa && chestGate.step === 'queixas' &&
    chestGate.aberturas.includes('section:guia-emergencia')) {
  pass('Dor torácica bloqueia tratamento e manda classificar no Guia de emergência');
} else {
  fail('Gate de dor torácica falhou: ' + JSON.stringify(chestGate));
}

const chestLiberado = evalIn(`(() => {
  sessionStorage.setItem('medhub-chest-classification', 'nao-sca');
  return !novoAtendimentoRequiresChestGate(['Dor torácica']);
})()`);
if (chestLiberado) pass('Classificação baixo risco/não cardíaca libera o caminho do tratamento');
else fail('Classificação não liberou o gate');

/* 11. A calculadora aberta pelo atendimento devolve o usuário ao fluxo */
const calcSaida = evalIn(`(() => {
  sessionStorage.removeItem('medhub-chest-classification');
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
    nome: 'Teste', idade: '44 anos', sexo: 'Masculino', queixas: ['Dor torácica'], step: 'queixas'
  }));
  const host = document.getElementById('calc-area-content');
  host.innerHTML = '<div class="calc-block"><form class="calc-form"></form><div class="calc-result"></div></div>';
  novoAtendimentoMountChestNextSteps(host);
  const painel = host.querySelector('#novo-atendimento-chest-next');
  const botoes = painel ? [...painel.querySelectorAll('[data-chest-step]')].map(b => b.dataset.chestStep) : [];

  window.aberturas = [];
  window.showSection = id => window.aberturas.push('section:' + id);
  painel?.querySelector('[data-chest-step="nao-sca"]')?.click();

  return {
    botoes,
    classificacao: sessionStorage.getItem('medhub-chest-classification'),
    aberturas: window.aberturas.slice(),
    liberado: !novoAtendimentoRequiresChestGate(['Dor torácica'])
  };
})()`);

if (calcSaida.botoes.join(',') === 'stemi,nstemi-ua,nao-sca') {
  pass('Tela do escore oferece as três saídas da classificação');
} else {
  fail('Escore sem saída para o fluxo: ' + JSON.stringify(calcSaida));
}
if (calcSaida.classificacao === 'nao-sca' && calcSaida.liberado &&
    calcSaida.aberturas.includes('section:novo-atendimento')) {
  pass('Escolher não cardíaca na calculadora volta ao atendimento e libera o tratamento');
} else {
  fail('Saída da calculadora não retomou o fluxo: ' + JSON.stringify(calcSaida));
}

/* 12. O cartão da queixa oferece o conjunto de escores da dor torácica */
const chestScores = evalIn(`(() => {
  novoAtendimentoQueixas = ['Dor torácica'];
  novoAtendimentoRenderProtocol();
  const bloco = document.querySelector('.novo-atendimento-protocolo-scores-priority');
  const botoes = bloco ? [...bloco.querySelectorAll('[data-open-score]')].map(b => b.dataset.openScore) : [];
  return { botoes, primeiro: bloco?.querySelector('[data-score-primary]')?.dataset.openScore || '' };
})()`);

const esperados = ['heart', 'timi-ua', 'grace', 'timi-stemi', 'killip', 'wells', 'perc'];
if (esperados.every(id => chestScores.botoes.includes(id)) && chestScores.primeiro === 'heart') {
  pass(`Dor torácica oferece ${chestScores.botoes.length} calculadoras, com HEART em destaque`);
} else {
  fail('Calculadoras da dor torácica incompletas: ' + JSON.stringify(chestScores));
}

/* 13. Atendimento finalizado não volta como "em andamento" */
console.log('\nEncerramento do atendimento:\n');
const encerramento = evalIn(`(() => {
  sessionStorage.removeItem('medhub-finished-encounters');
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
    nome: 'Claudio Teste', queixas: ['Dor torácica'], step: 'tratamento', startedAt: '2026-08-15T20:00:00-03:00'
  }));
  novoAtendimentoRenderResume();
  const avisoAntes = !document.getElementById('novo-atendimento-resume').hidden;

  novoAtendimentoFinishEncounter();
  const avisoDepois = !document.getElementById('novo-atendimento-resume').hidden;

  /* Rascunho residual gravado depois do encerramento não ressuscita o aviso */
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
    nome: 'Claudio Teste', queixas: ['Dor torácica'], step: 'tratamento', startedAt: '2026-08-15T20:00:00-03:00'
  }));
  novoAtendimentoRenderResume();

  return {
    avisoAntes,
    avisoDepois,
    avisoResiduo: !document.getElementById('novo-atendimento-resume').hidden,
    rascunho: sessionStorage.getItem('medhub-new-encounter-draft')
  };
})()`);

if (encerramento.avisoAntes && !encerramento.avisoDepois &&
    !encerramento.avisoResiduo && !encerramento.rascunho) {
  pass('Atendimento finalizado sai do aviso "Continuar atendimento" e não reaparece');
} else {
  fail('Paciente finalizado continuou em andamento: ' + JSON.stringify(encerramento));
}

const descartar = evalIn(`(() => {
  sessionStorage.removeItem('medhub-finished-encounters');
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
    nome: 'Paciente Preso', queixas: ['Febre'], step: 'queixas', startedAt: '2026-08-15T19:00:00-03:00'
  }));
  novoAtendimentoRenderResume();

  window.confirm = () => false;
  novoAtendimentoDiscardResume();
  const mantido = !!sessionStorage.getItem('medhub-new-encounter-draft');

  window.confirm = () => true;
  novoAtendimentoDiscardResume();
  return { mantido, removido: !sessionStorage.getItem('medhub-new-encounter-draft') };
})()`);

if (descartar.mantido && descartar.removido) {
  pass('Botão Encerrar atendimento pede confirmação antes de limpar o aviso');
} else {
  fail('Descarte do aviso falhou: ' + JSON.stringify(descartar));
}

const calcSemDor = evalIn(`(() => {
  sessionStorage.setItem('medhub-new-encounter-draft', JSON.stringify({
    nome: 'Teste', queixas: ['Cefaleia'], step: 'queixas'
  }));
  const host = document.getElementById('calc-area-content');
  host.innerHTML = '<div class="calc-block"></div>';
  novoAtendimentoMountChestNextSteps(host);
  return !!host.querySelector('#novo-atendimento-chest-next');
})()`);
if (!calcSemDor) pass('Queixa sem dor torácica não recebe painel de classificação');
else fail('Painel de dor torácica apareceu fora de contexto');

console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
process.exit(failures ? 1 : 0);
