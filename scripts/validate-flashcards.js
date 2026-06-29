#!/usr/bin/env node
/* Valida baralhos de flashcards — node scripts/validate-flashcards.js */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const deckDir = path.join(root, 'flashcards');
const ctx = { console };

fs.readdirSync(deckDir)
  .filter(f => f.startsWith('deck-') && f.endsWith('.js'))
  .sort()
  .forEach(file => {
    const code = fs.readFileSync(path.join(deckDir, file), 'utf8');
    vm.runInNewContext(code, ctx, { filename: file });
  });

const registry = [
  'FLASHCARD_DECK_SEPSE', 'FLASHCARD_DECK_IAM', 'FLASHCARD_DECK_AVC',
  'FLASHCARD_DECK_ANAFILAXIA', 'FLASHCARD_DECK_DENGUE', 'FLASHCARD_DECK_PNEUMONIA',
  'FLASHCARD_DECK_HIPOGLICEMIA', 'FLASHCARD_DECK_CRISE_HIPERTENSIVA',
  'FLASHCARD_DECK_VIA_AEREA', 'FLASHCARD_DECK_GASOMETRIA'
];

let ok = true;
let total = 0;

registry.forEach(key => {
  const deck = ctx[key];
  if (!deck) {
    console.error('Faltando:', key);
    ok = false;
    return;
  }
  const n = deck.cards?.length || 0;
  total += n;
  const status = n === 30 ? 'OK' : 'AVISO';
  if (n !== 30) ok = false;
  console.log(status, deck.id, n, 'cards');
});

console.log('---');
console.log('Total:', total, 'cards em', registry.length, 'baralhos');
process.exit(ok ? 0 : 1);
