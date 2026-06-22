/* Busca rápida global — protocolos, PS, receituário, medicações, exames, calculadoras */

const MEDHUB_SEARCH_EXTRAS = {
  sepse: 'sepsis choque septico sofa qsofa lactato procalcitonina',
  sca: 'infarto iam dor toracica troponina',
  avc: 'derrame isquemia nihss',
  dengue: 'arbovirose aedes',
  vm: 'ventilacao mecanica pbw vcv pcv',
  'ventilacao-mecanica': 'vm ventilacao mecanica intubacao',
  itu: 'cistite pielonefrite urina',
  tep: 'embolia pulmonar tromboembolismo',
  tvp: 'trombose venosa profunda',
  anafilaxia: 'alergia urticaria epinefrina adrenalina'
};

let medhubSearchIndex = null;

function medhubSearchNorm (text) {
  if (typeof clinicalNorm === 'function') return clinicalNorm(text);
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function medhubSearchExtras (id, name) {
  const key = String(id || '').split(/[-_]/)[0];
  const extra = MEDHUB_SEARCH_EXTRAS[id] || MEDHUB_SEARCH_EXTRAS[key] || '';
  return medhubSearchNorm(name + ' ' + id.replace(/-/g, ' ') + ' ' + extra);
}

function medhubSearchAdd (list, entry) {
  list.push(Object.assign({ haystack: medhubSearchNorm(entry.title + ' ' + (entry.keywords || '')) }, entry));
}

function medhubSearchBuildIndex () {
  if (medhubSearchIndex) return medhubSearchIndex;
  const items = [];

  if (typeof EMERGENCY_TOPICS !== 'undefined') {
    EMERGENCY_TOPICS.forEach(function (topic) {
      medhubSearchAdd(items, {
        module: 'Guia emergência',
        moduleOrder: 1,
        icon: topic.icon || '🚨',
        title: topic.name,
        keywords: medhubSearchExtras(topic.id, topic.name),
        go: (function (topicId) {
          return function () {
            showSection('guia-emergencia');
            showEmergenciaTopic(topicId);
          };
        })(topic.id)
      });
      (topic.protocols || []).forEach(function (protocol) {
        medhubSearchAdd(items, {
          module: 'Guia emergência',
          moduleOrder: 1,
          icon: protocol.icon || topic.icon || '🚨',
          title: protocol.name,
          subtitle: topic.name,
          keywords: medhubSearchExtras(protocol.id, protocol.name + ' ' + topic.name),
          go: (function (topicId, protocolId) {
            return function () {
              showSection('guia-emergencia');
              showEmergenciaTopic(topicId);
              showEmergenciaProtocol(protocolId);
            };
          })(topic.id, protocol.id)
        });
      });
    });
  }

  if (typeof PS_CONDITIONS !== 'undefined') {
    PS_CONDITIONS.forEach(function (c) {
      medhubSearchAdd(items, {
        module: 'Pronto Socorro',
        moduleOrder: 2,
        icon: c.icon || '🏥',
        title: c.name,
        keywords: medhubSearchExtras(c.id, c.name),
        go: (function (id) {
          return function () {
            showSection('pronto-socorro');
            showProntoSocorroCondition(id);
          };
        })(c.id)
      });
    });
  }

  if (typeof TH_CONDITIONS !== 'undefined') {
    TH_CONDITIONS.forEach(function (c) {
      medhubSearchAdd(items, {
        module: 'Tratamento hospitalar',
        moduleOrder: 3,
        icon: c.icon || '🏨',
        title: c.name,
        keywords: medhubSearchExtras(c.id, c.name),
        go: (function (id) {
          return function () {
            showSection('tratamento-hospitalar');
            showTratamentoHospitalarCondition(id);
          };
        })(c.id)
      });
    });
  }

  if (typeof rxGetCatalog === 'function') {
    rxGetCatalog().forEach(function (c) {
      medhubSearchAdd(items, {
        module: 'Receituário',
        moduleOrder: 4,
        icon: c.icon || '📝',
        title: c.name,
        keywords: medhubSearchExtras(c.id, c.name),
        go: (function (id) {
          return function () {
            showSection('receituario');
            rxShowCondition(id);
          };
        })(c.id)
      });
    });
  }

  if (typeof EXAMES_TOPICS !== 'undefined') {
    EXAMES_TOPICS.forEach(function (t) {
      medhubSearchAdd(items, {
        module: 'Exames',
        moduleOrder: 5,
        icon: t.icon || '🔬',
        title: t.name,
        keywords: medhubSearchNorm(t.searchText || t.name + ' ' + (t.tags || '')),
        go: (function (id) {
          return function () {
            showSection('exames');
            examesShowTopic(id);
          };
        })(t.id)
      });
    });
  }

  if (typeof INTERP_TOPICS !== 'undefined') {
    INTERP_TOPICS.forEach(function (t) {
      medhubSearchAdd(items, {
        module: 'Interpretação de exame',
        moduleOrder: 6,
        icon: t.icon || '📊',
        title: t.name,
        keywords: medhubSearchNorm(t.searchText || t.name + ' ' + (t.tags || '')),
        go: (function (id) {
          return function () {
            showSection('interpretacao-exame');
            interpShowTopic(id);
          };
        })(t.id)
      });
    });
  }

  if (typeof CALC_AREAS !== 'undefined' && typeof CALC_FORMS !== 'undefined') {
    CALC_AREAS.forEach(function (area) {
      (area.calculators || []).forEach(function (calcId) {
        const calc = CALC_FORMS[calcId];
        if (!calc) return;
        const icon = typeof getCalcIcon === 'function' ? getCalcIcon(calcId) : '🔢';
        medhubSearchAdd(items, {
          module: 'Calculadoras',
          moduleOrder: 7,
          icon: icon,
          title: calc.title,
          subtitle: area.name,
          keywords: medhubSearchExtras(calcId, calc.title + ' ' + area.name),
          go: (function (id) {
            return function () {
              const areaMatch = CALC_AREAS.find(function (a) {
                return (a.calculators || []).includes(id);
              });
              if (!areaMatch) return;
              const section = areaMatch.linkSection || 'calc-essenciais';
              showSection(section);
              if (section === 'calc-pediatrica') return;
              showCalcArea(areaMatch.id);
              showCalcTool(id);
            };
          })(calcId)
        });
      });
    });
  }

  medhubSearchAdd(items, {
    module: 'Ventilação mecânica',
    moduleOrder: 2,
    icon: '🫁',
    title: 'Ventilação mecânica — calculadora',
    keywords: medhubSearchExtras('ventilacao-mecanica', 'ventilacao mecanica vm pbw vcv'),
    go: function () {
      showSection('ventilacao-mecanica');
      if (typeof initVentilacaoMecanica === 'function') initVentilacaoMecanica();
    }
  });

  if (typeof medGetSearchCatalog === 'function') {
    medGetSearchCatalog().forEach(function (drug) {
      medhubSearchAdd(items, {
        module: 'Medicações',
        moduleOrder: 8,
        icon: '💊',
        title: drug.name || drug.id,
        subtitle: drug.classLabel || '',
        keywords: medhubSearchNorm(
          (drug.name || '') + ' ' + (drug.id || '') + ' ' + (drug.classLabel || '') + ' ' + (drug.classes || []).join(' ')
        ),
        go: (function (id) {
          return function () {
            showSection('medicacoes');
            medShowDrug(id);
          };
        })(drug.id)
      });
    });
  }

  medhubSearchIndex = items;
  return medhubSearchIndex;
}

function medhubSearchScore (item, query) {
  if (!query) return 0;
  const title = medhubSearchNorm(item.title);
  const subtitle = medhubSearchNorm(item.subtitle || '');
  if (title === query) return 120;
  if (title.startsWith(query)) return 100;
  if (title.includes(query)) return 80;
  if (subtitle.includes(query)) return 60;
  if (item.haystack.includes(query)) return 40;
  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every(function (t) { return item.haystack.includes(t); })) return 35;
  return 0;
}

