/* Fluxo clínico por condição — metadados curados, nunca inventados automaticamente.
 *
 * Cada entrada define o que o app pode exigir naquela doença:
 * - scores: calculadoras só quando há associação validada
 * - reassessment: reavaliação temporal quando a conduta depende de resposta
 * - outcomes: desfechos permitidos (alta, observação, internação, transferência)
 * - homeRx: receita de casa só se existir modelo curado (nunca copiar dose hospitalar)
 * - requiresImprovementForDischarge: alta só após melhora explícita
 */

const CLINICAL_PATHWAY_DEFAULT = Object.freeze({
  scores: [],
  reassessment: null,
  outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
  homeRx: 'none',
  requiresImprovementForDischarge: false,
  hospitalOnly: false,
  notes: ''
});

/**
 * homeRx:
 * - curated  → existe receita ambulatorial curada no receituário
 * - blocked  → não liberar receita de casa (risco de copiar dose hospitalar)
 * - none     → alta sem receita específica / só orientações
 */
const CLINICAL_PATHWAY_BY_ID = {
  /* Respiratório — crise na unidade + alta ambulatorial curada */
  'asma-broncoespasmo': {
    scores: [],
    reassessment: {
      trigger: 'inhaled-cycles',
      label: 'Reavaliar após o último ciclo inalatório',
      question: 'O paciente apresentou melhora do quadro?'
    },
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Dose hospitalar (4–8 puffs / nebulização) nunca entra na receita de casa.'
  },
  'dpoc-exacerbada': {
    scores: [],
    reassessment: {
      trigger: 'inhaled-cycles',
      label: 'Reavaliar após o último ciclo inalatório',
      question: 'O paciente apresentou melhora do quadro?'
    },
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Antibiótico de alta só se escarro purulento; dose de resgate ambulatorial = 2 jatos.'
  },
  'bronquite-aguda': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated',
    requiresImprovementForDischarge: false,
    notes: 'Receita de alta prioriza sintomáticos; ATB apenas se suspeita de coqueluche.'
  },
  'pneumonia-comunitaria': {
    scores: ['curb65'],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar resposta inicial e gravidade',
      question: 'Há melhora clínica suficiente para alta ambulatorial?'
    },
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true,
    notes: 'CURB-65 guia local de tratamento. Receita de casa exige modelo curado (ainda bloqueada).'
  },
  'edema-agudo-pulmao': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dispneia, SpO₂ e PA após conduta inicial',
      question: 'Houve melhora clínica suficiente?'
    },
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    requiresImprovementForDischarge: false,
    hospitalOnly: true,
    notes: 'EAP não fecha com alta domiciliar a partir do protocolo de PS.'
  },
  'tep': {
    scores: ['wells', 'perc'],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true,
    notes: 'Wells/PERC para estratificação; não inventar alta domiciliar automática.'
  },
  'tosse': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked',
    notes: 'Sintomático ambulatorial — modelo curado pendente; não copiar PS.'
  },
  'gripe-influenza': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated'
  },
  'rinite-alergica': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'sinusite-aguda': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated'
  },

  /* Cardiovascular / emergência */
  'sca-iam': {
    scores: ['heart', 'grace'],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true,
    notes: 'Fluxo no Guia de emergência (STEMI/NSTEMI).'
  },
  'crise-hipertensiva': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar PA e sintomas-alvo após conduta',
      question: 'Sinais de lesão de órgão-alvo resolvidos ou estabilizados?'
    },
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'arritmias': {
    scores: ['chads-vasc', 'has-bled'],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'cardioversao-eletrica': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'sincope': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'none',
    notes: 'Alta só se baixo risco clínico documentado.'
  },
  'tvp': {
    scores: ['wells-tvp'],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    notes: 'Anticoagulação de alta exige modelo curado; não copiar dose EV do PS.'
  },
  'hda': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'edema-mmi': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked'
  },
  'flebite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },
  'varizes-mmi': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'ulcera-varicosa': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },

  /* Neurológico */
  'avc': {
    scores: ['nihss', 'abcd2'],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true,
    notes: 'Fluxo no Guia de emergência.'
  },
  'cefaleias': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor após analgesia',
      question: 'Houve melhora suficiente da cefaleia para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true
  },
  'crise-convulsiva-em': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar cessação da crise e nível de consciência',
      question: 'Crise cessou e o paciente está estável para o próximo passo?'
    },
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'meningite-bacteriana': {
    scores: [],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'delirium': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'sindrome-vestibular': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar vertigem após sintomáticos',
      question: 'Há melhora suficiente para alta ambulatorial?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'ansiedade-crise': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar ansiedade após intervenção',
      question: 'Sintomas cederam o suficiente para alta?'
    },
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },

  /* Infeccioso / dermatológico ambulatorial frequente */
  'amigdalite-bacteriana': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated'
  },
  'cistite-itu-baixa': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'pielonefrite': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar febre, dor e capacidade de VO',
      question: 'Paciente está estável para alta com antibiótico VO?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'celulite': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar extensão e sinais sistêmicos',
      question: 'Há melhora ou estabilidade suficiente para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'erisipela': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar extensão e sinais sistêmicos',
      question: 'Há melhora ou estabilidade suficiente para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'abscesso-cutaneo': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },
  'furunculose': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'impetigo': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'herpes-zoster': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },
  'escabiose': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'pediculose': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'micoses-superficiais': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'tinea': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'frieira': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },

  /* Arboviroses / infecciosas sistêmicas */
  'dengue': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar classificação A–D e sinais de alarme',
      question: 'Classificação e hidratação permitem alta com retorno programado?'
    },
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true,
    notes: 'Alta só dengue A sem sinais de alarme; retorno obrigatório.'
  },
  'chikungunya': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked'
  },
  'malaria': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'leptospirose': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'sepse-choque-septico': {
    scores: ['qsofa', 'sofa'],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true,
    notes: 'Fluxo no Guia de emergência (bundle hora 1).'
  },
  'mononucleose': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },

  /* GI / abdome */
  'abdome-agudo': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'apendicite-aguda': {
    scores: ['alvarado-air'],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'colecistite-aguda': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'diverticulite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    notes: 'Hinchey baixa pode ter alta; receita VO curada pendente.'
  },
  'pancreatite-aguda': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'diarreia-gastroenterite': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar hidratação e tolerância oral',
      question: 'Paciente está hidratado e tolerando VO para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'vomitos-agudos': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar náuseas/vômitos e tolerância oral',
      question: 'Sintomas controlados e VO possível?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'constipacao': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'desconforto-abdominal': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'dispepsia-drge': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'hemorroidas': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'fissura-anal': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },

  /* Ortopedia / dor */
  'lombalgia-ciatalgia': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor e deambulação',
      question: 'Dor controlada o suficiente para alta?'
    },
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true
  },
  'artralgia-dor-msk': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor após analgesia',
      question: 'Dor controlada o suficiente para alta?'
    },
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'gota': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'colica-renal': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor e capacidade de VO',
      question: 'Dor controlada e paciente apto à alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },

  /* ORL / oftalmo */
  'otite-externa': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'otite-media': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated'
  },
  'epistaxe': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar sangramento após tamponamento/cauterização',
      question: 'Sangramento cessou e o paciente está estável para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'none',
    requiresImprovementForDischarge: true
  },
  'conjuntivite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'hordeolo': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'corpo-estranho-ocular': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'transferencia'],
    homeRx: 'none'
  },
  'trauma-ocular': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'afta-estomatite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'queilite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },

  /* Gineco / obstetrícia / ITS */
  'ameaca-aborto': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    notes: 'Encaminhar ao Guia/obstetrícia conforme gravidade.'
  },
  'eclampsia-pre-eclampsia': {
    scores: [],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'sangramento-uterino': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'none'
  },
  'vulvovaginites': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'candidiase': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'balanopostite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'gonorreia-clamidia': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'ulceras-genitais': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },
  'violencia-sexual-pep': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated',
    notes: 'PEP e profilaxias são do protocolo de alta; aplicar no serviço o que for IM.'
  },

  /* Metabólico / toxicologia / trauma */
  'cetoacidose-diabetica': {
    scores: [],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'estado-hiperosmolar': {
    scores: [],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'hipoglicemia-grave': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar glicemia e consciência após correção',
      question: 'Glicemia corrigida e paciente estável?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'none',
    requiresImprovementForDischarge: true
  },
  'diabetes-insulina-hipo': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'disturbios-eletroliticos': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'crise-tireotoxica': {
    scores: [],
    reassessment: null,
    outcomes: ['internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'alergia-anafilaxia': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar vias aéreas, PA e rash após adrenalina/antihistamínico',
      question: 'Há resolução suficiente para observação/alta com plano de anaphylaxia?'
    },
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true,
    notes: 'Alta precoce sem observação prolongada é exceção; receita de adrenalina autoinjetável exige modelo curado.'
  },
  'edema-angioneurotico': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar vias aéreas e edema',
      question: 'Vias aéreas estáveis para observação/alta?'
    },
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'alcoolismo-intox-abstinencia': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'abstinencia-alcoolica': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'intoxicacoes-exogenas': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'acidente-ofidico': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'escorpionismo': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'insolacao': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar temperatura e estado mental após resfriamento',
      question: 'Temperatura e consciência normalizadas?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'none',
    requiresImprovementForDischarge: true
  },
  'queimaduras': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'blocked'
  },
  'trauma-atls': {
    scores: [],
    reassessment: null,
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'none',
    hospitalOnly: true
  },
  'profilaxia-antirrabica': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'none',
    notes: 'Esquema vacinal/IG no serviço; orientar retorno das doses.'
  },

  /* Parasitoses / hematologia / miscelânea */
  'antiparasitarios': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'ascaridiase': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'parasitoses-intestinais': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'blocked'
  },
  'anemia-ferropriva': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },
  'anemia-falciforme': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor após analgesia',
      question: 'Dor controlada o suficiente para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    requiresImprovementForDischarge: true
  },
  'soluco-persistente': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'blocked'
  },
  'tuberculose': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'blocked',
    notes: 'RHZE exige notificação e modelo curado; não copiar do PS automaticamente.'
  }
};

