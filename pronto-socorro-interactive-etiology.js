/* PS — protocolos com seleção de etiologia (viral vs bacteriana vs alérgica etc.) */

(function () {
  if (typeof PS_INTERACTIVE === 'undefined') return;

  function psRuleBlockAbUnless (field, allowedValue, label) {
    return {
      check: ({ drugs, context }) => {
        if (context[field] === allowedValue) return null;
        const hasAb = drugs.some(d => (PS_DRUG_META[d.id]?.classes || []).includes('antibiotic'));
        if (!hasAb) return null;
        return {
          severity: 'error',
          text: `Antibiótico não indicado para ${label || 'este subtipo'} — revise o tipo clínico selecionado.`
        };
      }
    };
  }

  function psRuleRequireSelection (field, label) {
    return {
      check: ({ context }) => {
        if (!context[field]) {
          return { severity: 'warning', text: `Selecione: ${label}.` };
        }
        return null;
      }
    };
  }

  const subtypeField = {
    id: 'subtype',
    label: 'Etiologia / indicação clínica',
    type: 'select',
    options: []
  };

  Object.assign(PS_INTERACTIVE, {
    conjuntivite: {
      subtypeLabels: {
        viral: 'conjuntivite viral',
        bacteriana: 'conjuntivite bacteriana',
        alergica: 'conjuntivite alérgica'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Tipo de conjuntivite',
        type: 'select',
        options: [
          { value: 'viral', label: 'Viral (mais comum — aquosa, linfonodo pré-auricular)' },
          { value: 'bacteriana', label: 'Bacteriana (secreção purulenta moderada/grave)' },
          { value: 'alergica', label: 'Alérgica (prurido, história atópica)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'tipo de conjuntivite' }],
      defaultContext: { subtype: 'viral' },
      medications: [
        { id: 'conj-viral-lagrimas', tier: '1ª linha', label: 'Lágrimas artificiais 4–6×/dia + compressas frias + higiene SF 0,9% (sem ATB)', drugs: [{ id: 'lagrimas_artificiais' }] },
        { id: 'conj-viral-analgesia', tier: 'Sintomático', label: 'Dipirona ou paracetamol se desconforto', drugs: [{ id: 'dipirona' }, { id: 'paracetamol' }] },
        { id: 'conj-bact-tobra', tier: '1ª linha', label: 'Tobramicina 0,3% colírio 1 gota 4/4 h · 5–7 dias (Tobrex®)', drugs: [{ id: 'tobramicina' }] },
        { id: 'conj-bact-cipro', tier: 'Alternativa', label: 'Ciprofloxacino 0,3% colírio 1 gota 4/4 h · 5–7 dias', drugs: [{ id: 'ciprofloxacino' }] },
        { id: 'conj-bact-moxi', tier: 'Alternativa', label: 'Moxifloxacino 0,5% colírio 1 gota 8/8 h · 5–7 dias', drugs: [{ id: 'moxifloxacino' }] },
        { id: 'conj-alerg-lora', tier: '1ª linha', label: 'Loratadina 10 mg VO 24/24 h', drugs: [{ id: 'loratadina' }] },
        { id: 'conj-alerg-dexclor', tier: 'Alternativa', label: 'Dexclorfeniramina 2 mg VO 8/8 h', drugs: [{ id: 'dexclorfeniramina' }] },
        { id: 'conj-alerg-olopat', tier: '1ª linha', label: 'Olopatadina 0,1% colírio 1 gota 12/12 h', drugs: [{ id: 'olopatadina' }] }
      ],
      groups: [
        { id: 'viral', label: 'Viral — suporte (sem antibiótico)', when: { subtype: 'viral' }, medications: [
          { id: 'conj-viral-lagrimas', tier: '1ª linha', label: 'Lágrimas artificiais 4–6×/dia + compressas frias + higiene SF 0,9%', drugs: [{ id: 'lagrimas_artificiais' }] },
          { id: 'conj-viral-analgesia', tier: 'Sintomático', label: 'Dipirona ou paracetamol se desconforto', drugs: [{ id: 'dipirona' }] }
        ]},
        { id: 'bacteriana', label: 'Bacteriana — colírio antibiótico', when: { subtype: 'bacteriana' }, medications: [
          { id: 'conj-bact-tobra', tier: '1ª linha', label: 'Tobramicina 0,3% colírio 1 gota 4/4 h · 5–7 dias', drugs: [{ id: 'tobramicina' }] },
          { id: 'conj-bact-cipro', tier: 'Alternativa', label: 'Ciprofloxacino 0,3% colírio 1 gota 4/4 h · 5–7 dias', drugs: [{ id: 'ciprofloxacino' }] },
          { id: 'conj-bact-moxi', tier: 'Alternativa', label: 'Moxifloxacino 0,5% colírio 1 gota 8/8 h · 5–7 dias', drugs: [{ id: 'moxifloxacino' }] }
        ]},
        { id: 'alergica', label: 'Alérgica — anti-H1 ± colírio', when: { subtype: 'alergica' }, medications: [
          { id: 'conj-alerg-lora', tier: '1ª linha', label: 'Loratadina 10 mg VO 24/24 h + olopatadina 0,1% colírio 12/12 h', drugs: [{ id: 'loratadina' }, { id: 'olopatadina' }] },
          { id: 'conj-alerg-dexclor', tier: 'Alternativa', label: 'Dexclorfeniramina 2 mg VO 8/8 h', drugs: [{ id: 'dexclorfeniramina' }] }
        ]}
      ],
      idealFor: {
        viral: [['conj-viral-lagrimas']],
        bacteriana: [['conj-bact-tobra']],
        alergica: [['conj-alerg-lora']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'tipo de conjuntivite'),
        psRuleBlockAbUnless('subtype', 'bacteriana', 'conjuntivite viral ou alérgica')
      ]
    },

    'sinusite-aguda': {
      subtypeLabels: {
        viral: 'sinusite viral/pós-viral',
        bacteriana: 'sinusite bacteriana',
        complicada: 'sinusite com complicação'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Quadro clínico',
        type: 'select',
        options: [
          { value: 'viral', label: 'Viral/pós-viral (< 10 dias, sem piora bífásica) — sem ATB' },
          { value: 'bacteriana', label: 'Bacteriana (> 10 dias, piora após melhora ou grave)' },
          { value: 'complicada', label: 'Complicação (celulite orbitária, abscesso, meningite)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'quadro clínico' }],
      defaultContext: { subtype: 'viral' },
      medications: [
        { id: 'sin-viral-lavagem', tier: '1ª linha', label: 'Lavagem nasal SF 0,9% + analgesia (dipirona/paracetamol)', drugs: [{ id: 'lavagem_nasal' }, { id: 'dipirona' }] },
        { id: 'sin-viral-budesonida', tier: 'Adjuvante', label: 'Budesonida nasal ou oximetazolina ≤ 3 dias (congestão)', drugs: [{ id: 'budesonida' }, { id: 'oximetazolina' }] },
        { id: 'sin-bact-amoxclav', tier: '1ª linha', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5–7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
        { id: 'sin-bact-amox', tier: 'Alternativa', label: 'Amoxicilina 1 g VO 8/8 h · 7 dias (leve, sem comorbidades)', drugs: [{ id: 'amoxicilina' }] },
        { id: 'sin-bact-levo', tier: 'Alérgico', label: 'Levofloxacino 500 mg VO 24/24 h · 5–7 dias', drugs: [{ id: 'levofloxacino' }] },
        { id: 'sin-bact-doxy', tier: 'Alérgico', label: 'Doxiciclina 100 mg VO 12/12 h · 7 dias', drugs: [{ id: 'doxiciclina' }] },
        { id: 'sin-comp-ceftri-vanco', tier: '1ª linha', label: 'Ceftriaxona 2 g EV 12/12 h + vancomicina 15 mg/kg EV 12/12 h', drugs: [{ id: 'ceftriaxona' }, { id: 'vancomicina' }] },
        { id: 'sin-comp-pip-vanco', tier: 'Alternativa', label: 'Piperacilina-tazobactam 4,5 g EV 6/6 h + vancomicina', drugs: [{ id: 'piperacilina_tazobactam' }, { id: 'vancomicina' }] }
      ],
      groups: [
        { id: 'viral', label: 'Viral/pós-viral — suporte (sem antibiótico)', when: { subtype: 'viral' }, medications: [
          { id: 'sin-viral-lavagem', tier: '1ª linha', label: 'Lavagem nasal SF 0,9% + dipirona ou paracetamol + hidratação', drugs: [{ id: 'lavagem_nasal' }, { id: 'dipirona' }] },
          { id: 'sin-viral-budesonida', tier: 'Adjuvante', label: 'Budesonida nasal ou oximetazolina ≤ 3 dias', drugs: [{ id: 'budesonida' }] }
        ]},
        { id: 'bacteriana', label: 'Bacteriana — antibiótico oral', when: { subtype: 'bacteriana' }, medications: [
          { id: 'sin-bact-amoxclav', tier: '1ª linha', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5–7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
          { id: 'sin-bact-amox', tier: 'Alternativa', label: 'Amoxicilina 1 g VO 8/8 h · 7 dias', drugs: [{ id: 'amoxicilina' }] },
          { id: 'sin-bact-levo', tier: 'Alérgico', label: 'Levofloxacino 500 mg VO 24/24 h · 5–7 dias', drugs: [{ id: 'levofloxacino' }] },
          { id: 'sin-bact-doxy', tier: 'Alérgico', label: 'Doxiciclina 100 mg VO 12/12 h · 7 dias', drugs: [{ id: 'doxiciclina' }] }
        ]},
        { id: 'complicada', label: 'Complicada — internação + EV', when: { subtype: 'complicada' }, medications: [
          { id: 'sin-comp-ceftri-vanco', tier: '1ª linha', label: 'Ceftriaxona 2 g EV 12/12 h + vancomicina', drugs: [{ id: 'ceftriaxona' }, { id: 'vancomicina' }] },
          { id: 'sin-comp-pip-vanco', tier: 'Alternativa', label: 'Piperacilina-tazobactam 4,5 g EV 6/6 h + vancomicina', drugs: [{ id: 'piperacilina_tazobactam' }, { id: 'vancomicina' }] }
        ]}
      ],
      idealFor: {
        viral: [['sin-viral-lavagem']],
        bacteriana: [['sin-bact-amoxclav']],
        complicada: [['sin-comp-ceftri-vanco']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'quadro clínico'),
        {
          check: ({ drugs, context }) => {
            if (context.subtype === 'bacteriana' || context.subtype === 'complicada') return null;
            const hasAb = drugs.some(d => (PS_DRUG_META[d.id]?.classes || []).includes('antibiotic'));
            if (!hasAb) return null;
            return {
              severity: 'error',
              text: 'Antibiótico não indicado na sinusite viral/pós-viral (< 10 dias) — revise o quadro clínico.'
            };
          }
        },
        {
          check: ({ drugs, context }) => {
            if (context.subtype !== 'complicada') return null;
            const hasIv = drugs.some(d => ['ceftriaxona', 'vancomicina', 'piperacilina_tazobactam', 'meropenem'].includes(d.id));
            if (!hasIv) {
              return { severity: 'warning', text: 'Complicação orbitária/intracraniana — esquema EV de amplo espectro + internação.' };
            }
            return null;
          }
        }
      ]
    },

    'otite-media': {
      subtypeLabels: {
        observacao: 'observação 48–72 h',
        antibiotico: 'antibioticoterapia',
        grave: 'OMA grave/complicada'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Conduta',
        type: 'select',
        options: [
          { value: 'observacao', label: 'Observação 48–72 h (OMA leve > 2 anos) — analgesia' },
          { value: 'antibiotico', label: 'ATB indicado (< 6 m, bilateral, otorreia, febre ≥ 39 °C, falha observação)' },
          { value: 'grave', label: 'Grave/complicação (mastoidite, abscesso)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'conduta' }],
      medications: [
        { id: 'oma-analgesia-dip', tier: '1ª linha', label: 'Dipirona ou ibuprofeno — analgesia essencial', drugs: [{ id: 'dipirona' }, { id: 'ibuprofeno' }] },
        { id: 'oma-amox', tier: '1ª linha', label: 'Amoxicilina 500 mg VO 8/8 h · 5–7 dias (adulto)', drugs: [{ id: 'amoxicilina' }] },
        { id: 'oma-amoxclav', tier: 'Alternativa', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
        { id: 'oma-cefurox', tier: 'Alérgico', label: 'Cefuroxima 500 mg VO 12/12 h · 7 dias', drugs: [{ id: 'cefuroxima' }] },
        { id: 'oma-azitro', tier: 'Alérgico', label: 'Azitromicina 500 mg VO 24/24 h · 5 dias (anafilaxia a penicilina)', drugs: [{ id: 'azitromicina' }] },
        { id: 'oma-ceftri', tier: '1ª linha', label: 'Ceftriaxona EV + ORL — internação', drugs: [{ id: 'ceftriaxona' }] }
      ],
      groups: [
        { id: 'obs', label: 'Observação — analgesia (sem ATB inicial)', when: { subtype: 'observacao' }, medications: [
          { id: 'oma-analgesia-dip', tier: '1ª linha', label: 'Dipirona ou ibuprofeno 6/6–8/8 h; reavaliar em 48–72 h', drugs: [{ id: 'dipirona' }, { id: 'ibuprofeno' }] }
        ]},
        { id: 'atb', label: 'Antibioticoterapia', when: { subtype: 'antibiotico' }, medications: [
          { id: 'oma-amox', tier: '1ª linha', label: 'Amoxicilina 500 mg VO 8/8 h · 5–7 dias + analgesia', drugs: [{ id: 'amoxicilina' }, { id: 'dipirona' }] },
          { id: 'oma-amoxclav', tier: 'Alternativa', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
          { id: 'oma-cefurox', tier: 'Alérgico', label: 'Cefuroxima 500 mg VO 12/12 h', drugs: [{ id: 'cefuroxima' }] },
          { id: 'oma-azitro', tier: 'Alérgico', label: 'Azitromicina 500 mg VO 24/24 h · 5 dias', drugs: [{ id: 'azitromicina' }] }
        ]},
        { id: 'grave', label: 'Grave — internação', when: { subtype: 'grave' }, medications: [
          { id: 'oma-ceftri', tier: '1ª linha', label: 'Ceftriaxona EV + ORL + analgesia', drugs: [{ id: 'ceftriaxona' }] }
        ]}
      ],
      idealFor: {
        observacao: [['oma-analgesia-dip']],
        antibiotico: [['oma-amox']],
        grave: [['oma-ceftri']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'conduta'),
        {
          check: ({ drugs, context }) => {
            if (context.subtype === 'antibiotico' || context.subtype === 'grave') return null;
            const hasAb = drugs.some(d => (PS_DRUG_META[d.id]?.classes || []).includes('antibiotic'));
            if (!hasAb) return null;
            return {
              severity: 'error',
              text: 'Antibiótico não indicado na observação inicial — use analgesia e reavaliar em 48–72 h.'
            };
          }
        },
        {
          check: ({ drugs, context }) => {
            if (context.subtype !== 'grave') return null;
            if (!drugs.some(d => d.id === 'ceftriaxona')) {
              return { severity: 'warning', text: 'OMA complicada — considerar ceftriaxona EV e internação.' };
            }
            return null;
          }
        }
      ]
    },

    'bronquite-aguda': {
      subtypeLabels: {
        viral: 'bronquite viral',
        broncoespasmo: 'broncoespasmo',
        coqueluche: 'coqueluche suspeita'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Apresentação',
        type: 'select',
        options: [
          { value: 'viral', label: 'Viral (maioria) — analgesia e suporte' },
          { value: 'broncoespasmo', label: 'Broncoespasmo/sibilância associada' },
          { value: 'coqueluche', label: 'Coqueluche suspeita (tosse paroxística)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'apresentação' }],
      medications: [
        { id: 'br-dipirona', tier: '1ª linha', label: 'Dipirona 1 g VO 6/6 h ou paracetamol 750 mg VO 6/6 h', drugs: [{ id: 'dipirona' }, { id: 'paracetamol' }] },
        { id: 'br-salbutamol', tier: '1ª linha', label: 'Salbutamol 2–4 puffs 4/6 h ou nebul 5 mg', drugs: [{ id: 'salbutamol' }] },
        { id: 'br-sal-ipra', tier: 'Alternativa', label: 'Salbutamol + ipratrópio 0,5 mg nebulização', drugs: [{ id: 'salbutamol' }, { id: 'ipratropio' }] },
        { id: 'br-prednisona', tier: 'Adjuvante', label: 'Prednisona 40 mg VO 24/24 h · 5 dias se sibilância persistente', drugs: [{ id: 'prednisona' }] },
        { id: 'br-azitro', tier: '1ª linha', label: 'Azitromicina 500 mg VO 24/24 h · 5 dias (coqueluche)', drugs: [{ id: 'azitromicina' }] },
        { id: 'br-claritro', tier: 'Alternativa', label: 'Claritromicina 500 mg VO 12/12 h · 7 dias', drugs: [{ id: 'claritromicina' }] }
      ],
      groups: [
        { id: 'viral', label: 'Viral — sintomáticos (sem ATB)', when: { subtype: 'viral' }, medications: [
          { id: 'br-dipirona', tier: '1ª linha', label: 'Dipirona ou paracetamol + hidratação', drugs: [{ id: 'dipirona' }] }
        ]},
        { id: 'bronco', label: 'Broncoespasmo', when: { subtype: 'broncoespasmo' }, medications: [
          { id: 'br-salbutamol', tier: '1ª linha', label: 'Salbutamol inalatório/nebulização', drugs: [{ id: 'salbutamol' }] },
          { id: 'br-sal-ipra', tier: 'Alternativa', label: 'Salbutamol + ipratrópio nebulização', drugs: [{ id: 'salbutamol' }, { id: 'ipratropio' }] },
          { id: 'br-prednisona', tier: 'Adjuvante', label: 'Prednisona 40 mg VO · 5 dias se persistente', drugs: [{ id: 'prednisona' }] }
        ]},
        { id: 'coq', label: 'Coqueluche — macrolídeo', when: { subtype: 'coqueluche' }, medications: [
          { id: 'br-azitro', tier: '1ª linha', label: 'Azitromicina 500 mg VO 24/24 h · 5 dias', drugs: [{ id: 'azitromicina' }] },
          { id: 'br-claritro', tier: 'Alternativa', label: 'Claritromicina 500 mg VO 12/12 h · 7 dias', drugs: [{ id: 'claritromicina' }] }
        ]}
      ],
      idealFor: {
        viral: [['br-dipirona']],
        broncoespasmo: [['br-salbutamol']],
        coqueluche: [['br-azitro']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'apresentação'),
        psRuleBlockAbUnless('subtype', 'coqueluche', 'bronquite viral ou broncoespasmo')
      ]
    },

    tosse: {
      subtypeLabels: {
        posviral: 'tosse pós-viral seca',
        bacteriana: 'tosse produtiva bacteriana',
        broncoespasmo: 'broncoespasmo associado'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Tipo de tosse',
        type: 'select',
        options: [
          { value: 'posviral', label: 'Pós-viral seca (< 3 sem) — sem ATB' },
          { value: 'bacteriana', label: 'Produtiva bacteriana (febre, purulência, > 10 dias)' },
          { value: 'broncoespasmo', label: 'Broncoespasmo/asma associada' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'tipo de tosse' }],
      medications: [
        { id: 'tosse-hidratacao', tier: '1ª linha', label: 'Hidratação + mel (adulto); evitar supressores de rotina', drugs: [{ id: 'lagrimas_artificiais' }] },
        { id: 'tosse-ambroxol', tier: 'Adjuvante', label: 'Ambroxol 30 mg VO 8/8 h (expectorante)', drugs: [{ id: 'ambroxol' }] },
        { id: 'tosse-amox', tier: '1ª linha', label: 'Amoxicilina 500 mg VO 8/8 h · 5 dias', drugs: [{ id: 'amoxicilina' }] },
        { id: 'tosse-amoxclav', tier: 'Alternativa', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
        { id: 'tosse-sal-pred', tier: '1ª linha', label: 'Salbutamol 2 jatos 6/6 h + prednisona 40 mg VO · 5 dias', drugs: [{ id: 'salbutamol' }, { id: 'prednisona' }] }
      ],
      groups: [
        { id: 'posviral', label: 'Pós-viral — suporte (sem ATB)', when: { subtype: 'posviral' }, medications: [
          { id: 'tosse-hidratacao', tier: '1ª linha', label: 'Hidratação + mel; evitar ATB e codeína de rotina', drugs: [] },
          { id: 'tosse-ambroxol', tier: 'Adjuvante', label: 'Ambroxol ou acetilcisteína se expectoração espessa', drugs: [{ id: 'ambroxol' }] }
        ]},
        { id: 'bact', label: 'Bacteriana — ATB', when: { subtype: 'bacteriana' }, medications: [
          { id: 'tosse-amox', tier: '1ª linha', label: 'Amoxicilina 500 mg VO 8/8 h · 5 dias', drugs: [{ id: 'amoxicilina' }] },
          { id: 'tosse-amoxclav', tier: 'Alternativa', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] }
        ]},
        { id: 'bronco', label: 'Broncoespasmo', when: { subtype: 'broncoespasmo' }, medications: [
          { id: 'tosse-sal-pred', tier: '1ª linha', label: 'Salbutamol + prednisona 40 mg VO · 5 dias', drugs: [{ id: 'salbutamol' }, { id: 'prednisona' }] }
        ]}
      ],
      idealFor: {
        posviral: [['tosse-hidratacao']],
        bacteriana: [['tosse-amox']],
        broncoespasmo: [['tosse-sal-pred']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'tipo de tosse'),
        psRuleBlockAbUnless('subtype', 'bacteriana', 'tosse pós-viral ou broncoespasmo')
      ]
    },

    'dpoc-exacerbada': {
      subtypeLabels: {
        sem_atb: 'sem indicação de ATB',
        com_atb: 'com indicação de ATB'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Antibiótico (Anthonisen)',
        type: 'select',
        options: [
          { value: 'sem_atb', label: 'Sem ATB (↑ escarro purulento + dispneia — < 2 critérios Anthonisen)' },
          { value: 'com_atb', label: 'Com ATB (≥ 2 critérios Anthonisen ou ventilação mecânica)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'indicação de ATB' }],
      medications: [
        { id: 'dpoc-sal-ipra', tier: '1ª linha', label: 'Salbutamol 4–10 puffs q20 min × 3 + ipratrópio 6/6 h', drugs: [{ id: 'salbutamol' }, { id: 'ipratropio' }] },
        { id: 'dpoc-pred', tier: '1ª linha', label: 'Prednisona 40 mg VO 24/24 h · 5 dias', drugs: [{ id: 'prednisona' }] },
        { id: 'dpoc-amoxclav', tier: '1ª linha', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5–7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
        { id: 'dpoc-levo', tier: 'Alternativa', label: 'Levofloxacino 500 mg VO/EV 24/24 h · 5 dias', drugs: [{ id: 'levofloxacino' }] }
      ],
      groups: [
        { id: 'base', label: 'Base — broncodilatador + corticoide (todos)', medications: [
          { id: 'dpoc-sal-ipra', tier: '1ª linha', label: 'Salbutamol + ipratrópio nebul/inhalador', drugs: [{ id: 'salbutamol' }, { id: 'ipratropio' }] },
          { id: 'dpoc-pred', tier: '1ª linha', label: 'Prednisona 40 mg VO 24/24 h · 5 dias', drugs: [{ id: 'prednisona' }] }
        ]},
        { id: 'atb', label: 'Antibiótico (se indicado)', when: { subtype: 'com_atb' }, medications: [
          { id: 'dpoc-amoxclav', tier: '1ª linha', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5–7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
          { id: 'dpoc-levo', tier: 'Alternativa', label: 'Levofloxacino 500 mg VO/EV 24/24 h · 5 dias', drugs: [{ id: 'levofloxacino' }] }
        ]}
      ],
      idealFor: {
        sem_atb: [['dpoc-sal-ipra', 'dpoc-pred']],
        com_atb: [['dpoc-sal-ipra', 'dpoc-pred', 'dpoc-amoxclav']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'indicação de ATB'),
        psRuleBlockAbUnless('subtype', 'com_atb', 'exacerbação sem critério de ATB'),
        {
          check: ({ selectedMedIds }) => {
            if (!selectedMedIds.includes('dpoc-sal-ipra') && !selectedMedIds.includes('dpoc-pred')) {
              return { severity: 'warning', text: 'Exacerbação DPOC — broncodilatador + corticoide sistêmico são pilares do tratamento.' };
            }
            return null;
          }
        }
      ]
    },

    'diarreia-gastroenterite': {
      subtypeLabels: {
        viral: 'gastroenterite viral/leve',
        invasiva: 'doença invasiva/disenteria'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Quadro',
        type: 'select',
        options: [
          { value: 'viral', label: 'Viral/leve — reidratação (sem ATB)' },
          { value: 'invasiva', label: 'Invasiva/disenteria ou imunossupressão (ATB)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'quadro' }],
      medications: [
        { id: 'dge-sro', tier: '1ª linha', label: 'SRO 50–100 mL/kg nas primeiras 4–6 h + racecadotrilo 100 mg 8/8 h', drugs: [{ id: 'soro_reidratacao' }, { id: 'racecadotrilo' }] },
        { id: 'dge-ondansetrona', tier: 'Adjuvante', label: 'Ondansetrona 4–8 mg EV/IM se vômitos', drugs: [{ id: 'ondansetrona' }] },
        { id: 'dge-cipro', tier: '1ª linha', label: 'Ciprofloxacino 500 mg VO 12/12 h · 3–5 dias', drugs: [{ id: 'ciprofloxacino' }] },
        { id: 'dge-azitro', tier: 'Alternativa', label: 'Azitromicina 500 mg VO 24/24 h · 3 dias (gestante)', drugs: [{ id: 'azitromicina' }] }
      ],
      groups: [
        { id: 'viral', label: 'Viral/leve — reidratação (sem ATB)', when: { subtype: 'viral' }, medications: [
          { id: 'dge-sro', tier: '1ª linha', label: 'SRO + racecadotrilo; evitar loperamida na disenteria', drugs: [{ id: 'soro_reidratacao' }, { id: 'racecadotrilo' }] },
          { id: 'dge-ondansetrona', tier: 'Adjuvante', label: 'Ondansetrona se vômitos impedem SRO', drugs: [{ id: 'ondansetrona' }] }
        ]},
        { id: 'invasiva', label: 'Invasiva — antibiótico', when: { subtype: 'invasiva' }, medications: [
          { id: 'dge-cipro', tier: '1ª linha', label: 'Ciprofloxacino 500 mg VO 12/12 h · 3–5 dias + SRO', drugs: [{ id: 'ciprofloxacino' }, { id: 'soro_reidratacao' }] },
          { id: 'dge-azitro', tier: 'Alternativa', label: 'Azitromicina 500 mg VO 24/24 h · 3 dias', drugs: [{ id: 'azitromicina' }] }
        ]}
      ],
      idealFor: {
        viral: [['dge-sro']],
        invasiva: [['dge-cipro']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'quadro'),
        psRuleBlockAbUnless('subtype', 'invasiva', 'gastroenterite viral/leve')
      ]
    },

    'gripe-influenza': {
      subtypeLabels: {
        leve: 'síndrome gripal leve',
        influenza: 'influenza (< 48 h ou grave)',
        pneumonia: 'pneumonia bacteriana sobreposta'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Apresentação',
        type: 'select',
        options: [
          { value: 'leve', label: 'Resfriado/gripal leve — sintomáticos (sem antiviral)' },
          { value: 'influenza', label: 'Influenza confirmada/suspeita — oseltamivir < 48 h' },
          { value: 'pneumonia', label: 'Pneumonia bacteriana sobreposta / grave' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'apresentação' }],
      medications: [
        { id: 'grip-dipirona', tier: '1ª linha', label: 'Dipirona ou paracetamol + hidratação oral', drugs: [{ id: 'dipirona' }, { id: 'paracetamol' }] },
        { id: 'grip-oselt', tier: '1ª linha', label: 'Oseltamivir 75 mg VO 12/12 h · 5 dias', drugs: [{ id: 'oseltamivir' }] },
        { id: 'grip-ceftri', tier: '1ª linha', label: 'Ceftriaxona 1 g EV 24/24 h (pneumonia bacteriana)', drugs: [{ id: 'ceftriaxona' }] }
      ],
      groups: [
        { id: 'leve', label: 'Leve — sintomáticos', when: { subtype: 'leve' }, medications: [
          { id: 'grip-dipirona', tier: '1ª linha', label: 'Dipirona ou paracetamol + hidratação; repouso', drugs: [{ id: 'dipirona' }] }
        ]},
        { id: 'inf', label: 'Influenza — antiviral', when: { subtype: 'influenza' }, medications: [
          { id: 'grip-oselt', tier: '1ª linha', label: 'Oseltamivir 75 mg VO 12/12 h · 5 dias + sintomáticos', drugs: [{ id: 'oseltamivir' }, { id: 'dipirona' }] }
        ]},
        { id: 'pneu', label: 'Pneumonia sobreposta', when: { subtype: 'pneumonia' }, medications: [
          { id: 'grip-ceftri', tier: '1ª linha', label: 'Ceftriaxona 1 g EV 24/24 h + oseltamivir se influenza', drugs: [{ id: 'ceftriaxona' }, { id: 'oseltamivir' }] }
        ]}
      ],
      idealFor: {
        leve: [['grip-dipirona']],
        influenza: [['grip-oselt']],
        pneumonia: [['grip-ceftri']]
      },
      rules: [psRuleRequireSelection('subtype', 'apresentação')]
    },

    'pneumonia-comunitaria': {
      subtypeLabels: {
        ambulatorial: 'ambulatorial (CURB 0–1)',
        enfermaria: 'internação enfermaria',
        uci: 'grave/UCI'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Gravidade (CURB-65)',
        type: 'select',
        options: [
          { value: 'ambulatorial', label: 'Ambulatorial — CURB 0–1' },
          { value: 'enfermaria', label: 'Internação enfermaria — CURB 2' },
          { value: 'uci', label: 'Grave/UCI — CURB ≥ 3' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'gravidade' }],
      medications: [
        { id: 'pn-amb-amoxclav', tier: '1ª linha', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5–7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
        { id: 'pn-amb-levo', tier: 'Alternativa', label: 'Levofloxacino 750 mg VO 24/24 h · 5 dias', drugs: [{ id: 'levofloxacino' }] },
        { id: 'pn-enf-ceftri-az', tier: '1ª linha', label: 'Ceftriaxona 1 g EV 24/24 h + azitromicina 500 mg 24/24 h', drugs: [{ id: 'ceftriaxona' }, { id: 'azitromicina' }] },
        { id: 'pn-uci-pip-levo', tier: '1ª linha', label: 'Piperacilina-tazobactam 4,5 g EV 6/6 h + levofloxacino 750 mg EV', drugs: [{ id: 'piperacilina_tazobactam' }, { id: 'levofloxacino' }] },
        { id: 'pn-suporte', tier: 'Suporte', label: 'O₂ se SpO₂ < 92% + dipirona/paracetamol', drugs: [{ id: 'dipirona' }, { id: 'oxigenio' }] }
      ],
      groups: [
        { id: 'amb', label: 'Ambulatorial — oral', when: { subtype: 'ambulatorial' }, medications: [
          { id: 'pn-amb-amoxclav', tier: '1ª linha', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 5–7 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
          { id: 'pn-amb-levo', tier: 'Alternativa', label: 'Levofloxacino 750 mg VO 24/24 h · 5 dias', drugs: [{ id: 'levofloxacino' }] },
          { id: 'pn-suporte', tier: 'Suporte', label: 'Analgesia + O₂ se necessário', drugs: [{ id: 'dipirona' }] }
        ]},
        { id: 'enf', label: 'Enfermaria — EV', when: { subtype: 'enfermaria' }, medications: [
          { id: 'pn-enf-ceftri-az', tier: '1ª linha', label: 'Ceftriaxona 1 g EV 24/24 h + azitromicina 500 mg', drugs: [{ id: 'ceftriaxona' }, { id: 'azitromicina' }] }
        ]},
        { id: 'uci', label: 'UCI — amplo espectro', when: { subtype: 'uci' }, medications: [
          { id: 'pn-uci-pip-levo', tier: '1ª linha', label: 'Piperacilina-tazobactam + levofloxacino (+ vancomicina se MRSA)', drugs: [{ id: 'piperacilina_tazobactam' }, { id: 'levofloxacino' }] }
        ]}
      ],
      idealFor: {
        ambulatorial: [['pn-amb-amoxclav']],
        enfermaria: [['pn-enf-ceftri-az']],
        uci: [['pn-uci-pip-levo']]
      },
      rules: [psRuleRequireSelection('subtype', 'gravidade (CURB-65)')]
    },

    mononucleose: {
      subtypeLabels: {
        suporte: 'mononucleose — suporte',
        strep: 'estreptococo concomitante confirmado'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Conduta',
        type: 'select',
        options: [
          { value: 'suporte', label: 'Mononucleose EBV — suporte (sem amoxicilina/ampicilina)' },
          { value: 'strep', label: 'Faringite estreptocócica concomitante confirmada (Strep+)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'conduta' }],
      medications: [
        { id: 'mono-dipirona', tier: '1ª linha', label: 'Dipirona ou paracetamol + hidratação + repouso', drugs: [{ id: 'dipirona' }, { id: 'paracetamol' }] },
        { id: 'mono-azitro', tier: '1ª linha', label: 'Azitromicina 500 mg VO 24/24 h · 5 dias (Strep+ concomitante)', drugs: [{ id: 'azitromicina' }] },
        { id: 'mono-claritro', tier: 'Alternativa', label: 'Claritromicina 500 mg VO 12/12 h · 5 dias', drugs: [{ id: 'claritromicina' }] },
        { id: 'mono-pred', tier: 'Adjuvante', label: 'Prednisona 1 mg/kg VO se estridor/obstrução', drugs: [{ id: 'prednisona' }] }
      ],
      groups: [
        { id: 'sup', label: 'Suporte — sem beta-lactâmico', when: { subtype: 'suporte' }, medications: [
          { id: 'mono-dipirona', tier: '1ª linha', label: 'Dipirona ou paracetamol; evitar amoxicilina/ampicilina (rash)', drugs: [{ id: 'dipirona' }] },
          { id: 'mono-pred', tier: 'Adjuvante', label: 'Prednisona se estridor', drugs: [{ id: 'prednisona' }] }
        ]},
        { id: 'strep', label: 'Strep+ confirmado — macrolídeo', when: { subtype: 'strep' }, medications: [
          { id: 'mono-azitro', tier: '1ª linha', label: 'Azitromicina 500 mg VO 24/24 h · 5 dias', drugs: [{ id: 'azitromicina' }] },
          { id: 'mono-claritro', tier: 'Alternativa', label: 'Claritromicina 500 mg VO 12/12 h · 5 dias', drugs: [{ id: 'claritromicina' }] }
        ]}
      ],
      idealFor: {
        suporte: [['mono-dipirona']],
        strep: [['mono-azitro']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'conduta'),
        {
          check: ({ drugs }) => {
            const pen = drugs.filter(d => ['amoxicilina', 'ampicilina', 'amoxicilina_clavulanato'].includes(d.id));
            if (pen.length) {
              return { severity: 'error', text: 'Amoxicilina/ampicilina contraindicadas na mononucleose (rash maculopapular > 90%).' };
            }
            return null;
          }
        }
      ]
    },

    'otite-externa': {
      subtypeLabels: {
        topico: 'otite externa não complicada',
        celulite: 'celulite periauricular',
        maligna: 'otite externa maligna'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Gravidade',
        type: 'select',
        options: [
          { value: 'topico', label: 'Não complicada — gotas otológicas tópicas' },
          { value: 'celulite', label: 'Celulite periauricular / imunossupressão — ATB sistêmico' },
          { value: 'maligna', label: 'Otite externa maligna (diabético/idoso) — internação' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'gravidade' }],
      medications: [
        { id: 'oe-top-cipro-dex', tier: '1ª linha', label: 'Ciprofloxacino 0,3% + dexametasona gotas otológicas 3–4 gotas 12/12 h · 7–10 dias', drugs: [{ id: 'ciprofloxacino' }, { id: 'dexametasona' }] },
        { id: 'oe-top-cipro', tier: 'Alternativa', label: 'Ciprofloxacino 0,3% gotas 4 gotas 8/8 h · 7–10 dias', drugs: [{ id: 'ciprofloxacino' }] },
        { id: 'oe-top-neo', tier: 'Alérgico', label: 'Neomicina-polimixina-hidrocortisona gotas (cautela se perfuração timpânica)', drugs: [{ id: 'neomicina_polimixina' }] },
        { id: 'oe-analgesia', tier: 'Sintomático', label: 'Dipirona ± tramadol se otalgia intensa', drugs: [{ id: 'dipirona' }, { id: 'tramadol' }] },
        { id: 'oe-sist-cipro', tier: '1ª linha', label: 'Ciprofloxacino 500 mg VO 12/12 h · 7–10 dias', drugs: [{ id: 'ciprofloxacino' }] },
        { id: 'oe-sist-amoxclav', tier: 'Alternativa', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h · 7–10 dias', drugs: [{ id: 'amoxicilina_clavulanato' }] },
        { id: 'oe-mal-cipro-ev', tier: '1ª linha', label: 'Ciprofloxacino EV + ORL — internação', drugs: [{ id: 'ciprofloxacino' }] }
      ],
      groups: [
        { id: 'top', label: 'Não complicada — tópico + analgesia', when: { subtype: 'topico' }, medications: [
          { id: 'oe-top-cipro-dex', tier: '1ª linha', label: 'Ciprofloxacino + dexametasona gotas otológicas 12/12 h · 7–10 dias', drugs: [{ id: 'ciprofloxacino' }, { id: 'dexametasona' }] },
          { id: 'oe-top-cipro', tier: 'Alternativa', label: 'Ciprofloxacino 0,3% gotas 8/8 h · 7–10 dias', drugs: [{ id: 'ciprofloxacino' }] },
          { id: 'oe-top-neo', tier: 'Alérgico', label: 'Neomicina-polimixina-hidrocortisona gotas', drugs: [{ id: 'neomicina_polimixina' }] },
          { id: 'oe-analgesia', tier: 'Sintomático', label: 'Dipirona; manter ouvido seco', drugs: [{ id: 'dipirona' }] }
        ]},
        { id: 'cel', label: 'Celulite — ATB sistêmico', when: { subtype: 'celulite' }, medications: [
          { id: 'oe-sist-cipro', tier: '1ª linha', label: 'Ciprofloxacino 500 mg VO 12/12 h · 7–10 dias', drugs: [{ id: 'ciprofloxacino' }] },
          { id: 'oe-sist-amoxclav', tier: 'Alternativa', label: 'Amoxicilina-clavulanato 875/125 mg VO 12/12 h', drugs: [{ id: 'amoxicilina_clavulanato' }] },
          { id: 'oe-analgesia', tier: 'Sintomático', label: 'Analgesia + gotas tópicas adjuvantes se CAE acessível', drugs: [{ id: 'dipirona' }] }
        ]},
        { id: 'mal', label: 'Maligna — internação', when: { subtype: 'maligna' }, medications: [
          { id: 'oe-mal-cipro-ev', tier: '1ª linha', label: 'Ciprofloxacino EV + avaliação ORL; TC osso temporal', drugs: [{ id: 'ciprofloxacino' }] }
        ]}
      ],
      idealFor: {
        topico: [['oe-top-cipro-dex']],
        celulite: [['oe-sist-cipro']],
        maligna: [['oe-mal-cipro-ev']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'gravidade'),
        {
          check: ({ drugs, context }) => {
            if (context.subtype !== 'topico') return null;
            const systemic = drugs.filter(d => ['amoxicilina', 'amoxicilina_clavulanato', 'ceftriaxona'].includes(d.id));
            if (systemic.length) {
              return { severity: 'warning', text: 'Otite externa não complicada — preferir gotas otológicas tópicas; ATB sistêmico se celulite periauricular.' };
            }
            return null;
          }
        }
      ]
    },

    candidiase: {
      subtypeLabels: {
        oral: 'candidíase oral',
        vaginal: 'candidíase vaginal',
        balanite: 'balanite por Candida',
        esofagica: 'candidíase esofágica/imunossuprimido'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Local / forma',
        type: 'select',
        options: [
          { value: 'oral', label: 'Oral leve (sapinho)' },
          { value: 'vaginal', label: 'Vaginal não complicada' },
          { value: 'balanite', label: 'Balanite candidíase' },
          { value: 'esofagica', label: 'Esofágica / imunossuprimido grave' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'forma clínica' }],
      medications: [
        { id: 'cand-oral-nista', tier: '1ª linha', label: 'Nistatina suspensão 100.000 UI/mL gargarejo 4×/dia · 7–14 dias', drugs: [{ id: 'nistatina' }] },
        { id: 'cand-oral-mico', tier: 'Alternativa', label: 'Miconazol gel oral 2×/dia · 7–14 dias', drugs: [{ id: 'miconazol' }] },
        { id: 'cand-oral-fluco', tier: 'Refractário', label: 'Fluconazol 100–200 mg VO 24/24 h · 7–14 dias', drugs: [{ id: 'fluconazol' }] },
        { id: 'cand-vag-fluco', tier: '1ª linha', label: 'Fluconazol 150 mg VO dose única', drugs: [{ id: 'fluconazol' }] },
        { id: 'cand-vag-mico', tier: 'Alternativa', label: 'Miconazol creme vaginal 2% · 7 noites', drugs: [{ id: 'miconazol' }] },
        { id: 'cand-bal-clotri', tier: '1ª linha', label: 'Clotrimazol creme 1% 2×/dia · 7–14 dias', drugs: [{ id: 'clotrimazol' }] },
        { id: 'cand-bal-fluco', tier: 'Alternativa', label: 'Fluconazol 150 mg VO dose única (adjuvante)', drugs: [{ id: 'fluconazol' }] },
        { id: 'cand-eso-fluco', tier: '1ª linha', label: 'Fluconazol 200 mg VO 24/24 h · 14–21 dias', drugs: [{ id: 'fluconazol' }] },
        { id: 'cand-eso-anfo', tier: 'Refractário', label: 'Anfotericina B EV (esofágica grave)', drugs: [{ id: 'anfotericina_b' }] }
      ],
      groups: [
        { id: 'oral', label: 'Oral leve', when: { subtype: 'oral' }, medications: [
          { id: 'cand-oral-nista', tier: '1ª linha', label: 'Nistatina suspensão gargarejo 4×/dia · 7–14 dias', drugs: [{ id: 'nistatina' }] },
          { id: 'cand-oral-mico', tier: 'Alternativa', label: 'Miconazol gel oral 2×/dia', drugs: [{ id: 'miconazol' }] },
          { id: 'cand-oral-fluco', tier: 'Refractário', label: 'Fluconazol 100–200 mg/dia se refratária/imunossuprimido', drugs: [{ id: 'fluconazol' }] }
        ]},
        { id: 'vag', label: 'Vaginal não complicada', when: { subtype: 'vaginal' }, medications: [
          { id: 'cand-vag-fluco', tier: '1ª linha', label: 'Fluconazol 150 mg VO dose única', drugs: [{ id: 'fluconazol' }] },
          { id: 'cand-vag-mico', tier: 'Alternativa', label: 'Miconazol creme vaginal 2% · 7 noites', drugs: [{ id: 'miconazol' }] }
        ]},
        { id: 'bal', label: 'Balanite', when: { subtype: 'balanite' }, medications: [
          { id: 'cand-bal-clotri', tier: '1ª linha', label: 'Clotrimazol creme 1% 2×/dia · 7–14 dias', drugs: [{ id: 'clotrimazol' }] },
          { id: 'cand-bal-fluco', tier: 'Alternativa', label: 'Fluconazol 150 mg VO dose única', drugs: [{ id: 'fluconazol' }] }
        ]},
        { id: 'eso', label: 'Esofágica / imunossuprimido', when: { subtype: 'esofagica' }, medications: [
          { id: 'cand-eso-fluco', tier: '1ª linha', label: 'Fluconazol 200 mg VO 24/24 h · 14–21 dias', drugs: [{ id: 'fluconazol' }] },
          { id: 'cand-eso-anfo', tier: 'Refractário', label: 'Anfotericina B EV se grave/refratária', drugs: [{ id: 'anfotericina_b' }] }
        ]}
      ],
      idealFor: {
        oral: [['cand-oral-nista']],
        vaginal: [['cand-vag-fluco']],
        balanite: [['cand-bal-clotri']],
        esofagica: [['cand-eso-fluco']]
      },
      rules: [psRuleRequireSelection('subtype', 'forma clínica')]
    },

    vulvovaginites: {
      subtypeLabels: {
        vb: 'vaginose bacteriana',
        candida: 'candidíase vaginal',
        tricomonas: 'tricomoníase'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Diagnóstico provável',
        type: 'select',
        options: [
          { value: 'vb', label: 'Vaginose bacteriana (corrimento cinza, odor, pH > 4,5, Whiff+)' },
          { value: 'candida', label: 'Candidíase (prurido, grumos brancos, pH < 4,5)' },
          { value: 'tricomonas', label: 'Tricomoníase (espumoso, colo framboesa)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'diagnóstico' }],
      medications: [
        { id: 'vv-vb-metro', tier: '1ª linha', label: 'Metronidazol 500 mg VO 12/12 h · 7 dias', drugs: [{ id: 'metronidazol' }] },
        { id: 'vv-vb-secni', tier: 'Alternativa', label: 'Secnidazol 2 g VO dose única', drugs: [{ id: 'secnidazol' }] },
        { id: 'vv-vb-clinda', tier: 'Alérgico', label: 'Clindamicina 300 mg VO 12/12 h · 7 dias', drugs: [{ id: 'clindamicina' }] },
        { id: 'vv-cand-fluco', tier: '1ª linha', label: 'Fluconazol 150 mg VO dose única', drugs: [{ id: 'fluconazol' }] },
        { id: 'vv-cand-mico', tier: 'Alternativa', label: 'Miconazol creme vaginal 2% · 7 noites', drugs: [{ id: 'miconazol' }] },
        { id: 'vv-cand-nista', tier: 'Alérgico', label: 'Nistatina óvulo vaginal 100.000 UI 24/24 h · 14 dias', drugs: [{ id: 'nistatina' }] },
        { id: 'vv-tri-metro-du', tier: '1ª linha', label: 'Metronidazol 2 g VO dose única + tratar parceiro', drugs: [{ id: 'metronidazol' }] },
        { id: 'vv-tri-secni', tier: 'Alternativa', label: 'Secnidazol 2 g VO dose única + tratar parceiro', drugs: [{ id: 'secnidazol' }] },
        { id: 'vv-gest-clotri', tier: '1ª linha', label: 'Gestante — candida: clotrimazol creme vaginal 2% · 7 noites', drugs: [{ id: 'clotrimazol' }] }
      ],
      groups: [
        { id: 'vb', label: 'Vaginose bacteriana', when: { subtype: 'vb' }, medications: [
          { id: 'vv-vb-metro', tier: '1ª linha', label: 'Metronidazol 500 mg VO 12/12 h · 7 dias', drugs: [{ id: 'metronidazol' }] },
          { id: 'vv-vb-secni', tier: 'Alternativa', label: 'Secnidazol 2 g VO dose única', drugs: [{ id: 'secnidazol' }] },
          { id: 'vv-vb-clinda', tier: 'Alérgico', label: 'Clindamicina 300 mg VO 12/12 h · 7 dias', drugs: [{ id: 'clindamicina' }] }
        ]},
        { id: 'cand', label: 'Candidíase vaginal', when: { subtype: 'candida' }, medications: [
          { id: 'vv-cand-fluco', tier: '1ª linha', label: 'Fluconazol 150 mg VO dose única', drugs: [{ id: 'fluconazol' }] },
          { id: 'vv-cand-mico', tier: 'Alternativa', label: 'Miconazol creme vaginal 2% · 7 noites', drugs: [{ id: 'miconazol' }] },
          { id: 'vv-cand-nista', tier: 'Alérgico', label: 'Nistatina óvulo vaginal · 14 dias', drugs: [{ id: 'nistatina' }] }
        ]},
        { id: 'tri', label: 'Tricomoníase', when: { subtype: 'tricomonas' }, medications: [
          { id: 'vv-tri-metro-du', tier: '1ª linha', label: 'Metronidazol 2 g VO dose única + tratar parceiro', drugs: [{ id: 'metronidazol' }] },
          { id: 'vv-tri-secni', tier: 'Alternativa', label: 'Secnidazol 2 g VO dose única + tratar parceiro', drugs: [{ id: 'secnidazol' }] }
        ]}
      ],
      idealFor: {
        vb: [['vv-vb-metro']],
        candida: [['vv-cand-fluco']],
        tricomonas: [['vv-tri-metro-du']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'diagnóstico'),
        {
          check: ({ drugs, context, selectedMedIds, config }) => {
            if (!context.subtype) return null;
            const ids = drugs.map(d => d.id);
            if (context.subtype === 'candida' && ids.includes('metronidazol') && !ids.includes('fluconazol') && !ids.includes('miconazol') && !ids.includes('nistatina')) {
              return { severity: 'error', text: 'Candidíase — metronidazol isolado não trata Candida; use fluconazol ou azol tópico.' };
            }
            if (context.subtype === 'vb' && ids.includes('fluconazol') && !ids.includes('metronidazol') && !ids.includes('secnidazol') && !ids.includes('clindamicina')) {
              return { severity: 'error', text: 'Vaginose bacteriana — fluconazol isolado não trata VB; use metronidazol ou secnidazol.' };
            }
            if (context.subtype === 'tricomonas' && selectedMedIds.includes('vv-cand-fluco')) {
              return { severity: 'error', text: 'Tricomoníase — fluconazol não trata Trichomonas; use metronidazol ou secnidazol.' };
            }
            return null;
          }
        },
        {
          check: ({ context }) => {
            if (context.gestante && context.subtype === 'candida') {
              return { severity: 'warning', text: 'Gestante com candidíase — preferir clotrimazol/miconazol tópico; evitar fluconazol oral.' };
            }
            return null;
          }
        }
      ]
    },

    'parasitoses-intestinais': {
      subtypeLabels: {
        giardiase: 'giardíase',
        amebiase: 'amebíase intestinal',
        oxiurose: 'oxiurose',
        helmintos: 'ascaridíase/ancilostomíase'
      },
      contextFields: [{
        id: 'subtype',
        label: 'Agente / parasitose',
        type: 'select',
        options: [
          { value: 'giardiase', label: 'Giardíase (Giardia)' },
          { value: 'amebiase', label: 'Amebíase intestinal (Entamoeba)' },
          { value: 'oxiurose', label: 'Oxiurose (Enterobius)' },
          { value: 'helmintos', label: 'Ascaridíase / ancilostomíase (helmintos)' }
        ]
      }],
      requiredContext: [{ id: 'subtype', label: 'agente' }],
      medications: [
        { id: 'par-giard-metro', tier: '1ª linha', label: 'Metronidazol 250 mg VO 8/8 h · 5 dias', drugs: [{ id: 'metronidazol' }] },
        { id: 'par-giard-tini', tier: 'Alternativa', label: 'Tinidazol 2 g VO dose única', drugs: [{ id: 'tinidazol' }] },
        { id: 'par-ameb-metro', tier: '1ª linha', label: 'Metronidazol 750 mg VO 8/8 h · 7–10 dias (forma tecidual)', drugs: [{ id: 'metronidazol' }] },
        { id: 'par-oxi-alben', tier: '1ª linha', label: 'Albendazol 400 mg VO dose única; repetir em 14 dias', drugs: [{ id: 'albendazol' }] },
        { id: 'par-helm-alben', tier: '1ª linha', label: 'Albendazol 400 mg VO dose única', drugs: [{ id: 'albendazol' }] },
        { id: 'par-helm-mebend', tier: 'Alternativa', label: 'Mebendazol 100 mg VO 12/12 h · 3 dias', drugs: [{ id: 'mebendazol' }] },
        { id: 'par-sro', tier: 'Suporte', label: 'SRO se desidratação; internar se disenteria grave', drugs: [{ id: 'soro_reidratacao' }] }
      ],
      groups: [
        { id: 'giard', label: 'Giardíase', when: { subtype: 'giardiase' }, medications: [
          { id: 'par-giard-metro', tier: '1ª linha', label: 'Metronidazol 250 mg VO 8/8 h · 5 dias', drugs: [{ id: 'metronidazol' }] },
          { id: 'par-giard-tini', tier: 'Alternativa', label: 'Tinidazol 2 g VO dose única', drugs: [{ id: 'tinidazol' }] },
          { id: 'par-sro', tier: 'Suporte', label: 'SRO + higiene das mãos', drugs: [{ id: 'soro_reidratacao' }] }
        ]},
        { id: 'ameb', label: 'Amebíase intestinal', when: { subtype: 'amebiase' }, medications: [
          { id: 'par-ameb-metro', tier: '1ª linha', label: 'Metronidazol 750 mg VO 8/8 h · 7–10 dias', drugs: [{ id: 'metronidazol' }] },
          { id: 'par-sro', tier: 'Suporte', label: 'SRO; internar se abscesso hepático/disenteria grave', drugs: [{ id: 'soro_reidratacao' }] }
        ]},
        { id: 'oxi', label: 'Oxiurose', when: { subtype: 'oxiurose' }, medications: [
          { id: 'par-oxi-alben', tier: '1ª linha', label: 'Albendazol 400 mg dose única; repetir em 14 dias + tratar contactantes', drugs: [{ id: 'albendazol' }] }
        ]},
        { id: 'helm', label: 'Ascaridíase / ancilostomíase', when: { subtype: 'helmintos' }, medications: [
          { id: 'par-helm-alben', tier: '1ª linha', label: 'Albendazol 400 mg VO dose única', drugs: [{ id: 'albendazol' }] },
          { id: 'par-helm-mebend', tier: 'Alternativa', label: 'Mebendazol 100 mg VO 12/12 h · 3 dias', drugs: [{ id: 'mebendazol' }] }
        ]}
      ],
      idealFor: {
        giardiase: [['par-giard-metro']],
        amebiase: [['par-ameb-metro']],
        oxiurose: [['par-oxi-alben']],
        helmintos: [['par-helm-alben']]
      },
      rules: [
        psRuleRequireSelection('subtype', 'agente'),
        {
          check: ({ drugs, context }) => {
            if (!context.subtype) return null;
            const ids = drugs.map(d => d.id);
            if (context.subtype === 'oxiurose' && ids.includes('metronidazol') && !ids.includes('albendazol')) {
              return { severity: 'error', text: 'Oxiurose — tratamento de escolha é albendazol (ou mebendazol), não metronidazol.' };
            }
            if (context.subtype === 'helmintos' && ids.includes('metronidazol') && !ids.includes('albendazol') && !ids.includes('mebendazol')) {
              return { severity: 'error', text: 'Helmintos — use albendazol ou mebendazol, não metronidazol.' };
            }
            if (context.subtype === 'giardiase' && (ids.includes('albendazol') || ids.includes('mebendazol')) && !ids.includes('metronidazol') && !ids.includes('tinidazol')) {
              return { severity: 'warning', text: 'Giardíase — preferir metronidazol ou tinidazol (anti-helmintos não tratam Giardia).' };
            }
            return null;
          }
        }
      ]
    }
  });
})();
