/* Apresentações comerciais VO (Brasil) — referência para receituário ambulatorial */

const MED_VO = {
  dipirona500: 'Dipirona 500 mg — 1 comprimido VO 6/6 horas, se dor',
  dipirona1g: 'Dipirona 1 g — 1 comprimido VO 6/6 horas, se dor',
  paracetamol500: 'Paracetamol 500 mg — 1 comprimido VO 6/6 horas, se dor',
  paracetamol750: 'Paracetamol 750 mg — 1 comprimido VO 6/6 horas, se dor',

  naproxeno500: 'Naproxeno 500 mg — 1 comprimido VO 12/12 horas',
  ibuprofeno200: 'Ibuprofeno 200 mg — 2 comprimidos VO 8/8 horas',
  ibuprofeno400: 'Ibuprofeno 400 mg — 1 comprimido VO 8/8 horas',
  ibuprofeno600: 'Ibuprofeno 600 mg — 1 comprimido VO 8/8 horas',
  diclofenaco50: 'Diclofenaco potássico 50 mg — 1 comprimido VO 8/8 horas',
  cetoprofeno50: 'Cetoprofeno 50 mg — 1 comprimido VO 12/12 horas',
  cetoprofeno100: 'Cetoprofeno 100 mg — 1 comprimido VO 12/12 horas',
  nimesulida100: 'Nimesulida 100 mg — 1 comprimido VO 12/12 horas',

  ciclobenzaprina5: 'Ciclobenzaprina 5 mg — 1 comprimido VO à noite',
  ciclobenzaprina10: 'Ciclobenzaprina 10 mg — 1 comprimido VO à noite',
  tizanidina2: 'Tizanidina 2 mg — 1 comprimido VO 8/8 horas',

  tramadol50: 'Tramadol 50 mg — 1 comprimido VO 6/6 horas, se dor intensa',

  sumatriptano50: 'Sumatriptano 50 mg — 1 comprimido VO ao início da crise (repetir 50 mg após 2 h; máx. 200 mg/dia)',
  sumatriptano100: 'Sumatriptano 100 mg — 1 comprimido VO ao início da crise (repetir 50 mg após 2 h; máx. 200 mg/dia)',
  sumatriptanoSc6: 'Sumatriptano 6 mg — 1 aplicação SC ao início da crise (repetir após 1 h se necessário; máx. 12 mg/24 h)',
  zolmitriptano25: 'Zolmitriptano 2,5 mg — 1 comprimido VO ao início da crise (pode repetir 2,5 mg após 2 h)',
  zolmitriptanoNas5: 'Zolmitriptano 5 mg — 1 spray nasal ao início da crise',

  metoclopramida10: 'Metoclopramida 10 mg — 1 comprimido VO junto ao triptano (náusea)',
  ondansetrona4: 'Ondansetrona 4 mg — 1 comprimido VO junto ao triptano (náusea)',
  ondansetrona8: 'Ondansetrona 8 mg — 1 comprimido VO junto ao triptano (náusea)',

  dexametasona4: 'Dexametasona 4 mg — 2 comprimidos VO dose única (8 mg total; profilaxia pós-crise)',

  propranolol40: 'Propranolol 40 mg — 1 comprimido VO 12/12 horas (ajustar conforme FC/PA)',
  topiramato25: 'Topiramato 25 mg — 1 comprimido VO à noite (titular gradualmente)',
  amitriptilina25: 'Amitriptilina 25 mg — 1 comprimido VO à noite',

  verapamil80: 'Verapamil 80 mg — 1 comprimido VO 8/8 horas (titular conforme tolerância e ECG)',
  verapamil120: 'Verapamil 120 mg — 1 comprimido VO 8/8 horas (titular conforme tolerância e ECG)',

  amoxicilina500: 'Amoxicilina 500 mg — 1 comprimido VO 8/8 horas, por 10 dias',
  amoxicilina875: 'Amoxicilina 875 mg — 1 comprimido VO 12/12 horas, por 10 dias',
  amoxClav875: 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO 12/12 horas, por 10 dias',
  amoxClav500: 'Amoxicilina + clavulanato 500/125 mg — 1 comprimido VO 8/8 horas, por 10 dias',

  fosfomicina3g: 'Fosfomicina trometamol 3 g — 1 envelope VO dose única (dissolver em meio copo de água)',
  nitrofurantoina100: 'Nitrofurantoína 100 mg — 1 comprimido VO 12/12 horas, por 5 dias',

  azitromicina500: 'Azitromicina 500 mg — 1 comprimido VO 24/24 horas, por 5 dias',
  clindamicina300: 'Clindamicina 300 mg — 1 comprimido VO 6/6 horas, por 10 dias',
  naproxeno250: 'Naproxeno 250 mg — 1 comprimido VO 12/12 horas, se dor'
};

