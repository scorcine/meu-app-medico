/* Ferramentas — atalhos na home (não duplica o menu lateral) */

const FERRAMENTAS_ITEMS = [
  { section: 'calc-essenciais', icon: '🧮', name: 'Calculadoras essenciais', desc: 'Escalas, scores e doses por especialidade.' },
  { section: 'calc-pediatrica', icon: '👶', name: 'Calculadora pediátrica', desc: 'Dose mg/kg, volume e Holliday-Segar.' },
  { section: 'guia-emergencia', icon: '⚡', name: 'Guia rápido de emergência', desc: 'ACLS, AVC, sepse, trauma e fluxogramas.' },
  { section: 'pronto-socorro', icon: '🏥', name: 'Prescrições PS', desc: '106 condições com prescrição interativa.' },
  { section: 'tratamento-hospitalar', icon: '💉', name: 'Tratamento hospitalar', desc: 'Posologias IM/EV e internação.' },
  { section: 'receituario', icon: '📋', name: 'Receituário', desc: 'Sugestões VO · modelo educacional · CRM na Minha conta.' },
  { section: 'medicacoes', icon: '💊', name: 'Medicações', desc: '266+ fichas MedHub e referência RENAME.' },
  { section: 'exames', icon: '🔬', name: 'Exames', desc: 'Painéis sugeridos por cenário clínico.' },
  { section: 'interpretacao-exame', icon: '📊', name: 'Interpretação do exame', desc: 'Guia rápido de labs e imagem.' },
  { section: 'pacientes', icon: '👤', name: 'Cadastro do paciente', desc: 'Cadastro local opcional (alergias, medicações) para anamnese e histórico.' },
  { section: 'anamnese', icon: '📝', name: 'Anamnese', desc: 'Guia clínico local para queixa → protocolo → prescrição.' },
  { section: 'consultas', icon: '📅', name: 'Histórico de atendimentos', desc: 'Registro local e PDF educacional.' }
];

function initFerramentas () {
  const grid = document.getElementById('home-ferramentas-grid');
  if (!grid || grid.dataset.ferBound) return;
  grid.dataset.ferBound = '1';

  grid.innerHTML = FERRAMENTAS_ITEMS.map(item => `
    <button type="button" class="calc-category-btn ferramentas-card home-tool-card" data-section="${item.section}">
      <span class="calc-category-icon">${item.icon}</span>
      <span class="calc-category-name">${item.name}</span>
      <span class="ferramentas-card-desc muted">${item.desc}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof showSection === 'function') showSection(btn.dataset.section);
    });
  });
}
