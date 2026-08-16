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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'CURB-65 guia local. Receita VO só se apto à alta; não copiar dose hospitalar.'
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
    homeRx: 'curated',
    notes: 'Sintomáticos; ATB só com critério bacteriano. Não copiar dose hospitalar.'
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
    homeRx: 'curated',
    notes: 'Alta orientada só para síncope reflexa de baixo risco, com ECG e avaliação sem alarme.'
  },
  'tvp': {
    scores: ['wells-tvp'],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
    notes: 'DOAC oral após confirmação; não copiar heparina EV do PS.'
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
    homeRx: 'curated',
    notes: 'Medidas gerais; sem diurético automático.'
  },
  'flebite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated',
    notes: 'Anticoagulação não é automática; Doppler se extensão proximal/suspeita de TVP.'
  },
  'varizes-mmi': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'ulcera-varicosa': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated'
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
    homeRx: 'curated',
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Benzodiazepínico só curto; excluir causa orgânica.'
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'VO só se estável e sem sepse/obstrução.'
  },
  'celulite': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar extensão e sinais sistêmicos',
      question: 'Há melhora ou estabilidade suficiente para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true
  },
  'abscesso-cutaneo': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Confirmar controle do foco antes da alta',
      question: 'Coleção foi drenada quando indicada e o paciente está sem sinais sistêmicos?'
    },
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Antibiótico não substitui incisão e drenagem de coleção flutuante.'
  },
  'furunculose': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Confirmar controle do foco antes da alta',
      question: 'Lesão foi drenada quando indicada e não há celulite extensa ou sinais sistêmicos?'
    },
    outcomes: ['alta'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Carbúnculo, sepse ou progressão exigem observação/internação, não receita domiciliar isolada.'
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
    homeRx: 'curated',
    notes: 'Oftálmico, disseminado ou imunossupressão grave fora deste modelo de alta.'
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Alta só dengue A sem sinais de alarme; sem AINE; retorno obrigatório.'
  },
  'chikungunya': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
    notes: 'AINE só após afastar dengue.'
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
    homeRx: 'curated',
    notes: 'Evitar amoxicilina/ampicilina.'
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
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor, febre e tolerância oral',
      question: 'Diverticulite não complicada está estável para alta com antibiótico VO?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Hinchey complicada / peritonite fora deste modelo.'
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
    homeRx: 'curated',
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true
  },
  'constipacao': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'desconforto-abdominal': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated',
    notes: 'Só sem sinais de abdome agudo.'
  },
  'dispepsia-drge': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'hemorroidas': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'fissura-anal': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true
  },
  'gota': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated',
    notes: 'Não iniciar alopurinol na crise aguda.'
  },
  'colica-renal': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor e capacidade de VO',
      question: 'Dor controlada e paciente apto à alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Alta somente após cessar o sangramento; modelo prioriza hidratação nasal e prevenção.'
  },
  'conjuntivite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'hordeolo': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'corpo-estranho-ocular': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'transferencia'],
    homeRx: 'curated',
    notes: 'Receita apenas após remoção superficial completa e exclusão de perfuração.'
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
    homeRx: 'curated'
  },
  'queilite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },

  /* Gineco / obstetrícia / ITS */
  'ameaca-aborto': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'curated',
    notes: 'Alta orientada somente após avaliação obstétrica e exclusão de gestação ectópica.'
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
    homeRx: 'curated',
    notes: 'Modelo para paciente estável e com gestação excluída; hormônio requer avaliação individual.'
  },
  'vulvovaginites': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'candidiase': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'balanopostite': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
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
    homeRx: 'curated',
    notes: 'HSV VO; benzatina intramuscular no serviço se sífilis. Sem dose hospitalar automática.'
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Alta só após glicemias seriadas estáveis, causa definida, educação e suporte domiciliar.'
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Receita pós-observação: autoinjetor + anti-histamínico; não substitui observação.'
  },
  'edema-angioneurotico': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar vias aéreas e edema',
      question: 'Vias aéreas estáveis para observação/alta?'
    },
    outcomes: ['observacao', 'internacao', 'transferencia'],
    homeRx: 'curated',
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
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Modelo de alta apenas para exaustão pelo calor resolvida; golpe de calor é hospitalar.'
  },
  'queimaduras': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao', 'transferencia'],
    homeRx: 'curated',
    notes: 'Só queimadura leve de pequena extensão.'
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
    homeRx: 'curated',
    notes: 'Receita registra cuidados e agenda; vacina/imunoglobulina permanecem no serviço.'
  },

  /* Parasitoses / hematologia / miscelânea */
  'antiparasitarios': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'ascaridiase': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'parasitoses-intestinais': {
    scores: [],
    reassessment: null,
    outcomes: ['alta'],
    homeRx: 'curated'
  },
  'anemia-ferropriva': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated',
    notes: 'Reposição oral; investigar causa. Não copiar ferro parenteral do PS.'
  },
  'anemia-falciforme': {
    scores: [],
    reassessment: {
      trigger: 'after-initial-therapy',
      label: 'Reavaliar dor após analgesia',
      question: 'Dor controlada o suficiente para alta?'
    },
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
    requiresImprovementForDischarge: true,
    notes: 'Analgesia VO após melhora; sem opioide parenteral automático.'
  },
  'soluco-persistente': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao'],
    homeRx: 'curated'
  },
  'tuberculose': {
    scores: [],
    reassessment: null,
    outcomes: ['alta', 'observacao', 'internacao'],
    homeRx: 'curated',
    notes: 'RHZE sob programa de TB e notificação; não copiar esquema do PS automaticamente.'
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
