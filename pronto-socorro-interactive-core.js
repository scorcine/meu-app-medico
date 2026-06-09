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
    max: 2,
    severity: 'warning',
    message: 'Múltiplos opioides aumentam risco de depressão respiratória — prefira um só.'
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

  const abMeds = meds.filter(psMedHasAntibiotic);
  if (abMeds.length >= 2) {
    const hasFirst = abMeds.some(m => /1ª linha/i.test(m.tier || ''));
    const hasAlt = abMeds.some(m => /alternativa|resist/i.test(m.tier || ''));
    const hasRefr = abMeds.some(m => /refract|refrat/i.test(m.tier || ''));
    const hasAlerg = abMeds.some(m => /alerg/i.test(m.tier || ''));
    let tierGroups = 0;
    if (hasFirst) tierGroups++;
    if (hasAlt) tierGroups++;
    if (hasRefr) tierGroups++;
    if (hasAlerg) tierGroups++;

    if (tierGroups >= 2 && !psIsValidAntibioticCombination(abIds)) {
      messages.push({
        severity: 'error',
        text: 'Selecionou esquemas de ATB de linhas diferentes do protocolo (1ª linha, alternativa, alérgico ou refractário) — use apenas um esquema empírico por vez.'
      });
    }
  }

  return messages;
}

function psCheckDuplicateAnalgesics (drugs) {
  const analgesics = [...new Set(
    drugs
      .filter(d => (PS_DRUG_META[d.id]?.classes || []).includes('analgesic'))
      .map(d => d.id)
  )];
  if (analgesics.length >= 3) {
    return [{
      severity: 'warning',
      text: `Três ou mais analgésicos (${analgesics.map(psDrugLabel).join(', ')}) — revise necessidade e risco acumulado.`
    }];
  }
  return [];
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
    const count = drugs.filter(d => {
      const meta = PS_DRUG_META[d.id];
      return meta && meta.classes.includes(rule.class);
    }).length;
    if (count > rule.max) {
      messages.push({ severity: rule.severity, text: rule.message });
    }
  });

  PS_PAIR_RULES.forEach(rule => {
    const ids = drugs.map(d => d.id);
    if (rule.drugs.every(d => ids.includes(d))) {
      messages.push({ severity: rule.severity, text: rule.message });
    }
  });

  psCheckAntibioticInteractions(drugs, meds).forEach(m => messages.push(m));
  psCheckDuplicateAnalgesics(drugs).forEach(m => messages.push(m));

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

  if (context.gestante) {
    drugs.forEach(d => {
      if (['nsaid', 'triptan'].some(c => (PS_DRUG_META[d.id]?.classes || []).includes(c))) {
        if (d.id !== 'paracetamol' && d.id !== 'dipirona') {
          messages.push({
            severity: 'warning',
            text: `${psDrugLabel(d.id)} — revisar risco/benefício na gestação (preferir paracetamol/dipirona e metoclopramida).`
          });
        }
      }
    });
  }

  if (context.drc) {
    drugs.forEach(d => {
      if ((PS_DRUG_META[d.id]?.classes || []).includes('nsaid')) {
        messages.push({
          severity: 'warning',
          text: `${psDrugLabel(d.id)} — cautela ou evitar em DRC (risco de piora renal).`
        });
      }
    });
  }

  if (context.alergia_aine) {
    drugs.forEach(d => {
      if ((PS_DRUG_META[d.id]?.classes || []).includes('nsaid')) {
        messages.push({
          severity: 'error',
          text: `${psDrugLabel(d.id)} contraindicado — alergia a AINE informada.`
        });
      }
    });
  }

  if (context.contraindicacao_triptano) {
    drugs.forEach(d => {
      if ((PS_DRUG_META[d.id]?.classes || []).includes('triptan')) {
        messages.push({
          severity: 'error',
          text: `${psDrugLabel(d.id)} contraindicado — DAC, AVC prévio ou PA não controlada.`
        });
      }
    });
  }

  if (context.alergia_penicilina) {
    drugs.forEach(d => {
      const meta = PS_DRUG_META[d.id];
      if (!meta) return;
      if (meta.classes.some(c => PS_PENICILLIN_CLASS.includes(c))) {
        messages.push({
          severity: 'error',
          text: `${psDrugLabel(d.id)} contraindicado — alergia grave à penicilina informada.`
        });
      } else if (meta.classes.some(c => PS_CEPHALOSPORIN_CLASS.includes(c))) {
        messages.push({
          severity: 'warning',
          text: `${psDrugLabel(d.id)} — reatividade cruzada possível com penicilina; preferir alternativa se alergia grave.`
        });
      }
    });
  }

  if (context.dengue_fase_critica || context.plaquetopenia) {
    drugs.forEach(d => {
      if ((PS_DRUG_META[d.id]?.classes || []).includes('nsaid')) {
        messages.push({
          severity: 'error',
          text: `${psDrugLabel(d.id)} — evitar AINE com plaquetopenia/dengue crítica (risco hemorrágico).`
        });
      }
      if (context.plaquetopenia &&
          ((PS_DRUG_META[d.id]?.classes || []).includes('anticoagulant') ||
           (PS_DRUG_META[d.id]?.classes || []).includes('antiplatelet'))) {
        messages.push({
          severity: 'warning',
          text: `${psDrugLabel(d.id)} — cautela com plaquetopenia/sangramento.`
        });
      }
    });
  }

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

