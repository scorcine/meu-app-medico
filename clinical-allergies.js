/* Alergias do paciente ativo — filtra opções de prescrição */

const MEDHUB_ACTIVE_PACIENTE_ALERGIAS = 'medhub-active-paciente-alergias';
const MEDHUB_ACTIVE_ENCOUNTER = 'medhub-active-encounter';

const CLINICAL_ALLERGY_RULES = [
  {
    keywords: ['penicilina', 'penicillin', 'amoxicilina', 'ampicilina', 'clavulanato', 'clavulin', 'beta lactam', 'beta-lactam', 'beta lactamico'],
    classes: ['penicillin', 'penicillin_clavulanate', 'aminopenicillin']
  },
  {
    keywords: ['cefalosporina', 'cefalexina', 'ceftriaxona', 'cefuroxima', 'cefazolina', 'cefepime'],
    classes: ['cephalosporin']
  },
  {
    keywords: ['aine', 'aas', 'aspirina', 'aspirin', 'acetilsalicilico', 'ibuprofeno', 'diclofenaco', 'naproxeno', 'cetoprofeno', 'nimesulida', 'meloxicam', 'indometacina', 'piroxicam', 'artril', 'advil', 'voltaren'],
    classes: ['nsaid']
  },
  {
    keywords: ['dipirona', 'novalgina', 'm dipirona', 'metamizol'],
    ids: ['dipirona']
  },
  {
    keywords: ['sulfa', 'sulfametoxazol', 'sulfadiazina', 'bactrim', 'trimetoprima'],
    classes: ['sulfonamide']
  },
  {
    keywords: ['latex'],
    ids: []
  }
];

let _clinicalAllergyCache = null;

function clinicalInvalidateAllergyCache () {
  _clinicalAllergyCache = null;
}

function clinicalHasActiveEncounter () {
  return sessionStorage.getItem(MEDHUB_ACTIVE_ENCOUNTER) === '1';
}

function clinicalBeginEncounter (patient) {
  sessionStorage.setItem(MEDHUB_ACTIVE_ENCOUNTER, '1');
  if (patient) clinicalSetActivePatient(patient);
  else clinicalInvalidateAllergyCache();
}

function clinicalEndEncounter () {
  sessionStorage.removeItem(MEDHUB_ACTIVE_ENCOUNTER);
  sessionStorage.removeItem(MEDHUB_ACTIVE_PACIENTE_ALERGIAS);
  sessionStorage.removeItem('medhub-active-paciente-id');
  sessionStorage.removeItem('medhub-active-paciente');
  sessionStorage.removeItem('medhub-active-queixa');
  sessionStorage.removeItem('medhub-active-idade');
  clinicalInvalidateAllergyCache();
  clinicalRefreshAllergyUi();
}

function clinicalRefreshAllergyUi () {
  if (typeof medRefreshGrid === 'function' &&
      document.getElementById('section-medicacoes')?.classList.contains('active')) {
    medRefreshGrid();
  }
  if (typeof rxClearSelection === 'function' &&
      document.getElementById('section-receituario')?.classList.contains('active')) {
    rxClearSelection();
  }
}

function clinicalSetActivePatient (patient) {
  if (!patient) {
    sessionStorage.removeItem(MEDHUB_ACTIVE_PACIENTE_ALERGIAS);
    sessionStorage.removeItem('medhub-active-paciente');
    sessionStorage.removeItem('medhub-active-paciente-id');
    clinicalInvalidateAllergyCache();
    return;
  }
  sessionStorage.setItem(MEDHUB_ACTIVE_PACIENTE_ALERGIAS, (patient.alergias || '').trim());
  sessionStorage.setItem('medhub-active-paciente-id', patient.id || '');
  if (patient.nome) sessionStorage.setItem('medhub-active-paciente', patient.nome);
  clinicalInvalidateAllergyCache();
}

function clinicalSetActiveAllergies (text) {
  const val = (text || '').trim();
  sessionStorage.setItem(MEDHUB_ACTIVE_PACIENTE_ALERGIAS, val);
  if (val) clinicalBeginEncounter();
  clinicalInvalidateAllergyCache();
}

function clinicalGetActiveAllergyText () {
  if (!clinicalHasActiveEncounter()) return '';
  const anam = document.getElementById('anam-alergias')?.value?.trim();
  if (anam) return anam;
  const pac = document.getElementById('pac-alergias')?.value?.trim();
  if (pac && document.getElementById('section-pacientes')?.classList.contains('active')) return pac;
  return sessionStorage.getItem(MEDHUB_ACTIVE_PACIENTE_ALERGIAS) || '';
}

