/* Flashcards Fase A — baralhos fixos (PS + emergência). Conteúdo educacional. */

const FLASHCARD_DECKS = [
  {
    id: 'sepse',
    name: 'Sepse e choque séptico',
    icon: '🦠',
    source: 'guia-emergencia',
    sourceLabel: 'Guia de emergência',
    desc: 'Reconhecimento, ressuscitação na 1ª hora e antibiótico precoce.',
    cards: [
      {
        front: 'Definição prática de sepse (Sepsis-3)',
        back: 'Disfunção orgânica potencialmente fatal causada por resposta desregulada à infecção — na prática: infecção suspeita/confirmada + aumento agudo de SOFA ≥ 2 (ou qSOFA ≥ 2 na triagem).'
      },
      {
        front: 'qSOFA — quais 3 critérios?',
        back: 'PAS ≤ 100 mmHg · FR ≥ 22 irpm · alteração do estado mental (Glasgow < 15). ≥ 2 pontos: alto risco; não substitui SOFA completo.'
      },
      {
        front: 'Primeira hora na sepse — 3 pilares',
        back: '1) Hemoculturas (antes do ATB se possível, sem atrasar antibiótico) · 2) Antibiótico de amplo espectro precoce · 3) Cristaloide 30 mL/kg se hipotensão ou lactato ≥ 4.'
      },
      {
        front: 'Meta de lactato na reavaliação',
        back: 'Dosar lactato inicial; repetir em 2–6 h. Queda de lactato indica resposta; lactato persistente elevado = reavaliar volume, foco e antibiótico.'
      },
      {
        front: 'Quando iniciar vasopressor na sepse?',
        back: 'Após ressuscitação volêmica adequada, se PAM < 65 mmHg persiste. 1ª linha: noradrenalina. Epinefrina ou vasopressina como 2ª linha conforme protocolo.'
      },
      {
        front: 'Culturas — o que coletar na suspeita de sepse?',
        back: 'Hemoculturas (2 pares, se possível de sítios distintos), urocultura se ITU, cultura de secreções conforme foco (pulmão, pele, abdome). Não atrasar ATB por cultura.'
      },
      {
        front: 'Choque séptico — definição resumida',
        back: 'Sepse + necessidade de vasopressor para PAM ≥ 65 mmHg + lactato > 2 mmol/L apesar de volume adequado.'
      },
      {
        front: 'Antibiótico na sepse — princípio de tempo',
        back: 'Cada hora de atraso aumenta mortalidade. Iniciar em até 1 h após reconhecimento. Escolher espectro conforme foco provável e risco de MRSA/gram-negativo resistente.'
      },
      {
        front: 'Sinais de foco abdominal na sepse',
        back: 'Dor, defesa, distensão, leucocitose com desvio, acidose — considerar imagem urgente e intervenção cirúrgica (controle de foco).'
      },
      {
        front: 'Cristaloide na sepse — qual e quanto?',
        back: 'Cristaloide balanceado ou SF 0,9% — 30 mL/kg em bolus na hipotensão ou lactato elevado; reavaliar perfusão (diurese, lactato, extremidades) antes de repetir.'
      }
    ]
  },
  {
    id: 'iam',
    name: 'IAM / SCA',
    icon: '❤️',
    source: 'guia-emergencia',
    sourceLabel: 'Guia de emergência',
    desc: 'Dor torácica, ECG, troponina e conduta inicial no PS.',
    cards: [
      {
        front: 'Tríade clássica do IAM — sintomas',
        back: 'Dor torácica opressiva > 20 min, irradiação (braço, mandíbula, dorso), sudorese, náusea, dispneia. Equivalentes: dispneia isolada, síncope, epigastralgia (idoso/diabético).'
      },
      {
        front: 'ECG na dor torácica — o que pedir primeiro?',
        back: 'ECG 12 derivações em até 10 min. STEMI: supra ST ≥ 1 mm em ≥ 2 derivações contíguas (ou novo BRE). NSTEMI/angina instável: alterações ST-T ou troponina elevada sem supra.'
      },
      {
        front: 'STEMI — conduta imediata no PS',
        back: 'AAS 300 mg mastigado + P2Y12 (clopidogrel/prasugrel/ticagrelor conforme protocolo) + anticoagulação · acionar hemodinâmica para angioplastia primária (meta porta-balão).'
      },
      {
        front: 'Troponina — como interpretar na urgência?',
        back: 'Elevação com curva (subida/queda) sugere necrose miocárdica. Troponina inicial normal não exclui SCA — repetir em 1–3 h se alta suspeita clínica/ECG.'
      },
      {
        front: 'O que evitar dar em suspeita de IAM sem confirmação?',
        back: 'Não administrar morfina de rotina (piora desfecho em alguns estudos); evitar nitrato se PAS < 90 ou uso recente de sildenafil; evitar betabloqueador na fase aguda com sinais de choque.'
      },
      {
        front: 'Angina instável — diferencial prático',
        back: 'Dor em repouso ou crescente, ECG com infradesnivelamento ST ou T invertida, troponina normal ou levemente elevada. Antiagregação + anticoagulação + estratificação de risco.'
      },
      {
        front: 'Diferenciais de dor torácica grave no PS',
        back: 'TEP, dissecção de aorta, pneumotórax, pericardite, esofagite/ruptura, musculoesquelética — ECG + troponina + imagem conforme suspeita.'
      },
      {
        front: 'Monitorização mínima no SCA',
        back: 'Oximetria, monitor cardíaco, acesso venoso, oxigênio só se SatO₂ < 90%, preparar desfibrilador, repetir ECG se piora da dor.'
      }
    ]
  },
  {
    id: 'avc',
    name: 'AVC isquêmico agudo',
    icon: '🧠',
    source: 'guia-emergencia',
    sourceLabel: 'Guia de emergência',
    desc: 'Janela terapêutica, NIHSS e contraindicações à trombólise.',
    cards: [
      {
        front: 'Tempo é cérebro — janela da trombólise IV',
        back: 'Alteplase IV até 4,5 h do início dos sintomas (critérios estritos após 3 h). Avaliar elegibilidade e excluir hemorragia com TC de crânio sem contraste antes.'
      },
      {
        front: 'TC de crânio na suspeita de AVC — quando?',
        back: 'Imediata, antes de trombólise ou anticoagulação. Objetivo: excluir hemorragia intracraniana e imitar AVC (tumor, hipoglicemia).'
      },
      {
        front: 'Hipoglicemia imita AVC — conduta',
        back: 'Glicemia capilar em todo déficit neurológico agudo. Se < 60 mg/dL: glicose EV/VO e reavaliar neurológico — déficit que reverte não é AVC.'
      },
      {
        front: 'NIHSS — para que serve?',
        back: 'Escala de gravidade do AVC (0–42). Quanto maior, maior déficit. Usada para elegibilidade à trombólise, prognóstico e comunicação com neurologia/UTI.'
      },
      {
        front: 'Contraindicação absoluta à trombólise — cite 3',
        back: 'Hemorragia intracraniana na TC · AVC ou TCE grave < 3 meses · cirurgia intracraniana/espinal recente · PA > 185/110 refratária · plaquetas < 100 mil (lista não exaustiva).'
      },
      {
        front: 'AVC hemorrágico — conduta inicial',
        back: 'Controle pressórico (PAS alvo conforme protocolo, em geral < 140–160), reversão de anticoagulação se em uso, neurocirurgia se hematoma cerebelar/grande ou hidrocefalia, UTI.'
      },
      {
        front: 'PA no AVC isquêmico agudo — alvo antes da trombólise',
        back: 'PAS ≤ 185 e PAD ≤ 110 mmHg para iniciar alteplase. Se acima: labetalol ou nicardipina EV até atingir meta.'
      },
      {
        front: 'Sinais de AVC no FAST',
        back: 'Face (assimetria ao sorrir) · Arms (queda de um braço) · Speech (fala arrastada) · Time (acionar urgência imediata).'
      }
    ]
  },
  {
    id: 'anafilaxia',
    name: 'Anafilaxia',
    icon: '⚠️',
    source: 'guia-emergencia',
    sourceLabel: 'Guia de emergência',
    desc: 'Reconhecimento e adrenalina IM — não atrasar.',
    cards: [
      {
        front: 'Critério clínico de anafilaxia (resumo)',
        back: 'Início agudo de comprometimento cutâneo/mucoso + (respiratório OU cardiovascular OU gastrointestinal grave) após exposição a alérgeno — ou hipotensão após exposição conhecida.'
      },
      {
        front: '1ª linha no tratamento da anafilaxia',
        back: 'Adrenalina IM na face ântero-lateral da coxa: 0,3–0,5 mg (0,3–0,5 mL de 1:1000) adulto; repetir a cada 5–15 min se persistência. Não substituir por anti-histamínico isolado.'
      },
      {
        front: 'Posição do paciente na anafilaxia',
        back: 'Decúbito dorsal com membros elevados se hipotenso. Evitar ortostatismo súbito (piora da hipotensão). Se vômito: posição lateral.'
      },
      {
        front: 'Adjuvantes após adrenalina',
        back: 'Oxigênio, cristaloide se hipotensão, beta-2 inalatório se broncoespasmo, anti-H1 (difenidramina) e corticoide (efeito tardio — não trata a fase aguda).'
      },
      {
        front: 'Observação mínima após anafilaxia',
        back: 'Geralmente 4–8 h (reação bifásica). Prescrever autoinjetor de adrenalina e plano escrito; encaminhar alergologia.'
      },
      {
        front: 'Erro comum fatal na anafilaxia',
        back: 'Atrasar adrenalina ou usar apenas anti-histamínico/corticoide. Via IM, não IV em bolus (risco arritmia) exceto em parada monitorada.'
      }
    ]
  },
  {
    id: 'dengue',
    name: 'Dengue no PS',
    icon: '🦟',
    source: 'pronto-socorro',
    sourceLabel: 'Prescrições PS',
    desc: 'Grupos de risco, sinais de alarme e hidratação.',
    cards: [
      {
        front: 'Sinais de alarme na dengue — cite 4',
        back: 'Dor abdominal intensa/contínua · vômitos persistentes · sangramento mucoso · letargia/irritabilidade · hepatomegalia dolorosa · hematócrito em ascensão com queda de plaquetas.'
      },
      {
        front: 'Grupos de risco para formas graves',
        back: 'Extremos de idade, gestantes, comorbidades (DM, DRC, asma), dengue prévia com outro sorotipo, período crítico (3º–7º dia da doença).'
      },
      {
        front: 'Hidratação na dengue sem alarme',
        back: 'Hidratação oral vigorosa (60–80 mL/kg/dia total, incluindo dieta). Orientar sinais de alarme e retorno se piora.'
      },
      {
        front: 'Dengue com sinais de alarme — conduta',
        back: 'Expansão volêmica com cristaloide monitorado, internação, hemograma seriado (hematócrito/plaquetas), evitar AINE e AAS (risco sangramento).'
      },
      {
        front: 'Analgésico seguro na dengue suspeita',
        back: 'Paracetamol. Evitar AINE e ácido acetilsalicílico até excluir dengue ou fase convalescente.'
      },
      {
        front: 'Quando suspeitar de choque na dengue?',
        back: 'Hipotensão, taquicardia desproporcional, extremidades frias, hematócrito em elevação com plaquetopenia — expansão guiada por protocolo e UTI.'
      },
      {
        front: 'Exames úteis na dengue',
        back: 'NS1/antígeno ou sorologia conforme dia da doença, hemograma (trombocitopenia, hemoconcentração), função hepática se formas graves.'
      },
      {
        front: 'Alta na dengue — orientação essencial',
        back: 'Retornar se dor abdominal forte, vômitos incoercíveis, sangramento, tontura ou redução de diurese. Período crítico: após defervescência da febre.'
      }
    ]
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia adquirida na comunidade',
    icon: '🫁',
    source: 'pronto-socorro',
    sourceLabel: 'Prescrições PS',
    desc: 'CURB-65, antibiótico ambulatorial vs internação.',
    cards: [
      {
        front: 'CURB-65 — componentes',
        back: 'Confusão · Ureia > 50 mg/dL · FR ≥ 30 · PA sistólica < 90 ou diastólica ≤ 60 · idade ≥ 65. Cada item = 1 ponto.'
      },
      {
        front: 'CURB-65 0–1 — conduta usual',
        back: 'Tratamento ambulatorial com antibiótico oral (ex.: amoxicilina ou amoxicilina-clavulanato conforme gravidade e comorbidades).'
      },
      {
        front: 'CURB-65 ≥ 3 — implicação',
        back: 'Alta mortalidade — considerar internação em UTI/enfermaria e antibiótico EV conforme protocolo institucional.'
      },
      {
        front: 'Antibiótico empírico ambulatorial (adulto saudável)',
        back: 'Amoxicilina 500 mg 8/8 h ou 1 g 12/12 h por 5–7 dias; se comorbidade ou uso recente de ATB: amoxicilina-clavulanato ou respiratório (quinolona/ macrolídeo conforme diretriz local).'
      },
      {
        front: 'Quando associar cobertura para atípicos?',
        back: 'Macrolídeo ou quinolona respiratória se suspeita de Legionella/Mycoplasma ou falha terapêutica; em internados: beta-lactâmico + macrolídeo ou beta-lactâmico + quinolona.'
      },
      {
        front: 'Critérios de gravidade clínica além do escore',
        back: 'SpO₂ < 92%, multilobar, derrame pleural, sepse, insuficiência respiratória, desidratação grave — internar independente do escore baixo.'
      },
      {
        front: 'Exames na PAC ambulatorial — sempre necessários?',
        back: 'RX tórax se diagnóstico incerto ou comorbidade; hemograma/PCR se internação ou dúvida. Nem todo PAC precisa de cultura de escarro na comunidade.'
      },
      {
        front: 'Seguimento após alta na PAC',
        back: 'Reavaliar em 48–72 h se não melhora; repetir imagem se piora ou falha em 72 h; considerar TB se sintomas prolongados.'
      }
    ]
  },
  {
    id: 'hipoglicemia',
    name: 'Hipoglicemia',
    icon: '🍬',
    source: 'pronto-socorro',
    sourceLabel: 'Prescrições PS',
    desc: 'Regra dos 15 g, glicose EV e causas reversíveis.',
    cards: [
      {
        front: 'Hipoglicemia — valor de corte usual',
        back: '< 70 mg/dL com sintomas (ou < 54 mg/dL mesmo assintomático em diabético). Corrigir e investigar causa.'
      },
      {
        front: 'Consciente e cooperativo — tratamento',
        back: '15 g de carboidrato de absorção rápida (suco, mel, glicose oral); repetir glicemia em 15 min; repetir dose se ainda < 70.'
      },
      {
        front: 'Rebaixado ou sem via oral — tratamento',
        back: 'Glicose EV 25 g (SG 50% 50 mL ou SG 10% 250 mL); repetir em 15 min. Se sem acesso: glucagon IM 1 mg (menos eficaz em hepatopata/desnutrido).'
      },
      {
        front: 'Após corrigir hipoglicemia — o que fazer?',
        back: 'Refeição/snack com carboidrato complexo + proteína se consciente; se em insulinoterapia: reduzir dose e investigar; observar 2–4 h se sulfonilureia (hipoglicemia recorrente).'
      },
      {
        front: 'Hipoglicemia por sulfonilureia — particularidade',
        back: 'Efeito prolongado — pode precisar de glicose EV em infusão e observação prolongada; considerar octreotide em casos graves.'
      },
      {
        front: 'Hipoglicemia em jejum prolongado / etilista',
        back: 'Pensar em depleção de glicogênio, insuficiência hepática, sepse oculta — tratar causa além da correção da glicemia.'
      }
    ]
  },
  {
    id: 'crise-hipertensiva',
    name: 'Crise hipertensiva',
    icon: '📈',
    source: 'pronto-socorro',
    sourceLabel: 'Prescrições PS',
    desc: 'Emergência vs urgência e alvo de PA.',
    cards: [
      {
        front: 'Emergência hipertensiva vs urgência',
        back: 'Emergência: PA muito elevada + lesão de órgão-alvo aguda (AVC, SCA, edema agudo de pulmão, dissecção de aorta, eclâmpsia). Urgência: PA elevada sem lesão aguda — reduzir gradualmente.'
      },
      {
        front: 'Dissecção de aorta — alvo de PA e FC',
        back: 'PAS < 120 mmHg e FC < 60 em minutos — betabloqueador IV antes ou com vasodilatador (evitar isolado que aumenta dP/dt). Cirurgia/endovascular urgente.'
      },
      {
        front: 'Edema agudo de pulmão hipertensivo',
        back: 'Nitroglicerina EV + diurético + O₂; não usar betabloqueador. Considerar VMNI. Tratar precipitante (SCA, arritmia).'
      },
      {
        front: 'Urgência hipertensiva — como reduzir PA?',
        back: 'Oral (captopril, clonidina, anlodipino) com reavaliação em horas — evitar queda abrupta (hipoperfusão cerebral, renal, coronariana).'
      },
      {
        front: 'PA assintomática muito elevada no PS',
        back: 'Não é emergência por si só — ajustar medicação ambulatorial, investigar adesão e causas secundárias; evitar “hipertensol” EV de rotina.'
      },
      {
        front: 'Lesões de órgão-alvo a investigar na emergência',
        back: 'ECG, troponina, creatinina, urina, fundo de olho, TC crânio/tórax conforme clínica; exame neurológico completo.'
      }
    ]
  },
  {
    id: 'via-aerea',
    name: 'Via aérea e intubação',
    icon: '🫁',
    source: 'guia-emergencia',
    sourceLabel: 'Guia de emergência',
    desc: 'Avaliação, pré-oxigenação e falha na laringoscopia.',
    cards: [
      {
        front: 'Avaliação rápida da via aérea — 3 perguntas',
        back: 'Patente agora? Vai falhar? É difícil? (LEMON: Look, Evaluate, Mallampati, Obstruction, Neck mobility).'
      },
      {
        front: 'Pré-oxigenação antes da SRI',
        back: 'O₂ 100% 3–5 min com máscara bem ajustada ou 8 respirações profundas em fluxo alto — aumenta reserva de O₂ e tempo seguro de apneia.'
      },
      {
        front: 'Indução em sequência rápida — componentes',
        back: 'Pré-oxigenação → pré-medicação opcional → indução (ex.: etomidato, cetamina) → bloqueador neuromuscular (succinilcolina/rocurônio) → intubação — sem ventilação entre indução e tubo (se possível).'
      },
      {
        front: 'Cetamina na intubação — vantagem',
        back: 'Agente dissociativo com efeito simpaticomimético — útil em choque/asma; broncodilatação. Cuidado em dissecção de aorta e hipertensão grave não controlada.'
      },
      {
        front: 'Falha na intubação — plano B imediato',
        back: 'Máscara laríngea ou vídeo-laringoscópio se disponível; não insistir cegamente. Cricotireoidostomia se “cannot intubate, cannot oxygenate”.'
      },
      {
        front: 'Confirmação do tubo endotraqueal',
        back: 'Capnografia (padrão-ouro) + ausculta bilateral + expansão torácica + RX tórax após estabilização.'
      },
      {
        front: 'Bougie — quando usar?',
        back: 'Quando glote difícil de visualizar mas estruturas suspeitas presentes — guia rígido para passar tubo sob visão parcial.'
      },
      {
        front: 'Aspiração na intubação',
        back: 'Aspirador funcionando, sonda rígida à mão; aspirar se secreção/vômito antes da laringoscopia; considerar pressão cricoide se risco de aspiração (controverso).'
      }
    ]
  },
  {
    id: 'gasometria',
    name: 'Gasometria arterial',
    icon: '🧪',
    source: 'interpretacao-exame',
    sourceLabel: 'Interpretação do exame',
    desc: 'pH, PaCO₂, HCO₃ e compensação em minutos.',
    cards: [
      {
        front: 'Acidose respiratória — definição',
        back: 'pH < 7,35 com PaCO₂ elevada. Causas: hipoventilação (DPOC, depressão de SNC, fadiga muscular, obstrução de via aérea).'
      },
      {
        front: 'Alcalose respiratória — definição',
        back: 'pH > 7,45 com PaCO₂ baixa. Causas: hiperventilação (ansiedade, sepse inicial, altitude, salicilatos, dor).'
      },
      {
        front: 'Acidose metabólica — ânion gap elevado — mnemônico',
        back: 'MUDPILES: Metanol, Uremia, DKA, Paraldehyde/Propilenoglicol, Isoniazida/Iron, Lactic acidosis, Ethylene glycol, Salicylates (variações existem).'
      },
      {
        front: 'Acidose metabólica — ânion gap normal (hiperclorêmica)',
        back: 'Perda de bicarbonato: diarreia, acidose tubular renal, ureterossigmoidostomia, acetazolamida. Compensação respiratória com PaCO₂ ↓.'
      },
      {
        front: 'Compensação na acidose metabólica',
        back: 'PaCO₂ esperada ≈ 1,5 × HCO₃ + 8 (± 2). Se PaCO₂ maior que esperado: acidose respiratória associada; se menor: alcalose respiratória associada.'
      },
      {
        front: 'Lactato elevado — causas no plantão',
        back: 'Sepse/choque, hipoperfusão, metformina, convulsão, exercício extremo, linha arterial mal puncionada (se sangue venoso misturado).'
      },
      {
        front: 'PaO₂ e FiO₂ — relação rápida',
        back: 'PaO₂/FiO₂ (P/F) < 300: SDRA leve; < 200 moderada; < 100 grave. Sempre correlacionar com SatO₂ e clínica.'
      },
      {
        front: 'Amostra de gasometria — cuidados',
        back: 'Sem bolhas, heparina mínima, analisar em minutos; anotar FiO₂ e modo ventilatório; comparar com gasometria anterior.'
      }
    ]
  }
];
