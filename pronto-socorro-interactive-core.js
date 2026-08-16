/* Prescrições PS — motor de prescrição interativa e validação */

const PS_CLASS_RULES = [
  {
    class: 'nsaid',
    max: 1,
    severity: 'error',
    message: 'Evite associar dois AINEs (risco de sangramento GI e lesão renal).'
  },
  {
    class: 'triptan',
    max: 1,
    severity: 'error',
    message: 'Use apenas um triptano por crise (sumatriptano ou zolmitriptano, não ambos).'
  },
  {
    class: 'opioid',
    max: 1,
    severity: 'error',
    message: 'Use apenas um opioide por prescrição (tramadol OU morfina, não ambos).'
  },
  {
    class: 'benzodiazepine',
    max: 1,
    severity: 'warning',
    message: 'Evite combinar benzodiazepínicos (risco de sedação excessiva).'
  },
  {
    class: 'corticosteroid',
    max: 1,
    severity: 'error',
    message: 'Não combine dois corticoides sistêmicos (ex.: dexametasona + prednisona).'
  },
  {
    class: 'ppi',
    max: 1,
    severity: 'error',
    message: 'Use apenas um IBP por vez (omeprazol, pantoprazol ou esomeprazol).'
  },
  {
    class: 'acei',
    max: 1,
    severity: 'error',
    message: 'Não combine dois IECA (ex.: captopril + enalapril).'
  },
  {
    class: 'arb',
    max: 1,
    severity: 'error',
    message: 'Não combine dois BRA (ex.: losartana + valsartana).'
  },
  {
    class: 'beta_blocker',
    max: 1,
    severity: 'error',
    message: 'Não combine dois betabloqueadores (ex.: propranolol + metoprolol).'
  },
  {
    class: 'anticonvulsant',
    max: 2,
    severity: 'warning',
    message: 'Múltiplos anticonvulsivantes — confirme indicação (status epilepticus vs. monoterapia).'
  },
  {
    class: 'antithyroid',
    max: 1,
    severity: 'error',
    message: 'Não combine tiamazol e propiltiouracil na mesma prescrição.'
  },
  {
    class: 'antispasmodic',
    max: 1,
    severity: 'warning',
    message: 'Evite associar dois antiespasmódicos (ex.: escopolamina + butilbrometo).'
  }
];

const PS_PAIR_RULES = [
  {
    drugs: ['metoclopramida', 'haloperidol'],
    severity: 'warning',
    message: 'Metoclopramida + haloperidol aumenta risco de efeitos extrapiramidais e QT.'
  },
  {
    drugs: ['metoclopramida', 'ondansetrona'],
    severity: 'warning',
    message: 'Associação antiemética dupla — avaliar necessidade; cautela em prolongamento de QT.'
  },
  {
    drugs: ['adrenalina', 'verapamil'],
    severity: 'error',
    message: 'Verapamil + adrenalina em anafilaxia: preferir adrenalina isolada; verapamil não trata anafilaxia.'
  },
  {
    drugs: ['captopril', 'losartana'],
    severity: 'error',
    message: 'Não combine IECA + BRA (dupla bloqueio do RAA — risco de hipotensão e lesão renal).'
  },
  {
    drugs: ['enalapril', 'losartana'],
    severity: 'error',
    message: 'Não combine IECA + BRA (dupla bloqueio do RAA — risco de hipotensão e lesão renal).'
  },
  {
    drugs: ['omeprazol', 'pantoprazol'],
    severity: 'error',
    message: 'Não combine dois IBPs na mesma prescrição.'
  },
  {
    drugs: ['difenidramina', 'loratadina'],
    severity: 'warning',
    message: 'Associação de anti-histamínicos — avaliar necessidade; risco de sedação (especialmente 1ª geração).'
  },
  {
    drugs: ['prometazina', 'difenidramina'],
    severity: 'warning',
    message: 'Associação de anti-histamínicos/antihistamínicos sedativos — risco de depressão do SNC.'
  },
  {
    drugs: ['tramadol', 'morfina'],
    severity: 'error',
    message: 'Tramadol + morfina — duplo opioide; escolha um só agente no escalonamento analgésico.'
  },
  {
    drugs: ['tramadol', 'fentanil'],
    severity: 'error',
    message: 'Não combine dois opioides potentes na mesma prescrição.'
  },
  {
    drugs: ['dipirona', 'paracetamol'],
    severity: 'warning',
    message: 'Dipirona + paracetamol juntos — prefira um analgésico não opioide por vez; rotacionar se necessário.'
  }
];

function psCheckAntibioticInteractions (drugs, meds) {
  const messages = [];
  const abIds = psUniqueAntibioticIds(drugs);
  if (!abIds.length) return messages;

  Object.entries(PS_DRUG_CONTAINS).forEach(([parent, children]) => {
    if (!abIds.includes(parent)) return;
    children.forEach(child => {
      if (abIds.includes(child)) {
        messages.push({
          severity: 'error',
          text: `${psDrugLabel(parent)} já inclui ${psDrugLabel(child)} — não prescreva ambos (duplicidade de beta-lactâmico).`
        });
      }
    });
  });

  PS_ATB_SUBCLASSES.forEach(sub => {
    const inClass = abIds.filter(id => (PS_DRUG_META[id]?.classes || []).includes(sub));
    if (inClass.length > 1) {
      messages.push({
        severity: 'error',
        text: `Não combine ${inClass.map(psDrugLabel).join(' + ')} — redundância (${sub === 'penicillin' ? 'penicilinas' : sub === 'cephalosporin' ? 'cefalosporinas' : sub === 'macrolide' ? 'macrolídeos' : sub === 'fluoroquinolone' ? 'fluoroquinolonas' : sub === 'carbapenem' ? 'carbapenêmicos' : sub === 'aminoglycoside' ? 'aminoglicosídeos' : sub === 'lincosamide' ? 'lincosamidas' : sub === 'glycopeptide' ? 'glicopeptídeos' : 'tetraciclinas'}).`
      });
    }
  });

  if (abIds.length >= 2 && !psIsValidAntibioticCombination(abIds)) {
    messages.push({
      severity: 'error',
      text: `Combinação antibiótica inadequada: ${abIds.map(psDrugLabel).join(' + ')}. Escolha monoterapia ou esquema combinado previsto no protocolo (ex.: ceftriaxona + azitromicina na PAC, ceftriaxona + metronidazol em foco anaeróbio).`
    });
  }

  return messages;
}

/**
 * Mapa id da opção → etapa do protocolo. Só etapas contam: em grupos por linha
 * (1ª linha, alternativa) o alerta de misturar linhas precisa continuar valendo.
 */
function psMedStepLabels (config) {
  const map = new Map();
  (config?.groups || []).filter(group => group.autoStep).forEach(group => {
    (group.medications || []).forEach(med => map.set(med.id, group.label || ''));
  });
  return map;
}

