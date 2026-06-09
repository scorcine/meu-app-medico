/* Prescrições PS — dados interativos por condição */

const PS_INTERACTIVE = {
  'cefaleias': {
    subtypeLabels: {
      tensional: 'cefaleia tensional',
      enxaqueca: 'enxaqueca',
      salvas: 'cefaleia em salvas'
    },
    contextFields: [
      {
        id: 'subtype',
        label: 'Subtipo de cefaleia',
        type: 'select',
        options: [
          { value: 'tensional', label: 'Tensional' },
          { value: 'enxaqueca', label: 'Enxaqueca moderada-grave' },
          { value: 'salvas', label: 'Cefaleia em salvas' }
        ]
      },
      {
        id: 'snoop4',
        label: 'Sinais de alarme (SNOOP4)?',
        type: 'select',
        options: [
          { value: 'nao', label: 'Não' },
          { value: 'sim', label: 'Sim — investigar causa secundária' }
        ]
      },
      { id: 'contraindicacao_triptano', label: 'Contraindicação a triptano (DAC, AVC, PA não controlada)', type: 'checkbox' },
      { id: 'gestante', label: 'Gestante', type: 'checkbox' },
      { id: 'drc', label: 'Doença renal crônica', type: 'checkbox' },
      { id: 'alergia_aine', label: 'Alergia a AINE', type: 'checkbox' }
    ],
    requiredContext: [{ id: 'subtype', label: 'subtipo de cefaleia' }],
    medications: [
      { id: 'cef-dipirona', tier: '1ª linha', label: 'Dipirona 1 g IV/VO 6/6 h', drugs: [{ id: 'dipirona' }] },
      { id: 'cef-paracetamol', tier: '1ª linha', label: 'Paracetamol 750 mg–1 g VO 6/6 h', drugs: [{ id: 'paracetamol' }] },
      { id: 'cef-naproxeno', tier: 'Alternativa', label: 'Naproxeno 500 mg VO 12/12 h', drugs: [{ id: 'naproxeno' }] },
      { id: 'cef-ibuprofeno', tier: 'Alternativa', label: 'Ibuprofeno 400 mg VO 8/8 h', drugs: [{ id: 'ibuprofeno' }] },
      { id: 'cef-ciclobenzaprina', tier: 'Alternativa', label: 'Ciclobenzaprina 5–10 mg VO (componente cervical)', drugs: [{ id: 'ciclobenzaprina' }] },
      {
        id: 'cef-sumatriptano-esquema',
        tier: '1ª linha',
        label: 'Sumatriptano 50–100 mg VO ou 6 mg SC + metoclopramida 10 mg IV + dipirona 1 g',
        detail: 'Enxaqueca — esquema combinado',
        drugs: [{ id: 'sumatriptano' }, { id: 'metoclopramida' }, { id: 'dipirona' }]
      },
      { id: 'cef-zolmitriptano', tier: 'Alternativa', label: 'Zolmitriptano 2,5–5 mg VO ou 5 mg nasal', drugs: [{ id: 'zolmitriptano' }] },
      {
        id: 'cef-metoclopramida-dipirona',
        tier: 'Refractário',
        label: 'Metoclopramida 10 mg IV + dipirona 1 g IV + hidratação SF',
        drugs: [{ id: 'metoclopramida' }, { id: 'dipirona' }]
      },
      { id: 'cef-dexametasona', tier: 'Refractário', label: 'Dexametasona 10 mg IV (prevenir recorrência 48 h)', drugs: [{ id: 'dexametasona' }] },
      { id: 'cef-tramadol', tier: 'Refractário', label: 'Tramadol 50 mg VO 6/6 h', drugs: [{ id: 'tramadol' }] },
      { id: 'cef-oxigenio', tier: '1ª linha', label: 'O₂ 100% 12–15 L/min × 15–20 min (salvas)', drugs: [{ id: 'oxigenio' }] },
      { id: 'cef-sumatriptano-sc', tier: 'Alternativa', label: 'Sumatriptano 6 mg SC (salvas ou enxaqueca)', drugs: [{ id: 'sumatriptano' }] },
      { id: 'cef-verapamil', tier: 'Profilaxia', label: 'Verapamil 80 mg VO 8/8 h (profilaxia salvas — ambulatorial)', drugs: [{ id: 'verapamil' }] }
    ],
    idealFor: {
      tensional: [['cef-dipirona'], ['cef-paracetamol']],
      enxaqueca: [['cef-sumatriptano-esquema'], ['cef-metoclopramida-dipirona']],
      salvas: [['cef-oxigenio'], ['cef-sumatriptano-sc']]
    },
    acceptableFor: {
      tensional: [['cef-naproxeno'], ['cef-ibuprofeno'], ['cef-dipirona', 'cef-ciclobenzaprina']],
      enxaqueca: [['cef-zolmitriptano', 'cef-metoclopramida-dipirona'], ['cef-sumatriptano-sc', 'cef-metoclopramida-dipirona']],
      salvas: [['cef-oxigenio', 'cef-sumatriptano-sc'], ['cef-zolmitriptano']]
    },
    rules: [
      {
        check: ({ drugs, context }) => {
          if (context.subtype !== 'salvas') return null;
          const ids = drugs.map(d => d.id);
          if (!ids.includes('oxigenio') && !ids.includes('sumatriptano') && !ids.includes('zolmitriptano')) {
            return { severity: 'warning', text: 'Cefaleia em salvas — protocolo preconiza O₂ ou triptano (SC/nasal) na crise aguda.' };
          }
          return null;
        }
      },
      {
        check: ({ drugs, context, selectedMedIds }) => {
          if (context.subtype !== 'enxaqueca') return null;
          const hasTriptan = drugs.some(d => (PS_DRUG_META[d.id]?.classes || []).includes('triptan'));
          const hasAntiemetic = drugs.some(d => d.id === 'metoclopramida' || d.id === 'ondansetrona');
          if (!hasTriptan && !context.contraindicacao_triptano) {
            const onlySimple = selectedMedIds.every(id => ['cef-dipirona', 'cef-paracetamol', 'cef-naproxeno', 'cef-ibuprofeno'].includes(id));
            if (onlySimple && selectedMedIds.length) {
              return { severity: 'warning', text: 'Enxaqueca moderada-grave — considere triptano + antiemético conforme protocolo.' };
            }
          }
          if (hasTriptan && !hasAntiemetic && !selectedMedIds.includes('cef-sumatriptano-esquema')) {
            return { severity: 'warning', text: 'Triptano isolado — associar metoclopramida melhora absorção e náusea na enxaqueca.' };
          }
          return null;
        }
      },
      {
        check: ({ selectedMedIds }) => {
          if (selectedMedIds.includes('cef-naproxeno') && selectedMedIds.includes('cef-ibuprofeno')) {
            return { severity: 'error', text: 'Não prescrever naproxeno e ibuprofeno juntos (dois AINEs).' };
          }
          return null;
        }
      },
      {
        check: ({ selectedMedIds }) => {
          const triptans = ['cef-sumatriptano-esquema', 'cef-sumatriptano-sc', 'cef-zolmitriptano'];
          if (triptans.filter(id => selectedMedIds.includes(id)).length > 1) {
            return { severity: 'error', text: 'Escolha apenas um esquema com triptano por prescrição.' };
          }
          return null;
        }
      }
    ]
  },

  'dengue': {
    contextFields: [
      {
        id: 'grupo',
        label: 'Classificação dengue (MS)',
        type: 'select',
        options: [
          { value: 'A', label: 'Grupo A — ambulatorial' },
          { value: 'B', label: 'Grupo B — observação' },
          { value: 'C', label: 'Grupo C — internação' },
          { value: 'D', label: 'Grupo D — choque' }
        ]
      },
      { id: 'dengue_fase_critica', label: 'Fase crítica / plaquetopenia (< 100 mil)', type: 'checkbox' },
      { id: 'plaquetopenia', label: 'Plaquetas < 50 mil', type: 'checkbox' }
    ],
    medications: [
      { id: 'dengue-paracetamol', tier: '1ª linha', label: 'Paracetamol 750 mg–1 g VO/EV 6/6 h', drugs: [{ id: 'paracetamol' }] },
      { id: 'dengue-dipirona', tier: 'Alternativa', label: 'Dipirona 1 g IV/VO 6/6 h (após fase crítica)', drugs: [{ id: 'dipirona' }] },
      { id: 'dengue-diclofenaco', tier: 'Evitar', label: 'Diclofenaco / AINE', drugs: [{ id: 'diclofenaco' }] },
      { id: 'dengue-hidratacao', tier: '1ª linha', label: 'Hidratação VO ou EV conforme grupo', drugs: [] }
    ],
    idealFor: {
      A: [['dengue-paracetamol', 'dengue-hidratacao']],
      B: [['dengue-paracetamol', 'dengue-hidratacao']],
      C: [['dengue-paracetamol', 'dengue-hidratacao']],
      D: [['dengue-hidratacao']]
    },
    rules: [
      {
        check: ({ selectedMedIds, context }) => {
          if (selectedMedIds.includes('dengue-diclofenaco')) {
            return { severity: 'error', text: 'AINE contraindicado na dengue — risco de sangramento.' };
          }
          if (context.dengue_fase_critica && selectedMedIds.includes('dengue-dipirona')) {
            return { severity: 'warning', text: 'Fase crítica — preferir paracetamol; dipirona com cautela se plaquetopenia.' };
          }
          return null;
        }
      }
    ]
  },

  'alergia-anafilaxia': {
    contextFields: [
      { id: 'broncoespasmo', label: 'Broncoespasmo associado', type: 'checkbox' },
      { id: 'hipotensao', label: 'Hipotensão / choque', type: 'checkbox' }
    ],
    medications: [
      { id: 'ana-adrenalina', tier: '1ª linha', label: 'Adrenalina 0,3–0,5 mg IM (1:1000) — repetir 5–15 min', drugs: [{ id: 'adrenalina' }] },
      { id: 'ana-difenidramina', tier: 'Adjuvante', label: 'Difenidramina 50 mg IM/EV', drugs: [{ id: 'difenidramina' }] },
      { id: 'ana-hidrocortisona', tier: 'Adjuvante', label: 'Hidrocortisona 500 mg EV', drugs: [{ id: 'hidrocortisona' }] },
      { id: 'ana-salbutamol', tier: 'Adjuvante', label: 'Salbutamol nebulização', drugs: [{ id: 'salbutamol' }] },
      { id: 'ana-verapamil', tier: 'Evitar', label: 'Verapamil (não trata anafilaxia)', drugs: [{ id: 'verapamil' }] }
    ],
    rules: [
      {
        check: ({ selectedMedIds, context }) => {
          if (!selectedMedIds.includes('ana-adrenalina')) {
            return { severity: 'error', text: 'Anafilaxia — adrenalina IM é obrigatória (1ª linha, não atrasar).' };
          }
          if (context.broncoespasmo && !selectedMedIds.includes('ana-salbutamol')) {
            return { severity: 'warning', text: 'Broncoespasmo — considere salbutamol nebulização associado.' };
          }
          if (selectedMedIds.includes('ana-verapamil')) {
            return { severity: 'error', text: 'Verapamil não é tratamento de anafilaxia.' };
          }
          return null;
        }
      }
    ]
  },

  'crise-convulsiva-em': {
    contextFields: [
      {
        id: 'fase',
        label: 'Fase',
        type: 'select',
        options: [
          { value: 'convulsao', label: 'Crise convulsiva isolada' },
          { value: 'eme', label: 'Estado de mal epiléptico' }
        ]
      }
    ],
    medications: [
      { id: 'conv-diazepam', tier: '1ª linha', label: 'Diazepam 10 mg EV lento', drugs: [{ id: 'diazepam' }] },
      { id: 'conv-midazolam', tier: '1ª linha', label: 'Midazolam 10 mg IM (sem acesso)', drugs: [{ id: 'midazolam' }] },
      { id: 'conv-fenitoina', tier: '2ª linha', label: 'Fenitoína 20 mg/kg EV', drugs: [{ id: 'fenitoina' }] },
      { id: 'conv-valproico', tier: '2ª linha', label: 'Ácido valpróico 20–40 mg/kg EV', drugs: [{ id: 'acido_valproico' }] }
    ],
    idealFor: {
      convulsao: [['conv-diazepam'], ['conv-midazolam']],
      eme: [['conv-diazepam', 'conv-fenitoina'], ['conv-midazolam', 'conv-fenitoina']]
    },
    rules: [
      {
        check: ({ selectedMedIds, context }) => {
          if (selectedMedIds.includes('conv-diazepam') && selectedMedIds.includes('conv-midazolam')) {
            return { severity: 'warning', text: 'Evite associar diazepam e midazolam — preferir um benzodiazepínico titulado.' };
          }
          if (context.fase === 'eme' && !selectedMedIds.includes('conv-fenitoina') && !selectedMedIds.includes('conv-valproico')) {
            return { severity: 'warning', text: 'EME — após benzodiazepínico, iniciar 2ª linha (fenitoína ou valproato EV).' };
          }
          return null;
        }
      }
    ]
  },

  'vomitos-agudos': {
    contextFields: [{ id: 'gestante', label: 'Gestante (hiperêmese)', type: 'checkbox' }],
    medications: [
      { id: 'vom-metoclopramida', tier: '1ª linha', label: 'Metoclopramida 10 mg IM/EV 8/8 h', drugs: [{ id: 'metoclopramida' }] },
      { id: 'vom-ondansetrona', tier: 'Alternativa', label: 'Ondansetrona 4 mg IM/EV 8/8 h', drugs: [{ id: 'ondansetrona' }] },
      { id: 'vom-dimenidrinato', tier: 'Alternativa', label: 'Dimenidrinato 50 mg IM/EV', drugs: [{ id: 'dimenidrinato' }] },
      { id: 'vom-combo', tier: 'Refractário', label: 'Metoclopramida + ondansetrona', drugs: [{ id: 'metoclopramida' }, { id: 'ondansetrona' }] },
      { id: 'vom-haloperidol', tier: 'Alternativa', label: 'Haloperidol 0,5–1 mg EV', drugs: [{ id: 'haloperidol' }] }
    ],
    idealFor: { default: [['vom-metoclopramida'], ['vom-ondansetrona']] },
    rules: [
      {
        check: ({ selectedMedIds }) => {
          if (selectedMedIds.includes('vom-metoclopramida') && selectedMedIds.includes('vom-haloperidol')) {
            return { severity: 'warning', text: 'Metoclopramida + haloperidol — risco de discinesia aguda; prefira uma estratégia por vez.' };
          }
          return null;
        }
      }
    ]
  },

  'celulite': {
    contextFields: [
      { id: 'imunossupressao', label: 'Imunossupressão / diabetes descompensado', type: 'checkbox' },
      { id: 'mrsa', label: 'Suspeita de MRSA', type: 'checkbox' }
    ],
    medications: [
      { id: 'cel-ceftriaxona', tier: '1ª linha', label: 'Ceftriaxona 1 g IM/IV 24/24 h', drugs: [{ id: 'ceftriaxona' }] },
      { id: 'cel-oxacilina', tier: 'Alternativa', label: 'Oxacilina 1 g IV 6/6 h', drugs: [{ id: 'oxacilina' }] },
      { id: 'cel-dipirona', tier: 'Sintomático', label: 'Dipirona 1 g IV/IM 6/6 h', drugs: [{ id: 'dipirona' }] },
      { id: 'cel-diclofenaco', tier: 'Sintomático', label: 'Diclofenaco 75 mg IM', drugs: [{ id: 'diclofenaco' }] }
    ],
    rules: [
      {
        check: ({ selectedMedIds, context }) => {
          if (!selectedMedIds.includes('cel-ceftriaxona') && !selectedMedIds.includes('cel-oxacilina')) {
            return { severity: 'warning', text: 'Celulite — inclua antibioticoterapia (ceftriaxona ou oxacilina).' };
          }
          if (context.mrsa && selectedMedIds.includes('cel-ceftriaxona')) {
            return { severity: 'warning', text: 'MRSA suspeito — avaliar clindamicina ou vancomicina.' };
          }
          return null;
        }
      }
    ]
  }
};
