/* Medicações — busca, lista e ficha clínica */

let medCurrentId = null;

function medNorm (text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function medGetDrugById (id) {
  return medGetCatalog().find(d => d.id === id) || null;
}

function medFilterCatalog (query) {
  const q = medNorm(query);
  const list = medGetCatalog();
  if (!q || q.length < 1) return list;
  return list.filter(d => {
    const hay = medNorm(d.name + ' ' + d.id + ' ' + d.classLabel + ' ' +
      (d.indications || []).join(' ') + ' ' + (d.presentations || []).join(' '));
    return hay.includes(q);
  });
}

function medRenderGrid (items) {
  const grid = document.getElementById('med-drug-grid');
  const empty = document.getElementById('med-empty');
  const count = document.getElementById('med-count');
  if (!grid) return;

  grid.innerHTML = '';
  if (count) count.textContent = items.length + ' medicamento(s)';

  items.forEach(drug => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calc-category-card med-drug-card';
    btn.dataset.medId = drug.id;
    btn.innerHTML =
      '<span class="med-drug-name">' + drug.name + '</span>' +
      '<span class="med-drug-class muted">' + drug.classLabel + '</span>';
    btn.addEventListener('click', () => medShowDrug(drug.id));
    grid.appendChild(btn);
  });

  if (empty) empty.hidden = items.length > 0;
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

  let html = '<p class="med-class-badge">' + drug.classLabel + '</p>';

  html += medListItems('Indicações clínicas', drug.indications);
  html += medListItems('Contraindicações absolutas', drug.ciAbs);
  html += medListItems('Contraindicações relativas / cautelas', drug.ciRel);

  if (drug.presentations && drug.presentations.length) {
    html += medListItems('Apresentações (Brasil)', drug.presentations);
  }

  if (drug.posologyVo && drug.posologyVo.length) {
    html += medListItems('Posologia VO / ambulatorial', drug.posologyVo);
  }

  if (drug.posologyHosp && drug.posologyHosp.length &&
      !(drug.posologyHosp.length === 1 && drug.posologyHosp[0] === '—')) {
    html += medListItems('Posologia hospitalar (IM / EV / inalação)', drug.posologyHosp);
  }

  if (drug.notes) {
    html += '<p class="emerg-note"><strong>Observações:</strong> ' + drug.notes + '</p>';
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
}

function initMedicacoes () {
  const grid = document.getElementById('med-drug-grid');
  if (!grid || grid.dataset.medBound) return;
  grid.dataset.medBound = '1';

  const catalog = medGetCatalog();
  medRenderGrid(catalog);

  const search = document.getElementById('med-search');
  if (search) {
    search.addEventListener('input', () => {
      medRenderGrid(medFilterCatalog(search.value));
    });
  }

  const filterClass = document.getElementById('med-filter-class');
  if (filterClass) {
    const classes = new Set();
    catalog.forEach(d => (d.classes || []).forEach(c => classes.add(c)));
    [...classes].sort().forEach(cls => {
      const opt = document.createElement('option');
      opt.value = cls;
      opt.textContent = typeof medClassLabel === 'function' ? medClassLabel(cls) : cls;
      filterClass.appendChild(opt);
    });
    filterClass.addEventListener('change', () => {
      const cls = filterClass.value;
      const q = search ? search.value : '';
      let items = medFilterCatalog(q);
      if (cls) items = items.filter(d => (d.classes || []).includes(cls));
      medRenderGrid(items);
    });
  }

  const back = document.getElementById('med-back');
  if (back) back.addEventListener('click', medShowList);
}
