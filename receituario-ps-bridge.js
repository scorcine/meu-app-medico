/* Receituário — catálogo completo a partir dos protocolos PS + modelos manuais */

const RX_MANUAL_PRIORITY_IDS = new Set([
  'cefaleias',
  'amigdalite-bacteriana',
  'cistite-itu-baixa',
  'lombalgia-ciatalgia'
]);

let RX_CATALOG_CACHE = null;

function rxInferClassesFromPsDrugs (drugs) {
  const classes = new Set();
  (drugs || []).forEach(d => {
    (PS_DRUG_META[d.id]?.classes || []).forEach(c => {
      if (c === 'analgesic') classes.add('analgesic_non_opioid');
      else if (c === 'ccb') classes.add('calcium_channel_blocker');
      else classes.add(c);
    });
  });
  return [...classes];
}

function rxGenerateAliasesFromPs (psCondition) {
  const aliases = new Set();
  const normName = rxNormText(psCondition.name);
  aliases.add(normName);
  aliases.add(rxNormText(psCondition.id.replace(/-/g, ' ')));
  normName.split(/[^a-z0-9]+/).filter(w => w.length > 3).slice(0, 8).forEach(w => aliases.add(w));
  return [...aliases];
}

function rxShouldSkipPsMedLine (tier, label, fullText) {
  const t = (tier || '').toLowerCase();
  const norm = rxNormText(fullText || label || '');

  if (/evitar/i.test(t)) return true;

  if (/contraindicad/i.test(norm)) {
    if (/ibuprofeno|diclofenac|naproxeno|cetoprofeno|nimesulid|aas|aspirin|acetilsalicilico|\baine\b/.test(norm)) {
      return true;
    }
  }

  if (/contraindica/.test(t) && /ibuprofeno|diclofenac|naproxeno|aas|aspirin/.test(norm)) {
    return true;
  }

  return false;
}

function rxNormalizeVoText (text) {
  const t = (text || '').trim();
  if (!t) return t;

  if (typeof MED_VO !== 'undefined') {
    if (/dipirona.*500.*vo/i.test(t)) return MED_VO.dipirona500;
    if (/dipirona.*(1\s*g|1000).*vo/i.test(t)) return MED_VO.dipirona1g;
    if (/paracetamol.*750.*vo/i.test(t)) return MED_VO.paracetamol750;
    if (/paracetamol.*(1\s*g|1000).*vo/i.test(t)) return MED_VO.paracetamol1g;
    if (/paracetamol.*500.*vo/i.test(t)) return MED_VO.paracetamol500;
    if (/naproxeno.*250/i.test(t)) return MED_VO.naproxeno250;
    if (/naproxeno.*500/i.test(t)) return MED_VO.naproxeno500;
    if (/ibuprofeno.*600/i.test(t)) return MED_VO.ibuprofeno600;
    if (/ibuprofeno.*400/i.test(t)) return MED_VO.ibuprofeno400;
    if (/amoxicilina.*500.*8/i.test(t)) return MED_VO.amoxicilina500;
    if (/amoxicilina.*875/i.test(t)) return MED_VO.amoxicilina875;
    if (/fosfomicina.*3\s*g/i.test(t)) return MED_VO.fosfomicina3g;
    if (/nitrofurantoina.*100/i.test(t)) return MED_VO.nitrofurantoina100;
    if (/tramadol.*50/i.test(t)) return MED_VO.tramadol50;
  }

  if (/\b(EV|IV|IM)\b/i.test(t) && !/\bVO\b/i.test(t)) {
    return t + ' — adaptar apresentação VO na alta ambulatorial, se indicado';
  }
  return t;
}

function rxParseLabelToMeds (optId, label) {
  if (/\s+ou\s+/i.test(label)) {
    const parts = label.split(/\s+ou\s+/i).map(s => s.trim()).filter(Boolean);
    const group = `${optId}-alt`;
    return parts.map((part, i) => ({
      id: `${optId}-m${i}`,
      text: rxNormalizeVoText(part),
      classes: typeof rxInferMedClasses === 'function' ? rxInferMedClasses(part) : [],
      exclusiveGroup: group
    }));
  }

  const comboParts = label.split(/\s*[·+]\s*/).map(s => s.trim()).filter(Boolean);
  if (comboParts.length > 1) {
    return comboParts.map((part, i) => ({
      id: `${optId}-m${i}`,
      text: rxNormalizeVoText(part),
      classes: typeof rxInferMedClasses === 'function' ? rxInferMedClasses(part) : []
    }));
  }

  return [{
    id: `${optId}-m0`,
    text: rxNormalizeVoText(label),
    classes: typeof rxInferMedClasses === 'function' ? rxInferMedClasses(label) : []
  }];
}