function medhubSearchRun (query, limit) {
  const q = medhubSearchNorm(query);
  if (!q || q.length < 2) return [];
  const index = medhubSearchBuildIndex();
  return index
    .map(function (item) {
      return { item: item, score: medhubSearchScore(item, q) };
    })
    .filter(function (row) { return row.score > 0; })
    .sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      if (a.item.moduleOrder !== b.item.moduleOrder) return a.item.moduleOrder - b.item.moduleOrder;
      return a.item.title.localeCompare(b.item.title, 'pt-BR');
    })
    .slice(0, limit || 24)
    .map(function (row) { return row.item; });
}

function medhubSearchRenderResults (container, results, query) {
  if (!container) return;
  if (!results.length) {
    container.innerHTML = '<p class="app-search-empty muted">Nenhum resultado para <strong>' + escapeHtml(query) + '</strong>. Tente outra palavra (ex.: sepse, dengue, dipirona).</p>';
    container.hidden = false;
    return;
  }

  const groups = [];
  const groupMap = new Map();
  results.forEach(function (item) {
    if (!groupMap.has(item.module)) {
      const group = { label: item.module, items: [] };
      groupMap.set(item.module, group);
      groups.push(group);
    }
    groupMap.get(item.module).items.push(item);
  });

  container.innerHTML = groups.map(function (group) {
    return ''
      + '<div class="app-search-group">'
      + '<p class="app-search-group-label">' + escapeHtml(group.label) + '</p>'
      + group.items.map(function (item) {
        const idx = results.indexOf(item);
        return ''
          + '<button type="button" class="app-search-result" data-search-index="' + idx + '">'
          + '<span class="app-search-result-icon" aria-hidden="true">' + item.icon + '</span>'
          + '<span class="app-search-result-copy">'
          + '<strong>' + escapeHtml(item.title) + '</strong>'
          + (item.subtitle ? '<span>' + escapeHtml(item.subtitle) + '</span>' : '')
          + '</span>'
          + '</button>';
      }).join('')
      + '</div>';
  }).join('');
  container.hidden = false;
}

