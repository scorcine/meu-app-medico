/* Sepse e choque séptico — conteúdo educacional. Não substitui protocolo institucional. */

var FLASHCARD_DECK_SEPSE = {
  id: 'sepse',
  name: 'Sepse e choque séptico',
  icon: '🦠',
  source: 'guia-emergencia',
  sourceLabel: 'Guia de emergência',
  desc: '30 cards — reconhecimento, 1ª hora, ATB e vasopressor.',
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
    },
    {
      front: 'Neutropênico febril pós-quimio: T 38,8 °C, PAS 92, FR 26, lactato 3,2. Foco pulmonar incerto. Conduta na 1ª hora?',
      back: 'Sepse em imunossuprimido — hemoculturas + ATB empírico de amplo espectro imediato (cobrir Gram+ e Gram−, incluir antipseudomonas conforme protocolo onco). Volume + noradrenalina se choque; internar UTI.'
    },
    {
      front: 'Pneumonia comunitária grave + choque: história de MRSA prévio. Esquema empírico além de volume?',
      back: 'Vancomicina (ou linezolid) + beta-lactâmico de amplo espectro (ex.: piperacilina-tazobactam ou ceftriaxona + macrolídeo conforme foco). Noradrenalina precoce; repetir lactato.'
    },
    {
      front: 'Noradrenalina 0,4 mcg/kg/min e PAM ainda 58. Lactato subindo. Próximo vasopressor?',
      back: 'Adicionar vasopressina (0,03 U/min fixo) e/ou epinefrina conforme protocolo de choque refratário. Reavaliar volume residual, foco não controlado e acidose.'
    },
    {
      front: 'Sepse evidente, lactato 1,8 (normal), PA 102×68, creatinina subiu de 0,9 para 2,1. Trata como sepse grave?',
      back: 'Sim — disfunção orgânica (SOFA ↑) define sepse mesmo com lactato normal. ATB precoce, volume se hipoperfusão, monitorar lactato seriado e outros marcadores de perfusão.'
    },
    {
      front: 'Paciente 55 a, sepse urinária: creatinina 3,8, oligúria, ureterolitíase com hidronefrose à US. ATB sozinho resolve?',
      back: 'Não — desobstruir via urinária (duplo J ou nefrostomia) é controle de foco. ATB + volume; urologia urgente. Sepse por obstrução não responde só a antibiótico.'
    },
    {
      front: 'Meningite bacteriana suspeita + rash petequial, PA 86×50, tempo de enchimento 5 s. Ordem de prioridade?',
      back: 'ATB EV imediato (cefalosporina 3ª + vancomicina conforme idade/fatores) antes de TC se possível · volume + noradrenalina · dexametasona antes/después 1ª dose ATB se indicado · hemoculturas.'
    },
    {
      front: 'Endocardite com vegetação aórtica, febre persistente, embolia esplênica, PA 90×55. Foco controlado só com ATB?',
      back: 'Endocardite = ATB prolongado + avaliação cirúrgica (válvula, abscesso). Choque exige volume/vasopressor; hemoculturas seriadas; ecocardiograma; infectologia/cirurgia cardíaca.'
    },
    {
      front: 'Sepse em paciente em hemodiálise crônica: PA 70×40, sem resposta a 1,5 L cristaloide. Cuidado especial com volume?',
      back: 'Mais restritivo que 30 mL/kg cego — bolus menores com reavaliação frequente (risco sobrecarga). Noradrenalina precoce; acesso dialítico para ATB; investigar foco (cateter, pneumonia).'
    },
    {
      front: 'Colega sugere drotrecogina alfa (proteína C) na sepse grave. Conduta atual?',
      back: 'Não indicada — retirada do mercado; sem benefício comprovado em estudos recentes. Foco em bundle hora-1: ATB, volume, culturas, vasopressor, controle de foco.'
    },
    {
      front: 'Sepse com PAS 88×52: corticoide em dose de estresse (hidrocortisona 200 mg/dia)?',
      back: 'Só se choque séptico refratário a volume + vasopressor adequado (controverso/baixo nível). Não rotina em todo choque. Tratar foco e noradrenalina primeiro.'
    },
    {
      front: 'Lactato inicial 6,4. Após 4 h de tratamento: 4,1. Clearance de lactato = ? Interpretação?',
      back: 'Queda ≈ 36% — resposta parcial favorável se PAM e perfusão melhorando. Meta comum: queda ≥ 10–20% em 2–4 h; se estagnado: reavaliar foco, ATB e volume.'
    },
    {
      front: 'Sepse estabilizada na enfermaria, noradrenalina suspensa há 6 h. Critérios mínimos antes de transferir para enfermaria comum?',
      back: 'Estabilidade hemodinâmica sem vasopressor, lactato em queda/normal, diurese adequada, foco em controle (ou plano definido), ATB correto e monitorização disponível no setor.'
    },
    {
      front: 'Procalcitonina 12 ng/mL, suspeita de sepse. Você atrasa ATB para confirmar?',
      back: 'Não — PCT apoia decisão de suspender ATB em infecção provável descartada, não substitui clínica nem atrasa ATB na sepse grave. Tratar primeiro se suspeita alta.'
    },
    {
      front: 'Celulite extensa + crepitação, gás subcutâneo à RX, PA 80×45, FC 130. ATB empírico?',
      back: 'Fasciite necrotizante até prova contrária — ATB de amplo espectro (incluir anaeróbios + MRSA) + cirurgia urgente (debridamento). Volume agressivo + noradrenalina; não só ATB.'
    },
    {
      front: 'Sepse pós-parto: febre, lochia fétida, PA 92×58, útero doloroso. Foco e conduta?',
      back: 'Endometrite/sepse pós-parto — ATB EV (clindamicina + gentamicina ou esquema institucional) + volume/vasopressor se choque. Avaliar retenção placentária/abscesso; obstetrícia.'
    },
    {
      front: 'Paciente 82 a, sepse de foco pulmonar, SpO₂ 88% em O₂ 5 L/min, FR 32. Intubar ou otimizar antes?',
      back: 'O₂ suplementar + VMNI se indicado antes de IOT precipitada; se falha respiratória iminente (GCS ↓, acidose, exaustão): intubar com pré-oxigenação. ATB e volume paralelos.'
    },
    {
      front: 'Hemoculturas coletadas, ceftriaxona iniciada há 45 min. Enfermagem pergunta se pode atrasar 2ª dose. Resposta?',
      back: 'Manter ATB no intervalo correto — atraso aumenta mortalidade. Bundle hora-1: ATB na 1ª hora, não dose única isolada. Reavaliar espectro com culturas em 48–72 h.'
    },
    {
      front: 'Sepse com plaquetas 68 mil, INR 1,8, bilirrubina 3,2. SOFA hepático/coagulação. Muda ATB empírico inicial?',
      back: 'Não muda esquema empírico por SOFA isolado — foco define ATB. Plaquetopenia/coagulopatia exige monitorar sangramento, evitar procedimentos desnecessários, considerar CIVD.'
    },
    {
      front: 'Choque séptico: PAM 62 com noradrenalina 0,25 mcg/kg/min. PVC 14, ainda frio e marmoreado. Mais volume?',
      back: 'Reavaliar perfusão dinâmica (variação VTI, passive leg raise se disponível) — nem todo paciente precisa mais volume com PVC alta. Otimizar vasopressor; tratar foco.'
    },
    {
      front: 'Alta do PS negada: sepse leve tratada ambulatorialmente? Quando NUNCA alta do PS na sepse?',
      back: 'Choque séptico, disfunção orgânica progressiva, lactato elevado persistente, hipoxemia, alteração mental, oligúria ou incapacidade de tolerar VO/ATB EV — internar. Sepse leve sem disfunção pode ser exceção ambulatorial selecionada.'
    }
  ]
};
