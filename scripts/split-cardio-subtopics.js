#!/usr/bin/env node
/* Gera deck-cardiologia.js com subtemas — node scripts/split-cardio-subtopics.js */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'flashcards/deck-cardio-arritmias.js'), 'utf8');
const ctx = {};
vm.runInNewContext(src, ctx);
const cards = ctx.FLASHCARD_DECK_CARDIO_ARRITMIAS.cards;

const SUBTOPIC_META = {
  'cardio-taqui': {
    name: 'Taquiarritmias e TSVP',
    icon: '⚡',
    desc: 'TSVP, flutter, taquicardia atrial, instabilidade e WPW'
  },
  'cardio-fa': {
    name: 'FA e anticoagulação',
    icon: '🫀',
    desc: 'Fibrilação atrial, CHA₂DS₂-VASc, HAS-BLED e cardioversão'
  },
  'cardio-tv': {
    name: 'TV, FV e QT longo',
    icon: '💥',
    desc: 'Taquicardia ventricular, FV, torsades e R-sobre-T'
  },
  'cardio-bav': {
    name: 'BAV e marca-passo',
    icon: '🔌',
    desc: 'Bloqueios AV, bradicardia e modos de MP'
  },
  'cardio-pcr': {
    name: 'PCR e RCP',
    icon: '🆘',
    desc: 'Parada cardíaca, compressões, adrenalina e causas reversíveis'
  },
  'cardio-farma': {
    name: 'Fármacos antiarrítmicos',
    icon: '💊',
    desc: 'Classes I–IV, amiodarona e condutas farmacológicas'
  }
};

function classify (front, back) {
  const t = (front + ' ' + back).toLowerCase();

  if (/\b(classe i[abc]?|classe ii|classe iii|classe iv|procainamida|lidoca[ií]na|amiodarona cr[oô]nica|pneumonite|tireoidiano|fotossensibilidade|bloqueio de k\+|verapamil\/diltiazem)\b/.test(t)) {
    return 'cardio-farma';
  }
  if (/\b(pcr|rcp|compress[oõ]|adrenalina 1 mg|assistolia|aesp|bls|c-a-b|30:2|30 compress|desfibril|hands-off|5 h|5 t|tamponamento|trombose coron|pneumot[oó]rax|commotio|p[oó]s-rce|temperatura alvo|neuroprote|morte s[uú]bita|hipertrofia septal|ritmo n[aã]o-choc|parada card[ií]aca|fv recebe choque|choque bif[aá]sico)\b/.test(t)) {
    return 'cardio-pcr';
  }
  if (/\b(bav|bloqueio av|mobitz|marcapasso|marca-passo|\bmp modo|vvi|ddd|vdd|dddr|bradicardia|n[oó] sinusal|supra-hissiano|infra-hissiano|pr 240|pr > 200|1[oº] grau|ritmo idioventricular|riva)\b/.test(t)) {
    return 'cardio-bav';
  }
  if (/\b(cha2ds2|has-bled|anticoagul|doac|dabigatrana|rivaroxabana|apixabana|edoxabana|ap[eê]ndice atrial|trombo atrial|mnem[oô]nico abc|cardiovertid.*4 semanas|atordoamento atrial)\b/.test(t) &&
      !/\b(tsvp|adenosina|reentrada nodal)\b/.test(t)) {
    return 'cardio-fa';
  }
  if (/\b(\btv\b|torsades|fibrila[cç][aã]o ventricular|\bfv\b|qrs largo|polim[oó]rfica|r-sobre-t|cdi\b|qt longo|qt c|monom[oó]rfica sustentada)\b/.test(t)) {
    return 'cardio-tv';
  }
  return 'cardio-taqui';
}

const buckets = Object.fromEntries(Object.keys(SUBTOPIC_META).map(k => [k, []]));
cards.forEach(card => {
  buckets[classify(card.front, card.back)].push(card);
});

const q = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

function renderCards (list) {
  return list.map(c =>
    `      { front: ${q(c.front)}, back: ${q(c.back)} }`
  ).join(',\n');
}

const subtopicBlocks = Object.entries(SUBTOPIC_META).map(([id, meta]) => {
  const list = buckets[id];
  return `  {
    id: ${q(id)},
    parentId: 'cardiologia',
    name: ${q(meta.name)},
    icon: ${q(meta.icon)},
    desc: ${q(list.length + ' cards — ' + meta.desc)},
    cards: [
${renderCards(list)}
    ]
  }`;
}).join(',\n');

const total = cards.length;
const out = `/* Cardiologia — baralho com subtemas (conteúdo educacional) */

var FLASHCARD_CARDIO_LEGACY_ID = 'cardio-arritmias';
var FLASHCARD_CARDIO_LEGACY_FRONTS = [
${cards.map(c => '  ' + q(c.front)).join(',\n')}
];

var FLASHCARD_DECK_CARDIOLOGIA = {
  id: 'cardiologia',
  group: true,
  name: 'Cardiologia',
  icon: '💓',
  source: 'guia-emergencia',
  sourceLabel: 'Guia de emergência',
  desc: '${total} cards em ${Object.keys(SUBTOPIC_META).length} subtemas — arritmias, FA, PCR e fármacos.',
  cards: []
};

var FLASHCARD_CARDIO_SUBTOPICS = [
${subtopicBlocks}
];
`;

const outPath = path.join(root, 'flashcards/deck-cardiologia.js');
fs.writeFileSync(outPath, out, 'utf8');

console.log('Gerado:', outPath);
Object.entries(buckets).forEach(([id, list]) => {
  console.log(' ', id, list.length);
});
console.log('Total:', total);
