#!/usr/bin/env node
/* Importa subtema de cardiologia → flashcards/deck-cardiologia.js
 * Uso: node scripts/import-cardio-subtopic.js [--topic cardio-icc | arquivo.json]
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const {
  root,
  draftsDir,
  parseDraftFile,
  findDuplicateFronts,
  parseCliArgs
} = require('./_flashcard-sources');

const deckPath = path.join(root, 'flashcards/deck-cardiologia.js');

function q (s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function renderCards (cards) {
  return cards.map(c =>
    `      { front: ${q(c.front)}, back: ${q(c.back)} }`
  ).join(',\n');
}

function renderSubtopic (st) {
  return `  {
    id: ${q(st.id)},
    parentId: 'cardiologia',
    name: ${q(st.name)},
    icon: ${q(st.icon)},
    desc: ${q(st.desc)},
    cards: [
${renderCards(st.cards)}
    ]
  }`;
}

function writeCardiologiaDeck (legacyFronts, parent, subtopics) {
  const total = subtopics.reduce((n, s) => n + s.cards.length, 0);
  const parentDesc = `${total} cards em ${subtopics.length} subtemas — arritmias, IC, FA, PCR e fármacos.`;

  const legacyLines = legacyFronts.map(f => '  ' + q(f)).join(',\n');

  const out = `/* Cardiologia — baralho com subtemas (conteúdo educacional) */

var FLASHCARD_CARDIO_LEGACY_ID = 'cardio-arritmias';
var FLASHCARD_CARDIO_LEGACY_FRONTS = [
${legacyLines}
];

var FLASHCARD_DECK_CARDIOLOGIA = {
  id: 'cardiologia',
  group: true,
  name: 'Cardiologia',
  icon: '💓',
  source: 'guia-emergencia',
  sourceLabel: 'Guia de emergência',
  desc: ${q(parentDesc)},
  cards: []
};

var FLASHCARD_CARDIO_SUBTOPICS = [
${subtopics.map(renderSubtopic).join(',\n')}
];
`;

  fs.writeFileSync(deckPath, out, 'utf8');
}

function loadCardiologia () {
  const ctx = vm.createContext({ console });
  vm.runInContext(fs.readFileSync(deckPath, 'utf8'), ctx, { filename: 'deck-cardiologia.js' });
  return {
    legacyFronts: ctx.FLASHCARD_CARDIO_LEGACY_FRONTS || [],
    parent: ctx.FLASHCARD_DECK_CARDIOLOGIA,
    subtopics: ctx.FLASHCARD_CARDIO_SUBTOPICS || []
  };
}

function importSubtopic (draftPath, dryRun) {
  const draft = parseDraftFile(draftPath);
  if (!draft.deckId.startsWith('cardio-')) {
    throw new Error('Subtema de cardiologia deve usar deckId cardio-* (ex.: cardio-icc).');
  }
  if (!draft.name || !draft.icon) {
    throw new Error(`${draft.deckId}: inclua name e icon no JSON.`);
  }
  if (!draft.cards.length) {
    throw new Error(`${draft.deckId}: nenhum card no rascunho.`);
  }

  const dupes = findDuplicateFronts(draft.cards);
  if (dupes.length) {
    const sample = dupes.slice(0, 3).map(d => `#${d.index} repete #${d.duplicateOf}`).join(', ');
    throw new Error(`${draft.deckId}: fronts duplicados — ${sample}`);
  }

  const { legacyFronts, parent, subtopics } = loadCardiologia();
  const allFronts = new Set();
  subtopics.forEach(st => {
    if (st.id === draft.deckId) return;
    st.cards.forEach(c => allFronts.add(c.front.toLowerCase().replace(/\s+/g, ' ')));
  });
  draft.cards.forEach((c, i) => {
    const key = c.front.toLowerCase().replace(/\s+/g, ' ');
    if (allFronts.has(key)) {
      throw new Error(`${draft.deckId}: card #${i + 1} repete front de outro subtema.`);
    }
  });

  const count = draft.cards.length;
  const subtopic = {
    id: draft.deckId,
    parentId: 'cardiologia',
    name: draft.name,
    icon: draft.icon,
    desc: draft.desc || `${count} cards`,
    cards: draft.cards
  };

  const idx = subtopics.findIndex(s => s.id === draft.deckId);
  const next = subtopics.slice();
  if (idx >= 0) next[idx] = subtopic;
  else next.push(subtopic);

  next.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  console.log(dryRun ? 'DRY-RUN' : 'IMPORT', draft.deckId, '→', deckPath, `(${count} cards)`);

  if (!dryRun) {
    writeCardiologiaDeck(legacyFronts, parent, next);
  }

  return { deckId: draft.deckId, count };
}

function main () {
  const args = parseCliArgs(process.argv);
  let draftPath = null;

  if (args.topic) {
    draftPath = path.join(draftsDir, `${args.topic}.json`);
  } else {
    const positional = process.argv.slice(2).find(a => a.endsWith('.json'));
    if (positional) draftPath = path.resolve(positional);
  }

  if (!draftPath || !fs.existsSync(draftPath)) {
    console.error('Uso: node scripts/import-cardio-subtopic.js --topic cardio-icc');
    console.error('  ou: node scripts/import-cardio-subtopic.js flashcards-sources/drafts/cardio-icc.json');
    process.exit(1);
  }

  console.log('=== MedHub — import subtema cardiologia ===\n');

  try {
    importSubtopic(draftPath, args.dryRun);
  } catch (err) {
    console.error('ERRO —', err.message);
    process.exit(1);
  }

  if (args.dryRun) {
    console.log('\nDry-run OK.');
    process.exit(0);
  }

  console.log('\nValidando…');
  const validate = spawnSync(process.execPath, [path.join(__dirname, 'validate-flashcards.js')], {
    stdio: 'inherit',
    cwd: root
  });
  process.exit(validate.status || 0);
}

main();
