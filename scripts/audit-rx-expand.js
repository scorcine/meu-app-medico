/* Audita expansão VO — completude e separação analgésico vs AINE */
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

const result = vm.runInContext(`(() => {
  const catalog = rxGetCatalog();
  const nsaidFull = MED_VO_GROUPS.nsaid.length;
  const analgesicFull = MED_VO_GROUPS.analgesic_non_opioid.length;
  const issues = [];
  let expanded = 0;
  let nsaidPartial = 0;
  let analgesicPartial = 0;
  let crossClass = 0;

  catalog.forEach(cond => {
    cond.groups.forEach(g => {
      g.options.forEach(opt => {
        if (opt._voExpanded) expanded++;
        const meds = rxGetOptionMeds(opt, g.label);
        const nsaidCount = meds.filter(m => (m.classes || []).includes('nsaid')).length;
        const analgesicCount = meds.filter(m => (m.classes || []).includes('analgesic_non_opioid')).length;
        const label = [opt.label, opt.tier].join(' ').toLowerCase();
        const classes = opt.classes || [];

        const isNsaidOnly = classes.includes('nsaid') && !classes.includes('analgesic_non_opioid');
        const isAnalgesicOnly = classes.includes('analgesic_non_opioid') && !classes.includes('nsaid');
        const isNsaidPickList = isNsaidOnly
          || (/\\baine\\b|nsaid/.test(label) && /escolha (um|uma|apresent)/.test(label));
        const isAnalgesicPickList = isAnalgesicOnly
          || (/analgesico simples|analges simples/.test(label) && /escolha (um|uma|apresent)/.test(label));

        if (isNsaidOnly && analgesicCount > 0) {
          crossClass++;
          issues.push(cond.id + ' | ' + opt.id + ': AINE-only option has analgesics');
        }
        if (isAnalgesicOnly && nsaidCount > 0) {
          crossClass++;
          issues.push(cond.id + ' | ' + opt.id + ': analgesic-only option has AINEs');
        }
        if (isNsaidPickList && nsaidCount > 0 && nsaidCount < nsaidFull) {
          nsaidPartial++;
          issues.push(cond.id + ' | ' + opt.id + ': AINE ' + nsaidCount + '/' + nsaidFull);
        }
        if (isAnalgesicPickList && analgesicCount > 0 && analgesicCount < analgesicFull) {
          analgesicPartial++;
          issues.push(cond.id + ' | ' + opt.id + ': analgesico ' + analgesicCount + '/' + analgesicFull);
        }

        if (cond.id === 'amigdalite-bacteriana' && opt.id === 'amig-sint-analgesic') {
          if (nsaidCount > 0) issues.push('amigdalite analgesic option must not include AINE');
          if (analgesicCount !== analgesicFull) issues.push('amigdalite analgesic incomplete: ' + analgesicCount);
        }
        if (cond.id === 'amigdalite-bacteriana' && opt.id === 'amig-sint-aine') {
          if (analgesicCount > 0) issues.push('amigdalite AINE option must not include analgesics');
          if (nsaidCount !== nsaidFull) issues.push('amigdalite AINE incomplete: ' + nsaidCount);
        }
      });
    });
  });

  return { total: catalog.length, expanded, nsaidPartial, analgesicPartial, crossClass, issues };
})()`, sandbox);

console.log('Condições:', result.total);
console.log('Opções expandidas:', result.expanded);
console.log('AINE incompletas:', result.nsaidPartial);
console.log('Analgésico incompletas:', result.analgesicPartial);
console.log('Mistura analgésico+AINE indevida:', result.crossClass);
if (result.issues.length) {
  console.log('\nFalhas:');
  result.issues.slice(0, 30).forEach(i => console.log(' -', i));
  process.exitCode = 1;
} else {
  console.log('OK — expansão completa e classes separadas.');
}