const CLINICAL_OUTCOME_LABELS = {
  alta: 'Alta com orientação',
  observacao: 'Manter em observação',
  internacao: 'Internar',
  transferencia: 'Transferir'
};

/* IDs canônicos entre Tratamento hospitalar e Prescrições PS. */
const CLINICAL_TH_TO_PS = {
  cefaleia: 'cefaleias',
  'ansiedade-panico': 'ansiedade-crise',
  anafilaxia: 'alergia-anafilaxia',
  'anemia-falciforme': 'anemia-falciforme',
  'abscesso-cutaneo': 'abscesso-cutaneo',
  'abstinencia-alcool': 'abstinencia-alcoolica',
  apendicite: 'apendicite-aguda',
  'artralgia-dor-msk': 'artralgia-dor-msk',
  'asma-broncoespasmo': 'asma-broncoespasmo',
  'celulite-erisipela': 'celulite',
  'cetoacidose-dm': 'cetoacidose-diabetica',
  'colica-renal': 'colica-renal',
  colecistite: 'colecistite-aguda',
  'convulsao-eme': 'crise-convulsiva-em',
  'crise-hipertensiva': 'crise-hipertensiva',
  'crise-tireotoxica': 'crise-tireotoxica',
  'dengue-dor': 'dengue',
  diverticulite: 'diverticulite',
  'disturbios-eletroliticos': 'disturbios-eletroliticos',
  'dor-abdominal': 'abdome-agudo',
  'dor-toracica': 'sca-iam',
  'dpoc-exacerbada': 'dpoc-exacerbada',
  'edema-pulmao-ic': 'edema-agudo-pulmao',
  flebite: 'flebite',
  'gonorreia-ist': 'gonorreia-clamidia',
  'gota-crise': 'gota',
  hda: 'hda',
  'herpes-zoster': 'herpes-zoster',
  hipoglicemia: 'hipoglicemia-grave',
  'influenza-gripe': 'gripe-influenza',
  'intoxicacoes-exogenas': 'intoxicacoes-exogenas',
  leptospirose: 'leptospirose',
  'lombalgia-ciatalgia': 'lombalgia-ciatalgia',
  'malaria-grave': 'malaria',
  'meningite-bacteriana': 'meningite-bacteriana',
  'nausea-vomitos': 'vomitos-agudos',
  pancreatite: 'pancreatite-aguda',
  pielonefrite: 'pielonefrite',
  pneumonia: 'pneumonia-comunitaria',
  'pre-eclampsia-eclampsia': 'eclampsia-pre-eclampsia',
  'profilaxia-antirrabica': 'profilaxia-antirrabica',
  queimadura: 'queimaduras',
  'sepse-infeccao-grave': 'sepse-choque-septico',
  'vertigem-vestibular': 'sindrome-vestibular'
};

