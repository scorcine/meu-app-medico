/* Flashcards — estudo + revisão espaçada (Fácil 15d · Médio 10d · Errei 7d) */

const FC_STORAGE_KEY = 'medhub-flashcards-progress-v2';
const FC_STORAGE_KEY_V1 = 'medhub-flashcards-progress-v1';

const FC_REVIEW_DAYS = { easy: 15, medium: 10, wrong: 7 };
const FC_RATING_LABELS = { easy: 'Fácil', medium: 'Médio', wrong: 'Errei' };
const FC_NEW_DECK_IDS = ['cardio-arritmias'];

let fcActiveDeck = null;
let fcStudyQueue = [];
let fcStudyIndex = 0;
let fcSessionStats = { easy: 0, medium: 0, wrong: 0, skipped: 0 };
let fcCardFlipped = false;
let fcStudyMode = 'smart';

function fcTodayKey () {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function fcParseDay (dayKey) {
  const [y, m, d] = String(dayKey || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function fcAddDays (dayKey, days) {
  const d = fcParseDay(dayKey) || new Date();
  d.setDate(d.getDate() + days);
  return fcTodayKeyFromDate(d);
}

function fcTodayKeyFromDate (date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function fcLoadProgressRaw () {
  try {
    let raw = localStorage.getItem(FC_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(FC_STORAGE_KEY_V1);
      if (raw) {
        const migrated = fcMigrateV1(JSON.parse(raw));
        fcSaveProgress(migrated);
        return migrated;
      }
    }
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function fcMigrateV1 (old) {
  const out = {};
  const today = fcTodayKey();
  Object.keys(old || {}).forEach(deckId => {
    const dp = old[deckId] || {};
    const cards = {};
    (dp.mastered || []).forEach(i => {
      cards[String(i)] = {
        rating: 'easy',
        lastReview: dp.lastStudied || new Date().toISOString(),
        nextReview: fcAddDays(today, FC_REVIEW_DAYS.easy)
      };
    });
    (dp.wrong || []).forEach(i => {
      cards[String(i)] = {
        rating: 'wrong',
        lastReview: dp.lastStudied || new Date().toISOString(),
        nextReview: today
      };
    });
    out[deckId] = { cards, lastStudied: dp.lastStudied || null };
  });
  return out;
}

function fcSaveProgress (data) {
  try {
    localStorage.setItem(FC_STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota */ }
}

function fcLoadProgress () {
  return fcLoadProgressRaw();
}

function fcGetDeckProgress (deckId) {
  const all = fcLoadProgress();
  return all[deckId] || { cards: {}, lastStudied: null };
}

function fcGetCardProgress (deckId, cardIdx) {
  const dp = fcGetDeckProgress(deckId);
  return dp.cards?.[String(cardIdx)] || null;
}

function fcIsCardDue (cardProg) {
  if (!cardProg || !cardProg.nextReview) return true;
  return cardProg.nextReview <= fcTodayKey();
}

function fcDeckDueIndices (deck) {
  const due = [];
  const unseen = [];
  deck.cards.forEach((_, i) => {
    const p = fcGetCardProgress(deck.id, i);
    if (!p) unseen.push(i);
    else if (fcIsCardDue(p)) due.push(i);
  });
  due.sort((a, b) => {
    const pa = fcGetCardProgress(deck.id, a);
    const pb = fcGetCardProgress(deck.id, b);
    return (pa?.nextReview || '').localeCompare(pb?.nextReview || '');
  });
  return { due, unseen };
}

function fcDeckDueCount (deck) {
  return fcDeckDueIndices(deck).due.length;
}

function fcTotalDueCount () {
  return (FLASHCARD_DECKS || []).reduce((n, d) => n + fcDeckDueCount(d), 0);
}

function fcDeckMasteryPct (deck) {
  const dp = fcGetDeckProgress(deck.id);
  const rated = Object.keys(dp.cards || {}).length;
  if (!rated) return 0;
  const easy = Object.values(dp.cards).filter(c => c.rating === 'easy').length;
  return Math.round((easy / deck.cards.length) * 100);
}

function fcFormatReviewDay (dayKey) {
  const d = fcParseDay(dayKey);
  if (!d) return '—';
  const today = fcParseDay(fcTodayKey());
  const diff = Math.round((d - today) / 86400000);
  if (diff <= 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  if (diff < 7) return 'em ' + diff + ' dias';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function fcNorm (text) {
  if (typeof clinicalNorm === 'function') return clinicalNorm(text);
  return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function fcEscapeHtml (str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initFlashcards () {
  const grid = document.getElementById('fc-deck-grid');
  if (!grid || grid.dataset.fcBound) return;
  grid.dataset.fcBound = '1';

  fcRenderDeckList();

  document.getElementById('fc-search')?.addEventListener('input', fcRenderDeckList);

  document.getElementById('fc-study-back')?.addEventListener('click', fcShowDeckList);
  document.getElementById('fc-summary-back')?.addEventListener('click', fcShowDeckList);
  document.getElementById('fc-summary-restart')?.addEventListener('click', () => {
    if (!fcActiveDeck) return;
    const mode = fcDeckDueCount(fcActiveDeck) ? 'review' : (fcStudyMode === 'all' ? 'all' : 'smart');
    fcStartStudy(fcActiveDeck.id, { mode });
  });

  document.getElementById('fc-card')?.addEventListener('click', fcFlipCard);
  document.getElementById('fc-btn-flip')?.addEventListener('click', e => {
    e.stopPropagation();
    fcFlipCard();
  });
  document.getElementById('fc-btn-easy')?.addEventListener('click', () => fcAnswerCard('easy'));
  document.getElementById('fc-btn-medium')?.addEventListener('click', () => fcAnswerCard('medium'));
  document.getElementById('fc-btn-wrong')?.addEventListener('click', () => fcAnswerCard('wrong'));
  document.getElementById('fc-btn-skip')?.addEventListener('click', () => fcNextCard(null));

  document.getElementById('fc-shuffle-toggle')?.addEventListener('change', () => {
    if (fcActiveDeck && !document.getElementById('fc-study-view')?.hidden) {
      fcStartStudy(fcActiveDeck.id, { keepQueue: false });
    }
  });
}

function fcRenderReviewBanner () {
  const el = document.getElementById('fc-review-banner');
  if (!el) return;
  const totalDue = fcTotalDueCount();
  if (totalDue <= 0) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  el.hidden = false;
  el.innerHTML =
    '<div class="fc-review-banner-inner">' +
      '<div><strong>' + totalDue + '</strong> card' + (totalDue === 1 ? '' : 's') + ' pront' + (totalDue === 1 ? 'o' : 'os') + ' para revisão</div>' +
      '<p class="muted">Com base nas suas respostas: Errei → 7 dias · Médio → 10 · Fácil → 15</p>' +
    '</div>' +
    '<button type="button" class="btn btn-sm" id="fc-review-all-btn">Revisar pendentes</button>';
  document.getElementById('fc-review-all-btn')?.addEventListener('click', fcStartGlobalReview);
}

function fcRenderDeckList () {
  const q = fcNorm(document.getElementById('fc-search')?.value || '');
  const list = !q
    ? (FLASHCARD_DECKS || [])
    : (FLASHCARD_DECKS || []).filter(d => fcNorm(d.name + ' ' + d.desc + ' ' + d.id).includes(q));
  fcRenderReviewBanner();
  fcRenderDeckGrid(list);
}

function fcRenderDeckGrid (decks) {
  const grid = document.getElementById('fc-deck-grid');
  const empty = document.getElementById('fc-empty');
  const count = document.getElementById('fc-deck-count');
  if (!grid) return;

  const totalCards = (FLASHCARD_DECKS || []).reduce((n, d) => n + d.cards.length, 0);
  const totalDue = fcTotalDueCount();
  if (count) {
    let txt = decks.length === (FLASHCARD_DECKS || []).length
      ? decks.length + ' temas · ' + totalCards + ' cards'
      : decks.length + ' de ' + (FLASHCARD_DECKS || []).length + ' temas';
    if (totalDue) txt += ' · ' + totalDue + ' para revisar';
    count.textContent = txt;
  }

  if (!decks.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = decks.map(deck => {
    const pct = fcDeckMasteryPct(deck);
    const due = fcDeckDueCount(deck);
    const { unseen } = fcDeckDueIndices(deck);
    const isNew = FC_NEW_DECK_IDS.includes(deck.id);
    return `
      <article class="fc-deck-card${due ? ' fc-deck-card--due' : ''}${isNew ? ' fc-deck-card--new' : ''}">
        <button type="button" class="calc-category-btn ferramentas-card fc-deck-btn" data-fc-deck="${deck.id}">
          <span class="calc-category-icon">${deck.icon}</span>
          <span class="calc-category-name">${fcEscapeHtml(deck.name)}</span>
          <span class="ferramentas-card-desc muted">${deck.cards.length} cards · ${fcEscapeHtml(deck.desc)}</span>
          ${isNew ? '<span class="fc-deck-new-badge fc-deck-new-badge--highlight">Novo</span>' : ''}
          ${due ? '<span class="fc-deck-due-badge">' + due + ' para revisar</span>' : ''}
          ${!due && !isNew && unseen.length ? '<span class="fc-deck-new-badge">' + unseen.length + ' novos</span>' : ''}
          <span class="fc-deck-progress" aria-label="Domínio ${pct}%">
            <span class="fc-deck-progress-bar" style="width:${pct}%"></span>
            <span class="fc-deck-progress-label">${pct}% fácil</span>
          </span>
        </button>
        <div class="fc-deck-actions">
          ${due ? '<button type="button" class="btn btn-sm fc-deck-review-btn" data-fc-review="' + deck.id + '">Revisar (' + due + ')</button>' : ''}
          <button type="button" class="btn-outline btn-sm fc-deck-all-btn" data-fc-all="${deck.id}">${due ? 'Estudar tudo' : 'Estudar'}</button>
        </div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('[data-fc-deck]').forEach(btn => {
    btn.addEventListener('click', () => fcStartStudy(btn.dataset.fcDeck, { mode: 'smart' }));
  });
  grid.querySelectorAll('[data-fc-review]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      fcStartStudy(btn.dataset.fcReview, { mode: 'review' });
    });
  });
  grid.querySelectorAll('[data-fc-all]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      fcStartStudy(btn.dataset.fcAll, { mode: 'all' });
    });
  });
}

function fcBuildStudyQueue (deck, mode) {
  const { due, unseen } = fcDeckDueIndices(deck);
  const shuffle = document.getElementById('fc-shuffle-toggle')?.checked;
  let indices = [];

  if (mode === 'review') {
    indices = due.slice();
  } else if (mode === 'all') {
    indices = deck.cards.map((_, i) => i);
  } else {
    indices = due.concat(unseen);
    if (!indices.length) indices = deck.cards.map((_, i) => i);
  }

  if (shuffle) {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }
  return indices;
}

function fcStartGlobalReview () {
  const dueByDeck = (FLASHCARD_DECKS || [])
    .map(d => ({ deck: d, due: fcDeckDueIndices(d).due }))
    .filter(x => x.due.length);
  if (!dueByDeck.length) {
    alert('Nenhum card pendente de revisão hoje.');
    return;
  }
  dueByDeck.sort((a, b) => b.due.length - a.due.length);
  fcStartStudy(dueByDeck[0].deck.id, { mode: 'review' });
}

function fcShowDeckList () {
  document.getElementById('fc-deck-list-view').hidden = false;
  document.getElementById('fc-study-view').hidden = true;
  document.getElementById('fc-summary-view').hidden = true;
  fcActiveDeck = null;
  fcRenderDeckList();
}

function fcStartStudy (deckId, opts) {
  opts = opts || {};
  const deck = (FLASHCARD_DECKS || []).find(d => d.id === deckId);
  if (!deck) return;

  fcActiveDeck = deck;
  fcStudyMode = opts.mode || 'smart';
  fcSessionStats = { easy: 0, medium: 0, wrong: 0, skipped: 0 };
  fcStudyIndex = 0;
  fcCardFlipped = false;

  fcStudyQueue = fcBuildStudyQueue(deck, fcStudyMode);
  if (!fcStudyQueue.length) {
    alert('Nenhum card neste baralho.');
    return;
  }

  document.getElementById('fc-deck-list-view').hidden = true;
  document.getElementById('fc-study-view').hidden = false;
  document.getElementById('fc-summary-view').hidden = true;

  const modeLabel = fcStudyMode === 'review' ? ' · revisão' : fcStudyMode === 'all' ? ' · baralho completo' : '';
  document.getElementById('fc-study-deck-title').textContent = deck.icon + ' ' + deck.name + modeLabel;

  const sourceEl = document.getElementById('fc-study-source');
  if (sourceEl) {
    sourceEl.innerHTML = 'Baseado em: <button type="button" class="fc-source-link" data-fc-source="' +
      deck.source + '">' + fcEscapeHtml(deck.sourceLabel) + '</button>';
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

  document.getElementById('fc-card')?.classList.remove('is-flipped');
  document.getElementById('fc-card-front').textContent = card.front;
  document.getElementById('fc-card-back').textContent = card.back;

  const total = fcStudyQueue.length;
  const current = fcStudyIndex + 1;
  document.getElementById('fc-study-progress').textContent = current + ' / ' + total;

  const bar = document.getElementById('fc-study-progress-bar');
  if (bar) bar.style.width = Math.round((current / total) * 100) + '%';

  const hintEl = document.getElementById('fc-study-next-hint');
  const prev = fcGetCardProgress(fcActiveDeck.id, cardIdx);
  if (hintEl) {
    if (prev && !fcIsCardDue(prev)) {
      hintEl.textContent = 'Próxima revisão agendada: ' + fcFormatReviewDay(prev.nextReview);
      hintEl.hidden = false;
    } else if (prev && fcIsCardDue(prev)) {
      hintEl.textContent = 'Revisão pendente (' + FC_RATING_LABELS[prev.rating] + ' · ' + fcFormatReviewDay(prev.nextReview) + ')';
      hintEl.hidden = false;
    } else {
      hintEl.textContent = 'Card novo — escolha Fácil, Médio ou Errei após ler a resposta';
      hintEl.hidden = false;
    }
  }

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

function fcAnswerCard (rating) {
  if (!fcCardFlipped) {
    fcFlipCard();
    return;
  }
  if (!FC_REVIEW_DAYS[rating]) return;
  fcNextCard(rating);
}

function fcNextCard (rating) {
  if (!fcActiveDeck) return;

  const cardIdx = fcStudyQueue[fcStudyIndex];
  const progress = fcLoadProgress();
  const deckProg = progress[fcActiveDeck.id] || { cards: {}, lastStudied: null };
  if (!deckProg.cards) deckProg.cards = {};

  if (rating && FC_REVIEW_DAYS[rating]) {
    fcSessionStats[rating]++;
    const today = fcTodayKey();
    deckProg.cards[String(cardIdx)] = {
      rating,
      lastReview: new Date().toISOString(),
      nextReview: fcAddDays(today, FC_REVIEW_DAYS[rating])
    };
  } else if (rating === null) {
    fcSessionStats.skipped++;
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

  const answered = fcSessionStats.easy + fcSessionStats.medium + fcSessionStats.wrong;
  document.getElementById('fc-summary-title').textContent =
    answered ? 'Sessão concluída' : 'Nada para estudar';

  const lines = [];
  if (fcSessionStats.easy) lines.push('<strong>' + fcSessionStats.easy + '</strong> fácil → revisar em 15 dias');
  if (fcSessionStats.medium) lines.push('<strong>' + fcSessionStats.medium + '</strong> médio → revisar em 10 dias');
  if (fcSessionStats.wrong) lines.push('<strong>' + fcSessionStats.wrong + '</strong> errei → revisar em 7 dias');
  if (fcSessionStats.skipped) lines.push('<strong>' + fcSessionStats.skipped + '</strong> pulados');

  document.getElementById('fc-summary-stats').innerHTML =
    (lines.length ? '<p>' + lines.join(' · ') + '</p>' : '') +
    (fcActiveDeck ? '<p class="muted">Domínio (fácil): <strong>' + fcDeckMasteryPct(fcActiveDeck) + '%</strong></p>' : '');

  const reviewEl = document.getElementById('fc-summary-review');
  const stillDue = fcActiveDeck ? fcDeckDueCount(fcActiveDeck) : fcTotalDueCount();
  if (reviewEl) {
    if (stillDue > 0) {
      reviewEl.hidden = false;
      reviewEl.innerHTML =
        '<p class="fc-review-title">Ainda há <strong>' + stillDue + '</strong> card' + (stillDue === 1 ? '' : 's') +
        ' para revisar neste tema.</p>' +
        '<p class="muted">Volte quando chegar a data ou continue agora com “Estudar de novo”.</p>';
    } else {
      reviewEl.hidden = false;
      reviewEl.innerHTML = '<p class="fc-review-title">Nenhuma revisão pendente neste tema. Próximas datas conforme Fácil/Médio/Errei.</p>';
    }
  }

  const restartBtn = document.getElementById('fc-summary-restart');
  if (restartBtn) {
    restartBtn.textContent = stillDue && fcActiveDeck
      ? 'Continuar revisão (' + fcDeckDueCount(fcActiveDeck) + ')'
      : 'Estudar de novo';
  }
}

function fcOnSectionShow () {
  fcShowDeckList();
}

function fcOpenDeck (deckId) {
  if (typeof showSection === 'function') showSection('flashcards');
  fcStartStudy(deckId, { mode: 'smart' });
}