function rxPsMedToRxOption (conditionId, psMed) {
  const optId = `rxps-${conditionId}-${psMed.id}`;
  const meds = rxParseLabelToMeds(optId, psMed.label);
  const optionClasses = rxInferClassesFromPsDrugs(psMed.drugs);

  return {
    id: optId,
    tier: psMed.tier || 'Opção',
    label: psMed.label.length > 120 ? psMed.label.slice(0, 117) + '…' : psMed.label,
    classes: optionClasses,
    items: [],
    meds,
    orientacoes: 'Protocolo PS MedHub (diretriz). Revisar via, dose, alergias e contraindicações antes de prescrever.'
  };
}

function rxGroupSortKey (label) {
  const l = rxNormText(label);
  if (/sintomatic|analges|suporte|medidas|viral|adjuvante/i.test(l)) return 0;
  if (/1ª linha|primeira linha/i.test(l)) return 1;
  if (/alternativa/i.test(l)) return 2;
  if (/profilax/i.test(l)) return 3;
  if (/antibiot|atb\b/i.test(l)) return 4;
  if (/refract|refrat|grave|abscesso|intern/i.test(l)) return 5;
  if (/alerg/i.test(l)) return 6;
  if (/evitar/i.test(l)) return 9;
  return 3;
}

function rxSortGroups (groups) {
  return groups.slice().sort((a, b) => rxGroupSortKey(a.label) - rxGroupSortKey(b.label));
}

function rxParseGroupedMedsFromHtml (conditionId, html) {
  if (typeof psParseTier !== 'function') return null;

  const div = document.createElement('div');
  div.innerHTML = html;
  const groups = [];
  let optIdx = 0;

  const addOptionsFromContainer = (sectionLabel, container) => {
    if (!container) return;
    const options = [];
    container.querySelectorAll('.ps-med-options li').forEach(li => {
      const text = li.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;
      const { tier, label } = psParseTier(text);
      if (rxShouldSkipPsMedLine(tier, label, text)) return;
      options.push(rxPsMedToRxOption(conditionId, {
        id: `${conditionId}-opt-${optIdx++}`,
        tier,
        label: label.length > 240 ? label.slice(0, 237) + '…' : label,
        drugs: typeof psExtractDrugsFromText === 'function'
          ? psExtractDrugsFromText(text).map(id => ({ id }))
          : []
      }));
    });
    if (options.length) {
      groups.push({
        id: rxNormText(sectionLabel).replace(/[^a-z0-9]+/g, '-'),
        label: sectionLabel,
        options
      });
    }
  };

  div.querySelectorAll('.emerg-steps > li').forEach(li => {
    const heading = li.querySelector(':scope > strong');
    if (!heading) return;
    const sectionLabel = heading.textContent.replace(/:\s*$/, '').trim();
    if (li.querySelector('.ps-med-options')) {
      addOptionsFromContainer(sectionLabel, li);
    } else {
      const subItems = [];
      li.querySelectorAll(':scope > ul > li').forEach(subLi => {
        const text = subLi.textContent.replace(/\s+/g, ' ').trim();
        if (!text || !/<strong>/i.test(subLi.innerHTML)) return;
        subItems.push(subLi);
      });
      if (subItems.length) {
        const options = [];
        subItems.forEach(subLi => {
          const text = subLi.textContent.replace(/\s+/g, ' ').trim();
          const { tier, label } = psParseTier(text);
          if (rxShouldSkipPsMedLine(tier, label, text)) return;
          options.push(rxPsMedToRxOption(conditionId, {
            id: `${conditionId}-opt-${optIdx++}`,
            tier,
            label: label.length > 240 ? label.slice(0, 237) + '…' : label,
            drugs: typeof psExtractDrugsFromText === 'function'
              ? psExtractDrugsFromText(text).map(id => ({ id }))
              : []
          }));
        });
        if (options.length) {
          groups.push({
            id: rxNormText(sectionLabel).replace(/[^a-z0-9]+/g, '-'),
            label: sectionLabel,
            options
          });
        }
      }
    }
  });

  div.querySelectorAll(':scope > .ps-med-options, :scope > p + .ps-med-options, :scope > h4 + .ps-med-options').forEach(ul => {
    if (ul.closest('.emerg-steps')) return;
    addOptionsFromContainer('Protocolo resumido', ul);
  });

  if (!groups.length) {
    addOptionsFromContainer('Protocolo', div);
  }

  return groups.length ? rxSortGroups(groups) : null;
}

