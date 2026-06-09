/* Prescrições PS — fármacos, aliases e parser automático dos protocolos */

const PS_DRUG_META = {
  dipirona: { name: 'Dipirona', classes: ['analgesic'] },
  paracetamol: { name: 'Paracetamol', classes: ['analgesic'] },
  tramadol: { name: 'Tramadol', classes: ['opioid'] },
  morfina: { name: 'Morfina', classes: ['opioid'] },
  fentanil: { name: 'Fentanil', classes: ['opioid'] },
  meperidina: { name: 'Meperidina', classes: ['opioid'] },
  naproxeno: { name: 'Naproxeno', classes: ['nsaid'] },
  ibuprofeno: { name: 'Ibuprofeno', classes: ['nsaid'] },
  diclofenaco: { name: 'Diclofenaco', classes: ['nsaid'], forbiddenRoutes: ['EV'] },
  cetoprofeno: { name: 'Cetoprofeno', classes: ['nsaid'], forbiddenRoutes: ['EV'] },
  ketorolaco: { name: 'Ketorolaco', classes: ['nsaid'] },
  tenoxicam: { name: 'Tenoxicam', classes: ['nsaid'], forbiddenRoutes: ['EV'] },
  nimesulida: { name: 'Nimesulida', classes: ['nsaid'] },
  aspirina: { name: 'AAS', classes: ['nsaid', 'antiplatelet'] },
  sumatriptano: { name: 'Sumatriptano', classes: ['triptan'] },
  zolmitriptano: { name: 'Zolmitriptano', classes: ['triptan'] },
  metoclopramida: { name: 'Metoclopramida', classes: ['antiemetic'] },
  ondansetrona: { name: 'Ondansetrona', classes: ['antiemetic'] },
  dimenidrinato: { name: 'Dimenidrinato', classes: ['antivertigo'] },
  prometazina: { name: 'Prometazina', classes: ['antiemetic', 'antihistamine'] },
  dexametasona: { name: 'Dexametasona', classes: ['corticosteroid'] },
  prednisona: { name: 'Prednisona', classes: ['corticosteroid'] },
  prednisolona: { name: 'Prednisolona', classes: ['corticosteroid'] },
  metilprednisolona: { name: 'Metilprednisolona', classes: ['corticosteroid'] },
  hidrocortisona: { name: 'Hidrocortisona', classes: ['corticosteroid'] },
  ciclobenzaprina: { name: 'Ciclobenzaprina', classes: ['muscle_relaxant'] },
  oxigenio: { name: 'Oxigênio', classes: ['non_drug'] },
  verapamil: { name: 'Verapamil', classes: ['ccb'] },
  amlodipino: { name: 'Anlodipino', classes: ['ccb'] },
  captopril: { name: 'Captopril', classes: ['acei'] },
  enalapril: { name: 'Enalapril', classes: ['acei'] },
  losartana: { name: 'Losartana', classes: ['arb'] },
  hidralazina: { name: 'Hidralazina', classes: ['vasodilator'] },
  labetalol: { name: 'Labetalol', classes: ['beta_blocker'] },
  propranolol: { name: 'Propranolol', classes: ['beta_blocker'] },
  metoprolol: { name: 'Metoprolol', classes: ['beta_blocker'] },
  nitroglicerina: { name: 'Nitroglicerina', classes: ['vasodilator'] },
  furosemida: { name: 'Furosemida', classes: ['diuretic'] },
  adrenalina: { name: 'Adrenalina', classes: ['vasopressor'] },
  noradrenalina: { name: 'Noradrenalina', classes: ['vasopressor'] },
  difenidramina: { name: 'Difenidramina', classes: ['antihistamine'] },
  loratadina: { name: 'Loratadina', classes: ['antihistamine'] },
  salbutamol: { name: 'Salbutamol', classes: ['bronchodilator'] },
  ipratropio: { name: 'Ipatrópio', classes: ['bronchodilator'] },
  aminofilina: { name: 'Aminofilina', classes: ['bronchodilator'] },
  sulfato_magnesio: { name: 'Sulfato de magnésio', classes: ['electrolyte'] },
  diazepam: { name: 'Diazepam', classes: ['benzodiazepine'] },
  midazolam: { name: 'Midazolam', classes: ['benzodiazepine'] },
  lorazepam: { name: 'Lorazepam', classes: ['benzodiazepine'] },
  clonazepam: { name: 'Clonazepam', classes: ['benzodiazepine'] },
  fenitoina: { name: 'Fenitoína', classes: ['anticonvulsant'] },
  acido_valproico: { name: 'Ácido valpróico', classes: ['anticonvulsant'] },
  fenobarbital: { name: 'Fenobarbital', classes: ['anticonvulsant'] },
  ceftriaxona: { name: 'Ceftriaxona', classes: ['antibiotic', 'cephalosporin'] },
  cefotaxima: { name: 'Cefotaxima', classes: ['antibiotic', 'cephalosporin'] },
  cefalexina: { name: 'Cefalexina', classes: ['antibiotic', 'cephalosporin'] },
  cefazolina: { name: 'Cefazolina', classes: ['antibiotic', 'cephalosporin'] },
  ceftazidima: { name: 'Ceftazidima', classes: ['antibiotic', 'cephalosporin'] },
  oxacilina: { name: 'Oxacilina', classes: ['antibiotic', 'penicillin'] },
  ampicilina: { name: 'Ampicilina', classes: ['antibiotic', 'penicillin'] },
  amoxicilina: { name: 'Amoxicilina', classes: ['antibiotic', 'penicillin'] },
  amoxicilina_clavulanato: { name: 'Amoxicilina-clavulanato', classes: ['antibiotic', 'penicillin'] },
  ampicilina_sulbactam: { name: 'Ampicilina-sulbactam', classes: ['antibiotic', 'penicillin'] },
  piperacilina_tazobactam: { name: 'Piperacilina-tazobactam', classes: ['antibiotic', 'penicillin'] },
  penicilina_cristalina: { name: 'Penicilina cristalina', classes: ['antibiotic', 'penicillin'] },
  azitromicina: { name: 'Azitromicina', classes: ['antibiotic', 'macrolide'] },
  claritromicina: { name: 'Claritromicina', classes: ['antibiotic', 'macrolide'] },
  eritromicina: { name: 'Eritromicina', classes: ['antibiotic', 'macrolide'] },
  ciprofloxacino: { name: 'Ciprofloxacino', classes: ['antibiotic', 'fluoroquinolone'] },
  levofloxacino: { name: 'Levofloxacino', classes: ['antibiotic', 'fluoroquinolone'] },
  moxifloxacino: { name: 'Moxifloxacino', classes: ['antibiotic', 'fluoroquinolone'] },
  metronidazol: { name: 'Metronidazol', classes: ['antibiotic', 'antiprotozoal'] },
  clindamicina: { name: 'Clindamicina', classes: ['antibiotic', 'lincosamide'] },
  vancomicina: { name: 'Vancomicina', classes: ['antibiotic', 'glycopeptide'] },
  meropenem: { name: 'Meropenem', classes: ['antibiotic', 'carbapenem'] },
  imipenem: { name: 'Imipenem', classes: ['antibiotic', 'carbapenem'] },
  gentamicina: { name: 'Gentamicina', classes: ['antibiotic', 'aminoglycoside'] },
  amicacina: { name: 'Amicacina', classes: ['antibiotic', 'aminoglycoside'] },
  sulfametoxazol_trimetoprim: { name: 'Sulfametoxazol-trimetoprima', classes: ['antibiotic'] },
  doxiciclina: { name: 'Doxiciclina', classes: ['antibiotic', 'tetracycline'] },
  aciclovir: { name: 'Aciclovir', classes: ['antiviral'] },
  oseltamivir: { name: 'Oseltamivir', classes: ['antiviral'] },
  haloperidol: { name: 'Haloperidol', classes: ['antipsychotic'] },
  risperidona: { name: 'Risperidona', classes: ['antipsychotic'] },
  quetiapina: { name: 'Quetiapina', classes: ['antipsychotic'] },
  escopolamina: { name: 'Escopolamina', classes: ['antispasmodic'] },
  butilbrometo_escopolamina: { name: 'Butilbrometo de escopolamina', classes: ['antispasmodic'] },
  insulina: { name: 'Insulina', classes: ['antidiabetic'] },
  metformina: { name: 'Metformina', classes: ['antidiabetic'] },
  glicose: { name: 'Glicose', classes: ['antidiabetic'] },
  glucagon: { name: 'Glucagon', classes: ['antidiabetic'] },
  omeprazol: { name: 'Omeprazol', classes: ['ppi'] },
  pantoprazol: { name: 'Pantoprazol', classes: ['ppi'] },
  esomeprazol: { name: 'Esomeprazol', classes: ['ppi'] },
  ranitidina: { name: 'Ranitidina', classes: ['h2_blocker'] },
  clopidogrel: { name: 'Clopidogrel', classes: ['antiplatelet'] },
  heparina: { name: 'Heparina', classes: ['anticoagulant'] },
  enoxaparina: { name: 'Enoxaparina', classes: ['anticoagulant'] },
  warfarina: { name: 'Warfarina', classes: ['anticoagulant'] },
  rivaroxabana: { name: 'Rivaroxabana', classes: ['anticoagulant'] },
  naloxona: { name: 'Naloxona', classes: ['antidote'] },
  flumazenil: { name: 'Flumazenil', classes: ['antidote'] },
  atropina: { name: 'Atropina', classes: ['antidote'] },
  terlipressina: { name: 'Terlipressina', classes: ['vasopressor'] },
  octreotide: { name: 'Octreotide', classes: ['hormone'] },
  colchicina: { name: 'Colchicina', classes: ['antiinflammatory'] },
  alopurinol: { name: 'Alopurinol', classes: ['uricosuric'] },
  tiamina: { name: 'Tiamina', classes: ['vitamin'] },
  magnesio_sulfato: { name: 'Sulfato de magnésio (MgSO₄)', classes: ['electrolyte'] },
  potassio_cloreto: { name: 'Cloreto de potássio', classes: ['electrolyte'] },
  gluconato_calcio: { name: 'Gluconato de cálcio', classes: ['electrolyte'] },
  bicarbonato: { name: 'Bicarbonato de sódio', classes: ['electrolyte'] },
  manitol: { name: 'Manitol', classes: ['osmotic'] },
  artesunato: { name: 'Artesunato', classes: ['antimalarial'] },
  quinina: { name: 'Quinina', classes: ['antimalarial'] },
  hidroxicloroquina: { name: 'Hidroxicloroquina', classes: ['antimalarial'] },
  tiamazol: { name: 'Tiamazol', classes: ['antithyroid'] },
  propiltiouracil: { name: 'Propiltiouracil', classes: ['antithyroid'] },
  levotiroxina: { name: 'Levotiroxina', classes: ['thyroid_hormone'] },
  tamsulosina: { name: 'Tamsulosina', classes: ['alpha_blocker', 'discharge_only'] }
};

