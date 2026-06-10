#!/usr/bin/env node
/* Pipeline Medicações — regenerar catálogos + extrair protocolos + auditar */

const { spawnSync } = require('child_process');
const path = require('path');

const steps = [
  ['generate-medicacoes-data.js', 'Fichas MedHub (nível A)'],
  ['generate-medicacoes-rename.js', 'Referência RENAME (nível B)'],
  ['extract-protocol-drugs.js', 'Extrair fármacos dos protocolos'],
  ['audit-medicacoes.js', 'Auditoria unificada']
];

console.log('=== MedHub pipeline Medicações ===\n');

steps.forEach(([script, label]) => {
  console.log('→', label);
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  if (r.status !== 0) {
    console.error('\nPipeline interrompido em', script);
    process.exit(r.status || 1);
  }
  console.log('');
});

console.log('Pipeline concluído.');