function clinicalParseAllergyText (text) {
  const raw = (text || '').trim();
  const norm = clinicalNorm(raw);
  if (!norm ||
    norm === 'nkda' ||
    norm.includes('sem alergia') ||
    norm.includes('nao tem alergia') ||
    norm.includes('nenhuma alergia') ||
    norm === 'negativa' ||
    norm === 'nao' ||
    norm === 'nega') {
    return { none: true, tokens: [], blockedClasses: new Set(), blockedIds: new Set(), raw };
  }

  const tokens = norm
    .split(/[,;\/\n]+|\s+\be\s+|\s+ou\s+/)
    .map(t => t.trim().replace(/^(alergia\s+(a|ao|as|aos)\s+)/, ''))
    .filter(t => t.length >= 3);

  const blockedClasses = new Set();
  const blockedIds = new Set();

  CLINICAL_ALLERGY_RULES.forEach(rule => {
    if (rule.keywords.some(k => norm.includes(clinicalNorm(k)))) {
      (rule.classes || []).forEach(c => blockedClasses.add(c));
      (rule.ids || []).forEach(id => blockedIds.add(id));
    }
  });

  tokens.forEach(token => {
    CLINICAL_ALLERGY_RULES.forEach(rule => {
      if (rule.keywords.some(k => clinicalNorm(k).includes(token) || token.includes(clinicalNorm(k)))) {
        (rule.classes || []).forEach(c => blockedClasses.add(c));
        (rule.ids || []).forEach(id => blockedIds.add(id));
      }
    });
  });

  return { none: false, tokens, blockedClasses, blockedIds, raw };
}

function clinicalGetAllergyProfile () {
  if (_clinicalAllergyCache) return _clinicalAllergyCache;
  _clinicalAllergyCache = clinicalParseAllergyText(clinicalGetActiveAllergyText());
  return _clinicalAllergyCache;
}

function clinicalDrugMeta (drug) {
  if (!drug) return { id: '', name: '', classes: [] };
  const id = drug.id || '';
  const name = drug.name || drug.label || drug.text || '';
  let classes = drug.classes || [];
  if ((!classes || !classes.length) && typeof PS_DRUG_META !== 'undefined' && id && PS_DRUG_META[id]) {
    classes = PS_DRUG_META[id].classes || [];
  }
  if ((!classes || !classes.length) && typeof rxInferMedClasses === 'function' && drug.text) {
    classes = rxInferMedClasses(drug.text);
  }
  return { id, name, classes: classes || [] };
}

function clinicalIsDrugBlocked (drug) {
  const profile = clinicalGetAllergyProfile();
  if (profile.none) return false;

  const meta = clinicalDrugMeta(drug);
  const hay = clinicalNorm([
    meta.id.replace(/_/g, ' '),
    meta.name,
    drug.text || '',
    drug.label || ''
  ].filter(Boolean).join(' '));

  if (profile.blockedIds.has(meta.id)) return true;

  for (const cls of meta.classes) {
    if (profile.blockedClasses.has(cls)) return true;
  }

  for (const token of profile.tokens) {
    if (token.length < 3) continue;
    if (hay.includes(token)) return true;
    const words = hay.split(/\s+/);
    if (words.some(w => w === token || (w.length >= 4 && token.length >= 4 && (w.includes(token) || token.includes(w))))) {
      return true;
    }
  }

  return false;
}

function clinicalFilterDrugsByAllergy (drugs) {
  return (drugs || []).filter(d => !clinicalIsDrugBlocked(d));
}

function clinicalGetPsContextFromAllergies () {
  const profile = clinicalGetAllergyProfile();
  if (profile.none) return {};
  const ctx = {};
  if (profile.blockedClasses.has('nsaid')) ctx.alergia_aine = true;
  if (profile.blockedClasses.has('penicillin') ||
    profile.blockedClasses.has('penicillin_clavulanate') ||
    profile.blockedClasses.has('aminopenicillin')) {
    ctx.alergia_penicilina = true;
  }
  return ctx;
}

function clinicalAllergyBannerHtml () {
  const profile = clinicalGetAllergyProfile();
  if (profile.none || !profile.raw) return '';
  return '<p class="clinical-allergy-banner" role="alert">' +
    '<strong>Alergias do paciente:</strong> ' + profile.raw +
    ' — medicamentos relacionados foram ocultados das opções.</p>';
}

async function clinicalSyncActivePatientFromAnamnese () {
  const nome = document.getElementById('anam-paciente')?.value?.trim();
  const alergias = document.getElementById('anam-alergias')?.value?.trim() || '';
  if (nome || alergias) clinicalBeginEncounter();
  if (alergias) clinicalSetActiveAllergies(alergias);
  if (!nome || typeof pacientesLoadAll !== 'function') return;
  const list = await pacientesLoadAll();
  const p = list.find(x => clinicalNorm(x.nome) === clinicalNorm(nome));
  if (p) {
    clinicalSetActivePatient({ ...p, alergias: alergias || p.alergias });
  } else if (alergias) {
    clinicalSetActiveAllergies(alergias);
  }
}

function clinicalBindAllergyInputs () {
  const bind = (id, handler) => {
    const el = document.getElementById(id);
    if (!el || el.dataset.allergyBound) return;
    el.dataset.allergyBound = '1';
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  };

  bind('anam-alergias', () => {
    clinicalSetActiveAllergies(document.getElementById('anam-alergias')?.value || '');
    if (typeof rxOnSectionShow === 'function' && document.getElementById('section-receituario')?.classList.contains('active')) {
      rxOnSectionShow();
    }
  });

  bind('anam-paciente', () => { clinicalSyncActivePatientFromAnamnese(); });

  bind('pac-alergias', () => {
    if (pacientesEditingId && typeof pacientesLoadAll === 'function') {
      pacientesLoadAll().then(list => {
        const p = list.find(x => x.id === pacientesEditingId);
        if (p) clinicalSetActivePatient({ ...p, alergias: document.getElementById('pac-alergias')?.value || '' });
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', clinicalBindAllergyInputs);
} else {
  clinicalBindAllergyInputs();
}
