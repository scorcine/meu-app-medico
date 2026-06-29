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
        front: 'Paciente 68 a, febre 39,2 °C, PA 88×52, FR 28, confuso. Lactato 4,8. Infecção pulmonar provável. O que fazer nos primeiros 60 min?',
        back: 'Reconhecer choque séptico · coletar hemoculturas (sem atrasar ATB) · antibiótico EV de amplo espectro na 1ª hora · cristaloide 30 mL/kg em bolus · noradrenalina se PAM < 65 após volume.'
      },
      {
        front: 'Na triagem: PAS 96, FR 24, Glasgow 14. Sem lactato ainda. qSOFA = ? Isso muda sua conduta sozinho?',
        back: 'qSOFA = 2 (PAS ≤ 100 + FR ≥ 22). Alerta alto risco, mas não diagnostica sepse nem substitui SOFA/lactato — acelerar avaliação, culturas, ATB e volume conforme suspeita clínica.'
      },
      {
        front: 'Hemocultura positiva ainda não saiu, mas sepse grave evidente. Você espera o resultado para escolher o antibiótico?',
        back: 'Não. ATB empírico imediato conforme foco (pulmonar, urinário, abdominal, pele) e fatores de risco (MRSA, Pseudomonas, imunossupressão). Ajustar quando cultura/sensibilidade retornarem.'
      },
      {
        front: 'Após 2 L de cristaloide, PA 78×42, lactato 5,2, diurese 10 mL/h. Próximo passo?',
        back: 'Iniciar noradrenalina para PAM ≥ 65 mmHg (não insistir em volume indefinidamente). Reavaliar foco (drenagem, cirurgia), repetir lactato em 2–6 h, considerar UTI.'
      },
      {
        front: 'Sepse com foco urinário: qual esquema empírico em adulto sem alergia e sem risco de MRSA?',
        back: 'Ceftriaxona 1–2 g EV 24/24 h (ou equivalente conforme protocolo local). Associar volume e monitorar resposta em 1–3 h. Ajustar se falha ou resistência local conhecida.'
      },
      {
        front: 'Lactato caiu de 5,8 para 3,1 em 4 h, mas PA ainda em noradrenalina baixa dose. Alta ou mantém internado?',
        back: 'Manter monitorado — lactato em queda é bom sinal, mas ainda há disfunção hemodinâmica. Só alta após estabilidade hemodinâmica sem vasopressor, foco controlado e critérios institucionais.'
      },
      {
        front: 'Idoso com sepse abdominal: dor em FID, defesa, leucócitos 22 mil. ATB já iniciado. O que não pode faltar?',
        back: 'Controle de foco — imagem urgente (TC abdome) e avaliação cirúrgica (apendicite perfurada, colite, abscesso). Antibiótico sem drenagem/cirurgia falha em foco cirúrgico.'
      },
      {
        front: 'Qual a diferença prática entre sepse e choque séptico no plantão?',
        back: 'Sepse = infecção + disfunção orgânica (SOFA ↑). Choque séptico = sepse + vasopressor para PAM ≥ 65 e/ou lactato > 2 apesar de volume adequado.'
      },
      {
        front: 'Paciente em uso de betabloqueador chega hipotenso na sepse. A noradrenalina ainda é 1ª linha?',
        back: 'Sim — noradrenalina permanece 1ª escolha. Betabloqueador pode mascarar taquicardia compensatória; avaliar volume, foco e considerar vasopressina/epinefrina em choque refratário conforme protocolo.'
      },
      {
        front: 'Cristaloide na 1ª hora: SF 0,9% ou balanceado? Quanto exatamente para um homem 70 kg com PA 85×50?',
        back: '≈ 2,1 L (30 mL × 70 kg) em bolus, reavaliando perfusão entre alíquotas. Balanceado ou SF conforme protocolo; evitar volume excessivo sem resposta hemodinâmica.'
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
        front: 'Homem 58 a, dor retroesternal há 40 min, sudorese, irradia para mandíbula. ECG: supra ST 3 mm em V2–V4. Conduta nos próximos 10 min?',
        back: 'STEMI anterior — AAS 300 mg VO + P2Y12 (ticagrelor/prasugrel/clopidogrel conforme protocolo) + anticoagulação · acionar hemodinâmica para angioplastia primária · monitor, acesso venoso, evitar nitrato se PAS < 90.'
      },
      {
        front: 'Dor torácica típica, troponina 45 ng/L (normal < 14), ECG sem supra. O paciente pode ir para casa?',
        back: 'Não com segurança — suspeita de NSTEMI/angina instável. Repetir troponina em 1–3 h, observação, antiagregação + anticoagulação conforme estratificação (GRACE/HEART), repetir ECG se dor persistir.'
      },
      {
        front: 'Diabético 72 a só com dispneia e náusea, sem dor torácica. ECG: infradesnivelamento ST em DII, DIII, aVF. O que pensar?',
        back: 'Equivalente isquêmico — IAM inferior/NSTEMI até prova contrária. Troponina seriada, monitor, tratar como SCA; não atribuir só a “gastrite” ou “IVAS”.'
      },
      {
        front: 'STEMI: pode dar morfina 5 mg EV de rotina para a dor?',
        back: 'Evitar rotina — analgesia se dor intensa, mas morfina não é mais recomendada de forma sistemática (piora desfecho em alguns estudos). Priorizar reperfusão e antiagregação.'
      },
      {
        front: 'Paciente com dor torácica tomou sildenafil há 18 h. PA 100×60, ECG com supra ST. Pode usar nitroglicerina?',
        back: 'Evitar nitratos com uso recente de inibidor de PDE-5 (risco hipotensão grave). Foco em reperfusão coronariana; controle de dor com alternativas não nitratadas.'
      },
      {
        front: 'Dor torácica + desvio de traqueia + MV abolido à direita + timpanismo. Troponina normal. Próximo passo?',
        back: 'Pneumotórax hipertensivo até prova contrária — descompressão imediata com agulha/jelco 2º EIC linha hemiclavicular, depois dreno. Não esperar RX se clínica clássica.'
      },
      {
        front: 'Dor torácica “em rasgão” para dorso, PA 190×110, pulso radial ↓ vs femoral. Suspeita?',
        back: 'Dissecção aguda de aorta — TC angio de aorta, betabloqueador IV (FC < 60, PAS < 120), não dar apenas AAS sem excluir dissecção (controverso se SCA concomitante).'
      },
      {
        front: 'Angina instável: troponina negativa, infradesnivelamento 1 mm em V4–V6. Interna ou observa 6 h?',
        back: 'Internar ou unidade de observação com protocolo SCA — antiagregação dupla + anticoagulação, estratificação de risco, cateterismo conforme gravidade; alta precoce é arriscada.'
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
        front: 'Mulher 64 a, hemiparesia direita e afasia iniciadas há 2 h 15 min. Glicemia 58 mg/dL. Conduta imediata?',
        back: 'Corrigir hipoglicemia primeiro (glicose EV/VO) e reexaminar — déficit que reverte não é AVC. Se persistir após normoglicemia: TC crânio urgente e avaliar trombólise (janela < 4,5 h).'
      },
      {
        front: 'Déficit neurológico há 3 h 40 min, NIHSS 14, TC sem sangramento, PA 198×112. Pode trombolisar?',
        back: 'PA acima do limite — tratar com labetalol/nicardipina EV até PAS ≤ 185 e PAD ≤ 110, depois reavaliar elegibilidade para alteplase (ainda dentro de 4,5 h se critérios ok).'
      },
      {
        front: 'AVC há 5 h, TC normal, NIHSS 8. Paciente pede “trombólise”. Você faz?',
        back: 'Fora da janela de 4,5 h para alteplase IV (salvo protocolo estendido institucional). Avaliar trombectomia se oclusão de grande vaso e janela apropriada; internar em unidade de AVC.'
      },
      {
        front: 'TCE leve há 2 semanas, agora hemiplegia esquerda súbita. TC sem sangramento. Trombólise?',
        back: 'TCE significativo < 3 meses é contraindicação relativa/absoluta à trombólise — discutir com neurologia; considerar trombectomia e causas alternativas (embolia, hemorragia incipiente).'
      },
      {
        front: 'Plaquetas 85 mil, AVC isquêmico há 90 min. Automático contraindicação?',
        back: 'Sim — plaquetas < 100 000/mm³ contraindicam trombólise IV. Avaliar trombectomia mecânica e reversão de causa (antiplaquetas, hepatopatia).'
      },
      {
        front: 'TC mostra hematoma cerebelar 3,5 cm, vômitos, rebaixamento. Conduta?',
        back: 'AVC hemorrágico com risco de herniação — neurocirurgia urgente (descompressão), UTI, controle pressórico, reversão de anticoagulação se aplicável. Não trombolisar.'
      },
      {
        front: 'FAST positivo na ambulância. No PS, sintomas melhoraram completamente em 20 min. Alta?',
        back: 'AIT se duração < 24 h e sem déficit residual — não dar alta sem investigação: neuroimagem, Doppler carotídeo, ECG (FA), antiagregação e estatina conforme protocolo; risco alto de AVC em 48 h.'
      },
      {
        front: 'Paciente em warfarina (RNI 2,8) com AVC isquêmico há 2 h. O que checar antes da trombólise?',
        back: 'RNI > 1,7 contraindica alteplase IV — avaliar reversão se hemorragia, trombectomia mecânica, ou aguardar conforme neurologia; não trombolisar com anticoagulação terapêutica inadequada.'
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
        front: 'Após amendoim: urticária, broncoespasmo e PA 80×50 em 10 min. Primeira droga e via?',
        back: 'Adrenalina IM 0,3–0,5 mg (0,3–0,5 mL de 1:1000) na face ântero-lateral da coxa — imediato. Depois: decúbito, O₂, cristaloide, beta-2 inalatório; anti-H1 e corticoide são adjuvantes.'
      },
      {
        front: 'Urticária intensa pós-antibiótico, PA 120×80, sem dispneia nem estridor. É anafilaxia? Trata com adrenalina?',
        back: 'Anafilaxia cutânea isolada sem comprometimento respiratório/cardiovascular — anti-H1 + observação; adrenalina IM se progressão ou fatores de risco. Se só urticária leve: anti-histamínico e vigilância.'
      },
      {
        front: 'Após adrenalina IM, PA normalizou, mas broncoespasmo persiste. Próximo passo?',
        back: 'Salbutamol inalatório repetido + oxigênio; repetir adrenalina IM em 5–15 min se broncoespasmo grave ou hipotensão recorrente. Corticoide não substitui broncodilatador na fase aguda.'
      },
      {
        front: 'Paciente anafilático melhorou em 1 h. Pode alta após 2 h de observação?',
        back: 'Risco de reação bifásica — observar 4–8 h (mais se grave ou broncoespasmo). Prescrever autoinjetor de adrenalina, plano escrito, encaminhar alergologia; orientar evitar alérgeno.'
      },
      {
        front: 'Enfermeiro sugere adrenalina IV em bolus porque “é mais rápida”. Você concorda?',
        back: 'Não em bolus não monitorado — risco de arritmia/parada. Via IM é 1ª linha na anafilaxia. IV só em ambiente monitorado com infusão titulada em casos refratários/selecionados.'
      },
      {
        front: 'Anafilaxia com vômitos ativos e PA 90×60. Melhor posição?',
        back: 'Decúbito dorsal com membros elevados (evitar sentar de repente — “síndrome do ventrículo vazio”). Se vômito: posição lateral; não deixar ortostático.'
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
        front: 'Febre há 4 dias, mialgia, plaquetas 98 mil, sem dor abdominal. Dia 5 da doença amanhã. O que orientar hoje?',
        back: 'Ainda não está no pico do período crítico (após defervescência) — hidratação oral 60–80 mL/kg/dia, paracetamol, sinais de alarme por escrito, retorno se dor abdominal, vômitos ou sangramento.'
      },
      {
        front: 'Dengue dia 6, afebril há 12 h, dor abdominal intensa, vômitos, hematócrito subiu 12% em 24 h. Conduta?',
        back: 'Sinais de alarme + hemoconcentração — internar, expansão com cristaloide monitorado, hemograma seriado, evitar AINE/AAS, vigilância de choque (extremidades frias, taquicardia, hipotensão).'
      },
      {
        front: 'Gestante 24 sem, dengue confirmada, estável. Ibuprofeno para dor?',
        back: 'Não — evitar AINE (risco sangramento). Paracetamol com cautela. Gestante = grupo de risco — observação mais estreita, monitorização fetal conforme protocolo, internar se alarme.'
      },
      {
        front: 'Paciente pede dipirona + diclofenaco para febre na suspeita de dengue. Sua prescrição?',
        back: 'Paracetamol apenas — contraindicar AINE e AAS até fase convalescente/exclusão de dengue. Orientar sinais de alarme.'
      },
      {
        front: 'Choque da dengue: PA 85×50, FC 130, enchimento capilar 4 s, hematócrito 52%. Bolus de quanto?',
        back: 'Expansão com cristaloide 10–20 mL/kg em bolus monitorado (protocolo MS/institucional), reavaliar a cada 15–30 min; se não responder: UTI, vasopressor conforme necessidade, evitar volume excessivo sem monitorização.'
      },
      {
        front: 'Criança 8 a com dengue — diferença prática no manejo vs adulto?',
        back: 'Mesmos sinais de alarme, mas criança desidrata mais rápido — hidratação oral supervisionada ou EV se vômitos; peso para cálculo de volume; vigilância estreita no período crítico.'
      },
      {
        front: 'Plaquetas 45 mil, sem sangramento, estável, dia 7. Precisa de transfusão de plaqueta?',
        back: 'Não de rotina — transfusão se sangramento ativo significativo ou procedimento invasivo de alto risco, não só pelo número. Monitorar tendência e clínica.'
      },
      {
        front: 'Alta do dengue sem alarme: qual frase o paciente PRECISA levar escrita?',
        back: '“Volte se dor abdominal forte, vômitos persistentes, sangramento (gengiva, nariz), tontura, fraqueza extrema ou não urinar” — piora costuma ser após a febre baixar (dias 3–7).'
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
        front: 'Homem 45 a, febre, tosse, estertores em base direita, sem comorbidades. SpO₂ 96%. CURB-65 = 0. Antibiótico?',
        back: 'Amoxicilina 500 mg 8/8 h ou 1 g 12/12 h por 5–7 dias VO — tratamento ambulatorial. RX tórax se dúvida diagnóstica; retorno se piora em 48–72 h.'
      },
      {
        front: 'Idosa 78 a, confusa, ureia 62, FR 32, PAS 88×54. Qual CURB-65 e onde tratar?',
        back: 'CURB-65 = 5 — mortalidade alta. Internar (preferencialmente UTI/enfermaria monitorada), oxigênio, ATB EV (ex.: ceftriaxona + macrolídeo ou quinolona respiratória conforme diretriz local).'
      },
      {
        front: 'PAC tratada com amoxicilina há 72 h, ainda febril 38,5 °C, tosse pior. Troca antibiótico?',
        back: 'Falha terapêutica — reavaliar diagnóstico (abscesso, TEP, TB), complicação (derrame parapneumônico), resistência; ampliar espectro (ex.: amoxi-clav ou respiratório) e considerar imagem.'
      },
      {
        front: 'Esposa com Legionella: marido com PAC leve. Precisa cobrir atípico no marido?',
        back: 'Contato não muda ATB de rotina isoladamente, mas se suspeita de Legionella (diarreia, hiponatremia, infiltrado) — macrolídeo ou quinolona respiratória.'
      },
      {
        front: 'DPOC + infiltrado lobar, SpO₂ 88% em ar ambiente. CURB-65 = 1. Pode tratar em casa?',
        back: 'Não — hipoxemia significativa e comorbidade grave indicam internação apesar de escore baixo. O₂, ATB EV/VO conforme gravidade, broncodilatador, reavaliar VMNI se fadiga.'
      },
      {
        front: 'Tosse 3 semanas, febre baixa, perda de peso, RX com infiltrado apical cavitação. PAC comum?',
        back: 'Pensar em tuberculose — isolamento respiratório, PCR/BK e cultura de escarro, notificação; não rotular só como PAC e alta com amoxicilina.'
      },
      {
        front: 'Internado com PAC: beta-lactâmico EV sozinho basta?',
        back: 'Forma grave/internado: beta-lactâmico + macrolídeo OU beta-lactâmico + quinolona respiratória (cobertura atípica + pneumococo). Ajustar ao risco de Pseudomonas se DPOC grave/aspiração.'
      },
      {
        front: 'CURB-65 = 2 em mulher 67 a, SpO₂ 94%, estável. Ambulatorial ou internação?',
        back: 'Zona cinza — CURB-65 2: considerar internação curta ou observação 24 h conforme suporte social, comorbidades, saturação e tolerância oral; se dúvida, internar.'
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
        front: 'Diabético consciente, tremores, glicemia 54 mg/dL. Dose e reavaliação?',
        back: '15 g carboidrato rápido (suco 200 mL, mel 1 colher, 3–4 pastilhas glicose) · repetir glicemia em 15 min · repetir 15 g se ainda < 70 · após normalizar: lanche com proteína/complexo.'
      },
      {
        front: 'Glicemia 38 mg/dL, rebaixado, sem acesso venoso ainda. O que fazer em 30 segundos?',
        back: 'Glucagon IM 1 mg (se disponível) OU glicose oral se via segura · obter acesso e SG 50% 50 mL (25 g) EV · monitor contínuo — glucagon falha em hepatopata/desnutrido.'
      },
      {
        front: 'Corrigiu para 120 mg/dL com SG 50%. Diabético em glibenclamida. Pode alta imediata?',
        back: 'Não — sulfonilureia prolonga hipoglicemia. Observar 4–24 h, glicemia seriada, refeição; considerar octreotide se recorrência; ajustar dose/suspender sulfonilureia.'
      },
      {
        front: 'Hipoglicemia recorrente em etilista sem comer há 2 dias. Só dar açúcar resolve?',
        back: 'Não — tratar causa: tiamina antes de glicose se suspeita de Wernicke, alimentação, investigar sepse oculta/hepatopatia/insuficiência adrenal; internar se recorrente ou grave.'
      },
      {
        front: 'Enfermeiro mede 48 mg/dL em paciente assintomático em jejum para cirurgia. Conduta?',
        back: 'Em diabético: tratar se < 70 ou sintomático; 15 g VO se consciente ou glicose EV se NPO. Cancelar/adia cirurgia se hipoglicemia sintomática grave — investigar causa e ajuste de insulina.'
      },
      {
        front: 'Insulina noturna excessiva: glicemia 52 às 3h, 180 no café. Qual o problema?',
        back: 'Hipoglicemia noturna com rebote (Somogyi) ou excesso de insulina basal — reduzir dose noturna, revisar esquema, CGM/glicemia 3h se recorrente; educar sobre sintomas noturnos.'
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
        front: 'PA 240×130, cefaleia, mas TC crânio normal, fundo sem papiledema, creatinina normal. Emergência hipertensiva?',
        back: 'Provável urgência hipertensiva (PA elevada sem lesão aguda) — reduzir gradualmente com oral (captopril, anlodipino) em 24–48 h; não precisa nitroprussiato de rotina.'
      },
      {
        front: 'Dor torácica + PA 210×120 + alargamento de mediastino no RX. Alvo de PA e FC?',
        back: 'Dissecção de aorta suspeita — betabloqueador IV primeiro (FC < 60), PAS < 120 em minutos; vasodilatador só após betabloqueio; cirurgia/endovascular urgente; TC angio confirmatória.'
      },
      {
        front: 'PA 190×110, edema agudo de pulmão, crepitações bilaterais, SpO₂ 86%. Droga EV de escolha?',
        back: 'Nitroglicerina EV titulada + furosemida + O₂/VMNI — não betabloqueador na fase aguda com congestão. Tratar precipitante (SCA, arritmia).'
      },
      {
        front: 'Gestante 36 sem, PA 170×110, proteinúria +++, reflexos exaltados, cefaleia. Diagnóstico e conduta?',
        back: 'Eclâmpsia pré-iminente/eclâmpsia — sulfato de magnésio, anti-hipertensivo (hidralazina/labetalol), parto definitivo conforme obstetrícia; não é “só urgência hipertensiva”.'
      },
      {
        front: 'PA 260×140 assintomático, exame neurológico normal. Bolus de hidralazina EV e alta?',
        back: 'Evitar queda abrupta — risco de AVC isquêmico/hipoperfusão. Ajuste oral ambulatorial, investigar adesão e causa secundária; observação com redução gradual se necessário.'
      },
      {
        front: 'AVC isquêmico agudo, PA 210×115, candidato a trombólise. Meta pressórica antes da alteplase?',
        back: 'PAS ≤ 185 e PAD ≤ 110 mmHg — labetalol 10–20 mg EV ou nicardipina infusão até meta, depois trombolisar se dentro da janela e sem outras contraindicações.'
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
        front: 'Rebaixamento GCS 6, vomitou no resgate. SpO₂ 82% com máscara. Primeiro passo antes da laringoscopia?',
        back: 'Pré-oxigenação 100% + aspiração de via aérea (sonda rígida) · posicionamento (elevação occipital, ramp) · preparar sucção e via difícil — sequência rápida com assistente; considerar pressão cricoide se aspiração.'
      },
      {
        front: 'Mallampati IV, obesidade, ronco. Indução com propofol 2 mg/kg em bolus. Risco?',
        back: 'Hipotensão/apneia prolongada em via difícil — reduzir dose em choque/obeso, pré-oxigenar 3–5 min, ter vídeo-laringoscópio/bougie prontos, indutor hemodinamicamente estável (etomidato/cetamina) se instável.'
      },
      {
        front: 'Após rocurônio, não visualiza cordas em 2 tentativas, SatO₂ cai para 88%. Próximo passo?',
        back: 'Parar tentativas cegas — ventilar com máscara + supraglótica (LMA) · 100% O₂ · chamar ajuda · vídeo-laringoscopia ou bougie · se falha: cricotireoidostomia (CICO).'
      },
      {
        front: 'Choque séptico precisa intubar. Propofol ou etomidato para indução?',
        back: 'Etomidato ou cetamina — menos hipotensão que propofol em choque. Dose reduzida de indutor + rocurônio; vasopressor preparado; pré-oxigenação máxima.'
      },
      {
        front: 'Asma grave em broncoespasmo, SatO₂ 89%. Cetamina na SRI é boa escolha?',
        back: 'Sim — broncodilatação e efeito simpaticomimético útil; associar beta-2 inalatório contínuo. Evitar histórico de hipertensão grave não controlada como única contraindicação relativa.'
      },
      {
        front: 'Tubo passou, ausculta epigástrica, sem capnografia disponível. Confirma intubação?',
        back: 'Não confiar só na ausculta — capnografia é padrão-ouro. Sem CO₂ expirado: retirar e reventilar (provável esofágico). RX tórax após estabilização.'
      },
      {
        front: 'Pré-oxigenação: 2 min com máscara frouxa vs 3 min bem selada. Qual muda o tempo de apneia segura?',
        back: 'Máscara bem ajustada 3–5 min (ou 8 respirações profundas com fluxo alto) — denitrogenação aumenta reserva de O₂ e tolerância à apneia na SRI.'
      },
      {
        front: 'Glote só parcialmente visível (Cormack 2b). Intubar sem bougie?',
        back: 'Usar bougie — aumenta taxa de sucesso com visão parcial de epiglote/arytenoides; avançar tubo 2–3 cm após confirmação de “cliques” traqueais.'
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
        front: 'pH 7,22 · PaCO₂ 55 · HCO₃ 22. Qual distúrbio primário?',
        back: 'Acidose respiratória — pH baixo com hipercapnia; HCO₃ ainda pouco alterado (agudo). Causas: DPOC descompensado, depressão de SNC, fadiga muscular, obstrução de via aérea.'
      },
      {
        front: 'pH 7,48 · PaCO₂ 28 · HCO₃ 20. Interpretação em paciente com sepse e taquipneia?',
        back: 'Alcalose respiratória aguda — hiperventilação (dor, sepse inicial, ansiedade). Investigar também lactato e causa da taquipneia; não é “só gasometria bonita”.'
      },
      {
        front: 'pH 7,25 · HCO₃ 10 · PaCO₂ 22 · Na 140 · Cl 105. Ânion gap?',
        back: 'AG = 140 − (105 + 10) = 25 (elevado) — acidose metabólica com AG alto: pensar lactato (sepse), cetoacidose, intoxicação (metanol, etilenoglicol), uremia.'
      },
      {
        front: 'Acidose metabólica: HCO₃ 14, PaCO₂ 30. PaCO₂ esperada pela compensação (±2)?',
        back: 'PaCO₂ ≈ 1,5 × 14 + 8 = 29 (± 2). PaCO₂ 30 = compensação adequada. Se PaCO₂ 40: acidose respiratória associada; se 22: alcalose respiratória associada.'
      },
      {
        front: 'Diabético: pH 7,05, HCO₃ 6, glicemia 480, AG alto, cetonas +. Bolus de bicarbonato de rotina?',
        back: 'Não de rotina — tratar com fluido + insulina EV é o pilar. Bicarbonato só se pH < 6,9 com instabilidade hemodinâmica grave (controverso). Monitorar K⁺ (cai com insulina).'
      },
      {
        front: 'Diarreia profusa: pH 7,30, HCO₃ 16, AG normal 12, Cl 112. Mecanismo?',
        back: 'Acidose metabólica hiperclorêmica — perda de bicarbonato (diarreia). Compensação com PaCO₂ reduzida.'
      },
      {
        front: 'PaO₂ 58 · FiO₂ 0,40 (cateter). Índice P/F e gravidade?',
        back: 'FiO₂ 0,40 → PaO₂/FiO₂ = 58/0,40 = 145 — SDRA leve/moderada (corte < 300). Correlacionar com imagem e necessidade de O₂ suplementar/VM.'
      },
      {
        front: 'Gasometria “lactato 8,2” em amostra mal puncionada, sem acidose, paciente estável. Conduta?',
        back: 'Repetir amostra arterial bem puncionada — lactato falsamente elevado por estase/venosa; se sepse suspeita, lactato sérico em amostra adequada + clínica de perfusão.'
      }
    ]
  }
];
