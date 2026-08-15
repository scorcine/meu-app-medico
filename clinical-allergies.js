/* Alergias do paciente ativo — filtra opções de prescrição */

const MEDHUB_ACTIVE_PACIENTE_ALERGIAS = 'medhub-active-paciente-alergias';
const MEDHUB_ACTIVE_ENCOUNTER = 'medhub-active-encounter';

/** Normalização local (embed não carrega clinical-storage.js) */
function clinicalAllergyNorm (text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

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
  if (typeof currentThConditionId !== 'undefined' && currentThConditionId &&
      typeof showTratamentoHospitalarConditions === 'function' &&
      document.getElementById('section-tratamento-hospitalar')?.classList.contains('active')) {
    showTratamentoHospitalarConditions(String(currentThConditionId).split(','), { skipGate: true });
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
  const norm = clinicalAllergyNorm(raw);
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
    if (rule.keywords.some(k => norm.includes(clinicalAllergyNorm(k)))) {
      (rule.classes || []).forEach(c => blockedClasses.add(c));
      (rule.ids || []).forEach(id => blockedIds.add(id));
    }
  });

  tokens.forEach(token => {
    CLINICAL_ALLERGY_RULES.forEach(rule => {
      if (rule.keywords.some(k => clinicalAllergyNorm(k).includes(token) || token.includes(clinicalAllergyNorm(k)))) {
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
  const hay = clinicalAllergyNorm([
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

const MEDHUB_ALLERGY_ASKED = 'medhub-allergy-asked-session';

function clinicalAllergyWasAsked () {
  return sessionStorage.getItem(MEDHUB_ALLERGY_ASKED) === '1' || clinicalHasActiveEncounter();
}

function clinicalMarkAllergyAsked () {
  sessionStorage.setItem(MEDHUB_ALLERGY_ASKED, '1');
  clinicalBeginEncounter();
}

/** Painel compacto para colar no topo de TH / tratamento para casa */
function clinicalAllergyPanelHtml (inputId) {
  const id = inputId || 'clinical-allergy-input';
  const current = clinicalGetActiveAllergyText();
  const nega = !current || clinicalParseAllergyText(current).none;
  return `
    <div class="clinical-allergy-panel" data-allergy-panel>
      <p class="clinical-allergy-panel-title"><strong>Alergia medicamentosa?</strong> Obrigatório antes de escolher medicações.</p>
      <div class="clinical-allergy-panel-row">
        <label class="clinical-allergy-nega">
          <input type="checkbox" data-allergy-nega ${nega && clinicalAllergyWasAsked() ? 'checked' : ''}>
          Nega alergias
        </label>
        <input type="text" id="${id}" class="clinical-allergy-input" data-allergy-input
          placeholder="Ex.: penicilina, dipirona, AINE…"
          value="${nega ? '' : String(current).replace(/"/g, '&quot;')}"
          ${nega && clinicalAllergyWasAsked() ? 'disabled' : ''}>
      </div>
    </div>`;
}

function clinicalBindAllergyPanel (root, onChange) {
  if (!root) return;
  const panel = root.querySelector('[data-allergy-panel]') || root;
  if (panel.dataset.allergyPanelBound) return;
  panel.dataset.allergyPanelBound = '1';

  const nega = panel.querySelector('[data-allergy-nega]');
  const input = panel.querySelector('[data-allergy-input]');
  if (!nega || !input) return;

  const apply = () => {
    clinicalMarkAllergyAsked();
    if (nega.checked) {
      input.value = '';
      input.disabled = true;
      clinicalSetActiveAllergies('Nega alergias');
    } else {
      input.disabled = false;
      clinicalSetActiveAllergies(input.value || '');
    }
    if (typeof onChange === 'function') onChange();
  };

  nega.addEventListener('change', apply);
  input.addEventListener('change', apply);
  input.addEventListener('blur', apply);
}

/**
 * Garante que o usuário respondeu sobre alergia antes de seguir.
 * Resolve true se pode continuar.
 */
function clinicalEnsureAllergyGate (opts) {
  const options = opts || {};
  if (clinicalAllergyWasAsked() && (clinicalGetActiveAllergyText() || options.allowEmpty)) {
    return Promise.resolve(true);
  }

  return new Promise(resolve => {
    let modal = document.getElementById('clinical-allergy-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'clinical-allergy-modal';
      modal.className = 'clinical-allergy-modal';
      modal.hidden = true;
      modal.innerHTML = `
        <div class="clinical-allergy-modal-backdrop" data-allergy-cancel></div>
        <div class="clinical-allergy-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="clinical-allergy-modal-title">
          <h3 id="clinical-allergy-modal-title">Alergia medicamentosa</h3>
          <p class="muted">Antes de ver as opções de tratamento, informe se o paciente tem alergia.</p>
          <label class="clinical-allergy-nega">
            <input type="checkbox" id="clinical-allergy-modal-nega">
            Nega alergias
          </label>
          <label for="clinical-allergy-modal-input" class="ps-search-label">Quais alergias?</label>
          <input type="text" id="clinical-allergy-modal-input" class="ps-search clinical-allergy-input"
            placeholder="Ex.: penicilina, dipirona, AINE…">
          <div class="clinical-allergy-modal-actions">
            <button type="button" class="btn btn-secondary" data-allergy-cancel>Cancelar</button>
            <button type="button" class="btn" id="clinical-allergy-modal-ok">Continuar</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }

    const nega = document.getElementById('clinical-allergy-modal-nega');
    const input = document.getElementById('clinical-allergy-modal-input');
    const ok = document.getElementById('clinical-allergy-modal-ok');
    const current = clinicalGetActiveAllergyText();
    const parsed = clinicalParseAllergyText(current);
    nega.checked = !!(current && parsed.none);
    input.value = nega.checked ? '' : (current || '');
    input.disabled = nega.checked;
    modal.hidden = false;

    const cleanup = (result) => {
      modal.hidden = true;
      nega.onchange = null;
      ok.onclick = null;
      modal.querySelectorAll('[data-allergy-cancel]').forEach(el => { el.onclick = null; });
      resolve(result);
    };

    nega.onchange = () => {
      input.disabled = nega.checked;
      if (nega.checked) input.value = '';
    };

    ok.onclick = () => {
      if (!nega.checked && !input.value.trim()) {
        input.focus();
        input.placeholder = 'Informe a alergia ou marque “Nega alergias”';
        return;
      }
      clinicalMarkAllergyAsked();
      clinicalSetActiveAllergies(nega.checked ? 'Nega alergias' : input.value.trim());
      cleanup(true);
    };

    modal.querySelectorAll('[data-allergy-cancel]').forEach(el => {
      el.onclick = () => cleanup(false);
    });
  });
}

async function clinicalSyncActivePatientFromAnamnese () {
  const nome = document.getElementById('anam-paciente')?.value?.trim();
  const alergias = document.getElementById('anam-alergias')?.value?.trim() || '';
  if (nome || alergias) clinicalBeginEncounter();
  if (alergias) clinicalSetActiveAllergies(alergias);
  if (!nome || typeof pacientesLoadAll !== 'function') return;
  const list = await pacientesLoadAll();
  const p = list.find(x => clinicalAllergyNorm(x.nome) === clinicalAllergyNorm(nome));
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
