#!/usr/bin/env node
/**
 * Receita de alta ambulatorial.
 * A prescrição para casa não pode copiar a dose hospitalar da crise:
 * nada de nebulização ou 4–8 puffs no receituário do paciente que vai de alta.
 *
 * node scripts/test-receita-alta-ambulatorial.js
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
dom.window.Element.prototype.scrollIntoView = function () {};

const context = vm.createContext(dom.window);
vm.runInContext(files.map(read).join('\n'), context);

function evalIn (code) {
  return vm.runInContext(code, context);
}

console.log('=== MedHub — receita de alta ambulatorial ===\n');

const HOME_IDS = ['asma-broncoespasmo', 'dpoc-exacerbada'];

/* 1. A receita de casa vem do modelo curado, não do protocolo do PS */
const origem = evalIn(`(() => {
  const ids = ${JSON.stringify(HOME_IDS)};
  return ids.map(id => {
    const entradas = rxGetCatalog().filter(c => c.id === id);
    return { id, total: entradas.length, source: entradas[0]?.source, nome: entradas[0]?.name };
  });
})()`);

const origemOk = origem.every(e => e.total === 1 && e.source === 'complete');
if (origemOk) {
  pass('asma e DPOC usam a receita de alta curada, sem duplicar a versão do protocolo');
} else {
  fail('origem da receita de alta incorreta: ' + JSON.stringify(origem));
}

/* 2. Nenhuma linha de casa repete a dose hospitalar da crise */
const doseHospitalar = evalIn(`(() => {
  const ids = ${JSON.stringify(HOME_IDS)};
  const proibidos = [];
  ids.forEach(id => {
    const cond = rxGetCatalogEntry(id);
    (cond?.groups || []).forEach(g => {
      (g.options || []).forEach(opt => {
        [opt.label, ...(opt.meds || []).map(m => m.text)].forEach(text => {
          const t = String(text || '');
          const jatos = t.match(/(\\d+)\\s*(?:a|–|-|até)\\s*(\\d+)\\s*(?:jatos?|puffs?)/i);
          const jatoUnico = t.match(/(\\d+)\\s*(?:jatos?|puffs?)/i);
          const maximo = /máximo/i.test(t);
          if (/nebuliza/i.test(t)) proibidos.push({ id, motivo: 'nebulização', text: t });
          else if (jatos) proibidos.push({ id, motivo: 'faixa de jatos', text: t });
          else if (jatoUnico && Number(jatoUnico[1]) > 2 && !maximo) {
            proibidos.push({ id, motivo: 'mais de 2 jatos por dose', text: t });
          }
          if (/\\b(EV|IV|IM)\\b/.test(t)) proibidos.push({ id, motivo: 'via hospitalar', text: t });
        });
      });
    });
  });
  return proibidos;
})()`);

if (!doseHospitalar.length) {
  pass('receita de casa usa 2 jatos por dose, sem nebulização nem via EV/IM');
} else {
  fail('dose hospitalar vazou para a receita de casa: ' + JSON.stringify(doseHospitalar));
}

/* 3. Asma de alta traz alívio, corticoide oral curto e manutenção inalatória */
const asma = evalIn(`(() => {
  const cond = rxGetCatalogEntry('asma-broncoespasmo');
  const linhas = [];
  (cond.groups || []).forEach(g => (g.options || []).forEach(opt => {
    (opt.meds || []).forEach(m => linhas.push(g.label + ' :: ' + m.text));
  }));
  return { grupos: (cond.groups || []).map(g => g.label), linhas };
})()`);

const temAlivio = asma.linhas.some(l => /Salbutamol spray 100 mcg.*2 jatos.*4 a 6 horas/i.test(l));
const temPrednisona = asma.linhas.some(l => /Prednisona 20 mg.*40 mg.*por 5 dias/i.test(l));
const temManutencao = asma.linhas.some(l => /Manutenção.*(budesonida|beclometasona)/i.test(l));

if (temAlivio && temPrednisona && temManutencao) {
  pass(`asma de alta cobre ${asma.grupos.length} blocos: alívio, corticoide oral e manutenção inalatória`);
} else {
  fail('asma de alta incompleta: ' + JSON.stringify(asma));
}

/* 4. Máximo diário aparece junto do resgate, para não repetir a dose da crise */
const limite = asma.linhas.filter(l => /Salbutamol spray/i.test(l));
if (limite.every(l => /máximo 8 jatos por dia/i.test(l))) {
  pass('resgate de casa avisa o teto diário de jatos');
} else {
  fail('resgate sem teto diário: ' + JSON.stringify(limite));
}

/* 5. DPOC de alta traz resgate, corticoide curto e antibiótico condicionado */
const dpoc = evalIn(`(() => {
  const cond = rxGetCatalogEntry('dpoc-exacerbada');
  return {
    grupos: (cond.groups || []).map(g => g.label),
    atb: (cond.groups || []).find(g => /antibiótico/i.test(g.label))?.options?.[0]?.orientacoes || ''
  };
})()`);

if (dpoc.grupos.length === 3 && /escarro purulento/i.test(dpoc.atb)) {
  pass('DPOC de alta condiciona o antibiótico ao escarro purulento');
} else {
  fail('DPOC de alta incompleta: ' + JSON.stringify(dpoc));
}

/* 6. Ao escolher prescrever para casa, a conduta abre a receita curada */
const navegacao = evalIn(`(() => {
  const abertas = [];
  window.showSection = id => abertas.push('section:' + id);
  window.rxShowCondition = id => abertas.push('receita:' + id);
  psOpenHomePrescription('asma-broncoespasmo', 'Asma brônquica (crise) e broncoespasmo');
  return new Promise(resolve => setTimeout(() => resolve(abertas), 120));
})()`);

navegacao.then(abertas => {
  if (abertas.join(',') === 'section:receituario,receita:asma-broncoespasmo') {
    pass('prescrever para casa abre direto a receita de alta da condição');
  } else {
    fail('navegação da receita de alta falhou: ' + JSON.stringify(abertas));
  }

  console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
  process.exit(failures ? 1 : 0);
});