/* Grupos de apresentações — fonte única para listar todas as opções VO */
const MED_VO_GROUPS = {
  analgesic_non_opioid: ['dipirona500', 'dipirona1g', 'paracetamol500', 'paracetamol750'],
  nsaid: ['naproxeno250', 'naproxeno500', 'ibuprofeno200', 'ibuprofeno400', 'ibuprofeno600', 'diclofenaco50', 'cetoprofeno50', 'cetoprofeno100', 'nimesulida100'],
  muscle_relaxant: ['ciclobenzaprina5', 'ciclobenzaprina10', 'tizanidina2'],
  triptan: ['sumatriptano50', 'sumatriptano100', 'sumatriptanoSc6', 'zolmitriptano25', 'zolmitriptanoNas5'],
  antiemetic: ['metoclopramida10', 'ondansetrona4', 'ondansetrona8'],
  corticosteroid: ['dexametasona4'],
  beta_blocker: ['propranolol40'],
  anticonvulsant: ['topiramato25'],
  tricyclic: ['amitriptilina25'],
  calcium_channel_blocker: ['verapamil80', 'verapamil120'],
  penicillin: ['amoxicilina500', 'amoxicilina875'],
  penicillin_clavulanate: ['amoxClav875', 'amoxClav500'],
  antibiotic_alternative: ['azitromicina500', 'clindamicina300'],
  antibiotic_misc: ['fosfomicina3g'],
  nitrofuran: ['nitrofurantoina100'],
  opioid: ['tramadol50']
};

const MED_VO_FAMILIES = {
  dipirona: ['dipirona500', 'dipirona1g'],
  paracetamol: ['paracetamol500', 'paracetamol750'],
  naproxeno: ['naproxeno250', 'naproxeno500'],
  ibuprofeno: ['ibuprofeno200', 'ibuprofeno400', 'ibuprofeno600'],
  diclofenaco: ['diclofenaco50'],
  cetoprofeno: ['cetoprofeno50', 'cetoprofeno100'],
  nimesulida: ['nimesulida100'],
  ciclobenzaprina: ['ciclobenzaprina5', 'ciclobenzaprina10'],
  tizanidina: ['tizanidina2'],
  sumatriptano: ['sumatriptano50', 'sumatriptano100', 'sumatriptanoSc6'],
  zolmitriptano: ['zolmitriptano25', 'zolmitriptanoNas5'],
  metoclopramida: ['metoclopramida10'],
  ondansetrona: ['ondansetrona4', 'ondansetrona8'],
  dexametasona: ['dexametasona4'],
  propranolol: ['propranolol40'],
  topiramato: ['topiramato25'],
  amitriptilina: ['amitriptilina25'],
  verapamil: ['verapamil80', 'verapamil120'],
  amoxicilina: ['amoxicilina500', 'amoxicilina875'],
  azitromicina: ['azitromicina500'],
  clindamicina: ['clindamicina300'],
  fosfomicina: ['fosfomicina3g'],
  nitrofurantoina: ['nitrofurantoina100'],
  tramadol: ['tramadol50']
};

const MED_VO_KEY_CLASSES = {};
Object.entries(MED_VO_GROUPS).forEach(([group, keys]) => {
  keys.forEach(key => {
    if (!MED_VO_KEY_CLASSES[key]) MED_VO_KEY_CLASSES[key] = [];
    const cls = group === 'antibiotic_alternative' ? 'antibiotic'
      : group === 'penicillin_clavulanate' ? 'penicillin_clavulanate'
      : group;
    if (!MED_VO_KEY_CLASSES[key].includes(cls)) MED_VO_KEY_CLASSES[key].push(cls);
    if (group === 'penicillin_clavulanate' && !MED_VO_KEY_CLASSES[key].includes('penicillin')) {
      MED_VO_KEY_CLASSES[key].push('penicillin');
    }
  });
});

