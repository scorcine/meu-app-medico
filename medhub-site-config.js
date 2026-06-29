/* Aparência e menu do app — carrega de /api/billing-config (KV via admin) */

let _medhubSiteConfig = null;

function medhubDefaultSiteConfig () {
  return {
    theme: {
      accent: '#0d6efd',
      accentHover: '#0b5ed7',
      bgHeader: '#0d6efd',
      logoUrl: '/assets/medhub-logo.png?v=logo-v2'
    },
    sidebar: [],
    homeCards: []
  };
}

async function medhubFetchSiteConfig (force) {
  if (_medhubSiteConfig && !force) return _medhubSiteConfig;

  if (window.location.protocol === 'file:') {
    _medhubSiteConfig = null;
    return null;
  }

  try {
    const res = await fetch('/api/billing-config');
    if (!res.ok) throw new Error('config');
    const data = await res.json();
    if (data.site && (data.site.sidebar?.length || data.site.homeCards?.length)) {
      _medhubSiteConfig = data.site;
      return _medhubSiteConfig;
    }
    _medhubSiteConfig = null;
    return null;
  } catch {
    _medhubSiteConfig = null;
    return null;
  }
}

function medhubHexToRgb (hex) {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function medhubApplySiteTheme (theme) {
  if (!theme) return;
  const root = document.documentElement;
  const accent = theme.accent || '#0d6efd';
  const accentHover = theme.accentHover || accent;
  const bgHeader = theme.bgHeader || accent;

  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-hover', accentHover);
  root.style.setProperty('--bg-header', bgHeader);
  root.style.setProperty('--text-accent', accent);
  root.style.setProperty('--text-heading', accent);

  const rgb = medhubHexToRgb(accent);
  if (rgb) {
    root.style.setProperty('--accent-ring', 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.15)');
    root.style.setProperty('--accent-soft', 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.35)');
  }

  if (theme.logoUrl) {
    document.querySelectorAll('.medhub-logo').forEach(img => {
      img.src = theme.logoUrl;
    });
  }
}

function medhubSidebarHtml (sidebar, activeSection) {
  if (!Array.isArray(sidebar) || !sidebar.length) return '';

  let html = '';

  for (let i = 0; i < sidebar.length; i++) {
    const entry = sidebar[i];

    if (entry.type === 'group') {
      let hasVisible = false;
      for (let j = i + 1; j < sidebar.length; j++) {
        if (sidebar[j].type === 'group') break;
        if (sidebar[j].type === 'item' && sidebar[j].visible !== false) {
          hasVisible = true;
          break;
        }
      }
      if (hasVisible) {
        html += '<p class="sidebar-group">' + escapeSiteHtml(entry.label) + '</p>';
      }
      continue;
    }

    if (entry.type !== 'item' || entry.visible === false) continue;

    const active = entry.id === activeSection ? ' active' : '';
    html += '<button type="button" class="sidebar-link' + active + '" data-section="' + escapeSiteAttr(entry.id) + '">' +
      escapeSiteHtml(entry.label) + '</button>';
  }

  return html;
}

function escapeSiteHtml (str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeSiteAttr (str) {
  return escapeSiteHtml(str).replace(/'/g, '&#39;');
}

function medhubBindSidebarLinks () {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.dataset.siteBound) return;
    link.dataset.siteBound = '1';
    link.addEventListener('click', () => {
      if (typeof showSection === 'function') showSection(link.dataset.section);
    });
  });
}

function medhubRenderAppSidebar (sidebar, activeSection) {
  const nav = document.getElementById('app-sidebar-nav');
  if (!nav) return;

  const current = activeSection ||
    document.querySelector('.sidebar-link.active')?.dataset?.section ||
    'inicio';

  nav.innerHTML = medhubSidebarHtml(sidebar, current);
  medhubBindSidebarLinks();
}

function medhubGetHomeCards () {
  const cards = _medhubSiteConfig?.homeCards;
  if (Array.isArray(cards) && cards.length) {
    return cards.filter(c => c.visible !== false);
  }
  return typeof FERRAMENTAS_ITEMS !== 'undefined' ? FERRAMENTAS_ITEMS : [];
}

function medhubGetSiteTheme () {
  return _medhubSiteConfig?.theme || medhubDefaultSiteConfig().theme;
}

async function medhubInitSiteConfig (activeSection) {
  const config = await medhubFetchSiteConfig();

  if (config?.theme) {
    medhubApplySiteTheme(config.theme);
  }

  if (config?.sidebar?.length && document.getElementById('app-sidebar-nav')) {
    medhubRenderAppSidebar(config.sidebar, activeSection || 'inicio');
  } else {
    medhubBindSidebarLinks();
  }

  return config;
}

async function medhubRefreshSiteSidebar (activeSection) {
  const config = await medhubFetchSiteConfig(true);
  medhubRenderAppSidebar(config.sidebar, activeSection);
  return config;
}
