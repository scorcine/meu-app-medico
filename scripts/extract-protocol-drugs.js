#!/usr/bin/env node
/* Extrai fármacos citados nos protocolos → medicacoes-sources/protocol-drugs.json */

const {
  loadMedContext,
  collectProtocolTexts,
  detectDrugsInText,
  getFullCatalog,
  loadRenameCatalogFromDisk,
  norm,
  writeJson,
  updateManifest
} = require('./med-pipeline-lib');

const ctx = loadMedContext();
const texts = collectProtocolTexts(ctx);
const mentioned = new Map();

texts.forEach(({ label, text }) => {
  detectDrugsInText(text, ctx).forEach(id => {
    if (!mentioned.has(id)) mentioned.set(id, new Set());
    mentioned.get(id).add(label);
  });
});

const fullCatalog = getFullCatalog(ctx);
const fullById = new Map(fullCatalog.map(d => [d.id, d]));
const renameCatalog = loadRenameCatalogFromDisk();
const renameByCore = new Map();
renameCatalog.forEach(d => {
  renameByCore.set(norm(d.name), d);
  renameByCore.set(norm(d.dcb || d.name), d);
});

const drugs = [];
mentioned.forEach((sources, id) => {
  const meta = ctx.PS_DRUG_META && ctx.PS_DRUG_META[id];
  const full = fullById.get(id);
  const ref = renameByCore.get(norm(meta?.name || id.replace(/_/g, ' ')));
  drugs.push({
    id,
    name: meta?.name || full?.name || id.replace(/_/g, ' '),
    sources: [...sources].sort(),
    sourceCount: sources.size,
    inMeta: !!(ctx.PS_DRUG_META && ctx.PS_DRUG_META[id]),
    inFullCatalog: !!full,
    inRename: !!ref,
    tier: full ? 'full' : (ref ? 'reference' : null)
  });
});

drugs.sort((a, b) => b.sourceCount - a.sourceCount || a.id.localeCompare(b.id));

const payload = {
  generatedAt: new Date().toISOString(),
  protocolBlocks: texts.length,
  drugCount: drugs.length,
  inCatalog: drugs.filter(d => d.inFullCatalog).length,
  gaps: drugs.filter(d => !d.inFullCatalog && !d.inRename).length,
  drugs
};

const outPath = writeJson('protocol-drugs.json', payload);
updateManifest({
  protocolBlocks: texts.length,
  protocolDrugs: drugs.length,
  protocolGaps: payload.gaps
});

console.log('Protocol blocks:', texts.length);
console.log('Drugs mentioned:', drugs.length);
console.log('In full catalog:', payload.inCatalog);
console.log('Gaps (not full nor RENAME):', payload.gaps);
console.log('Written', outPath);

module.exports = payload;
