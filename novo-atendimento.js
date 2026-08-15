/* Novo atendimento — coleta inicial e contexto clínico da sessão */

const MEDHUB_NEW_ENCOUNTER_DRAFT = 'medhub-new-encounter-draft';
let novoAtendimentoQueixas = [];

function novoAtendimentoElements () {
  return {
    form: document.getElementById('novo-atendimento-form'),
    nome: document.getElementById('novo-atendimento-nome'),
    sexo: document.getElementById('novo-atendimento-sexo'),
    idade: document.getElementById('novo-atendimento-idade'),
    detalheWrap: document.getElementById('novo-atendimento-alergia-detalhe-wrap'),
    detalhe: document.getElementById('novo-atendimento-alergia-detalhe'),
    limpar: document.getElementById('novo-atendimento-limpar'),
    status: document.getElementById('novo-atendimento-status'),
    identificacaoHeader: document.getElementById('novo-atendimento-identificacao-header'),
    queixasPanel: document.getElementById('novo-atendimento-queixas-panel'),
    queixaForm: document.getElementById('novo-atendimento-queixa-form'),
    queixaInput: document.getElementById('novo-atendimento-queixa-input'),
    queixasList: document.getElementById('novo-atendimento-queixas-list'),
    queixasEmpty: document.getElementById('novo-atendimento-queixas-empty'),
    protocolo: document.getElementById('novo-atendimento-protocolo'),
    queixasStatus: document.getElementById('novo-atendimento-queixas-status'),
    salvarQueixas: document.getElementById('novo-atendimento-salvar-queixas'),
    voltarIdentificacao: document.getElementById('novo-atendimento-voltar-identificacao'),
    tratamentoPanel: document.getElementById('novo-atendimento-tratamento-panel'),
    tratamentoResumo: document.getElementById('novo-atendimento-tratamento-resumo'),
    txUnidade: document.getElementById('novo-atendimento-tx-unidade'),
    txCasa: document.getElementById('novo-atendimento-tx-casa'),
    voltarQueixas: document.getElementById('novo-atendimento-voltar-queixas'),
    irTratamento: document.getElementById('novo-atendimento-ir-tratamento'),
    novoPaciente: document.getElementById('novo-atendimento-novo-paciente'),
    resume: document.getElementById('novo-atendimento-resume'),
    resumeText: document.getElementById('novo-atendimento-resume-text'),
    resumeBtn: document.getElementById('novo-atendimento-resume-btn')
  };
}

function novoAtendimentoAllergyChoice () {
  return document.querySelector('input[name="novo-atendimento-alergia"]:checked')?.value || '';
}

function novoAtendimentoUpdateAllergyField () {
  const { detalheWrap, detalhe } = novoAtendimentoElements();
  const hasAllergy = novoAtendimentoAllergyChoice() === 'sim';
  if (detalheWrap) detalheWrap.hidden = !hasAllergy;
  if (detalhe) {
    detalhe.required = hasAllergy;
    if (!hasAllergy) detalhe.value = '';
  }
}

function novoAtendimentoSetStatus (text, type, target) {
  const el = target || novoAtendimentoElements().status;
  if (!el) return;
  el.textContent = text || '';
  el.className = 'novo-atendimento-status' + (type ? ` novo-atendimento-status--${type}` : '');
  el.hidden = !text;
}

function novoAtendimentoSyncAnamnese (data) {
  const mappings = {
    'anam-paciente': data.nome,
    'anam-sexo': data.sexo,
    'anam-idade': `${data.idade} anos`,
    'anam-alergias': data.alergias,
    'anam-queixa': (data.queixas || []).join('; ')
  };

  Object.entries(mappings).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
}

function novoAtendimentoReadDraft () {
  try {
    return JSON.parse(sessionStorage.getItem(MEDHUB_NEW_ENCOUNTER_DRAFT) || 'null');
  } catch {
    return null;
  }
}

function novoAtendimentoEscape (text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function novoAtendimentoNormalize (text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/* Termos leigos e abreviações reduzidos ao termo clínico usado nos fluxogramas */
const NOVO_ATENDIMENTO_SINONIMOS = [
  ['falta de ar', 'dispneia'],
  ['dificuldade para respirar', 'dispneia'],
  ['dificuldade de respirar', 'dispneia'],
  ['cansaco para respirar', 'dispneia'],
  ['sufocamento', 'dispneia'],
  ['chiado no peito', 'sibilancia'],
  ['chiado', 'sibilancia'],
  ['dor no peito', 'dor toracica'],
  ['aperto no peito', 'dor toracica'],
  ['queimacao no peito', 'dor toracica'],
  ['dor de cabeca', 'cefaleia'],
  ['dor de barriga', 'dor abdominal'],
  ['dor na barriga', 'dor abdominal'],
  ['dor de estomago', 'dor abdominal'],
  ['colica na barriga', 'dor abdominal'],
  ['dor nas costas', 'lombalgia'],
  ['dor lombar', 'lombalgia'],
  ['dor ao urinar', 'disuria'],
  ['ardencia ao urinar', 'disuria'],
  ['queimacao ao urinar', 'disuria'],
  ['dor de garganta', 'odinofagia'],
  ['dor de ouvido', 'otalgia'],
  ['dor de dente', 'odontalgia'],
  ['dor nas juntas', 'artralgia'],
  ['dor nas articulacoes', 'artralgia'],
  ['sangue nas fezes', 'sangramento digestivo'],
  ['fezes escuras', 'melena'],
  ['vomito com sangue', 'hematemese'],
  ['sangramento pelo nariz', 'epistaxe'],
  ['sangramento nasal', 'epistaxe'],
  ['nariz sangrando', 'epistaxe'],
  ['desmaio', 'sincope'],
  ['perda de consciencia', 'sincope'],
  ['perdeu a consciencia', 'sincope'],
  ['ataque epileptico', 'crise convulsiva'],
  ['convulsao', 'crise convulsiva'],
  ['convulsionando', 'crise convulsiva'],
  ['pressao alta', 'crise hipertensiva'],
  ['pressao muito alta', 'crise hipertensiva'],
  ['acucar baixo', 'hipoglicemia'],
  ['glicemia baixa', 'hipoglicemia'],
  ['acucar alto', 'hiperglicemia'],
  ['glicemia alta', 'hiperglicemia'],
  ['coracao acelerado', 'palpitacao'],
  ['coracao disparado', 'palpitacao'],
  ['batedeira', 'palpitacao'],
  ['boca torta', 'paralisia facial'],
  ['perda de forca de um lado', 'hemiparesia'],
  ['fraqueza de um lado', 'hemiparesia'],
  ['fala arrastada', 'disartria'],
  ['nao consegue falar', 'afasia'],
  ['bateu a cabeca', 'trauma cranioencefalico'],
  ['batida na cabeca', 'trauma cranioencefalico'],
  ['tce', 'trauma cranioencefalico'],
  ['mordida de cachorro', 'mordedura animal'],
  ['mordida de cao', 'mordedura animal'],
  ['mordida de gato', 'mordedura animal'],
  ['picada de cobra', 'acidente ofidico'],
  ['picada de escorpiao', 'escorpionismo'],
  ['picada de abelha', 'reacao alergica'],
  ['coceira', 'prurido'],
  ['manchas na pele', 'lesao de pele'],
  ['ferida infectada', 'lesao de pele'],
  ['perna inchada', 'edema de membros inferiores'],
  ['pernas inchadas', 'edema de membros inferiores'],
  ['inchaco nas pernas', 'edema de membros inferiores'],
  ['olho vermelho', 'hiperemia ocular'],
  ['vista embacada', 'alteracao visual'],
  ['corrimento vaginal', 'corrimento genital'],
  ['sangramento vaginal', 'sangramento uterino'],
  ['nao consegue evacuar', 'constipacao'],
  ['intestino preso', 'constipacao'],
  ['confusao mental', 'confusao aguda'],
  ['fora de si', 'confusao aguda'],
  ['muito sonolento', 'rebaixamento do nivel de consciencia'],
  ['nao acorda', 'rebaixamento do nivel de consciencia'],
  ['bebeu muito', 'intoxicacao alcoolica'],
  ['tomou remedio demais', 'intoxicacao exogena'],
  ['tentativa de suicidio', 'intoxicacao exogena'],
  ['queimou', 'queimadura'],
  ['gestante', 'gravidez'],
  ['gravida', 'gravidez'],
  ['bebe', 'lactente'],
  ['nenem', 'lactente'],
  ['recem nascido', 'neonato']
];

const NOVO_ATENDIMENTO_STOPWORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'com', 'sem', 'em', 'no', 'na', 'nos', 'nas',
  'por', 'para', 'ao', 'aos', 'a', 'o', 'as', 'os', 'um', 'uma', 'e', 'ou',
  'ha', 'muito', 'muita', 'pouco', 'leve', 'forte', 'agudo', 'aguda', 'agudos',
  'agudas', 'cronico', 'cronica', 'suspeita', 'suspeito', 'quadro', 'paciente',
  'referida', 'referido', 'queixa', 'dias', 'dia', 'horas', 'hora', 'hoje'
]);