function medVoNorm (text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function medVoClassesForKey (key) {
  return MED_VO_KEY_CLASSES[key] ? MED_VO_KEY_CLASSES[key].slice() : [];
}

function medVoMatchKey (text) {
  if (!text) return null;
  for (const [key, val] of Object.entries(MED_VO)) {
    if (text === val || text.startsWith(val)) return key;
  }
  return null;
}

function medVoInferFamilyKeys (text) {
  const t = medVoNorm(text);
  const keys = new Set();
  if (/clavulanato|amox.*clav/.test(t)) {
    (MED_VO_GROUPS.penicillin_clavulanate || []).forEach(k => keys.add(k));
    return [...keys];
  }
  Object.entries(MED_VO_FAMILIES).forEach(([family, familyKeys]) => {
    if (t.includes(family)) familyKeys.forEach(k => keys.add(k));
  });
  return [...keys];
}

function medVoIsCatalogText (text) {
  return !!medVoMatchKey(text) || medVoInferFamilyKeys(text).length > 0;
}

function medVoDetectSuffix (meds) {
  for (const m of meds) {
    for (const val of Object.values(MED_VO)) {
      if (m.text.startsWith(val)) return m.text.slice(val.length);
    }
  }
  return '';
}

function medVoKeyVoGroup (key) {
  for (const [group, keys] of Object.entries(MED_VO_GROUPS)) {
    if (keys.includes(key)) return group;
  }
  return null;
}

function medVoDetectExclusiveGroup (meds, idPrefix) {
  const existing = meds.find(m => m.exclusiveGroup);
  if (existing) return existing.exclusiveGroup;
  if (meds.some(m => medVoIsCatalogText(m.text))) return `${idPrefix}-pick`;
  return null;
}

function medVoDetectExpandGroups (optionClasses, optionLabel, meds) {
  const groups = new Set();
  const norm = medVoNorm(optionLabel);

  (optionClasses || []).forEach(c => {
    if (MED_VO_GROUPS[c]) groups.add(c);
  });

  if (groups.size > 0) {
    if (groups.has('penicillin_clavulanate')) groups.delete('penicillin');
    if (groups.has('antibiotic_alternative')) {
      groups.delete('penicillin');
      groups.delete('penicillin_clavulanate');
    }
    return groups;
  }

  meds.forEach(m => (m.classes || []).forEach(c => {
    if (MED_VO_GROUPS[c]) groups.add(c);
  }));

  if (groups.size > 0) {
    if (groups.has('penicillin_clavulanate')) groups.delete('penicillin');
    return groups;
  }

  if (/\baine\b|nsaid|anti-?inflamat|ibuprofeno|naproxeno|diclofenac|cetoprofeno|nimesulid/.test(norm)) {
    groups.add('nsaid');
  }
  if (/analgesico simples|analges simples|analges adjuv|dipirona|paracetamol|acetaminofen/.test(norm)) {
    groups.add('analgesic_non_opioid');
  }
  if (/relaxante muscular|ciclobenzaprina|tizanidina/.test(norm)) groups.add('muscle_relaxant');
  if (/triptan|sumatriptano|zolmitriptano/.test(norm)) groups.add('triptan');
  if (/antiemet|metoclopramid|ondansetrona/.test(norm)) groups.add('antiemetic');
  if (/corticoide|dexametasona|prednisona/.test(norm)) groups.add('corticosteroid');
  if (/propranolol|betabloqueador/.test(norm)) groups.add('beta_blocker');
  if (/topiramato|anticonvulsiv/.test(norm)) groups.add('anticonvulsant');
  if (/amitriptilina|triciclic/.test(norm)) groups.add('tricyclic');
  if (/verapamil|bloqueador.*calcio/.test(norm)) groups.add('calcium_channel_blocker');
  if (/tramadol|opioide|morfina/.test(norm)) groups.add('opioid');

  if (/alergic.*penicilina|alergico.*penicilina/.test(norm)) {
    groups.clear();
    groups.add('antibiotic_alternative');
  } else if (/clavulanato|amox.*clav/.test(norm)) {
    groups.add('penicillin_clavulanate');
    groups.delete('penicillin');
  } else if (/amoxicilina(?!.*clav)|penicilina(?!.*clav)/.test(norm)) {
    groups.add('penicillin');
  }

  if (/fosfomicina/.test(norm)) groups.add('antibiotic_misc');
  if (/nitrofurantoina/.test(norm)) groups.add('nitrofuran');
  if (/azitromicina|clindamicina/.test(norm)) groups.add('antibiotic_alternative');

  return groups;
}

function medVoFilterKeysByGroups (keys, allowedGroups) {
  if (!allowedGroups || !allowedGroups.size) return keys;
  const out = new Set();
  keys.forEach(key => {
    const g = medVoKeyVoGroup(key);
    if (g && allowedGroups.has(g)) out.add(key);
  });
  return out;
}

function medVoMeds (idPrefix, groupKey, opts) {
  const suffix = opts && opts.suffix ? opts.suffix : '';
  const exclusiveGroup = opts && opts.exclusiveGroup;
  const keys = MED_VO_GROUPS[groupKey] || [];
  return keys.map(key => ({
    id: `${idPrefix}-${key}`,
    text: MED_VO[key] + suffix,
    classes: medVoClassesForKey(key),
    exclusiveGroup
  }));
}

function medVoExpandMeds (meds, opts) {
  if (!meds || !meds.length || typeof MED_VO === 'undefined') return meds || [];

  const optionClasses = (opts && opts.optionClasses) || [];
  const optionLabel = (opts && opts.label) || '';
  const idPrefix = (opts && opts.idPrefix) || 'med';
  const suffix = medVoDetectSuffix(meds);
  const exclusiveGroup = medVoDetectExclusiveGroup(meds, idPrefix);
  const detectedGroups = medVoDetectExpandGroups(optionClasses, optionLabel, meds);
  const fullClassExpand = exclusiveGroup
    || /escolha (um|uma|apresent)/.test(medVoNorm(optionLabel))
    || /escolher na etapa/.test(medVoNorm(optionLabel));

  const result = new Map();

  meds.forEach(m => {
    if (!medVoIsCatalogText(m.text)) result.set(m.id, m);
  });

  let keysToAdd = new Set();

  if (fullClassExpand && detectedGroups.size > 0) {
    detectedGroups.forEach(groupKey => {
      (MED_VO_GROUPS[groupKey] || []).forEach(k => keysToAdd.add(k));
    });
  }

  [optionLabel, ...meds.map(m => m.text)].forEach(text => {
    medVoInferFamilyKeys(text).forEach(k => keysToAdd.add(k));
  });

  keysToAdd = medVoFilterKeysByGroups(keysToAdd, detectedGroups);

  if (!keysToAdd.size) {
    return result.size ? [...result.values()] : meds;
  }

  keysToAdd.forEach(key => {
    const id = `${idPrefix}-${key}`;
    result.set(id, {
      id,
      text: MED_VO[key] + suffix,
      classes: medVoClassesForKey(key),
      exclusiveGroup: exclusiveGroup || undefined
    });
  });

  return [...result.values()];
}

function medVoExpandOption (option) {
  if (!option || typeof medVoExpandMeds !== 'function') return option;
  const rawMeds = option.meds || [];
  if (!rawMeds.length) return option;
  return {
    ...option,
    _voExpanded: true,
    meds: medVoExpandMeds(rawMeds, {
      optionClasses: option.classes || [],
      label: [option.label, option.tier].filter(Boolean).join(' — '),
      idPrefix: option.id
    })
  };
}

function medVoExpandCondition (condition) {
  if (!condition || !condition.groups) return condition;
  return {
    ...condition,
    groups: condition.groups.map(group => ({
      ...group,
      options: (group.options || []).map(opt => medVoExpandOption(opt))
    }))
  };
}
