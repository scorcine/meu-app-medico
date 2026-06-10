#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { loadMedContext, getFullCatalog, norm, coreName } = require('./med-pipeline-lib');

const rename = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'medicacoes-sources', 'rename-catalog.json'), 'utf8'));
const ctx = loadMedContext();
const full = getFullCatalog(ctx);
const fullCores = new Set(full.map(d => coreName(d.name)));

const skip = /^(alfa|beta)-|Básico A\d|doxorrubicina|filgrastim|adalimumabe|remdesivir|somatropina|tacrolimus|micofenolato/i;

const candidates = rename
  .filter(r => !fullCores.has(coreName(r.name)))
  .filter(r => !skip.test(r.name))
  .map(r => ({ name: r.name, id: r.id, atc: r.atc, component: r.renameComponent }));

console.log('RENAME-only candidates (filtered):', candidates.length);
candidates.slice(0, 60).forEach(c => console.log(c.name));
