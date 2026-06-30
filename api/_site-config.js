const { kv } = require('@vercel/kv');
const { appendAdminLog } = require('./_admin-meta');

const SITE_CONFIG_KEY = 'medhub:site-config';
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const ALLOWED_SECTIONS = new Set([
  'inicio', 'pacientes', 'anamnese', 'consultas', 'receituario', 'medicacoes',
  'exames', 'interpretacao-exame', 'guia-emergencia', 'pronto-socorro',
  'tratamento-hospitalar', 'ventilacao-mecanica', 'calc-essenciais',
  'calc-pediatrica', 'perfil'
]);

const FUTURE_SECTIONS = new Set([
  'videoaulas', 'flashcards', 'casos-clinicos', 'biblioteca'
]);

const CARD_SECTIONS = new Set([...ALLOWED_SECTIONS, ...FUTURE_SECTIONS]);

function defaultSidebar () {
  return [
    { type: 'item', id: 'inicio', label: 'Início', visible: true, enabled: true, icon: '🏠', color: '' },
    { type: 'group', label: 'Roteiro local (opcional)' },
    { type: 'item', id: 'pacientes', label: 'Cadastro do paciente', visible: true, enabled: true, icon: '👤', color: '#6366f1' },
    { type: 'item', id: 'anamnese', label: 'Anamnese', visible: true, enabled: true, icon: '📝', color: '#8b5cf6' },
    { type: 'item', id: 'consultas', label: 'Histórico de atendimentos', visible: true, enabled: true, icon: '📅', color: '#a855f7' },
    { type: 'group', label: 'Prescrição & exames' },
    { type: 'item', id: 'receituario', label: 'Receituário', visible: true, enabled: true, icon: '📋', color: '#0d6efd' },
    { type: 'item', id: 'medicacoes', label: 'Medicações', visible: true, enabled: true, icon: '💊', color: '#2563eb' },
    { type: 'item', id: 'exames', label: 'Exames', visible: true, enabled: true, icon: '🔬', color: '#0891b2' },
    { type: 'item', id: 'interpretacao-exame', label: 'Interpretação do exame', visible: true, enabled: true, icon: '📊', color: '#0e7490' },
    { type: 'group', label: 'Emergência & internação' },
    { type: 'item', id: 'guia-emergencia', label: 'Guia rápido de emergência', visible: true, enabled: true, icon: '⚡', color: '#dc2626' },
    { type: 'item', id: 'pronto-socorro', label: 'Prescrições de Pronto Socorro', visible: true, enabled: true, icon: '🏥', color: '#ea580c' },
    { type: 'item', id: 'tratamento-hospitalar', label: 'Tratamento hospitalar', visible: true, enabled: true, icon: '💉', color: '#d97706' },
    { type: 'item', id: 'ventilacao-mecanica', label: 'Ventilação mecânica', visible: true, enabled: true, icon: '🫁', color: '#059669' },
    { type: 'group', label: 'Calculadoras' },
    { type: 'item', id: 'calc-essenciais', label: 'Calculadoras essenciais', visible: true, enabled: true, icon: '🧮', color: '#0d9488' },
    { type: 'item', id: 'calc-pediatrica', label: 'Calculadora pediátrica', visible: true, enabled: true, icon: '👶', color: '#14b8a6' },
    { type: 'group', label: 'Estudo' },
    { type: 'item', id: 'flashcards', label: 'Flashcards', visible: true, enabled: true, comingSoon: false, icon: '🃏', color: '#db2777' },
    { type: 'group', label: 'Conteúdo (em breve)' },
    { type: 'item', id: 'videoaulas', label: 'Videoaulas', visible: false, enabled: false, comingSoon: true, icon: '🎬', color: '#7c3aed' },
    { type: 'group', label: 'Sistema' },
    { type: 'item', id: 'perfil', label: 'Minha conta', visible: true, enabled: true, icon: '⚙️', color: '#64748b' }
  ];
}

