/* Receituário — catálogo de condições e modelos de receita */

function rxAltaOption (id, tier, label, meds, orientacoes, classes) {
  return {
    id,
    tier,
    label,
    classes: classes || [],
    items: [],
    meds,
    orientacoes: orientacoes || ''
  };
}

function rxAltaMed (id, text, classes, exclusiveGroup) {
  return {
    id,
    text,
    classes: classes || [],
    ...(exclusiveGroup ? { exclusiveGroup } : {})
  };
}

function rxAltaMicose (id, name, aliases) {
  return {
    id,
    name,
    icon: '🦶',
    aliases,
    groups: [{
      id: `${id}-topico`,
      label: 'Tratamento tópico — pele glabra/interdigital',
      options: [
        rxAltaOption(
          `${id}-azoles`,
          '1ª linha',
          'Antifúngico tópico — escolha um',
          [
            rxAltaMed(`${id}-clotrimazol`, 'Clotrimazol creme 1% — aplicar camada fina na área afetada e 2 cm ao redor, 2 vezes ao dia, por 2 a 4 semanas', ['antifungal'], `${id}-topico`),
            rxAltaMed(`${id}-miconazol`, 'Miconazol creme 2% — aplicar camada fina na área afetada, 2 vezes ao dia, por 2 a 4 semanas', ['antifungal'], `${id}-topico`),
            rxAltaMed(`${id}-terbinafina`, 'Terbinafina creme 1% — aplicar camada fina na área afetada, 1 vez ao dia, por 1 a 2 semanas', ['antifungal'], `${id}-topico`)
          ],
          'Manter a pele limpa e seca, trocar meias/roupas diariamente e não compartilhar toalhas. Confirmar diagnóstico se não houver melhora em 2 semanas.',
          ['antifungal']
        )
      ]
    }, {
      id: `${id}-extensa`,
      label: 'Situações que exigem avaliação ambulatorial',
      options: [
        rxAltaOption(
          `${id}-encaminhar`,
          'Orientação',
          'Couro cabeludo, unha, doença extensa ou falha do tópico',
          [
            rxAltaMed(`${id}-consulta`, 'Avaliação dermatológica/ambulatorial — confirmar micose antes de antifúngico sistêmico e solicitar função hepática quando indicado', [])
          ],
          'Não iniciar antifúngico sistêmico automaticamente na alta. Tínea do couro cabeludo e onicomicose exigem diagnóstico e esquema próprios.'
        )
      ]
    }]
  };
}

