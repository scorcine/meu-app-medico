#!/usr/bin/env node
/**
 * Completa o onboarding de perfil na nuvem (libera a tela Passo 2).
 *
 * Uso:
 *   node scripts/complete-onboarding.js --email user@email.com --name "Nome" --type student
 *   node scripts/complete-onboarding.js --email user@email.com --name "Nome" --type doctor --uf SP --crm 123456
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function loadEnv (file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  fs.readFileSync(p, 'utf8').split(/\r?\n/).forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i < 1) return;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

['.env.production.local', '.env.local', '.env'].forEach(loadEnv);

function parseArgs () {
  const args = process.argv.slice(2);
  const out = { type: 'student', uf: 'SP', crm: '' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) out.email = args[++i];
    else if (args[i] === '--name' && args[i + 1]) out.name = args[++i];
    else if (args[i] === '--type' && args[i + 1]) out.type = args[++i];
    else if (args[i] === '--uf' && args[i + 1]) out.uf = args[++i];
    else if (args[i] === '--crm' && args[i + 1]) out.crm = args[++i];
  }
  return out;
}

const { normalizeEmail } = require('../api/_auth');
const { getUser } = require('../api/_users');
const { saveProfessionalProfile, publicProfile } = require('../api/_profile');

(async () => {
  const opts = parseArgs();
  const email = normalizeEmail(opts.email);
  if (!email) throw new Error('Informe --email');
  const user = await getUser(email);
  if (!user) throw new Error('Usuário não encontrado: ' + email);

  const userType = opts.type === 'doctor' ? 'doctor' : 'student';
  const name = String(opts.name || user.name || '').trim();
  if (!name) throw new Error('Informe --name');
  if (userType === 'doctor' && !String(opts.crm || '').replace(/\D/g, '')) {
    throw new Error('Médico precisa de --crm');
  }

  const profile = await saveProfessionalProfile(email, {
    rxDisplayName: name,
    userType,
    crmUf: userType === 'doctor' ? String(opts.uf || 'SP').toUpperCase() : 'SP',
    crmNumber: userType === 'doctor' ? String(opts.crm || '').replace(/\D/g, '') : '',
    onboardingComplete: true
  }, { user, sessionName: user.name });

  console.log(JSON.stringify({ ok: true, email, profile: publicProfile(profile) }, null, 2));
})().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
