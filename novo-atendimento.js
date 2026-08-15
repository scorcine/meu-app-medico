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

const NOVO_ATENDIMENTO_EMERGENCY_ROUTES = [
  {
    topic: 'parada-cardio', protocol: 'acls-adulto', icon: '⚡',
    aliases: ['parada cardiorrespiratoria', 'parada cardiaca', 'pcr', 'aesp', 'assistolia', 'fibrilacao ventricular', 'fv', 'tv sem pulso'],
    alert: 'Parada cardiorrespiratória: acione ajuda, inicie RCP de alta qualidade e conecte o desfibrilador.'
  },
  { topic: 'parada-cardio', protocol: 'bls-adulto', icon: '🫀', aliases: ['bls', 'suporte basico de vida'] },
  { topic: 'parada-cardio', protocol: 'pals-ped', icon: '👶', aliases: ['pals', 'parada pediatrica', 'pcr pediatrica'] },
  { topic: 'parada-cardio', protocol: 'bradicardia', icon: '🐢', aliases: ['bradicardia', 'pulso lento', 'ritmo lento'] },
  { topic: 'parada-cardio', protocol: 'taquicardia', icon: '⚡', aliases: ['taquicardia instavel', 'taquiarritmia instavel', 'tv com pulso', 'torsades'] },
  { topic: 'parada-cardio', protocol: 'rosc', icon: '✅', aliases: ['rosc', 'pos pcr', 'retorno da circulacao espontanea'] },

  {
    topic: 'sca', protocol: 'dor-inicial', icon: '❤️‍🔥', chest: true,
    aliases: ['dor toracica', 'dor no peito', 'precordialgia', 'angina', 'sindrome coronariana aguda', 'sca', 'infarto', 'iam'],
    alert: 'Dor torácica: realizar ECG de 12 derivações em até 10 minutos.'
  },
  { topic: 'sca', protocol: 'stemi', icon: '🚨', aliases: ['stemi', 'iam com supra', 'infarto com supra', 'iamcsst'] },
  { topic: 'sca', protocol: 'nstemi-ua', icon: '❤️', aliases: ['nstemi', 'iam sem supra', 'infarto sem supra', 'iamsst', 'angina instavel'] },
  { topic: 'sca', protocol: 'ecg-modelos', icon: '📈', aliases: ['modelos de ecg', 'padroes de ecg', 'ecg sca'] },

  {
    topic: 'avc', protocol: 'fast', icon: '🧠',
    aliases: ['avc', 'ave', 'derrame', 'deficit neurologico focal', 'hemiparesia', 'hemiplegia', 'paralisia facial', 'desvio de rima', 'afasia'],
    alert: 'Suspeita de AVC: registrar o último momento bem e ativar avaliação neurológica imediatamente.'
  },
  { topic: 'avc', protocol: 'trombolise', icon: '💉', aliases: ['trombolise avc', 'alteplase avc', 'tenecteplase avc'] },
  { topic: 'avc', protocol: 'trombectomia', icon: '🧠', aliases: ['trombectomia', 'oclusao de grande vaso'] },
  { topic: 'avc', protocol: 'nihss', icon: '📋', aliases: ['nihss', 'escala nihss'] },

  {
    topic: 'sepse', protocol: 'bundle-hora1', icon: '🩸',
    aliases: ['sepse', 'choque septico', 'septicemia', 'infeccao com disfuncao organica'],
    alert: 'Suspeita de sepse: avaliar disfunção orgânica e iniciar o Bundle Hora-1 sem atraso.'
  },
  { topic: 'sepse', protocol: 'norepi-map', icon: '💉', aliases: ['noradrenalina', 'norepinefrina', 'choque refratario'] },
  { topic: 'sepse', protocol: 'lactato-reavaliacao', icon: '🧪', aliases: ['lactato elevado', 'reavaliacao de lactato'] },

  {
    topic: 'trauma', protocol: 'atls-abcde', icon: '🆘',
    aliases: ['trauma', 'politrauma', 'atropelamento', 'acidente automobilistico', 'acidente de moto', 'ferimento por arma de fogo', 'ferimento por arma branca'],
    alert: 'Trauma: priorizar avaliação primária ABCDE e tratar ameaças imediatas à vida.'
  },
  { topic: 'trauma', protocol: 'via-aerea-vortex', icon: '🌪️', aliases: ['via aerea dificil', 'intubacao dificil', 'nao intuba nao ventila'] },
  { topic: 'trauma', protocol: 'mtp-transfusao', icon: '🩸', aliases: ['hemorragia macica', 'transfusao macica', 'choque hemorragico'] },
  { topic: 'trauma', protocol: 'pecarn-tce', icon: '👶', aliases: ['tce pediatrico', 'trauma craniano pediatrico', 'queda crianca'] },
  { topic: 'trauma', protocol: 'queda-propria-altura-tc', icon: '🧓', aliases: ['queda da propria altura', 'queda em idoso', 'queda idoso'] },

  { topic: 'via-aerea', protocol: 'rsi-7-passos', icon: '🌬️', aliases: ['sequencia rapida de intubacao', 'intubacao orotraqueal', 'iot', 'rsi'] },
  { topic: 'via-aerea', protocol: 'ventilacao-mecanica', icon: '🫁', aliases: ['ventilacao mecanica', 'ajuste ventilatorio'] },
  { topic: 'via-aerea', protocol: 'dope-pos-iot', icon: '🚨', aliases: ['hipoxemia pos iot', 'dessaturacao pos intubacao', 'dope'] },
  { topic: 'via-aerea', protocol: 'desmame-ventilatorio', icon: '🫁', aliases: ['desmame ventilatorio', 'extubacao'] },

  {
    topic: 'reacoes-metabolicas', protocol: 'anafilaxia', icon: '💉',
    aliases: ['anafilaxia', 'choque anafilatico', 'reacao alergica grave', 'edema de glote'],
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
    aliases: ['cetoacidose diabetica', 'cad', 'estado hiperosmolar', 'ehh', 'coma hiperosmolar'],
    alert: 'Crise hiperglicêmica: avaliar volume, potássio, cetonas, gasometria e osmolaridade antes da insulina.'
  },

  { topic: 'obstetricia', protocol: 'preeclampsia-eclampsia', icon: '🤰', aliases: ['pre eclampsia', 'preeclampsia', 'eclampsia', 'convulsao na gestante', 'hipertensao gestacional'] },
  { topic: 'obstetricia', protocol: 'hemorragia-pos-parto', icon: '🩸', aliases: ['hemorragia pos parto', 'sangramento pos parto', 'atonia uterina'] },
  { topic: 'obstetricia', protocol: 'prolapso-cordao', icon: '🚨', aliases: ['prolapso de cordao', 'cordao prolapsado'] },

  { topic: 'pediatrica', protocol: 'pcr-pediatrico', icon: '👶', aliases: ['parada cardiorrespiratoria pediatrica', 'pcr infantil'] },
  { topic: 'pediatrica', protocol: 'bronquiolite', icon: '👶', aliases: ['bronquiolite', 'vsl', 'virus sincicial respiratorio'] },
  { topic: 'pediatrica', protocol: 'broselow-doses', icon: '📏', aliases: ['broselow', 'doses pediatricas de emergencia'] },

  { topic: 'toxicologia', protocol: 'overdose-opioide', icon: '☠️', aliases: ['overdose de opioide', 'intoxicacao por opioide', 'morfina overdose', 'fentanil overdose', 'heroina overdose'] },
  { topic: 'toxicologia', protocol: 'paracetamol-rumack', icon: '💊', aliases: ['intoxicacao por paracetamol', 'overdose de paracetamol', 'acetaminofeno overdose'] },
  { topic: 'toxicologia', protocol: 'hipertermia-maligna-calor', icon: '🔥', aliases: ['hipertermia maligna', 'golpe de calor', 'insolacao grave'] },
  { topic: 'toxicologia', protocol: 'hipotermia-swiss', icon: '❄️', aliases: ['hipotermia', 'exposicao ao frio'] },

  { topic: 'pressao-arritmias', protocol: 'crise-hipertensiva', icon: '🔺', aliases: ['crise hipertensiva', 'emergencia hipertensiva', 'hipertensao grave', 'pressao muito alta'] },
  { topic: 'pressao-arritmias', protocol: 'wpw-instavel', icon: '⚡', aliases: ['wolff parkinson white', 'wpw', 'pre excitacao instavel'] },

  { topic: 'procedimentos', protocol: 'sedasia', icon: '💤', aliases: ['sedacao', 'sedacao para procedimento', 'sedasia'] },
  { topic: 'procedimentos', protocol: 'puncao-lombar', icon: '🛠️', aliases: ['puncao lombar', 'coleta de liquor'] },
  { topic: 'procedimentos', protocol: 'iot-covid-safe', icon: '😷', aliases: ['intubacao covid', 'iot covid'] }
];

