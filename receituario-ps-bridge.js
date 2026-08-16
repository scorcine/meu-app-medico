/* Receituário — catálogo completo a partir dos protocolos PS + modelos manuais */

/* Condições com receita de alta curada: a dose de casa nunca vem do protocolo hospitalar */
const RX_MANUAL_PRIORITY_IDS = new Set([
  'cefaleias',
  'amigdalite-bacteriana',
  'cistite-itu-baixa',
  'lombalgia-ciatalgia',
  'violencia-sexual-pep',
  'gonorreia-clamidia',
  'asma-broncoespasmo',
  'dpoc-exacerbada',
  'sinusite-aguda',
  'otite-media',
  'otite-externa',
  'bronquite-aguda',
  'gripe-influenza',
  'rinite-alergica',
  'impetigo',
  'celulite',
  'erisipela',
  'abscesso-cutaneo',
  'furunculose',
  'micoses-superficiais',
  'tinea',
  'frieira',
  'escabiose',
  'pediculose',
  'conjuntivite',
  'hordeolo',
  'herpes-zoster',
  'candidiase',
  'vulvovaginites',
  'balanopostite',
  'diarreia-gastroenterite',
  'vomitos-agudos',
  'constipacao',
  'dispepsia-drge',
  'hemorroidas',
  'gota',
  'colica-renal',
  'afta-estomatite',
  'queilite',
  'parasitoses-intestinais',
  'fissura-anal',
  'artralgia-dor-msk',
  'tosse',
  'anemia-ferropriva',
  'flebite',
  'varizes-mmi',
  'ulcera-varicosa',
  'ulceras-genitais',
  'soluco-persistente',
  'mononucleose',
  'diverticulite',
  'pneumonia-comunitaria',
  'pielonefrite',
  'tvp',
  'dengue',
  'chikungunya',
  'edema-mmi',
  'sindrome-vestibular',
  'ansiedade-crise',
  'desconforto-abdominal',
  'alergia-anafilaxia',
  'edema-angioneurotico',
  'queimaduras',
  'antiparasitarios',
  'ascaridiase',
  'anemia-falciforme',
  'tuberculose',
  'ameaca-aborto',
  'corpo-estranho-ocular',
  'epistaxe',
  'hipoglicemia-grave',
  'insolacao',
  'profilaxia-antirrabica',
  'sangramento-uterino',
  'sincope'
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
    if (/ceftriaxona|cefotaxima|espectinomicina|gentamicina/.test(t)) {
      return t + ' — aplicar no serviço (IM/EV); não há apresentação VO equivalente';
    }
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
    orientacoes: ''
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

function rxBuildGroupsFromEtiologyConfig (psCondition, config) {
  const sorted = typeof psSortByEtiologyOrder === 'function'
    ? psSortByEtiologyOrder(psCondition.id, config.groups)
    : config.groups.slice();
  return sorted.map((g, rank) => {
    const options = (g.medications || [])
      .filter(m => !rxShouldSkipPsMedLine(m.tier, m.label, m.label))
      .map(m => rxPsMedToRxOption(psCondition.id, m));
    if (!options.length) return null;
    const label = typeof psFormatEtiologyGroupLegend === 'function'
      ? psFormatEtiologyGroupLegend(g, rank)
      : g.label;
    return {
      id: g.id,
      label,
      options
    };
  }).filter(Boolean);
}

function rxBuildConditionFromPs (psCondition) {
  if (typeof psGetInteractiveConfig !== 'function') return null;
  const config = psGetInteractiveConfig(psCondition.id);
  if (!config || !config.medications || !config.medications.length) return null;

  const shortName = psCondition.name.split('—')[0].split('(')[0].trim();

  if (typeof psHasEtiologyConfig === 'function' && psHasEtiologyConfig(config)) {
    const groups = rxBuildGroupsFromEtiologyConfig(psCondition, config);
    if (!groups.length) return null;
    return {
      id: psCondition.id,
      name: shortName,
      icon: psCondition.icon,
      aliases: rxGenerateAliasesFromPs(psCondition),
      source: 'guideline',
      hasEtiology: true,
      etiologyHint: config.etiologyHint || 'Identifique a etiologia abaixo. As seções estão ordenadas da mais comum à menos comum — escolha apenas a que corresponde ao quadro.',
      groups
    };
  }

  const html = typeof PS_CONTENT !== 'undefined' ? PS_CONTENT[psCondition.id] : null;
  const sectionGroups = html ? rxParseGroupedMedsFromHtml(psCondition.id, html) : null;

  if (sectionGroups && sectionGroups.length) {
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

function rxHomeRxMode (conditionId) {
  if (typeof clinicalPathwayGet === 'function') {
    return clinicalPathwayGet(conditionId).homeRx || 'none';
  }
  return RX_MANUAL_PRIORITY_IDS.has(conditionId) ? 'curated' : 'blocked';
}

function rxBuildReferenceCondition (ps) {
  const shortName = ps.name.split('—')[0].split('(')[0].trim();
  const mode = rxHomeRxMode(ps.id);
  const text = mode === 'none'
    ? 'Esta condição não gera receita automática para casa. Documente orientações no resumo e finalize o atendimento.'
    : 'Receita de alta ainda não curada para esta condição. Não copie doses EV/IM/nebulização/bolus do protocolo hospitalar — adapte VO manualmente ou finalize sem receita.';
  return {
    id: ps.id,
    name: shortName,
    icon: ps.icon,
    aliases: rxGenerateAliasesFromPs(ps),
    source: 'reference',
    homeRxMode: mode,
    groups: [{
      id: 'protocolo',
      label: 'Tratamento para casa',
      options: [{
        id: `rxref-${ps.id}`,
        tier: 'Referência',
        label: mode === 'none'
          ? 'Sem receita domiciliar automática'
          : 'Modelo ambulatorial pendente — não copiar dose hospitalar',
        classes: [],
        items: [],
        noVoExpand: true,
        meds: [{
          id: `rxref-${ps.id}-m0`,
          text,
          classes: []
        }],
        orientacoes: 'Barreira de segurança: o protocolo de PS permanece na unidade. Receita de casa só entra quando houver modelo curado.'
      }]
    }]
  };
}

function rxBuildFullCatalog () {
  const manual = (typeof RX_CATALOG_MANUAL !== 'undefined' ? RX_CATALOG_MANUAL : []).map(c => ({
    ...c,
    source: 'complete',
    homeRxMode: 'curated'
  }));
  const manualIds = new Set(manual.map(c => c.id));
  const full = [...manual];

  if (typeof PS_CONDITIONS !== 'undefined') {
    PS_CONDITIONS.forEach(ps => {
      /* Receita curada tem prioridade absoluta sobre qualquer extração do PS */
      if (manualIds.has(ps.id) && RX_MANUAL_PRIORITY_IDS.has(ps.id)) return;

      const mode = rxHomeRxMode(ps.id);
      /* Rigor: nunca transformar conduta hospitalar em receita de casa */
      if (mode !== 'curated') {
        full.push(rxBuildReferenceCondition(ps));
        return;
      }

      const built = rxBuildConditionFromPs(ps);
      if (built) {
        built.homeRxMode = 'curated';
        full.push(built);
      } else {
        full.push(rxBuildReferenceCondition(ps));
      }
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