const PS_DRUG_ALIASES = [
  ['amoxicilina_clavulanato', ['amoxicilina-clavulanato', 'amoxicilina clavulanato', 'clavulin']],
  ['ampicilina_sulbactam', ['ampicilina-sulbactam', 'ampicilina sulbactam', 'unasyn']],
  ['piperacilina_tazobactam', ['piperacilina-tazobactam', 'piperacilina tazobactam', 'tazocin']],
  ['penicilina_cristalina', ['penicilina cristalina', 'penicilina g', 'benzilpenicilina']],
  ['sulfato_magnesio', ['sulfato de magnésio', 'sulfato de magnesio', 'mgso4', 'mgso₄']],
  ['magnesio_sulfato', ['sulfato de magnésio', 'mgso4']],
  ['butilbrometo_escopolamina', ['butilbrometo de escopolamina', 'buscopan']],
  ['sulfametoxazol_trimetoprim', ['sulfametoxazol-trimetoprima', 'sulfametoxazol + trimetoprima', 'bactrim']],
  ['acido_valproico', ['ácido valpróico', 'acido valproico', 'valproato']],
  ['amoxicilina_clavulanato', ['875/125']],
  ['aspirina', ['aas ', ' aas', 'aspirina', 'ácido acetilsalicílico']],
  ['oxigenio', ['o₂', 'o2 100', 'oxigênio', 'oxigenio']],
  ['dipirona', ['dipirona', 'novalgina', 'metamizol']],
  ['paracetamol', ['paracetamol', 'acetaminofen']],
  ['sumatriptano', ['sumatriptano', 'imigran']],
  ['zolmitriptano', ['zolmitriptano']],
  ['ceftriaxona', ['ceftriaxona', 'rocefin']],
  ['metilprednisolona', ['metilprednisolona', 'solumedrol']],
  ['piperacilina_tazobactam', ['piperacilina-tazobactam', 'piperacilina tazobactam']],
  ['enoxaparina', ['enoxaparina', 'clexane']],
  ['clopidogrel', ['clopidogrel', 'plavix']],
  ['ipratropio', ['ipratrópio', 'ipratropio', 'atrovent']],
  ['potassio_cloreto', ['kcl', 'cloreto de potássio', 'cloreto de potassio']],
  ['gluconato_calcio', ['gluconato de cálcio', 'gluconato de calcio']],
  ['artesunato', ['artesunato', 'artesunate']],
  ['magnesio_sulfato', ['sulfato de magnésio ev', 'mgso4']],
  ['tamsulosina', ['tamsulosina', 'cloridrato de tamsulosina']]
];

