#!/usr/bin/env node
/* Utilitários compartilhados — pipeline Medicações MedHub */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const sourcesDir = path.join(root, 'medicacoes-sources');

const PROTOCOL_FILES = [
  'med-apresentacoes-vo.js',
  'pronto-socorro-content-1.js',
  'pronto-socorro-content-2.js',
  'pronto-socorro-content-3.js',
  'pronto-socorro-content-4.js',
  'pronto-socorro-content-5.js',
  'pronto-socorro.js',
  'tratamento-hospitalar-content-1.js',
  'tratamento-hospitalar-content-2.js',
  'tratamento-hospitalar.js',
  'emergency-guide.js',
  'medicacoes-classes.js',
  'ps-drug-meta-gaps.js',
  'pronto-socorro-interactive-drugs.js',
  'medicacoes-data.js',
  'medicacoes-rename-loader.js'
];

const SALT_PREFIX = /^(cloridrato|dicloridrato|sulfato|maleato|besilato|medoxomil|cilexetila|sodico|sódica|potassica|potássica|de)\s+/i;

const ATC_CLASS = {
  A: 'Aparelho digestivo e metabolismo',
  B: 'Sangue e hematologia',
  C: 'Sistema cardiovascular',
  D: 'Dermatológicos',
  G: 'Sistema geniturinário',
  H: 'Hormônios sistêmicos',
  J: 'Anti-infecciosos sistêmicos',
  L: 'Antineoplásicos e imunomoduladores',
  M: 'Sistema musculoesquelético',
  N: 'Sistema nervoso',
  P: 'Antiparasitários',
  R: 'Sistema respiratório',
  S: 'Órgãos sensoriais',
  V: 'Vários'
};

function prepForSandbox (src) {
  return src
    .replace(/\bconst (PS_DRUG_META|PS_DRUG_META_GAPS|PS_CONTENT_\d|TH_CONTENT_\d|PS_CONTENT|TH_CONTENT|EMERGENCY_TOPICS|MED_RENAME_REFERENCE) =/g, 'globalThis.$1 =')
    .replace(/\bconst (PARADA_PROTOCOLS|SCA_PROTOCOLS|AVC_PROTOCOLS|SEPSE_PROTOCOLS|TRAUMA_PROTOCOLS|VIA_AEREA_PROTOCOLS|REACOES_METABOLICAS_PROTOCOLS|OBSTETRICIA_PROTOCOLS|PEDIATRIC_PROTOCOLS|TOXICOLOGIA_PROTOCOLS|PRESSAO_RITMO_PROTOCOLS|PROCEDIMENTOS_PROTOCOLS) =/g, 'globalThis.$1 =');
}

function norm (s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}

function coreName (name) {
  let n = norm(name);
  n = n.replace(SALT_PREFIX, '');
  n = n.replace(/\s*\+\s*/g, ' + ');
  return n;
}

function slug (name) {
  return norm(name).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 80);
}

function atcClassLabel (code) {
  if (!code || code.length < 1) return 'Medicamento · RENAME';
  return (ATC_CLASS[code.charAt(0).toUpperCase()] || 'Medicamento') + ' · RENAME';
}

function bulaSearchUrl (name) {
  return 'https://consultas.anvisa.gov.br/#/bulario/q/?nomeProduto=' + encodeURIComponent(name);
}

function isValidRenameName (name) {
  const n = (name || '').trim();
  if (n.length < 4) return false;
  if (/código atc/i.test(n)) return false;
  if (/^\d[\d,\.\s]*(mg|mcg|g|UI|U)\b/i.test(n)) return false;
  if (!/[a-záàâãéêíóúç]{3,}/i.test(n)) return false;
  return true;
}

