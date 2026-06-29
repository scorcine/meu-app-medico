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

function defaultSidebar () {
  return [
    { type: 'item', id: 'inicio', label: 'Início', visible: true },
    { type: 'group', label: 'Roteiro local (opcional)' },
    { type: 'item', id: 'pacientes', label: 'Cadastro do paciente', visible: true },
    { type: 'item', id: 'anamnese', label: 'Anamnese', visible: true },
    { type: 'item', id: 'consultas', label: 'Histórico de atendimentos', visible: true },
    { type: 'group', label: 'Prescrição & exames' },
    { type: 'item', id: 'receituario', label: 'Receituário', visible: true },
    { type: 'item', id: 'medicacoes', label: 'Medicações', visible: true },
    { type: 'item', id: 'exames', label: 'Exames', visible: true },
    { type: 'item', id: 'interpretacao-exame', label: 'Interpretação do exame', visible: true },
    { type: 'group', label: 'Emergência & internação' },
    { type: 'item', id: 'guia-emergencia', label: 'Guia rápido de emergência', visible: true },
    { type: 'item', id: 'pronto-socorro', label: 'Prescrições de Pronto Socorro', visible: true },
    { type: 'item', id: 'tratamento-hospitalar', label: 'Tratamento hospitalar', visible: true },
    { type: 'item', id: 'ventilacao-mecanica', label: 'Ventilação mecânica', visible: true },
    { type: 'group', label: 'Calculadoras' },
    { type: 'item', id: 'calc-essenciais', label: 'Calculadoras essenciais', visible: true },
    { type: 'item', id: 'calc-pediatrica', label: 'Calculadora pediátrica', visible: true },
    { type: 'group', label: 'Sistema' },
    { type: 'item', id: 'perfil', label: 'Minha conta', visible: true }
  ];
}

function defaultHomeCards () {
  return [
    { section: 'calc-essenciais', icon: '🧮', name: 'Calculadoras essenciais', desc: 'Escalas, scores e doses por especialidade.', visible: true, pediatricAux: false },
    { section: 'guia-emergencia', icon: '⚡', name: 'Guia rápido de emergência', desc: 'ACLS, AVC, sepse, trauma e fluxogramas.', visible: true, pediatricAux: false },
    { section: 'pronto-socorro', icon: '🏥', name: 'Prescrições PS', desc: '106 condições com prescrição interativa.', visible: true, pediatricAux: false },
    { section: 'tratamento-hospitalar', icon: '💉', name: 'Tratamento hospitalar', desc: 'Posologias IM/EV e internação.', visible: true, pediatricAux: false },
    { section: 'ventilacao-mecanica', icon: '🫁', name: 'Ventilação mecânica', desc: 'Calculadora: PBW, Vt, PEEP e ajustes automáticos.', visible: true, pediatricAux: false },
    { section: 'receituario', icon: '📋', name: 'Receituário', desc: 'Sugestões VO · modelo educacional · CRM na Minha conta.', visible: true, pediatricAux: false },
    { section: 'medicacoes', icon: '💊', name: 'Medicações', desc: '266+ fichas MedHub e referência RENAME.', visible: true, pediatricAux: false },
    { section: 'exames', icon: '🔬', name: 'Exames', desc: 'Painéis sugeridos por cenário clínico.', visible: true, pediatricAux: false },
    { section: 'interpretacao-exame', icon: '📊', name: 'Interpretação do exame', desc: 'Guia rápido de labs e imagem.', visible: true, pediatricAux: false },
    { section: 'pacientes', icon: '👤', name: 'Cadastro do paciente', desc: 'Cadastro local opcional (alergias, medicações) para anamnese e histórico.', visible: true, pediatricAux: false },
    { section: 'anamnese', icon: '📝', name: 'Anamnese', desc: 'Guia clínico local para queixa → protocolo → prescrição.', visible: true, pediatricAux: false },
    { section: 'consultas', icon: '📅', name: 'Histórico de atendimentos', desc: 'Registro local e PDF educacional.', visible: true, pediatricAux: false },
    { section: 'calc-pediatrica', icon: '👶', name: 'Calculadora pediátrica', desc: 'Complemento rápido por peso/idade — o MedHub principal é voltado ao adulto.', visible: true, pediatricAux: true }
  ];
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
  return HEX_COLOR.test(v) ? v.toLowerCase() : fallback;
}

function normalizeLogoUrl (value, fallback) {
  const v = String(value || '').trim();
  if (!v) return fallback;
  if (v.startsWith('/') || v.startsWith('https://') || v.startsWith('http://')) {
    return v.slice(0, 500);
  }
  return fallback;
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
    if (entry?.type !== 'item' || !ALLOWED_SECTIONS.has(entry.id)) return;
    const def = defaultById.get(entry.id);
    merged.push({
      type: 'item',
      id: entry.id,
      label: String(entry.label || def?.label || entry.id).trim().slice(0, 80),
      visible: entry.visible !== false
    });
  });

  defaults.forEach(def => {
    if (def.type !== 'item') return;
    if (!merged.some(e => e.type === 'item' && e.id === def.id)) {
      merged.push({ ...def });
    }
  });

  return merged.length ? merged : defaults;
}

function mergeHomeCards (saved) {
  const defaults = defaultHomeCards();
  if (!Array.isArray(saved) || !saved.length) return defaults;

  const defaultBySection = new Map(defaults.map(c => [c.section, c]));
  const merged = [];

  saved.forEach(entry => {
    const section = String(entry?.section || '').trim();
    if (!ALLOWED_SECTIONS.has(section) || section === 'inicio' || section === 'perfil') return;
    const def = defaultBySection.get(section);
    merged.push({
      section,
      icon: String(entry.icon || def?.icon || '•').trim().slice(0, 8),
      name: String(entry.name || def?.name || section).trim().slice(0, 80),
      desc: String(entry.desc || def?.desc || '').trim().slice(0, 200),
      visible: entry.visible !== false,
      pediatricAux: !!(entry.pediatricAux ?? def?.pediatricAux)
    });
  });

  defaults.forEach(def => {
    if (!merged.some(c => c.section === def.section)) merged.push({ ...def });
  });

  return merged.length ? merged : defaults;
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
    sidebarVisible: payload.sidebar.filter(e => e.type === 'item' && e.visible).length,
    homeCardsVisible: payload.homeCards.filter(c => c.visible).length
  });

  return mergeSiteConfig(payload);
}

module.exports = {
  getSiteConfig,
  saveSiteConfig,
  defaultSiteConfig,
  ALLOWED_SECTIONS
};
