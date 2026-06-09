/* Receituário — catálogo de condições e modelos de receita */

const RX_CATALOG = [
  {
    id: 'cefaleias',
    name: 'Cefaleia',
    icon: '🤕',
    aliases: ['cefaleia', 'cefaleias', 'dor de cabeca', 'dor cabeca', 'enxaqueca', 'migranea', 'migraine', 'headache', 'salvas'],
    groups: [
      {
        id: 'tensional',
        label: 'Cefaleia tensional',
        options: [
          {
            id: 'cef-tens-1',
            tier: '1ª linha',
            label: 'Dipirona ou paracetamol (VO)',
            classes: ['analgesic_non_opioid'],
            items: [
              'Dipirona 500 mg — 1 comprimido VO 6/6 horas, por 3 a 5 dias, se dor',
              'OU Paracetamol 750 mg — 1 comprimido VO 6/6 horas, por 3 a 5 dias, se dor'
            ],
            orientacoes: 'Evitar uso diário prolongado de analgésicos (> 10–15 dias/mês). Retorno imediato se cefaleia súbita intensa (“pior da vida”), febre, rigidez de nuca ou déficit neurológico.'
          },
          {
            id: 'cef-tens-2',
            tier: 'Alternativa',
            label: 'AINE + relaxante cervical (VO)',
            classes: ['nsaid', 'muscle_relaxant'],
            items: [
              'Naproxeno 500 mg — 1 comprimido VO 12/12 horas, por 3 a 5 dias',
              'Ibuprofeno 400 mg — 1 comprimido VO 8/8 horas, por 3 dias (alternativa)',
              'Ciclobenzaprina 5 mg — 1 comprimido VO à noite, por 3 a 5 dias (se componente cervical)'
            ],
            orientacoes: 'Cautela em úlcera péptica, DRC, gestação e asma. Tomar AINE após alimentação.'
          },
          {
            id: 'cef-tens-3',
            tier: 'Refractário',
            label: 'Tramadol (VO) — dor refratária',
            classes: ['opioid'],
            items: [
              'Tramadol 50 mg — 1 comprimido VO 6/6 horas, se dor intensa, por até 3 dias'
            ],
            orientacoes: 'Receita especial (A2). Evitar associar outros opioides. Não dirigir se sedação.'
          }
        ]
      },
      {
        id: 'enxaqueca',
        label: 'Enxaqueca moderada a grave',
        options: [
          {
            id: 'cef-enx-1',
            tier: '1ª linha',
            label: 'Sumatriptano + antiemético',
            classes: ['triptan', 'antiemetic', 'analgesic_non_opioid'],
            items: [
              'Sumatriptano 50 mg — 1 comprimido VO ao início da crise (pode repetir após 2 h; máx. 200 mg/dia)',
              'Metoclopramida 10 mg — 1 comprimido VO junto ao triptano (náusea)',
              'Dipirona 500 mg — 1 comprimido VO 6/6 horas se dor residual'
            ],
            orientacoes: 'Contraindicado se DAC, AVC prévio, PA não controlada ou gestação (revisar). Não usar triptano > 10 dias/mês.'
          },
          {
            id: 'cef-enx-2',
            tier: 'Alternativa',
            label: 'Zolmitriptano ou AINE associado',
            classes: ['triptan', 'analgesic_non_opioid', 'nsaid'],
            items: [
              'Zolmitriptano 2,5 mg — 1 comprimido VO ao início da crise (pode repetir 2,5 mg após 2 h)',
              'Paracetamol 750 mg — 1 comprimido VO 6/6 horas',
              'Naproxeno 500 mg — 1 comprimido VO 12/12 horas por 2 dias'
            ],
            orientacoes: 'Evitar combinar dois triptanos. Orientar diário de cefaleia.'
          },
          {
            id: 'cef-enx-3',
            tier: 'Profilaxia',
            label: 'Profilaxia ambulatorial (enxaqueca recorrente)',
            classes: ['beta_blocker', 'anticonvulsant', 'tricyclic'],
            items: [
              'Propranolol 40 mg — 1 comprimido VO 12/12 horas (ajustar conforme FC/PA)',
              'OU Topiramato 25 mg — 1 comprimido VO à noite (titular gradualmente)',
              'OU Amitriptilina 25 mg — 1 comprimido VO à noite'
            ],
            orientacoes: 'Avaliar indicação de profilaxia se ≥ 4 crises/mês ou impacto funcional. Retorno em 4–8 semanas para resposta.'
          }
        ]
      },
      {
        id: 'salvas',
        label: 'Cefaleia em salvas',
        options: [
          {
            id: 'cef-sal-1',
            tier: '1ª linha',
            label: 'Sumatriptano SC / nasal na crise',
            classes: ['triptan'],
            items: [
              'Sumatriptano 6 mg — 1 aplicacao SC ao início da crise (repetir após 1 h se necessário; máx. 12 mg/24 h)',
              'OU Zolmitriptano 5 mg — 1 spray nasal na crise'
            ],
            orientacoes: 'Orientar evitar álcool e nitratos na crise. Encaminhar neurologia para profilaxia (verapamil).'
          },
          {
            id: 'cef-sal-2',
            tier: 'Profilaxia',
            label: 'Verapamil — profilaxia de salvas',
            classes: ['calcium_channel_blocker'],
            items: [
              'Verapamil 80 mg — 1 comprimido VO 8/8 horas (titular conforme tolerância e ECG)'
            ],
            orientacoes: 'Solicitar ECG antes e monitorar. Especialista/neurologia recomendado.'
          }
        ]
      }
    ]
  },
  {
    id: 'amigdalite-bacteriana',
    name: 'Amigdalite bacteriana',
    icon: '🦠',
    aliases: ['amigdalite', 'faringite', 'faringoamigdalite', 'dor de garganta', 'odinofagia'],
    groups: [
      {
        id: 'atb',
        label: 'Antibiótico',
        options: [
          {
            id: 'amig-1',
            tier: '1ª linha',
            label: 'Amoxicilina VO',
            classes: ['penicillin'],
            items: [
              'Amoxicilina 500 mg — 1 comprimido VO 8/8 horas, por 10 dias'
            ],
            orientacoes: 'Completar 10 dias mesmo com melhora em 48 h. Retorno se trismo, voz abafada ou piora unilateral (abscesso).'
          },
          {
            id: 'amig-2',
            tier: 'Alternativa',
            label: 'Amoxicilina-clavulanato',
            classes: ['penicillin', 'penicillin_clavulanate'],
            items: [
              'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO 12/12 horas, por 10 dias'
            ],
            orientacoes: 'Alternativa se falha terapêutica ou fatores de risco para resistência.'
          }
        ]
      }
    ]
  },
  {
    id: 'cistite-itu-baixa',
    name: 'Cistite (ITU baixa)',
    icon: '💧',
    aliases: ['cistite', 'itu', 'infecao urinaria', 'urina', 'disuria', 'polaciuria'],
    groups: [
      {
        id: 'atb',
        label: 'Antibiótico',
        options: [
          {
            id: 'itu-1',
            tier: '1ª linha',
            label: 'Fosfomicina dose única',
            classes: ['antibiotic_misc'],
            items: [
              'Fosfomicina trometamol 3 g — 1 envelope VO dose única (dissolver em meio copo de agua)'
            ],
            orientacoes: 'Hidratação abundante. Retorno se febre, dor lombar ou piora em 48 h (pielonefrite).'
          },
          {
            id: 'itu-2',
            tier: 'Alternativa',
            label: 'Nitrofurantoína',
            classes: ['nitrofuran'],
            items: [
              'Nitrofurantoína 100 mg — 1 comprimido VO 6/6 horas, por 5 dias'
            ],
            orientacoes: 'Evitar se TFG < 30 mL/min. Urina pode ficar amarelada — orientar paciente.'
          }
        ]
      }
    ]
  },
  {
    id: 'lombalgia-ciatalgia',
    name: 'Lombalgia / ciatalgia',
    icon: '🦴',
    aliases: ['lombalgia', 'lombago', 'ciatalgia', 'ciatica', 'dor lombar', 'dor nas costas'],
    groups: [
      {
        id: 'analgesia',
        label: 'Analgesia',
        options: [
          {
            id: 'lomb-1',
            tier: '1ª linha',
            label: 'Analgésico + AINE (VO)',
            classes: ['analgesic_non_opioid', 'nsaid', 'muscle_relaxant'],
            items: [
              'Dipirona 500 mg — 1 comprimido VO 6/6 horas, por 5 a 7 dias',
              'Naproxeno 500 mg — 1 comprimido VO 12/12 horas, por 5 dias',
              'Ciclobenzaprina 5 mg — 1 comprimido VO à noite, por 5 dias (se espasmo)'
            ],
            orientacoes: 'Repouso relativo, calor local. Retorno imediato se deficit motor, anestesia em sela, febre ou trauma.'
          }
        ]
      }
    ]
  }
];