function clinicalPathwayPsIdFromTh (thConditionId) {
  return CLINICAL_TH_TO_PS[thConditionId] || (
    CLINICAL_PATHWAY_BY_ID[thConditionId] ? thConditionId : ''
  );
}

function clinicalPathwayGet (conditionId) {
  const curated = CLINICAL_PATHWAY_BY_ID[conditionId] || {};
  return {
    id: conditionId,
    ...CLINICAL_PATHWAY_DEFAULT,
    ...curated,
    scores: Array.isArray(curated.scores) ? curated.scores.slice() : [],
    outcomes: Array.isArray(curated.outcomes)
      ? curated.outcomes.slice()
      : CLINICAL_PATHWAY_DEFAULT.outcomes.slice()
  };
}

function clinicalPathwayAllIds () {
  if (typeof PS_CONDITIONS !== 'undefined' && Array.isArray(PS_CONDITIONS)) {
    return PS_CONDITIONS.map(c => c.id);
  }
  return Object.keys(CLINICAL_PATHWAY_BY_ID);
}

function clinicalPathwayCoverageReport () {
  const ids = clinicalPathwayAllIds();
  const missing = [];
  const curatedHome = [];
  const blockedHome = [];
  const hospitalOnly = [];
  const withScores = [];
  const withReassessment = [];

  ids.forEach(id => {
    const path = clinicalPathwayGet(id);
    if (!CLINICAL_PATHWAY_BY_ID[id]) missing.push(id);
    if (path.homeRx === 'curated') curatedHome.push(id);
    if (path.homeRx === 'blocked') blockedHome.push(id);
    if (path.hospitalOnly) hospitalOnly.push(id);
    if (path.scores.length) withScores.push(id);
    if (path.reassessment) withReassessment.push(id);
  });

  return {
    total: ids.length,
    curated: ids.length - missing.length,
    missing,
    curatedHome,
    blockedHome,
    hospitalOnly,
    withScores,
    withReassessment
  };
}