function stripHtml (html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadMedContext (extraFiles) {
  const files = [...PROTOCOL_FILES];
  (extraFiles || []).forEach(f => {
    if (!files.includes(f)) files.push(f);
  });

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost/' });
  const sandbox = { document: dom.window.document, window: dom.window, console, globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  files.forEach(rel => {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) return;
    const src = prepForSandbox(fs.readFileSync(full, 'utf8'));
    vm.runInContext(src, sandbox);
  });

  if (sandbox.PS_DRUG_META_GAPS && sandbox.PS_DRUG_META) {
    Object.assign(sandbox.PS_DRUG_META, sandbox.PS_DRUG_META_GAPS);
  }

  return sandbox;
}

function mergeDrugMeta (ctx) {
  if (ctx.PS_DRUG_META_GAPS && ctx.PS_DRUG_META) {
    Object.assign(ctx.PS_DRUG_META, ctx.PS_DRUG_META_GAPS);
  }
}

function collectProtocolTexts (ctx) {
  const texts = [];
  const add = (label, html) => {
    if (html && typeof html === 'string' && html.length > 20) {
      texts.push({ label, text: stripHtml(html) });
    }
  };

  if (ctx.PS_CONTENT) Object.entries(ctx.PS_CONTENT).forEach(([id, html]) => add('PS:' + id, html));
  if (ctx.TH_CONTENT) Object.entries(ctx.TH_CONTENT).forEach(([id, html]) => add('TH:' + id, html));
  if (ctx.EMERGENCY_TOPICS) {
    ctx.EMERGENCY_TOPICS.forEach(topic => {
      (topic.protocols || []).forEach((p, i) => {
        add('EM:' + topic.id + ':' + i, p.content || p.html || p.body || '');
      });
    });
  }

  return texts;
}

function detectDrugsInText (text, ctx) {
  const found = new Set();
  if (typeof ctx.psExtractDrugsFromText === 'function') {
    ctx.psExtractDrugsFromText(text).forEach(id => found.add(id));
  }
  return found;
}

function getFullCatalogKeys (ctx) {
  const keys = new Set();
  const add = name => {
    keys.add(norm(name));
    keys.add(coreName(name));
  };

  if (ctx.PS_DRUG_META) {
    Object.entries(ctx.PS_DRUG_META).forEach(([id, meta]) => {
      add(meta.name);
      add(id.replace(/_/g, ' '));
    });
  }

  if (typeof ctx.medGetCatalog === 'function') {
    ctx.medGetCatalog().forEach(d => {
      add(d.name);
      add(d.id.replace(/^ref-/, '').replace(/_/g, ' '));
    });
  }

  return keys;
}

function getFullCatalog (ctx) {
  if (typeof ctx.medGetCatalog === 'function') {
    return ctx.medGetCatalog().map(d => ({ ...d, tier: d.tier || 'full' }));
  }
  return [];
}

function loadRenameCatalogFromDisk () {
  const jsonPath = path.join(sourcesDir, 'rename-catalog.json');
  if (!fs.existsSync(jsonPath)) return [];
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function writeJson (filename, data) {
  if (!fs.existsSync(sourcesDir)) fs.mkdirSync(sourcesDir, { recursive: true });
  const outPath = path.join(sourcesDir, filename);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  return outPath;
}

function updateManifest (patch) {
  const manifestPath = path.join(sourcesDir, 'pipeline-manifest.json');
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (_) { /* ignore */ }
  }
  Object.assign(manifest, patch, { updatedAt: new Date().toISOString() });
  writeJson('pipeline-manifest.json', manifest);
  return manifest;
}

module.exports = {
  root,
  sourcesDir,
  PROTOCOL_FILES,
  SALT_PREFIX,
  ATC_CLASS,
  prepForSandbox,
  norm,
  coreName,
  slug,
  atcClassLabel,
  bulaSearchUrl,
  isValidRenameName,
  stripHtml,
  loadMedContext,
  mergeDrugMeta,
  collectProtocolTexts,
  detectDrugsInText,
  getFullCatalogKeys,
  getFullCatalog,
  loadRenameCatalogFromDisk,
  writeJson,
  updateManifest
};
