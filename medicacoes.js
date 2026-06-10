/* Medicações — busca lazy, fichas MedHub (A) e referência RENAME (B) */

const MED_DISPLAY_LIMIT = 80;
const MED_REF_MIN_QUERY = 2;

let medCurrentId = null;

function medNorm (text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function medGetFullCatalog () {
  const list = typeof medGetCatalog === 'function' ? medGetCatalog() : [];
  return list.map(d => ({ ...d, tier: d.tier || 'full' }));
}

function medGetReferenceCatalog () {
  return typeof medGetRenameReference === 'function' ? medGetRenameReference() : [];
}

function medGetSearchCatalog () {
  return medGetFullCatalog().concat(medGetReferenceCatalog());
}

function medGetDrugById (id) {
  return medGetSearchCatalog().find(d => d.id === id) || null;
}

function medFilterCatalog (query, opts) {
  const options = opts || {};
  const q = medNorm(query);
  const tierFilter = options.tier || '';
  let list;

  if (tierFilter === 'reference') {
    list = medGetReferenceCatalog();
  } else if (q.length >= MED_REF_MIN_QUERY) {
    list = medGetSearchCatalog();
  } else {
    list = medGetFullCatalog();
  }

  if (q.length >= 1) {
    list = list.filter(d => {
      const hay = medNorm(d.name + ' ' + d.id + ' ' + d.classLabel + ' ' + (d.searchText || '') +
        (d.indications || []).join(' ') + ' ' + (d.presentations || []).join(' '));
      return hay.includes(q);
    });
  }

  list.sort((a, b) => {
    if (a.tier === b.tier) return a.name.localeCompare(b.name, 'pt-BR');
    return a.tier === 'full' ? -1 : 1;
  });

  return list;
}

function medTierBadge (drug) {
  if (drug.tier === 'reference') {
    return '<span class="med-tier-badge med-tier-badge--ref">Referência RENAME</span>';
  }
  return '<span class="med-tier-badge med-tier-badge--full">Ficha MedHub</span>';
}

function medRenderGrid (items, meta) {
  const grid = document.getElementById('med-drug-grid');
  const empty = document.getElementById('med-empty');
  const count = document.getElementById('med-count');
  const hint = document.getElementById('med-search-hint');
  if (!grid) return;

  const fullCount = medGetFullCatalog().length;
  const refCount = medGetReferenceCatalog().length;
  const total = items.length;
  const limited = items.slice(0, MED_DISPLAY_LIMIT);
  const truncated = total > MED_DISPLAY_LIMIT;

  grid.innerHTML = '';

  if (count) {
    const fullShown = limited.filter(d => d.tier === 'full').length;
    const refShown = limited.filter(d => d.tier === 'reference').length;
    let label = '';
    if (meta && meta.mode === 'browse') {
      label = fullCount + ' fichas MedHub';
      if (refCount) label += ' · ' + refCount + ' referência RENAME (busque ≥ ' + MED_REF_MIN_QUERY + ' letras)';
    } else {
      label = total + ' resultado(s)';
      if (fullShown) label += ' · ' + fullShown + ' MedHub';
      if (refShown) label += ' · ' + refShown + ' RENAME';
      if (truncated) label += ' — mostrando ' + MED_DISPLAY_LIMIT;
    }
    count.textContent = label;
  }

  if (hint) {
    if (meta && meta.mode === 'browse') {
      hint.hidden = false;
      hint.textContent = 'Lista inicial: fichas revisadas dos protocolos. Para buscar na RENAME, digite ao menos ' +
        MED_REF_MIN_QUERY + ' caracteres ou filtre "Referência RENAME".';
    } else if (meta && meta.query && meta.query.length < MED_REF_MIN_QUERY && meta.tier !== 'reference') {
      hint.hidden = false;
      hint.textContent = 'Digite mais caracteres para incluir medicamentos da referência RENAME.';
    } else {
      hint.hidden = true;
    }
  }

  limited.forEach(drug => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calc-category-card med-drug-card med-drug-card--' + (drug.tier || 'full');
    btn.dataset.medId = drug.id;
    btn.innerHTML =
      medTierBadge(drug) +
      '<span class="med-drug-name">' + drug.name + '</span>' +
      '<span class="med-drug-class muted">' + drug.classLabel + '</span>';
    btn.addEventListener('click', () => medShowDrug(drug.id));
    grid.appendChild(btn);
  });

  if (empty) empty.hidden = total > 0;
}

function medListItems (title, items) {
  if (!items || !items.length) return '';
  return '<h4>' + title + '</h4><ul class="med-detail-list">' +
    items.map(i => '<li>' + i + '</li>').join('') + '</ul>';
}

