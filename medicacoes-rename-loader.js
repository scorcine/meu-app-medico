/* Medicações — loader lazy RENAME (nível B) a partir de JSON externo */

const MED_RENAME_BUILD = 'rename-v3';
let MED_RENAME_CACHE = null;
let MED_RENAME_LOADING = null;

function medFetchRenameReference () {
  if (MED_RENAME_CACHE) return Promise.resolve(MED_RENAME_CACHE);
  if (MED_RENAME_LOADING) return MED_RENAME_LOADING;

  MED_RENAME_LOADING = fetch('medicacoes-sources/rename-catalog.json?v=' + MED_RENAME_BUILD)
    .then(function (res) {
      if (!res.ok) throw new Error('Falha ao carregar RENAME (' + res.status + ')');
      return res.json();
    })
    .then(function (data) {
      MED_RENAME_CACHE = Array.isArray(data) ? data : [];
      MED_RENAME_LOADING = null;
      return MED_RENAME_CACHE;
    })
    .catch(function (err) {
      MED_RENAME_LOADING = null;
      console.warn('[MedHub] RENAME:', err.message || err);
      return [];
    });

  return MED_RENAME_LOADING;
}

function medGetRenameReference () {
  return MED_RENAME_CACHE || [];
}

function medIsRenameLoaded () {
  return MED_RENAME_CACHE !== null;
}

function medAnvisaSearchUrl (query) {
  return 'https://consultas.anvisa.gov.br/#/bulario/q/?nomeProduto=' + encodeURIComponent(query || '');
}
