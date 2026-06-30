#!/usr/bin/env node
/* Exporta fontes clínicas MedHub → .md para upload na Inner AI
 * Uso: node scripts/export-flashcard-sources.js [--all | --topic sepse]
 */

const fs = require('fs');
const path = require('path');
const {
  exportDir,
  loadClinicalContext,
  loadDecks,
  loadTopicsConfig,
  getDeckTopicEntry,
  buildExportMarkdown,
  ensureDirs,
  parseCliArgs,
  sourcesDir
} = require('./_flashcard-sources');

function main () {
  const args = parseCliArgs(process.argv);
  const config = loadTopicsConfig();
  const ctx = loadClinicalContext();
  const decks = loadDecks();
  ensureDirs();

  const selected = args.all
    ? decks
    : args.topic
      ? decks.filter(d => d.id === args.topic)
      : decks;

  if (!selected.length) {
    console.error('Nenhum baralho encontrado.', args.topic ? `Tema: ${args.topic}` : '');
    process.exit(1);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    exports: []
  };

  console.log('=== MedHub — export flashcards (Inner AI) ===\n');

  selected.forEach(deck => {
    const topicEntry = getDeckTopicEntry(config, deck.id);
    if (!topicEntry) {
      console.warn('AVISO', deck.id, '— sem entrada em flashcards-sources/topics.json');
    }

    const md = buildExportMarkdown(deck, topicEntry || { sources: [], cardsPerDeck: config.cardsPerDeck }, ctx);
    const outFile = path.join(exportDir, `${deck.id}.md`);
    fs.writeFileSync(outFile, md, 'utf8');

    manifest.exports.push({
      deckId: deck.id,
      name: deck.name,
      cards: deck.cards?.length || 0,
      file: path.relative(sourcesDir, outFile).replace(/\\/g, '/')
    });

    console.log('OK', deck.id, '→', outFile);
  });

  const manifestPath = path.join(sourcesDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('\nManifest:', manifestPath);
  console.log('Prompt Inner:', path.join(sourcesDir, 'inner-assistant-prompt.txt'));
  console.log('\nPróximo passo: envie os .md para a base de conhecimento do assistente na Inner AI.');
}

main();
