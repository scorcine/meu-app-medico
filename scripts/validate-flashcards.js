#!/usr/bin/env node
/* Valida baralhos de flashcards — node scripts/validate-flashcards.js */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadTopicsConfig, expectedCardsForDeck } = require('./_flashcard-sources');

const root = path.join(__dirname, '..');
const deckDir = path.join(root, 'flashcards');
const ctx = { console };

let config;
try {
  config = loadTopicsConfig();
} catch {
  config = { cardsPerDeck: 30, decks: [] };
}

fs.readdirSync(deckDir)
  .filter(f => f.startsWith('deck-') && f.endsWith('.js'))
  .sort()
  .forEach(file => {
    const code = fs.readFileSync(path.join(deckDir, file), 'utf8');
    vm.runInNewContext(code, ctx, { filename: file });
  });

const registry = Object.keys(ctx)
  .filter(k => k.startsWith('FLASHCARD_DECK_'))
  .sort();

let ok = true;
let total = 0;

registry.forEach(key => {
  const deck = ctx[key];
  if (!deck) {
    console.error('Faltando:', key);
    ok = false;
    return;
  }

  if (deck.group) {
    const subs = ctx.FLASHCARD_CARDIO_SUBTOPICS || [];
    const subTotal = subs.reduce((n, s) => n + (s.cards?.length || 0), 0);
    total += subTotal;
    const expected = expectedCardsForDeck(config, deck.id);
    const status = subTotal === expected ? 'OK' : 'AVISO';
    if (subTotal !== expected) ok = false;
    console.log(status, deck.id, subTotal, 'cards em', subs.length, 'subtemas', `(meta ${expected})`);
    subs.forEach(st => {
      const n = st.cards?.length || 0;
      if (!n) {
        console.error('  AVISO subtema vazio:', st.id);
        ok = false;
      } else {
        console.log('  ·', st.id, n);
      }
    });
    return;
  }

  const n = deck.cards?.length || 0;
  const expected = expectedCardsForDeck(config, deck.id);
  total += n;
  const status = n === expected ? 'OK' : 'AVISO';
  if (n !== expected) ok = false;
  console.log(status, deck.id, n, 'cards', `(meta ${expected})`);
});

console.log('---');
console.log('Total:', total, 'cards');
process.exit(ok ? 0 : 1);
