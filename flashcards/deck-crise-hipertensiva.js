/* Baralho: Crise hipertensiva — 30 cards */

var FLASHCARD_DECK_CRISE_HIPERTENSIVA = {
  id: 'crise-hipertensiva',
  name: 'Crise hipertensiva',
  icon: '📈',
  source: 'pronto-socorro',
  sourceLabel: 'Prescrições PS',
  desc: '30 cards — emergência vs urgência, alvo de PA e drogas EV.',
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
    },
    {
      front: 'Encefalopatia hipertensiva: PA 230×140, confusão, papiledema, convulsão. Droga e meta?',
      back: 'Emergência hipertensiva — labetalol ou nicardipina EV; reduzir PAS ~25% nas primeiras 2–6 h (não normalizar de imediato); UTI, TC crânio, tratar convulsão se presente.'
    },
    {
      front: 'PA 200×120, creatinina subiu de 1,0 para 2,8 em 48 h, hematúria. Emergência ou urgência?',
      back: 'Emergência hipertensiva — lesão renal aguda hipertensiva (microangiopatia trombótica possível). Anti-hipertensivo EV, internação, investigar hemólise (esfregaço, LDH, haptoglobina).'
    },
    {
      front: 'Urgência hipertensiva: captopril 25 mg SL. Em quanto tempo esperar queda?',
      back: 'Efeito em 15–30 min — reavaliar PA em 30–60 min. Se sintomático ou PA persistentemente > 180/120 após 24 h, considerar internação; combinar com anlodipino VO.'
    },
    {
      front: 'Paciente em uso de clonidina suspendeu há 3 dias. PA 220×130, taquicardia, sudorese. Causa?',
      back: 'Rebote de clonidina — reiniciar clonidina + betabloqueador (evitar só vasodilatador sem controle simpático); internação; não queda abrupta de PA.'
    },
    {
      front: 'Feocromocitoma suspeito: PA 250×130, cefaleia, palpitações. Betabloqueador isolado primeiro?',
      back: 'Não — alfa-bloqueio antes de beta (risco crise paradoxal). Fenoxibenzamina ou labetalol em ordem adequada; cirurgia eletiva após preparo; hidralazina/nitroprussiato em crise.'
    },
    {
      front: 'Hemorragia subaracnódea, PA 190×100. Meta pressórica?',
      back: 'Evitar hipertensão extrema — alvo PAS < 160 (ou conforme neurocirurgia) com nicardipina/labetalol; não hipotensão excessiva (risco isquemia cerebral); nimodipino para vasoespasmo.'
    },
    {
      front: 'AVC hemorrágico, PA 210×115. Quando reduzir PA?',
      back: 'Se PAS > 220 ou meta institucional (ex.: PAS 140–160 em 1 h) — labetalol/nicardipina EV; evitar queda abrupta; monitor neurológico; reversão de anticoagulação se aplicável.'
    },
    {
      front: 'Nitroprussiato EV: qual complicação monitorar e por quanto tempo usar?',
      back: 'Toxicidade por cianeto/tiocianato — uso limitado, monitorar acidose, confusão; evitar uso prolongado; preferir nicardipina/clevidipina quando disponível.'
    },
    {
      front: 'Eclâmpsia: convulsão após sulfato de magnésio em dose de ataque. Conduta?',
      back: 'Segunda dose de sulfato (2 g EV em 5 min) + midazolam se convulsão persiste · verificar nível de Mg (toxicidade: reflexos abolidos, depressão respiratória) · parto definitivo.'
    },
    {
      front: 'PA 180×105, fundo com hemorragias em chama, sem déficit focal. Diagnóstico de fundo?',
      back: 'Retinopatia hipertensiva grave — emergência hipertensiva ocular; reduzir PA gradualmente, encaminhar oftalmologia; investigar lesão de órgão-alvo (cardíaco, renal).'
    },
    {
      front: 'Crise hipertensiva + cocaína. Evitar qual classe de droga?',
      back: 'Evitar betabloqueador isolado (alfa não bloqueada → vasoconstrição paradoxal). Benzodiazepínico + nitroglicerina/nitroprussiato/nicardipina; tratar dor/ansiedade.'
    },
    {
      front: 'Insuficiência cardíaca aguda + PA 90×60. Pode usar nitroprussiato?',
      back: 'Contraindicado se hipotensão — priorizar inotrópico/vasopressor conforme perfil (choque cardiogênico). Nitroprussiato só se PA permitir vasodilatação.'
    },
    {
      front: 'Urgência hipertensiva: paciente já usa losartana irregular. Receita na alta?',
      back: 'Reiniciar/otimizar IECA/BRA + anlodipino se necessário; educar adesão; retorno em 24–72 h; investigar causa secundária se jovem, refratário ou sem fatores.'
    },
    {
      front: 'Jovem 28 a, PA 200×120, hipocalemia, massa adrenal na TC. Diagnóstico?',
      back: 'Hiperaldosteronismo primário ou feocromocitoma — causa secundária; não só tratar PA; encaminhar endocrinologia; preparo adequado antes de cirurgia.'
    },
    {
      front: 'Meta de PA na dissecção aguda de aorta tipo A?',
      back: 'PAS < 120 mmHg e FC < 60 o mais rápido possível (sem comprometer perfusão) — esmolol IV + vasodilatador após betabloqueio; cirurgia urgente.'
    },
    {
      front: 'Hidralazina EV 10 mg: quando repetir dose?',
      back: 'A cada 20–30 min conforme PA (máx. ~20 mg) — efeito imprevisível; preferir labetalol/nicardipina tituláveis em emergências; cuidado em gestante (pode usar) e dissecção (evitar taquicardia reflexa sem beta).'
    },
    {
      front: 'PA 195×115, dor epigástrica, enzimas hepáticas elevadas. Síndrome HELLP?',
      back: 'Sim até prova contrária em gestante/puerpério — sulfato de magnésio, anti-hipertensivo, avaliar coagulação, plaquetas, DHL; parto conforme obstetrícia; não alta.'
    },
    {
      front: 'Crise hipertensiva em hemodiálise: PA 220×130 entre sessões. Conduta?',
      back: 'Nitroglicerina ou nicardipina EV + sessão de diálise urgente se sobrecarga volêmica — evitar queda excessiva; ajustar dry weight; não só captopril se urgente.'
    },
    {
      front: 'Prova: diferença entre emergência e urgência hipertensiva?',
      back: 'Emergência = PA muito elevada + lesão aguda de órgão-alvo (encefalopatia, IAM, EAP, dissecção, eclâmpsia, AKI). Urgência = PA elevada sem lesão aguda — redução gradual oral.'
    },
    {
      front: 'PA 210×120, assintomático, esqueceu medicação há 1 semana. Nitroprussiato no PS?',
      back: 'Não — urgência hipertensiva: reiniciar medicação habitual + captopril/anlodipino, observação 4–6 h; nitroprussiato reservado para emergência com LOA.'
    },
    {
      front: 'Pós-operatório imediato de carótida: PA 190×100. Meta?',
      back: 'Evitar hipertensão (risco hematoma de punção) — labetalol/nicardipina titulada; meta institucional geralmente PAS < 160; monitor neurológico.'
    },
    {
      front: 'Toxemia gravídica: hidralazina vs labetalol EV?',
      back: 'Ambos aceitos — labetalol 20 mg EV lento, repetir; hidralazina 5–10 mg EV. Evitar IECA/BRA/atenolol na gestação. Sulfato de magnésio para eclâmpsia, não só anti-hipertensivo.'
    },
    {
      front: 'PA 240×130 melhorou para 160×90 em 1 h com nicardipina. Alta?',
      back: 'Só se emergência resolvida, sem LOA residual, transição para oral efetiva e retorno garantido — encefalopatia/EAP/dissecção exigem internação; não suspender infusão abruptamente.'
    },
    {
      front: 'Crise hipertensiva + bradicardia 48 bpm. Qual droga evitar?',
      back: 'Betabloqueador adicional e alguns bloqueadores de canal (verapamil) — preferir vasodilatador puro (hidralazina, nitroprussiato, nicardipina) e investigar bloqueio AV; marcapasso se indicado.'
    }
  ]
};