function rxNormText (text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function rxInferMedClasses (text) {
  const t = rxNormText(text);
  const classes = [];
  if (/naproxeno|ibuprofeno|diclofenac|cetoprofeno|nimesulid|aas|aspirin|acido acetilsalicilico|meloxicam|piroxicam/.test(t)) {
    classes.push('nsaid');
  }
  if (/dipirona|paracetamol|acetaminofen/.test(t)) classes.push('analgesic_non_opioid');
  if (/sumatriptano|zolmitriptano|eletriptano|rizatriptano|almotriptano/.test(t)) classes.push('triptan');
  if (/tramadol|morfina|codeina|fentanil|oxicode/.test(t)) classes.push('opioid');
  if (/metoclopramid|ondansetrona|bromoprida|dimenidrinato/.test(t)) classes.push('antiemetic');
  if (/ciclobenzaprina|carisoprodol|tizanidina/.test(t)) classes.push('muscle_relaxant');
  if (/propranolol|atenolol|metoprolol|bisoprolol|carvedilol/.test(t)) classes.push('beta_blocker');
  if (/topiramato|valproato|carbamazepina|fenitoina|levetiracetam/.test(t)) classes.push('anticonvulsant');
  if (/amitriptilin|nortriptilin|imipramina/.test(t)) classes.push('tricyclic');
  if (/verapamil|diltiazem|anlodipino|nifedipino/.test(t)) classes.push('calcium_channel_blocker');
  if (/amoxicilina|ampicilina|penicilina/.test(t)) classes.push('penicillin');
  if (/clavulanato|clavul/.test(t)) classes.push('penicillin_clavulanate');
  if (/fosfomicina|nitrofurantoina|ciprofloxacino|levofloxacino|azitromicina|cefalexina/.test(t)) {
    classes.push('antibiotic');
  }
  if (/nitrofurantoina/.test(t)) classes.push('nitrofuran');
  if (/fosfomicina/.test(t)) classes.push('antibiotic_misc');
  return classes;
}

function rxGetOptionMeds (option) {
  if (option.meds) return option.meds;

  const meds = [];
  let pendingGroup = null;

  option.items.forEach((raw, i) => {
    const isOu = /^OU\s/i.test(raw);
    const text = raw.replace(/^OU\s/i, '').trim();
    const isAlt = /\(alternativa\)/i.test(text);
    let exclusiveGroup = null;

    if (isOu || isAlt) {
      if (!pendingGroup) pendingGroup = `${option.id}-g${meds.length}`;
      exclusiveGroup = pendingGroup;
    } else {
      const next = option.items[i + 1];
      if (next && (/^OU\s/i.test(next) || /\(alternativa\)/i.test(next))) {
        pendingGroup = `${option.id}-g${i}`;
        exclusiveGroup = pendingGroup;
      } else {
        pendingGroup = null;
      }
    }

    meds.push({
      id: `${option.id}-m${i}`,
      text,
      classes: rxInferMedClasses(text),
      exclusiveGroup
    });
  });

  return meds;
}

function rxFindMed (condition, medId) {
  for (const group of condition.groups) {
    for (const option of group.options) {
      const med = rxGetOptionMeds(option).find(m => m.id === medId);
      if (med) return { group, option, med };
    }
  }
  return null;
}

function rxCollectSelectedMeds (condition, selectedMedIds) {
  const out = [];
  selectedMedIds.forEach(medId => {
    const found = rxFindMed(condition, medId);
    if (found) out.push(found);
  });
  return out;
}

function rxValidateMeds (selectedMedEntries) {
  const messages = [];
  if (selectedMedEntries.length < 2) return messages;

  const classCounts = {};
  selectedMedEntries.forEach(({ med }) => {
    (med.classes || []).forEach(cls => {
      classCounts[cls] = (classCounts[cls] || 0) + 1;
    });
  });

  RX_CLASS_RULES.forEach(rule => {
    const count = classCounts[rule.class] || 0;
    if (count > rule.max) {
      messages.push({ severity: rule.severity, text: rule.message });
    }
  });

  RX_PAIR_RULES.forEach(rule => {
    const hasAll = rule.classes.every(cls => (classCounts[cls] || 0) > 0);
    if (hasAll) messages.push({ severity: rule.severity, text: rule.message });
  });

  const seen = new Set();
  return messages.filter(m => {
    const key = m.severity + '|' + m.text;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rxExclusiveGroupsComplete (condition, selectedOptionIds, selectedMedIds) {
  const selections = rxCollectSelectedOptions(condition, selectedOptionIds);
  return selections.every(({ option }) => {
    const meds = rxGetOptionMeds(option);
    const groups = [...new Set(meds.filter(m => m.exclusiveGroup).map(m => m.exclusiveGroup))];
    return groups.every(g => meds.some(m => m.exclusiveGroup === g && selectedMedIds.has(m.id)));
  });
}

const RX_CLASS_RULES = [
  {
    class: 'nsaid',
    max: 1,
    severity: 'error',
    message: 'Não prescreva dois AINEs (ex.: naproxeno + ibuprofeno). Escolha apenas um.'
  },
  {
    class: 'triptan',
    max: 1,
    severity: 'error',
    message: 'Use apenas um triptano por prescrição (sumatriptano ou zolmitriptano, não ambos).'
  },
  {
    class: 'opioid',
    max: 1,
    severity: 'error',
    message: 'Use apenas um opioide por prescrição.'
  },
  {
    class: 'penicillin',
    max: 1,
    severity: 'error',
    message: 'Não combine amoxicilina com amoxicilina-clavulanato (duplicidade de beta-lactâmico).'
  },
  {
    class: 'beta_blocker',
    max: 1,
    severity: 'warning',
    message: 'Múltiplos betabloqueadores — confirme indicação de profilaxia.'
  },
  {
    class: 'anticonvulsant',
    max: 1,
    severity: 'warning',
    message: 'Múltiplos anticonvulsivantes — prefira monoterapia na profilaxia.'
  },
  {
    class: 'tricyclic',
    max: 1,
    severity: 'warning',
    message: 'Evite associar dois antidepressivos tricíclicos.'
  },
  {
    class: 'analgesic_non_opioid',
    max: 1,
    severity: 'warning',
    message: 'Vários analgésicos não opioides selecionados — prefira um por vez (ex.: dipirona OU paracetamol).'
  }
];

const RX_PAIR_RULES = [
  {
    classes: ['penicillin', 'penicillin_clavulanate'],
    severity: 'error',
    message: 'Amoxicilina + amoxicilina-clavulanato — não prescreva ambos (clavulanato já contém amoxicilina).'
  },
  {
    classes: ['antibiotic_misc', 'nitrofuran'],
    severity: 'warning',
    message: 'Dois antibióticos para ITU — escolha monoterapia (fosfomicina OU nitrofurantoína).'
  },
  {
    classes: ['nsaid', 'opioid'],
    severity: 'warning',
    message: 'AINE + opioide — avaliar necessidade; reforçar proteção gástrica e hidratação.'
  }
];

function rxCollectSelectedOptions (condition, selectedIds) {
  const out = [];
  if (!condition) return out;
  condition.groups.forEach(group => {
    group.options.forEach(option => {
      if (selectedIds.has(option.id)) out.push({ group, option });
    });
  });
  return out;
}

function rxValidateSchemes (condition, selectedIds) {
  const messages = [];
  const selections = rxCollectSelectedOptions(condition, selectedIds);
  if (selections.length < 2) return messages;

  const classCounts = {};
  selections.forEach(({ option }) => {
    (option.classes || []).forEach(cls => {
      if (['penicillin', 'penicillin_clavulanate', 'antibiotic_misc', 'nitrofuran'].includes(cls)) {
        classCounts[cls] = (classCounts[cls] || 0) + 1;
      }
    });
  });

  if ((classCounts.penicillin || 0) >= 1 && (classCounts.penicillin_clavulanate || 0) >= 1) {
    messages.push({
      severity: 'error',
      text: 'Amoxicilina + amoxicilina-clavulanato — não prescreva ambos (clavulanato já contém amoxicilina).'
    });
  }
  if ((classCounts.penicillin || 0) > 1) {
    messages.push({
      severity: 'error',
      text: 'Não combine amoxicilina com amoxicilina-clavulanato (duplicidade de beta-lactâmico).'
    });
  }
  if ((classCounts.antibiotic_misc || 0) >= 1 && (classCounts.nitrofuran || 0) >= 1) {
    messages.push({
      severity: 'warning',
      text: 'Dois antibióticos para ITU — escolha monoterapia (fosfomicina OU nitrofurantoína).'
    });
  }

  return messages;
}

function rxValidateSelection (condition, selectedIds) {
  return rxValidateSchemes(condition, selectedIds);
}

function rxHasValidationErrors (messages) {
  return messages.some(m => m.severity === 'error');
}

function rxMatchConditions (queixa) {
  const norm = rxNormText(queixa);
  if (!norm || norm.length < 3) return [];

  return RX_CATALOG.filter(cond => {
    if (cond.aliases.some(a => norm.includes(rxNormText(a)))) return true;
    if (norm.includes(rxNormText(cond.name))) return true;
    return cond.aliases.some(a => rxNormText(a).includes(norm));
  }).sort((a, b) => {
    const aExact = a.aliases.some(al => rxNormText(al) === norm) ? 0 : 1;
    const bExact = b.aliases.some(al => rxNormText(al) === norm) ? 0 : 1;
    return aExact - bExact;
  });
}
