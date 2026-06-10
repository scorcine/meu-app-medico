#!/usr/bin/env node
/* Fármacos citados nos protocolos mas ausentes de PS_DRUG_META */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');

function prepForSandbox (src) {
  return src
    .replace(/\bconst (PS_DRUG_META|PS_DRUG_META_GAPS|PS_CONTENT_\d|TH_CONTENT_\d|PS_CONTENT|TH_CONTENT|EMERGENCY_TOPICS) =/g, 'globalThis.$1 =')
    .replace(/\bconst (PARADA_PROTOCOLS|SCA_PROTOCOLS|AVC_PROTOCOLS|SEPSE_PROTOCOLS|TRAUMA_PROTOCOLS|VIA_AEREA_PROTOCOLS|REACOES_METABOLICAS_PROTOCOLS|OBSTETRICIA_PROTOCOLS|PEDIATRIC_PROTOCOLS|TOXICOLOGIA_PROTOCOLS|PRESSAO_RITMO_PROTOCOLS|PROCEDIMENTOS_PROTOCOLS) =/g, 'globalThis.$1 =');
}

function loadFiles (files) {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost/' });
  const sandbox = { document: dom.window.document, window: dom.window, console, globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  files.forEach(rel => {
    const src = prepForSandbox(fs.readFileSync(path.join(root, rel), 'utf8'));
    vm.runInContext(src, sandbox);
  });
  return sandbox;
}

const PROTOCOL_FILES = [
  'med-apresentacoes-vo.js',
  'pronto-socorro-content-1.js',
  'pronto-socorro-content-2.js',
  'pronto-socorro-content-3.js',
  'pronto-socorro-content-4.js',
  'pronto-socorro-content-5.js',
  'pronto-socorro.js',
  'tratamento-hospitalar-content-1.js',
  'tratamento-hospitalar-content-2.js',
  'tratamento-hospitalar.js',
  'emergency-guide.js',
  'medicacoes-classes.js',
  'ps-drug-meta-gaps.js',
  'pronto-socorro-interactive-drugs.js'
];

function mergeDrugMeta (ctx) {
  if (ctx.PS_DRUG_META_GAPS && ctx.PS_DRUG_META) {
    Object.assign(ctx.PS_DRUG_META, ctx.PS_DRUG_META_GAPS);
  }
}

const EXTRA = [
  'levonorgestrel', 'cefixima', 'espectinomicina', 'dolutegravir', 'tenofovir', 'emtricitabina',
  'raltegravir', 'zidovudina', 'penicilina_benzatina', 'imunoglobulina_hepatite_b', 'vacina_hepatite_b',
  'soro_antitetanico', 'vacina_tetano', 'dabigatrana', 'apixabana', 'edoxabana', 'sildenafil', 'tadalafil',
  'carbamazepina', 'levetiracetam', 'lacosamida', 'bromoprida', 'domperidona', 'loperamida', 'racecadotrilo',
  'soro_reidratacao', 'dobutamina', 'dopamina', 'milrinona', 'nitroprussiato', 'amiodarona', 'lidocaina',
  'adenosina', 'digoxina', 'eplerenona', 'rosuvastatina', 'pravastatina', 'fenofibrato', 'valsartana',
  'candesartana', 'olmesartana', 'telmisartana', 'irbesartana', 'diltiazem', 'isossorbida', 'heparina_sodica',
  'fondaparinux', 'alteplase', 'tenecteplase', 'tranexamico', 'vitamina_k', 'protamina', 'fluconazol',
  'anfotericina_b', 'voriconazol', 'caspofungina', 'albendazol', 'mebendazol', 'ivermectina', 'praziquantel',
  'nitazoxanida', 'secnidazol', 'tinidazol', 'primaquina', 'mefloquina', 'cloroquina', 'linezolida',
  'daptomicina', 'tigeciclina', 'colistina', 'ertapenem', 'aztreonam', 'rifampicina', 'isoniazida',
  'etambutol', 'pirazinamida', 'cefepima', 'cefuroxima', 'cefadroxila', 'flucloxacilina', 'teicoplanina',
  'tobramicina', 'minociclina', 'tetraciclina', 'gabapentina', 'pregabalina', 'sertralina', 'fluoxetina',
  'escitalopram', 'olanzapina', 'aripiprazol', 'levodopa', 'betametasona', 'budesonida', 'fluticasona',
  'formoterol', 'salmeterol', 'tiotropio', 'montelukaste', 'teofilina', 'beclometasona', 'bumetanida',
  'torasemida', 'eplerenona', 'acetazolamida', 'gliclazida', 'glibenclamida', 'glimepirida', 'sitagliptina',
  'empagliflozina', 'dapagliflozina', 'liraglutida', 'semaglutida', 'insulina_nph', 'insulina_glargina',
  'medroxiprogesterona', 'oxitocina', 'misoprostol', 'mifepristona', 'metilergonovina', 'metildopa',
  'sulfato_ferroso', 'acido_folico', 'cianocobalamina', 'piridoxina', 'colecalciferol', 'valaciclovir',
  'ganciclovir', 'ribavirina', 'micafungina', 'atovaquona', 'temocilina', 'polimixina_b', 'estreptoquinase',
  'desmopressina', 'fisostigmina', 'leucovorina', 'mesna', 'deferoxamina', 'dimercaprol', 'etanol',
  'filgrastim', 'epoetina', 'biperideno', 'donepezila', 'memantina', 'ciclesonida', 'mometasona',
  'venlafaxina', 'mirtazapina', 'lithium', 'ziprasidona', 'clozapina', 'pramipexol', 'ropinirol',
  'duloxetina', 'nitrofurantoina', 'fosfomicina', 'topiramato', 'amitriptilina', 'tizanidina',
  'espironolactona', 'carvedilol', 'nifedipino', 'hidroclorotiazida', 'simvastatina', 'atorvastatina'
];

const DRUG_NAME_PATTERNS = {
  levonorgestrel: ['levonorgestrel', 'postinor', 'pílula do dia seguinte'],
  cefixima: ['cefixima'],
  espectinomicina: ['espectinomicina'],
  dolutegravir: ['dolutegravir'],
  tenofovir: ['tenofovir', 'tdf'],
  emtricitabina: ['emtricitabina', 'ftc'],
  raltegravir: ['raltegravir'],
  zidovudina: ['zidovudina', 'azt '],
  penicilina_benzatina: ['penicilina benzatina', 'benzetacil', 'benzathine penicillin'],
  imunoglobulina_hepatite_b: ['imunoglobulina anti-hbs', 'imunoglobulina.*hepatite b', 'ighb'],
  vacina_hepatite_b: ['vacina hepatite b', 'vacina contra hepatite b', 'engerix', 'recombivax'],
  soro_antitetanico: ['soro antitetânico', 'soro antitetanico', 'sat '],
  vacina_tetano: ['vacina.*tétano', 'vacina.*tetano', 'dtpa', 'dTpa', 'dupla adulto'],
  dabigatrana: ['dabigatrana', 'pradaxa'],
  apixabana: ['apixabana', 'eliquis'],
  edoxabana: ['edoxabana', 'lixiana'],
  sildenafil: ['sildenafil'],
  tadalafil: ['tadalafil'],
  carbamazepina: ['carbamazepina', 'tegretol'],
  levetiracetam: ['levetiracetam', 'keppra'],
  lacosamida: ['lacosamida', 'vimpat'],
  bromoprida: ['bromoprida', 'digesan'],
  domperidona: ['domperidona', 'motilium'],
  loperamida: ['loperamida', 'imosec'],
  racecadotrilo: ['racecadotrilo', 'tiorfan'],
  soro_reidratacao: ['soro de reidratação oral', 'soro de reidratacao oral', 'sro '],
  dobutamina: ['dobutamina'],
  dopamina: ['dopamina'],
  milrinona: ['milrinona'],
  nitroprussiato: ['nitroprussiato', 'nipride'],
  amiodarona: ['amiodarona', 'atlansil'],
  lidocaina: ['lidocaína', 'lidocaina', 'xilocaína'],
  adenosina: ['adenosina'],
  digoxina: ['digoxina'],
  eplerenona: ['eplerenona'],
  rosuvastatina: ['rosuvastatina', 'crestor'],
  pravastatina: ['pravastatina'],
  fenofibrato: ['fenofibrato', 'lipidil'],
  valsartana: ['valsartana', 'diovan'],
  candesartana: ['candesartana', 'atacand'],
  olmesartana: ['olmesartana', 'benicar'],
  telmisartana: ['telmisartana', 'micardis'],
  irbesartana: ['irbesartana'],
  diltiazem: ['diltiazem'],
  isossorbida: ['isossorbida', 'mononitrato de isossorbida'],
  heparina_sodica: ['heparina não fracionada', 'heparina sodica', 'heparina sódica'],
  fondaparinux: ['fondaparinux', 'arixtra'],
  alteplase: ['alteplase', 'activase', 'rt-pa'],
  tenecteplase: ['tenecteplase', 'metalyse'],
  tranexamico: ['ácido tranexâmico', 'acido tranexamico', 'transamin'],
  vitamina_k: ['fitomenadiona', 'vitamina k', 'konakion'],
  protamina: ['protamina'],
  fluconazol: ['fluconazol'],
  anfotericina_b: ['anfotericina b', 'ambisome'],
  voriconazol: ['voriconazol'],
  caspofungina: ['caspofungina'],
  albendazol: ['albendazol'],
  mebendazol: ['mebendazol'],
  ivermectina: ['ivermectina'],
  praziquantel: ['praziquantel'],
  nitazoxanida: ['nitazoxanida'],
  secnidazol: ['secnidazol'],
  tinidazol: ['tinidazol'],
  primaquina: ['primaquina'],
  mefloquina: ['mefloquina'],
  cloroquina: ['cloroquina'],
  linezolida: ['linezolida'],
  daptomicina: ['daptomicina'],
  tigeciclina: ['tigeciclina'],
  colistina: ['colistina', 'polimixina e'],
  ertapenem: ['ertapenem', 'invanz'],
  aztreonam: ['aztreonam'],
  rifampicina: ['rifampicina'],
  isoniazida: ['isoniazida'],
  etambutol: ['etambutol'],
  pirazinamida: ['pirazinamida'],
  cefepima: ['cefepima'],
  cefuroxima: ['cefuroxima'],
  cefadroxila: ['cefadroxila'],
  flucloxacilina: ['flucloxacilina'],
  teicoplanina: ['teicoplanina'],
  tobramicina: ['tobramicina'],
  minociclina: ['minociclina'],
  tetraciclina: ['tetraciclina'],
  gabapentina: ['gabapentina'],
  pregabalina: ['pregabalina'],
  sertralina: ['sertralina'],
  fluoxetina: ['fluoxetina'],
  escitalopram: ['escitalopram'],
  olanzapina: ['olanzapina'],
  aripiprazol: ['aripiprazol'],
  levodopa: ['levodopa', 'carbidopa'],
  betametasona: ['betametasona'],
  budesonida: ['budesonida', 'pulmicort'],
  fluticasona: ['fluticasona'],
  formoterol: ['formoterol'],
  salmeterol: ['salmeterol'],
  tiotropio: ['tiotropio', 'spiriva'],
  montelukaste: ['montelukaste', 'singulair'],
  teofilina: ['teofilina'],
  beclometasona: ['beclometasona', 'beclomethasona'],
  bumetanida: ['bumetanida'],
  torasemida: ['torasemida'],
  acetazolamida: ['acetazolamida'],
  gliclazida: ['gliclazida'],
  glibenclamida: ['glibenclamida'],
  glimepirida: ['glimepirida'],
  sitagliptina: ['sitagliptina', 'januvia'],
  empagliflozina: ['empagliflozina', 'jardiance'],
  dapagliflozina: ['dapagliflozina', 'forxiga'],
  liraglutida: ['liraglutida', 'saxenda', 'victoza'],
  semaglutida: ['semaglutida', 'ozempic'],
  insulina_nph: ['insulina nph'],
  insulina_glargina: ['insulina glargina', 'lantus'],
  medroxiprogesterona: ['medroxiprogesterona', 'depo provera'],
  oxitocina: ['oxitocina'],
  misoprostol: ['misoprostol', 'cytotec'],
  mifepristona: ['mifepristona'],
  metilergonovina: ['metilergonovina', 'ergometrina'],
  metildopa: ['metildopa'],
  sulfato_ferroso: ['sulfato ferroso', 'ferro elementar'],
  acido_folico: ['ácido fólico', 'acido folico'],
  cianocobalamina: ['cianocobalamina', 'vitamina b12'],
  piridoxina: ['piridoxina', 'vitamina b6'],
  colecalciferol: ['colecalciferol', 'vitamina d'],
  valaciclovir: ['valaciclovir'],
  ganciclovir: ['ganciclovir'],
  ribavirina: ['ribavirina'],
  micafungina: ['micafungina'],
  atovaquona: ['atovaquona'],
  polimixina_b: ['polimixina b'],
  estreptoquinase: ['estreptoquinase'],
  desmopressina: ['desmopressina'],
  fisostigmina: ['fisostigmina'],
  leucovorina: ['leucovorina', 'ácido folínico'],
  mesna: ['mesna'],
  deferoxamina: ['deferoxamina'],
  dimercaprol: ['dimercaprol'],
  etanol: ['etanol ev', 'álcool etílico'],
  filgrastim: ['filgrastim', 'g-csf'],
  epoetina: ['epoetina', 'eritropoietina'],
  biperideno: ['biperideno'],
  donepezila: ['donepezila', 'aricept'],
  memantina: ['memantina'],
  ciclesonida: ['ciclesonida'],
  mometasona: ['mometasona'],
  venlafaxina: ['venlafaxina'],
  mirtazapina: ['mirtazapina'],
  lithium: ['carbonato de lítio', 'carbonato de litio'],
  ziprasidona: ['ziprasidona'],
  clozapina: ['clozapina'],
  pramipexol: ['pramipexol'],
  ropinirol: ['ropinirol'],
  duloxetina: ['duloxetina', 'cymbalta'],
  nitrofurantoina: ['nitrofurantoina'],
  fosfomicina: ['fosfomicina'],
  topiramato: ['topiramato'],
  amitriptilina: ['amitriptilina'],
  tizanidina: ['tizanidina'],
  espironolactona: ['espironolactona'],
  carvedilol: ['carvedilol'],
  nifedipino: ['nifedipino'],
  hidroclorotiazida: ['hidroclorotiazida', 'hctz'],
  simvastatina: ['sinvastatina'],
  atorvastatina: ['atorvastatina']
};

function stripHtml (html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectTexts (ctx) {
  const texts = [];
  const add = (label, html) => {
    if (html && typeof html === 'string' && html.length > 20) {
      texts.push({ label, text: stripHtml(html) });
    }
  };

  if (ctx.PS_CONTENT) Object.entries(ctx.PS_CONTENT).forEach(([id, html]) => add('PS:' + id, html));
  if (ctx.TH_CONTENT) Object.entries(ctx.TH_CONTENT).forEach(([id, html]) => add('TH:' + id, html));
  if (ctx.EMERGENCY_TOPICS) {
    ctx.EMERGENCY_TOPICS.forEach(topic => {
      (topic.protocols || []).forEach((p, i) => add('EM:' + topic.id + ':' + i, p.content || p.html || p.body || ''));
    });
  }

  return texts;
}

function detectInText (text, ctx) {
  const found = new Set();
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (typeof ctx.psExtractDrugsFromText === 'function') {
    ctx.psExtractDrugsFromText(text).forEach(id => found.add(id));
  }

  Object.entries(DRUG_NAME_PATTERNS).forEach(([id, patterns]) => {
    patterns.forEach(p => {
      if (new RegExp(p, 'i').test(norm)) found.add(id);
    });
  });

  return found;
}

const ctx = loadFiles(PROTOCOL_FILES);
mergeDrugMeta(ctx);
const metaIds = new Set(Object.keys(ctx.PS_DRUG_META || {}));
const extraInGenerator = new Set([
  'nitrofurantoina', 'fosfomicina', 'topiramato', 'amitriptilina', 'tizanidina',
  'espironolactona', 'carvedilol', 'nifedipino', 'hidroclorotiazida', 'simvastatina',
  'atorvastatina', 'fenilefrina'
]);

const texts = collectTexts(ctx);
const mentioned = new Map();

texts.forEach(({ label, text }) => {
  detectInText(text, ctx).forEach(id => {
    if (!mentioned.has(id)) mentioned.set(id, new Set());
    mentioned.get(id).add(label);
  });
});

const missingMeta = [];
mentioned.forEach((sources, id) => {
  if (!metaIds.has(id)) missingMeta.push({ id, sources: [...sources], count: sources.size });
});
missingMeta.sort((a, b) => b.count - a.count);

console.log('=== MedHub — auditoria Medicações vs protocolos ===\n');
console.log('Blocos de protocolo:', texts.length);
console.log('Fármacos detectados:', mentioned.size);
console.log('PS_DRUG_META:', metaIds.size);
console.log('Ausentes de PS_DRUG_META:', missingMeta.length, '\n');

missingMeta.forEach(({ id, sources, count }) => {
  console.log(String(count).padStart(2) + '  ' + id.padEnd(30) + sources.slice(0, 2).join(' · '));
});

const reportPath = path.join(__dirname, 'audit-medicacoes-gaps-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  protocolBlocks: texts.length,
  mentionedCount: mentioned.size,
  metaCount: metaIds.size,
  missingMeta
}, null, 2));

console.log('\nRelatório:', reportPath);

module.exports = { missingMeta, metaIds, mentioned };
