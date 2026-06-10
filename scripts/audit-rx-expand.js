/* Audita expansão VO em todas as condições do receituário */
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

  catalog.forEach(cond => {
    cond.groups.forEach(g => {
      g.options.forEach(opt => {
        if (opt._voExpanded) expanded++;
        const meds = rxGetOptionMeds(opt, g.label);
        const nsaidCount = meds.filter(m => (m.classes || []).includes('nsaid')).length;
        const analgesicCount = meds.filter(m => (m.classes || []).includes('analgesic_non_opioid')).length;
        const label = [g.label, opt.label, opt.tier].join(' ').toLowerCase();
        const isNsaidOption = /aine|nsaid|ibuprofeno|naproxeno|diclofenac|cetoprofeno|nimesulid/.test(label)
          || (opt.classes || []).includes('nsaid');
        const isAnalgesicOption = /analges|dipirona|paracetamol/.test(label)
          || (opt.classes || []).includes('analgesic_non_opioid');

        if (isNsaidOption && nsaidCount > 0 && nsaidCount < nsaidFull) {
          nsaidPartial++;
          issues.push(cond.id + ' | ' + opt.id + ': AINE ' + nsaidCount + '/' + nsaidFull);
        }
        if (isAnalgesicOption && analgesicCount > 0 && analgesicCount < analgesicFull) {
          analgesicPartial++;
          issues.push(cond.id + ' | ' + opt.id + ': analgesico ' + analgesicCount + '/' + analgesicFull);
        }
      });
    });
  });

  return { total: catalog.length, expanded, nsaidPartial, analgesicPartial, issues };
})()`, sandbox);

console.log('Condições no catálogo:', result.total);
console.log('Opções pré-expandidas (_voExpanded):', result.expanded);
console.log('Opções AINE incompletas:', result.nsaidPartial);
console.log('Opções analgésico incompletas:', result.analgesicPartial);
if (result.issues.length) {
  console.log('\nPrimeiras 25 falhas:');
  result.issues.slice(0, 25).forEach(i => console.log(' -', i));
  process.exitCode = 1;
} else {
  console.log('OK — todas as opções AINE/analgésico detectadas estão completas.');
}
