#!/usr/bin/env node
/* Gera medicacoes-sources/rename-catalog.json — catálogo referência RENAME 2024 (nível B) */

const fs = require('fs');
const path = require('path');
const {
  root,
  sourcesDir,
  norm,
  slug,
  coreName,
  atcClassLabel,
  bulaSearchUrl,
  isValidRenameName,
  loadMedContext,
  getFullCatalogKeys,
  writeJson,
  updateManifest
} = require('./med-pipeline-lib');

const sourcePath = path.join(__dirname, 'rename-2024-source.txt');
const seedPath = path.join(sourcesDir, 'rename-seed.json');

function parseRenameSource (text) {
  const byKey = new Map();
  if (!text) return [];

  const inline = /([a-záàâãéêíóúç][a-záàâãéêíóúç0-9 \-\+,\(\)\/\.%º]{2,85}?)\s+\d[\d,\.\s]*(mg|mcg|g|UI|U)\b[^\n]{0,140}?\b(A\d{2}[A-Z]{2}\d{2})\b/gim;
  let m;
  while ((m = inline.exec(text))) {
    const name = m[1].trim().replace(/\s+/g, ' ');
    if (name.length < 4 || /código atc/i.test(name)) continue;
    byKey.set(norm(name), { name, atc: m[3], component: 'RENAME' });
  }

  const pipe = /\|\s*([a-záàâãéêíóúç0-9][a-záàâãéêíóúç0-9 \-\+,\(\)]{2,70}?)\s*\|[^\n]*\b(A\d{2}[A-Z]{2}\d{2})\b/gi;
  while ((m = pipe.exec(text))) {
    const name = m[1].trim().replace(/\s+/g, ' ');
    if (name.length < 4) continue;
    byKey.set(norm(name), { name, atc: m[2], component: 'RENAME' });
  }

  return [...byKey.values()];
}

function isDuplicate (name, fullKeys) {
  const n = norm(name);
  const c = coreName(name);
  return fullKeys.has(n) || fullKeys.has(c);
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
  if (!fs.existsSync(sourcesDir)) fs.mkdirSync(sourcesDir, { recursive: true });

  const legacySeed = path.join(__dirname, 'rename-seed.json');
  if (!fs.existsSync(seedPath) && fs.existsSync(legacySeed)) {
    fs.copyFileSync(legacySeed, seedPath);
  }

  if (!fs.existsSync(seedPath)) {
    console.error('Seed não encontrado:', seedPath);
    process.exit(1);
  }

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

  const ctx = loadMedContext();
  const fullKeys = getFullCatalogKeys(ctx);
  const reference = [];
  merged.forEach(item => {
    if (!isDuplicate(item.name, fullKeys)) {
      reference.push(buildReferenceEntry(item));
    }
  });

  reference.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const catalogPath = writeJson('rename-catalog.json', reference);
  updateManifest({
    renameBuild: 'rename-v3',
    renameEntries: reference.length,
    renameSeed: seed.length,
    renameParsed: parsed.length
  });

  console.log('Seed entries:', seed.length);
  console.log('Parsed from PDF text:', parsed.length);
  console.log('Reference after dedup:', reference.length);
  console.log('Written', catalogPath);
}

main();
