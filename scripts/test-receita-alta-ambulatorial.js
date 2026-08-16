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
const RESP_DERM_IDS = [
  'sinusite-aguda', 'otite-media', 'otite-externa', 'bronquite-aguda',
  'gripe-influenza', 'rinite-alergica', 'impetigo',
  'celulite', 'erisipela', 'abscesso-cutaneo', 'furunculose', 'micoses-superficiais',
  'tinea', 'frieira', 'escabiose', 'pediculose'
];
const GI_OLHO_IDS = [
  'conjuntivite', 'hordeolo', 'herpes-zoster', 'candidiase', 'vulvovaginites',
  'balanopostite', 'diarreia-gastroenterite', 'vomitos-agudos', 'constipacao',
  'dispepsia-drge', 'hemorroidas', 'gota', 'colica-renal', 'afta-estomatite',
  'queilite', 'parasitoses-intestinais'
];
const RESIDUAL_IDS = [
  'fissura-anal', 'artralgia-dor-msk', 'tosse', 'anemia-ferropriva',
  'flebite', 'varizes-mmi', 'ulcera-varicosa', 'ulceras-genitais',
  'soluco-persistente', 'mononucleose', 'diverticulite'
];
const COMPLEX_IDS = [
  'pneumonia-comunitaria', 'pielonefrite', 'tvp', 'dengue', 'chikungunya',
  'edema-mmi', 'sindrome-vestibular', 'ansiedade-crise', 'desconforto-abdominal',
  'alergia-anafilaxia', 'edema-angioneurotico', 'queimaduras',
  'antiparasitarios', 'ascaridiase', 'anemia-falciforme', 'tuberculose'
];
const GUIDANCE_IDS = [
  'ameaca-aborto', 'corpo-estranho-ocular', 'epistaxe', 'hipoglicemia-grave',
  'insolacao', 'profilaxia-antirrabica', 'sangramento-uterino', 'sincope'
];
const ALL_CURATED_BATCH = [
  ...RESP_DERM_IDS,
  ...GI_OLHO_IDS,
  ...RESIDUAL_IDS,
  ...COMPLEX_IDS,
  ...GUIDANCE_IDS
];

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

/* 6. Lote respiratório/dermatológico vem de modelos completos e sem via hospitalar */
const lote = evalIn(`(() => {
  const ids = ${JSON.stringify(ALL_CURATED_BATCH)};
  return ids.map(id => {
    const cond = rxGetCatalogEntry(id);
    const text = (cond?.groups || []).flatMap(g => (g.options || []).flatMap(o => [
      o.label, o.orientacoes, ...(o.meds || []).map(m => m.text)
    ])).join(' ');
    return {
      id,
      source: cond?.source,
      groups: cond?.groups?.length || 0,
      homeRx: clinicalPathwayGet(id).homeRx,
      hospitalRoute: /\\b(EV|IV|IM)\\b|nebuliza/i.test(text),
      text
    };
  });
})()`);

const loteOk = lote.every(c =>
  c.source === 'complete' && c.groups > 0 && c.homeRx === 'curated' && !c.hospitalRoute
);
if (loteOk) {
  pass(`${lote.length} receitas curadas (vias aéreas, pele, olho, GI e residual), sem dose/via hospitalar`);
} else {
  fail('lote curado incompleto: ' + JSON.stringify(lote.filter(c =>
    c.source !== 'complete' || !c.groups || c.homeRx !== 'curated' || c.hospitalRoute
  )));
}

const integridadeCurada = evalIn(`(() => {
  const ids = new Set(${JSON.stringify(ALL_CURATED_BATCH)});
  const divergencias = [];
  RX_CATALOG_MANUAL.filter(c => ids.has(c.id)).forEach(rawCondition => {
    const runtimeCondition = rxGetCatalogEntry(rawCondition.id);
    (rawCondition.groups || []).forEach(rawGroup => {
      const runtimeGroup = (runtimeCondition?.groups || []).find(g => g.id === rawGroup.id);
      (rawGroup.options || []).filter(o => o.noVoExpand).forEach(rawOption => {
        const runtimeOption = (runtimeGroup?.options || []).find(o => o.id === rawOption.id);
        const rawIds = (rawOption.meds || []).map(m => m.id);
        const runtimeIds = (runtimeOption?.meds || []).map(m => m.id);
        if (JSON.stringify(rawIds) !== JSON.stringify(runtimeIds)) {
          divergencias.push({
            condition: rawCondition.id,
            option: rawOption.id,
            expected: rawIds,
            actual: runtimeIds
          });
        }
      });
    });
  });
  return divergencias;
})()`);

if (!integridadeCurada.length) {
  pass('doses e apresentações curadas permanecem intactas no catálogo em runtime');
} else {
  fail('expansor alterou opções curadas: ' + JSON.stringify(integridadeCurada.slice(0, 8)));
}

