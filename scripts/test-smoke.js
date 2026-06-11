/* Testes smoke — integridade de dados e auditorias clínicas */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
let failures = 0;

function pass (msg) {
  console.log('  OK  ' + msg);
}

function fail (msg) {
  console.error('  FALHA  ' + msg);
  failures += 1;
}

function loadDataCatalog (file, topicsVar, contentVar) {
  const code = fs.readFileSync(path.join(root, file), 'utf8');
  const out = {};
  vm.runInNewContext(
    code + `\nout.topics = ${topicsVar};\nout.content = ${contentVar};`,
    { out }
  );
  return out;
}

function checkTopicCatalog (label, file, topicsVar, contentVar) {
  let topics;
  let content;
  try {
    ({ topics, content } = loadDataCatalog(file, topicsVar, contentVar));
  } catch (err) {
    fail(label + ': erro ao carregar — ' + err.message);
    return;
  }
  if (!Array.isArray(topics) || topics.length === 0) {
    fail(label + ': lista vazia ou ausente');
    return;
  }
  const ids = new Set();
  topics.forEach(t => {
    if (!t.id || !t.name) fail(label + ': tópico sem id/nome');
    if (ids.has(t.id)) fail(label + ': id duplicado ' + t.id);
    ids.add(t.id);
    if (!content[t.id] || content[t.id].includes('construção')) {
      fail(label + ': conteúdo ausente para ' + t.id);
    }
    if (!t.html || t.html.includes('construção')) {
      fail(label + ': html não montado para ' + t.id);
    }
  });
  pass(label + ' — ' + topics.length + ' temas com conteúdo');
}

console.log('=== MedHub smoke tests ===\n');

console.log('Auditorias:');
['audit-prelaunch.js', 'audit-medicacoes-gaps.js'].forEach(script => {
  try {
    execSync('node scripts/' + script, { cwd: root, stdio: 'pipe' });
    pass(script);
  } catch (err) {
    const out = (err.stdout && err.stdout.toString()) || (err.stderr && err.stderr.toString()) || err.message;
    fail(script + '\n' + out.trim().split('\n').slice(-3).join('\n'));
  }
});

const manifestPath = path.join(root, 'medicacoes-sources', 'pipeline-manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.auditOk && manifest.auditGaps === 0) {
    pass('pipeline-manifest — auditOk, 0 gaps');
  } else {
    fail('pipeline-manifest — auditOk=' + manifest.auditOk + ', gaps=' + manifest.auditGaps);
  }
} else {
  fail('pipeline-manifest.json ausente');
}

console.log('\nCatálogos clínicos:');
checkTopicCatalog('Exames', 'exames-data.js', 'EXAMES_TOPICS', 'EXAMES_CONTENT');
checkTopicCatalog('Interpretação', 'interpretacao-exame-data.js', 'INTERP_TOPICS', 'INTERP_CONTENT');

console.log('\nArquivos essenciais:');
['app.html', 'index.html', 'login.html', 'pricing.html', 'termos.html', 'privacidade.html', 'subscribe-success.html', 'reset-password.html', 'auth-cloud.js', 'subscription.js', 'billing.js', 'app-showcase.js', 'legal-content.js', 'receituario.js', 'clinical-storage.js', 'backup.js', 'api/billing-config.js', 'api/create-checkout-session.js', 'api/verify-subscription.js', 'api/auth/config.js', 'api/auth/login.js', 'api/auth/register.js', 'api/auth/me.js'].forEach(f => {
  if (fs.existsSync(path.join(root, f))) pass(f);
  else fail('ausente: ' + f);
});

console.log('\n' + (failures ? failures + ' falha(s).' : 'Todos os testes passaram.'));
process.exit(failures ? 1 : 0);