function psCheckTherapyTierExclusivity (meds, config) {
  const messages = [];
  if (meds.length < 2) return messages;

  const steps = psMedStepLabels(config);
  const buckets = new Map();
  meds.forEach(m => {
    const type = psMedTherapyType(m);
    const step = steps.get(m.id) || '';
    const key = `${step}||${type}`;
    if (!buckets.has(key)) buckets.set(key, { type, step, meds: [] });
    buckets.get(key).meds.push(m);
  });

  buckets.forEach(({ type, step, meds: bucketMeds }) => {
    if (bucketMeds.length < 2) return;

    const tierKeys = new Set();
    const tierLabels = [];
    bucketMeds.forEach(m => {
      psGetExclusiveTierKeys(m).forEach(key => {
        if (!tierKeys.has(key)) {
          tierKeys.add(key);
          const def = PS_EXCLUSIVE_TIER_KEYS.find(x => x.key === key);
          if (def) tierLabels.push(def.label);
        }
      });
    });

    if (tierKeys.size >= 2) {
      const alvo = step || PS_THERAPY_TYPE_LABELS[type] || type;
      messages.push({
        severity: 'warning',
        text: `${alvo}: marcou ${tierLabels.join(' e ')} ao mesmo tempo — em geral usa-se uma linha por vez; mantenha a que estiver disponível na sua unidade.`
      });
    }
  });

  return messages;
}

/** Mesma droga em duas opções marcadas (ex.: salbutamol isolado e associado) */
function psCheckDuplicateDrugs (drugs) {
  const byDrug = new Map();
  drugs.forEach(d => {
    const set = byDrug.get(d.id) || new Set();
    set.add(d.medId);
    byDrug.set(d.id, set);
  });

  const repetidas = [...byDrug.entries()]
    .filter(([, medIds]) => medIds.size > 1)
    .map(([id]) => (PS_DRUG_META[id] && PS_DRUG_META[id].name) || id);

  if (!repetidas.length) return [];
  return [{
    severity: 'warning',
    text: `${repetidas.join(', ')} aparece em mais de uma opção marcada — mantenha só a que vai administrar para não dobrar a dose.`
  }];
}

function psCheckPainAnalgesiaStack (drugs, meds) {
  const messages = [];
  const analgesicIds = psUniqueDrugIdsByClass(drugs, 'analgesic');
  const nsaidIds = psUniqueDrugIdsByClass(drugs, 'nsaid');
  const opioidIds = psUniqueDrugIdsByClass(drugs, 'opioid');
  const painIds = [...new Set([].concat(analgesicIds, nsaidIds, opioidIds))];

  if (opioidIds.length > 1) {
    messages.push({
      severity: 'error',
      text: 'Não combine ' + opioidIds.map(psDrugLabel).join(' + ') + ' — use um único opioide no escalonamento analgésico.'
    });
  }

  if (analgesicIds.length >= 2) {
    messages.push({
      severity: meds.length >= 2 ? 'error' : 'warning',
      text: `Evite associar ${analgesicIds.map(psDrugLabel).join(' + ')} simultaneamente — prefira um analgésico não opioide por vez.`
    });
  }

  if (painIds.length >= 3 && meds.length >= 2) {
    messages.push({
      severity: 'error',
      text: `Analgesia excessiva (${painIds.map(psDrugLabel).join(', ')}) — você selecionou fármacos de múltiplas linhas do protocolo; use escalonamento em uma única linha terapêutica.`
    });
  } else if (painIds.length >= 4) {
    messages.push({
      severity: 'error',
      text: `Analgesia excessiva: ${painIds.map(psDrugLabel).join(', ')} — revise escalonamento e risco de depressão respiratória/lesão renal.`
    });
  }

  const analgesiaMeds = meds.filter(m => psMedTherapyType(m) === 'analgesia');
  if (analgesiaMeds.length >= 2) {
    const hasNsaid = nsaidIds.length > 0;
    const hasAlergicLine = analgesiaMeds.some(m => /alerg/i.test(m.tier || ''));
    const hasFirstLine = analgesiaMeds.some(m => /1ª linha/i.test(m.tier || ''));
    if (hasNsaid && hasAlergicLine && (hasFirstLine || analgesiaMeds.some(m => /alternativa/i.test(m.tier || '')))) {
      messages.push({
        severity: 'error',
        text: 'Linha alérgica/contraindicada não deve ser associada a esquema com AINE — escolha um único perfil terapêutico conforme o paciente.'
      });
    }
  }

  const dischargeOnly = drugs.filter(d => (PS_DRUG_META[d.id]?.classes || []).includes('discharge_only'));
  const acutePain = painIds.length > 0;
  if (dischargeOnly.length && acutePain && meds.length >= 2) {
    messages.push({
      severity: 'warning',
      text: `${psDrugLabel(dischargeOnly[0].id)} é medicamento de alta/ambulatorial — não associe à analgesia aguda do PS salvo prescrição de retorno.`
    });
  }

  return messages;
}

function psDrugLabel (drugId) {
  return (PS_DRUG_META[drugId] && PS_DRUG_META[drugId].name) || drugId;
}

function psCollectSelectedDrugs (config, selectedMedIds, selectedRoutes) {
  const drugs = [];
  selectedMedIds.forEach(medId => {
    const med = config.medications.find(m => m.id === medId);
    if (!med || !Array.isArray(med.drugs)) return;
    const route = (selectedRoutes && selectedRoutes[medId]) || med.defaultRoute || (med.routes && med.routes[0]);
    med.drugs.forEach(d => {
      drugs.push({ id: d.id, route: d.route || route, medId });
    });
  });
  return drugs;
}

