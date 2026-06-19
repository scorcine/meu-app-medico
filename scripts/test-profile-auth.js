#!/usr/bin/env node
/**
 * Testes unitários — perfil profissional e sessão única.
 * node scripts/test-profile-auth.js
 */

const {
  normalizeProfile,
  identityConfigured,
  profileOnboardingComplete,
  identityChanged,
  identityChangesRemaining,
  MAX_IDENTITY_CHANGES
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

const student = normalizeProfile({ userType: 'student', rxDisplayName: 'João' });
if (student.userType === 'student' && identityConfigured(student) && profileOnboardingComplete(student)) {
  pass('student onboarding complete');
} else fail('student onboarding complete');

const doctorPending = normalizeProfile({ userType: 'doctor', rxDisplayName: 'Ana' });
if (!profileOnboardingComplete(doctorPending)) pass('doctor needs CRM');
else fail('doctor needs CRM');

const doctorReady = normalizeProfile({
  userType: 'doctor',
  rxDisplayName: 'Ana',
  crmNumber: '999',
  crmUf: 'RJ'
});
if (profileOnboardingComplete(doctorReady) && identityConfigured(doctorReady)) {
  pass('doctor onboarding complete');
} else fail('doctor onboarding complete');

const flagged = normalizeProfile({
  userType: 'student',
  rxDisplayName: 'João',
  onboardingComplete: true
});
if (profileOnboardingComplete(flagged)) pass('onboardingComplete flag');
else fail('onboardingComplete flag');

const studentProfile = normalizeProfile({ userType: 'student', rxDisplayName: 'João' });
const doctorUpgrade = normalizeProfile({ userType: 'doctor', rxDisplayName: 'João', crmNumber: '123', crmUf: 'SP' });
if (identityChanged(studentProfile, doctorUpgrade)) pass('student to doctor is identity change');
else fail('student to doctor is identity change');

const usedOnce = normalizeProfile({ identityChangeCount: 1, identityLocked: true, userType: 'doctor', rxDisplayName: 'Ana', crmNumber: '1', crmUf: 'SP' });
if (identityChangesRemaining(usedOnce) === 1) pass('identity changes remaining');
else fail('identity changes remaining');

const usedTwice = normalizeProfile({ identityChangeCount: MAX_IDENTITY_CHANGES, identityLocked: true, userType: 'doctor', rxDisplayName: 'Ana', crmNumber: '1', crmUf: 'SP' });
if (identityChangesRemaining(usedTwice) === 0) pass('no identity changes remaining');
else fail('no identity changes remaining');

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