function defaultActiveHomeCards () {
  return [
    { section: 'calc-essenciais', icon: '🧮', name: 'Calculadoras essenciais', desc: 'Escalas, scores e doses por especialidade.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#0d9488', colorBg: '#f0fdfa' },
    { section: 'guia-emergencia', icon: '⚡', name: 'Guia rápido de emergência', desc: 'ACLS, AVC, sepse, trauma e fluxogramas.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#dc2626', colorBg: '#fef2f2' },
    { section: 'pronto-socorro', icon: '🏥', name: 'Prescrições PS', desc: '106 condições com prescrição interativa.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#ea580c', colorBg: '#fff7ed' },
    { section: 'tratamento-hospitalar', icon: '💉', name: 'Tratamento hospitalar', desc: 'Posologias IM/EV e internação.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#d97706', colorBg: '#fffbeb' },
    { section: 'ventilacao-mecanica', icon: '🫁', name: 'Ventilação mecânica', desc: 'Calculadora: PBW, Vt, PEEP e ajustes automáticos.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#059669', colorBg: '#ecfdf5' },
    { section: 'receituario', icon: '📋', name: 'Receituário', desc: 'Sugestões VO · modelo educacional · CRM na Minha conta.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#0d6efd', colorBg: '#eff6ff' },
    { section: 'medicacoes', icon: '💊', name: 'Medicações', desc: '266+ fichas MedHub e referência RENAME.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#2563eb', colorBg: '#eff6ff' },
    { section: 'exames', icon: '🔬', name: 'Exames', desc: 'Painéis sugeridos por cenário clínico.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#0891b2', colorBg: '#ecfeff' },
    { section: 'interpretacao-exame', icon: '📊', name: 'Interpretação do exame', desc: 'Guia rápido de labs e imagem.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#0e7490', colorBg: '#ecfeff' },
    { section: 'pacientes', icon: '👤', name: 'Cadastro do paciente', desc: 'Cadastro local opcional para anamnese e histórico.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#6366f1', colorBg: '#eef2ff' },
    { section: 'anamnese', icon: '📝', name: 'Anamnese', desc: 'Guia clínico: queixa → protocolo → prescrição.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#8b5cf6', colorBg: '#f5f3ff' },
    { section: 'consultas', icon: '📅', name: 'Histórico de atendimentos', desc: 'Registro local e PDF educacional.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#a855f7', colorBg: '#faf5ff' },
    { section: 'calc-pediatrica', icon: '👶', name: 'Calculadora pediátrica', desc: 'Complemento por peso/idade — adulto é o foco.', visible: true, enabled: true, comingSoon: false, pediatricAux: true, color: '#14b8a6', colorBg: '#f0fdfa' },
    { section: 'flashcards', icon: '🃏', name: 'Flashcards', desc: 'Cardiologia em 7 subtemas (150) + 10 baralhos de emergência, PS e exames.', visible: true, enabled: true, comingSoon: false, pediatricAux: false, color: '#db2777', colorBg: '#fdf2f8' }
  ];
}

function defaultFutureHomeCards () {
  return [
    { section: 'videoaulas', icon: '🎬', name: 'Videoaulas', desc: 'Aulas em vídeo por módulo clínico.', visible: true, enabled: false, comingSoon: true, pediatricAux: false, color: '#7c3aed', colorBg: '#f5f3ff' },
    { section: 'casos-clinicos', icon: '🩺', name: 'Casos clínicos', desc: 'Casos interativos passo a passo.', visible: true, enabled: false, comingSoon: true, pediatricAux: false, color: '#059669', colorBg: '#ecfdf5' },
    { section: 'biblioteca', icon: '📚', name: 'Biblioteca', desc: 'PDFs e referências curadas.', visible: true, enabled: false, comingSoon: true, pediatricAux: false, color: '#ca8a04', colorBg: '#fefce8' }
  ];
}

function defaultHomeCards () {
  return [...defaultActiveHomeCards(), ...defaultFutureHomeCards()];
}

function defaultSiteConfig () {
  return {
    theme: {
      accent: '#0d6efd',
      accentHover: '#0b5ed7',
      bgHeader: '#0d6efd',
      logoUrl: '/assets/medhub-logo.png?v=logo-v2'
    },
    sidebar: defaultSidebar(),
    homeCards: defaultHomeCards(),
    updatedAt: null,
    updatedBy: null,
    source: 'defaults'
  };
}