const RX_HOME_RESP_DERM = [
  {
    id: 'sinusite-aguda',
    name: 'Sinusite aguda (alta ambulatorial)',
    icon: '🤧',
    aliases: ['sinusite', 'rinossinusite', 'dor facial', 'secrecao nasal', 'congestao nasal'],
    groups: [{
      id: 'sin-suporte',
      label: 'Viral/pós-viral — suporte, sem antibiótico',
      options: [
        rxAltaOption('sin-lavagem', '1ª linha', 'Lavagem nasal e analgesia', [
          rxAltaMed('sin-sf', 'Solução fisiológica 0,9% — irrigar cada narina 3 a 6 vezes ao dia, conforme necessidade', []),
          rxAltaMed('sin-paracetamol', 'Paracetamol 500 a 750 mg — 1 comprimido VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'sin-analgesia'),
          rxAltaMed('sin-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'sin-analgesia')
        ], 'Quadro com menos de 10 dias e sem piora bifásica geralmente é viral. Retornar se edema orbitário, alteração visual, rigidez de nuca, prostração ou piora importante.')
      ]
    }, {
      id: 'sin-bacteriana',
      label: 'Bacteriana — somente se critério clínico',
      options: [
        rxAltaOption('sin-atb', 'Se indicado', 'Antibiótico oral — escolha um', [
          rxAltaMed('sin-amoxclav', 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic', 'penicillin'], 'sin-atb'),
          rxAltaMed('sin-doxi', 'Doxiciclina 100 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic'], 'sin-atb')
        ], 'Reservar para sintomas por mais de 10 dias sem melhora, piora após melhora inicial ou início grave. Doxiciclina é contraindicada na gestação e em crianças menores de 8 anos.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'otite-media',
    name: 'Otite média aguda (alta ambulatorial)',
    icon: '👂',
    aliases: ['otite media', 'oma', 'dor de ouvido', 'otalgia'],
    groups: [{
      id: 'oma-analgesia',
      label: 'Analgesia e observação',
      options: [
        rxAltaOption('oma-analgesico', '1ª linha', 'Analgésico — escolha um', [
          rxAltaMed('oma-paracetamol', 'Paracetamol 500 a 750 mg — 1 comprimido VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'oma-analgesia'),
          rxAltaMed('oma-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'oma-analgesia'),
          rxAltaMed('oma-ibuprofeno', 'Ibuprofeno 400 mg — 1 comprimido VO a cada 8 horas, após alimentação, se dor, por até 3 dias', ['nsaid'], 'oma-analgesia')
        ], 'Observação por 48–72 horas pode ser usada em OMA leve e com seguimento garantido. Reavaliar antes se piora.')
      ]
    }, {
      id: 'oma-atb',
      label: 'Antibiótico — quando indicado',
      options: [
        rxAltaOption('oma-atb-escolha', '1ª linha', 'Esquema oral — escolha um', [
          rxAltaMed('oma-amox-adulto', 'Amoxicilina 500 mg — 1 cápsula VO a cada 8 horas, por 5 a 7 dias (adulto)', ['antibiotic', 'penicillin'], 'oma-atb'),
          rxAltaMed('oma-amox-ped', 'Amoxicilina suspensão — 80 a 90 mg/kg/dia VO, divididos a cada 12 horas, por 7 a 10 dias (criança; calcular o volume pela apresentação)', ['antibiotic', 'penicillin'], 'oma-atb'),
          rxAltaMed('oma-amoxclav', 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 7 dias (adulto com falha/uso recente de amoxicilina)', ['antibiotic', 'penicillin'], 'oma-atb')
        ], 'Indicar conforme idade, bilateralidade, otorreia, febre ≥ 39 °C, dor intensa ou falha da observação. Mastoidite, paralisia facial ou toxicidade exigem avaliação urgente.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'otite-externa',
    name: 'Otite externa não complicada (alta ambulatorial)',
    icon: '👂',
    aliases: ['otite externa', 'ouvido de nadador', 'dor no canal auditivo'],
    groups: [{
      id: 'oe-topico',
      label: 'Tratamento tópico — escolha um',
      options: [
        rxAltaOption('oe-gotas', '1ª linha', 'Gotas otológicas', [
          rxAltaMed('oe-ciprodex', 'Ciprofloxacino 0,3% + dexametasona gotas otológicas — aplicar 4 gotas no ouvido afetado a cada 12 horas, por 7 dias', ['antibiotic', 'corticosteroid'], 'oe-gotas'),
          rxAltaMed('oe-cipro', 'Ciprofloxacino 0,3% gotas otológicas — aplicar 4 gotas no ouvido afetado a cada 8 horas, por 7 a 10 dias', ['antibiotic'], 'oe-gotas')
        ], 'Manter o ouvido seco e não introduzir hastes. Preferir quinolona tópica se perfuração timpânica não puder ser excluída. Diabetes, dor desproporcional ou extensão periauricular exigem reavaliação.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'bronquite-aguda',
    name: 'Bronquite aguda (alta ambulatorial)',
    icon: '🫁',
    aliases: ['bronquite', 'bronquite aguda', 'tosse viral'],
    groups: [{
      id: 'br-suporte',
      label: 'Viral — suporte, sem antibiótico',
      options: [
        rxAltaOption('br-sintomatico', '1ª linha', 'Sintomáticos', [
          rxAltaMed('br-paracetamol', 'Paracetamol 500 a 750 mg — 1 comprimido VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'br-analgesia'),
          rxAltaMed('br-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'br-analgesia')
        ], 'Antibiótico não é indicado de rotina. Hidratação e retorno se dispneia, hemoptise, febre persistente ou saturação baixa.')
      ]
    }, {
      id: 'br-broncoespasmo',
      label: 'Sibilância/broncoespasmo associado',
      options: [
        rxAltaOption('br-salbutamol', 'Se indicado', 'Broncodilatador de resgate', [
          rxAltaMed('br-salbutamol-spray', 'Salbutamol spray 100 mcg/dose — 2 jatos com espaçador a cada 4 a 6 horas, se chiado ou falta de ar, por até 7 dias (máximo 8 jatos/dia)', ['bronchodilator'])
        ], 'Não prescrever broncodilatador sem sibilância. Se precisar repetir antes de 4 horas, retornar ao serviço.', ['bronchodilator'])
      ]
    }, {
      id: 'br-coqueluche',
      label: 'Suspeita de coqueluche',
      options: [
        rxAltaOption('br-azitro', 'Se indicado', 'Macrolídeo', [
          rxAltaMed('br-azitro-adulto', 'Azitromicina 500 mg — 1 comprimido VO 1 vez ao dia, por 5 dias (adulto)', ['antibiotic', 'macrolide'])
        ], 'Usar somente se quadro compatível com coqueluche e aplicar medidas de isolamento/notificação conforme protocolo local.', ['antibiotic', 'macrolide'])
      ]
    }]
  },
  {
    id: 'gripe-influenza',
    name: 'Síndrome gripal / influenza (alta ambulatorial)',
    icon: '🤒',
    aliases: ['gripe', 'influenza', 'sindrome gripal', 'resfriado'],
    groups: [{
      id: 'gripe-suporte',
      label: 'Síndrome gripal leve — suporte',
      options: [
        rxAltaOption('gripe-sintomatico', '1ª linha', 'Analgésico/antitérmico — escolha um', [
          rxAltaMed('gripe-paracetamol', 'Paracetamol 500 a 750 mg — 1 comprimido VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'gripe-analgesia'),
          rxAltaMed('gripe-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'gripe-analgesia')
        ], 'Hidratação, repouso e máscara enquanto sintomático. Retornar se dispneia, dor torácica, confusão, desidratação ou piora após melhora.')
      ]
    }, {
      id: 'gripe-antiviral',
      label: 'Influenza — antiviral quando indicado',
      options: [
        rxAltaOption('gripe-oseltamivir', 'Se indicado', 'Oseltamivir', [
          rxAltaMed('gripe-oseltamivir-75', 'Oseltamivir 75 mg — 1 cápsula VO a cada 12 horas, por 5 dias (adulto; ajustar na insuficiência renal)', ['antiviral'])
        ], 'Priorizar início nas primeiras 48 horas. Em casos graves, progressivos, gestantes ou grupos de risco, não deixar de tratar apenas pelo tempo de sintomas.', ['antiviral'])
      ]
    }]
  },
  {
    id: 'rinite-alergica',
    name: 'Rinite alérgica (alta ambulatorial)',
    icon: '🌼',
    aliases: ['rinite', 'rinite alergica', 'espirros', 'coriza alergica'],
    groups: [{
      id: 'rinite-intranasal',
      label: 'Controle nasal',
      options: [
        rxAltaOption('rinite-corticoide', '1ª linha', 'Corticoide intranasal — escolha um', [
          rxAltaMed('rinite-budesonida', 'Budesonida spray nasal 32 mcg/dose — aplicar 1 a 2 jatos em cada narina, 1 vez ao dia, por 14 a 30 dias', ['corticosteroid'], 'rinite-corticoide'),
          rxAltaMed('rinite-fluticasona', 'Fluticasona spray nasal 50 mcg/dose — aplicar 1 a 2 jatos em cada narina, 1 vez ao dia, por 14 a 30 dias', ['corticosteroid'], 'rinite-corticoide')
        ], 'Direcionar o jato para a parede lateral da narina, não para o septo. O efeito máximo pode levar alguns dias.', ['corticosteroid'])
      ]
    }, {
      id: 'rinite-anti-h1',
      label: 'Prurido, espirros e coriza',
      options: [
        rxAltaOption('rinite-antihistaminico', 'Adjuvante', 'Anti-histamínico — escolha um', [
          rxAltaMed('rinite-loratadina', 'Loratadina 10 mg — 1 comprimido VO 1 vez ao dia, por 10 a 14 dias', ['antihistamine'], 'rinite-antihistaminico'),
          rxAltaMed('rinite-cetirizina', 'Cetirizina 10 mg — 1 comprimido VO à noite, por 10 a 14 dias', ['antihistamine'], 'rinite-antihistaminico')
        ], 'Associar lavagem nasal com solução salina. Evitar descongestionante tópico por mais de 3 dias.', ['antihistamine'])
      ]
    }]
  },
  {
    id: 'impetigo',
    name: 'Impetigo (alta ambulatorial)',
    icon: '🩹',
    aliases: ['impetigo', 'ferida com crosta melicerica', 'infeccao superficial da pele'],
    groups: [{
      id: 'imp-localizado',
      label: 'Localizado — tratamento tópico',
      options: [
        rxAltaOption('imp-mupirocina', '1ª linha', 'Mupirocina tópica', [
          rxAltaMed('imp-mupirocina-2', 'Mupirocina pomada 2% — aplicar camada fina nas lesões 3 vezes ao dia, por 5 dias', ['antibiotic'])
        ], 'Higienizar suavemente e remover crostas amolecidas antes da aplicação. Não compartilhar toalhas.', ['antibiotic'])
      ]
    }, {
      id: 'imp-extenso',
      label: 'Extenso, múltiplas lesões ou surto',
      options: [
        rxAltaOption('imp-atb-oral', 'Se indicado', 'Antibiótico oral — escolha um', [
          rxAltaMed('imp-cefalexina', 'Cefalexina 500 mg — 1 cápsula VO a cada 6 horas, por 7 dias (adulto)', ['antibiotic'], 'imp-atb'),
          rxAltaMed('imp-clindamicina', 'Clindamicina 300 mg — 1 cápsula VO a cada 6 horas, por 7 dias (alergia imediata a beta-lactâmico ou risco de MRSA conforme epidemiologia)', ['antibiotic'], 'imp-atb')
        ], 'Reavaliar se febre, progressão, bolhas extensas ou ausência de melhora em 48–72 horas.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'celulite',
    name: 'Celulite não purulenta leve (alta ambulatorial)',
    icon: '🩹',
    aliases: ['celulite', 'infeccao de pele', 'celulite bacteriana'],
    groups: [{
      id: 'cel-atb-oral',
      label: 'Antibiótico oral — somente após estabilidade para alta',
      options: [
        rxAltaOption('cel-atb-escolha', '1ª linha', 'Cobertura para estreptococo/MSSA — escolha um', [
          rxAltaMed('cel-cefalexina', 'Cefalexina 500 mg — 1 cápsula VO a cada 6 horas, por 5 a 7 dias', ['antibiotic', 'cephalosporin', 'beta_lactam'], 'cel-atb'),
          rxAltaMed('cel-amoxclav', 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic', 'penicillin', 'beta_lactam'], 'cel-atb'),
          rxAltaMed('cel-clindamicina', 'Clindamicina 300 mg — 1 cápsula VO a cada 6 horas, por 5 a 7 dias (alergia imediata a beta-lactâmico)', ['antibiotic'], 'cel-atb')
        ], 'Marcar a borda do eritema e reavaliar em 48–72 horas. Não usar este modelo se houver toxemia, progressão rápida, dor desproporcional, imunossupressão importante ou suspeita de fascite.', ['antibiotic'])
      ]
    }, {
      id: 'cel-suporte',
      label: 'Medidas associadas',
      options: [
        rxAltaOption('cel-elevacao', 'Adjuvante', 'Elevação e analgesia', [
          rxAltaMed('cel-elevar', 'Elevar o membro afetado acima do nível do coração sempre que possível e manter hidratação', []),
          rxAltaMed('cel-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'cel-analgesia'),
          rxAltaMed('cel-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'cel-analgesia')
        ], 'Retorno imediato se febre persistente, bolhas, necrose, aumento além da marca ou piora da dor.')
      ]
    }]
  },
  {
    id: 'erisipela',
    name: 'Erisipela leve (alta ambulatorial)',
    icon: '🦵',
    aliases: ['erisipela', 'placa vermelha dolorosa', 'infeccao superficial da pele'],
    groups: [{
      id: 'eri-atb-oral',
      label: 'Antibiótico oral — paciente estável',
      options: [
        rxAltaOption('eri-atb-escolha', '1ª linha', 'Cobertura estreptocócica — escolha um', [
          rxAltaMed('eri-amoxicilina', 'Amoxicilina 500 mg — 1 cápsula VO a cada 8 horas, por 7 a 10 dias', ['antibiotic', 'penicillin', 'beta_lactam'], 'eri-atb'),
          rxAltaMed('eri-cefalexina', 'Cefalexina 500 mg — 1 cápsula VO a cada 6 horas, por 7 a 10 dias', ['antibiotic', 'cephalosporin', 'beta_lactam'], 'eri-atb'),
          rxAltaMed('eri-clindamicina', 'Clindamicina 300 mg — 1 cápsula VO a cada 6 horas, por 7 a 10 dias (alergia imediata a beta-lactâmico)', ['antibiotic'], 'eri-atb')
        ], 'Tratar porta de entrada (fissura interdigital, úlcera ou micose) e reavaliar em 48–72 horas. Toxemia, bolhas, necrose ou progressão rápida impedem alta simples.', ['antibiotic'])
      ]
    }, {
      id: 'eri-suporte',
      label: 'Medidas associadas',
      options: [
        rxAltaOption('eri-elevacao', 'Adjuvante', 'Elevação e analgesia', [
          rxAltaMed('eri-elevar', 'Elevar o membro afetado acima do nível do coração sempre que possível e marcar a borda do eritema', []),
          rxAltaMed('eri-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'])
        ], 'Procurar atendimento no mesmo dia se a vermelhidão ultrapassar a marca, houver febre persistente ou piora da dor.')
      ]
    }]
  },
  {
    id: 'abscesso-cutaneo',
    name: 'Abscesso cutâneo após controle do foco (alta)',
    icon: '🩹',
    aliases: ['abscesso', 'abscesso cutaneo', 'colecao de pele', 'pus na pele'],
    groups: [{
      id: 'abs-drenagem',
      label: 'Controle do foco — obrigatório quando há coleção',
      options: [
        rxAltaOption('abs-curativo', 'Após drenagem', 'Curativo e cuidados locais', [
          rxAltaMed('abs-limpeza', 'Higienizar a ferida com água e sabonete ou solução fisiológica, secar e cobrir com curativo limpo; trocar 1 a 2 vezes ao dia', [])
        ], 'Antibiótico isolado não substitui incisão e drenagem de coleção flutuante. Retorno em 24–48 horas para revisão do curativo quando indicado.')
      ]
    }, {
      id: 'abs-atb',
      label: 'Antibiótico — apenas se indicação adicional após drenagem',
      options: [
        rxAltaOption('abs-atb-escolha', 'Se indicado', 'Cobertura para MRSA comunitário — escolha um', [
          rxAltaMed('abs-smt', 'Sulfametoxazol + trimetoprima 800/160 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic', 'sulfonamide'], 'abs-atb'),
          rxAltaMed('abs-clindamicina', 'Clindamicina 300 mg — 1 cápsula VO a cada 6 horas, por 5 a 7 dias', ['antibiotic'], 'abs-atb'),
          rxAltaMed('abs-doxiciclina', 'Doxiciclina 100 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic'], 'abs-atb')
        ], 'Considerar se celulite extensa, sinais sistêmicos, múltiplas lesões, extremos de idade, imunossupressão ou falha prévia. Doxiciclina é contraindicada na gestação e em crianças menores de 8 anos.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'furunculose',
    name: 'Furúnculo/furunculose após avaliação para drenagem',
    icon: '🩹',
    aliases: ['furunculo', 'furunculose', 'caroco com pus'],
    groups: [{
      id: 'fur-local',
      label: 'Lesão pequena sem celulite extensa',
      options: [
        rxAltaOption('fur-compressa', '1ª linha', 'Cuidados locais', [
          rxAltaMed('fur-compressa-morna', 'Aplicar compressa morna por 10 a 15 minutos, 3 a 4 vezes ao dia; manter a área limpa e coberta', [])
        ], 'Não espremer. Lesão flutuante deve ser avaliada para incisão e drenagem; carbúnculo, face, imunossupressão ou sinais sistêmicos exigem reavaliação.')
      ]
    }, {
      id: 'fur-atb',
      label: 'Antibiótico após drenagem — somente se indicado',
      options: [
        rxAltaOption('fur-atb-escolha', 'Se indicado', 'Esquema oral — escolha um', [
          rxAltaMed('fur-smt', 'Sulfametoxazol + trimetoprima 800/160 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic', 'sulfonamide'], 'fur-atb'),
          rxAltaMed('fur-clindamicina', 'Clindamicina 300 mg — 1 cápsula VO a cada 6 horas, por 5 a 7 dias', ['antibiotic'], 'fur-atb'),
          rxAltaMed('fur-cefalexina', 'Cefalexina 500 mg — 1 cápsula VO a cada 6 horas, por 5 a 7 dias (se celulite não purulenta associada, sem risco de MRSA)', ['antibiotic', 'cephalosporin', 'beta_lactam'], 'fur-atb')
        ], 'Antibiótico não substitui drenagem. Retornar se febre, progressão da vermelhidão, novas lesões ou ausência de melhora em 48 horas.', ['antibiotic'])
      ]
    }]
  },
  rxAltaMicose('micoses-superficiais', 'Micoses superficiais (alta ambulatorial)', ['micose', 'micoses superficiais', 'dermatofitose']),
  rxAltaMicose('tinea', 'Tínea da pele (alta ambulatorial)', ['tinea', 'tinha', 'tinea corporis', 'dermatofitose']),
  rxAltaMicose('frieira', 'Frieira / tinea pedis (alta ambulatorial)', ['frieira', 'pe de atleta', 'tinea pedis', 'micose interdigital']),
  {
    id: 'escabiose',
    name: 'Escabiose (alta ambulatorial)',
    icon: '🧴',
    aliases: ['escabiose', 'sarna', 'coceira noturna'],
    groups: [{
      id: 'escabiose-topico',
      label: 'Tratamento do paciente e contatos',
      options: [
        rxAltaOption('escabiose-permetrina', '1ª linha', 'Permetrina 5%', [
          rxAltaMed('escabiose-permetrina-5', 'Permetrina loção 5% — aplicar do pescoço para baixo à noite, incluindo dobras e espaços entre os dedos; lavar após 8 a 14 horas; repetir em 7 dias', ['antiparasitic'])
        ], 'Tratar simultaneamente contatos domiciliares e sexuais. Lavar roupas de cama/toalhas em água quente ou isolar em saco fechado por pelo menos 72 horas.', ['antiparasitic'])
      ]
    }]
  },
  {
    id: 'pediculose',
    name: 'Pediculose do couro cabeludo (alta ambulatorial)',
    icon: '🪮',
    aliases: ['pediculose', 'piolho', 'lendea'],
    groups: [{
      id: 'pediculose-topico',
      label: 'Tratamento tópico',
      options: [
        rxAltaOption('pediculose-permetrina', '1ª linha', 'Permetrina 1%', [
          rxAltaMed('pediculose-permetrina-1', 'Permetrina loção 1% — aplicar no couro cabeludo e cabelos úmidos após lavagem sem condicionador; deixar 10 minutos e enxaguar; repetir no 9º dia', ['antiparasitic'])
        ], 'Remover lêndeas com pente fino. Examinar e tratar contatos infestados; não compartilhar pentes, bonés ou toalhas.', ['antiparasitic'])
      ]
    }]
  }
];

const RX_HOME_GI_OLHO = [
  {
    id: 'conjuntivite',
    name: 'Conjuntivite (alta ambulatorial)',
    icon: '👁️',
    aliases: ['conjuntivite', 'olho vermelho', 'secrecao ocular'],
    groups: [{
      id: 'conj-viral',
      label: 'Viral — suporte, sem antibiótico',
      options: [
        rxAltaOption('conj-viral-suporte', '1ª linha', 'Lágrimas artificiais e higiene', [
          rxAltaMed('conj-lagrimas', 'Lágrimas artificiais — aplicar 1 gota em cada olho 4 a 6 vezes ao dia, por 5 a 7 dias', []),
          rxAltaMed('conj-compressa', 'Compressas frias limpas — 3 a 4 vezes ao dia; lavar mãos e não compartilhar toalhas', [])
        ], 'Não usar colírio antibiótico na forma viral. Retornar se dor intensa, fotofobia, redução visual ou secreção purulenta intensa.')
      ]
    }, {
      id: 'conj-bact',
      label: 'Bacteriana — colírio antibiótico',
      options: [
        rxAltaOption('conj-bact-colirio', 'Se indicado', 'Antibiótico tópico — escolha um', [
          rxAltaMed('conj-tobra', 'Tobramicina 0,3% colírio — 1 gota no olho afetado a cada 4 horas em vigília, por 5 a 7 dias', ['antibiotic'], 'conj-bact'),
          rxAltaMed('conj-cipro', 'Ciprofloxacino 0,3% colírio — 1 gota no olho afetado a cada 4 horas em vigília, por 5 a 7 dias', ['antibiotic'], 'conj-bact')
        ], 'Reservar para secreção purulenta franca. Avaliar oftalmologia se não houver melhora em 48–72 horas ou se houver envolvimento da córnea.', ['antibiotic'])
      ]
    }, {
      id: 'conj-alerg',
      label: 'Alérgica',
      options: [
        rxAltaOption('conj-alerg-escolha', 'Se indicado', 'Anti-histamínico ± colírio', [
          rxAltaMed('conj-loratadina', 'Loratadina 10 mg — 1 comprimido VO 1 vez ao dia, por 7 a 14 dias', ['antihistamine'], 'conj-alerg-vo'),
          rxAltaMed('conj-olopatadina', 'Olopatadina 0,1% colírio — 1 gota em cada olho a cada 12 horas, por 7 a 14 dias', ['antihistamine'])
        ], 'Evitar coçar os olhos. Suspender lentes de contato até a resolução.')
      ]
    }]
  },
  {
    id: 'hordeolo',
    name: 'Hordéolo / terçol (alta ambulatorial)',
    icon: '👁️',
    aliases: ['hordeolo', 'tercol', 'abscesso palpebral'],
    groups: [{
      id: 'hor-local',
      label: 'Cuidados locais',
      options: [
        rxAltaOption('hor-compressa', '1ª linha', 'Compressas e higiene', [
          rxAltaMed('hor-compressa-morna', 'Compressas mornas limpas — 10 a 15 minutos, 4 a 6 vezes ao dia, por 5 a 7 dias; não espremer', [])
        ], 'A maioria drena espontaneamente. Retornar se celulite periocular, febre, dor intensa ou redução visual.')
      ]
    }, {
      id: 'hor-topico',
      label: 'Antibiótico tópico — se inflamação importante',
      options: [
        rxAltaOption('hor-pomada', 'Se indicado', 'Pomada oftálmica — escolha uma', [
          rxAltaMed('hor-tobra', 'Tobramicina pomada oftálmica 0,3% — aplicar fina camada na margem palpebral 3 a 4 vezes ao dia, por 7 dias', ['antibiotic'], 'hor-topico'),
          rxAltaMed('hor-eritro', 'Eritromicina pomada oftálmica 0,5% — aplicar fina camada na margem palpebral 3 a 4 vezes ao dia, por 7 dias', ['antibiotic'], 'hor-topico')
        ], 'Celulite pré-septal extensa exige antibiótico sistêmico e reavaliação; suspeita orbital é emergência.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'herpes-zoster',
    name: 'Herpes-zóster não complicado (alta ambulatorial)',
    icon: '🩹',
    aliases: ['herpes zoster', 'cobreiro', 'zoster'],
    groups: [{
      id: 'hz-antiviral',
      label: 'Antiviral — iniciar preferencialmente em até 72 h do rash',
      options: [
        rxAltaOption('hz-antiviral-escolha', '1ª linha', 'Esquema oral — escolha um', [
          rxAltaMed('hz-valaciclovir', 'Valaciclovir 1 g — 1 comprimido VO a cada 8 horas, por 7 dias', ['antiviral'], 'hz-antiviral'),
          rxAltaMed('hz-aciclovir', 'Aciclovir 800 mg — 1 comprimido VO 5 vezes ao dia, por 7 dias', ['antiviral'], 'hz-antiviral')
        ], 'Cobrir as lesões e evitar contato com gestantes sem imunidade e imunossuprimidos. Herpes oftálmico, disseminado, Ramsay Hunt ou imunossupressão grave exigem avaliação especializada/internação.', ['antiviral'])
      ]
    }, {
      id: 'hz-analgesia',
      label: 'Analgesia',
      options: [
        rxAltaOption('hz-analgesico', '1ª linha', 'Analgésico — escolha um', [
          rxAltaMed('hz-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 7 dias', ['analgesic_non_opioid'], 'hz-analgesia'),
          rxAltaMed('hz-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 7 dias', ['analgesic_non_opioid'], 'hz-analgesia')
        ], 'Se neuralgia intensa persistir após a fase aguda, reavaliar para adjuvantes neuropáticos em consulta.')
      ]
    }]
  },
  {
    id: 'candidiase',
    name: 'Candidíase não complicada (alta ambulatorial)',
    icon: '🧬',
    aliases: ['candidiase', 'sapinho', 'candida'],
    groups: [{
      id: 'cand-oral',
      label: 'Oral leve',
      options: [
        rxAltaOption('cand-oral-escolha', '1ª linha', 'Tratamento tópico oral — escolha um', [
          rxAltaMed('cand-nistatina', 'Nistatina suspensão 100.000 UI/mL — bochechar e engolir 4 a 6 mL, 4 vezes ao dia, por 7 a 14 dias', ['antifungal'], 'cand-oral'),
          rxAltaMed('cand-miconazol-gel', 'Miconazol gel oral 2% — aplicar na mucosa oral 2 vezes ao dia, por 7 a 14 dias', ['antifungal'], 'cand-oral')
        ], 'Remover próteses à noite e higienizar. Candidíase esofágica ou imunossupressão grave não usam este modelo simples.', ['antifungal'])
      ]
    }, {
      id: 'cand-vag',
      label: 'Vaginal não complicada',
      options: [
        rxAltaOption('cand-vag-escolha', '1ª linha', 'Esquema — escolha um', [
          rxAltaMed('cand-fluconazol', 'Fluconazol 150 mg — 1 comprimido VO dose única', ['antifungal'], 'cand-vag'),
          rxAltaMed('cand-miconazol-vag', 'Miconazol creme vaginal 2% — aplicar 1 aplicador à noite, por 7 noites', ['antifungal'], 'cand-vag')
        ], 'Evitar relações sexuais até a melhora. Gestação: preferir azol tópico e evitar fluconazol.', ['antifungal'])
      ]
    }]
  },
  {
    id: 'vulvovaginites',
    name: 'Vulvovaginites (alta ambulatorial)',
    icon: '🩺',
    aliases: ['vulvovaginite', 'corrimento vaginal', 'vaginose', 'tricomoníase'],
    groups: [{
      id: 'vv-vb',
      label: 'Vaginose bacteriana',
      options: [
        rxAltaOption('vv-vb-escolha', '1ª linha', 'Esquema — escolha um', [
          rxAltaMed('vv-metro-7d', 'Metronidazol 500 mg — 1 comprimido VO a cada 12 horas, por 7 dias', ['antibiotic', 'nitroimidazole'], 'vv-vb'),
          rxAltaMed('vv-secnidazol', 'Secnidazol 2 g — 4 comprimidos de 500 mg VO dose única', ['antibiotic', 'nitroimidazole'], 'vv-vb')
        ], 'Evitar álcool durante o metronidazol e por 24 horas após. Não usar metronidazol isolado se o quadro for candidíase.', ['antibiotic'])
      ]
    }, {
      id: 'vv-candida',
      label: 'Candidíase vaginal',
      options: [
        rxAltaOption('vv-cand-escolha', '1ª linha', 'Esquema — escolha um', [
          rxAltaMed('vv-fluconazol', 'Fluconazol 150 mg — 1 comprimido VO dose única', ['antifungal'], 'vv-cand'),
          rxAltaMed('vv-miconazol', 'Miconazol creme vaginal 2% — aplicar 1 aplicador à noite, por 7 noites', ['antifungal'], 'vv-cand')
        ], 'Confirmar prurido/grumos brancos. Gestação: preferir clotrimazol/miconazol tópico.', ['antifungal'])
      ]
    }, {
      id: 'vv-trico',
      label: 'Tricomoníase',
      options: [
        rxAltaOption('vv-trico-metro', '1ª linha', 'Tratar paciente e parceiro', [
          rxAltaMed('vv-metro-2g', 'Metronidazol 2 g — 4 comprimidos de 500 mg VO dose única; tratar o(a) parceiro(a) sexual', ['antibiotic', 'nitroimidazole'])
        ], 'Abstinência sexual até o tratamento de ambos e resolução dos sintomas.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'balanopostite',
    name: 'Balanopostite (alta ambulatorial)',
    icon: '🩺',
    aliases: ['balanopostite', 'balanite', 'inflamacao da glande'],
    groups: [{
      id: 'bal-candida',
      label: 'Provável candidíase',
      options: [
        rxAltaOption('bal-clotrimazol', '1ª linha', 'Antifúngico tópico', [
          rxAltaMed('bal-clotri', 'Clotrimazol creme 1% — aplicar camada fina na glande e prepúcio 2 vezes ao dia, por 7 a 14 dias', ['antifungal'])
        ], 'Higienizar com água, secar bem e evitar sabonetes irritantes. Investigar diabetes se recorrente.', ['antifungal'])
      ]
    }, {
      id: 'bal-bacteriana',
      label: 'Bacteriana / mista — se indicado',
      options: [
        rxAltaOption('bal-atb', 'Se indicado', 'Antibiótico oral — escolha um', [
          rxAltaMed('bal-cefalexina', 'Cefalexina 500 mg — 1 cápsula VO a cada 6 horas, por 5 a 7 dias', ['antibiotic'], 'bal-atb'),
          rxAltaMed('bal-amoxclav', 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic', 'penicillin'], 'bal-atb')
        ], 'Retornar se edema progressivo, retenção urinária, febre ou necrose — avaliar fimose/parafimose.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'diarreia-gastroenterite',
    name: 'Gastroenterite (alta ambulatorial)',
    icon: '🚽',
    aliases: ['diarreia', 'gastroenterite', 'vomito e diarreia'],
    groups: [{
      id: 'dge-sro',
      label: 'Viral/leve — reidratação (sem antibiótico)',
      options: [
        rxAltaOption('dge-reidratacao', '1ª linha', 'SRO e suporte', [
          rxAltaMed('dge-soro', 'Solução de reidratação oral — oferecer pequenos goles frequentes conforme sede e diurese; manter alimentação leve', []),
          rxAltaMed('dge-ondansetrona', 'Ondansetrona 4 mg — 1 comprimido VO a cada 8 horas, se náusea impedir a reidratação, por até 2 dias', ['antiemetic'])
        ], 'Antibiótico não é rotina. Retornar se sangue nas fezes, febre alta persistente, desidratação, sonolência ou incapacidade de beber.')
      ]
    }, {
      id: 'dge-invasiva',
      label: 'Invasiva/disenteria — antibiótico se critério clínico',
      options: [
        rxAltaOption('dge-atb', 'Se indicado', 'Antibiótico oral — escolha um', [
          rxAltaMed('dge-cipro', 'Ciprofloxacino 500 mg — 1 comprimido VO a cada 12 horas, por 3 dias (adulto não gestante)', ['antibiotic'], 'dge-atb'),
          rxAltaMed('dge-azitro', 'Azitromicina 500 mg — 1 comprimido VO 1 vez ao dia, por 3 dias', ['antibiotic', 'macrolide'], 'dge-atb')
        ], 'Preferir azitromicina em gestantes e quando houver risco de resistência a quinolona. Evitar loperamida na disenteria.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'vomitos-agudos',
    name: 'Náuseas e vômitos (alta ambulatorial)',
    icon: '🤢',
    aliases: ['vomitos', 'nauseas', 'enjoo'],
    groups: [{
      id: 'vom-antiemetico',
      label: 'Antiemético oral — após tolerância inicial',
      options: [
        rxAltaOption('vom-escolha', '1ª linha', 'Escolha um', [
          rxAltaMed('vom-ondansetrona', 'Ondansetrona 4 mg — 1 comprimido VO a cada 8 horas, se náusea, por até 2 a 3 dias', ['antiemetic'], 'vom-anti'),
          rxAltaMed('vom-metoclopramida', 'Metoclopramida 10 mg — 1 comprimido VO a cada 8 horas, 30 minutos antes das refeições, por até 2 a 3 dias', ['antiemetic'], 'vom-anti')
        ], 'Manter pequenos volumes de líquidos. Retornar se dor abdominal intensa, sangue, febre, desidratação ou incapacidade de beber.', ['antiemetic'])
      ]
    }]
  },
  {
    id: 'constipacao',
    name: 'Constipação (alta ambulatorial)',
    icon: '🚽',
    aliases: ['constipacao', 'prisao de ventre', 'obstipacao'],
    groups: [{
      id: 'const-fibra',
      label: 'Medidas e laxativo osmótico',
      options: [
        rxAltaOption('const-lactulose', '1ª linha', 'Osmótico', [
          rxAltaMed('const-lactulose-xarope', 'Lactulose xarope — 15 a 30 mL VO 1 a 2 vezes ao dia, ajustar até evacuar fezes macias; aumentar fibras e água', ['laxative'])
        ], 'Investigar alarme (perda de peso, sangue, anemia, início após 50 anos). Evitar uso crônico de estimulantes sem avaliação.', ['laxative'])
      ]
    }]
  },
  {
    id: 'dispepsia-drge',
    name: 'Dispepsia / DRGE (alta ambulatorial)',
    icon: '🔥',
    aliases: ['dispepsia', 'drge', 'refluxo', 'queimacao no estomago'],
    groups: [{
      id: 'drge-ibp',
      label: 'Inibidor de bomba de prótons',
      options: [
        rxAltaOption('drge-omeprazol', '1ª linha', 'IBP', [
          rxAltaMed('drge-omeprazol-20', 'Omeprazol 20 mg — 1 cápsula VO em jejum, 1 vez ao dia, por 14 a 28 dias', ['ppi'])
        ], 'Elevar cabeceira, evitar refeições tardias e excesso de café/álcool. Alarmes (disfagia, anemia, perda de peso, sangramento) exigem endoscopia.', ['ppi'])
      ]
    }, {
      id: 'drge-sintoma',
      label: 'Sintomático se dor',
      options: [
        rxAltaOption('drge-analgesia', 'Adjuvante', 'Analgésico simples — escolha um', [
          rxAltaMed('drge-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'])
        ], 'Evitar AINE se possível — pioram dispepsia e risco de úlcera.')
      ]
    }]
  },
  {
    id: 'hemorroidas',
    name: 'Hemorroidas (alta ambulatorial)',
    icon: '🩹',
    aliases: ['hemorroida', 'hemorroidas', 'sangramento anal'],
    groups: [{
      id: 'hem-local',
      label: 'Medidas locais e evacuação macia',
      options: [
        rxAltaOption('hem-cuidados', '1ª linha', 'Banho de assento e laxativo osmótico', [
          rxAltaMed('hem-banho', 'Banho de assento morno — 10 a 15 minutos, 2 a 3 vezes ao dia', []),
          rxAltaMed('hem-lactulose', 'Lactulose xarope — 15 a 30 mL VO 1 a 2 vezes ao dia, para fezes macias', ['laxative'])
        ], 'Não confundir com fissura, abscesso ou neoplasia. Colonoscopia se idade ≥ 50 anos, anemia ou sangramento atípico.')
      ]
    }, {
      id: 'hem-topico',
      label: 'Tópico de curta duração',
      options: [
        rxAltaOption('hem-pomada', 'Adjuvante', 'Anestésico + corticoide tópico', [
          rxAltaMed('hem-lidohc', 'Pomada de lidocaína + hidrocortisona — aplicar fina camada na região anal 2 vezes ao dia, por até 5 a 7 dias', ['corticosteroid', 'local_anesthetic'])
        ], 'Uso curto. Trombose extensa < 72 h, prolapso irredutível ou sangramento abundante exigem reavaliação.', ['corticosteroid'])
      ]
    }]
  },
  {
    id: 'gota',
    name: 'Crise de gota (alta ambulatorial)',
    icon: '🦴',
    aliases: ['gota', 'crise de gota', 'podagra'],
    groups: [{
      id: 'gota-crise',
      label: 'Tratamento da crise — escolha uma estratégia',
      options: [
        rxAltaOption('gota-colchicina', '1ª linha', 'Colchicina (início precoce)', [
          rxAltaMed('gota-colchicina-ataque', 'Colchicina 0,5 mg — 2 comprimidos VO agora e 1 comprimido 1 hora depois; depois 1 comprimido a cada 12 horas por até 3 dias (ajustar se TFG reduzida)', ['antigout'])
        ], 'Não iniciar alopurinol durante a crise aguda. Reduzir dose se DRC.', ['antigout']),
        rxAltaOption('gota-aine', 'Alternativa', 'AINE — escolha um', [
          rxAltaMed('gota-naproxeno', 'Naproxeno 500 mg — 1 comprimido VO a cada 12 horas, após alimentação, por 5 a 7 dias', ['nsaid'], 'gota-aine'),
          rxAltaMed('gota-ibuprofeno', 'Ibuprofeno 600 mg — 1 comprimido VO a cada 8 horas, após alimentação, por 5 a 7 dias', ['nsaid'], 'gota-aine')
        ], 'Evitar se DRC, úlcera ativa, anticoagulação ou gestação.', ['nsaid']),
        rxAltaOption('gota-corticoide', 'Se AINE e colchicina contraindicados', 'Corticoide oral', [
          rxAltaMed('gota-prednisona', 'Prednisona 40 mg — 2 comprimidos de 20 mg VO 1 vez ao dia, pela manhã, por 5 dias', ['corticosteroid'])
        ], 'Excluir artrite séptica se febre ou dúvida diagnóstica.', ['corticosteroid'])
      ]
    }]
  },
  {
    id: 'colica-renal',
    name: 'Cólica renal (alta ambulatorial)',
    icon: '💧',
    aliases: ['colica renal', 'calculo renal', 'litíase urinaria'],
    groups: [{
      id: 'cr-analgesia',
      label: 'Analgesia oral após controle da dor',
      options: [
        rxAltaOption('cr-analgesico', '1ª linha', 'Analgésico/AINE — escolha um', [
          rxAltaMed('cr-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'cr-analgesia'),
          rxAltaMed('cr-ibuprofeno', 'Ibuprofeno 400 a 600 mg — VO a cada 8 horas, após alimentação, se dor, por até 3 dias', ['nsaid'], 'cr-analgesia')
        ], 'Manter hidratação. Retornar se febre, anúria, vômitos incoercíveis, dor refratária ou rim único.')
      ]
    }, {
      id: 'cr-expulsao',
      label: 'Facilitação da expulsão — se indicado',
      options: [
        rxAltaOption('cr-tansulosina', 'Se cálculo ureteral distal adequado', 'Alfa-bloqueador', [
          rxAltaMed('cr-tansulosina-04', 'Tansulosina 0,4 mg — 1 comprimido VO à noite, por até 7 a 14 dias', [])
        ], 'Orientar filtrar a urina. Cálculo > 10 mm, infecção obstrutiva ou IRA exigem urologia/internação.')
      ]
    }]
  },
  {
    id: 'afta-estomatite',
    name: 'Afta / estomatite (alta ambulatorial)',
    icon: '👄',
    aliases: ['afta', 'estomatite', 'ulcera oral'],
    groups: [{
      id: 'afta-local',
      label: 'Tratamento local',
      options: [
        rxAltaOption('afta-cuidados', '1ª linha', 'Higiene e proteção', [
          rxAltaMed('afta-bochecho', 'Bochechos com solução fisiológica ou água morna — 3 a 4 vezes ao dia', []),
          rxAltaMed('afta-triancinolona', 'Triancinolona acetonida pasta oral 0,1% — aplicar fina camada sobre a afta 2 a 3 vezes ao dia, após higiene, por até 5 dias', ['corticosteroid'])
        ], 'Evitar alimentos ácidos/ásperos. Lesões > 2 semanas, febre ou imunodepressão exigem reavaliação.', ['corticosteroid'])
      ]
    }]
  },
  {
    id: 'queilite',
    name: 'Queilite (alta ambulatorial)',
    icon: '👄',
    aliases: ['queilite', 'lábios rachados', 'inflamacao labial'],
    groups: [{
      id: 'queilite-cuidado',
      label: 'Hidratação e proteção',
      options: [
        rxAltaOption('queilite-basico', '1ª linha', 'Cuidado local', [
          rxAltaMed('queilite-vaselina', 'Vaselina ou hidratante labial sem perfume — aplicar várias vezes ao dia; proteção solar labial se exposição', [])
        ], 'Investigar hábito de lambedura, deficiência nutricional e candidíase angular se fissura persistente nos cantos da boca.')
      ]
    }]
  },
  {
    id: 'parasitoses-intestinais',
    name: 'Parasitoses intestinais (alta ambulatorial)',
    icon: '🪱',
    aliases: ['parasitose', 'verme', 'oxiurose', 'giardiase', 'ascaridiase'],
    groups: [{
      id: 'par-oxi-helm',
      label: 'Oxiurose / helmintos',
      options: [
        rxAltaOption('par-albendazol', '1ª linha', 'Benzimidazol', [
          rxAltaMed('par-albendazol-400', 'Albendazol 400 mg — 1 comprimido VO dose única; na oxiurose, repetir em 14 dias e tratar contactantes', ['antiparasitic'])
        ], 'Reforçar higiene das mãos e unhas curtas. Evitar automedicação repetida sem diagnóstico.', ['antiparasitic'])
      ]
    }, {
      id: 'par-giardia',
      label: 'Giardíase / amebíase intestinal',
      options: [
        rxAltaOption('par-metro', 'Se indicado', 'Nitroimidazol — escolha um', [
          rxAltaMed('par-metro-giardia', 'Metronidazol 250 mg — 1 comprimido VO a cada 8 horas, por 5 dias (giardíase)', ['antibiotic', 'nitroimidazole'], 'par-metro'),
          rxAltaMed('par-metro-ameba', 'Metronidazol 750 mg — VO a cada 8 horas, por 7 a 10 dias (amebíase intestinal)', ['antibiotic', 'nitroimidazole'], 'par-metro')
        ], 'Disenteria grave, abscesso hepático ou desidratação importante exigem reavaliação hospitalar.', ['antibiotic'])
      ]
    }]
  }
];

const RX_HOME_RESIDUAL = [
  {
    id: 'fissura-anal',
    name: 'Fissura anal (alta ambulatorial)',
    icon: '🩹',
    aliases: ['fissura anal', 'dor ao evacuar', 'sangue vivo nas fezes'],
    groups: [{
      id: 'fis-local',
      label: 'Medidas locais e fezes macias',
      options: [
        rxAltaOption('fis-cuidados', '1ª linha', 'Banho de assento e laxativo osmótico', [
          rxAltaMed('fis-banho', 'Banho de assento morno — 10 a 15 minutos, 2 a 3 vezes ao dia', []),
          rxAltaMed('fis-lactulose', 'Lactulose xarope — 15 a 30 mL VO 1 a 2 vezes ao dia, até fezes macias; aumentar fibras e água', ['laxative'])
        ], 'Evitar esforço evacuatório e opioides. Abscesso, fístula ou fissura crônica refratária exigem proctologia.')
      ]
    }, {
      id: 'fis-topico',
      label: 'Relaxante esfincteriano tópico',
      options: [
        rxAltaOption('fis-pomada', '1ª linha', 'Pomada — escolha uma', [
          rxAltaMed('fis-diltiazem', 'Diltiazem 2% pomada — aplicar fina camada na fissura 3 vezes ao dia, por 6 a 8 semanas', []),
          rxAltaMed('fis-nifedipino', 'Nifedipino 0,2% a 0,3% pomada — aplicar fina camada na fissura 3 vezes ao dia, por 6 a 8 semanas', [])
        ], 'Nitroglicerina tópica pode causar cefaleia intensa. Reavaliar se dor ou sangramento persistirem além de 6–8 semanas.')
      ]
    }]
  },
  {
    id: 'artralgia-dor-msk',
    name: 'Dor musculoesquelética (alta ambulatorial)',
    icon: '🦴',
    aliases: ['artralgia', 'dor muscular', 'dor articular', 'entorse'],
    groups: [{
      id: 'msk-analgesia',
      label: 'Analgesia oral — sem sinais de alarme',
      options: [
        rxAltaOption('msk-analgesico', '1ª linha', 'Analgésico — escolha um', [
          rxAltaMed('msk-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'msk-analgesia'),
          rxAltaMed('msk-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'msk-analgesia'),
          rxAltaMed('msk-ibuprofeno', 'Ibuprofeno 400 mg — 1 comprimido VO a cada 8 horas, após alimentação, por até 5 a 7 dias', ['nsaid'], 'msk-analgesia')
        ], 'Repouso relativo, gelo 20 minutos 3–4 vezes ao dia e elevação. Febre, articulação quente monoarticular, déficit neurovascular ou trauma com deformidade impedem alta simples.')
      ]
    }]
  },
  {
    id: 'tosse',
    name: 'Tosse (alta ambulatorial)',
    icon: '😷',
    aliases: ['tosse', 'tosse seca', 'tosse produtiva'],
    groups: [{
      id: 'tosse-suporte',
      label: 'Pós-viral / suporte',
      options: [
        rxAltaOption('tosse-sintomatico', '1ª linha', 'Hidratação e sintomáticos', [
          rxAltaMed('tosse-hidratar', 'Hidratação oral abundante e umidificação do ambiente; evitar antitussígenos de rotina', []),
          rxAltaMed('tosse-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'])
        ], 'Tosse pós-infecciosa pode durar semanas. Retornar se hemoptise, dispneia, febre persistente ou tosse > 3 semanas com perda de peso/sudorese (investigar TB).')
      ]
    }, {
      id: 'tosse-produtiva',
      label: 'Produtiva com critério bacteriano — se indicado',
      options: [
        rxAltaOption('tosse-atb', 'Se indicado', 'Antibiótico oral — escolha um', [
          rxAltaMed('tosse-amox', 'Amoxicilina 500 mg — 1 cápsula VO a cada 8 horas, por 5 dias', ['antibiotic', 'penicillin'], 'tosse-atb'),
          rxAltaMed('tosse-azitro', 'Azitromicina 500 mg — 1 comprimido VO 1 vez ao dia, por 3 dias', ['antibiotic', 'macrolide'], 'tosse-atb')
        ], 'Reservar para febre, purulência e duração prolongada. Não usar este modelo se pneumonia, hipoxemia ou hemoptise.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'anemia-ferropriva',
    name: 'Anemia ferropriva estável (alta ambulatorial)',
    icon: '🩸',
    aliases: ['anemia ferropriva', 'falta de ferro', 'anemia'],
    groups: [{
      id: 'anemia-ferro',
      label: 'Reposição oral — paciente estável',
      options: [
        rxAltaOption('anemia-sulfato', '1ª linha', 'Ferro oral', [
          rxAltaMed('anemia-sulfato-ferroso', 'Sulfato ferroso 40 mg de ferro elementar por comprimido — 1 a 2 comprimidos VO 1 vez ao dia, preferencialmente em jejum ou com vitamina C, por pelo menos 8 a 12 semanas', [])
        ], 'Não usar se instabilidade, sangramento ativo ou Hb crítica. Homens e mulheres pós-menopausa precisam investigar sangramento oculto. Retorno em 4–8 semanas com hemograma.')
      ]
    }]
  },
  {
    id: 'flebite',
    name: 'Tromboflebite superficial leve (alta ambulatorial)',
    icon: '🦵',
    aliases: ['flebite', 'tromboflebite', 'cordao venoso'],
    groups: [{
      id: 'fleb-local',
      label: 'Medidas locais e analgesia',
      options: [
        rxAltaOption('fleb-cuidados', '1ª linha', 'Elevação e analgésico — escolha um', [
          rxAltaMed('fleb-elevar', 'Elevar o membro, compressa morna e caminhar conforme tolerância; evitar novo acesso venoso no mesmo membro', []),
          rxAltaMed('fleb-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'fleb-analgesia'),
          rxAltaMed('fleb-ibuprofeno', 'Ibuprofeno 400 mg — 1 comprimido VO a cada 8 horas, após alimentação, por até 5 dias', ['nsaid'], 'fleb-analgesia')
        ], 'Extensão > 5 cm, proximidade da junção safeno-femoral, edema importante ou suspeita de TVP exigem Doppler e decisão sobre anticoagulação — não liberar anticoagulação automática neste modelo.')
      ]
    }]
  },
  {
    id: 'varizes-mmi',
    name: 'Varizes / insuficiência venosa (alta ambulatorial)',
    icon: '🦵',
    aliases: ['varizes', 'insuficiencia venosa', 'pernas inchadas'],
    groups: [{
      id: 'var-conservador',
      label: 'Medidas conservadoras',
      options: [
        rxAltaOption('var-compressao', '1ª linha', 'Compressão e elevação', [
          rxAltaMed('var-meia', 'Meia elástica de compressão 20–30 mmHg — usar durante o dia; elevar as pernas e caminhar regularmente', []),
          rxAltaMed('var-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'])
        ], 'Sangramento varicoso, tromboflebite proximal ou úlcera ativa exigem reavaliação. Encaminhar vascular se sintomático refratário.')
      ]
    }]
  },
  {
    id: 'ulcera-varicosa',
    name: 'Úlcera varicosa (alta ambulatorial)',
    icon: '🩹',
    aliases: ['ulcera varicosa', 'ulcera de perna', 'ferida na perna'],
    groups: [{
      id: 'uv-curativo',
      label: 'Cuidados da ferida',
      options: [
        rxAltaOption('uv-limpeza', '1ª linha', 'Limpeza e cobertura', [
          rxAltaMed('uv-sf', 'Limpar com solução fisiológica 0,9%, secar e cobrir com curativo limpo; trocar conforme exsudato; elevar o membro', [])
        ], 'Confirmar pulsos/ITB antes de compressão forte. Úlcera > 6 meses ou suspeita arterial/neoplásica exige encaminhamento.')
      ]
    }, {
      id: 'uv-celulite',
      label: 'Celulite perilesional — se indicado',
      options: [
        rxAltaOption('uv-atb', 'Se indicado', 'Antibiótico oral — escolha um', [
          rxAltaMed('uv-cefalexina', 'Cefalexina 500 mg — 1 cápsula VO a cada 6 horas, por 7 dias', ['antibiotic'], 'uv-atb'),
          rxAltaMed('uv-clindamicina', 'Clindamicina 300 mg — 1 cápsula VO a cada 6 horas, por 7 dias (alergia imediata a beta-lactâmico)', ['antibiotic'], 'uv-atb')
        ], 'Antibiótico apenas se celulite franca. Compressão contínua diurna quando ITB permitir.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'ulceras-genitais',
    name: 'Úlceras genitais (alta ambulatorial)',
    icon: '🩺',
    aliases: ['ulcera genital', 'herpes genital', 'cancro'],
    groups: [{
      id: 'ug-herpes',
      label: 'Herpes genital — vesículas dolorosas',
      options: [
        rxAltaOption('ug-aciclovir', '1ª linha', 'Antiviral oral — escolha um', [
          rxAltaMed('ug-aciclovir-400', 'Aciclovir 400 mg — 1 comprimido VO a cada 8 horas, por 7 a 10 dias', ['antiviral'], 'ug-hsv'),
          rxAltaMed('ug-valaciclovir', 'Valaciclovir 500 mg — 1 comprimido VO a cada 12 horas, por 7 a 10 dias', ['antiviral'], 'ug-hsv')
        ], 'Abstinência até cicatrização. Solicitar sorologias conforme protocolo e notificar parceiros.', ['antiviral'])
      ]
    }, {
      id: 'ug-cancro',
      label: 'Cancro mole / LGV — se indicado',
      options: [
        rxAltaOption('ug-atb', 'Se indicado', 'Antibiótico oral — escolha um', [
          rxAltaMed('ug-azitro', 'Azitromicina 1 g — 2 comprimidos de 500 mg VO dose única (cancro mole)', ['antibiotic', 'macrolide'], 'ug-atb'),
          rxAltaMed('ug-doxi', 'Doxiciclina 100 mg — 1 comprimido VO a cada 12 horas, por 21 dias (LGV) ou 14 dias (sífilis se alergia à penicilina e sem gestação)', ['antibiotic'], 'ug-atb')
        ], 'Sífilis precoce: penicilina benzatina intramuscular deve ser aplicada no serviço. Gestação e neurosífilis exigem protocolo específico.', ['antibiotic'])
      ]
    }]
  },
  {
    id: 'soluco-persistente',
    name: 'Soluço persistente (alta ambulatorial)',
    icon: '😮',
    aliases: ['soluco', 'soluco persistente', 'hiccup'],
    groups: [{
      id: 'soluco-vo',
      label: 'Tratamento oral após exclusão de causa urgente',
      options: [
        rxAltaOption('soluco-escolha', '1ª linha', 'Escolha um', [
          rxAltaMed('soluco-metoclopramida', 'Metoclopramida 10 mg — 1 comprimido VO a cada 8 horas, por até 3 a 5 dias', ['antiemetic'], 'soluco-tx'),
          rxAltaMed('soluco-baclofeno', 'Baclofeno 10 mg — 1 comprimido VO a cada 8 horas, por até 5 a 7 dias (ajustar conforme sedação)', [], 'soluco-tx')
        ], 'Investigar eletrólitos, medicamentos e irritação diafragmática. Soluço > 48 h sem resposta ou com sinais de alarme exige reavaliação.')
      ]
    }]
  },
  {
    id: 'mononucleose',
    name: 'Mononucleose (alta ambulatorial)',
    icon: '🤒',
    aliases: ['mononucleose', 'ebv', 'doenca do beijo'],
    groups: [{
      id: 'mono-suporte',
      label: 'Suporte — sem amoxicilina',
      options: [
        rxAltaOption('mono-sintomatico', '1ª linha', 'Analgésico/antitérmico — escolha um', [
          rxAltaMed('mono-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'mono-analgesia'),
          rxAltaMed('mono-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'mono-analgesia')
        ], 'Não prescrever amoxicilina/ampicilina (rash clássico). Evitar esportes de contato por 3–4 semanas se esplenomegalia. Retornar se dor abdominal intensa, icterícia ou dispneia.')
      ]
    }]
  },
  {
    id: 'diverticulite',
    name: 'Diverticulite não complicada (alta ambulatorial)',
    icon: '🩺',
    aliases: ['diverticulite', 'dor em fossa iliaca esquerda'],
    groups: [{
      id: 'div-atb',
      label: 'Antibiótico oral — Hinchey baixa / sem complicação',
      options: [
        rxAltaOption('div-atb-escolha', '1ª linha', 'Esquema oral — escolha um', [
          rxAltaMed('div-amoxclav', 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 7 a 10 dias', ['antibiotic', 'penicillin'], 'div-atb'),
          rxAltaMed('div-cipro-metro', 'Ciprofloxacino 500 mg VO a cada 12 horas + metronidazol 500 mg VO a cada 8 horas, por 7 a 10 dias (alergia a penicilina)', ['antibiotic'], 'div-atb')
        ], 'Dieta líquida progressiva e retorno em 48–72 horas. Abscesso, peritonite, febre alta, intolerância oral ou idade/comorbidade elevada exigem internação.', ['antibiotic'])
      ]
    }, {
      id: 'div-analgesia',
      label: 'Analgesia oral',
      options: [
        rxAltaOption('div-analgesico', 'Adjuvante', 'Analgésico — escolha um', [
          rxAltaMed('div-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'div-analgesia'),
          rxAltaMed('div-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'div-analgesia')
        ], 'Evitar opioides se possível (pioram íleo/constipação).')
      ]
    }]
  }
];

const RX_HOME_COMPLEX = [
  {
    id: 'pneumonia-comunitaria',
    name: 'Pneumonia comunitária leve (alta ambulatorial)',
    icon: '🫁',
    aliases: ['pneumonia', 'pac', 'pneumonia comunitaria'],
    groups: [{
      id: 'pn-atb',
      label: 'Antibiótico oral — CURB-65 baixo / apto à VO',
      options: [
        rxAltaOption('pn-atb-escolha', '1ª linha', 'Esquema oral — escolha um', [
          rxAltaMed('pn-amoxclav', 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', ['antibiotic', 'penicillin'], 'pn-atb'),
          rxAltaMed('pn-amox', 'Amoxicilina 1 g — 1 comprimido VO a cada 8 horas, por 5 a 7 dias (sem comorbidades)', ['antibiotic', 'penicillin'], 'pn-atb'),
          rxAltaMed('pn-levoflox', 'Levofloxacino 750 mg — 1 comprimido VO 1 vez ao dia, por 5 dias (alergia a beta-lactâmico ou falha)', ['antibiotic'], 'pn-atb')
        ], 'Só se CURB-65 baixo, SpO₂ adequada, VO possível e sem critérios de internação. Retornar em 48–72 h se febre, dispneia ou piora.', ['antibiotic'])
      ]
    }, {
      id: 'pn-sintomatico',
      label: 'Sintomáticos',
      options: [
        rxAltaOption('pn-analgesico', 'Adjuvante', 'Analgésico/antitérmico — escolha um', [
          rxAltaMed('pn-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'pn-analgesia'),
          rxAltaMed('pn-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia), por até 5 dias', ['analgesic_non_opioid'], 'pn-analgesia')
        ], 'Hidratação e repouso relativo. Não copiar ciclos inalatórios da unidade para a receita de casa.')
      ]
    }]
  },
  {
    id: 'pielonefrite',
    name: 'Pielonefrite não complicada (alta ambulatorial)',
    icon: '🩺',
    aliases: ['pielonefrite', 'itu alta', 'infeccao urinaria alta'],
    groups: [{
      id: 'pielo-atb',
      label: 'Antibiótico oral — estável, VO possível',
      options: [
        rxAltaOption('pielo-atb-escolha', '1ª linha', 'Esquema oral — escolha um', [
          rxAltaMed('pielo-cipro', 'Ciprofloxacino 500 mg — 1 comprimido VO a cada 12 horas, por 7 dias', ['antibiotic'], 'pielo-atb'),
          rxAltaMed('pielo-amoxclav', 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 10 a 14 dias', ['antibiotic', 'penicillin'], 'pielo-atb'),
          rxAltaMed('pielo-cefuroxima', 'Cefuroxima 500 mg — 1 comprimido VO a cada 12 horas, por 10 a 14 dias', ['antibiotic'], 'pielo-atb')
        ], 'Só se afebril ou em defervescência, sem vômitos, sem sepse e sem obstrução. Gestação, uropatia e imunodepressão exigem outra via.', ['antibiotic'])
      ]
    }, {
      id: 'pielo-analgesia',
      label: 'Analgesia oral',
      options: [
        rxAltaOption('pielo-analgesico', 'Adjuvante', 'Analgésico — escolha um', [
          rxAltaMed('pielo-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'pielo-analgesia'),
          rxAltaMed('pielo-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'pielo-analgesia')
        ], 'Retornar se febre persistente > 48–72 h, vômitos ou dor lombar intensa.')
      ]
    }]
  },
  {
    id: 'tvp',
    name: 'TVP de baixo risco (alta ambulatorial)',
    icon: '🦵',
    aliases: ['tvp', 'trombose venosa profunda', 'trombose'],
    groups: [{
      id: 'tvp-anticoag',
      label: 'Anticoagulação oral — após confirmação e exclusão de contraindicação',
      options: [
        rxAltaOption('tvp-doac', '1ª linha', 'Anticoagulante oral — escolha um', [
          rxAltaMed('tvp-rivaro', 'Rivaroxabana 15 mg — 1 comprimido VO a cada 12 horas, por 21 dias; depois 20 mg VO 1 vez ao dia com alimentação (duração conforme risco e orientação vascular)', ['anticoagulant'], 'tvp-doac'),
          rxAltaMed('tvp-apixa', 'Apixabana 10 mg — 1 comprimido VO a cada 12 horas, por 7 dias; depois 5 mg VO a cada 12 horas (duração conforme risco)', ['anticoagulant'], 'tvp-doac')
        ], 'Confirmar TVP por Doppler. Não usar se sangramento ativo, plaquetopenia grave, gestação ou necessidade de procedimento urgente. Orientar sinais de TEP e sangramento.', ['anticoagulant'])
      ]
    }, {
      id: 'tvp-suporte',
      label: 'Medidas de suporte',
      options: [
        rxAltaOption('tvp-cuidados', 'Adjuvante', 'Elevação e analgesia', [
          rxAltaMed('tvp-elevar', 'Elevar o membro, deambular conforme orientação e evitar imobilização prolongada', []),
          rxAltaMed('tvp-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 5 dias', ['analgesic_non_opioid'])
        ], 'Compressão elástica conforme avaliação. Retorno vascular programado.')
      ]
    }]
  },
  {
    id: 'dengue',
    name: 'Dengue grupo A (alta ambulatorial)',
    icon: '🦟',
    aliases: ['dengue', 'arbovirose', 'febre dengue'],
    groups: [{
      id: 'dengue-hidrata',
      label: 'Hidratação e sintomáticos — sem AINE',
      options: [
        rxAltaOption('dengue-suporte', '1ª linha', 'Hidratação oral e paracetamol', [
          rxAltaMed('dengue-soro', 'Soro de reidratação oral ou água/isotônico — volume generoso conforme orientação; manter diurese', []),
          rxAltaMed('dengue-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia), enquanto houver sintomas', ['analgesic_non_opioid'])
        ], 'Não usar dipirona de rotina se preferir paracetamol exclusivo; jamais AINE ou AAS (risco hemorrágico). Retorno imediato se dor abdominal intensa, vômitos, sangramento, sonolência, hipotensão ou queda abrupta da febre com piora.')
      ]
    }]
  },
  {
    id: 'chikungunya',
    name: 'Chikungunya (alta ambulatorial)',
    icon: '🦟',
    aliases: ['chikungunya', 'chik', 'febre chikungunya'],
    groups: [{
      id: 'chik-analgesia',
      label: 'Analgesia — após excluir dengue aguda com risco',
      options: [
        rxAltaOption('chik-analgesico', '1ª linha', 'Analgésico — escolha um', [
          rxAltaMed('chik-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor ou febre (máximo 3 g/dia)', ['analgesic_non_opioid'], 'chik-analgesia'),
          rxAltaMed('chik-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor ou febre (máximo 4 g/dia)', ['analgesic_non_opioid'], 'chik-analgesia'),
          rxAltaMed('chik-ibuprofeno', 'Ibuprofeno 400 mg — 1 comprimido VO a cada 8 horas, após alimentação, por até 5 a 7 dias (só se dengue descartada)', ['nsaid'], 'chik-analgesia')
        ], 'Na fase febril inicial, preferir paracetamol até afastar dengue. Artralgia intensa pode exigir reavaliação reumatológica se persistir semanas.')
      ]
    }]
  },
  {
    id: 'edema-mmi',
    name: 'Edema de membros inferiores (alta ambulatorial)',
    icon: '🦵',
    aliases: ['edema mmi', 'pernas inchadas', 'edema de membros'],
    groups: [{
      id: 'edema-cuidados',
      label: 'Medidas gerais — após excluir TVP/IC descompensada',
      options: [
        rxAltaOption('edema-conservador', '1ª linha', 'Elevação e compressão', [
          rxAltaMed('edema-elevar', 'Elevar as pernas acima do nível do coração várias vezes ao dia; restringir sal; meia elástica se não houver contraindicação arterial', []),
          rxAltaMed('edema-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'])
        ], 'Não iniciar diurético às cegas. Dispneia, dor unilateral súbita, crepitações ou anasarca exigem reavaliação urgente.')
      ]
    }]
  },
  {
    id: 'sindrome-vestibular',
    name: 'Síndrome vestibular periférica (alta ambulatorial)',
    icon: '🌀',
    aliases: ['vertigem', 'labirintite', 'sindrome vestibular'],
    groups: [{
      id: 'vest-sintomatico',
      label: 'Sintomáticos — após excluir central',
      options: [
        rxAltaOption('vest-antiemetico', '1ª linha', 'Antivertiginoso — escolha um', [
          rxAltaMed('vest-dimenidrinato', 'Dimenidrinato 50 mg — 1 comprimido VO a cada 6 a 8 horas, se vertigem, por até 3 a 5 dias', ['antiemetic'], 'vest-tx'),
          rxAltaMed('vest-meclizina', 'Meclizina 25 mg — 1 comprimido VO a cada 8 a 12 horas, se vertigem, por até 3 a 5 dias', ['antiemetic'], 'vest-tx'),
          rxAltaMed('vest-ondansetrona', 'Ondansetrona 4 a 8 mg — VO a cada 8 horas, se náusea intensa, por até 3 dias', ['antiemetic'], 'vest-tx')
        ], 'Déficit neurológico focal, cefaleia súbita, diplopia ou ataxia progressiva impedem alta simples. Evitar sedativos prolongados em idosos.')
      ]
    }]
  },
  {
    id: 'ansiedade-crise',
    name: 'Crise de ansiedade (alta ambulatorial)',
    icon: '💭',
    aliases: ['ansiedade', 'panico', 'crise de panico'],
    groups: [{
      id: 'ans-controle',
      label: 'Controle sintomático curto — sem organicidade',
      options: [
        rxAltaOption('ans-escolha', '1ª linha', 'Ansiolítico leve — escolha um', [
          rxAltaMed('ans-hidroxizina', 'Hidroxizina 25 mg — 1 comprimido VO a cada 8 a 12 horas, se ansiedade, por até 3 a 5 dias', [], 'ans-tx'),
          rxAltaMed('ans-clonazepam', 'Clonazepam 0,5 mg — 1 comprimido VO se crise intensa (máximo 1 a 2 mg/dia), por até 3 dias', [], 'ans-tx')
        ], 'Excluir SCA, asma, hipoglicemia e tireotoxicose. Evitar dirigir sob sedação. Encaminhar saúde mental se recorrente; benzodiazepínico só por período muito curto.')
      ]
    }]
  },
  {
    id: 'desconforto-abdominal',
    name: 'Desconforto abdominal inespecífico (alta ambulatorial)',
    icon: '🩺',
    aliases: ['desconforto abdominal', 'dor abdominal leve', 'gases'],
    groups: [{
      id: 'abd-sintomatico',
      label: 'Sintomáticos — sem abdome agudo',
      options: [
        rxAltaOption('abd-escolha', '1ª linha', 'Analgésico/antiespasmódico — escolha', [
          rxAltaMed('abd-butilescopolamina', 'Butilbrometo de escopolamina 10 mg — 1 comprimido VO a cada 8 horas, se cólica, por até 3 dias', [], 'abd-tx'),
          rxAltaMed('abd-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'abd-tx'),
          rxAltaMed('abd-simeticona', 'Simeticona 40 a 80 mg — VO a cada 8 horas, se flatulência, por até 3 dias', [], 'abd-tx')
        ], 'Defesa, febre, vômitos incoercíveis, sangue ou dor migratória para fossa iliaca exigem reavaliação — não usar este modelo.')
      ]
    }]
  },
  {
    id: 'alergia-anafilaxia',
    name: 'Pós-anafilaxia (alta após observação)',
    icon: '⚠️',
    aliases: ['anafilaxia', 'alergia grave', 'choque anafilatico'],
    groups: [{
      id: 'ana-plano',
      label: 'Plano de alta — após observação adequada',
      options: [
        rxAltaOption('ana-adrenalina', 'Essencial', 'Adrenalina autoinjetável e anti-histamínico', [
          rxAltaMed('ana-autoinjetor', 'Adrenalina autoinjetável 0,3 mg — aplicar no meio da face anterolateral da coxa conforme o dispositivo, se nova reação grave; procurar emergência imediatamente após o uso', []),
          rxAltaMed('ana-loratadina', 'Loratadina 10 mg — 1 comprimido VO 1 vez ao dia, por 3 a 5 dias', ['antihistamine']),
          rxAltaMed('ana-prednisona', 'Prednisona 40 mg — 1 comprimido VO 1 vez ao dia, por 3 a 5 dias (se indicado pelo quadro)', ['corticosteroid'])
        ], 'Alta só após observação. Evitar o alérgeno. Orientar retorno imediato se recidiva. Não substituir observação por receita.')
      ]
    }]
  },
  {
    id: 'edema-angioneurotico',
    name: 'Angioedema leve estável (alta após observação)',
    icon: '😮',
    aliases: ['angioedema', 'edema angioneurotico', 'edema de glote leve'],
    groups: [{
      id: 'angio-vo',
      label: 'Tratamento oral — vias aéreas estáveis',
      options: [
        rxAltaOption('angio-anti', '1ª linha', 'Anti-histamínico ± corticoide', [
          rxAltaMed('angio-loratadina', 'Loratadina 10 mg — 1 comprimido VO 1 vez ao dia, por 3 a 5 dias', ['antihistamine'], 'angio-tx'),
          rxAltaMed('angio-prednisona', 'Prednisona 40 mg — 1 comprimido VO 1 vez ao dia, por 3 a 5 dias', ['corticosteroid'], 'angio-tx')
        ], 'Estridor, disfagia, hipotensão ou uso de IECA com progressão exigem conduta hospitalar. Revisar IECA/ARA2 quando aplicável.')
      ]
    }]
  },
  {
    id: 'queimaduras',
    name: 'Queimadura leve (alta ambulatorial)',
    icon: '🔥',
    aliases: ['queimadura', 'queimadura leve', 'burn'],
    groups: [{
      id: 'queim-local',
      label: 'Cuidados locais — pequena extensão, sem 3º grau',
      options: [
        rxAltaOption('queim-curativo', '1ª linha', 'Limpeza e cobertura', [
          rxAltaMed('queim-sf', 'Limpar com solução fisiológica 0,9%, secar e cobrir com curativo limpo não aderente; trocar conforme exsudato', []),
          rxAltaMed('queim-sulfadiazina', 'Sulfadiazina de prata 1% creme — aplicar camada fina 1 a 2 vezes ao dia sob curativo, se indicado (evitar face/áreas extensas sem orientação)', [])
        ], 'Queimadura de mão/face/períneo, circunferencial, elétrica, química ou > pequena área exige avaliação especializada.')
      ]
    }, {
      id: 'queim-analgesia',
      label: 'Analgesia oral',
      options: [
        rxAltaOption('queim-analgesico', 'Adjuvante', 'Analgésico — escolha um', [
          rxAltaMed('queim-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'queim-analgesia'),
          rxAltaMed('queim-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'queim-analgesia'),
          rxAltaMed('queim-ibuprofeno', 'Ibuprofeno 400 mg — 1 comprimido VO a cada 8 horas, após alimentação, por até 3 dias', ['nsaid'], 'queim-analgesia')
        ], 'Atualizar antitetânica conforme calendário.')
      ]
    }]
  },
  {
    id: 'antiparasitarios',
    name: 'Antiparasitários (alta ambulatorial)',
    icon: '🦠',
    aliases: ['antiparasitario', 'vermes', 'parasitose'],
    groups: [{
      id: 'anti-par',
      label: 'Esquema oral comum',
      options: [
        rxAltaOption('anti-albendazol', '1ª linha', 'Benzimidazol', [
          rxAltaMed('anti-albendazol-400', 'Albendazol 400 mg — 1 comprimido VO dose única; repetir em 14 dias se oxiurose e tratar contactantes', ['antiparasitic'])
        ], 'Confirmar indicação clínica/laboratorial. Gestação no 1º trimestre: evitar albendazol sem orientação específica.')
      ]
    }]
  },
  {
    id: 'ascaridiase',
    name: 'Ascaridíase (alta ambulatorial)',
    icon: '🦠',
    aliases: ['ascaris', 'ascaridiase', 'lombriga'],
    groups: [{
      id: 'asc-tx',
      label: 'Tratamento oral',
      options: [
        rxAltaOption('asc-albendazol', '1ª linha', 'Benzimidazol — escolha um', [
          rxAltaMed('asc-albendazol-400', 'Albendazol 400 mg — 1 comprimido VO dose única', ['antiparasitic'], 'asc-tx'),
          rxAltaMed('asc-mebendazol', 'Mebendazol 100 mg — 1 comprimido VO a cada 12 horas, por 3 dias', ['antiparasitic'], 'asc-tx')
        ], 'Obstrução intestinal ou migração ectópica exigem conduta hospitalar.')
      ]
    }]
  },
  {
    id: 'anemia-falciforme',
    name: 'Crise álgica falciforme leve (alta ambulatorial)',
    icon: '🩸',
    aliases: ['anemia falciforme', 'drepanocitose', 'crise falciforme'],
    groups: [{
      id: 'falc-analgesia',
      label: 'Analgesia oral — após melhora na unidade',
      options: [
        rxAltaOption('falc-analgesico', '1ª linha', 'Analgésico — escolha um', [
          rxAltaMed('falc-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 a 5 dias', ['analgesic_non_opioid'], 'falc-analgesia'),
          rxAltaMed('falc-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 a 5 dias', ['analgesic_non_opioid'], 'falc-analgesia'),
          rxAltaMed('falc-ibuprofeno', 'Ibuprofeno 400 mg — 1 comprimido VO a cada 8 horas, após alimentação, por até 3 dias (se sem contraindicação renal)', ['nsaid'], 'falc-analgesia')
        ], 'Hidratação oral generosa. Febre, tórax agudo, déficit neurológico, priapismo ou dor refratária impedem alta. Manter ácido fólico se já em uso crônico.')
      ]
    }]
  },
  {
    id: 'tuberculose',
    name: 'Tuberculose — esquema básico (alta ambulatorial)',
    icon: '🫁',
    aliases: ['tuberculose', 'tb', 'tisiologia'],
    groups: [{
      id: 'tb-rhze',
      label: 'Fase intensiva — sob programa de TB',
      options: [
        rxAltaOption('tb-esquema', '1ª linha', 'RHZE combinado conforme peso', [
          rxAltaMed('tb-rhze', 'Comprimido RHZE (rifampicina + isoniazida + pirazinamida + etambutol) — dose conforme faixa de peso, VO 1 vez ao dia em jejum, por 2 meses na fase intensiva; seguir com RH conforme protocolo do serviço de TB', ['antitubercular'])
        ], 'Notificação compulsória e vinculação ao programa de TB são obrigatórias. Não iniciar/ajustar esquema fora do protocolo oficial. Orientar hepatotoxicidade e retorno imediato se icterícia ou neuropatia.')
      ]
    }]
  }
];

const RX_HOME_ORIENTACOES = [
  {
    id: 'ameaca-aborto',
    name: 'Ameaça de aborto estável (alta orientada)',
    icon: '🤰',
    aliases: ['ameaca de aborto', 'sangramento na gestacao', 'sangramento primeiro trimestre'],
    groups: [{
      id: 'aborto-suporte',
      label: 'Suporte após avaliação obstétrica',
      options: [
        rxAltaOption('aborto-analgesia', '1ª linha', 'Analgesia segura e orientação', [
          rxAltaMed('aborto-paracetamol', 'Paracetamol 500 a 750 mg — 1 comprimido VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid']),
          rxAltaMed('aborto-repouso', 'Repouso relativo e evitar relações sexuais enquanto houver sangramento, conforme orientação obstétrica', [])
        ], 'Só liberar após confirmar gestação intrauterina/viabilidade e excluir ectópica. Não iniciar progesterona automaticamente; usar apenas se prescrita pela obstetrícia. Retorno imediato se dor intensa, síncope, febre ou aumento do sangramento.')
      ]
    }]
  },
  {
    id: 'corpo-estranho-ocular',
    name: 'Corpo estranho ocular superficial (pós-remoção)',
    icon: '👁️',
    aliases: ['corpo estranho ocular', 'cisco no olho', 'abrasao corneana'],
    groups: [{
      id: 'ceo-pos-remocao',
      label: 'Pós-remoção sem perfuração',
      options: [
        rxAltaOption('ceo-colirio', '1ª linha', 'Antibiótico tópico — escolha um', [
          rxAltaMed('ceo-tobra', 'Tobramicina 0,3% colírio — instilar 1 gota no olho afetado a cada 6 horas, por 5 dias', ['antibiotic'], 'ceo-atb'),
          rxAltaMed('ceo-cipro', 'Ciprofloxacino 0,3% colírio — instilar 1 gota no olho afetado a cada 6 horas, por 5 dias', ['antibiotic'], 'ceo-atb'),
          rxAltaMed('ceo-eritro', 'Eritromicina 0,5% pomada oftálmica — aplicar pequena faixa no olho afetado a cada 6 horas, por 5 dias', ['antibiotic'], 'ceo-atb')
        ], 'Somente após remoção completa e teste de Seidel negativo. Não prescrever anestésico tópico para casa. Suspeita de perfuração, perda visual ou corpo estranho incrustado exige escudo ocular e oftalmologia.')
      ]
    }, {
      id: 'ceo-analgesia',
      label: 'Analgesia oral',
      options: [
        rxAltaOption('ceo-analgesico', 'Adjuvante', 'Analgésico — escolha um', [
          rxAltaMed('ceo-paracetamol', 'Paracetamol 500 a 750 mg — VO a cada 6 a 8 horas, se dor (máximo 3 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'ceo-analgesia'),
          rxAltaMed('ceo-dipirona', 'Dipirona 500 mg a 1 g — VO a cada 6 a 8 horas, se dor (máximo 4 g/dia), por até 3 dias', ['analgesic_non_opioid'], 'ceo-analgesia')
        ], 'Reavaliar em 24–48 horas se abrasão corneana extensa; retornar antes se piora da dor ou visão.')
      ]
    }]
  },
  {
    id: 'epistaxe',
    name: 'Epistaxe controlada (alta ambulatorial)',
    icon: '🩸',
    aliases: ['epistaxe', 'sangramento nasal', 'nariz sangrando'],
    groups: [{
      id: 'epi-cuidados',
      label: 'Prevenção de ressangramento',
      options: [
        rxAltaOption('epi-hidratacao', '1ª linha', 'Hidratação nasal e compressão', [
          rxAltaMed('epi-soro', 'Solução fisiológica 0,9% spray nasal — aplicar em cada narina 3 a 6 vezes ao dia, por 5 a 7 dias', []),
          rxAltaMed('epi-gel', 'Gel nasal salino — aplicar fina camada na porção anterior das narinas 2 vezes ao dia, por 5 a 7 dias', [])
        ], 'Se recidivar: sentar, inclinar para frente e comprimir a parte mole do nariz continuamente por 10–15 minutos. Não assoar o nariz por 48 horas. Sangramento posterior, instabilidade ou falha do tamponamento impedem alta.')
      ]
    }]
  },
  {
    id: 'hipoglicemia-grave',
    name: 'Plano pós-hipoglicemia grave (alta segura)',
    icon: '🍬',
    aliases: ['hipoglicemia grave', 'glicose baixa', 'hipoglicemia'],
    groups: [{
      id: 'hipo-resgate',
      label: 'Plano domiciliar de resgate',
      options: [
        rxAltaOption('hipo-carbo', 'Essencial', 'Carboidrato de ação rápida', [
          rxAltaMed('hipo-glicose', 'Glicose oral 15 a 20 g — usar ao reconhecer sintomas se estiver consciente e conseguindo engolir; repetir glicemia em 15 minutos e repetir a dose se ainda baixa', []),
          rxAltaMed('hipo-lanche', 'Após corrigir, fazer refeição ou lanche com carboidrato de absorção lenta e proteína', [])
        ], 'Alta somente se a causa estiver identificada, glicemias seriadas estáveis e houver suporte domiciliar. Ajuste de insulina/sulfonilureia deve ser individualizado; não copiar a dose anterior automaticamente.')
      ]
    }, {
      id: 'hipo-glucagon',
      label: 'Resgate por familiar — incapaz de ingerir',
      options: [
        rxAltaOption('hipo-glucagon-nasal', 'Se disponível', 'Glucagon nasal', [
          rxAltaMed('hipo-glucagon-3', 'Glucagon nasal 3 mg — administrar 1 dose em uma narina se inconsciência ou incapacidade de engolir; acionar emergência imediatamente', [])
        ], 'Treinar familiar/cuidador. Não oferecer alimento ou líquido a paciente inconsciente.')
      ]
    }]
  },
  {
    id: 'insolacao',
    name: 'Exaustão pelo calor resolvida (alta orientada)',
    icon: '☀️',
    aliases: ['insolacao', 'exaustao pelo calor', 'golpe de calor'],
    groups: [{
      id: 'calor-hidratacao',
      label: 'Hidratação e prevenção',
      options: [
        rxAltaOption('calor-sro', '1ª linha', 'Reposição oral', [
          rxAltaMed('calor-soro', 'Soro de reidratação oral — beber em pequenos volumes frequentes conforme sede e perdas, até urina clara e regular', []),
          rxAltaMed('calor-ambiente', 'Permanecer em ambiente fresco por 24–48 horas, evitar exercício e exposição solar, usar roupas leves', [])
        ], 'Não usar antitérmico para hipertermia por calor. Alteração de consciência, temperatura central elevada, hipotensão ou disfunção orgânica caracteriza emergência e impede alta.')
      ]
    }]
  },
  {
    id: 'profilaxia-antirrabica',
    name: 'Profilaxia antirrábica (agenda de retorno)',
    icon: '🐕',
    aliases: ['profilaxia antirrabica', 'mordida de animal', 'vacina da raiva'],
    groups: [{
      id: 'raiva-agenda',
      label: 'Cuidados e continuidade no serviço',
      options: [
        rxAltaOption('raiva-retorno', 'Essencial', 'Lavagem e agenda vacinal', [
          rxAltaMed('raiva-ferida', 'Lavar o ferimento com água corrente e sabão por 15 minutos; manter limpo e não ocluir sem avaliação', []),
          rxAltaMed('raiva-agenda', 'Retornar nas datas registradas pelo serviço para completar a vacinação antirrábica; não interromper o esquema por conta própria', [])
        ], 'Vacina e imunoglobulina são aplicadas no serviço conforme categoria da exposição e protocolo vigente. Notificar a exposição e observar cão/gato saudável por 10 dias quando indicado.')
      ]
    }]
  },
  {
    id: 'sangramento-uterino',
    name: 'Sangramento uterino anormal estável (alta ambulatorial)',
    icon: '🩸',
    aliases: ['sangramento uterino', 'sangramento vaginal', 'menorragia'],
    groups: [{
      id: 'sua-controle',
      label: 'Controle do sangramento — gestação excluída',
      options: [
        rxAltaOption('sua-tranexamico', '1ª linha', 'Antifibrinolítico', [
          rxAltaMed('sua-tranex', 'Ácido tranexâmico 1 g — 1 comprimido VO a cada 8 horas, por até 5 dias enquanto houver sangramento intenso', [])
        ], 'Contraindicado em trombose ativa ou alto risco trombótico. Confirmar teste de gestação negativo e estabilidade hemodinâmica antes da alta.')
      ]
    }, {
      id: 'sua-hormonal',
      label: 'Controle hormonal — se indicado pela ginecologia',
      options: [
        rxAltaOption('sua-progestageno', 'Alternativa', 'Progestagênio — escolha um', [
          rxAltaMed('sua-noretisterona', 'Noretisterona 5 mg — 1 comprimido VO a cada 8 horas, conforme plano de desmame prescrito pela ginecologia', [], 'sua-hormonal'),
          rxAltaMed('sua-medroxi', 'Medroxiprogesterona 10 mg — 1 comprimido VO a cada 12 horas, conforme plano prescrito pela ginecologia', [], 'sua-hormonal')
        ], 'Não iniciar hormônio automaticamente: revisar risco trombótico, contraindicações e causa PALM-COEIN. Seguimento ginecológico em 1–2 semanas.')
      ]
    }]
  },
  {
    id: 'sincope',
    name: 'Síncope reflexa de baixo risco (alta orientada)',
    icon: '💫',
    aliases: ['sincope', 'desmaio', 'vasovagal'],
    groups: [{
      id: 'sincope-medidas',
      label: 'Medidas não farmacológicas — ECG normal',
      options: [
        rxAltaOption('sincope-hidratar', '1ª linha', 'Hidratação e manobras preventivas', [
          rxAltaMed('sincope-agua', 'Hidratação oral regular — aumentar ingestão de água ao longo do dia, salvo restrição por insuficiência cardíaca ou renal', []),
          rxAltaMed('sincope-postura', 'Ao perceber pródromos, sentar ou deitar e elevar as pernas; levantar lentamente e evitar longos períodos em pé', [])
        ], 'Somente síncope reflexa de baixo risco, com ECG e avaliação clínica sem sinais de alarme. Não iniciar fludrocortisona ou midodrina automaticamente. Retornar se síncope no esforço, dor torácica, palpitações, dispneia ou recorrência.')
      ]
    }]
  }
];

const RX_CATALOG_MANUAL = [
  ...RX_HOME_RESP_DERM,
  ...RX_HOME_GI_OLHO,
  ...RX_HOME_RESIDUAL,
  ...RX_HOME_COMPLEX,
  ...RX_HOME_ORIENTACOES,
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
  },
  {
    id: 'asma-broncoespasmo',
    name: 'Asma brônquica (alta ambulatorial)',
    icon: '🌬️',
    aliases: [
      'asma', 'asma bronquica', 'asma bronquica (crise) e broncoespasmo', 'broncoespasmo',
      'crise asmatica', 'sibilancia', 'chiado no peito', 'alta de asma'
    ],
    groups: [
      {
        id: 'asma-alivio',
        label: 'Alívio dos sintomas em casa (dose ambulatorial)',
        options: [
          {
            id: 'asma-dom-saba',
            tier: '1ª linha',
            label: 'β₂ de curta ação com espaçador — escolha um',
            classes: ['bronchodilator'],
            noVoExpand: true,
            items: [],
            meds: [
              { id: 'asma-dom-salb', text: 'Salbutamol spray 100 mcg/dose — 2 jatos (200 mcg) com espaçador a cada 4 a 6 horas, se falta de ar ou chiado, por até 7 dias (máximo 8 jatos por dia)', classes: ['bronchodilator'], exclusiveGroup: 'asma-dom-saba' },
              { id: 'asma-dom-fen', text: 'Fenoterol spray 100 mcg/dose — 2 jatos com espaçador a cada 6 a 8 horas, se falta de ar ou chiado, por até 7 dias', classes: ['bronchodilator'], exclusiveGroup: 'asma-dom-saba' }
            ],
            orientacoes: 'Dose de casa é menor que a da crise no hospital: 2 jatos por vez, nunca 4–8 jatos. Se precisar repetir antes de 4 horas ou passar de 8 jatos no dia, procurar atendimento no mesmo dia.'
          }
        ]
      },
      {
        id: 'asma-corticoide-vo',
        label: 'Corticoide oral — curso curto após a crise',
        options: [
          {
            id: 'asma-dom-cort-adulto',
            tier: '1ª linha',
            label: 'Adulto — 5 dias, sem desmame',
            classes: ['corticosteroid'],
            noVoExpand: true,
            items: [],
            meds: [
              { id: 'asma-dom-pred20', text: 'Prednisona 20 mg — 2 comprimidos (40 mg) VO 1 vez ao dia, pela manhã, após o café, por 5 dias', classes: ['corticosteroid'], exclusiveGroup: 'asma-dom-cort-adulto' },
              { id: 'asma-dom-pred5', text: 'Prednisona 5 mg — 8 comprimidos (40 mg) VO 1 vez ao dia, pela manhã, após o café, por 5 dias', classes: ['corticosteroid'], exclusiveGroup: 'asma-dom-cort-adulto' },
              { id: 'asma-dom-predniso20', text: 'Prednisolona 20 mg — 2 comprimidos (40 mg) VO 1 vez ao dia, pela manhã, por 5 dias', classes: ['corticosteroid'], exclusiveGroup: 'asma-dom-cort-adulto' }
            ],
            orientacoes: 'Curso curto de 5 a 7 dias não exige desmame. Cautela em diabetes, úlcera péptica e infecção ativa; orientar tomar após alimentação.'
          },
          {
            id: 'asma-dom-cort-ped',
            tier: 'Pediatria',
            label: 'Criança — 3 a 5 dias',
            classes: ['corticosteroid'],
            noVoExpand: true,
            items: [],
            meds: [
              { id: 'asma-dom-predsol', text: 'Prednisolona 3 mg/mL solução oral — 1 a 2 mg/kg/dia (máximo 40 mg/dia) VO 1 vez ao dia, pela manhã, por 3 a 5 dias', classes: ['corticosteroid'] }
            ],
            orientacoes: 'Ajustar o volume ao peso da criança e anotar a dose em mL na receita. Manter espaçador com máscara conforme a idade.'
          }
        ]
      },
      {
        id: 'asma-manutencao',
        label: 'Manutenção — corticoide inalatório (não suspender)',
        options: [
          {
            id: 'asma-dom-ics',
            tier: '1ª linha',
            label: 'Corticoide inalatório de manutenção — escolha um',
            classes: ['corticosteroid'],
            noVoExpand: true,
            items: [],
            meds: [
              { id: 'asma-dom-budform', text: 'Budesonida/formoterol 200/6 mcg — 1 inalação a cada 12 horas, de manutenção contínua', classes: ['corticosteroid'], exclusiveGroup: 'asma-dom-ics' },
              { id: 'asma-dom-bud', text: 'Budesonida spray 200 mcg/dose — 1 jato a cada 12 horas, com espaçador, de manutenção contínua', classes: ['corticosteroid'], exclusiveGroup: 'asma-dom-ics' },
              { id: 'asma-dom-becl', text: 'Beclometasona spray 250 mcg/dose — 1 jato a cada 12 horas, com espaçador, de manutenção contínua', classes: ['corticosteroid'], exclusiveGroup: 'asma-dom-ics' }
            ],
            orientacoes: 'Bochechar a boca com água após cada uso, sem engolir. O corticoide inalatório é a base do tratamento: não interromper quando os sintomas melhorarem. Reavaliar a manutenção em consulta ambulatorial.'
          }
        ]
      }
    ]
  },
  {
    id: 'dpoc-exacerbada',
    name: 'DPOC exacerbada (alta ambulatorial)',
    icon: '🫁',
    aliases: [
      'dpoc', 'dpoc exacerbada', 'exacerbacao de dpoc', 'bronquite cronica', 'enfisema',
      'alta de dpoc'
    ],
    groups: [
      {
        id: 'dpoc-alivio',
        label: 'Alívio dos sintomas em casa (dose ambulatorial)',
        options: [
          {
            id: 'dpoc-dom-saba',
            tier: '1ª linha',
            label: 'Broncodilatador de resgate com espaçador',
            classes: ['bronchodilator'],
            noVoExpand: true,
            items: [],
            meds: [
              { id: 'dpoc-dom-salb', text: 'Salbutamol spray 100 mcg/dose — 2 jatos (200 mcg) com espaçador a cada 4 a 6 horas, se falta de ar, por até 7 dias (máximo 8 jatos por dia)', classes: ['bronchodilator'], exclusiveGroup: 'dpoc-dom-saba' },
              { id: 'dpoc-dom-salbipra', text: 'Salbutamol/ipratrópio spray — 2 jatos com espaçador a cada 6 horas, se falta de ar, por até 7 dias', classes: ['bronchodilator'], exclusiveGroup: 'dpoc-dom-saba' }
            ],
            orientacoes: 'Dose de casa é menor que a da exacerbação no hospital: 2 jatos por vez. Manter a terapia inalatória de manutenção (LAMA/LABA) já prescrita.'
          }
        ]
      },
      {
        id: 'dpoc-corticoide-vo',
        label: 'Corticoide oral — curso curto',
        options: [
          {
            id: 'dpoc-dom-cort',
            tier: '1ª linha',
            label: 'Prednisona 40 mg/dia por 5 dias',
            classes: ['corticosteroid'],
            noVoExpand: true,
            items: [],
            meds: [
              { id: 'dpoc-dom-pred20', text: 'Prednisona 20 mg — 2 comprimidos (40 mg) VO 1 vez ao dia, pela manhã, após o café, por 5 dias', classes: ['corticosteroid'], exclusiveGroup: 'dpoc-dom-cort' },
              { id: 'dpoc-dom-pred5', text: 'Prednisona 5 mg — 8 comprimidos (40 mg) VO 1 vez ao dia, pela manhã, após o café, por 5 dias', classes: ['corticosteroid'], exclusiveGroup: 'dpoc-dom-cort' }
            ],
            orientacoes: 'Cinco dias são suficientes e não exigem desmame. Monitorar glicemia em diabéticos.'
          }
        ]
      },
      {
        id: 'dpoc-atb',
        label: 'Antibiótico — se escarro purulento ou aumento do volume',
        options: [
          {
            id: 'dpoc-dom-atb',
            tier: 'Se indicado',
            label: 'Antibiótico oral — escolha um',
            classes: ['antibiotic'],
            noVoExpand: true,
            items: [],
            meds: [
              { id: 'dpoc-dom-amoxclav', text: 'Amoxicilina + clavulanato 875/125 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', classes: ['antibiotic', 'penicillin'], exclusiveGroup: 'dpoc-dom-atb' },
              { id: 'dpoc-dom-azi', text: 'Azitromicina 500 mg — 1 comprimido VO 1 vez ao dia, por 3 a 5 dias', classes: ['antibiotic', 'macrolide'], exclusiveGroup: 'dpoc-dom-atb' },
              { id: 'dpoc-dom-doxi', text: 'Doxiciclina 100 mg — 1 comprimido VO a cada 12 horas, por 5 a 7 dias', classes: ['antibiotic'], exclusiveGroup: 'dpoc-dom-atb' }
            ],
            orientacoes: 'Antibiótico apenas com escarro purulento, aumento do volume/viscosidade do escarro ou necessidade de ventilação. Considerar cobertura para Pseudomonas em exacerbações frequentes e uso recente de antibiótico.'
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