function psValidatePrescription (conditionId, config, selectedMedIds, context, selectedRoutes) {
  let messages = [];
  const meds = selectedMedIds.map(id => config.medications.find(m => m.id === id)).filter(Boolean);
  const drugs = psCollectSelectedDrugs(config, selectedMedIds, selectedRoutes);

  if (!meds.length) {
    return {
      status: 'warning',
      messages: [{ severity: 'warning', text: 'Selecione ao menos uma opção terapêutica para analisar.' }]
    };
  }

  if (config.requiredContext) {
    config.requiredContext.forEach(field => {
      if (!context[field.id]) {
        messages.push({
          severity: 'warning',
          text: `Informe: ${field.label}.`
        });
      }
    });
  }

  if (context.snoop4 === 'sim' && !context.investigado) {
    messages.push({
      severity: 'warning',
      text: 'SNOOP4 positivo — priorize investigação (TC/LP) antes de alta com analgesia isolada.'
    });
  }

  drugs.forEach(d => {
    const meta = PS_DRUG_META[d.id];
    if (!meta) return;
    if (meta.forbiddenRoutes && meta.forbiddenRoutes.includes(d.route)) {
      messages.push({
        severity: 'error',
        text: `${meta.name} não deve ser administrado por via ${d.route}.`
      });
    }
  });

  PS_CLASS_RULES.forEach(rule => {
    const ids = [...new Set(drugs.filter(d => {
      const meta = PS_DRUG_META[d.id];
      return meta && meta.classes.includes(rule.class);
    }).map(d => d.id))];
    if (ids.length > rule.max) {
      messages.push({ severity: rule.severity, text: rule.message });
    }
  });

  PS_PAIR_RULES.forEach(rule => {
    const ids = [...new Set(drugs.map(d => d.id))];
    if (rule.drugs.every(d => ids.includes(d))) {
      messages.push({ severity: rule.severity, text: rule.message });
    }
  });

  psCheckTherapyTierExclusivity(meds, config).forEach(m => messages.push(m));
  psCheckDuplicateDrugs(drugs).forEach(m => messages.push(m));
  psCheckAntibioticInteractions(drugs, meds).forEach(m => messages.push(m));
  psCheckPainAnalgesiaStack(drugs, meds).forEach(m => messages.push(m));

  if (config.rules) {
    config.rules.forEach(rule => {
      if (typeof rule.check === 'function') {
        try {
          const result = rule.check({ meds, drugs, context, selectedMedIds, config, conditionId });
          if (result) messages.push(result);
        } catch (err) {
          console.error('PS interactive rule error:', err);
          messages.push({
            severity: 'warning',
            text: 'Erro ao avaliar uma regra do protocolo — revise manualmente.'
          });
        }
      }
    });
  }

  if (config.idealFor) {
    const ctxKey = context.subtype || context.grupo || context.fase || 'default';
    const ideal = config.idealFor[ctxKey];
    if (ideal) {
      const match = ideal.some(set => set.every(id => selectedMedIds.includes(id)));
      if (match) {
        messages.push({
          severity: 'ok',
          text: `Prescrição alinhada à 1ª linha${config.subtypeLabels && context.subtype ? ' para ' + config.subtypeLabels[context.subtype] : ''}.`
        });
      } else {
        const alt = config.acceptableFor && config.acceptableFor[ctxKey];
        const altMatch = alt && alt.some(set => set.every(id => selectedMedIds.includes(id)));
        if (altMatch) {
          messages.push({
            severity: 'ok',
            text: 'Esquema aceitável como alternativa ou resistência para este contexto.'
          });
        } else if (ctxKey !== 'default' || Object.keys(config.idealFor).length === 1) {
          messages.push({
            severity: 'warning',
            text: 'Revise se há opção mais adequada no protocolo para este contexto clínico.'
          });
        }
      }
    }
  }

  psPopulationValidationMessages(drugs, context, conditionId).forEach(m => messages.push(m));

  let hasError = messages.some(m => m.severity === 'error');
  let hasWarning = messages.some(m => m.severity === 'warning');
  let hasOk = messages.some(m => m.severity === 'ok');

  if (hasError) {
    messages = messages.filter(m => m.severity !== 'ok');
  }

  let status = 'ok';
  if (hasError) status = 'error';
  else if (hasWarning) status = 'warning';
  else if (hasOk || messages.length === 0) {
    messages.push({
      severity: 'ok',
      text: 'Nenhuma interação relevante detectada nas regras do protocolo. Revise contraindicações individuais do paciente.'
    });
  }

  return { status, messages };
}

function psGroupVisible (group, context) {
  if (!group || !group.when) return true;
  const ctx = context || {};
  return Object.entries(group.when).every(([key, val]) => {
    const got = ctx[key];
    if (Array.isArray(val)) return val.includes(got);
    return got === val;
  });
}

/** Subtipo padrão ao abrir — maioria viral/suporte (evita lista vazia ou só HTML bacteriano). */
const PS_DEFAULT_SUBTYPE = {
  conjuntivite: 'viral',
  'sinusite-aguda': 'viral',
  'bronquite-aguda': 'viral',
  tosse: 'posviral',
  'diarreia-gastroenterite': 'viral',
  'gripe-influenza': 'leve',
  'otite-media': 'observacao',
  'otite-externa': 'topico',
  'dpoc-exacerbada': 'sem_atb',
  mononucleose: 'suporte'
};

function psApplyDefaultSubtype (wrap, conditionId, config) {
  const defaults = config.defaultContext || {};
  const subtype = defaults.subtype || PS_DEFAULT_SUBTYPE[conditionId];
  if (!subtype) return;
  const radio = wrap.querySelector('[data-ctx-field="subtype"][value="' + subtype + '"]');
  if (radio && radio.type === 'radio') {
    radio.checked = true;
    return;
  }
  const el = wrap.querySelector('[data-ctx-field="subtype"]');
  if (el && !el.value) el.value = subtype;
}

/* Fechamento da conduta: prescrever, pedir exames e encerrar sem sair do fluxo */
function psRenderClosureHtml () {
  return `
    <section class="ps-rx-closure" data-ps-closure>
      <div class="ps-rx-closure-head">
        <strong>Fechar esta conduta</strong>
        <p class="muted" data-ps-closure-count></p>
      </div>
      <div class="ps-rx-closure-actions">
        <button type="button" class="ps-rx-closure-btn" data-ps-closure-action="receituario">
          <strong>Prescrever para casa</strong><span>Abre o receituário com a conduta</span>
        </button>
        <button type="button" class="ps-rx-closure-btn" data-ps-closure-action="exames">
          <strong>Solicitar exames</strong><span>Abre os cenários de exames</span>
        </button>
        <button type="button" class="ps-rx-closure-btn" data-ps-closure-action="resumo">
          <strong>Resumo do atendimento</strong><span>Gera texto e PDF do que foi escolhido</span>
        </button>
        <button type="button" class="ps-rx-closure-btn ps-rx-closure-btn--end" data-ps-closure-action="encerrar">
          <strong>Finalizar protocolo e atendimento</strong><span>Salva em Atendimentos realizados</span>
        </button>
      </div>
      <div class="ps-rx-closure-summary" data-ps-closure-summary hidden></div>
      <p class="ps-rx-closure-status" data-ps-closure-status hidden></p>
    </section>`;
}

function psClosureContextText () {
  let draft = null;
  try {
    draft = JSON.parse(sessionStorage.getItem('medhub-new-encounter-draft') || 'null');
  } catch { /* atendimento sem rascunho */ }
  return draft;
}