/* Palavras genéricas: sozinhas só casam com alvos de um único termo */
const NOVO_ATENDIMENTO_TERMOS_GENERICOS = new Set([
  'dor', 'crise', 'mal', 'edema', 'inchaco', 'sangramento', 'lesao', 'alteracao', 'perda'
]);

const NOVO_ATENDIMENTO_EMERGENCY_ROUTES = [
  {
    topic: 'parada-cardio', protocol: 'acls-adulto', icon: '⚡',
    aliases: ['parada cardiorrespiratoria', 'parada cardiaca', 'pcr', 'aesp', 'assistolia', 'fibrilacao ventricular', 'fv', 'tv sem pulso', 'sem pulso', 'morte subita', 'inconsciente sem pulso'],
    alert: 'Parada cardiorrespiratória: acione ajuda, inicie RCP de alta qualidade e conecte o desfibrilador.'
  },
  { topic: 'parada-cardio', protocol: 'bls-adulto', icon: '🫀', aliases: ['bls', 'suporte basico de vida'] },
  { topic: 'parada-cardio', protocol: 'pals-ped', icon: '👶', aliases: ['pals', 'parada pediatrica', 'pcr pediatrica'] },
  { topic: 'parada-cardio', protocol: 'bradicardia', icon: '🐢', aliases: ['bradicardia', 'pulso lento', 'ritmo lento', 'bradiarritmia', 'bloqueio atrioventricular', 'bav'] },
  { topic: 'parada-cardio', protocol: 'taquicardia', icon: '⚡', aliases: ['taquicardia instavel', 'taquiarritmia instavel', 'tv com pulso', 'torsades', 'taquicardia', 'tsv', 'taquicardia supraventricular', 'fibrilacao atrial instavel', 'flutter instavel'] },
  { topic: 'parada-cardio', protocol: 'rosc', icon: '✅', aliases: ['rosc', 'pos pcr', 'retorno da circulacao espontanea', 'cuidados pos parada'] },

  {
    topic: 'sca', protocol: 'dor-inicial', icon: '❤️‍🔥', chest: true,
    aliases: ['dor toracica', 'dor no peito', 'precordialgia', 'angina', 'sindrome coronariana aguda', 'sca', 'infarto', 'iam', 'desconforto toracico', 'dor retroesternal', 'equivalente anginoso'],
    alert: 'Dor torácica: realizar ECG de 12 derivações em até 10 minutos.'
  },
  { topic: 'sca', protocol: 'stemi', icon: '🚨', aliases: ['stemi', 'iam com supra', 'infarto com supra', 'iamcsst'] },
  { topic: 'sca', protocol: 'nstemi-ua', icon: '❤️', aliases: ['nstemi', 'iam sem supra', 'infarto sem supra', 'iamsst', 'angina instavel'] },
  { topic: 'sca', protocol: 'ecg-modelos', icon: '📈', aliases: ['modelos de ecg', 'padroes de ecg', 'ecg sca'] },

  {
    topic: 'avc', protocol: 'fast', icon: '🧠',
    aliases: ['avc', 'ave', 'derrame', 'deficit neurologico focal', 'hemiparesia', 'hemiplegia', 'paralisia facial', 'desvio de rima', 'afasia', 'disartria', 'fraqueza subita', 'alteracao subita da fala'],
    alert: 'Suspeita de AVC: registrar o último momento bem e ativar avaliação neurológica imediatamente.'
  },
  { topic: 'avc', protocol: 'trombolise', icon: '💉', aliases: ['trombolise avc', 'alteplase avc', 'tenecteplase avc'] },
  { topic: 'avc', protocol: 'trombectomia', icon: '🧠', aliases: ['trombectomia', 'oclusao de grande vaso'] },
  { topic: 'avc', protocol: 'nihss', icon: '📋', aliases: ['nihss', 'escala nihss'] },

  {
    topic: 'sepse', protocol: 'bundle-hora1', icon: '🩸',
    aliases: ['sepse', 'choque septico', 'septicemia', 'infeccao com disfuncao organica', 'febre com hipotensao', 'infeccao grave', 'qsofa positivo'],
    alert: 'Suspeita de sepse: avaliar disfunção orgânica e iniciar o Bundle Hora-1 sem atraso.'
  },
  /* Febre isolada entra como rastreio (sem alerta vermelho) — o Bundle continua a um clique */
  { topic: 'sepse', protocol: 'bundle-hora1', icon: '🩸', aliases: ['febre', 'hipertermia', 'calafrios', 'febre alta', 'infeccao'] },
  { topic: 'sepse', protocol: 'norepi-map', icon: '💉', aliases: ['noradrenalina', 'norepinefrina', 'choque refratario', 'hipotensao refrataria', 'choque'] },
  { topic: 'sepse', protocol: 'lactato-reavaliacao', icon: '🧪', aliases: ['lactato elevado', 'reavaliacao de lactato', 'hiperlactatemia'] },

  {
    topic: 'trauma', protocol: 'atls-abcde', icon: '🆘',
    aliases: ['trauma', 'politrauma', 'atropelamento', 'acidente automobilistico', 'acidente de moto', 'ferimento por arma de fogo', 'ferimento por arma branca', 'agressao fisica', 'esfaqueamento', 'ferimento grave', 'acidente de carro'],
    alert: 'Trauma: priorizar avaliação primária ABCDE e tratar ameaças imediatas à vida.'
  },
  { topic: 'trauma', protocol: 'via-aerea-vortex', icon: '🌪️', aliases: ['via aerea dificil', 'intubacao dificil', 'nao intuba nao ventila', 'obstrucao de via aerea', 'estridor', 'engasgo'] },
  { topic: 'trauma', protocol: 'mtp-transfusao', icon: '🩸', aliases: ['hemorragia macica', 'transfusao macica', 'choque hemorragico', 'sangramento macico'] },
  { topic: 'trauma', protocol: 'pecarn-tce', icon: '👶', aliases: ['tce pediatrico', 'trauma craniano pediatrico', 'queda crianca', 'trauma cranioencefalico'] },
  { topic: 'trauma', protocol: 'queda-propria-altura-tc', icon: '🧓', aliases: ['queda da propria altura', 'queda em idoso', 'queda idoso', 'queda'] },

  { topic: 'via-aerea', protocol: 'rsi-7-passos', icon: '🌬️', aliases: ['sequencia rapida de intubacao', 'intubacao orotraqueal', 'iot', 'rsi', 'insuficiencia respiratoria', 'rebaixamento do nivel de consciencia', 'glasgow baixo'] },
  { topic: 'via-aerea', protocol: 'ventilacao-mecanica', icon: '🫁', aliases: ['ventilacao mecanica', 'ajuste ventilatorio', 'parametros ventilatorios'] },
  { topic: 'via-aerea', protocol: 'dope-pos-iot', icon: '🚨', aliases: ['hipoxemia pos iot', 'dessaturacao pos intubacao', 'dope'] },
  { topic: 'via-aerea', protocol: 'desmame-ventilatorio', icon: '🫁', aliases: ['desmame ventilatorio', 'extubacao'] },

  {
    topic: 'reacoes-metabolicas', protocol: 'anafilaxia', icon: '💉',
    aliases: ['anafilaxia', 'choque anafilatico', 'reacao alergica grave', 'edema de glote', 'angioedema', 'urticaria com dispneia'],
    alert: 'Anafilaxia: administrar adrenalina IM imediatamente; não aguardar acesso venoso.'
  },
  {
    topic: 'reacoes-metabolicas', protocol: 'hipoglicemia-grave', icon: '🍬',
    aliases: ['hipoglicemia', 'glicemia baixa', 'coma hipoglicemico'],
    alert: 'Hipoglicemia: confirmar glicemia e corrigir imediatamente se houver alteração de consciência.'
  },
  {
    topic: 'reacoes-metabolicas', protocol: 'hipercalemia', icon: '⚡',
    aliases: ['hipercalemia', 'potassio alto', 'hiperpotassemia'],
    alert: 'Hipercalemia grave ou com alteração no ECG: estabilizar membrana e iniciar medidas de redução do potássio.'
  },
  {
    topic: 'reacoes-metabolicas', protocol: 'dka-hhs', icon: '🧪',
    aliases: ['cetoacidose diabetica', 'cad', 'estado hiperosmolar', 'ehh', 'coma hiperosmolar', 'hiperglicemia', 'descompensacao diabetica'],
    alert: 'Crise hiperglicêmica: avaliar volume, potássio, cetonas, gasometria e osmolaridade antes da insulina.'
  },

  { topic: 'obstetricia', protocol: 'preeclampsia-eclampsia', icon: '🤰', aliases: ['pre eclampsia', 'preeclampsia', 'eclampsia', 'convulsao na gestante', 'crise convulsiva na gestante', 'hipertensao gestacional', 'cefaleia na gravidez', 'gravidez com hipertensao'] },
  { topic: 'obstetricia', protocol: 'hemorragia-pos-parto', icon: '🩸', aliases: ['hemorragia pos parto', 'sangramento pos parto', 'atonia uterina'] },
  { topic: 'obstetricia', protocol: 'prolapso-cordao', icon: '🚨', aliases: ['prolapso de cordao', 'cordao prolapsado', 'trabalho de parto com bradicardia fetal'] },

  { topic: 'pediatrica', protocol: 'pcr-pediatrico', icon: '👶', aliases: ['parada cardiorrespiratoria pediatrica', 'pcr infantil', 'parada em crianca'] },
  { topic: 'pediatrica', protocol: 'bronquiolite', icon: '👶', aliases: ['bronquiolite', 'vsl', 'virus sincicial respiratorio', 'sibilancia no lactente', 'lactente com dispneia'] },
  { topic: 'pediatrica', protocol: 'broselow-doses', icon: '📏', aliases: ['broselow', 'doses pediatricas de emergencia', 'dose pediatrica'] },

  { topic: 'toxicologia', protocol: 'overdose-opioide', icon: '☠️', aliases: ['overdose de opioide', 'intoxicacao por opioide', 'morfina overdose', 'fentanil overdose', 'heroina overdose', 'miose com apneia'] },
  { topic: 'toxicologia', protocol: 'paracetamol-rumack', icon: '💊', aliases: ['intoxicacao por paracetamol', 'overdose de paracetamol', 'acetaminofeno overdose', 'intoxicacao exogena'] },
  { topic: 'toxicologia', protocol: 'hipertermia-maligna-calor', icon: '🔥', aliases: ['hipertermia maligna', 'golpe de calor', 'insolacao grave', 'exposicao ao calor'] },
  { topic: 'toxicologia', protocol: 'hipotermia-swiss', icon: '❄️', aliases: ['hipotermia', 'exposicao ao frio'] },

  { topic: 'pressao-arritmias', protocol: 'crise-hipertensiva', icon: '🔺', aliases: ['crise hipertensiva', 'emergencia hipertensiva', 'hipertensao grave', 'pressao muito alta', 'urgencia hipertensiva'] },
  { topic: 'pressao-arritmias', protocol: 'wpw-instavel', icon: '⚡', aliases: ['wolff parkinson white', 'wpw', 'pre excitacao instavel', 'palpitacao', 'arritmia'] },

  { topic: 'procedimentos', protocol: 'sedasia', icon: '💤', aliases: ['sedacao', 'sedacao para procedimento', 'sedasia', 'analgesia para procedimento'] },
  { topic: 'procedimentos', protocol: 'puncao-lombar', icon: '🛠️', aliases: ['puncao lombar', 'coleta de liquor', 'suspeita de meningite', 'meningite'] },
  { topic: 'procedimentos', protocol: 'iot-covid-safe', icon: '😷', aliases: ['intubacao covid', 'iot covid', 'covid grave'] }
];