function clinicalPathwayAllowsOutcome (conditionId, outcome) {
  return clinicalPathwayGet(conditionId).outcomes.includes(outcome);
}

function clinicalPathwayAllowsHomeRx (conditionId) {
  return clinicalPathwayGet(conditionId).homeRx === 'curated';
}

function clinicalPathwayBlocksHomeRx (conditionId) {
  const homeRx = clinicalPathwayGet(conditionId).homeRx;
  return homeRx === 'blocked' || homeRx === 'none';
}

function clinicalPathwayRequiresImprovement (conditionId) {
  return !!clinicalPathwayGet(conditionId).requiresImprovementForDischarge;
}

if (typeof window !== 'undefined') {
  window.clinicalPathwayGet = clinicalPathwayGet;
  window.clinicalPathwayCoverageReport = clinicalPathwayCoverageReport;
  window.clinicalPathwayAllowsOutcome = clinicalPathwayAllowsOutcome;
  window.clinicalPathwayAllowsHomeRx = clinicalPathwayAllowsHomeRx;
  window.clinicalPathwayBlocksHomeRx = clinicalPathwayBlocksHomeRx;
  window.clinicalPathwayRequiresImprovement = clinicalPathwayRequiresImprovement;
  window.clinicalPathwayPsIdFromTh = clinicalPathwayPsIdFromTh;
  window.CLINICAL_OUTCOME_LABELS = CLINICAL_OUTCOME_LABELS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLINICAL_PATHWAY_DEFAULT,
    CLINICAL_PATHWAY_BY_ID,
    CLINICAL_TH_TO_PS,
    CLINICAL_OUTCOME_LABELS,
    clinicalPathwayGet,
    clinicalPathwayAllIds,
    clinicalPathwayCoverageReport,
    clinicalPathwayAllowsOutcome,
    clinicalPathwayAllowsHomeRx,
    clinicalPathwayBlocksHomeRx,
    clinicalPathwayRequiresImprovement,
    clinicalPathwayPsIdFromTh
  };
}