function medShowDrug (id) {
  const drug = medGetDrugById(id);
  if (!drug) return;
  medCurrentId = id;

  const listView = document.getElementById('med-list-view');
  const detailView = document.getElementById('med-detail-view');
  const title = document.getElementById('med-drug-title');
  const content = document.getElementById('med-drug-content');

  if (listView) listView.hidden = true;
  if (detailView) detailView.hidden = false;
  if (title) title.textContent = drug.name;
  if (!content) return;

  let html = medTierBadge(drug) + '<p class="med-class-badge">' + drug.classLabel + '</p>';

  if (drug.tier === 'reference') {
    html += '<p class="med-ref-notice">Esta é uma <strong>ficha de referência</strong> (RENAME 2024 / MS). ' +
      'Não foi revisada com o mesmo nível de detalhe das fichas MedHub dos protocolos. ' +
      'Confirme sempre na bula ANVISA e no PCDT.</p>';
    if (drug.atc) html += '<p class="muted"><strong>ATC:</strong> ' + drug.atc + '</p>';
    if (drug.renameComponent) html += '<p class="muted"><strong>Financiamento SUS:</strong> ' + drug.renameComponent + '</p>';
    if (drug.bulaUrl) {
      html += '<p class="med-bula-link"><a href="' + drug.bulaUrl + '" target="_blank" rel="noopener">Consultar no Bulário ANVISA</a></p>';
    }
  }

  html += medListItems('Indicações clínicas', drug.indications);
  html += medListItems('Contraindicações absolutas', drug.ciAbs);
  html += medListItems('Contraindicações relativas / cautelas', drug.ciRel);

  if (drug.presentations && drug.presentations.length) {
    html += medListItems('Apresentações (Brasil)', drug.presentations);
  }

  if (drug.posologyVo && drug.posologyVo.length &&
      !(drug.posologyVo.length === 1 && drug.posologyVo[0].startsWith('Posologia conforme'))) {
    html += medListItems('Posologia VO / ambulatorial', drug.posologyVo);
  } else if (drug.tier === 'reference' && drug.posologyVo && drug.posologyVo.length) {
    html += medListItems('Posologia', drug.posologyVo);
  }

  if (drug.posologyHosp && drug.posologyHosp.length &&
      !(drug.posologyHosp.length === 1 && drug.posologyHosp[0] === '—')) {
    html += medListItems('Posologia hospitalar (IM / EV / inalação)', drug.posologyHosp);
  }

  if (drug.notes) {
    html += '<p class="emerg-note"><strong>Observações:</strong> ' + drug.notes + '</p>';
  }

  if (drug.tier === 'full' && drug.bulaUrl) {
    html += '<p class="med-bula-link"><a href="' + drug.bulaUrl + '" target="_blank" rel="noopener">Bulário ANVISA</a></p>';
  }

  html += '<p class="ps-rx-disclaimer">Ferramenta educacional — confirme posologia, ajuste renal/hepático e bula ANVISA antes de prescrever.</p>';

  content.innerHTML = html;
}

function medShowList () {
  medCurrentId = null;
  const listView = document.getElementById('med-list-view');
  const detailView = document.getElementById('med-detail-view');
  if (listView) listView.hidden = false;
  if (detailView) detailView.hidden = true;
  medRefreshGrid();
}

function medRefreshGrid () {
  const search = document.getElementById('med-search');
  const tierFilter = document.getElementById('med-filter-tier');
  const classFilter = document.getElementById('med-filter-class');
  const q = search ? search.value.trim() : '';
  const tier = tierFilter ? tierFilter.value : '';
  const cls = classFilter ? classFilter.value : '';

  let items = medFilterCatalog(q, { tier: tier === 'all' ? 'all' : tier });
  if (cls) items = items.filter(d => (d.classes || []).includes(cls));

  const mode = (!q && tier !== 'reference') ? 'browse' : 'search';
  medRenderGrid(items, { mode, query: q, tier });
}

function initMedicacoes () {
  const grid = document.getElementById('med-drug-grid');
  if (!grid || grid.dataset.medBound) return;
  grid.dataset.medBound = '1';

  medRefreshGrid();

  const search = document.getElementById('med-search');
  if (search) search.addEventListener('input', medRefreshGrid);

  const filterClass = document.getElementById('med-filter-class');
  if (filterClass) {
    const classes = new Set();
    medGetFullCatalog().forEach(d => (d.classes || []).forEach(c => classes.add(c)));
    [...classes].sort().forEach(cls => {
      const opt = document.createElement('option');
      opt.value = cls;
      opt.textContent = typeof medClassLabel === 'function' ? medClassLabel(cls) : cls;
      filterClass.appendChild(opt);
    });
    filterClass.addEventListener('change', medRefreshGrid);
  }

  const filterTier = document.getElementById('med-filter-tier');
  if (filterTier) filterTier.addEventListener('change', medRefreshGrid);

  const back = document.getElementById('med-back');
  if (back) back.addEventListener('click', medShowList);
}