/* Queixa/sintoma → condutas de Prescrições de PS (diferenciais mais prováveis primeiro) */
const NOVO_ATENDIMENTO_PS_ROUTES = [
  { aliases: ['dispneia', 'sibilancia', 'insuficiencia respiratoria', 'desconforto respiratorio', 'taquipneia'], ps: ['asma-broncoespasmo', 'dpoc-exacerbada', 'pneumonia-comunitaria', 'edema-agudo-pulmao', 'tep', 'bronquite-aguda'] },
  { aliases: ['dor toracica', 'precordialgia', 'angina', 'infarto', 'sca'], ps: ['sca-iam', 'tep', 'arritmias', 'dispepsia-drge'] },
  { aliases: ['cefaleia', 'enxaqueca', 'migranea'], ps: ['cefaleias', 'sinusite-aguda', 'crise-hipertensiva', 'meningite-bacteriana'] },
  { aliases: ['febre', 'calafrios', 'hipertermia', 'sindrome febril'], ps: ['gripe-influenza', 'pneumonia-comunitaria', 'pielonefrite', 'dengue', 'amigdalite-bacteriana', 'sepse-choque-septico', 'malaria', 'leptospirose', 'chikungunya'] },
  { aliases: ['dor abdominal', 'abdome agudo', 'colica abdominal', 'dor epigastrica'], ps: ['abdome-agudo', 'apendicite-aguda', 'colecistite-aguda', 'colica-renal', 'pancreatite-aguda', 'diverticulite', 'dispepsia-drge', 'desconforto-abdominal'] },
  { aliases: ['nausea', 'vomito', 'emese', 'enjoo'], ps: ['vomitos-agudos', 'dispepsia-drge', 'diarreia-gastroenterite', 'cetoacidose-diabetica'] },
  { aliases: ['diarreia', 'gastroenterite', 'disenteria'], ps: ['diarreia-gastroenterite', 'parasitoses-intestinais', 'disturbios-eletroliticos', 'antiparasitarios'] },
  { aliases: ['tosse', 'expectoracao', 'catarro'], ps: ['tosse', 'bronquite-aguda', 'pneumonia-comunitaria', 'asma-broncoespasmo', 'gripe-influenza', 'tuberculose', 'dpoc-exacerbada'] },
  { aliases: ['tontura', 'vertigem', 'labirintite', 'desequilibrio'], ps: ['sindrome-vestibular', 'sincope', 'anemia-ferropriva', 'crise-hipertensiva', 'disturbios-eletroliticos'] },
  { aliases: ['sincope', 'lipotimia', 'pre sincope'], ps: ['sincope', 'arritmias', 'disturbios-eletroliticos', 'anemia-ferropriva'] },
  { aliases: ['palpitacao', 'taquicardia', 'arritmia'], ps: ['arritmias', 'crise-tireotoxica', 'ansiedade-crise', 'cardioversao-eletrica'] },
  { aliases: ['disuria', 'polaciuria', 'urina com sangue', 'hematuria', 'infeccao urinaria', 'itu'], ps: ['cistite-itu-baixa', 'pielonefrite', 'colica-renal', 'gonorreia-clamidia'] },
  { aliases: ['lombalgia', 'ciatalgia', 'dor cervical', 'torcicolo'], ps: ['lombalgia-ciatalgia', 'colica-renal', 'pielonefrite', 'artralgia-dor-msk'] },
  { aliases: ['crise convulsiva', 'estado de mal epileptico', 'epilepsia'], ps: ['crise-convulsiva-em', 'hipoglicemia-grave', 'meningite-bacteriana', 'eclampsia-pre-eclampsia'] },
  { aliases: ['confusao aguda', 'delirium', 'agitacao psicomotora', 'desorientacao'], ps: ['delirium', 'hipoglicemia-grave', 'disturbios-eletroliticos', 'pielonefrite', 'intoxicacoes-exogenas'] },
  { aliases: ['odinofagia', 'faringite', 'amigdalite'], ps: ['amigdalite-bacteriana', 'mononucleose', 'gripe-influenza', 'afta-estomatite'] },
  { aliases: ['otalgia', 'otite', 'secrecao no ouvido'], ps: ['otite-media', 'otite-externa'] },
  { aliases: ['obstrucao nasal', 'coriza', 'espirros', 'rinite', 'sinusite'], ps: ['rinite-alergica', 'sinusite-aguda', 'gripe-influenza'] },
  { aliases: ['hiperemia ocular', 'secrecao ocular', 'olho', 'conjuntivite', 'alteracao visual'], ps: ['conjuntivite', 'corpo-estranho-ocular', 'hordeolo', 'trauma-ocular'] },
  { aliases: ['lesao de pele', 'ferida', 'celulite', 'abscesso', 'pus na pele', 'erisipela'], ps: ['celulite', 'erisipela', 'abscesso-cutaneo', 'impetigo', 'furunculose', 'herpes-zoster', 'ulcera-varicosa'] },
  { aliases: ['prurido', 'urticaria', 'reacao alergica', 'coceira na pele'], ps: ['alergia-anafilaxia', 'edema-angioneurotico', 'escabiose', 'micoses-superficiais', 'rinite-alergica'] },
  { aliases: ['edema de membros inferiores', 'panturrilha dolorosa', 'trombose'], ps: ['edema-mmi', 'tvp', 'varizes-mmi', 'erisipela', 'edema-agudo-pulmao'] },
  { aliases: ['epistaxe'], ps: ['epistaxe', 'crise-hipertensiva'] },
  { aliases: ['sangramento digestivo', 'melena', 'hematemese', 'hemorragia digestiva'], ps: ['hda', 'dispepsia-drge', 'hemorroidas', 'fissura-anal'] },
  { aliases: ['dor anal', 'sangramento anal', 'hemorroida'], ps: ['hemorroidas', 'fissura-anal', 'constipacao'] },
  { aliases: ['constipacao', 'flatulencia', 'distensao abdominal'], ps: ['constipacao', 'desconforto-abdominal', 'abdome-agudo'] },
  { aliases: ['sangramento uterino', 'metrorragia', 'sangramento na gravidez'], ps: ['sangramento-uterino', 'ameaca-aborto', 'eclampsia-pre-eclampsia'] },
  { aliases: ['corrimento genital', 'prurido vaginal', 'vulvovaginite'], ps: ['vulvovaginites', 'candidiase', 'gonorreia-clamidia', 'ulceras-genitais'] },
  { aliases: ['lesao genital', 'ferida genital', 'ist', 'dst'], ps: ['ulceras-genitais', 'gonorreia-clamidia', 'balanopostite', 'violencia-sexual-pep'] },
  { aliases: ['artralgia', 'artrite', 'dor articular', 'gota'], ps: ['gota', 'artralgia-dor-msk', 'chikungunya', 'anemia-falciforme'] },
  { aliases: ['hipoglicemia'], ps: ['hipoglicemia-grave', 'diabetes-insulina-hipo'] },
  { aliases: ['hiperglicemia', 'cetoacidose', 'estado hiperosmolar'], ps: ['cetoacidose-diabetica', 'estado-hiperosmolar', 'diabetes-insulina-hipo'] },
  { aliases: ['crise hipertensiva', 'hipertensao'], ps: ['crise-hipertensiva', 'edema-agudo-pulmao', 'sca-iam'] },
  { aliases: ['intoxicacao alcoolica', 'abstinencia alcoolica', 'alcoolismo'], ps: ['alcoolismo-intox-abstinencia', 'abstinencia-alcoolica', 'intoxicacoes-exogenas'] },
  { aliases: ['intoxicacao exogena', 'overdose', 'ingestao de medicamento'], ps: ['intoxicacoes-exogenas', 'alcoolismo-intox-abstinencia'] },
  { aliases: ['queimadura', 'insolacao'], ps: ['queimaduras', 'insolacao'] },
  { aliases: ['mordedura animal', 'arranhadura de gato'], ps: ['profilaxia-antirrabica', 'celulite', 'abscesso-cutaneo'] },
  { aliases: ['acidente ofidico', 'picada de animal', 'escorpionismo'], ps: ['acidente-ofidico', 'escorpionismo', 'alergia-anafilaxia', 'profilaxia-antirrabica'] },
  { aliases: ['trauma', 'politrauma', 'queda', 'acidente'], ps: ['trauma-atls', 'trauma-ocular', 'queimaduras', 'artralgia-dor-msk'] },
  { aliases: ['ansiedade', 'crise de panico', 'nervosismo'], ps: ['ansiedade-crise', 'crise-tireotoxica'] },
  { aliases: ['soluco'], ps: ['soluco-persistente'] },
  { aliases: ['perda de peso', 'emagrecimento', 'sudorese noturna'], ps: ['tuberculose', 'crise-tireotoxica', 'anemia-ferropriva'] },
  { aliases: ['palidez', 'fraqueza', 'astenia', 'cansaco'], ps: ['anemia-ferropriva', 'anemia-falciforme', 'disturbios-eletroliticos', 'sepse-choque-septico'] },
  { aliases: ['violencia sexual', 'estupro', 'abuso sexual'], ps: ['violencia-sexual-pep', 'ulceras-genitais'] },
  { aliases: ['dor de dente', 'odontalgia', 'lesao na boca', 'afta'], ps: ['afta-estomatite', 'queilite', 'amigdalite-bacteriana'] },
  { aliases: ['micose', 'frieira', 'unha', 'tinea'], ps: ['micoses-superficiais', 'tinea', 'frieira', 'escabiose', 'pediculose'] },
  { aliases: ['piolho', 'pediculose', 'sarna', 'escabiose'], ps: ['pediculose', 'escabiose'] },
  { aliases: ['verme', 'parasitose', 'giardiase', 'amebiase', 'oxiurose', 'ascaridiase'], ps: ['parasitoses-intestinais', 'ascaridiase', 'antiparasitarios'] },
  { aliases: ['dor no cateter', 'flebite', 'dor no acesso venoso'], ps: ['flebite', 'celulite'] }
];