function psRenderInteractiveRx (conditionId, container) {
  const config = typeof psGetInteractiveConfig === 'function'
    ? psGetInteractiveConfig(conditionId)
    : null;
  if (!config || !config.medications || !config.medications.length) return false;

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
    </div>
    <div class="ps-rx-context" id="ps-rx-context"></div>
    <div class="ps-rx-meds" id="ps-rx-meds"></div>
    <div class="ps-rx-actions">
      <button type="button" class="btn ps-rx-analyze" id="ps-rx-analyze">Analisar prescrição</button>
      <button type="button" class="btn-outline ps-rx-clear" id="ps-rx-clear">Limpar seleção</button>
    </div>
    <div class="ps-rx-result" id="ps-rx-result" hidden></div>
  `;

  container.insertBefore(wrap, container.firstChild);

  const ctxEl = wrap.querySelector('#ps-rx-context');
  const medsEl = wrap.querySelector('#ps-rx-meds');
  const resultEl = wrap.querySelector('#ps-rx-result');

  if (config.contextFields && config.contextFields.length) {
    ctxEl.innerHTML = '<fieldset class="ps-rx-fieldset"><legend>Contexto clínico</legend>' +
      config.contextFields.map(field => psRenderContextField(field)).join('') +
      '</fieldset>';
  } else {
    ctxEl.hidden = true;
  }

  const groups = config.groups || [{ id: 'all', label: 'Opções terapêuticas do protocolo', medications: config.medications }];
  medsEl.innerHTML = groups.map(g => `
    <fieldset class="ps-rx-fieldset" data-group="${g.id}">
      <legend>${g.label}</legend>
      <div class="ps-rx-med-list">
        ${g.medications.map(m => psRenderMedOption(m)).join('')}
      </div>
    </fieldset>
  `).join('');

  function getContext () {
    const ctx = {};
    wrap.querySelectorAll('[data-ctx-field]').forEach(el => {
      if (el.type === 'checkbox') ctx[el.dataset.ctxField] = el.checked;
      else ctx[el.dataset.ctxField] = el.value;
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

  wrap.querySelector('#ps-rx-analyze').addEventListener('click', () => {
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
      <p class="ps-rx-disclaimer">Ferramenta educacional — não substitui julgamento clínico nem bula/local.</p>
    `;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  wrap.querySelector('#ps-rx-clear').addEventListener('click', () => {
    wrap.querySelectorAll('.ps-rx-med-check').forEach(el => { el.checked = false; });
    wrap.querySelectorAll('[data-ctx-field]').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    });
    resultEl.hidden = true;
  });

  return true;
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

function psRenderMedOption (med) {
  const tier = med.tier ? `<span class="ps-rx-tier ps-rx-tier--${med.tier.replace(/\s+/g, '')}">${med.tier}</span>` : '';
  return `
    <label class="ps-rx-med-card">
      <input type="checkbox" class="ps-rx-med-check" value="${med.id}">
      <span class="ps-rx-med-body">
        ${tier}
        <strong>${med.label}</strong>
        ${med.detail ? `<span class="ps-rx-med-detail">${med.detail}</span>` : ''}
      </span>
    </label>`;
}

function initPsInteractive (conditionId, contentEl) {
  const block = contentEl.querySelector('.emerg-algo-single') || contentEl;
  block.querySelectorAll('.ps-rx-wrap, .ps-rx-soon, .ps-rx-protocol-divider').forEach(el => el.remove());

  const hasInteractive = psRenderInteractiveRx(conditionId, block);
  if (hasInteractive) {
    const divider = document.createElement('p');
    divider.className = 'ps-rx-protocol-divider';
    divider.textContent = 'Protocolo completo (referência)';
    const rxWrap = block.querySelector('.ps-rx-wrap');
    if (rxWrap) rxWrap.after(divider);
  }
}