function escapeHtml (text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function medhubSearchActivate (item) {
  if (!item || typeof item.go !== 'function') return;
  document.querySelectorAll('.app-search-results').forEach(function (el) {
    el.hidden = true;
  });
  document.querySelectorAll('.app-global-search-input').forEach(function (input) {
    input.value = '';
  });
  if (typeof medhubCloseAppMobileNav === 'function') medhubCloseAppMobileNav();
  item.go();
}

function medhubSearchBindWidget (input, resultsEl) {
  if (!input || input.dataset.searchBound) return;
  input.dataset.searchBound = '1';
  let lastResults = [];

  function refresh () {
    const query = input.value.trim();
    if (query.length < 2) {
      resultsEl.hidden = true;
      resultsEl.innerHTML = '';
      lastResults = [];
      return;
    }
    lastResults = medhubSearchRun(query, 24);
    medhubSearchRenderResults(resultsEl, lastResults, query);
  }

  input.addEventListener('input', refresh);
  input.addEventListener('focus', refresh);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      resultsEl.hidden = true;
      input.blur();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (lastResults[0]) medhubSearchActivate(lastResults[0]);
    }
  });

  resultsEl.addEventListener('click', function (event) {
    const btn = event.target.closest('.app-search-result');
    if (!btn) return;
    const idx = Number(btn.dataset.searchIndex);
    if (lastResults[idx]) medhubSearchActivate(lastResults[idx]);
  });
}

function medhubInitAppSearch () {
  medhubSearchBuildIndex();
  medhubSearchBindWidget(
    document.getElementById('app-search-input-header'),
    document.getElementById('app-search-results-header')
  );

  document.addEventListener('click', function (event) {
    if (event.target.closest('.app-global-search')) return;
    document.querySelectorAll('.app-search-results').forEach(function (el) {
      el.hidden = true;
    });
  });
}