function novoAtendimentoAplicarSinonimos (text) {
  let value = ` ${novoAtendimentoNormalize(text)} `;
  NOVO_ATENDIMENTO_SINONIMOS.forEach(([termo, clinico]) => {
    value = value.split(` ${termo} `).join(` ${clinico} `);
  });
  return value.trim();
}

/* Reduz plurais comuns do português para comparar "vômitos" com "vômito" */
function novoAtendimentoRadical (token) {
  if (token.length <= 3) return token;
  if (token.endsWith('oes') || token.endsWith('aes')) return `${token.slice(0, -3)}ao`;
  if (token.endsWith('ais')) return `${token.slice(0, -3)}al`;
  if (token.endsWith('eis')) return `${token.slice(0, -3)}el`;
  if (token.endsWith('ns')) return `${token.slice(0, -2)}m`;
  if (token.endsWith('s')) return token.slice(0, -1);
  return token;
}

function novoAtendimentoTermos (text) {
  const termos = novoAtendimentoAplicarSinonimos(text)
    .split(' ')
    .filter(Boolean)
    .filter(token => !NOVO_ATENDIMENTO_STOPWORDS.has(token))
    .map(novoAtendimentoRadical)
    .filter(token => token.length > 1);
  return [...new Set(termos)];
}

/**
 * Casa queixa e alvo. No modo estrito (apelidos curados) todos os termos do alvo
 * precisam estar na queixa, para "dispneia" não puxar "urticária com dispneia".
 * No modo parcial (nomes longos de protocolos e condutas) basta a queixa estar
 * contida no nome, para "cefaleia" encontrar "Cefaleias (tensional, enxaqueca…)".
 */