Object.keys(PS_DRUG_META).forEach(id => {
  if (!PS_DRUG_ALIASES.some(a => a[0] === id)) {
    PS_DRUG_ALIASES.push([id, [PS_DRUG_META[id].name.toLowerCase(), id.replace(/_/g, ' ')]]);
  }
});

PS_DRUG_ALIASES.sort((a, b) => {
  const la = Math.max(...a[1].map(s => s.length));
  const lb = Math.max(...b[1].map(s => s.length));
  return lb - la;
});

const PS_PENICILLIN_CLASS = ['penicillin'];
const PS_CEPHALOSPORIN_CLASS = ['cephalosporin'];

/** Combinação fixa já inclui o fármaco base — não prescrever junto */
const PS_DRUG_CONTAINS = {
  amoxicilina_clavulanato: ['amoxicilina'],
  ampicilina_sulbactam: ['ampicilina'],
  piperacilina_tazobactam: ['piperacilina']
};

/** Subclasses de ATB — no máximo um fármaco por subclasse na mesma prescrição */
const PS_ATB_SUBCLASSES = [
  'penicillin', 'cephalosporin', 'macrolide', 'fluoroquinolone',
  'carbapenem', 'aminoglycoside', 'lincosamide', 'glycopeptide', 'tetracycline'
];

