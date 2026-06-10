/* Receituário — catálogo de condições e modelos de receita */

const RX_CATALOG_MANUAL = [
  {
    id: 'cefaleias',
    name: 'Cefaleia',
    icon: '🤕',
    aliases: ['cefaleia', 'cefaleias', 'dor de cabeca', 'dor cabeca', 'enxaqueca', 'migranea', 'migraine', 'headache', 'salvas'],
    groups: [
      {
        id: 'tensional',
        label: 'Cefaleia tensional',
        options: [
          {
            id: 'cef-tens-analgesic',
            tier: '1ª linha',
            label: 'Analgésico simples — escolha um',
            classes: ['analgesic_non_opioid'],
            items: [],
            meds: [
              { id: 'cef-tens-analgesic-dip500', text: MED_VO.dipirona500 + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-tens-analgesic' },
              { id: 'cef-tens-analgesic-dip1g', text: MED_VO.dipirona1g + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-tens-analgesic' },
              { id: 'cef-tens-analgesic-par500', text: MED_VO.paracetamol500 + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-tens-analgesic' },
              { id: 'cef-tens-analgesic-par750', text: MED_VO.paracetamol750 + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-tens-analgesic' }
            ],
            orientacoes: 'Evitar uso diário prolongado de analgésicos (> 10–15 dias/mês). Retorno imediato se cefaleia súbita intensa (“pior da vida”), febre, rigidez de nuca ou déficit neurológico.'
          },
          {
            id: 'cef-tens-aine',
            tier: 'Alternativa',
            label: 'AINE — escolha um',
            classes: ['nsaid'],
            items: [],
            meds: [
              { id: 'cef-tens-aine-nap', text: MED_VO.naproxeno500 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' },
              { id: 'cef-tens-aine-ibu200', text: MED_VO.ibuprofeno200 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' },
              { id: 'cef-tens-aine-ibu400', text: MED_VO.ibuprofeno400 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' },
              { id: 'cef-tens-aine-ibu600', text: MED_VO.ibuprofeno600 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' },
              { id: 'cef-tens-aine-dic', text: MED_VO.diclofenaco50 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' },
              { id: 'cef-tens-aine-cet50', text: MED_VO.cetoprofeno50 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' },
              { id: 'cef-tens-aine-cet100', text: MED_VO.cetoprofeno100 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' },
              { id: 'cef-tens-aine-nim', text: MED_VO.nimesulida100 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'cef-tens-aine' }
            ],
            orientacoes: 'Cautela em úlcera péptica, DRC, gestação e asma. Tomar AINE após alimentação. Prescreva apenas um AINE por receita.'
          },
          {
            id: 'cef-tens-relaxant',
            tier: 'Adjuvante',
            label: 'Relaxante muscular — escolha um (se componente cervical)',
            classes: ['muscle_relaxant'],
            items: [],
            meds: [
              { id: 'cef-tens-relax-ciclo5', text: MED_VO.ciclobenzaprina5 + ', por 3 a 5 dias', classes: ['muscle_relaxant'], exclusiveGroup: 'cef-tens-relaxant' },
              { id: 'cef-tens-relax-ciclo10', text: MED_VO.ciclobenzaprina10 + ', por 3 a 5 dias', classes: ['muscle_relaxant'], exclusiveGroup: 'cef-tens-relaxant' },
              { id: 'cef-tens-relax-tiza', text: MED_VO.tizanidina2 + ', por 3 a 5 dias', classes: ['muscle_relaxant'], exclusiveGroup: 'cef-tens-relaxant' }
            ],
            orientacoes: 'Evitar dirigir ou operar máquinas. Cautela em idosos e hepatopatia.'
          },
          {
            id: 'cef-tens-opioid',
            tier: 'Refractário',
            label: 'Opioide — dor refratária',
            classes: ['opioid'],
            items: [],
            meds: [
              { id: 'cef-tens-opioid-tram', text: MED_VO.tramadol50 + ', por até 3 dias', classes: ['opioid'] }
            ],
            orientacoes: 'Receita especial (A2). Evitar associar outros opioides. Não dirigir se sedação.'
          }
        ]
      },
      {
        id: 'enxaqueca',
        label: 'Enxaqueca moderada a grave',
        options: [
          {
            id: 'cef-enx-triptan',
            tier: '1ª linha',
            label: 'Triptano — escolha um',
            classes: ['triptan'],
            items: [],
            meds: [
              { id: 'cef-enx-trip-sum50', text: MED_VO.sumatriptano50, classes: ['triptan'], exclusiveGroup: 'cef-enx-triptan' },
              { id: 'cef-enx-trip-sum100', text: MED_VO.sumatriptano100, classes: ['triptan'], exclusiveGroup: 'cef-enx-triptan' },
              { id: 'cef-enx-trip-sum-sc', text: MED_VO.sumatriptanoSc6, classes: ['triptan'], exclusiveGroup: 'cef-enx-triptan' },
              { id: 'cef-enx-trip-zol-vo', text: MED_VO.zolmitriptano25, classes: ['triptan'], exclusiveGroup: 'cef-enx-triptan' },
              { id: 'cef-enx-trip-zol-nas', text: MED_VO.zolmitriptanoNas5, classes: ['triptan'], exclusiveGroup: 'cef-enx-triptan' }
            ],
            orientacoes: 'Contraindicado se DAC, AVC prévio, PA não controlada ou gestação (revisar). Não usar triptano > 10 dias/mês.'
          },
          {
            id: 'cef-enx-antiemetic',
            tier: 'Adjuvante',
            label: 'Antiemético — escolha um',
            classes: ['antiemetic'],
            items: [],
            meds: [
              { id: 'cef-enx-anti-met', text: MED_VO.metoclopramida10, classes: ['antiemetic'], exclusiveGroup: 'cef-enx-antiemetic' },
              { id: 'cef-enx-anti-ond4', text: MED_VO.ondansetrona4, classes: ['antiemetic'], exclusiveGroup: 'cef-enx-antiemetic' },
              { id: 'cef-enx-anti-ond8', text: MED_VO.ondansetrona8, classes: ['antiemetic'], exclusiveGroup: 'cef-enx-antiemetic' }
            ],
            orientacoes: 'Associar antiemético ao triptano melhora absorção e controle de náusea.'
          },
          {
            id: 'cef-enx-analgesic',
            tier: 'Adjuvante',
            label: 'Analgésico adjuvante — escolha um',
            classes: ['analgesic_non_opioid'],
            items: [],
            meds: [
              { id: 'cef-enx-anal-dip500', text: MED_VO.dipirona500 + ' se dor residual', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-enx-analgesic' },
              { id: 'cef-enx-anal-dip1g', text: MED_VO.dipirona1g + ' se dor residual', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-enx-analgesic' },
              { id: 'cef-enx-anal-par500', text: MED_VO.paracetamol500 + ' se dor residual', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-enx-analgesic' },
              { id: 'cef-enx-anal-par750', text: MED_VO.paracetamol750 + ' se dor residual', classes: ['analgesic_non_opioid'], exclusiveGroup: 'cef-enx-analgesic' }
            ],
            orientacoes: 'Usar como adjuvante, não substituir triptano na crise moderada-grave.'
          },
          {
            id: 'cef-enx-aine',
            tier: 'Alternativa',
            label: 'AINE adjuvante — escolha um',
            classes: ['nsaid'],
            items: [],
            meds: [
              { id: 'cef-enx-aine-nap', text: MED_VO.naproxeno500 + ' por 2 dias', classes: ['nsaid'], exclusiveGroup: 'cef-enx-aine' },
              { id: 'cef-enx-aine-ibu400', text: MED_VO.ibuprofeno400 + ' por 2 dias', classes: ['nsaid'], exclusiveGroup: 'cef-enx-aine' },
              { id: 'cef-enx-aine-dic', text: MED_VO.diclofenaco50 + ' por 2 dias', classes: ['nsaid'], exclusiveGroup: 'cef-enx-aine' },
              { id: 'cef-enx-aine-cet50', text: MED_VO.cetoprofeno50 + ' por 2 dias', classes: ['nsaid'], exclusiveGroup: 'cef-enx-aine' },
              { id: 'cef-enx-aine-cet100', text: MED_VO.cetoprofeno100 + ' por 2 dias', classes: ['nsaid'], exclusiveGroup: 'cef-enx-aine' },
              { id: 'cef-enx-aine-nim', text: MED_VO.nimesulida100 + ' por 2 dias', classes: ['nsaid'], exclusiveGroup: 'cef-enx-aine' }
            ],
            orientacoes: 'Alternativa ou adjuvante se contraindicação a triptano. Apenas um AINE por receita.'
          },
          {
            id: 'cef-enx-corticoide',
            tier: 'Refractário',
            label: 'Corticoide — prevenção de recorrência',
            classes: ['corticosteroid'],
            items: [],
            meds: [
              { id: 'cef-enx-cort-dexa', text: MED_VO.dexametasona4, classes: ['corticosteroid'] }
            ],
            orientacoes: 'Considerar após crise refratária ou status migrainoso. PS: dexametasona 10 mg IV — adaptar 8 mg VO na alta se indicado. Reavaliar glicemia e infecção.'
          },
          {
            id: 'cef-enx-profilaxia',
            tier: 'Profilaxia',
            label: 'Profilaxia ambulatorial — escolha um',
            classes: ['beta_blocker', 'anticonvulsant', 'tricyclic'],
            items: [],
            meds: [
              { id: 'cef-enx-prof-prop', text: MED_VO.propranolol40, classes: ['beta_blocker'], exclusiveGroup: 'cef-enx-profilaxia' },
              { id: 'cef-enx-prof-topo', text: MED_VO.topiramato25, classes: ['anticonvulsant'], exclusiveGroup: 'cef-enx-profilaxia' },
              { id: 'cef-enx-prof-amit', text: MED_VO.amitriptilina25, classes: ['tricyclic'], exclusiveGroup: 'cef-enx-profilaxia' }
            ],
            orientacoes: 'Indicar se ≥ 4 crises/mês ou impacto funcional. Retorno em 4–8 semanas para resposta.'
          }
        ]
      },
      {
        id: 'salvas',
        label: 'Cefaleia em salvas',
        options: [
          {
            id: 'cef-sal-crise',
            tier: '1ª linha',
            label: 'Tratamento da crise — escolha um',
            classes: ['triptan'],
            items: [],
            meds: [
              { id: 'cef-sal-o2', text: 'Oxigenoterapia — O₂ 100% 12–15 L/min por máscara não reinalante × 15–20 min na crise', classes: [], exclusiveGroup: 'cef-sal-crise' },
              { id: 'cef-sal-sum-sc', text: MED_VO.sumatriptanoSc6, classes: ['triptan'], exclusiveGroup: 'cef-sal-crise' },
              { id: 'cef-sal-zol-nas', text: MED_VO.zolmitriptanoNas5, classes: ['triptan'], exclusiveGroup: 'cef-sal-crise' }
            ],
            orientacoes: 'Orientar evitar álcool e nitratos na crise. Encaminhar neurologia para profilaxia.'
          },
          {
            id: 'cef-sal-profilaxia',
            tier: 'Profilaxia',
            label: 'Profilaxia ambulatorial — escolha um',
            classes: ['calcium_channel_blocker'],
            items: [],
            meds: [
              { id: 'cef-sal-prof-vera', text: MED_VO.verapamil80, classes: ['calcium_channel_blocker'], exclusiveGroup: 'cef-sal-profilaxia' },
              { id: 'cef-sal-prof-vera120', text: MED_VO.verapamil120, classes: ['calcium_channel_blocker'], exclusiveGroup: 'cef-sal-profilaxia' }
            ],
            orientacoes: 'Solicitar ECG antes e monitorar. Especialista/neurologia recomendado.'
          }
        ]
      }
    ]
  },
  {
    id: 'amigdalite-bacteriana',
    name: 'Dor de garganta / faringite',
    icon: '🦠',
    aliases: ['dor de garganta', 'garganta', 'faringite', 'faringoamigdalite', 'odinofagia', 'amigdalite', 'amigdalite bacteriana'],
    groups: [
      {
        id: 'sintomatico',
        label: 'Tratamento sintomático — faringite viral ou adjuvante',
        options: [
          {
            id: 'amig-sint-analgesic',
            tier: '1ª linha',
            label: 'Analgésico simples — escolha um',
            classes: ['analgesic_non_opioid'],
            items: [],
            meds: [
              { id: 'amig-sint-dip500', text: MED_VO.dipirona500 + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'amig-sint-analgesic' },
              { id: 'amig-sint-dip1g', text: MED_VO.dipirona1g + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'amig-sint-analgesic' },
              { id: 'amig-sint-par500', text: MED_VO.paracetamol500 + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'amig-sint-analgesic' },
              { id: 'amig-sint-par750', text: MED_VO.paracetamol750 + ', por 3 a 5 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'amig-sint-analgesic' }
            ],
            orientacoes: 'Maioria das faringites é viral — tratamento sintomático e observação. Hidratação, gargarejos com água morna e sal.'
          },
          {
            id: 'amig-sint-aine',
            tier: 'Alternativa',
            label: 'AINE — escolha um (adulto; cautela em crianças)',
            classes: ['nsaid'],
            items: [],
            meds: [
              { id: 'amig-sint-ibu400', text: MED_VO.ibuprofeno400 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'amig-sint-aine' },
              { id: 'amig-sint-nap250', text: MED_VO.naproxeno250 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'amig-sint-aine' },
              { id: 'amig-sint-nap500', text: MED_VO.naproxeno500 + ', por 3 a 5 dias', classes: ['nsaid'], exclusiveGroup: 'amig-sint-aine' }
            ],
            orientacoes: 'Anti-inflamatório para odinofagia. Apenas um AINE por receita. Evitar AINE em crianças pequenas sem orientação.'
          },
          {
            id: 'amig-sint-suporte',
            tier: 'Suporte',
            label: 'Medidas não medicamentosas',
            classes: [],
            items: [],
            meds: [
              { id: 'amig-sint-garg', text: 'Gargarejo com água morna e sal — 3 a 4 vezes ao dia', classes: [] },
              { id: 'amig-sint-hid', text: 'Hidratação oral abundante — água, sopas, gelatina', classes: [] }
            ],
            orientacoes: 'Repouso vocal relativo. Retorno se febre > 39 °C > 3 dias, trismo, voz abafada ou piora unilateral.'
          }
        ]
      },
      {
        id: 'atb',
        label: 'Antibiótico — somente se faringite estreptocócica (Centor ≥3 ou teste +)',
        options: [
          {
            id: 'amig-atb-amox',
            tier: '1ª linha',
            label: 'Amoxicilina — escolha apresentação',
            classes: ['penicillin'],
            items: [],
            meds: [
              { id: 'amig-amox500', text: MED_VO.amoxicilina500, classes: ['penicillin'], exclusiveGroup: 'amig-amox' },
              { id: 'amig-amox875', text: MED_VO.amoxicilina875, classes: ['penicillin'], exclusiveGroup: 'amig-amox' }
            ],
            orientacoes: 'Indicar se exsudato + linfonodos + ausência de tosse ou teste rápido/cultura positiva. Completar 10 dias mesmo com melhora em 48 h.'
          },
          {
            id: 'amig-atb-clav',
            tier: 'Alternativa',
            label: 'Amoxicilina-clavulanato — escolha apresentação',
            classes: ['penicillin', 'penicillin_clavulanate'],
            items: [],
            meds: [
              { id: 'amig-clav875', text: MED_VO.amoxClav875, classes: ['penicillin', 'penicillin_clavulanate'], exclusiveGroup: 'amig-clav' },
              { id: 'amig-clav500', text: MED_VO.amoxClav500, classes: ['penicillin', 'penicillin_clavulanate'], exclusiveGroup: 'amig-clav' }
            ],
            orientacoes: 'Alternativa se falha terapêutica ou fatores de risco para resistência.'
          },
          {
            id: 'amig-atb-alerg',
            tier: 'Alérgico',
            label: 'Alérgico à penicilina — escolha um',
            classes: ['antibiotic'],
            items: [],
            meds: [
              { id: 'amig-azit', text: MED_VO.azitromicina500, classes: ['antibiotic'], exclusiveGroup: 'amig-atb-alerg' },
              { id: 'amig-clinda', text: MED_VO.clindamicina300, classes: ['antibiotic'], exclusiveGroup: 'amig-atb-alerg' }
            ],
            orientacoes: 'Usar apenas se indicação de ATB confirmada e alergia documentada à penicilina.'
          }
        ]
      }
    ]
  },
  {
    id: 'cistite-itu-baixa',
    name: 'Cistite (ITU baixa)',
    icon: '💧',
    aliases: ['cistite', 'itu', 'infecao urinaria', 'disuria', 'polaciuria', 'queima ao urinar'],
    groups: [
      {
        id: 'suporte',
        label: 'Medidas gerais (enquanto confirma ITU)',
        options: [
          {
            id: 'itu-suporte',
            tier: 'Suporte',
            label: 'Hidratação e analgesia — escolha analgésico se dor',
            classes: ['analgesic_non_opioid'],
            items: [],
            meds: [
              { id: 'itu-hid', text: 'Hidratação oral abundante — mínimo 2 L/dia', classes: [] },
              { id: 'itu-dip500', text: MED_VO.dipirona500 + ', se disúria', classes: ['analgesic_non_opioid'], exclusiveGroup: 'itu-analgesic' },
              { id: 'itu-par750', text: MED_VO.paracetamol750 + ', se disúria', classes: ['analgesic_non_opioid'], exclusiveGroup: 'itu-analgesic' }
            ],
            orientacoes: 'Disúria isolada não confirma ITU — considerar uretrite, vaginite. ATB abaixo só se cistite confirmada ou alta suspeita.'
          }
        ]
      },
      {
        id: 'atb',
        label: 'Antibiótico — cistite confirmada ou ITU baixa não complicada',
        options: [
          {
            id: 'itu-1',
            tier: '1ª linha',
            label: 'Nitrofurantoína',
            classes: ['nitrofuran'],
            items: [],
            meds: [
              { id: 'itu-nitro', text: MED_VO.nitrofurantoina100, classes: ['nitrofuran'] }
            ],
            orientacoes: 'Evitar se TFG < 30 mL/min. Urina pode ficar amarelada — orientar paciente. Hidratação abundante.'
          },
          {
            id: 'itu-2',
            tier: 'Alternativa',
            label: 'Fosfomicina dose única',
            classes: ['antibiotic_misc'],
            items: [],
            meds: [
              { id: 'itu-fosfo', text: MED_VO.fosfomicina3g, classes: ['antibiotic_misc'] }
            ],
            orientacoes: 'Alternativa de 1ª linha (dose única). Retorno se febre, dor lombar ou piora em 48 h (pielonefrite).'
          }
        ]
      }
    ]
  },
  {
    id: 'lombalgia-ciatalgia',
    name: 'Lombalgia / ciatalgia',
    icon: '🦴',
    aliases: ['lombalgia', 'lombago', 'ciatalgia', 'ciatica', 'dor lombar', 'dor nas costas'],
    groups: [
      {
        id: 'analgesia',
        label: 'Analgesia',
        options: [
          {
            id: 'lomb-analgesic',
            tier: '1ª linha',
            label: 'Analgésico simples — escolha um',
            classes: ['analgesic_non_opioid'],
            items: [],
            meds: [
              { id: 'lomb-anal-dip500', text: MED_VO.dipirona500 + ', por 5 a 7 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'lomb-analgesic' },
              { id: 'lomb-anal-dip1g', text: MED_VO.dipirona1g + ', por 5 a 7 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'lomb-analgesic' },
              { id: 'lomb-anal-par500', text: MED_VO.paracetamol500 + ', por 5 a 7 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'lomb-analgesic' },
              { id: 'lomb-anal-par750', text: MED_VO.paracetamol750 + ', por 5 a 7 dias', classes: ['analgesic_non_opioid'], exclusiveGroup: 'lomb-analgesic' }
            ],
            orientacoes: 'Repouso relativo, calor local.'
          },
          {
            id: 'lomb-aine',
            tier: '1ª linha',
            label: 'AINE — escolha um',
            classes: ['nsaid'],
            items: [],
            meds: [
              { id: 'lomb-aine-nap', text: MED_VO.naproxeno500 + ', por 5 dias', classes: ['nsaid'], exclusiveGroup: 'lomb-aine' },
              { id: 'lomb-aine-ibu400', text: MED_VO.ibuprofeno400 + ', por 5 dias', classes: ['nsaid'], exclusiveGroup: 'lomb-aine' },
              { id: 'lomb-aine-ibu600', text: MED_VO.ibuprofeno600 + ', por 5 dias', classes: ['nsaid'], exclusiveGroup: 'lomb-aine' },
              { id: 'lomb-aine-dic', text: MED_VO.diclofenaco50 + ', por 5 dias', classes: ['nsaid'], exclusiveGroup: 'lomb-aine' },
              { id: 'lomb-aine-cet50', text: MED_VO.cetoprofeno50 + ', por 5 dias', classes: ['nsaid'], exclusiveGroup: 'lomb-aine' },
              { id: 'lomb-aine-cet100', text: MED_VO.cetoprofeno100 + ', por 5 dias', classes: ['nsaid'], exclusiveGroup: 'lomb-aine' },
              { id: 'lomb-aine-nim', text: MED_VO.nimesulida100 + ', por 5 dias', classes: ['nsaid'], exclusiveGroup: 'lomb-aine' }
            ],
            orientacoes: 'Tomar após alimentação. Cautela em DRC, úlcera e anticoagulação.'
          },
          {
            id: 'lomb-relaxant',
            tier: 'Adjuvante',
            label: 'Relaxante muscular — escolha um (se espasmo)',
            classes: ['muscle_relaxant'],
            items: [],
            meds: [
              { id: 'lomb-relax-ciclo5', text: MED_VO.ciclobenzaprina5 + ', por 5 dias', classes: ['muscle_relaxant'], exclusiveGroup: 'lomb-relaxant' },
              { id: 'lomb-relax-ciclo10', text: MED_VO.ciclobenzaprina10 + ', por 5 dias', classes: ['muscle_relaxant'], exclusiveGroup: 'lomb-relaxant' },
              { id: 'lomb-relax-tiza', text: MED_VO.tizanidina2 + ', por 5 dias', classes: ['muscle_relaxant'], exclusiveGroup: 'lomb-relaxant' }
            ],
            orientacoes: 'Retorno imediato se déficit motor, anestesia em sela, febre ou trauma.'
          }
        ]
      }
    ]
  },
  {
    id: 'gonorreia-clamidia',
    name: 'Gonorreia / clamídia',
    icon: '🔬',
    aliases: ['gonorreia', 'clamidia', 'chlamydia', 'uretrite', 'cervicite', 'corrimento', 'ist'],
    groups: [
      {
        id: 'gon-im-ps',
        label: 'Gonorreia — aplicar no PS (IM)',
        options: [
          {
            id: 'gon-ceftri-im',
            tier: '1ª linha',
            label: 'Ceftriaxona IM dose única',
            classes: ['antibiotic'],
            noVoExpand: true,
            meds: [
              { id: 'gon-ceftri-500', text: 'Ceftriaxona 500 mg — 1 amp IM dose única (deltoide ou glúteo profundo)', classes: ['antibiotic'], exclusiveGroup: 'gon-ceftri-dose' },
              { id: 'gon-ceftri-1g', text: 'Ceftriaxona 1 g — 1 amp IM dose única (se resistência local documentada)', classes: ['antibiotic'], exclusiveGroup: 'gon-ceftri-dose' }
            ],
            orientacoes: 'Aplicar no serviço — não consta na receita VO. Tratar clamídia concomitante (azitromicina abaixo).'
          }
        ]
      },
      {
        id: 'gon-vo',
        label: 'Clamídia — receita VO (alta)',
        options: [
          {
            id: 'gon-azit',
            tier: '1ª linha',
            label: 'Azitromicina dose única (clamídia)',
            classes: ['antibiotic'],
            noVoExpand: true,
            meds: [
              { id: 'gon-azit-1g', text: MED_VO.azitromicina1g, classes: ['antibiotic'] }
            ],
            orientacoes: 'Tratar parceiros dos últimos 60 dias. Abstinência sexual até 7 dias após tratamento. Testar HIV e sífilis.'
          }
        ]
      },
      {
        id: 'gon-alt-vo',
        label: 'Alternativa 100% VO (sem ceftriaxona IM)',
        options: [
          {
            id: 'gon-cefix',
            tier: 'Alternativa',
            label: 'Cefixima + azitromicina VO',
            classes: ['antibiotic'],
            noVoExpand: true,
            meds: [
              { id: 'gon-cefix-400', text: MED_VO.cefixima400 + ' (gonorreia)', classes: ['antibiotic'] },
              { id: 'gon-azit-alt', text: MED_VO.azitromicina1g + ' (clamídia)', classes: ['antibiotic'] }
            ],
            orientacoes: 'Esquema oral alternativo quando ceftriaxona IM indisponível ou recusa. MS/CDC IST 2022.'
          }
        ]
      }
    ]
  },
  {
    id: 'violencia-sexual-pep',
    name: 'Violência sexual — PEP',
    icon: '🛡️',
    aliases: ['violencia sexual', 'estupro', 'pep', 'pep hiv', 'profilaxia pos exposicao', 'ist pos violencia'],
    groups: [
      {
        id: 'vs-contracepcao',
        label: 'Contracepção de emergência (até 72 h, ideal ≤ 24 h)',
        options: [
          {
            id: 'vs-lng',
            tier: '1ª linha',
            label: 'Levonorgestrel VO',
            classes: [],
            noVoExpand: true,
            meds: [
              { id: 'vs-lng-15', text: MED_VO.levonorgestrel15, classes: [] }
            ],
            orientacoes: 'Eficácia decrescente após 72 h; DIU de cobre até 5 dias se disponível e desejado.'
          }
        ]
      },
      {
        id: 'vs-ist-im',
        label: 'Profilaxia IST — aplicar no PS (IM)',
        options: [
          {
            id: 'vs-ceftri-im',
            tier: '1ª linha',
            label: 'Ceftriaxona IM (gonorreia)',
            classes: ['antibiotic'],
            noVoExpand: true,
            meds: [
              { id: 'vs-ceftri', text: 'Ceftriaxona 500 mg — 1 amp IM dose única (deltoide ou glúteo profundo)', classes: ['antibiotic'] }
            ],
            orientacoes: 'Aplicar no PS antes da alta. Gonorreia — MS protocolo violência sexual 2022.'
          }
        ]
      },
      {
        id: 'vs-ist-vo',
        label: 'Profilaxia IST — receita VO (alta)',
        options: [
          {
            id: 'vs-ist-vo-combo',
            tier: '1ª linha',
            label: 'Azitromicina + metronidazol (clamídia + tricomoníase)',
            classes: ['antibiotic'],
            noVoExpand: true,
            meds: [
              { id: 'vs-azit', text: MED_VO.azitromicina1g + ' (clamídia)', classes: ['antibiotic'] },
              { id: 'vs-metro', text: MED_VO.metronidazol2g + ' (tricomoníase)', classes: ['antibiotic'] }
            ],
            orientacoes: 'Esquema empírico combinado conforme MS. Tratar parceiro(s) se indicado.'
          },
          {
            id: 'vs-ist-vo-oral',
            tier: 'Alternativa (100% VO)',
            label: 'Cefixima + azitromicina + metronidazol',
            classes: ['antibiotic'],
            noVoExpand: true,
            meds: [
              { id: 'vs-cefix', text: MED_VO.cefixima400 + ' (gonorreia)', classes: ['antibiotic'] },
              { id: 'vs-azit2', text: MED_VO.azitromicina1g + ' (clamídia)', classes: ['antibiotic'] },
              { id: 'vs-metro2', text: MED_VO.metronidazol2g + ' (tricomoníase)', classes: ['antibiotic'] }
            ],
            orientacoes: 'Se ceftriaxona IM não aplicada no PS. Evitar álcool 48 h após metronidazol.'
          }
        ]
      },
      {
        id: 'vs-pep-hiv',
        label: 'PEP HIV — iniciar ≤ 72 h (receita especial)',
        options: [
          {
            id: 'vs-pep-tdf3tc',
            tier: '1ª linha',
            label: 'TDF/3TC/DTG — 28 dias',
            classes: [],
            noVoExpand: true,
            meds: [
              { id: 'vs-pep-combo', text: 'Tenofovir + lamivudina + dolutegravir (comprimido fixo TDF/3TC/DTG) — 1 comprimido VO 24/24 h por 28 dias consecutivos', classes: [] }
            ],
            orientacoes: 'Receita especial. Sorologias baseline (HIV, sífilis, HBsAg, anti-HCV, β-hCG). Retorno 7, 14 e 30 dias; reteste em 3 e 6 meses. Não interromper antes de 28 dias.'
          },
          {
            id: 'vs-pep-tdftc',
            tier: 'Alternativa',
            label: 'TDF/FTC/DTG — 28 dias',
            classes: [],
            noVoExpand: true,
            meds: [
              { id: 'vs-pep-combo2', text: 'Tenofovir + emtricitabina + dolutegravir (comprimido fixo TDF/FTC/DTG) — 1 comprimido VO 24/24 h por 28 dias consecutivos', classes: [] }
            ],
            orientacoes: 'Alternativa de 1ª linha. Mesmas orientações de acompanhamento da PEP.'
          }
        ]
      },
      {
        id: 'vs-sifilis',
        label: 'Sífilis — profilaxia/tratamento empírico (PS, IM)',
        options: [
          {
            id: 'vs-sif-benz',
            tier: '1ª linha',
            label: 'Penicilina benzatina dose única',
            classes: ['penicillin'],
            noVoExpand: true,
            meds: [
              { id: 'vs-sif-benz24', text: 'Penicilina benzatina 2,4 milhões UI — 1,2 milhão UI IM em cada glúteo (dose única, profilaxia/tratamento empírico de sífilis)', classes: ['penicillin'] }
            ],
            orientacoes: 'Aplicar no PS. VDRL baseline; reteste em 3 e 6 meses. Gestação: penicilina é tratamento de escolha (MS 2022).'
          },
          {
            id: 'vs-sif-doxi',
            tier: 'Alérgico (sem anafilaxia)',
            label: 'Doxiciclina VO — alternativa',
            classes: ['antibiotic'],
            noVoExpand: true,
            meds: [
              { id: 'vs-sif-dox', text: 'Doxiciclina 100 mg — 1 comprimido VO 12/12 h por 14 dias', classes: ['antibiotic'] }
            ],
            orientacoes: 'Somente se alergia documentada à penicilina sem anafilaxia. Contraindicada na gestação e lactação.'
          }
        ]
      },
      {
        id: 'vs-hepb',
        label: 'Hepatite B — profilaxia pós-exposição (PS, IM)',
        options: [
          {
            id: 'vs-hb-vac-ig',
            tier: '1ª linha',
            label: 'Não vacinado ou esquema incompleto',
            classes: [],
            noVoExpand: true,
            meds: [
              { id: 'vs-hb-vac', text: 'Vacina hepatite B recombinante — 1ª dose 1 mL IM (deltoide); completar esquema 0-1-6 meses', classes: [] },
              { id: 'vs-hb-ig', text: 'Imunoglobulina anti-HBs — 0,06 mL/kg IM (máx. 500 UI), preferencialmente nas primeiras 24 h (até 7 dias)', classes: [] }
            ],
            orientacoes: 'Checar HBsAg e anti-HBs baseline. Se HBsAg positivo → encaminhar hepatologia (não usar IG anti-HBs isolada).'
          },
          {
            id: 'vs-hb-reforco',
            tier: 'Alternativa',
            label: 'Vacinado — anti-HBs desconhecido ou < 10 mUI/mL',
            classes: [],
            noVoExpand: true,
            meds: [
              { id: 'vs-hb-vac2', text: 'Vacina hepatite B recombinante — 1 dose IM (deltoide) + imunoglobulina anti-HBs conforme peso (até 500 UI IM)', classes: [] }
            ],
            orientacoes: 'Reforço ou completar esquema conforme anti-HBs e histórico vacinal.'
          }
        ]
      },
      {
        id: 'vs-tetano',
        label: 'Profilaxia antitetânica (se feridas — PS, IM)',
        options: [
          {
            id: 'vs-tet-reforco',
            tier: '1ª linha',
            label: 'Reforço vacinal (ferida limpa)',
            classes: [],
            noVoExpand: true,
            meds: [
              { id: 'vs-tet-dt', text: 'Vacina antitetânica (dT ou dTpa) 0,5 mL — 1 dose IM deltoide se última dose há mais de 10 anos', classes: [] }
            ],
            orientacoes: 'Conferir carteira vacinal. Ferida limpa: reforço se > 10 anos desde última dose.'
          },
          {
            id: 'vs-tet-ig',
            tier: 'Ferida tetanígena / vacinação incompleta',
            label: 'Vacina + imunoglobulina antitetânica',
            classes: [],
            noVoExpand: true,
            meds: [
              { id: 'vs-tet-vac', text: 'Vacina antitetânica (dT ou dTpa) 0,5 mL IM deltoide', classes: [] },
              { id: 'vs-tet-igh', text: 'Imunoglobulina antitetânica humana 250 UI IM (sítio diferente da vacina)', classes: [] }
            ],
            orientacoes: 'Ferida tetanígena ou vacinação incompleta/desconhecida. Lavagem abundante das feridas. SAT 500 UI se Ig humana indisponível (protocolo local).'
          }
        ]
      }
    ]
  }
];

function rxNormText (text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function rxInferMedClasses (text) {
  const t = rxNormText(text);
  const classes = [];
  if (/naproxeno|ibuprofeno|diclofenac|cetoprofeno|nimesulid|aas|aspirin|acido acetilsalicilico|meloxicam|piroxicam/.test(t)) {
    classes.push('nsaid');
  }
  if (/dipirona|paracetamol|acetaminofen/.test(t)) classes.push('analgesic_non_opioid');
  if (/sumatriptano|zolmitriptano|eletriptano|rizatriptano|almotriptano/.test(t)) classes.push('triptan');
  if (/tramadol|morfina|codeina|fentanil|oxicode/.test(t)) classes.push('opioid');
  if (/metoclopramid|ondansetrona|bromoprida|dimenidrinato/.test(t)) classes.push('antiemetic');
  if (/ciclobenzaprina|carisoprodol|tizanidina/.test(t)) classes.push('muscle_relaxant');
  if (/dexametasona|prednisona|prednisolona|hidrocortisona|metilprednisolona/.test(t)) classes.push('corticosteroid');
  if (/propranolol|atenolol|metoprolol|bisoprolol|carvedilol/.test(t)) classes.push('beta_blocker');
  if (/topiramato|valproato|carbamazepina|fenitoina|levetiracetam/.test(t)) classes.push('anticonvulsant');
  if (/amitriptilin|nortriptilin|imipramina/.test(t)) classes.push('tricyclic');
  if (/verapamil|diltiazem|anlodipino|nifedipino/.test(t)) classes.push('calcium_channel_blocker');
  if (/amoxicilina|ampicilina|penicilina/.test(t)) classes.push('penicillin');
  if (/clavulanato|clavul/.test(t)) classes.push('penicillin_clavulanate');
  if (/fosfomicina|nitrofurantoina|ciprofloxacino|levofloxacino|azitromicina|cefalexina|clindamicina/.test(t)) {
    classes.push('antibiotic');
  }
  if (/nitrofurantoina/.test(t)) classes.push('nitrofuran');
  if (/fosfomicina/.test(t)) classes.push('antibiotic_misc');
  return classes;
}

function rxGetOptionMeds (option, groupLabel) {
  if (option._voExpanded && option.meds) return option.meds;

  let meds;

  if (option.noVoExpand && option.meds) return option.meds;

  if (option.meds) {
    meds = option.meds;
  } else {
    meds = [];
    let pendingGroup = null;

    option.items.forEach((raw, i) => {
      const isOu = /^OU\s/i.test(raw);
      const text = raw.replace(/^OU\s/i, '').trim();
      const isAlt = /\(alternativa\)/i.test(text);
      let exclusiveGroup = null;

      if (isOu || isAlt) {
        if (!pendingGroup) pendingGroup = `${option.id}-g${meds.length}`;
        exclusiveGroup = pendingGroup;
      } else {
        const next = option.items[i + 1];
        if (next && (/^OU\s/i.test(next) || /\(alternativa\)/i.test(next))) {
          pendingGroup = `${option.id}-g${i}`;
          exclusiveGroup = pendingGroup;
        } else {
          pendingGroup = null;
        }
      }

      meds.push({
        id: `${option.id}-m${i}`,
        text,
        classes: rxInferMedClasses(text),
        exclusiveGroup
      });
    });
  }

  if (typeof medVoExpandMeds === 'function') {
    return medVoExpandMeds(meds, {
      optionClasses: option.classes || [],
      label: [option.label, option.tier].filter(Boolean).join(' — '),
      idPrefix: option.id
    });
  }

  return meds;
}

function rxFindMed (condition, medId) {
  for (const group of condition.groups) {
    for (const option of group.options) {
      const med = rxGetOptionMeds(option, group.label).find(m => m.id === medId);
      if (med) return { group, option, med };
    }
  }
  return null;
}

function rxCollectSelectedMeds (condition, selectedMedIds) {
  const out = [];
  selectedMedIds.forEach(medId => {
    const found = rxFindMed(condition, medId);
    if (found) out.push(found);
  });
  return out;
}

function rxValidateMeds (selectedMedEntries) {
  const messages = [];
  if (selectedMedEntries.length < 2) return messages;

  const classCounts = {};
  selectedMedEntries.forEach(({ med }) => {
    (med.classes || []).forEach(cls => {
      classCounts[cls] = (classCounts[cls] || 0) + 1;
    });
  });

  RX_CLASS_RULES.forEach(rule => {
    const count = classCounts[rule.class] || 0;
    if (count > rule.max) {
      messages.push({ severity: rule.severity, text: rule.message });
    }
  });

  RX_PAIR_RULES.forEach(rule => {
    const hasAll = rule.classes.every(cls => (classCounts[cls] || 0) > 0);
    if (hasAll) messages.push({ severity: rule.severity, text: rule.message });
  });

  const seen = new Set();
  return messages.filter(m => {
    const key = m.severity + '|' + m.text;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rxExclusiveGroupsComplete (condition, selectedOptionIds, selectedMedIds) {
  const selections = rxCollectSelectedOptions(condition, selectedOptionIds);
  return selections.every(({ group, option }) => {
    const meds = rxGetOptionMeds(option, group.label);
    const groups = [...new Set(meds.filter(m => m.exclusiveGroup).map(m => m.exclusiveGroup))];
    return groups.every(g => meds.some(m => m.exclusiveGroup === g && selectedMedIds.has(m.id)));
  });
}

const RX_CLASS_RULES = [
  {
    class: 'antibiotic',
    max: 1,
    severity: 'warning',
    message: 'Vários antibióticos selecionados — confirme esquema combinado previsto na diretriz.'
  },
  {
    class: 'nsaid',
    max: 1,
    severity: 'error',
    message: 'Não prescreva dois AINEs (ex.: naproxeno + ibuprofeno). Escolha apenas um.'
  },
  {
    class: 'triptan',
    max: 1,
    severity: 'error',
    message: 'Use apenas um triptano por prescrição (sumatriptano ou zolmitriptano, não ambos).'
  },
  {
    class: 'opioid',
    max: 1,
    severity: 'error',
    message: 'Use apenas um opioide por prescrição.'
  },
  {
    class: 'penicillin',
    max: 1,
    severity: 'error',
    message: 'Não combine amoxicilina com amoxicilina-clavulanato (duplicidade de beta-lactâmico).'
  },
  {
    class: 'antiemetic',
    max: 1,
    severity: 'warning',
    message: 'Evite associar dois antieméticos na mesma prescrição.'
  },
  {
    class: 'muscle_relaxant',
    max: 1,
    severity: 'warning',
    message: 'Evite associar dois relaxantes musculares.'
  },
  {
    class: 'corticosteroid',
    max: 1,
    severity: 'error',
    message: 'Não combine dois corticoides sistêmicos na mesma prescrição.'
  },
  {
    class: 'calcium_channel_blocker',
    max: 1,
    severity: 'warning',
    message: 'Múltiplos bloqueadores de canal de cálcio — confirme indicação.'
  },
  {
    class: 'beta_blocker',
    max: 1,
    severity: 'warning',
    message: 'Múltiplos betabloqueadores — confirme indicação de profilaxia.'
  },
  {
    class: 'anticonvulsant',
    max: 1,
    severity: 'warning',
    message: 'Múltiplos anticonvulsivantes — prefira monoterapia na profilaxia.'
  },
  {
    class: 'tricyclic',
    max: 1,
    severity: 'warning',
    message: 'Evite associar dois antidepressivos tricíclicos.'
  },
  {
    class: 'analgesic_non_opioid',
    max: 1,
    severity: 'warning',
    message: 'Vários analgésicos não opioides selecionados — prefira um por vez (ex.: dipirona OU paracetamol).'
  }
];

const RX_PAIR_RULES = [
  {
    classes: ['penicillin', 'penicillin_clavulanate'],
    severity: 'error',
    message: 'Amoxicilina + amoxicilina-clavulanato — não prescreva ambos (clavulanato já contém amoxicilina).'
  },
  {
    classes: ['antibiotic_misc', 'nitrofuran'],
    severity: 'warning',
    message: 'Dois antibióticos para ITU — escolha monoterapia (fosfomicina OU nitrofurantoína).'
  },
  {
    classes: ['nsaid', 'opioid'],
    severity: 'warning',
    message: 'AINE + opioide — avaliar necessidade; reforçar proteção gástrica e hidratação.'
  }
];

function rxCollectSelectedOptions (condition, selectedIds) {
  const out = [];
  if (!condition) return out;
  condition.groups.forEach(group => {
    group.options.forEach(option => {
      if (selectedIds.has(option.id)) out.push({ group, option });
    });
  });
  return out;
}

function rxValidateSchemes (condition, selectedIds) {
  const messages = [];
  const selections = rxCollectSelectedOptions(condition, selectedIds);
  if (selections.length < 2) return messages;

  const classCounts = {};
  selections.forEach(({ option }) => {
    (option.classes || []).forEach(cls => {
      if (['penicillin', 'penicillin_clavulanate', 'antibiotic_misc', 'nitrofuran'].includes(cls)) {
        classCounts[cls] = (classCounts[cls] || 0) + 1;
      }
    });
  });

  if ((classCounts.penicillin || 0) >= 1 && (classCounts.penicillin_clavulanate || 0) >= 1) {
    messages.push({
      severity: 'error',
      text: 'Amoxicilina + amoxicilina-clavulanato — não prescreva ambos (clavulanato já contém amoxicilina).'
    });
  }
  if ((classCounts.penicillin || 0) > 1) {
    messages.push({
      severity: 'error',
      text: 'Não combine amoxicilina com amoxicilina-clavulanato (duplicidade de beta-lactâmico).'
    });
  }
  if ((classCounts.antibiotic_misc || 0) >= 1 && (classCounts.nitrofuran || 0) >= 1) {
    messages.push({
      severity: 'warning',
      text: 'Dois antibióticos para ITU — escolha monoterapia (fosfomicina OU nitrofurantoína).'
    });
  }

  return messages;
}

function rxValidateConditionMeds (condition, medEntries) {
  const messages = [];
  if (!condition || !medEntries.length) return messages;

  const id = condition.id || '';
  const arbovirusWarnIds = ['chikungunya', 'zika'];
  const hasNsaid = medEntries.some(({ med }) => (med.classes || []).includes('nsaid'));
  const hasAas = medEntries.some(({ med }) => /aas|aspirin|acetilsalicilico|acido acetilsalicilico/i.test(med.text || ''));

  if (/^dengue(-|$)/.test(id)) {
    if (hasNsaid || hasAas) {
      messages.push({
        severity: 'error',
        text: 'Dengue — AAS/AINE contraindicado (risco de sangramento). Use apenas paracetamol conforme protocolo MS.'
      });
    }
  } else if (arbovirusWarnIds.includes(id) && hasNsaid) {
    messages.push({
      severity: 'warning',
      text: 'Arbovirose — confirme exclusão de dengue antes de prescrever AINE. Nas primeiras 48 h, preferir paracetamol.'
    });
  }

  return messages;
}

function rxValidateSelection (condition, selectedIds) {
  return rxValidateSchemes(condition, selectedIds);
}

function rxHasValidationErrors (messages) {
  return messages.some(m => m.severity === 'error');
}

function rxMatchScore (cond, norm) {
  let score = 0;
  const aliases = cond.aliases || [];

  if (aliases.some(a => rxNormText(a) === norm)) score += 200;
  else if (aliases.some(a => norm.includes(rxNormText(a)) && rxNormText(a).length >= 5)) score += 90;
  else if (aliases.some(a => rxNormText(a).includes(norm) && norm.length >= 4)) score += 50;
  else if (norm.includes(rxNormText(cond.name))) score += 70;

  if (/dor de garganta|odinofagia|faringite|garganta inflamada/.test(norm)) {
    if (cond.groups.some(g => /sintomatic|suporte|viral/i.test(g.label))) score += 60;
    if (/dor de garganta|faringite/i.test(rxNormText(cond.name))) score += 40;
    const onlyAtb = cond.groups.length === 1 && /antibiot/i.test(cond.groups[0].label);
    if (onlyAtb) score -= 50;
  }

  if (/disuria|polaciuria|queima ao urinar/.test(norm) && !/cistite|itu/.test(norm)) {
    if (cond.groups.some(g => /suporte|sintomatic|medidas/i.test(g.label))) score += 40;
  }

  if (/dor lombar|lombalgia|ciatica/.test(norm)) {
    if (cond.id === 'lombalgia-ciatalgia') score += 50;
  }

  if (/cefaleia|dor de cabeca|enxaqueca/.test(norm)) {
    if (cond.id === 'cefaleias') score += 50;
  }

  if (/nausea|nauseas|vomito|vomitos|emese|enjoo|gastroenterite/.test(norm)) {
    if (cond.id === 'vomitos-agudos' || /vomito|nausea/.test(rxNormText(cond.name))) score += 55;
  }

  if (cond.source === 'complete') score += 15;
  return score;
}

function rxParseQueixaSegments (queixa) {
  if (!queixa || !queixa.trim()) return [];
  return queixa
    .split(/[,;\n]+|\s+\be\s+|\s+\/\s+|\s+\+\s+/i)
    .map(s => s.trim())
    .filter(s => s.length >= 3);
}

function rxMatchConditions (queixa) {
  const catalog = typeof rxGetCatalog === 'function' ? rxGetCatalog() : RX_CATALOG_MANUAL;
  const segments = rxParseQueixaSegments(queixa);
  const queries = segments.length ? segments : [queixa];
  const byId = new Map();

  queries.forEach(q => {
    const norm = rxNormText(q);
    if (!norm || norm.length < 3) return;
    catalog.forEach(cond => {
      const score = rxMatchScore(cond, norm);
      if (score >= 50) {
        const prev = byId.get(cond.id);
        if (!prev || score > prev.score) byId.set(cond.id, { cond, score });
      }
    });
  });

  return [...byId.values()]
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.cond);
}