function novoAtendimentoTermosCasam (queixaTermos, alvoTermos, parcial) {
  if (!queixaTermos.length || !alvoTermos.length) return false;
  const comuns = alvoTermos.filter(token => queixaTermos.includes(token));
  if (!comuns.length) return false;

  if (queixaTermos.length === 1 &&
      NOVO_ATENDIMENTO_TERMOS_GENERICOS.has(queixaTermos[0]) &&
      alvoTermos.length > 1) {
    return false;
  }

  if (comuns.length === alvoTermos.length) return true;
  return !!parcial && comuns.length === queixaTermos.length;
}

function novoAtendimentoCasaLista (queixaTermos, lista, parcial) {
  return (lista || []).some(item =>
    novoAtendimentoTermosCasam(queixaTermos, novoAtendimentoTermos(item), parcial)
  );
}

let novoAtendimentoEmergencyIndexCache = null;

/** Rotas curadas + nome de cada protocolo do guia, para que nenhum fluxograma fique órfão */
function novoAtendimentoEmergencyIndex () {
  if (novoAtendimentoEmergencyIndexCache) return novoAtendimentoEmergencyIndexCache;

  const routes = NOVO_ATENDIMENTO_EMERGENCY_ROUTES.map(route => ({
    ...route,
    aliases: [...route.aliases],
    nomes: []
  }));

  if (typeof EMERGENCY_TOPICS !== 'undefined') {
    EMERGENCY_TOPICS.forEach(topic => {
      (topic.protocols || []).forEach(protocol => {
        const nome = String(protocol.name || '').replace(/\s*[—–-]\s*/g, ' ');
        const curadas = routes.filter(route => route.topic === topic.id && route.protocol === protocol.id);
        if (curadas.length) {
          curadas[0].nomes.push(nome);
          return;
        }
        routes.push({
          topic: topic.id,
          protocol: protocol.id,
          icon: protocol.icon || '🚨',
          aliases: [],
          nomes: [nome]
        });
      });
    });
  }

  novoAtendimentoEmergencyIndexCache = routes;
  return routes;
}

function novoAtendimentoEmergencyMatches (queixas) {
  const lista = queixas || novoAtendimentoQueixas;
  const matches = [];

  lista.forEach(queixa => {
    const termos = novoAtendimentoTermos(queixa);
    novoAtendimentoEmergencyIndex().forEach(route => {
      const casou = novoAtendimentoCasaLista(termos, route.aliases, false) ||
        novoAtendimentoCasaLista(termos, route.nomes, true);
      if (!casou) return;
      const key = `${route.topic}:${route.protocol}`;
      if (!matches.some(item => item.key === key)) matches.push({ ...route, key, queixa });
    });
  });

  return matches;
}

function novoAtendimentoPsCondition (conditionId) {
  if (typeof PS_CONDITIONS === 'undefined') return null;
  return PS_CONDITIONS.find(condition => condition.id === conditionId) || null;
}

/** Condutas de PS ligadas à queixa: mapa curado + nome de todas as 106 condições */
function novoAtendimentoPsMatches (queixas) {
  const lista = queixas || novoAtendimentoQueixas;
  const matches = [];

  const adicionar = (conditionId, queixa) => {
    const condition = novoAtendimentoPsCondition(conditionId);
    if (!condition) return;
    if (matches.some(item => item.id === condition.id)) return;
    matches.push({ id: condition.id, name: condition.name, icon: condition.icon || '📋', queixa });
  };

  lista.forEach(queixa => {
    const termos = novoAtendimentoTermos(queixa);

    NOVO_ATENDIMENTO_PS_ROUTES.forEach(route => {
      if (!novoAtendimentoCasaLista(termos, route.aliases, false)) return;
      route.ps.forEach(conditionId => adicionar(conditionId, queixa));
    });

    if (typeof PS_CONDITIONS !== 'undefined') {
      PS_CONDITIONS.forEach(condition => {
        if (novoAtendimentoTermosCasam(termos, novoAtendimentoTermos(condition.name), true)) {
          adicionar(condition.id, queixa);
        }
      });
    }
  });

  return matches;
}

function novoAtendimentoEmergencyProtocolMeta (route) {
  if (typeof EMERGENCY_TOPICS !== 'undefined') {
    const topic = EMERGENCY_TOPICS.find(item => item.id === route.topic);
    const protocol = topic?.protocols?.find(item => item.id === route.protocol);
    if (topic && protocol) return { topic: topic.name, name: protocol.name, icon: protocol.icon || route.icon };
  }
  return { topic: 'Guia de emergência', name: route.protocol, icon: route.icon || '🚨' };
}

function novoAtendimentoContexto () {
  const data = novoAtendimentoReadDraft();
  return data?.nome ? data : null;
}

function novoAtendimentoIdadeNumero (data) {
  const idade = parseInt(String(data?.idade || '').replace(/\D/g, ''), 10);
  return Number.isFinite(idade) ? idade : null;
}

function novoAtendimentoMountContexto (container) {
  container?.querySelector('#novo-atendimento-contexto')?.remove();
  const data = novoAtendimentoContexto();
  if (!container || !data) return;

  const idade = novoAtendimentoIdadeNumero(data);
  const resumo = [
    idade !== null ? `${idade} anos` : '',
    data.sexo || '',
    (data.queixas || []).join(' · ')
  ].filter(Boolean).map(novoAtendimentoEscape).join(' · ');

  container.insertAdjacentHTML('afterbegin', `
    <aside id="novo-atendimento-contexto" class="novo-atendimento-contexto">
      <div>
        <p class="novo-atendimento-step">Atendimento em andamento</p>
        <strong>${novoAtendimentoEscape(data.nome)}</strong>
        <span>${resumo}</span>
      </div>
      <span class="novo-atendimento-contexto-alergia">
        Alergias: ${novoAtendimentoEscape(data.alergias || 'não informadas')}
      </span>
    </aside>`);
}

function novoAtendimentoMarkPrefilled (field) {
  field.classList.add('novo-atendimento-prefilled');
  field.title = 'Preenchido com os dados do atendimento';
}

