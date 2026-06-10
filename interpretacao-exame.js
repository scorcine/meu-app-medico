/* Interpretação do exame — navegação */

function initInterpretacaoExame () {
  const grid = document.getElementById('interp-topic-grid');
  if (!grid || grid.dataset.interpBound) return;
  grid.dataset.interpBound = '1';

  renderInterpGrid(typeof INTERP_TOPICS !== 'undefined' ? INTERP_TOPICS : []);

  const search = document.getElementById('interp-search');
  if (search) {
    search.addEventListener('input', () => {
      const q = clinicalNorm(search.value);
      const list = !q
        ? INTERP_TOPICS
        : INTERP_TOPICS.filter(t => clinicalNorm(t.name + ' ' + t.searchText).includes(q));
      renderInterpGrid(list);
    });
  }

  const back = document.getElementById('interp-back');
  if (back) back.onclick = interpShowHome;
}

function renderInterpGrid (items) {
  const grid = document.getElementById('interp-topic-grid');
  const empty = document.getElementById('interp-empty');
  const count = document.getElementById('interp-count');
  if (!grid) return;

  if (count) {
    count.textContent = items.length === INTERP_TOPICS.length
      ? INTERP_TOPICS.length + ' guias de interpretação'
      : items.length + ' de ' + INTERP_TOPICS.length + ' guias';
  }

  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = items.map(t => `
    <button type="button" class="calc-category-btn" data-interp-topic="${t.id}">
      <span class="calc-category-icon">${t.icon}</span>
      <span class="calc-category-name">${t.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-interp-topic]').forEach(btn => {
    btn.addEventListener('click', () => interpShowTopic(btn.dataset.interpTopic));
  });
}

function interpShowHome () {
  const list = document.getElementById('interp-list-view');
  const detail = document.getElementById('interp-detail-view');
  if (list) list.hidden = false;
  if (detail) detail.hidden = true;
  const search = document.getElementById('interp-search');
  if (search) search.value = '';
  renderInterpGrid(INTERP_TOPICS);
}

function interpShowTopic (topicId) {
  const topic = INTERP_TOPICS.find(t => t.id === topicId);
  if (!topic) return;

  document.getElementById('interp-list-view').hidden = true;
  document.getElementById('interp-detail-view').hidden = false;
  document.getElementById('interp-topic-title').textContent = topic.icon + ' ' + topic.name;

  const content = document.getElementById('interp-topic-content');
  content.innerHTML = '<div class="emerg-algo-block emerg-algo-single">' + topic.html + '</div>';
}

function interpOnSectionShow () {
  interpShowHome();
}