/** Pares de ATB com sinergia/indicação documentada em protocolos de PS */
const PS_VALID_ATB_PAIRS = [
  ['amoxicilina', 'azitromicina'],
  ['amoxicilina', 'claritromicina'],
  ['amoxicilina_clavulanato', 'azitromicina'],
  ['amoxicilina_clavulanato', 'claritromicina'],
  ['ampicilina', 'gentamicina'],
  ['ampicilina', 'azitromicina'],
  ['ceftriaxona', 'azitromicina'],
  ['ceftriaxona', 'claritromicina'],
  ['ceftriaxona', 'metronidazol'],
  ['ceftriaxona', 'clindamicina'],
  ['cefotaxima', 'azitromicina'],
  ['cefotaxima', 'metronidazol'],
  ['cefotaxima', 'clindamicina'],
  ['ceftazidima', 'metronidazol'],
  ['piperacilina_tazobactam', 'metronidazol'],
  ['piperacilina_tazobactam', 'vancomicina'],
  ['meropenem', 'metronidazol'],
  ['imipenem', 'metronidazol'],
  ['vancomicina', 'ceftriaxona'],
  ['vancomicina', 'cefotaxima'],
  ['vancomicina', 'cefazolina'],
  ['vancomicina', 'ampicilina'],
  ['vancomicina', 'meropenem'],
  ['clindamicina', 'metronidazol'],
  ['clindamicina', 'ceftriaxona'],
  ['clindamicina', 'cefotaxima'],
  ['ciprofloxacino', 'metronidazol'],
  ['levofloxacino', 'metronidazol'],
  ['moxifloxacino', 'metronidazol'],
  ['oxacilina', 'gentamicina'],
  ['oxacilina', 'amicacina'],
  ['gentamicina', 'ampicilina'],
  ['gentamicina', 'penicilina_cristalina']
];

function psPairKey (a, b) {
  return [a, b].sort().join('|');
}