function novoAtendimentoPrefillCalc (form) {
  const data = novoAtendimentoContexto();
  if (!form || !data) return;

  const idade = novoAtendimentoIdadeNumero(data);

  const idadeField = form.querySelector('input[name="idade"]');
  if (idadeField && idade !== null && !idadeField.value) {
    idadeField.value = idade;
    novoAtendimentoMarkPrefilled(idadeField);
  }

  const sexoField = form.querySelector('select[name="sexo"]');
  const sexo = novoAtendimentoNormalize(data.sexo).charAt(0);
  if (sexoField && (sexo === 'f' || sexo === 'm')) {
    const opcao = Array.from(sexoField.options).find(option =>
      novoAtendimentoNormalize(option.value).charAt(0) === sexo ||
      novoAtendimentoNormalize(option.textContent).charAt(0) === sexo
    );
    if (opcao) {
      sexoField.value = opcao.value;
      novoAtendimentoMarkPrefilled(sexoField);
    }
  }

  // TIMI UA/NSTEMI não tem campo de idade: o primeiro item já é "idade ≥ 65 anos"
  const idadeCheck = form.querySelector('input[name="t1"]');
  if (idadeCheck && idade !== null && idade >= 65) {
    idadeCheck.checked = true;
    novoAtendimentoMarkPrefilled(idadeCheck.closest('label') || idadeCheck);
  }
}

function novoAtendimentoOpenEmergencyProtocol (topicId, protocolId) {
  if (typeof showSection === 'function') showSection('guia-emergencia');
  window.setTimeout(() => {
    if (typeof initGuiaEmergencia === 'function') initGuiaEmergencia();
    if (typeof showEmergenciaTopic === 'function') showEmergenciaTopic(topicId);
    if (typeof showEmergenciaProtocol === 'function') showEmergenciaProtocol(protocolId);
    novoAtendimentoMountContexto(document.getElementById('emerg-topic-content'));
  }, 80);
}

function novoAtendimentoOpenPsCondition (conditionId) {
  if (typeof showSection === 'function') showSection('pronto-socorro');
  window.setTimeout(() => {
    if (typeof initProntoSocorro === 'function') initProntoSocorro();
    if (typeof showProntoSocorroCondition === 'function') showProntoSocorroCondition(conditionId);
    novoAtendimentoMountContexto(document.getElementById('ps-condition-content'));
  }, 80);
}

function novoAtendimentoOpenPsBusca (query) {
  if (typeof showSection === 'function') showSection('pronto-socorro');
  window.setTimeout(() => {
    if (typeof initProntoSocorro === 'function') initProntoSocorro();
    if (typeof showProntoSocorroHome === 'function') showProntoSocorroHome();
    novoAtendimentoPrefillSearch('pronto-socorro', query);
  }, 80);
}

function novoAtendimentoOpenChestProtocol () {
  novoAtendimentoOpenEmergencyProtocol('sca', 'dor-inicial');
}

function novoAtendimentoOpenScore (scoreId) {
  if (typeof showSection === 'function') showSection('calc-essenciais');
  window.setTimeout(() => {
    if (typeof initCalcEssenciais === 'function') initCalcEssenciais();
    if (typeof showCalcArea === 'function') showCalcArea('cardiologia');
    if (typeof showCalcTool === 'function') showCalcTool(scoreId);

    const content = document.getElementById('calc-area-content');
    novoAtendimentoMountContexto(content);
    novoAtendimentoPrefillCalc(content?.querySelector('form.calc-form'));
  }, 80);
}

function novoAtendimentoRenderProtocol () {
  const { protocolo } = novoAtendimentoElements();
  if (!protocolo) return;

  if (!novoAtendimentoQueixas.length) {
    protocolo.hidden = true;
    protocolo.innerHTML = '';
    return;
  }

  const matches = novoAtendimentoEmergencyMatches().slice(0, 8);
  const psMatches = novoAtendimentoPsMatches().slice(0, 9);

  if (!matches.length && !psMatches.length) {
    protocolo.hidden = false;
    protocolo.innerHTML = `
      <div class="novo-atendimento-protocolo-body">
        <div class="novo-atendimento-protocolo-heading">
          <div>
            <p class="novo-atendimento-step">Nenhum fluxograma reconhecido</p>
            <h3>Buscar conduta pelas queixas informadas</h3>
          </div>
        </div>
        <p class="muted">Use outro termo (ex.: “dispneia”, “dor abdominal”) ou pesquise direto nas Prescrições de PS.</p>
        <div class="novo-atendimento-protocolo-score-buttons">
          <button type="button" data-open-ps-search="${novoAtendimentoEscape(novoAtendimentoQueixas[0])}">
            <strong>Abrir Prescrições de PS</strong><span>Busca preenchida com a queixa</span>
          </button>
        </div>
      </div>`;
    protocolo.querySelectorAll('[data-open-ps-search]').forEach(button => {
      button.addEventListener('click', () => novoAtendimentoOpenPsBusca(button.dataset.openPsSearch));
    });
    return;
  }

  protocolo.hidden = false;
  const alerts = matches.filter(route => route.alert);
  const hasChest = matches.some(route => route.chest);

  protocolo.innerHTML = `
    ${alerts.map(route => `
      <div class="novo-atendimento-protocolo-alert" role="alert">
        <span class="novo-atendimento-protocolo-alert-icon" aria-hidden="true">${route.icon || '⚡'}</span>
        <div>
          <strong>${novoAtendimentoEscape(route.alert)}</strong>
          <span>Protocolo identificado pela queixa “${novoAtendimentoEscape(route.queixa)}”. Confirmar compatibilidade com o quadro clínico.</span>
        </div>
      </div>`).join('')}
    <div class="novo-atendimento-protocolo-body">
      <div class="novo-atendimento-protocolo-heading">
        <div>
          <p class="novo-atendimento-step">Fluxogramas ligados às queixas</p>
          <h3>${matches.length + psMatches.length} condutas sugeridas automaticamente</h3>
        </div>
      </div>
      ${matches.length ? `
        <p class="novo-atendimento-protocolo-group">Guia de emergência</p>
        <div class="novo-atendimento-emergency-routes">
          ${matches.map(route => {
            const meta = novoAtendimentoEmergencyProtocolMeta(route);
            return `
              <article class="novo-atendimento-emergency-route">
                <span class="novo-atendimento-emergency-route-icon" aria-hidden="true">${meta.icon}</span>
                <div>
                  <small>${novoAtendimentoEscape(meta.topic)}</small>
                  <strong>${novoAtendimentoEscape(meta.name)}</strong>
                  <span>Relacionado a: ${novoAtendimentoEscape(route.queixa)}</span>
                </div>
                <button type="button" class="btn btn-secondary"
                  data-open-emergency-topic="${novoAtendimentoEscape(route.topic)}"
                  data-open-emergency-protocol="${novoAtendimentoEscape(route.protocol)}">
                  Abrir agora →
                </button>
              </article>`;
          }).join('')}
        </div>` : ''}
      ${psMatches.length ? `
        <p class="novo-atendimento-protocolo-group">Prescrições de PS · diferenciais da queixa</p>
        <div class="novo-atendimento-emergency-routes">
          ${psMatches.map(condition => `
            <article class="novo-atendimento-emergency-route">
              <span class="novo-atendimento-emergency-route-icon" aria-hidden="true">${condition.icon}</span>
              <div>
                <small>Prescrições de PS</small>
                <strong>${novoAtendimentoEscape(condition.name)}</strong>
                <span>Relacionado a: ${novoAtendimentoEscape(condition.queixa)}</span>
              </div>
              <button type="button" class="btn btn-secondary" data-open-ps-condition="${novoAtendimentoEscape(condition.id)}">
                Abrir conduta →
              </button>
            </article>`).join('')}
        </div>` : ''}
      ${hasChest ? `
        <div class="novo-atendimento-protocolo-scores">
          <div>
            <strong>Escores úteis para dor torácica</strong>
            <span>Não devem atrasar ECG nem reperfusão.</span>
          </div>
          <div class="novo-atendimento-protocolo-score-buttons">
            <button type="button" data-open-score="heart"><strong>HEART</strong><span>Dor torácica indiferenciada</span></button>
            <button type="button" data-open-score="grace"><strong>GRACE</strong><span>SCA sem supra / prognóstico</span></button>
            <button type="button" data-open-score="timi-ua"><strong>TIMI UA/NSTEMI</strong><span>Risco isquêmico</span></button>
            <button type="button" data-open-score="killip"><strong>Killip</strong><span>Insuficiência cardíaca no IAM</span></button>
          </div>
        </div>` : ''}
    </div>`;

  protocolo.querySelectorAll('[data-open-emergency-protocol]').forEach(button => {
    button.addEventListener('click', () => {
      novoAtendimentoOpenEmergencyProtocol(
        button.dataset.openEmergencyTopic,
        button.dataset.openEmergencyProtocol
      );
    });
  });
  protocolo.querySelectorAll('[data-open-ps-condition]').forEach(button => {
    button.addEventListener('click', () => novoAtendimentoOpenPsCondition(button.dataset.openPsCondition));
  });
  protocolo.querySelectorAll('[data-open-score]').forEach(button => {
    button.addEventListener('click', () => novoAtendimentoOpenScore(button.dataset.openScore));
  });
}