function normalizeHex (value, fallback) {
  const v = String(value || '').trim();
  if (!v) return fallback || '';
  return HEX_COLOR.test(v) ? v.toLowerCase() : (fallback || '');
}

function normalizeOptionalHex (value) {
  const v = String(value || '').trim();
  if (!v) return '';
  return HEX_COLOR.test(v) ? v.toLowerCase() : '';
}

function normalizeLogoUrl (value, fallback) {
  const v = String(value || '').trim();
  if (!v) return fallback;
  if (v.startsWith('/') || v.startsWith('https://') || v.startsWith('http://')) {
    return v.slice(0, 500);
  }
  return fallback;
}

function normalizeSidebarItem (entry, def) {
  const comingSoon = !!(entry.comingSoon ?? def?.comingSoon);
  const enabled = comingSoon ? entry.enabled === true : entry.enabled !== false;

  return {
    type: 'item',
    id: entry.id,
    label: String(entry.label || def?.label || entry.id).trim().slice(0, 80),
    visible: entry.visible !== false,
    enabled,
    comingSoon,
    icon: String(entry.icon || def?.icon || '').trim().slice(0, 8),
    color: normalizeOptionalHex(entry.color) || normalizeOptionalHex(def?.color) || ''
  };
}

function mergeSidebar (saved) {
  const defaults = defaultSidebar();
  if (!Array.isArray(saved) || !saved.length) return defaults;

  const defaultById = new Map();
  defaults.forEach(entry => {
    if (entry.type === 'item') defaultById.set(entry.id, entry);
  });

  const merged = [];
  saved.forEach(entry => {
    if (entry?.type === 'group') {
      const label = String(entry.label || '').trim().slice(0, 80);
      if (label) merged.push({ type: 'group', label });
      return;
    }
    const id = String(entry?.id || '').trim();
    if (entry?.type !== 'item' || !CARD_SECTIONS.has(id)) return;
    const def = defaultById.get(id);
    merged.push(normalizeSidebarItem({ ...entry, id }, def));
  });

  defaults.forEach(def => {
    if (def.type !== 'item') return;
    if (!merged.some(e => e.type === 'item' && e.id === def.id)) {
      merged.push({ ...def });
    }
  });

  return promoteFlashcardsSidebar(merged.length ? merged : defaults);
}

function normalizeHomeCard (entry, def) {
  const section = String(entry.section || '').trim();
  const comingSoon = !!(entry.comingSoon ?? def?.comingSoon);
  const enabled = comingSoon ? entry.enabled === true : entry.enabled !== false;

  return {
    section,
    icon: String(entry.icon || def?.icon || '•').trim().slice(0, 8),
    name: String(entry.name || def?.name || section).trim().slice(0, 80),
    desc: String(entry.desc || def?.desc || '').trim().slice(0, 200),
    visible: entry.visible !== false,
    enabled,
    comingSoon,
    pediatricAux: !!(entry.pediatricAux ?? def?.pediatricAux),
    color: normalizeOptionalHex(entry.color) || normalizeOptionalHex(def?.color) || '',
    colorBg: normalizeOptionalHex(entry.colorBg) || normalizeOptionalHex(def?.colorBg) || ''
  };
}

function mergeHomeCards (saved) {
  const defaults = defaultHomeCards();
  if (!Array.isArray(saved) || !saved.length) return defaults;

  const defaultBySection = new Map(defaults.map(c => [c.section, c]));
  const merged = [];

  saved.forEach(entry => {
    const section = String(entry?.section || '').trim();
    if (!CARD_SECTIONS.has(section) || section === 'inicio' || section === 'perfil') return;
    merged.push(normalizeHomeCard(entry, defaultBySection.get(section)));
  });

  defaults.forEach(def => {
    if (!merged.some(c => c.section === def.section)) merged.push({ ...def });
  });

  return promoteFlashcardsHomeCards(merged.length ? merged : defaults);
}

