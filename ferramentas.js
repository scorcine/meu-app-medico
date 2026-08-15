/* Ferramentas — atalhos na home (não duplica o menu lateral) */

const FERRAMENTAS_ITEMS = [
  { section: 'calc-essenciais', icon: '🧮', name: 'Calculadoras essenciais', desc: 'Escalas, scores e doses por especialidade.' },
  { section: 'guia-emergencia', icon: '⚡', name: 'Guia rápido de emergência', desc: 'ACLS, AVC, sepse, trauma e fluxogramas.' },
  { section: 'pronto-socorro', icon: '🏥', name: 'Prescrições PS', desc: '106 condições com prescrição interativa.' },
  { section: 'tratamento-hospitalar', icon: '💉', name: 'Tratamento hospitalar', desc: 'Posologias IM/EV e internação.' },
  { section: 'ventilacao-mecanica', icon: '🫁', name: 'Ventilação mecânica', desc: 'Calculadora: PBW, Vt, PEEP e ajustes automáticos.' },
  { section: 'receituario', icon: '🏠', name: 'Tratamento para casa', desc: 'Sugestões VO · receita ambulatorial · CRM na Minha conta.' },
  { section: 'medicacoes', icon: '💊', name: 'Medicações', desc: '266+ fichas MedHub e referência RENAME.' },
  { section: 'exames', icon: '🔬', name: 'Exames', desc: 'Painéis sugeridos por cenário clínico.' },
  { section: 'interpretacao-exame', icon: '📊', name: 'Interpretação do exame', desc: 'Guia rápido de labs e imagem.' },
  { section: 'pacientes', icon: '👤', name: 'Cadastro do paciente', desc: 'Cadastro local opcional (alergias, medicações) para anamnese e histórico.' },
  { section: 'anamnese', icon: '📝', name: 'Anamnese', desc: 'Guia clínico local para queixa → protocolo → prescrição.' },
  { section: 'consultas', icon: '📅', name: 'Histórico de atendimentos', desc: 'Registro local e PDF educacional.' },
  {
    section: 'calc-pediatrica',
    icon: '👶',
    name: 'Calculadora pediátrica',
    desc: 'Complemento rápido por peso/idade — o MedHub principal é voltado ao adulto.',
    pediatricAux: true
  }
];

function medhubOpenHomeSection (section) {
  if (!document.getElementById('section-' + section)) {
    alert('Este módulo ainda está em preparação.');
    return;
  }
  if (typeof showSection === 'function') showSection(section);
}

function initHomeNovoPaciente () {
  const btn = document.getElementById('home-novo-paciente');
  if (!btn || btn.dataset.bound) return;
  btn.dataset.bound = '1';
  btn.addEventListener('click', () => medhubOpenHomeSection('novo-atendimento'));
}

function initFerramentas () {
  initHomeNovoPaciente();

  const grid = document.getElementById('home-ferramentas-grid');
  if (!grid) return;

  const items = typeof medhubGetHomeCards === 'function'
    ? medhubGetHomeCards()
    : FERRAMENTAS_ITEMS.filter(item => typeof medhubIsSectionRetired !== 'function' || !medhubIsSectionRetired(item.section));

  grid.innerHTML = items.map(item => {
    const style = typeof medhubHomeCardStyle === 'function' ? medhubHomeCardStyle(item) : '';
    return `
    <button type="button" class="calc-category-btn ferramentas-card home-tool-card${item.pediatricAux ? ' home-tool-card--pediatric-aux' : ''}${item.color ? ' home-tool-card--themed' : ''}" data-section="${item.section}"${style}>
      <span class="calc-category-icon">${item.icon}</span>
      <span class="calc-category-name">${item.name}</span>
      ${item.pediatricAux ? '<span class="home-tool-card-badge">Complemento · adulto</span>' : ''}
      <span class="ferramentas-card-desc muted">${item.desc}</span>
    </button>
  `;
  }).join('');

  grid.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => medhubOpenHomeSection(btn.dataset.section));
  });
}
