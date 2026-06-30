#!/usr/bin/env node
/* Importa rascunho JSON (Inner AI) → flashcards/deck-*.js
 * Uso: node scripts/import-flashcard-draft.js [--all | --topic sepse] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  root,
  deckDir,
  draftsDir,
  loadDecks,
  loadTopicsConfig,
  deckFileName,
  parseDraftFile,
  findDuplicateFronts,
  renderDeckJs,
  parseCliArgs
} = require('./_flashcard-sources');

function mergeDeckMeta (draft, existing) {
  if (!existing) {
    if (!draft.name || !draft.icon) {
      throw new Error(`Baralho novo "${draft.deckId}": inclua name e icon no JSON ou crie deck manualmente primeiro.`);
    }
    return {
      id: draft.deckId,
      name: draft.name,
      icon: draft.icon,
      source: draft.source || 'pronto-socorro',
      sourceLabel: draft.sourceLabel || 'Prescrições PS',
      desc: draft.desc || `${draft.cards.length} cards`
    };
  }

  const count = draft.cards.length;
  let desc = existing.desc || `${count} cards`;
  if (draft.desc) {
    desc = draft.desc;
  } else if (/^\d+ cards/.test(desc)) {
    desc = desc.replace(/^\d+ cards/, `${count} cards`);
  } else {
    desc = `${count} cards — ${desc}`;
  }

  return {
    id: existing.id,
    name: draft.name || existing.name,
    icon: draft.icon || existing.icon,
    source: draft.source || existing.source,
    sourceLabel: draft.sourceLabel || existing.sourceLabel,
    desc
  };
}

function importOne (draftPath, options) {
  const draft = parseDraftFile(draftPath);
  const config = loadTopicsConfig();
  const expected = config.cardsPerDeck || 30;
  const existing = loadDecks().find(d => d.id === draft.deckId);

  if (draft.cards.length !== expected) {
    throw new Error(`${draft.deckId}: esperado ${expected} cards, recebido ${draft.cards.length}.`);
  }

  const dupes = findDuplicateFronts(draft.cards);
  if (dupes.length) {
    const sample = dupes.slice(0, 3).map(d => `#${d.index} repete #${d.duplicateOf}`).join(', ');
    throw new Error(`${draft.deckId}: fronts duplicados — ${sample}`);
  }

  const meta = mergeDeckMeta(draft, existing);
  const outPath = path.join(deckDir, deckFileName(draft.deckId));
  const js = renderDeckJs(meta, draft.cards);

  console.log(options.dryRun ? 'DRY-RUN' : 'IMPORT', draft.deckId, '→', outPath);

  if (options.dryRun) return { deckId: draft.deckId, ok: true, dryRun: true };

  fs.writeFileSync(outPath, js, 'utf8');
  return { deckId: draft.deckId, ok: true, path: outPath };
}

function main () {
  const args = parseCliArgs(process.argv);

  if (!fs.existsSync(draftsDir)) {
    console.error('Pasta ausente:', draftsDir);
    process.exit(1);
  }

  const draftFiles = fs.readdirSync(draftsDir)
    .filter(f => f.endsWith('.json') && !f.endsWith('.example.json'))
    .map(f => path.join(draftsDir, f));

  const filtered = args.all
    ? draftFiles
    : args.topic
      ? draftFiles.filter(f => path.basename(f, '.json') === args.topic)
      : draftFiles;

  if (!filtered.length) {
    console.error('Nenhum rascunho em flashcards-sources/drafts/.', args.topic ? `Tema: ${args.topic}` : '');
    console.error('Salve o JSON da Inner AI como drafts/<tema>.json');
    process.exit(1);
  }

  console.log('=== MedHub — import flashcards ===\n');

  const results = [];
  let failed = false;

  filtered.forEach(file => {
    try {
      results.push(importOne(file, args));
    } catch (err) {
      failed = true;
      console.error('ERRO', path.basename(file), '—', err.message);
    }
  });

  if (failed) process.exit(1);

  if (args.dryRun) {
    console.log('\nDry-run OK — nenhum arquivo gravado.');
    process.exit(0);
  }

  console.log('\nValidando baralhos…');
  const validate = spawnSync(process.execPath, [path.join(__dirname, 'validate-flashcards.js')], {
    stdio: 'inherit',
    cwd: root
  });

  if (validate.status !== 0) {
    process.exit(validate.status || 1);
  }

  console.log('\nImport concluído. Lembre de bump ?v=fc-vX em app.html se publicar.');
}

main();
