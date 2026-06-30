#!/usr/bin/env node
/* Pipeline flashcards — export MD + import drafts existentes
 * Uso: node scripts/run-flashcards-pipeline.js [--topic sepse]
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { draftsDir, parseCliArgs } = require('./_flashcard-sources');

const scriptsDir = __dirname;

function run (script, extraArgs) {
  const r = spawnSync(process.execPath, [path.join(scriptsDir, script), ...extraArgs], {
    stdio: 'inherit',
    cwd: path.join(scriptsDir, '..')
  });
  if (r.status !== 0) process.exit(r.status || 1);
}

function main () {
  const args = parseCliArgs(process.argv);
  const passArgs = [];
  if (args.topic) passArgs.push('--topic', args.topic);
  else passArgs.push('--all');

  console.log('=== MedHub pipeline Flashcards ===\n');

  run('export-flashcard-sources.js', passArgs);

  const hasDrafts = fs.existsSync(draftsDir) &&
    fs.readdirSync(draftsDir).some(f => f.endsWith('.json') && !f.endsWith('.example.json'));

  const draftForTopic = args.topic &&
    fs.existsSync(path.join(draftsDir, `${args.topic}.json`));

  if (hasDrafts && (args.all || draftForTopic)) {
    console.log('\n--- Rascunho encontrado — importando ---\n');
    run('import-flashcard-draft.js', passArgs);
  } else {
    console.log('\nNenhum rascunho em drafts/ — gere JSON na Inner AI e salve em flashcards-sources/drafts/<tema>.json');
  }

  console.log('\nPipeline concluído.');
}

main();
