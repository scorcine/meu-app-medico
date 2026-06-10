#!/usr/bin/env node
/* Auditoria unificada — gaps, duplicatas, posologia, receituário PS */

const fs = require('fs');
const path = require('path');
const {
  loadMedContext,
  collectProtocolTexts,
  detectDrugsInText,
  getFullCatalog,
  loadRenameCatalogFromDisk,
  norm,
  coreName,
  writeJson,
  updateManifest
} = require('./med-pipeline-lib');

const { missingMeta } = require('./audit-medicacoes-gaps');

function auditDuplicates (catalog) {
  const byCore = new Map();
  const dupes = [];

  catalog.forEach(d => {
    const key = coreName(d.name);
    if (!byCore.has(key)) byCore.set(key, []);
    byCore.get(key).push(d);
  });

  byCore.forEach((items, key) => {
    if (items.length > 1 && key.length > 3) {
      dupes.push({ coreName: key, ids: items.map(i => i.id), names: items.map(i => i.name) });
    }
  });

  return dupes.sort((a, b) => b.ids.length - a.ids.length);
}

function auditMissingPosology (catalog) {
  const issues = [];
  catalog.forEach(d => {
    const vo = (d.posologyVo || []).filter(p => p && p !== '—');
    const hosp = (d.posologyHosp || []).filter(p => p && p !== '—');
    if (!vo.length && !hosp.length) {
      issues.push({ id: d.id, name: d.name, issue: 'sem_posologia' });
    }
  });
  return issues;
}

function auditRxWithoutMed (ctx, catalogIds) {
  const missing = [];
  if (typeof ctx.psGetInteractiveConfig !== 'function') return missing;

  const seen = new Set();
  (ctx.PS_CONDITIONS || []).forEach(cond => {
    let config;
    try { config = ctx.psGetInteractiveConfig(cond.id); } catch (_) { return; }
    if (!config || !config.medications) return;
    config.medications.forEach(med => {
      (med.drugs || []).forEach(d => {
        if (seen.has(d.id)) return;
        seen.add(d.id);
        if (!catalogIds.has(d.id) && ctx.PS_DRUG_META && !ctx.PS_DRUG_META[d.id]) {
          missing.push({ id: d.id, label: d.label || d.id, condition: cond.id });
        }
      });
    });
  });

  return missing;
}

function auditRenameOverlap (fullCatalog, renameCatalog) {
  const fullCores = new Set(fullCatalog.map(d => coreName(d.name)));
  return renameCatalog.filter(r => fullCores.has(coreName(r.name))).map(r => ({
    id: r.id,
    name: r.name,
    issue: 'rename_duplicates_full'
  }));
}

const ctx = loadMedContext(['pronto-socorro-interactive-core.js']);
const fullCatalog = getFullCatalog(ctx);
const renameCatalog = loadRenameCatalogFromDisk();
const catalogIds = new Set(fullCatalog.map(d => d.id));

const report = {
  generatedAt: new Date().toISOString(),
  counts: {
    fullCatalog: fullCatalog.length,
    renameCatalog: renameCatalog.length,
    protocolGaps: missingMeta.length
  },
  protocolGaps: missingMeta,
  duplicateCoreNames: auditDuplicates(fullCatalog),
  missingPosology: auditMissingPosology(fullCatalog),
  rxInteractiveMissing: auditRxWithoutMed(ctx, catalogIds),
  renameOverlaps: auditRenameOverlap(fullCatalog, renameCatalog),
  ok: true
};

report.ok = report.protocolGaps.length === 0 &&
  report.rxInteractiveMissing.length === 0;

const outPath = writeJson('audit-report.json', report);
updateManifest({
  fullCatalog: report.counts.fullCatalog,
  renameCatalog: report.counts.renameCatalog,
  auditOk: report.ok,
  auditGaps: report.protocolGaps.length,
  auditDuplicates: report.duplicateCoreNames.length,
  auditMissingPosology: report.missingPosology.length
});

console.log('=== MedHub — audit-medicacoes ===\n');
console.log('Fichas MedHub (A):', report.counts.fullCatalog);
console.log('Referência RENAME (B):', report.counts.renameCatalog);
console.log('Gaps protocolo × meta:', report.protocolGaps.length);
console.log('Duplicatas (core name):', report.duplicateCoreNames.length);
console.log('Sem posologia VO/hosp:', report.missingPosology.length);
console.log('Receituário PS sem ficha:', report.rxInteractiveMissing.length);
console.log('RENAME sobrepõe ficha A:', report.renameOverlaps.length);
console.log('\nStatus:', report.ok ? 'OK' : 'ATENÇÃO');
console.log('Relatório:', outPath);

if (report.protocolGaps.length) {
  console.log('\nGaps:');
  report.protocolGaps.slice(0, 15).forEach(g => {
    console.log(' -', g.id, '(' + g.count + ' blocos)');
  });
}

process.exit(report.ok ? 0 : 1);