function rxBuildConditionFromPs (psCondition) {
  if (typeof psGetInteractiveConfig !== 'function') return null;
  const config = psGetInteractiveConfig(psCondition.id);
  if (!config || !config.medications || !config.medications.length) return null;

  const html = typeof PS_CONTENT !== 'undefined' ? PS_CONTENT[psCondition.id] : null;
  const sectionGroups = html ? rxParseGroupedMedsFromHtml(psCondition.id, html) : null;

  if (sectionGroups && sectionGroups.length) {
    const shortName = psCondition.name.split('—')[0].split('(')[0].trim();
    return {
      id: psCondition.id,
      name: shortName,
      icon: psCondition.icon,
      aliases: rxGenerateAliasesFromPs(psCondition),
      source: 'guideline',
      groups: sectionGroups
    };
  }

  const tierGroups = {};
  config.medications.forEach(med => {
    if (rxShouldSkipPsMedLine(med.tier, med.label, med.label)) return;
    const tier = med.tier || 'Protocolo';
    if (!tierGroups[tier]) tierGroups[tier] = [];
    tierGroups[tier].push(rxPsMedToRxOption(psCondition.id, med));
  });

  const tiers = Object.keys(tierGroups);
  if (!tiers.length) return null;

  const shortName = psCondition.name.split('—')[0].split('(')[0].trim();

  return {
    id: psCondition.id,
    name: shortName,
    icon: psCondition.icon,
    aliases: rxGenerateAliasesFromPs(psCondition),
    source: 'guideline',
    groups: rxSortGroups(tiers.map(tier => ({
      id: rxNormText(tier).replace(/[^a-z0-9]+/g, '-'),
      label: tier,
      options: tierGroups[tier]
    })))
  };
}

function rxBuildFullCatalog () {
  const manual = (typeof RX_CATALOG_MANUAL !== 'undefined' ? RX_CATALOG_MANUAL : []).map(c => ({
    ...c,
    source: 'complete'
  }));
  const manualIds = new Set(manual.map(c => c.id));
  const full = [...manual];

  if (typeof PS_CONDITIONS !== 'undefined') {
    PS_CONDITIONS.forEach(ps => {
      if (manualIds.has(ps.id) && RX_MANUAL_PRIORITY_IDS.has(ps.id)) return;
      const built = rxBuildConditionFromPs(ps);
      if (built) full.push(built);
    });

    const covered = new Set(full.map(c => c.id));
    PS_CONDITIONS.forEach(ps => {
      if (covered.has(ps.id)) return;
      const shortName = ps.name.split('—')[0].split('(')[0].trim();
      full.push({
        id: ps.id,
        name: shortName,
        icon: ps.icon,
        aliases: rxGenerateAliasesFromPs(ps),
        source: 'reference',
        groups: [{
          id: 'protocolo',
          label: 'Protocolo PS',
          options: [{
            id: `rxref-${ps.id}`,
            tier: 'Referência',
            label: 'Ver protocolo completo em Prescrições PS',
            classes: [],
            items: [],
            meds: [{
              id: `rxref-${ps.id}-m0`,
              text: 'Consulte o protocolo PS MedHub desta condição e transcreva/adapte a prescrição VO aqui.',
              classes: []
            }],
            orientacoes: 'Esta condição ainda não possui opções VO estruturadas no receituário. Use o módulo Prescrições PS como diretriz.'
          }]
        }]
      });
    });
  }

  full.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  if (typeof medVoExpandCondition === 'function') {
    return full.map(medVoExpandCondition);
  }
  return full;
}

function rxGetCatalog () {
  if (!RX_CATALOG_CACHE) RX_CATALOG_CACHE = rxBuildFullCatalog();
  return RX_CATALOG_CACHE;
}

function rxGetCatalogEntry (conditionId) {
  return rxGetCatalog().find(c => c.id === conditionId) || null;
}
