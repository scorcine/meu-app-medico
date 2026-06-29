/* Baralho: Pneumonia adquirida na comunidade — 30 cards */

var FLASHCARD_DECK_PNEUMONIA = {
  id: 'pneumonia',
  name: 'Pneumonia adquirida na comunidade',
  icon: '🫁',
  source: 'pronto-socorro',
  sourceLabel: 'Prescrições PS',
  desc: '30 cards — CURB-65, antibiótico ambulatorial vs internação e complicações.',
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
    },
    {
      front: 'PSI classe IV em homem 72 a com insuficiência cardíaca. CURB-65 = 1. Qual escore prevalece?',
      back: 'PSI IV indica internação — não confiar só em CURB-65 baixo quando PSI alto ou comorbidades graves. Internar, O₂, ATB EV e monitorar IC descompensada.'
    },
    {
      front: 'Alergia grave a penicilina (anafilaxia). PAC ambulatorial leve. Esquema alternativo?',
      back: 'Doxiciclina 100 mg 12/12 h ou levofloxacino 750 mg/dia VO por 5–7 dias (quinolona respiratória). Evitar beta-lactâmico se anafilaxia documentada.'
    },
    {
      front: 'PAC + derrame pleural pequeno sem sepse. Precisa toracocentese de rotina?',
      back: 'Não de rotina se pequeno e assintomático — toracocentese se derrame grande, sepse, pH pleural < 7,2, glicose baixa ou suspeita de empiema. RX seriado.'
    },
    {
      front: 'Toracocentese: pH pleural 6,9, glicose 28, LDH alto, aspecto purulento. Conduta?',
      back: 'Empiema/pleurite complicada — dreno torácico + ATB EV prolongado; considerar fibrinolítico intrapleural ou VATS se loculado. Não tratar só com ATB.'
    },
    {
      front: 'PAC em uso recente de levofloxacino por ITU. Internação: qual esquema?',
      back: 'Evitar repetir mesma quinolona — ceftriaxona + azitromicina ou piperacilina-tazobactam conforme gravidade. Considerar resistência local e cultura de escarro.'
    },
    {
      front: 'Idoso institucionalizado com PAC. Cobertura para MRSA de rotina?',
      back: 'Não de rotina — reservar vancomicina/linezolida se pneumonia necrotizante, abscesso, sepse grave, uso recente de ATB hospitalar ou colonização conhecida.'
    },
    {
      front: 'Gestante 28 sem, febre 38,8 °C, infiltrado lobar, SpO₂ 95%. Antibiótico seguro?',
      back: 'Amoxicilina ou amoxicilina-clavulanato VO/EV conforme gravidade — evitar fluoroquinolonas e tetraciclinas. Internar se hipoxemia ou sepse; monitorização fetal.'
    },
    {
      front: 'PAC + influenza confirmada. Muda o antibiótico?',
      back: 'Manter ATB para PAC (sobreinfecção bacteriana comum) + oseltamivir se < 48–72 h de sintomas ou grave. Não substituir ATB por antiviral isolado.'
    },
    {
      front: 'Criança 4 a com PAC: amoxicilina 50 mg/kg/dia. Duração ambulatorial?',
      back: '5–7 dias na maioria dos casos pediátricos não complicados (diretrizes locais). Reavaliar em 48–72 h; internar se hipoxemia, desidratação ou sepse.'
    },
    {
      front: 'PAC aspirativa em idoso com disfagia pós-AVC. Esquema empírico?',
      back: 'Ampicilina-sulbactam ou amoxicilina-clavulanato (anaeróbios + gram-negativos entéricos). Evitar só amoxicilina simples; avaliar posição e fisioterapia.'
    },
    {
      front: 'RX: consolidação lobar + pneumatocele em adolescente. PAC típica?',
      back: 'Pensar em pneumonia estafilocócica (pós-gripe, uso de drogas injetáveis) — cobrir MRSA (vancomicina/linezolida) + drenagem se abscesso; hemocultura.'
    },
    {
      front: 'Paciente melhorou, dia 5 de ATB, ainda tosse seca sem febre. Suspender antibiótico?',
      back: 'Completar 5–7 dias se PAC não complicada e melhora clínica — tosse residual pode persistir semanas. Não estender ATB só por tosse se afebril e estável.'
    },
    {
      front: 'SpO₂ 91% em ar ambiente, FR 26, sem confusão. CURB-65 = 0. Alta com amoxicilina?',
      back: 'Hipoxemia (SpO₂ < 92–94% conforme protocolo) indica internação ou observação com O₂ — CURB-65 baixo não exclui gravidade. Reavaliar gasometria se DPOC.'
    },
    {
      front: 'PAC grave em UTI: PaO₂/FiO₂ 180, infiltrado bilateral. Intubação imediata?',
      back: 'Avaliar VMNI se consciente e cooperativo sem instabilidade — intubar se rebaixamento, acidose grave refratária, instabilidade hemodinâmica ou falha de VMNI.'
    },
    {
      front: 'Vacina pneumocócica em dia, ainda assim PAC por pneumococo. Falha da vacina?',
      back: 'Vacina reduz formas invasivas/graves, não elimina PAC — tratar normalmente. Avaliar revacinação conforme idade e esquema (PCV13/PPSV23).'
    },
    {
      front: 'HIV com CD4 180, infiltrado intersticial difuso, SpO₂ 87%. Só ceftriaxona?',
      back: 'Não — incluir PCP se dispneia desproporcional, LDH alto, hipoxemia; TMP-SMX + corticoide se PCP. TB e fungos no diferencial; internar.'
    },
    {
      front: 'PAC + empiema: ATB por quanto tempo após dreno?',
      back: 'Geralmente 2–4 semanas EV/VO conforme resposta, cultura e complicação — empiema exige dreno adequado + ATB prolongado; acompanhamento imagem.'
    },
    {
      front: 'Idoso com PAC recebeu alta com amoxicilina. Retorna em 24 h com confusão e PAS 85. O que faltou?',
      back: 'Subestimação de gravidade — confusão = critério de internação (CURB-65). Reinternar, O₂, ATB EV, investigar sepse e desidratação.'
    },
    {
      front: 'Infiltrado em lobo médio que não resolve em 3 meses. Conduta?',
      back: 'Investigar lesão obstrutiva (tumor endobrônquico), TB, fungo — TC tórax e broncoscopia conforme suspeita; não repetir só mais um ciclo de ATB.'
    },
    {
      front: 'PAC + uso crônico de corticoide oral. Precisa cobertura diferente?',
      back: 'Maior risco de formas graves e atípicas — considerar internação com menor limiar; esquema ampliado (beta-lactâmico + macrolídeo) e vigilância de sepse.'
    },
    {
      front: 'Prova: qual critério NÃO entra no CURB-65?',
      back: 'SpO₂ e infiltrado radiológico não entram — usa-se Confusão, Ureia > 50, FR ≥ 30, PAS < 90, Idade ≥ 65. Hipoxemia grave interna por outros critérios.'
    },
    {
      front: 'Homem 55 a, etilista, febre, dor torácica pleurítica, infiltrado superior. Diagnóstico diferencial além de PAC?',
      back: 'Abscesso pulmonar, TB, embolia com infarto — hemocultura, TC se não melhora, investigar aspiração e anaeróbios; ATB com cobertura adequada e drenagem se abscesso.'
    }
  ]
};