function psIsValidAntibioticPair (a, b) {
  return PS_VALID_ATB_PAIRS.some(([x, y]) => psPairKey(x, y) === psPairKey(a, b));
}

function psIsValidAntibioticCombination (drugIds) {
  const ids = [...new Set(drugIds)];
  if (ids.length <= 1) return true;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (!psIsValidAntibioticPair(ids[i], ids[j])) return false;
    }
  }
  return true;
}

function psUniqueAntibioticIds (drugs) {
  return [...new Set(
    drugs
      .filter(d => (PS_DRUG_META[d.id]?.classes || []).includes('antibiotic'))
      .map(d => d.id)
  )];
}

function psMedHasAntibiotic (med) {
  return med && Array.isArray(med.drugs) &&
    med.drugs.some(d => (PS_DRUG_META[d.id]?.classes || []).includes('antibiotic'));
}

/** Linhas do protocolo mutuamente excludentes (não combinar na mesma prescrição) */
const PS_EXCLUSIVE_TIER_KEYS = [
  { key: 'primeira', label: '1ª linha', test: t => /1ª linha/i.test(t) },
  { key: 'alternativa', label: 'alternativa', test: t => /alternativa|resist/i.test(t) },
  { key: 'alergico', label: 'alérgico', test: t => /alerg/i.test(t) },
  { key: 'refractario', label: 'refractário', test: t => /refract|refrat/i.test(t) },
  { key: 'evitar', label: 'evitar', test: t => /evitar/i.test(t) },
  { key: 'segunda', label: '2ª linha', test: t => /2ª linha/i.test(t) }
];

const PS_THERAPY_TYPE_LABELS = {
  antibiotic: 'antibiótico',
  analgesia: 'analgesia',
  supportive: 'suporte sintomático',
  respiratory: 'tratamento respiratório',
  allergy: 'anti-alérgico',
  other: 'terapia'
};

function psGetExclusiveTierKeys (med) {
  const t = (med && med.tier) || '';
  return PS_EXCLUSIVE_TIER_KEYS.filter(x => x.test(t)).map(x => x.key);
}

function psMedDrugClasses (med) {
  const classes = new Set();
  if (!med || !Array.isArray(med.drugs)) return classes;
  med.drugs.forEach(d => {
    (PS_DRUG_META[d.id]?.classes || []).forEach(c => classes.add(c));
  });
  return classes;
}

function psMedTherapyType (med) {
  const classes = psMedDrugClasses(med);
  if (classes.has('antibiotic')) return 'antibiotic';
  if (['analgesic', 'nsaid', 'opioid'].some(c => classes.has(c))) return 'analgesia';
  if (['antispasmodic', 'antiemetic', 'antivertigo'].some(c => classes.has(c))) return 'supportive';
  if (['bronchodilator', 'corticosteroid'].some(c => classes.has(c))) return 'respiratory';
  if (classes.has('antihistamine')) return 'allergy';
  return 'other';
}

function psUniqueDrugIdsByClass (drugs, className) {
  return [...new Set(
    drugs
      .filter(d => (PS_DRUG_META[d.id]?.classes || []).includes(className))
      .map(d => d.id)
  )];
}

