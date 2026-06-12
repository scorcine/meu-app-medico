#!/usr/bin/env node
/**
 * Conta rotas serverless expostas (limite Vercel Hobby ≈ 12).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const API_DIR = path.join(ROOT, 'api');
const HOBBY_LIMIT = 12;

function listHandlers (dir, prefix) {
  const out = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const rel = path.join(prefix, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listHandlers(full, rel));
      return;
    }
    if (!entry.name.endsWith('.js')) return;
    if (entry.name.startsWith('_')) return;
    out.push('/api/' + rel.replace(/\\/g, '/').replace(/\.js$/, ''));
  });
  return out.sort();
}

const handlers = listHandlers(API_DIR, '');
const helpers = fs.readdirSync(API_DIR).filter(f => f.startsWith('_') && f.endsWith('.js'));

console.log('=== MedHub — auditoria funções Vercel ===\n');
console.log('Handlers expostos:', handlers.length, '(limite Hobby:', HOBBY_LIMIT + ')');
handlers.forEach(h => console.log('  ', h));
console.log('\nHelpers (não contam):', helpers.length);
helpers.forEach(h => console.log('  api/' + h));

const headroom = HOBBY_LIMIT - handlers.length;
if (headroom < 0) {
  console.error('\nFAIL — excede limite Hobby em', Math.abs(headroom), 'função(ões).');
  process.exit(1);
}
console.log('\nOK — margem:', headroom, 'função(ões) antes do limite Hobby.');
if (headroom <= 1) {
  console.warn('Aviso: pouca margem — considere consolidar rotas antes de adicionar APIs.');
}
