/* Guia rápido de emergência — tópicos e conteúdo */

const EMERGENCY_TOPICS = [
  {
    id: 'parada-cardio',
    icon: '⚡',
    name: 'Parada Cardiorrespiratória',
    html: ''
  },
  {
    id: 'sca',
    icon: '❤️‍🔥',
    name: 'Síndromes Coronarianas Agudas',
    html: ''
  },
  {
    id: 'avc',
    icon: '🧠',
    name: 'AVC Isquêmico',
    html: ''
  },
  {
    id: 'sepse',
    icon: '🩸',
    name: 'Sepse & Choque Séptico',
    html: ''
  },
  {
    id: 'trauma',
    icon: '🆘',
    name: 'Trauma & Suporte Avançado',
    html: ''
  },
  {
    id: 'via-aerea',
    icon: '🌬️',
    name: 'Via Aérea & Ventilação',
    html: ''
  },
  {
    id: 'reacoes-metabolicas',
    icon: '💊',
    name: 'Reações Agudas & Metabólicas',
    html: ''
  },
  {
    id: 'obstetricia',
    icon: '🤰',
    name: 'Obstetrícia de Urgência',
    html: ''
  },
  {
    id: 'pediatrica',
    icon: '👶',
    name: 'Emergências Pediátricas',
    html: ''
  },
  {
    id: 'toxicologia',
    icon: '☠️',
    name: 'Toxicologia & Ambientais',
    html: ''
  },
  {
    id: 'pressao-arritmias',
    icon: '🔺',
    name: 'Pressão & Arritimias Agudas',
    html: ''
  },
  {
    id: 'procedimentos',
    icon: '🛠️',
    name: 'Procedimentos & Checklists',
    html: ''
  }
];

let currentEmergTopicId = null;

function initGuiaEmergencia () {
  const grid = document.getElementById('emerg-topic-grid');
  if (!grid) return;

  grid.innerHTML = EMERGENCY_TOPICS.map(topic => `
    <button type="button" class="calc-category-btn" data-emerg-topic="${topic.id}">
      <span class="calc-category-icon">${topic.icon}</span>
      <span class="calc-category-name">${topic.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-emerg-topic]').forEach(btn => {
    btn.addEventListener('click', () => showEmergenciaTopic(btn.dataset.emergTopic));
  });

  const backBtn = document.getElementById('emerg-topic-back');
  if (backBtn) backBtn.addEventListener('click', showEmergenciaCategories);
}

function showEmergenciaCategories () {
  const listView = document.getElementById('emerg-categories-view');
  const topicView = document.getElementById('emerg-topic-view');
  if (!listView || !topicView) return;

  currentEmergTopicId = null;
  listView.hidden = false;
  topicView.hidden = true;
}

function showEmergenciaTopic (topicId) {
  const topic = EMERGENCY_TOPICS.find(t => t.id === topicId);
  if (!topic) return;

  currentEmergTopicId = topicId;
  document.getElementById('emerg-categories-view').hidden = true;
  document.getElementById('emerg-topic-view').hidden = false;
  document.getElementById('emerg-topic-title').textContent = `${topic.icon} ${topic.name}`;

  const contentEl = document.getElementById('emerg-topic-content');
  if (topic.html && topic.html.trim()) {
    contentEl.innerHTML = topic.html;
  } else {
    contentEl.innerHTML = `
      <p class="coming-soon">Conteúdo em construção — adicione o protocolo em <strong>emergency-guide.js</strong> no campo <code>html</code> deste tópico.</p>`;
  }
}