function psEscape (value) {
  if (typeof emergSummaryEscape === 'function') return emergSummaryEscape(value);
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Mesmo cabeçalho dos documentos do Guia de emergência: paciente, médico, CRM e datas */
function psDocumentContext () {
  if (typeof emergSummaryContext === 'function') return emergSummaryContext();

  const draft = psClosureContextText();
  let profile = null;
  try {
    if (typeof medhubLoadUserProfile === 'function') profile = medhubLoadUserProfile();
  } catch { /* perfil local indisponível */ }

  const crmNumber = String(profile?.crmNumber || '').replace(/\D/g, '');
  const crm = crmNumber
    ? `CRM-${String(profile?.crmUf || 'SP').toUpperCase()} ${crmNumber}`
    : '';
  const started = draft?.startedAt ? new Date(draft.startedAt) : null;
  const startedLabel = started && !Number.isNaN(started.getTime())
    ? started.toLocaleString('pt-BR')
    : new Date().toLocaleString('pt-BR');

  return {
    patient: [
      draft?.nome,
      draft?.idade ? (/\banos?\b/i.test(String(draft.idade)) ? draft.idade : `${draft.idade} anos`) : '',
      draft?.sexo,
      (draft?.queixas || []).join(' · ')
    ].filter(Boolean).map(psEscape).join(' · '),
    allergies: psEscape(draft?.alergias || 'Não informadas'),
    doctor: psEscape(profile?.rxDisplayName || 'Médico(a) responsável'),
    crm: psEscape(crm || 'CRM não informado'),
    startedAt: psEscape(startedLabel),
    finishedAt: psEscape(new Date().toLocaleString('pt-BR'))
  };
}

function psDocumentHeaderHtml (title, dateLabel) {
  const context = psDocumentContext();
  return `
    <h1>${psEscape(title)}</h1>
    <p class="meta"><strong>Paciente:</strong> ${context.patient || 'Não informado'}</p>
    <p class="meta"><strong>Alergias:</strong> ${context.allergies}</p>
    <p class="meta"><strong>Data do atendimento:</strong> ${context.startedAt} · <strong>${psEscape(dateLabel)}:</strong> ${context.finishedAt}</p>`;
}

/* Assinatura no pé da página, como no receituário: linha, nome e CRM */
function psDocumentSignatureHtml () {
  const context = psDocumentContext();
  const doctor = typeof rxGetDoctorName === 'function'
    ? (rxGetDoctorName() || context.doctor)
    : context.doctor;
  const crm = typeof rxGetStoredCrmDisplay === 'function'
    ? (rxGetStoredCrmDisplay() || context.crm)
    : context.crm;
  const address = typeof medhubGetProfileAddressBlock === 'function'
    ? medhubGetProfileAddressBlock()
    : '';

  return `
    <div class="doc-sign">
      <p>______________________________, ${psEscape(new Date().toLocaleDateString('pt-BR'))}</p>
      <p><strong>Dr(a). ${psEscape(doctor)}</strong></p>
      <p>CRM: ${psEscape(crm)}</p>
      ${address ? `<p class="meta">${psEscape(address).replace(/\n/g, '<br>')}</p>` : ''}
    </div>`;
}

function psBuildClosureSummary (conditionName, selectedLabels, reassessmentText) {
  const itens = selectedLabels.length
    ? selectedLabels.map(label => `<li>${label}</li>`).join('')
    : '<li>Nenhuma medicação marcada.</li>';

  return `
    ${psDocumentHeaderHtml(`${conditionName} — resumo do atendimento`, 'Finalizado')}
    <h2>Conduta escolhida</h2>
    <ul>${itens}</ul>
    ${reassessmentText ? `<h2>Reavaliação</h2><p>${reassessmentText}</p>` : ''}
    ${psDocumentSignatureHtml()}`;
}

function psOpenSectionWithSearch (sectionId, inputId, query) {
  if (typeof showSection === 'function') showSection(sectionId);
  window.setTimeout(() => {
    const input = document.getElementById(inputId);
    if (!input || !query) return;
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, 80);
}

function psRenderInteractiveRx (conditionId, container) {
  const config = typeof psGetInteractiveConfig === 'function'
    ? psGetInteractiveConfig(conditionId)
    : null;
  if (!config || !config.medications || !config.medications.length) return false;

  const allergyBanner = typeof clinicalAllergyBannerHtml === 'function' ? clinicalAllergyBannerHtml() : '';
  const allergyCtx = typeof clinicalGetPsContextFromAllergies === 'function'
    ? clinicalGetPsContextFromAllergies()
    : {};

  const autoNote = config.auto
    ? '<p class="ps-rx-auto-note muted">Opções extraídas automaticamente do protocolo · regras específicas reforçadas em condições-chave.</p>'
    : '';

  const wrap = document.createElement('div');
  wrap.className = 'ps-rx-wrap';
  wrap.innerHTML = `
    <div class="ps-rx-header">
      <h3>Prescrição interativa</h3>
      <p class="muted">Selecione as opções que prescreveria e clique em <strong>Analisar</strong>. O sistema verifica interações e adequação ao protocolo.</p>
      ${autoNote}
      ${allergyBanner}
    </div>
    <div class="ps-rx-context" id="ps-rx-context"></div>
    <div class="ps-rx-meds" id="ps-rx-meds"></div>
    <div class="ps-rx-actions">
      <button type="button" class="btn ps-rx-analyze" id="ps-rx-analyze">Analisar prescrição</button>
      <button type="button" class="btn-outline ps-rx-clear" id="ps-rx-clear">Limpar seleção</button>
    </div>
    <div class="ps-rx-result" id="ps-rx-result" hidden></div>
    ${psRenderClosureHtml()}
  `;

  container.insertBefore(wrap, container.firstChild);

  const ctxEl = wrap.querySelector('#ps-rx-context');
  const medsEl = wrap.querySelector('#ps-rx-meds');
  const resultEl = wrap.querySelector('#ps-rx-result');
  const closureEl = wrap.querySelector('[data-ps-closure]');
  let inhaledReassessment = '';
  const conditionName = (typeof PS_CONDITIONS !== 'undefined'
    ? (PS_CONDITIONS.find(c => c.id === conditionId)?.name || conditionId)
    : conditionId);

  if (config.contextFields && config.contextFields.length) {
    ctxEl.innerHTML = '<fieldset class="ps-rx-fieldset ps-rx-fieldset--context"><legend>Contexto clínico</legend>' +
      config.contextFields.map(field => {
        if (field.id === 'subtype' && field.type === 'select' && typeof psHasEtiologyConfig === 'function' && psHasEtiologyConfig(config)) {
          return psRenderEtiologyPicker(field, config, conditionId);
        }
        return psRenderContextField(field);
      }).join('') +
      '</fieldset>';
    Object.entries(allergyCtx).forEach(([fieldId, val]) => {
      const el = wrap.querySelector('[data-ctx-field="' + fieldId + '"]');
      if (el && el.type === 'checkbox' && val) el.checked = true;
    });
  } else {
    ctxEl.hidden = true;
  }

  psApplyDefaultSubtype(wrap, conditionId, config);

  const filterMeds = (meds, ctx) => {
    if (typeof psFilterInteractiveMeds === 'function') {
      return psFilterInteractiveMeds(meds, ctx || {}, conditionId);
    }
    return meds || [];
  };

  function renderMedGroups (ctx) {
    const context = ctx || getContext();
    const baseGroups = config.groups || [{ id: 'all', label: 'Opções terapêuticas do protocolo', medications: config.medications }];
    const ordered = typeof psSortByEtiologyOrder === 'function' && psHasEtiologyConfig(config)
      ? psSortByEtiologyOrder(conditionId, baseGroups)
      : baseGroups;
    const groups = ordered
      .filter(g => psGroupVisible(g, context))
      .map(g => ({ ...g, medications: filterMeds(g.medications, context) }))
      /* Grupo sem opção no contexto atual (alergia, subtipo) sai da tela em vez de virar aviso */
      .filter(g => (!g.autoStep && !g.tierGroup) || g.medications.length);

    const selectedBefore = new Set(getSelected());

    if (!groups.length) {
      medsEl.innerHTML = '<p class="ps-rx-pick-subtype muted"><strong>Selecione o tipo clínico acima</strong> para ver as opções de tratamento.</p>';
      return;
    }

    const orderAll = typeof psSortByEtiologyOrder === 'function' ? psSortByEtiologyOrder(conditionId, baseGroups) : baseGroups;

    medsEl.innerHTML = groups.map(g => {
      const rank = orderAll.findIndex(x => x.id === g.id);
      const legend = (psHasEtiologyConfig(config) && rank >= 0 && typeof psFormatEtiologyGroupLegend === 'function')
        ? psFormatEtiologyGroupLegend(g, rank)
        : g.label;
      if (!g.medications.length) {
        return `
        <fieldset class="ps-rx-fieldset ps-rx-fieldset--etiology" data-group="${g.id}">
          <legend>${legend}</legend>
          <p class="muted">Nenhuma opção disponível — ocultada por alergia ou contexto clínico.</p>
        </fieldset>`;
      }
      const highlight = rank === 0 && !g.autoStep && !g.tierGroup ? ' ps-rx-fieldset--primary' : '';
      return `
      <fieldset class="ps-rx-fieldset ps-rx-fieldset--etiology${highlight}" data-group="${g.id}">
        <legend>${legend}</legend>
        ${g.hint ? `<p class="ps-rx-group-hint">${g.hint}</p>` : ''}
        <div class="ps-rx-med-list">
          ${g.medications.map(m => psRenderMedOption(m, selectedBefore.has(m.id))).join('')}
        </div>
      </fieldset>`;
    }).join('');
    medsEl.querySelectorAll('.ps-rx-med-entry').forEach(entry => {
      syncGuidedDoseVisibility(entry, false);
    });
  }

  function syncEtiologyTabs () {
    wrap.querySelectorAll('.ps-etiology-tab').forEach(tab => {
      const input = tab.querySelector('input[type="radio"]');
      tab.classList.toggle('ps-etiology-tab--active', !!(input && input.checked));
    });
  }

  function getContext () {
    const ctx = {};
    wrap.querySelectorAll('[data-ctx-field]').forEach(el => {
      if (el.type === 'checkbox') ctx[el.dataset.ctxField] = el.checked;
      else if (el.type === 'radio') {
        if (el.checked) ctx[el.dataset.ctxField] = el.value;
      } else ctx[el.dataset.ctxField] = el.value;
    });
    return ctx;
  }

  function getSelected () {
    const ids = [];
    wrap.querySelectorAll('.ps-rx-med-check:checked').forEach(el => {
      ids.push(el.value);
    });
    return ids;
  }

  function guidedDoseText (guide) {
    if (!guide) return '';
    const route = guide.querySelector('[data-ps-dose-route]:checked')?.value || '';
    const amount = guide.querySelector('[data-ps-dose-amount]')?.value || '';
    const cycles = guide.querySelector('[data-ps-dose-cycles]')?.value || '';
    if (!route || !amount || !cycles) return '';
    const via = route === 'mdi' ? 'MDI com espaçador' : 'nebulização';
    return `${via} · ${amount} por ciclo · ${cycles} ciclo(s), a cada 20 min`;
  }

  function updateGuidedDose (guide) {
    if (!guide) return;
    const route = guide.querySelector('[data-ps-dose-route]:checked')?.value || '';
    const amount = guide.querySelector('[data-ps-dose-amount]');
    const currentAmount = amount?.value || '';
    const options = route === 'mdi'
      ? [
          ['4 puffs', '4 puffs'],
          ['6 puffs', '6 puffs'],
          ['8 puffs', '8 puffs']
        ]
      : (route === 'nebulizacao'
          ? [
              ['2,5 mg + 3 mL SF 0,9%', '2,5 mg + 3 mL SF 0,9%'],
              ['5 mg + 3 mL SF 0,9%', '5 mg + 3 mL SF 0,9%']
            ]
          : []);

    if (amount && amount.dataset.route !== route) {
      amount.dataset.route = route;
      amount.disabled = !route;
      amount.innerHTML = route
        ? '<option value="">Selecione</option>' +
          options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')
        : '<option value="">Escolha primeiro a via</option>';
      if (options.some(([value]) => value === currentAmount)) amount.value = currentAmount;
    }

    const preview = guide.querySelector('[data-ps-dose-preview]');
    const text = guidedDoseText(guide);
    if (preview) {
      preview.textContent = text ? `Esquema: ${text}.` : 'Preencha via, dose e ciclos.';
      preview.classList.toggle('is-complete', !!text);
    }
  }

  function syncGuidedDoseVisibility (entry, reset) {
    const checkbox = entry?.querySelector('.ps-rx-med-check');
    const guide = entry?.querySelector('[data-ps-dose-guide]');
    if (!checkbox || !guide) return;
    guide.hidden = !checkbox.checked;
    if (!checkbox.checked && reset) {
      guide.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
      guide.querySelector('[data-ps-dose-cycles]').value = '';
      const amount = guide.querySelector('[data-ps-dose-amount]');
      amount.dataset.route = '';
      amount.disabled = true;
      amount.innerHTML = '<option value="">Escolha primeiro a via</option>';
    }
    updateGuidedDose(guide);
  }

  function incompleteGuidedDoses () {
    return [...wrap.querySelectorAll('.ps-rx-med-check:checked')]
      .map(input => input.closest('.ps-rx-med-entry'))
      .filter(entry => {
        const guide = entry?.querySelector('[data-ps-dose-guide]');
        return guide && !guidedDoseText(guide);
      });
  }

  function requireGuidedDoses () {
    const incomplete = incompleteGuidedDoses();
    if (!incomplete.length) return true;
    resultEl.hidden = false;
    resultEl.removeAttribute('hidden');
    resultEl.className = 'ps-rx-result ps-rx-result--error';
    resultEl.innerHTML = `
      <h4>✗ Complete o esquema inalatório</h4>
      <ul class="ps-rx-result-list">
        <li class="ps-rx-msg ps-rx-msg--error">
          Informe a via, a dose por ciclo e o número de ciclos do salbutamol antes de continuar.
        </li>
      </ul>`;
    incomplete[0].querySelector('[data-ps-dose-guide]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
    return false;
  }

  renderMedGroups();
  syncEtiologyTabs();
  wrap.querySelectorAll('.ps-rx-med-entry').forEach(entry => syncGuidedDoseVisibility(entry, false));

  wrap.querySelectorAll('[data-ctx-field]').forEach(el => {
    el.addEventListener('change', () => {
      syncEtiologyTabs();
      renderMedGroups();
      resultEl.hidden = true;
    });
  });

  wrap.querySelector('#ps-rx-analyze').addEventListener('click', () => {
    if (!requireGuidedDoses()) return;
    let analysis;
    try {
      analysis = psValidatePrescription(conditionId, config, getSelected(), getContext());
    } catch (err) {
      console.error('PS analyze error:', err);
      analysis = {
        status: 'error',
        messages: [{ severity: 'error', text: 'Erro ao analisar a prescrição. Tente novamente ou use o protocolo abaixo.' }]
      };
    }
    resultEl.hidden = false;
    resultEl.removeAttribute('hidden');
    resultEl.className = `ps-rx-result ps-rx-result--${analysis.status}`;
    resultEl.innerHTML = `
      <h4>${analysis.status === 'ok' ? '✓ Prescrição adequada' : analysis.status === 'warning' ? '⚠ Revise a prescrição' : '✗ Interação ou contraindicação'}</h4>
      <ul class="ps-rx-result-list">
        ${analysis.messages.map(m => `<li class="ps-rx-msg ps-rx-msg--${m.severity}">${m.text}</li>`).join('')}
      </ul>
      <p class="ps-rx-disclaimer" hidden></p>
      ${renderInhaledReassessment()}
    `;
    bindInhaledReassessment();
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showClosure();
  });

  function selectedLabels () {
    return [...wrap.querySelectorAll('.ps-rx-med-check:checked')].map(input => {
      const card = input.closest('.ps-rx-med-card');
      const guide = input.closest('.ps-rx-med-entry')?.querySelector('[data-ps-dose-guide]');
      const step = input.closest('.ps-rx-fieldset')?.querySelector('legend')?.textContent?.trim() || '';
      const label = card?.querySelector('strong')?.textContent?.trim() || input.value;
      const dose = guidedDoseText(guide);
      const fullLabel = dose ? `${label} — ${dose}` : label;
      return step ? `${step}: ${fullLabel}` : fullLabel;
    });
  }

  function selectedGuidedDose () {
    const input = [...wrap.querySelectorAll('.ps-rx-med-check:checked')].find(candidate => (
      candidate.closest('.ps-rx-med-entry')?.querySelector('[data-ps-dose-guide]')
    ));
    if (!input) return null;
    const guide = input.closest('.ps-rx-med-entry').querySelector('[data-ps-dose-guide]');
    const text = guidedDoseText(guide);
    if (!guide || !text) return null;
    const label = input.closest('.ps-rx-med-card')?.querySelector('strong')?.textContent?.trim() || 'Salbutamol';
    return {
      label,
      text,
      cycles: Number(guide.querySelector('[data-ps-dose-cycles]')?.value || 0)
    };
  }

  function cycleOrdinal (cycles) {
    if (cycles === 1) return '1º ciclo';
    if (cycles === 2) return '2º ciclo';
    return '3º ciclo';
  }

  function reassessmentSummaryText () {
    const dose = selectedGuidedDose();
    if (!dose || !inhaledReassessment) return '';
    return inhaledReassessment === 'sim'
      ? `Após o ${cycleOrdinal(dose.cycles)}, paciente apresentou melhora do quadro: sim. Encaminhado para prescrição para casa.`
      : `Após o ${cycleOrdinal(dose.cycles)}, paciente apresentou melhora do quadro: não. Alta e prescrição para casa não indicadas nesta etapa.`;
  }

  function renderInhaledReassessment () {
    const dose = selectedGuidedDose();
    if (!dose) return '';
    return `
      <section class="ps-rx-reassessment" data-ps-reassessment>
        <div class="ps-rx-reassessment-head">
          <strong>Prescrição para administração imediata</strong>
          <p>${dose.label} — ${dose.text}.</p>
        </div>
        <button type="button" class="btn ps-rx-cycle-prescription" data-ps-cycle-prescription>
          Gerar prescrição dos ${dose.cycles} ciclo(s)
        </button>
        <div class="ps-rx-reassessment-question">
          <strong>Reavaliar após o ${cycleOrdinal(dose.cycles)}</strong>
          <p>O paciente apresentou melhora do quadro?</p>
          <div class="ps-rx-reassessment-options">
            <button type="button" data-ps-improved="sim">Sim</button>
            <button type="button" data-ps-improved="nao">Não</button>
          </div>
          <p class="ps-rx-reassessment-outcome" data-ps-reassessment-outcome hidden></p>
          <div class="ps-rx-reassessment-next" data-ps-reassessment-next hidden>
            <strong>O que você quer fazer agora?</strong>
            <div class="ps-rx-reassessment-next-actions">
              <button type="button" data-ps-next="receituario">Prescrever medicação para casa</button>
              <button type="button" data-ps-next="encerrar">Finalizar atendimento do paciente</button>
            </div>
          </div>
        </div>
      </section>`;
  }

  function bindInhaledReassessment () {
    const panel = resultEl.querySelector('[data-ps-reassessment]');
    if (!panel) return;

    panel.querySelector('[data-ps-cycle-prescription]')?.addEventListener('click', () => {
      const dose = selectedGuidedDose();
      if (!dose) return;
      const outrasEscolhas = selectedLabels().filter(label => !label.includes(dose.text));
      const html = `
        ${psDocumentHeaderHtml(`${conditionName} — prescrição de administração imediata`, 'Emitido em')}
        <h2>Prescrição</h2>
        <ul>
          <li>${psEscape(dose.label)} — ${psEscape(dose.text)}.</li>
          ${outrasEscolhas.map(label => `<li>${psEscape(label)}</li>`).join('')}
        </ul>
        ${psDocumentSignatureHtml()}`;
      if (typeof emergPrintSummary === 'function') {
        emergPrintSummary(`${conditionName} — prescrição dos ciclos`, html);
      } else {
        window.print?.();
      }
    });

    panel.querySelectorAll('[data-ps-improved]').forEach(button => {
      button.addEventListener('click', () => {
        inhaledReassessment = button.dataset.psImproved;
        panel.querySelectorAll('[data-ps-improved]').forEach(option => {
          option.classList.toggle('is-selected', option === button);
        });
        const outcome = panel.querySelector('[data-ps-reassessment-outcome]');
        const next = panel.querySelector('[data-ps-reassessment-next]');
        outcome.hidden = false;
        outcome.className = `ps-rx-reassessment-outcome is-${inhaledReassessment}`;
        next.hidden = inhaledReassessment !== 'sim';
        if (inhaledReassessment === 'sim') {
          outcome.textContent = 'Melhora confirmada ✓ Escolha o próximo passo abaixo.';
          showClosure();
        } else {
          outcome.textContent = 'Sem melhora ✗ Não encaminhar para casa. Mantenha o paciente em atendimento e reavalie escalonamento da conduta.';
          showClosure();
        }
      });
    });

    panel.querySelectorAll('[data-ps-next]').forEach(button => {
      button.addEventListener('click', () => {
        if (button.dataset.psNext === 'receituario') {
          psOpenSectionWithSearch('receituario', 'rx-search', conditionName);
          return;
        }
        finishEncounter();
      });
    });
  }

  function showClosure () {
    if (!closureEl) return;
    const escolhas = selectedLabels();
    const count = closureEl.querySelector('[data-ps-closure-count]');
    if (count) {
      count.textContent = escolhas.length
        ? `${escolhas.length} medicação(ões) marcada(s) — prescreva, peça exames ou finalize o atendimento.`
        : 'Nenhuma medicação marcada — você ainda pode prescrever, pedir exames ou finalizar.';
    }
    const homeButton = closureEl.querySelector('[data-ps-closure-action="receituario"]');
    const needsReassessment = !!selectedGuidedDose();
    if (homeButton) {
      homeButton.disabled = needsReassessment && inhaledReassessment !== 'sim';
      const detail = homeButton.querySelector('span');
      if (detail) {
        detail.textContent = homeButton.disabled
          ? 'Disponível após confirmar melhora na reavaliação'
          : 'Abre o receituário com a conduta';
      }
    }
  }

  function setClosureStatus (text) {
    const status = closureEl?.querySelector('[data-ps-closure-status]');
    if (!status) return;
    status.hidden = !text;
    status.textContent = text || '';
  }

  async function finishEncounter () {
    if (!requireGuidedDoses()) return;
    if (selectedGuidedDose() && !inhaledReassessment) {
      setClosureStatus('Informe se o paciente apresentou melhora após o último ciclo antes de finalizar.');
      resultEl.querySelector('[data-ps-reassessment]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    const draft = psClosureContextText();
    const nome = draft?.nome ? ` de ${draft.nome}` : '';
    if (!window.confirm(
      `Tem certeza que quer finalizar o protocolo ${conditionName} e o atendimento${nome}?\n\n` +
      'O atendimento deixará de aparecer como “em andamento”.'
    )) return;

    const html = psBuildClosureSummary(conditionName, selectedLabels(), reassessmentSummaryText());
    const holder = document.createElement('div');
    holder.innerHTML = html;
    const summaryText = (holder.innerText || holder.textContent || '').replace(/\n{3,}/g, '\n\n').trim();

    let saved = null;
    if (typeof consultasRegisterEmergencyProtocol === 'function') {
      saved = await consultasRegisterEmergencyProtocol({
        sourceId: `ps:${conditionId}:${draft?.startedAt || draft?.nome || Date.now()}`,
        protocolo: conditionName,
        pacienteNome: draft?.nome || 'Paciente não informado',
        queixa: (draft?.queixas || []).join(' · '),
        summaryHtml: html,
        summaryText,
        notas: 'Atendimento finalizado pelas Prescrições de PS.'
      });
    }

    if (typeof novoAtendimentoFinishEncounter === 'function') novoAtendimentoFinishEncounter();

    setClosureStatus(saved?.cloudSaved
      ? 'Protocolo finalizado · atendimento salvo na nuvem ✓'
      : (saved?.ok
          ? 'Protocolo finalizado · salvo localmente (sincronização pendente)'
          : 'Protocolo finalizado ✓'));
  }

  closureEl?.querySelectorAll('[data-ps-closure-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.psClosureAction;

      if (action === 'receituario') {
        if (!requireGuidedDoses()) return;
        if (selectedGuidedDose() && inhaledReassessment !== 'sim') {
          setClosureStatus('Reavalie o paciente após o último ciclo e confirme melhora antes da prescrição para casa.');
          resultEl.querySelector('[data-ps-reassessment]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }
        psOpenSectionWithSearch('receituario', 'rx-search', conditionName);
        return;
      }
      if (action === 'exames') {
        psOpenSectionWithSearch('exames', 'exames-search', conditionName);
        return;
      }
      if (action === 'resumo') {
        if (!requireGuidedDoses()) return;
        const html = psBuildClosureSummary(conditionName, selectedLabels(), reassessmentSummaryText());
        const out = closureEl.querySelector('[data-ps-closure-summary]');
        out.hidden = false;
        out.innerHTML = `
          <div class="ps-rx-closure-summary-body">${html}</div>
          <div class="ps-rx-closure-summary-actions">
            <button type="button" data-ps-summary-print>Imprimir / salvar PDF</button>
            <button type="button" data-ps-summary-copy>Copiar texto</button>
          </div>`;
        out.querySelector('[data-ps-summary-print]').addEventListener('click', () => {
          if (typeof emergPrintSummary === 'function') {
            emergPrintSummary(`${conditionName} — resumo`, html);
          } else {
            window.print?.();
          }
        });
        out.querySelector('[data-ps-summary-copy]').addEventListener('click', event => {
          const holder = document.createElement('div');
          holder.innerHTML = html;
          navigator.clipboard?.writeText((holder.innerText || '').trim());
          event.currentTarget.textContent = 'Texto copiado ✓';
        });
        out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
      if (action === 'encerrar') finishEncounter();
    });
  });

  /* As opções são re-renderizadas a cada contexto: escuta na lista, não no input */
  medsEl.addEventListener('change', event => {
    const entry = event.target.closest?.('.ps-rx-med-entry');
    if (event.target.classList?.contains('ps-rx-med-check')) {
      inhaledReassessment = '';
      syncGuidedDoseVisibility(entry, true);
      resultEl.hidden = true;
      showClosure();
      return;
    }
    if (event.target.matches?.('[data-ps-dose-route], [data-ps-dose-amount], [data-ps-dose-cycles]')) {
      inhaledReassessment = '';
      updateGuidedDose(entry?.querySelector('[data-ps-dose-guide]'));
      resultEl.hidden = true;
      showClosure();
    }
  });

  showClosure();

  wrap.querySelector('#ps-rx-clear').addEventListener('click', () => {
    wrap.querySelectorAll('.ps-rx-med-check').forEach(el => { el.checked = false; });
    wrap.querySelectorAll('[data-ctx-field]').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else if (el.type === 'radio') el.checked = false;
      else if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    });
    psApplyDefaultSubtype(wrap, conditionId, config);
    syncEtiologyTabs();
    renderMedGroups();
    resultEl.hidden = true;
  });

  return true;
}

function psRenderEtiologyPicker (field, config, conditionId) {
  const defaultVal = config.defaultContext?.subtype || PS_DEFAULT_SUBTYPE[conditionId] || '';
  const options = typeof psSortByEtiologyOrder === 'function'
    ? psSortByEtiologyOrder(conditionId, field.options, 'value')
    : field.options.slice();
  return `
    <div class="ps-etiology-picker" role="radiogroup" aria-label="${field.label}">
      <p class="ps-etiology-picker-title">${field.label}</p>
      <p class="ps-etiology-picker-hint muted">Ordem por frequência na urgência — escolha o quadro que melhor descreve o paciente.</p>
      <div class="ps-etiology-tabs">
        ${options.map((o, i) => {
          const checked = o.value === defaultVal;
          const short = typeof psEtiologyOptionShortLabel === 'function'
            ? psEtiologyOptionShortLabel(o.label)
            : o.label.split('(')[0].trim();
          const detail = o.label.includes('(') ? o.label.slice(o.label.indexOf('(')).replace(/^\(/, '').replace(/\)$/, '') : '';
          return `
          <label class="ps-etiology-tab${checked ? ' ps-etiology-tab--active' : ''}">
            <input type="radio" name="ps-subtype-${conditionId}" data-ctx-field="${field.id}" value="${o.value}"${checked ? ' checked' : ''}>
            <span class="ps-etiology-tab-rank">${typeof psEtiologyRankPrefix === 'function' ? psEtiologyRankPrefix(i) : i + 1}</span>
            <span class="ps-etiology-tab-body">
              <span class="ps-etiology-tab-text">${short}</span>
              ${detail ? `<span class="ps-etiology-tab-detail">${detail}</span>` : ''}
            </span>
            ${i === 0 ? '<span class="ps-etiology-tab-badge">Mais comum</span>' : ''}
          </label>`;
        }).join('')}
      </div>
    </div>`;
}

function psRenderContextField (field) {
  if (field.type === 'select') {
    return `
      <label class="ps-rx-label">${field.label}
        <select data-ctx-field="${field.id}" class="ps-rx-select">
          <option value="">— Selecione —</option>
          ${field.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
        </select>
      </label>`;
  }
  if (field.type === 'checkbox') {
    return `
      <label class="ps-rx-check">
        <input type="checkbox" data-ctx-field="${field.id}"> ${field.label}
      </label>`;
  }
  return '';
}

function psNeedsGuidedInhaledDose (med) {
  const hasSalbutamol = (med?.drugs || []).some(drug => drug.id === 'salbutamol');
  return hasSalbutamol && /\b(MDI|puffs?|jatos?)\b/i.test(med.label || '');
}

function psRenderGuidedInhaledDose (med) {
  if (!psNeedsGuidedInhaledDose(med)) return '';
  const radioName = `ps-dose-route-${String(med.id).replace(/[^a-z0-9_-]/gi, '-')}`;
  return `
    <div class="ps-rx-dose-guide" data-ps-dose-guide data-med-id="${med.id}" hidden>
      <strong>Defina a administração</strong>
      <p>Escolha a via, a dose de cada ciclo e quantos ciclos serão feitos.</p>
      <div class="ps-rx-dose-routes" role="radiogroup" aria-label="Via do salbutamol">
        <label>
          <input type="radio" name="${radioName}" value="mdi" data-ps-dose-route>
          MDI com espaçador
        </label>
        <label>
          <input type="radio" name="${radioName}" value="nebulizacao" data-ps-dose-route>
          Nebulização
        </label>
      </div>
      <div class="ps-rx-dose-fields">
        <label>
          <span>Dose por ciclo</span>
          <select data-ps-dose-amount disabled>
            <option value="">Escolha primeiro a via</option>
          </select>
        </label>
        <label>
          <span>Número de ciclos</span>
          <select data-ps-dose-cycles>
            <option value="">Selecione</option>
            <option value="1">1 ciclo</option>
            <option value="2">2 ciclos</option>
            <option value="3">3 ciclos</option>
          </select>
        </label>
      </div>
      <p class="ps-rx-dose-interval">Intervalo: a cada 20 minutos.</p>
      <p class="ps-rx-dose-preview" data-ps-dose-preview>Preencha via, dose e ciclos.</p>
    </div>`;
}

function psRenderMedOption (med, checked) {
  const tierLabel = typeof psTierLabel === 'function' ? psTierLabel(med.tier) : med.tier;
  const tier = tierLabel ? `<span class="ps-rx-tier ps-rx-tier--${tierLabel.replace(/\s+/g, '')}">${tierLabel}</span>` : '';
  const isChecked = checked ? ' checked' : '';
  return `
    <div class="ps-rx-med-entry">
      <label class="ps-rx-med-card">
        <input type="checkbox" class="ps-rx-med-check" value="${med.id}"${isChecked}>
        <span class="ps-rx-med-body">
          ${tier}
          <strong>${med.label}</strong>
          ${med.detail ? `<span class="ps-rx-med-detail">${med.detail}</span>` : ''}
        </span>
      </label>
      ${psRenderGuidedInhaledDose(med)}
    </div>`;
}

function initPsInteractive (conditionId, contentEl) {
  const block = contentEl.querySelector('.emerg-algo-single') || contentEl;
  block.querySelectorAll('.ps-rx-wrap, .ps-rx-soon, .ps-rx-protocol-divider').forEach(el => el.remove());

  const config = typeof psGetInteractiveConfig === 'function' ? psGetInteractiveConfig(conditionId) : null;
  const hasEtiology = typeof psHasEtiologyConfig === 'function' && psHasEtiologyConfig(config);

  const hasInteractive = psRenderInteractiveRx(conditionId, block);
  if (hasInteractive) {
    if (hasEtiology) {
      block.querySelectorAll(':scope > .ps-med-options, :scope > p + .ps-med-options, :scope > .muted + .ps-med-options').forEach(el => {
        el.classList.add('ps-html-meds--hidden');
      });
    }
    const divider = document.createElement('p');
    divider.className = 'ps-rx-protocol-divider';
    divider.textContent = 'Protocolo completo (referência clínica)';
    const rxWrap = block.querySelector('.ps-rx-wrap');
    if (rxWrap) rxWrap.after(divider);
  }
}