const textoLote = id => lote.find(c => c.id === id)?.text || '';
const checks = [
  ['sinusite', /mais de 10 dias/i.test(textoLote('sinusite-aguda'))],
  ['bronquite', /Antibiótico não é indicado de rotina/i.test(textoLote('bronquite-aguda'))],
  ['gripe', /primeiras 48 horas/i.test(textoLote('gripe-influenza'))],
  ['oe', /perfuração timpânica/i.test(textoLote('otite-externa'))],
  ['escabiose', /Tratar simultaneamente contatos/i.test(textoLote('escabiose'))],
  ['abscesso', /não substitui incisão e drenagem/i.test(textoLote('abscesso-cutaneo'))],
  ['furunculo', /não substitui drenagem/i.test(textoLote('furunculose'))],
  ['celulite', /suspeita de fascite/i.test(textoLote('celulite'))],
  ['conjuntivite', /Não usar colírio antibiótico/i.test(textoLote('conjuntivite'))],
  ['gota', /Não iniciar alopurinol/i.test(textoLote('gota'))],
  ['diarreia', /Antibiótico não é rotina/i.test(textoLote('diarreia-gastroenterite'))],
  ['zoster', /Herpes oftálmico/i.test(textoLote('herpes-zoster'))],
  ['flebite', /não liberar anticoagulação automática/i.test(textoLote('flebite'))],
  ['mono', /Não prescrever amoxicilina/i.test(textoLote('mononucleose'))],
  ['diverticulite', /Abscesso, peritonite/i.test(textoLote('diverticulite'))],
  ['tosse', /investigar TB/i.test(textoLote('tosse'))],
  ['ulceras-genitais', /penicilina benzatina intramuscular/i.test(textoLote('ulceras-genitais'))],
  ['pneumonia', /CURB-65 baixo/i.test(textoLote('pneumonia-comunitaria'))],
  ['dengue', /jamais AINE/i.test(textoLote('dengue'))],
  ['tvp', /Confirmar TVP por Doppler/i.test(textoLote('tvp'))],
  ['anafilaxia', /2 dispositivos/i.test(textoLote('alergia-anafilaxia')) &&
    /corticoide não previne reação bifásica/i.test(textoLote('alergia-anafilaxia'))],
  ['tb', /Notificação compulsória/i.test(textoLote('tuberculose'))],
  ['aborto', /excluir ectópica/i.test(textoLote('ameaca-aborto')) &&
    /repouso no leito não previne aborto/i.test(textoLote('ameaca-aborto'))],
  ['queimadura', /Sulfadiazina de prata não é rotina/i.test(textoLote('queimaduras')) &&
    /não usar gelo/i.test(textoLote('queimaduras'))],
  ['olho', /Não prescrever anestésico tópico/i.test(textoLote('corpo-estranho-ocular'))],
  ['epistaxe', /comprimir.*10–15 minutos/i.test(textoLote('epistaxe'))],
  ['hipoglicemia', /Não oferecer alimento.*inconsciente/i.test(textoLote('hipoglicemia-grave'))],
  ['insolacao', /Não usar antitérmico/i.test(textoLote('insolacao'))],
  ['raiva', /Vacina e imunoglobulina são aplicadas no serviço/i.test(textoLote('profilaxia-antirrabica'))],
  ['sangramento-uterino', /gestação negativo/i.test(textoLote('sangramento-uterino'))],
  ['sincope', /Não iniciar fludrocortisona ou midodrina/i.test(textoLote('sincope'))]
];
if (checks.every(([, ok]) => ok)) {
  pass('lotes novos preservam critérios clínicos e barreiras de segurança');
} else {
  fail('alertas clínicos do lote novo incompletos: ' + JSON.stringify(checks.filter(([, ok]) => !ok).map(([k]) => k)));
}

/* 7. Abscesso/furúnculo exigem confirmar drenagem quando indicada antes da receita */
const drenagemGate = evalIn(`(() => {
  const host = document.createElement('div');
  host.innerHTML = '<div class="emerg-algo-single"></div>';
  document.body.appendChild(host);
  psRenderInteractiveRx('abscesso-cutaneo', host.querySelector('.emerg-algo-single'));
  const home = host.querySelector('[data-ps-closure-action="receituario"]');
  const before = home?.disabled;
  host.querySelector('#ps-rx-analyze')?.click();
  const panel = host.querySelector('[data-ps-reassessment-kind="clinical"]');
  panel?.querySelector('[data-ps-improved="sim"]')?.click();
  return {
    before,
    after: home?.disabled,
    question: panel?.querySelector('p')?.textContent || ''
  };
})()`);

if (drenagemGate.before && !drenagemGate.after && /drenada quando indicada/i.test(drenagemGate.question)) {
  pass('abscesso bloqueia receita até confirmar drenagem quando indicada e ausência de sinais sistêmicos');
} else {
  fail('barreira de drenagem do abscesso incompleta: ' + JSON.stringify(drenagemGate));
}

/* 8. Ao escolher prescrever para casa, a conduta abre a receita curada */
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
