#!/usr/bin/env node
/**
 * Testes unitários — perfil profissional e sessão única.
 * node scripts/test-profile-auth.js
 */

const {
  normalizeProfile,
  identityConfigured
} = require('../api/_profile');

const { sessionVersionValid } = require('../api/_auth');

let failures = 0;

function pass (msg) {
  console.log('  OK   ' + msg);
}

function fail (msg) {
  failures += 1;
  console.error('  FAIL ' + msg);
}

console.log('=== MedHub — perfil e sessão ===\n');

const empty = normalizeProfile(null, 'Dr Test');
if (empty.crmUf === 'SP' && empty.rxDisplayName === 'Dr Test') pass('default profile');
else fail('default profile');

const locked = normalizeProfile({
  rxDisplayName: 'Maria',
  crmNumber: '123456',
  crmUf: 'sp',
  identityLocked: true
});
if (locked.crmUf === 'SP' && locked.crmNumber === '123456' && identityConfigured(locked)) {
  pass('normalize CRM');
} else fail('normalize CRM');

if (sessionVersionValid({ email: 'a@b.com', sv: 2 }, { sessionVersion: 2 })) pass('session version match');
else fail('session version match');

if (!sessionVersionValid({ email: 'a@b.com', sv: 1 }, { sessionVersion: 2 })) pass('session version mismatch');
else fail('session version mismatch');

if (sessionVersionValid({ email: 'a@b.com' }, { sessionVersion: 1 })) pass('legacy token on v1');
else fail('legacy token on v1');

if (!sessionVersionValid({ email: 'a@b.com' }, { sessionVersion: 3 })) pass('legacy token rejected after rotation');
else fail('legacy token rejected after rotation');

console.log('');
if (failures) {
  console.error('Falhas: ' + failures);
  process.exit(1);
}
console.log('Todos os testes passaram.');
