#!/usr/bin/env node
/* Mescla lote JSON em draft existente — node scripts/merge-flashcard-batch.js <deckId> <batch.json> */

const fs = require('fs');
const path = require('path');

const deckId = process.argv[2];
const batchFile = process.argv[3];
if (!deckId || !batchFile) {
  console.error('Uso: node scripts/merge-flashcard-batch.js <deckId> <batch.json>');
  process.exit(1);
}

const draftPath = path.join(__dirname, '..', 'flashcards-sources', 'drafts', `${deckId}.json`);
const batchPath = path.resolve(batchFile);
const existing = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

const merged = {
  ...existing,
  cards: existing.cards.concat(batch.cards)
};

const seen = new Map();
merged.cards.forEach((card, i) => {
  const key = card.front.toLowerCase().replace(/\s+/g, ' ');
  if (seen.has(key)) {
    throw new Error(`Duplicado #${i + 1} repete #${seen.get(key) + 1}: ${card.front.slice(0, 60)}`);
  }
  seen.set(key, i);
});

const count = merged.cards.length;
merged.desc = `${count} cards — TSVP, FA, TV, BAV, PCR e emergências cardíacas.`;

fs.writeFileSync(draftPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
console.log('OK', count, 'cards →', draftPath);
