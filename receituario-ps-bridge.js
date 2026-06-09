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

function rxNormalizeVoText (text) {
  const t = (text || '').trim();
  if (!t) return t;

  if (typeof MED_VO !== 'undefined') {
    if (/dipirona.*500.*vo/i.test(t)) return MED_VO.dipirona500;
    if (/dipirona.*(1\s*g|1000).*vo/i.test(t)) return MED_VO.dipirona1g;
    if (/paracetamol.*500.*vo/i.test(t)) return MED_VO.paracetamol500;
    if (/paracetamol.*750.*vo/i.test(t)) return MED_VO.paracetamol750;
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

  return {
    id: optId,
    tier: psMed.tier || 'Opção',
    label: psMed.label.length > 120 ? psMed.label.slice(0, 117) + '…' : psMed.label,
    classes: rxInferClassesFromPsDrugs(psMed.drugs),
    items: [],
    meds,
    orientacoes: 'Protocolo PS MedHub (diretriz). Revisar via, dose, alergias e contraindicações antes de prescrever.'
  };
}

function rxBuildConditionFromPs (psCondition) {
  if (typeof psGetInteractiveConfig !== 'function') return null;
  const config = psGetInteractiveConfig(psCondition.id);
  if (!config || !config.medications || !config.medications.length) return null;

  const tierGroups = {};
  config.medications.forEach(med => {
    if (/evitar/i.test(med.tier || '')) return;
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
    groups: tiers.map(tier => ({
      id: rxNormText(tier).replace(/[^a-z0-9]+/g, '-'),
      label: tier,
      options: tierGroups[tier]
    }))
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
  return full;
}

function rxGetCatalog () {
  if (!RX_CATALOG_CACHE) RX_CATALOG_CACHE = rxBuildFullCatalog();
  return RX_CATALOG_CACHE;
}

function rxGetCatalogEntry (conditionId) {
  return rxGetCatalog().find(c => c.id === conditionId) || null;
}
