/* Flashcards — agregador de baralhos */

const FLASHCARD_DECK_KEYS = [
  'FLASHCARD_DECK_SEPSE',
  'FLASHCARD_DECK_IAM',
  'FLASHCARD_DECK_AVC',
  'FLASHCARD_DECK_ANAFILAXIA',
  'FLASHCARD_DECK_DENGUE',
  'FLASHCARD_DECK_PNEUMONIA',
  'FLASHCARD_DECK_HIPOGLICEMIA',
  'FLASHCARD_DECK_CRISE_HIPERTENSIVA',
  'FLASHCARD_DECK_VIA_AEREA',
  'FLASHCARD_DECK_GASOMETRIA',
  'FLASHCARD_DECK_CARDIOLOGIA'
];

function fcResolveDeck (key) {
  try {
    return Function('return typeof ' + key + ' !== "undefined" ? ' + key + ' : null')();
  } catch {
    return null;
  }
}

function fcExpandCardioSubtopics (parentDeck, subtopics) {
  const decks = [];
  subtopics.forEach(st => {
    decks.push({
      ...st,
      source: parentDeck.source,
      sourceLabel: parentDeck.sourceLabel
    });
  });

  const cardMap = [];
  const allCards = [];
  subtopics.forEach(st => {
    st.cards.forEach((card, idx) => {
      cardMap.push({ deckId: st.id, idx });
      allCards.push(card);
    });
  });

  decks.push({
    id: 'cardiologia-todos',
    parentId: 'cardiologia',
    isAllGroup: true,
    name: 'Todos — Cardiologia',
    icon: '📚',
    source: parentDeck.source,
    sourceLabel: parentDeck.sourceLabel,
    desc: allCards.length + ' cards — todos os subtemas juntos',
    cards: allCards,
    cardMap
  });

  return decks;
}

function fcBuildFlashcardDecks () {
  const expanded = [];

  FLASHCARD_DECK_KEYS.forEach(key => {
    const deck = fcResolveDeck(key);
    if (!deck) return;
    expanded.push(deck);

    if (deck.group && typeof FLASHCARD_CARDIO_SUBTOPICS !== 'undefined') {
      expanded.push(...fcExpandCardioSubtopics(deck, FLASHCARD_CARDIO_SUBTOPICS));
    }
  });

  return expanded.sort((a, b) => {
    const aTop = a.parentId ? 1 : 0;
    const bTop = b.parentId ? 1 : 0;
    if (aTop !== bTop) return aTop - bTop;
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

const FLASHCARD_DECKS = fcBuildFlashcardDecks();
const FLASHCARD_TOP_DECKS = FLASHCARD_DECKS.filter(d => !d.parentId);

function fcGetDeckById (deckId) {
  return FLASHCARD_DECKS.find(d => d.id === deckId) || null;
}

function fcGetCardioSubtopics () {
  return FLASHCARD_DECKS
    .filter(d => d.parentId === 'cardiologia' && !d.isAllGroup)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

function fcGetCardioAllDeck () {
  return fcGetDeckById('cardiologia-todos');
}

function fcIsGroupDeck (deck) {
  return !!(deck && deck.group);
}

function fcProgressRefForCard (deck, cardIdx) {
  if (deck.cardMap && deck.cardMap[cardIdx]) {
    return deck.cardMap[cardIdx];
  }
  return { deckId: deck.id, idx: cardIdx };
}

function fcMigrateCardioArritmiasProgress () {
  if (typeof localStorage === 'undefined') return;
  if (typeof FLASHCARD_CARDIO_LEGACY_FRONTS === 'undefined') return;

  const legacyId = typeof FLASHCARD_CARDIO_LEGACY_ID !== 'undefined'
    ? FLASHCARD_CARDIO_LEGACY_ID
    : 'cardio-arritmias';

  let progress;
  try {
    progress = JSON.parse(localStorage.getItem('medhub-flashcards-progress-v2') || '{}');
  } catch {
    return;
  }

  const legacy = progress[legacyId];
  if (!legacy || !legacy.cards) return;

  const frontToRef = new Map();
  fcGetCardioSubtopics().forEach(st => {
    st.cards.forEach((card, idx) => frontToRef.set(card.front, { deckId: st.id, idx }));
  });

  let migrated = 0;
  FLASHCARD_CARDIO_LEGACY_FRONTS.forEach((front, oldIdx) => {
    const prog = legacy.cards[String(oldIdx)];
    if (!prog) return;
    const ref = frontToRef.get(front);
    if (!ref) return;
    if (!progress[ref.deckId]) progress[ref.deckId] = { cards: {}, lastStudied: legacy.lastStudied };
    if (!progress[ref.deckId].cards[String(ref.idx)]) {
      progress[ref.deckId].cards[String(ref.idx)] = prog;
      migrated++;
    }
  });

  if (migrated) {
    delete progress[legacyId];
    try {
      localStorage.setItem('medhub-flashcards-progress-v2', JSON.stringify(progress));
    } catch { /* quota */ }
  }
}

fcMigrateCardioArritmiasProgress();
