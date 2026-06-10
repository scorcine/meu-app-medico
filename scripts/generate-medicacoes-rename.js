#!/usr/bin/env node
/* Gera medicacoes-rename-data.js — catálogo referência RENAME 2024 (nível B) */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const sourcePath = path.join(__dirname, 'rename-2024-source.txt');
const seedPath = path.join(__dirname, 'rename-seed.json');

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

const SALT_PREFIX = /^(cloridrato|dicloridrato|sulfato|maleato|besilato|medoxomil|cilexetila|sodico|sódica|potassica|potássica|de)\s+/i;

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

function parseRenameSource (text) {
  const byKey = new Map();
  if (!text) return [];

  const inline = /([a-záàâãéêíóúç][a-záàâãéêíóúç0-9 \-\+,\(\)\/\.%º]{2,85}?)\s+\d[\d,\.\s]*(mg|mcg|g|UI|U)\b[^\n]{0,140}?\b(A\d{2}[A-Z]{2}\d{2})\b/gim;
  let m;
  while ((m = inline.exec(text))) {
    const name = m[1].trim().replace(/\s+/g, ' ');
    if (name.length < 4 || /código atc/i.test(name)) continue;
    const key = norm(name);
    byKey.set(key, { name, atc: m[3], component: 'RENAME' });
  }

  const pipe = /\|\s*([a-záàâãéêíóúç0-9][a-záàâãéêíóúç0-9 \-\+,\(\)]{2,70}?)\s*\|[^\n]*\b(A\d{2}[A-Z]{2}\d{2})\b/gi;
  while ((m = pipe.exec(text))) {
    const name = m[1].trim().replace(/\s+/g, ' ');
    if (name.length < 4) continue;
    byKey.set(norm(name), { name, atc: m[2], component: 'RENAME' });
  }

  return [...byKey.values()];
}

function loadFullCatalogKeys () {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const sandbox = { document: dom.window.document, console, globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  [
    'med-apresentacoes-vo.js',
    'medicacoes-classes.js',
    'ps-drug-meta-gaps.js',
    'pronto-socorro-interactive-drugs.js',
    'medicacoes-data.js'
  ].forEach(rel => {
    const src = fs.readFileSync(path.join(root, rel), 'utf8')
      .replace(/\bconst (PS_DRUG_META|PS_DRUG_META_GAPS) =/g, 'globalThis.$1 =');
    vm.runInContext(src, sandbox);
  });

  if (sandbox.PS_DRUG_META_GAPS && sandbox.PS_DRUG_META) {
    Object.assign(sandbox.PS_DRUG_META, sandbox.PS_DRUG_META_GAPS);
  }

  const keys = new Set();
  const add = name => {
    keys.add(norm(name));
    keys.add(coreName(name));
  };

  if (sandbox.PS_DRUG_META) {
    Object.entries(sandbox.PS_DRUG_META).forEach(([id, meta]) => {
      add(meta.name);
      add(id.replace(/_/g, ' '));
    });
  }

  if (typeof sandbox.medGetCatalog === 'function') {
    sandbox.medGetCatalog().forEach(d => {
      add(d.name);
      add(d.id.replace(/^ref-/, '').replace(/_/g, ' '));
    });
  }

  return keys;
}

function isDuplicate (name, fullKeys) {
  const n = norm(name);
  const c = coreName(name);
  if (fullKeys.has(n) || fullKeys.has(c)) return true;
  return false;
}

function buildReferenceEntry (item) {
  const id = 'ref-' + slug(item.name);
  const classLabel = atcClassLabel(item.atc);
  return {
    id,
    tier: 'reference',
    rename: true,
    name: item.name,
    dcb: item.name,
    atc: item.atc || '',
    renameComponent: item.component || 'RENAME',
    classes: ['discharge_only'],
    classLabel,
    indications: ['Medicamento listado na RENAME 2024 (MS/SUS). Consulte PCDT, bula ANVISA e protocolo institucional.'],
    ciAbs: ['Consultar bula ANVISA — contraindicações variam por apresentação e indicação.'],
    ciRel: ['Gestação, lactação, DRC, hepatopatia — ajustar conforme bula e diretriz.'],
    presentations: ['Ver concentrações e formas na RENAME 2024 / Bulário eletrônico ANVISA.'],
    posologyVo: ['Posologia conforme bula ANVISA e diretriz do Ministério da Saúde.'],
    posologyHosp: ['—'],
    notes: 'Ficha de referência (nível B) — não revisada manualmente pelo MedHub. Financiamento SUS: ' + (item.component || 'RENAME') + '.',
    bulaUrl: bulaSearchUrl(item.name),
    searchText: (item.name + ' rename ' + (item.atc || '') + ' ' + classLabel).toLowerCase()
  };
}

function main () {
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const parsed = fs.existsSync(sourcePath)
    ? parseRenameSource(fs.readFileSync(sourcePath, 'utf8'))
    : [];

  const merged = new Map();
  [...seed, ...parsed].forEach(item => {
    if (!isValidRenameName(item.name)) return;
    const key = norm(item.name);
    if (!merged.has(key) || (item.atc && !merged.get(key).atc)) {
      merged.set(key, item);
    }
  });

  const fullKeys = loadFullCatalogKeys();
  const reference = [];
  merged.forEach(item => {
    if (!isDuplicate(item.name, fullKeys)) {
      reference.push(buildReferenceEntry(item));
    }
  });

  reference.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const out = `/* Medicações — referência RENAME 2024 (nível B, gerado automaticamente) */
/* Fonte: seed curado + trechos RENAME 2024 MS/SUS — CC BY-NC-SA */
/* Não substitui ficha MedHub (nível A). Revisar bula ANVISA antes de prescrever. */

const MED_RENAME_BUILD = 'rename-v1';
const MED_RENAME_REFERENCE = ${JSON.stringify(reference, null, 2)};

function medGetRenameReference () {
  return MED_RENAME_REFERENCE;
}
`;

  fs.writeFileSync(path.join(root, 'medicacoes-rename-data.js'), out, 'utf8');
  console.log('Seed entries:', seed.length);
  console.log('Parsed from PDF text:', parsed.length);
  console.log('Reference after dedup:', reference.length);
  console.log('Written medicacoes-rename-data.js');
}

main();
