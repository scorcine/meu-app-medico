/* Baralho: Via aérea e intubação — 30 cards */

var FLASHCARD_DECK_VIA_AEREA = {
  id: 'via-aerea',
  name: 'Via aérea e intubação',
  icon: '🫁',
  source: 'guia-emergencia',
  sourceLabel: 'Guia de emergência',
  desc: '30 cards — avaliação, pré-oxigenação e falha na laringoscopia.',
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
    },
    {
      front: 'Vortex: falhou máscara, falhou supraglótica, SpO₂ 75%. Próximo domínio?',
      back: 'Cricotireoidostomia cirúrgica ou por punção (CICO) — não retornar indefinidamente à laringoscopia cega. Anunciar CICO, kit aberto, incisão cricotireóidea.'
    },
    {
      front: 'Trauma cervical: GCS 7, indicação de colar rígido durante SRI?',
      back: 'Manter estabilização manual in-line (assistente) — abrir colar anteriormente para SRI se necessário; vídeo-laringoscopia reduz movimento; intubar se GCS ≤ 8 ou via aérea ameaçada.'
    },
    {
      front: 'Gravidez 34 sem, indução para EAP. Posicionamento específico?',
      back: 'Deslocamento uterino manual para esquerda (evitar compressão cava) + ramp/elevação torácica (via aérea difícil gestacional) — pré-oxigenar, reduzir tempo de apneia.'
    },
    {
      front: 'Edema angioneurótico com estridor. Adrenalina antes de intubar?',
      back: 'Via aérea é prioridade — preparar SRI com equipe experiente; icatibanto se EAO por IECA; adrenalina limitada no bradicinínico; não atrasar intubação se estridor progressivo.'
    },
    {
      front: 'Queimadura inalatória: fuligem nasal, rouquidão, pelos queimados. Quando intubar?',
      back: 'Precoce — antes de edema de via aérea progressivo (primeiras horas). Tubo de maior calibre possível; evitar nasal se edema facial; considerar broncoscopia posterior.'
    },
    {
      front: 'Succinilcolina na SRI: contraindicação absoluta relevante no PS?',
      back: 'Hipercalemia, queimadura/crush > 24–48 h, paralisia prolongada, história de hipertermia maligna, distrofia muscular — usar rocurônio em dose alta (1,2 mg/kg) se contraindicada.'
    },
    {
      front: 'Apneia obstrutiva do sono grave: diferença na pré-oxigenação?',
      back: 'Posição ramp, CPAP durante pré-ox se tolerado, assistente para máscara, plano de via difícil — obeso tem menor reserva de O₂; ter LMA/vídeo prontos.'
    },
    {
      front: 'Intubação nasotraqueal no PS de emergência: indicação atual?',
      back: 'Rara — preferir orotraqueal na emergência. Nasal reservada para casos selecionados (cirurgia maxilofacial) com tempo e equipe; risco sangramento e trauma.'
    },
    {
      front: 'Profundidade do tubo: marca na arcada em homem 175 cm. Regra prática?',
      back: '≈ 21–23 cm na comissura labial (mulher 20–22) — confirmar capnografia + ausculta bilateral + RX tórax (ponta 2–4 cm acima do carina).'
    },
    {
      front: 'Despertar durante paralisia (rocurônio sem sedação adequada). Como evitar?',
      back: 'Sedação contínua pós-intubação (propofol/midazolona) + analgesia; monitorar BIS/escala se disponível; bloqueio neuromuscular só com sedação e analgesia adequadas.'
    },
    {
      front: 'Criança 2 a, corpo estranho, inconsciente. Sequência de ações?',
      back: '5 golpes interescapulares + 5 compressões torácicas ( < 1 ano: compressões) · se visível, retirar · se não resolve: laringoscopia e remoção com Magill · não cegar dedo em criança consciente.'
    },
    {
      front: 'Cricotireoidostomia por punção com cateter: ventilação prolongada adequada?',
      back: 'Não — ponte temporária (oxigenação por jet insuflação). Converter para cricotireoidostomia cirúrgica ou traqueostomia se via definitiva necessária.'
    },
    {
      front: 'Hipoxemia durante tentativa de intubação: limite de tentativas?',
      back: 'Máximo 2–3 tentativas de laringoscopia — entre tentativas: ventilar 100% O₂, otimizar posição, considerar supraglótica/vídeo. SpO₂ < 90%: parar e reoxigenar.'
    },
    {
      front: 'TCE grave: succinilcolina aumenta PIC?',
      back: 'Controverso e geralmente aceita na SRI de emergência se via aérea ameaçada — priorizar oxigenação; etomidato/rocurônio alternativos; hiperventilação evitar rotina.'
    },
    {
      front: 'Extubação acidental em UTI: primeiro passo?',
      back: 'Ventilar com máscara 100% O₂ · avaliar nível de consciência e edema · reintubar se GCS baixo, falha ventilatória ou via edemaciada — não forçar se via difícil; chamar ajuda.'
    },
    {
      front: 'Laringoscopia direta: lâmina curva (Macintosh) vs reta (Miller)?',
      back: 'Macintosh (curva) adulto — eleva epiglote indiretamente; Miller (reta) pediátrico ou epiglote grande — eleva epiglote diretamente. Escolher conforme anatomia.'
    },
    {
      front: 'Pressão cricoide (Sellick): ainda obrigatória na SRI?',
      back: 'Não obrigatória — evidência limitada; pode dificultar intubação e ventilação. Usar se risco alto de aspiração ativa; soltar se dificultar passagem do tubo.'
    },
    {
      front: 'Paciente acordado com saturação 80% e estridor. SRI clássica ou awake intubation?',
      back: 'Via aérea acordada (fibroscopia/topicalização) se tempo e expertise — em estridor iminente sem tempo: SRI com preparo máximo; não sedar profundamente antes de garantir via.'
    },
    {
      front: 'Ventilação com máscara: dois operadores vs um. Quando dois?',
      back: 'Obesidade, barba, sem prótese dentária, idoso — dois operadores (C-E + jaw thrust) melhora selamento; pré-oxigenação antes de paralisia.'
    },
    {
      front: 'Bougie passou com “cliques”, tubo não avança. Causa provável?',
      back: 'Tubo preso na arytenoide ou bougie muito profundo — recuar 1 cm, girar tubo 90° ou usar tubo menor; não forçar trauma. Retirar e reoxigenar se dessaturação.'
    },
    {
      front: 'Prova: componente do LEMON que avalia obesidade e barba?',
      back: 'M — Mallampati/Modification (ou E — external) no mnemônico LEMON: Look, Evaluate, Mallampati, Obstruction, Neck mobility. Obesidade/barba dificultam máscara (MOANS).'
    },
    {
      front: 'Pós-intubação: PA cai de 110 para 70, SpO₂ ok. Causa provável e conduta?',
      back: 'Hipotensão pós-indução (vasodilatação + perda de pressão intratorácica) — fluido bolus, vasopressor (noradrenalina/fenilefrina), reduzir sedação; excluir pneumotórax, tubo esofágico (capnografia).'
    }
  ]
};
