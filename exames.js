/* Exames — navegação e busca */

function initExames () {
  const grid = document.getElementById('exames-topic-grid');
  if (!grid || grid.dataset.exBound) return;
  grid.dataset.exBound = '1';

  renderExamesGrid(typeof EXAMES_TOPICS !== 'undefined' ? EXAMES_TOPICS : []);

  const search = document.getElementById('exames-search');
  if (search) {
    search.addEventListener('input', () => {
      const q = clinicalNorm(search.value);
      const list = !q
        ? EXAMES_TOPICS
        : EXAMES_TOPICS.filter(t => clinicalNorm(t.name + ' ' + t.searchText).includes(q));
      renderExamesGrid(list);
    });
  }

  const back = document.getElementById('exames-back');
  if (back) back.onclick = examesShowHome;
}

function renderExamesGrid (items) {
  const grid = document.getElementById('exames-topic-grid');
  const empty = document.getElementById('exames-empty');
  const count = document.getElementById('exames-count');
  if (!grid) return;

  if (count) {
    count.textContent = items.length === EXAMES_TOPICS.length
      ? EXAMES_TOPICS.length + ' cenários clínicos'
      : items.length + ' de ' + EXAMES_TOPICS.length + ' cenários';
  }

  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = items.map(t => `
    <button type="button" class="calc-category-btn" data-ex-topic="${t.id}">
      <span class="calc-category-icon">${t.icon}</span>
      <span class="calc-category-name">${t.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-ex-topic]').forEach(btn => {
    btn.addEventListener('click', () => examesShowTopic(btn.dataset.exTopic));
  });
}

function examesShowHome () {
  const list = document.getElementById('exames-list-view');
  const detail = document.getElementById('exames-detail-view');
  if (list) list.hidden = false;
  if (detail) detail.hidden = true;
  const search = document.getElementById('exames-search');
  if (search) search.value = '';
  renderExamesGrid(EXAMES_TOPICS);
}

function examesShowTopic (topicId) {
  const topic = EXAMES_TOPICS.find(t => t.id === topicId);
  if (!topic) return;

  document.getElementById('exames-list-view').hidden = true;
  document.getElementById('exames-detail-view').hidden = false;
  document.getElementById('exames-topic-title').textContent = topic.icon + ' ' + topic.name;

  const content = document.getElementById('exames-topic-content');
  content.innerHTML = '<div class="emerg-algo-block emerg-algo-single">' + topic.html + '</div>';
}

function examesOnSectionShow () {
  examesShowHome();
}