function novoAtendimentoShowStep (step) {
  const {
    form,
    identificacaoHeader,
    queixasPanel,
    queixaInput,
    tratamentoPanel,
    tratamentoResumo
  } = novoAtendimentoElements();

  const showingIdentificacao = step === 'identificacao';
  const showingQueixas = step === 'queixas';
  const showingTratamento = step === 'tratamento';

  if (identificacaoHeader) identificacaoHeader.hidden = !showingIdentificacao;
  if (form) form.hidden = !showingIdentificacao;
  if (queixasPanel) queixasPanel.hidden = !showingQueixas;
  if (tratamentoPanel) tratamentoPanel.hidden = !showingTratamento;

  if (showingIdentificacao) {
    novoAtendimentoRenderResume();
  } else {
    const { resume } = novoAtendimentoElements();
    if (resume) resume.hidden = true;
  }

  if (showingQueixas) window.setTimeout(() => queixaInput?.focus(), 50);

  if (showingTratamento) {
    const data = novoAtendimentoReadDraft();
    if (tratamentoResumo) {
      const queixas = data?.queixas?.length ? data.queixas.join(' · ') : 'sem queixas';
      const nome = data?.nome || 'paciente';
      tratamentoResumo.textContent = `${nome} · ${queixas}. Escolha o local do tratamento.`;
    }

    const { irTratamento } = novoAtendimentoElements();
    if (irTratamento) {
      const aberto = data?.lastTreatment;
      irTratamento.hidden = !aberto;
      irTratamento.textContent = aberto === 'receituario'
        ? 'Voltar ao tratamento para casa →'
        : 'Voltar ao tratamento na unidade →';
    }
  }
}

function novoAtendimentoSyncQueixasDraft () {
  const data = novoAtendimentoReadDraft();
  if (!data) return;
  data.queixas = [...novoAtendimentoQueixas];
  sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  /* Protocolos e prescrições leem a queixa ativa; atualiza já no passo das queixas */
  sessionStorage.setItem('medhub-active-queixa', novoAtendimentoQueixas.join('; '));
}

function novoAtendimentoRenderQueixas () {
  const { queixasList, queixasEmpty } = novoAtendimentoElements();
  if (!queixasList) return;

  queixasList.innerHTML = novoAtendimentoQueixas.map((queixa, index) => `
    <span class="novo-atendimento-complaint-chip">
      <span>${novoAtendimentoEscape(queixa)}</span>
      <button type="button" data-remove-queixa="${index}" aria-label="Remover ${novoAtendimentoEscape(queixa)}">×</button>
    </span>
  `).join('');
  if (queixasEmpty) queixasEmpty.hidden = novoAtendimentoQueixas.length > 0;
  novoAtendimentoSyncQueixasDraft();
  novoAtendimentoRenderProtocol();

  queixasList.querySelectorAll('[data-remove-queixa]').forEach(button => {
    button.addEventListener('click', () => {
      novoAtendimentoQueixas.splice(Number(button.dataset.removeQueixa), 1);
      novoAtendimentoRenderQueixas();
    });
  });
}

function novoAtendimentoAddQueixa (event) {
  event.preventDefault();
  const { queixaInput, queixasStatus } = novoAtendimentoElements();
  const value = queixaInput?.value.trim();
  if (!value) {
    queixaInput?.focus();
    return;
  }

  const exists = novoAtendimentoQueixas.some(item =>
    item.localeCompare(value, 'pt-BR', { sensitivity: 'base' }) === 0
  );
  if (!exists) novoAtendimentoQueixas.push(value);
  if (queixaInput) queixaInput.value = '';
  novoAtendimentoSetStatus('', '', queixasStatus);
  novoAtendimentoRenderQueixas();
  queixaInput?.focus();
}

function novoAtendimentoSave (event) {
  event.preventDefault();
  const { form, nome, sexo, idade, detalhe } = novoAtendimentoElements();
  const allergyChoice = novoAtendimentoAllergyChoice();
  const previous = novoAtendimentoReadDraft();

  novoAtendimentoUpdateAllergyField();
  if (!form?.reportValidity()) return;

  // Paciente diferente começa um atendimento do zero, sem herdar queixas do anterior
  const nomeAtual = nome.value.trim();
  const mesmoPaciente = !!previous && previous.nome === nomeAtual;
  if (!mesmoPaciente) novoAtendimentoQueixas = [];

  const data = {
    nome: nomeAtual,
    sexo: sexo.value,
    idade: String(idade.value).trim(),
    alergias: allergyChoice === 'sim' ? detalhe.value.trim() : 'Nega alergias',
    queixas: mesmoPaciente ? (previous.queixas || novoAtendimentoQueixas) : novoAtendimentoQueixas,
    step: 'queixas',
    startedAt: mesmoPaciente ? previous.startedAt : new Date().toISOString(),
    lastTreatment: mesmoPaciente ? previous.lastTreatment : null
  };

  sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  sessionStorage.setItem('medhub-active-paciente', data.nome);
  sessionStorage.setItem('medhub-active-idade', `${data.idade} anos`);

  if (typeof clinicalBeginEncounter === 'function') {
    clinicalBeginEncounter({
      nome: data.nome,
      sexo: data.sexo,
      idade: data.idade,
      alergias: data.alergias
    });
  }
  if (typeof clinicalSetActiveAllergies === 'function') {
    clinicalSetActiveAllergies(data.alergias);
  }

  novoAtendimentoSyncAnamnese(data);
  novoAtendimentoSetStatus('');
  novoAtendimentoShowStep('queixas');
}

function novoAtendimentoClear () {
  const { form, nome, queixasStatus } = novoAtendimentoElements();
  form?.reset();
  novoAtendimentoQueixas = [];
  sessionStorage.removeItem(MEDHUB_NEW_ENCOUNTER_DRAFT);
  if (typeof clinicalEndEncounter === 'function') clinicalEndEncounter();
  novoAtendimentoUpdateAllergyField();
  novoAtendimentoRenderQueixas();
  novoAtendimentoSetStatus('');
  novoAtendimentoSetStatus('', '', queixasStatus);
  novoAtendimentoShowStep('identificacao');
  nome?.focus();
}