function promoteFlashcardsHomeCards (cards) {
  const def = defaultActiveHomeCards().find(c => c.section === 'flashcards');
  if (!def) return cards;
  return cards.map(c => {
    if (c.section !== 'flashcards') return c;
    return normalizeHomeCard({
      ...c,
      comingSoon: false,
      enabled: true,
      visible: c.visible !== false,
      name: def.name,
      desc: def.desc,
      icon: def.icon,
      color: def.color,
      colorBg: def.colorBg
    }, def);
  });
}

function promoteFlashcardsSidebar (sidebar) {
  const def = defaultSidebar().find(e => e.type === 'item' && e.id === 'flashcards');
  if (!def) return sidebar;
  const hasFlash = sidebar.some(e => e.type === 'item' && e.id === 'flashcards');
  let out = sidebar.map(e => {
    if (e.type !== 'item' || e.id !== 'flashcards') return e;
    return normalizeSidebarItem({ ...e, comingSoon: false, enabled: true, visible: e.visible !== false }, def);
  });
  if (!hasFlash) {
    const pedIdx = out.findIndex(e => e.type === 'item' && e.id === 'calc-pediatrica');
    const insertAt = pedIdx >= 0 ? pedIdx + 1 : out.length;
    const estudoLabel = 'Estudo';
    if (!out.some(e => e.type === 'group' && e.label === estudoLabel)) {
      out.splice(insertAt, 0, { type: 'group', label: estudoLabel });
    }
    const groupIdx = out.findIndex(e => e.type === 'group' && e.label === estudoLabel);
    out.splice(groupIdx + 1, 0, { ...def });
  }
  return out;
}

function mergeSiteConfig (stored) {
  const defaults = defaultSiteConfig();
  if (!stored || typeof stored !== 'object') return defaults;

  const theme = stored.theme && typeof stored.theme === 'object' ? stored.theme : {};

  return {
    theme: {
      accent: normalizeHex(theme.accent, defaults.theme.accent),
      accentHover: normalizeHex(theme.accentHover, defaults.theme.accentHover),
      bgHeader: normalizeHex(theme.bgHeader, defaults.theme.bgHeader),
      logoUrl: normalizeLogoUrl(theme.logoUrl, defaults.theme.logoUrl)
    },
    sidebar: mergeSidebar(stored.sidebar),
    homeCards: mergeHomeCards(stored.homeCards),
    updatedAt: stored.updatedAt || null,
    updatedBy: stored.updatedBy || null,
    source: 'kv'
  };
}

async function getSiteConfig () {
  const stored = await kv.get(SITE_CONFIG_KEY);
  if (!stored) {
    const defaults = defaultSiteConfig();
    return { ...defaults, source: 'defaults' };
  }
  return mergeSiteConfig(stored);
}

async function saveSiteConfig (data, actorEmail) {
  const current = await getSiteConfig();
  const themeIn = data?.theme && typeof data.theme === 'object' ? data.theme : {};

  const payload = {
    theme: {
      accent: normalizeHex(themeIn.accent, current.theme.accent),
      accentHover: normalizeHex(themeIn.accentHover, current.theme.accentHover),
      bgHeader: normalizeHex(themeIn.bgHeader, current.theme.bgHeader),
      logoUrl: normalizeLogoUrl(themeIn.logoUrl, current.theme.logoUrl)
    },
    sidebar: mergeSidebar(data?.sidebar || current.sidebar),
    homeCards: mergeHomeCards(data?.homeCards || current.homeCards),
    updatedAt: new Date().toISOString(),
    updatedBy: String(actorEmail || '').trim().toLowerCase().slice(0, 120)
  };

  await kv.set(SITE_CONFIG_KEY, payload);
  await appendAdminLog(actorEmail, 'save_site_config', '', {
    accent: payload.theme.accent,
    sidebarLive: payload.sidebar.filter(e => e.type === 'item' && e.visible && e.enabled).length,
    cardsLive: payload.homeCards.filter(c => c.visible && c.enabled).length,
    cardsSoon: payload.homeCards.filter(c => c.comingSoon && !c.enabled).length
  });

  return mergeSiteConfig(payload);
}

module.exports = {
  getSiteConfig,
  saveSiteConfig,
  defaultSiteConfig,
  ALLOWED_SECTIONS,
  FUTURE_SECTIONS,
  CARD_SECTIONS
};