function psNormText (text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function psExtractDrugsFromText (text) {
  const norm = psNormText(text);
  const found = [];
  PS_DRUG_ALIASES.forEach(([id, patterns]) => {
    if (patterns.some(p => norm.includes(psNormText(p)))) {
      if (!found.includes(id)) found.push(id);
    }
  });
  return found;
}

function psParseTier (text) {
  const m = text.match(/^(1ª linha|Alternativa(?:[^:]*)?|Alérgico(?:[^:]*)?|Refractário|Refratário|Evitar(?:[^:]*)?|Sintomático|Adjuvante|Profilaxia|2ª linha|ATB|Analgesia)[^:]*:\s*/i);
  if (!m) return { tier: 'Opção', label: text };
  let tier = m[1].split('/')[0].trim();
  if (/refrat/i.test(tier)) tier = 'Refractário';
  if (/alerg/i.test(tier)) tier = 'Alérgico';
  if (/1ª/i.test(tier)) tier = '1ª linha';
  const label = text.replace(m[0], '').trim() || text;
  return { tier, label };
}

function psParseMedOptionsFromHtml (conditionId, html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const items = [];
  div.querySelectorAll('.ps-med-options li').forEach((li, idx) => {
    const text = li.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const { tier, label } = psParseTier(text);
    items.push({
      id: `${conditionId}-opt-${idx}`,
      tier,
      label: label.length > 240 ? label.slice(0, 237) + '…' : label,
      drugs: psExtractDrugsFromText(text).map(id => ({ id }))
    });
  });
  return items;
}

function psStandardContextFields (conditionId) {
  const fields = [
    { id: 'gestante', label: 'Gestante', type: 'checkbox' },
    { id: 'drc', label: 'Doença renal crônica / IRA', type: 'checkbox' },
    { id: 'alergia_aine', label: 'Alergia a AINE/AAS', type: 'checkbox' },
    { id: 'alergia_penicilina', label: 'Alergia grave à penicilina', type: 'checkbox' },
    { id: 'plaquetopenia', label: 'Plaquetopenia / risco hemorrágico', type: 'checkbox' }
  ];
  if (['dengue', 'chikungunya'].includes(conditionId)) {
    fields.push({ id: 'dengue_fase_critica', label: 'Dengue — fase crítica ou grupo C/D', type: 'checkbox' });
  }
  return fields;
}

function psGenericInteractiveRules () {
  return [
    {
      check: ({ selectedMedIds, config }) => {
        for (const id of selectedMedIds) {
          const med = config.medications.find(m => m.id === id);
          if (med && /evitar/i.test(med.tier || '')) {
            return { severity: 'error', text: `Opção marcada como EVITAR no protocolo: "${med.label.slice(0, 100)}…"` };
          }
        }
        return null;
      }
    },
    {
      check: ({ selectedMedIds, config }) => {
        const firstLine = config.medications.filter(m => /1ª linha/i.test(m.tier || '')).map(m => m.id);
        if (!firstLine.length || !selectedMedIds.length) return null;
        const hasFirst = selectedMedIds.some(id => firstLine.includes(id));
        const onlyAlt = selectedMedIds.every(id => {
          const med = config.medications.find(m => m.id === id);
          return med && !/1ª linha/i.test(med.tier || '');
        });
        if (onlyAlt && selectedMedIds.length === 1) {
          return { severity: 'warning', text: 'Nenhuma opção de 1ª linha selecionada — confirme se há contraindicação ou resistência.' };
        }
        if (hasFirst && selectedMedIds.length === 1) {
          return { severity: 'ok', text: 'Inclui medicação de 1ª linha do protocolo.' };
        }
        return null;
      }
    },
    {
      check: ({ selectedMedIds }) => {
        if (selectedMedIds.length >= 3) {
          return {
            severity: 'warning',
            text: 'Três ou mais opções marcadas — confirme se não está combinando linhas alternativas do protocolo.'
          };
        }
        return null;
      }
    }
  ];
}

function psMergeContextFields (custom, standard) {
  const map = {};
  standard.forEach(f => { map[f.id] = f; });
  (custom || []).forEach(f => { map[f.id] = f; });
  return Object.values(map);
}

function psGetInteractiveConfig (conditionId) {
  const custom = typeof PS_INTERACTIVE !== 'undefined' ? PS_INTERACTIVE[conditionId] : null;
  const html = typeof PS_CONTENT !== 'undefined' ? PS_CONTENT[conditionId] : null;

  if (custom && custom.medications && custom.medications.length && !custom.useAutoMeds) {
    return {
      ...custom,
      contextFields: psMergeContextFields(custom.contextFields, psStandardContextFields(conditionId)),
      rules: [...(custom.rules || []), ...psGenericInteractiveRules()]
    };
  }

  if (!html) return custom || null;

  const autoMeds = psParseMedOptionsFromHtml(conditionId, html);
  if (!autoMeds.length) return custom || null;

  return {
    auto: true,
    contextFields: psMergeContextFields(custom && custom.contextFields, psStandardContextFields(conditionId)),
    medications: autoMeds,
    groups: custom && custom.groups,
    idealFor: custom && custom.idealFor,
    acceptableFor: custom && custom.acceptableFor,
    subtypeLabels: custom && custom.subtypeLabels,
    requiredContext: custom && custom.requiredContext,
    rules: [...(custom && custom.rules || []), ...psGenericInteractiveRules()]
  };
}