function novoAtendimentoRestore () {
  const data = novoAtendimentoReadDraft();
  if (!data) return;

  const { nome, sexo, idade, detalhe } = novoAtendimentoElements();
  if (nome) nome.value = data.nome || '';
  if (sexo) sexo.value = data.sexo || '';
  if (idade) idade.value = data.idade || '';

  const hasAllergy = data.alergias && data.alergias !== 'Nega alergias';
  const choice = document.querySelector(
    `input[name="novo-atendimento-alergia"][value="${hasAllergy ? 'sim' : 'nao'}"]`
  );
  if (choice) choice.checked = true;
  if (detalhe && hasAllergy) detalhe.value = data.alergias;
  novoAtendimentoQueixas = Array.isArray(data.queixas) ? data.queixas.filter(Boolean) : [];
  novoAtendimentoUpdateAllergyField();
  novoAtendimentoRenderQueixas();

  if (data.step === 'tratamento' && novoAtendimentoQueixas.length) {
    novoAtendimentoShowStep('tratamento');
  } else if (novoAtendimentoQueixas.length || data.step === 'queixas') {
    novoAtendimentoShowStep('queixas');
  } else {
    novoAtendimentoShowStep('identificacao');
  }
}

function novoAtendimentoPrefillSearch (sectionId, query) {
  const map = {
    'tratamento-hospitalar': 'th-search',
    receituario: 'rx-search',
    'pronto-socorro': 'ps-search'
  };
  const inputId = map[sectionId];
  if (!inputId || !query) return;
  window.setTimeout(() => {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, 80);
}

function novoAtendimentoOpenTreatment (sectionId) {
  const data = novoAtendimentoReadDraft();
  const queixas = data?.queixas?.length ? data.queixas : [];
  /* Sintomas como "dispneia" não existem nos catálogos de tratamento:
     junta os diagnósticos ligados à queixa para a busca encontrar a conduta */
  const relacionados = novoAtendimentoPsMatches(queixas).map(condition => condition.name);
  const termos = [...queixas, ...relacionados];
  const queryText = termos.join('; ');

  if (data) {
    data.lastTreatment = sectionId;
    sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  }

  if (typeof showSection === 'function') showSection(sectionId);

  window.setTimeout(() => {
    if (sectionId === 'tratamento-hospitalar' && typeof thOpenFromQueixas === 'function') {
      const opened = thOpenFromQueixas(termos, { skipGate: true });
      if (!opened) novoAtendimentoPrefillSearch(sectionId, queixas[0] || '');
      return;
    }

    if (sectionId === 'receituario') {
      const matches = typeof rxMatchConditions === 'function'
        ? rxMatchConditions(queryText)
        : [];
      if (matches.length && typeof rxShowCombinedConditions === 'function') {
        rxShowCombinedConditions(matches.map(c => c.id), { skipGate: true });
        return;
      }
      novoAtendimentoPrefillSearch(sectionId, queixas[0] || '');
    }
  }, 120);
}

function novoAtendimentoSaveQueixas () {
  const { queixaInput, queixasStatus } = novoAtendimentoElements();
  const pending = queixaInput?.value.trim();
  if (pending) {
    const exists = novoAtendimentoQueixas.some(item =>
      item.localeCompare(pending, 'pt-BR', { sensitivity: 'base' }) === 0
    );
    if (!exists) novoAtendimentoQueixas.push(pending);
    if (queixaInput) queixaInput.value = '';
    novoAtendimentoRenderQueixas();
  }

  if (!novoAtendimentoQueixas.length) {
    novoAtendimentoSetStatus('Adicione pelo menos uma queixa para continuar.', 'error', queixasStatus);
    queixaInput?.focus();
    return;
  }

  const data = novoAtendimentoReadDraft();
  if (!data) {
    novoAtendimentoShowStep('identificacao');
    return;
  }

  data.queixas = [...novoAtendimentoQueixas];
  data.step = 'tratamento';
  sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  sessionStorage.setItem('medhub-active-queixa', data.queixas.join('; '));
  novoAtendimentoSyncAnamnese(data);
  if (typeof rxSyncFromAnamnese === 'function') rxSyncFromAnamnese();

  novoAtendimentoSetStatus('', '', queixasStatus);
  novoAtendimentoShowStep('tratamento');
}

function initNovoAtendimento () {
  const {
    form,
    limpar,
    queixaForm,
    salvarQueixas,
    voltarIdentificacao,
    txUnidade,
    txCasa,
    voltarQueixas,
    irTratamento,
    novoPaciente
  } = novoAtendimentoElements();
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';

  form.addEventListener('submit', novoAtendimentoSave);
  limpar?.addEventListener('click', novoAtendimentoClear);
  queixaForm?.addEventListener('submit', novoAtendimentoAddQueixa);
  salvarQueixas?.addEventListener('click', novoAtendimentoSaveQueixas);
  voltarIdentificacao?.addEventListener('click', () => novoAtendimentoShowStep('identificacao'));
  voltarQueixas?.addEventListener('click', () => novoAtendimentoShowStep('queixas'));
  txUnidade?.addEventListener('click', () => novoAtendimentoOpenTreatment('tratamento-hospitalar'));
  txCasa?.addEventListener('click', () => novoAtendimentoOpenTreatment('receituario'));
  irTratamento?.addEventListener('click', () => {
    const data = novoAtendimentoReadDraft();
    novoAtendimentoOpenTreatment(data?.lastTreatment || 'tratamento-hospitalar');
  });
  novoPaciente?.addEventListener('click', novoAtendimentoClear);
  novoAtendimentoElements().resumeBtn?.addEventListener('click', novoAtendimentoResumeStep);
  document.querySelectorAll('input[name="novo-atendimento-alergia"]').forEach(input => {
    input.addEventListener('change', novoAtendimentoUpdateAllergyField);
  });

  novoAtendimentoRestore();
}

/* A aba do menu sempre abre um atendimento novo; o anterior continua acessível pelo aviso */
function novoAtendimentoOnSectionShow () {
  initNovoAtendimento();
  novoAtendimentoPrepareNew();
  novoAtendimentoShowStep('identificacao');

  const { nome } = novoAtendimentoElements();
  if (nome && !nome.value) window.setTimeout(() => nome.focus(), 50);
}

/* Formulário limpo para o próximo paciente — o rascunho anterior segue no aviso de retomada */
function novoAtendimentoPrepareNew () {
  const { form } = novoAtendimentoElements();
  form?.reset();
  novoAtendimentoQueixas = [];
  novoAtendimentoUpdateAllergyField();
  novoAtendimentoRenderQueixas();
  novoAtendimentoSetStatus('');
}

function novoAtendimentoRenderResume () {
  const { resume, resumeText } = novoAtendimentoElements();
  if (!resume) return;

  const data = novoAtendimentoReadDraft();
  const emAndamento = !!(data && data.nome && data.step && data.step !== 'identificacao');
  resume.hidden = !emAndamento;
  if (emAndamento && resumeText) {
    resumeText.textContent = `Atendimento em andamento: ${data.nome}`;
  }
}

/** Retoma o atendimento anterior com os campos, as queixas e o passo onde parou */
function novoAtendimentoResumeStep () {
  if (!novoAtendimentoReadDraft()) return;
  novoAtendimentoRestore();
}

/** Volta para o atendimento a partir das telas de tratamento */
function novoAtendimentoOpenEncounter () {
  if (typeof showSection === 'function') showSection('novo-atendimento');
  novoAtendimentoResumeStep();
}

/** Continua o mesmo atendimento no receituário para casa */
function novoAtendimentoContinueHomePrescription () {
  if (!novoAtendimentoReadDraft()) return;
  novoAtendimentoOpenTreatment('receituario');
}

/** Encerra o paciente atual e prepara a identificação do próximo */
function novoAtendimentoFinishPatient () {
  const data = novoAtendimentoReadDraft();
  const nome = data?.nome ? ` de ${data.nome}` : '';
  if (!window.confirm(`Finalizar o atendimento${nome}?`)) return false;

  novoAtendimentoClear();
  if (typeof showSection === 'function') showSection('novo-atendimento');
  return true;
}
