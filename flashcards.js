/* Flashcards — Fase A: baralhos fixos + modo estudo */

const FC_STORAGE_KEY = 'medhub-flashcards-progress-v1';

let fcActiveDeck = null;
let fcStudyQueue = [];
let fcStudyIndex = 0;
let fcSessionStats = { right: 0, wrong: 0 };
let fcCardFlipped = false;

function fcLoadProgress () {
  try {
    const raw = localStorage.getItem(FC_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function fcSaveProgress (data) {
  try {
    localStorage.setItem(FC_STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota */ }
}

function fcGetDeckProgress (deckId) {
  const all = fcLoadProgress();
  return all[deckId] || { mastered: [], wrong: [], lastStudied: null };
}

function fcDeckMasteryPct (deck) {
  const p = fcGetDeckProgress(deck.id);
  const total = deck.cards.length;
  if (!total) return 0;
  const mastered = new Set(p.mastered || []).size;
  return Math.round((mastered / total) * 100);
}

function fcNorm (text) {
  if (typeof clinicalNorm === 'function') return clinicalNorm(text);
  return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function initFlashcards () {
  const grid = document.getElementById('fc-deck-grid');
  if (!grid || grid.dataset.fcBound) return;
  grid.dataset.fcBound = '1';

  fcRenderDeckGrid(FLASHCARD_DECKS);

  document.getElementById('fc-search')?.addEventListener('input', () => {
    const q = fcNorm(document.getElementById('fc-search').value);
    const list = !q
      ? FLASHCARD_DECKS
      : FLASHCARD_DECKS.filter(d =>
        fcNorm(d.name + ' ' + d.desc + ' ' + d.id).includes(q)
      );
    fcRenderDeckGrid(list);
  });

  document.getElementById('fc-study-back')?.addEventListener('click', fcShowDeckList);
  document.getElementById('fc-summary-back')?.addEventListener('click', fcShowDeckList);
  document.getElementById('fc-summary-restart')?.addEventListener('click', () => {
    if (fcActiveDeck) fcStartStudy(fcActiveDeck.id, true);
  });

  document.getElementById('fc-card')?.addEventListener('click', fcFlipCard);
  document.getElementById('fc-btn-flip')?.addEventListener('click', e => {
    e.stopPropagation();
    fcFlipCard();
  });
  document.getElementById('fc-btn-wrong')?.addEventListener('click', () => fcAnswerCard(false));
  document.getElementById('fc-btn-right')?.addEventListener('click', () => fcAnswerCard(true));
  document.getElementById('fc-btn-skip')?.addEventListener('click', () => fcNextCard(null));

  document.getElementById('fc-shuffle-toggle')?.addEventListener('change', e => {
    if (fcActiveDeck && document.getElementById('fc-study-view') && !document.getElementById('fc-study-view').hidden) {
      fcStartStudy(fcActiveDeck.id, e.target.checked);
    }
  });
}

function fcRenderDeckGrid (decks) {
  const grid = document.getElementById('fc-deck-grid');
  const empty = document.getElementById('fc-empty');
  const count = document.getElementById('fc-deck-count');
  if (!grid) return;

  const totalCards = FLASHCARD_DECKS.reduce((n, d) => n + d.cards.length, 0);
  if (count) {
    count.textContent = decks.length === FLASHCARD_DECKS.length
      ? decks.length + ' temas · ' + totalCards + ' cards'
      : decks.length + ' de ' + FLASHCARD_DECKS.length + ' temas';
  }

  if (!decks.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = decks.map(deck => {
    const pct = fcDeckMasteryPct(deck);
    return `
      <button type="button" class="calc-category-btn ferramentas-card fc-deck-btn" data-fc-deck="${deck.id}">
        <span class="calc-category-icon">${deck.icon}</span>
        <span class="calc-category-name">${deck.name}</span>
        <span class="ferramentas-card-desc muted">${deck.cards.length} cards · ${deck.desc}</span>
        <span class="fc-deck-progress" aria-label="Domínio ${pct}%">
          <span class="fc-deck-progress-bar" style="width:${pct}%"></span>
          <span class="fc-deck-progress-label">${pct}% dominado</span>
        </span>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('[data-fc-deck]').forEach(btn => {
    btn.addEventListener('click', () => fcStartStudy(btn.dataset.fcDeck));
  });
}

function fcShowDeckList () {
  document.getElementById('fc-deck-list-view').hidden = false;
  document.getElementById('fc-study-view').hidden = true;
  document.getElementById('fc-summary-view').hidden = true;
  fcActiveDeck = null;

  const q = fcNorm(document.getElementById('fc-search')?.value || '');
  const list = !q
    ? FLASHCARD_DECKS
    : FLASHCARD_DECKS.filter(d => fcNorm(d.name + ' ' + d.desc + ' ' + d.id).includes(q));
  fcRenderDeckGrid(list);
}

function fcStartStudy (deckId, shuffle) {
  const deck = FLASHCARD_DECKS.find(d => d.id === deckId);
  if (!deck) return;

  fcActiveDeck = deck;
  fcSessionStats = { right: 0, wrong: 0 };
  fcStudyIndex = 0;
  fcCardFlipped = false;

  const doShuffle = shuffle === true || document.getElementById('fc-shuffle-toggle')?.checked;
  const indices = deck.cards.map((_, i) => i);
  if (doShuffle) {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }
  fcStudyQueue = indices;

  document.getElementById('fc-deck-list-view').hidden = true;
  document.getElementById('fc-study-view').hidden = false;
  document.getElementById('fc-summary-view').hidden = true;

  document.getElementById('fc-study-deck-title').textContent = deck.icon + ' ' + deck.name;
  const sourceEl = document.getElementById('fc-study-source');
  if (sourceEl) {
    sourceEl.innerHTML = 'Baseado em: <button type="button" class="fc-source-link" data-fc-source="' +
      deck.source + '">' + deck.sourceLabel + '</button>';
    sourceEl.querySelector('.fc-source-link')?.addEventListener('click', () => {
      if (typeof showSection === 'function') showSection(deck.source);
    });
  }

  fcRenderCurrentCard();
}

function fcRenderCurrentCard () {
  if (!fcActiveDeck || fcStudyIndex >= fcStudyQueue.length) {
    fcShowSummary();
    return;
  }

  const cardIdx = fcStudyQueue[fcStudyIndex];
  const card = fcActiveDeck.cards[cardIdx];
  fcCardFlipped = false;

  const cardEl = document.getElementById('fc-card');
  if (cardEl) cardEl.classList.remove('is-flipped');

  document.getElementById('fc-card-front').textContent = card.front;
  document.getElementById('fc-card-back').textContent = card.back;

  const total = fcStudyQueue.length;
  const current = fcStudyIndex + 1;
  document.getElementById('fc-study-progress').textContent = current + ' / ' + total;
  const bar = document.getElementById('fc-study-progress-bar');
  if (bar) bar.style.width = Math.round((current / total) * 100) + '%';

  document.getElementById('fc-flip-hint').hidden = false;
  document.getElementById('fc-answer-actions').hidden = true;
}

function fcFlipCard () {
  if (fcCardFlipped) return;
  fcCardFlipped = true;
  document.getElementById('fc-card')?.classList.add('is-flipped');
  document.getElementById('fc-flip-hint').hidden = true;
  document.getElementById('fc-answer-actions').hidden = false;
}

function fcAnswerCard (correct) {
  if (!fcCardFlipped) {
    fcFlipCard();
    return;
  }
  fcNextCard(correct);
}

function fcNextCard (correct) {
  if (!fcActiveDeck) return;

  const cardIdx = fcStudyQueue[fcStudyIndex];
  const progress = fcLoadProgress();
  const deckProg = progress[fcActiveDeck.id] || { mastered: [], wrong: [], lastStudied: null };

  if (correct === true) {
    fcSessionStats.right++;
    if (!deckProg.mastered.includes(cardIdx)) deckProg.mastered.push(cardIdx);
    deckProg.wrong = (deckProg.wrong || []).filter(i => i !== cardIdx);
  } else if (correct === false) {
    fcSessionStats.wrong++;
    if (!deckProg.wrong.includes(cardIdx)) deckProg.wrong.push(cardIdx);
    deckProg.mastered = (deckProg.mastered || []).filter(i => i !== cardIdx);
  }

  deckProg.lastStudied = new Date().toISOString();
  progress[fcActiveDeck.id] = deckProg;
  fcSaveProgress(progress);

  fcStudyIndex++;
  fcRenderCurrentCard();
}

function fcShowSummary () {
  document.getElementById('fc-study-view').hidden = true;
  document.getElementById('fc-summary-view').hidden = false;

  const total = fcSessionStats.right + fcSessionStats.wrong;
  document.getElementById('fc-summary-title').textContent =
    total ? 'Sessão concluída' : 'Baralho vazio';

  document.getElementById('fc-summary-stats').innerHTML =
    '<p><strong>' + fcSessionStats.right + '</strong> acertos · ' +
    '<strong>' + fcSessionStats.wrong + '</strong> para revisar</p>' +
    (fcActiveDeck
      ? '<p class="muted">Domínio do tema: <strong>' + fcDeckMasteryPct(fcActiveDeck) + '%</strong></p>'
      : '');

  const wrongIds = fcGetDeckProgress(fcActiveDeck?.id).wrong || [];
  const reviewEl = document.getElementById('fc-summary-review');
  if (reviewEl && fcActiveDeck && wrongIds.length) {
    reviewEl.hidden = false;
    reviewEl.innerHTML = '<p class="fc-review-title">Cards para rever:</p><ul>' +
      wrongIds.slice(0, 5).map(i => {
        const c = fcActiveDeck.cards[i];
        return c ? '<li>' + c.front + '</li>' : '';
      }).join('') +
      (wrongIds.length > 5 ? '<li class="muted">+' + (wrongIds.length - 5) + ' mais</li>' : '') +
      '</ul>';
  } else if (reviewEl) {
    reviewEl.hidden = true;
    reviewEl.innerHTML = '';
  }
}

function fcOnSectionShow () {
  fcShowDeckList();
}

function fcOpenDeck (deckId) {
  showSection('flashcards');
  fcStartStudy(deckId);
}
