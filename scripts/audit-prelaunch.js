/* Auditoria pré-lançamento — protocolos, receituário e consistência */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost/' });

const files = [
  'med-apresentacoes-vo.js',
  'receituario-data.js',
  'pronto-socorro-content-1.js',
  'pronto-socorro-content-2.js',
  'pronto-socorro-content-3.js',
  'pronto-socorro-content-4.js',
  'pronto-socorro-content-5.js',
  'pronto-socorro-interactive-drugs.js',
  'pronto-socorro.js',
  'receituario-ps-bridge.js'
];

const sandbox = { document: dom.window.document, window: dom.window, console };
vm.createContext(sandbox);
files.forEach(rel => vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), sandbox));

const psIds = vm.runInContext('PS_CONDITIONS.map(c=>c.id)', sandbox);
const psContentKeys = vm.runInContext('Object.keys(PS_CONTENT)', sandbox);
const missingPs = psIds.filter(id => !psContentKeys.includes(id));

const result = vm.runInContext(`(() => {
  const catalog = rxGetCatalog();
  const issues = [];
  let crossClass = 0;

  catalog.forEach(cond => {
    if (cond.id === 'dengue') {
      cond.groups.forEach(g => g.options.forEach(opt => {
        const meds = rxGetOptionMeds(opt, g.label);
        const nsaid = meds.filter(m => (m.classes || []).includes('nsaid')).length;
        if (nsaid > 0) issues.push('CRITICAL: dengue receituario has ' + nsaid + ' AINE options in ' + opt.id);
      }));
    }

    if (cond.id === 'cistite-itu-baixa') {
      const atb = cond.groups.find(g => /antibiot/i.test(g.label));
      const first = atb && atb.options.find(o => /1ª linha/i.test(o.tier));
      if (first && !/nitrofurantoina|nitrofurantoina100/i.test(first.label + (first.meds||[]).map(m=>m.text).join(''))) {
        issues.push('HIGH: cistite 1a linha should be nitrofurantoina, got: ' + first.label);
      }
    }

    cond.groups.forEach(g => {
      g.options.forEach(opt => {
        const classes = opt.classes || [];
        const isAnalgesicOnly = classes.includes('analgesic_non_opioid') && !classes.includes('nsaid');
        const isNsaidOnly = classes.includes('nsaid') && !classes.includes('analgesic_non_opioid');
        const meds = rxGetOptionMeds(opt, g.label);
        const nsaidCount = meds.filter(m => (m.classes || []).includes('nsaid')).length;
        const analgesicCount = meds.filter(m => (m.classes || []).includes('analgesic_non_opioid')).length;
        if (isAnalgesicOnly && nsaidCount > 0) { crossClass++; issues.push('MIX: ' + cond.id + ' ' + opt.id + ' analgesic has AINE'); }
        if (isNsaidOnly && analgesicCount > 0) { crossClass++; issues.push('MIX: ' + cond.id + ' ' + opt.id + ' AINE has analgesic'); }
      });
    });
  });

  const dengueNsaidTest = rxValidateConditionMeds(
    { id: 'dengue' },
    [{ med: { text: 'Ibuprofeno 400 mg', classes: ['nsaid'] } }]
  );
  if (!dengueNsaidTest.some(m => m.severity === 'error')) {
    issues.push('CRITICAL: rxValidateConditionMeds does not block AINE in dengue');
  }

  return {
    conditions: catalog.length,
    crossClass,
    issues
  };
})()`, sandbox);

console.log('=== MedHub pré-lançamento ===');
console.log('Condições PS:', psIds.length);
console.log('PS sem conteúdo HTML:', missingPs.length ? missingPs.join(', ') : 'nenhum');
console.log('Condições receituário:', result.conditions);
console.log('Misturas analgésico/AINE:', result.crossClass);

if (result.issues.length) {
  console.log('\nProblemas:');
  result.issues.forEach(i => console.log(' -', i));
  process.exitCode = 1;
} else {
  console.log('\nOK — auditoria pré-lançamento passou.');
}