function novoAtendimentoAliasMatches (value, alias) {
  const normalizedAlias = novoAtendimentoNormalize(alias);
  return (` ${value} `).includes(` ${normalizedAlias} `);
}

function novoAtendimentoEmergencyMatches () {
  const matches = [];

  novoAtendimentoQueixas.forEach(queixa => {
    const value = novoAtendimentoNormalize(queixa);
    NOVO_ATENDIMENTO_EMERGENCY_ROUTES.forEach(route => {
      if (!route.aliases.some(alias => novoAtendimentoAliasMatches(value, alias))) return;
      const key = `${route.topic}:${route.protocol}`;
      if (!matches.some(item => item.key === key)) matches.push({ ...route, key, queixa });
    });
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

  const matches = novoAtendimentoEmergencyMatches();
  if (!matches.length) {
    protocolo.hidden = true;
    protocolo.innerHTML = '';
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
          <p class="novo-atendimento-step">${matches.length > 1 ? 'Protocolos sugeridos automaticamente' : 'Protocolo sugerido automaticamente'}</p>
          <h3>${matches.length > 1 ? `${matches.length} protocolos relacionados às queixas` : 'Acesso direto à conduta de emergência'}</h3>
        </div>
      </div>
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
      </div>
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
    receituario: 'rx-search'
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
  const queryText = queixas.join('; ');

  if (data) {
    data.lastTreatment = sectionId;
    sessionStorage.setItem(MEDHUB_NEW_ENCOUNTER_DRAFT, JSON.stringify(data));
  }

  if (typeof showSection === 'function') showSection(sectionId);

  window.setTimeout(() => {
    if (sectionId === 'tratamento-hospitalar' && typeof thOpenFromQueixas === 'function') {
      const opened = thOpenFromQueixas(queixas, { skipGate: true });
      if (!opened) novoAtendimentoPrefillSearch(sectionId, queixas[0] || queryText);
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
      novoAtendimentoPrefillSearch(sectionId, queixas[0] || queryText);
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
