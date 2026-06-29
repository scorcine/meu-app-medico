/* Baralho: Hipoglicemia — 30 cards */

var FLASHCARD_DECK_HIPOGLICEMIA = {
  id: 'hipoglicemia',
  name: 'Hipoglicemia',
  icon: '🍬',
  source: 'pronto-socorro',
  sourceLabel: 'Prescrições PS',
  desc: '30 cards — regra dos 15 g, glicose EV e causas reversíveis.',
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
    },
    {
      front: 'Hemiparesia súbita, glicemia capilar 48 mg/dL. Trombólise imediata?',
      back: 'Não — corrigir hipoglicemia (glicose EV) e reexaminar em minutos. Déficit que reverte não é AVC. Documentar glicemia antes e após correção.'
    },
    {
      front: 'DM1: hipoglicemia grave corrigida, mas recai para 55 em 2 h após gliburida. Droga adjuvante?',
      back: 'Octreotide 50 mcg SC 6/6 h (inibe secreção de insulina por sulfonilureia) + glicose EV/infusão contínua + observação prolongada; suspender sulfonilureia.'
    },
    {
      front: 'Paciente em bomba de insulina com glicemia 35 mg/dL. Desligar bomba basta?',
      back: 'Suspender bomba + glicose EV/IM conforme consciência + 15 g VO se possível — insulina IV residual pode manter queda; monitorar 1–2 h; reiniciar com dose reduzida.'
    },
    {
      front: 'Hipoglicemia em jejum prolongado: glicemia 42, cetonas negativas, insulina alta, peptídeo C baixo. Causa?',
      back: 'Insulina exógena (acidental, factícia ou surreptícia) — investigar história, sulfonilureia sérica, octreotide se sulfonilureia; diferenciar de insulinoma (peptídeo C alto).'
    },
    {
      front: 'Insulinoma suspeito: jejum supervisionado com glicemia 38 e peptídeo C elevado. Conduta no PS?',
      back: 'Corrigir hipoglicemia aguda + encaminhar para investigação (TC/RNM pancreática, jejum prolongado eletivo) — não alta sem plano; evitar jejum não supervisionado.'
    },
    {
      front: 'Hipoglicemia após etanol: mecanismo e tratamento além da glicose?',
      back: 'Inibição da gliconeogênese hepática — glicose EV + alimentação + tiamina 100 mg EV antes/durante glicose se etilista; observar recorrência até etanol eliminado.'
    },
    {
      front: 'Criança 3 a, palidez, sudorese, glicemia 52 após jejum por gastroenterite. Conduta?',
      back: '15 g carboidrato se consciente (peso-ajustado: 0,5–1 g/kg glicose) · repetir em 15 min · investigar desnutrição, erro alimentar, sepse; internar se recorrente ou rebaixamento.'
    },
    {
      front: 'Gestante com diabetes gestacional: glicemia 58 mg/dL sintomática. Tratamento?',
      back: '15 g carboidrato VO ou glicose EV se NPO · monitorização fetal se terceiro trimestre e sintomas graves · ajustar insulina/metformina; não ignorar por “estar perto do alvo”.'
    },
    {
      front: 'Hipoglicemia em uso de quinolona + glibenclamida. O que explicar ao paciente?',
      back: 'Interação farmacocinética (quinolonas potencializam hipoglicemia com sulfonilureias) — suspender ou ajustar sulfonilureia, educar sinais, glicemia capilar frequente.'
    },
    {
      front: 'Pós-gastrectomia com sudorease 2 h após refeição e glicemia 55. Diagnóstico provável?',
      back: 'Hipoglicemia reativa pós-alimentar (dumping) — dieta fracionada, baixo índice glicêmico; investigar se grave; octreotide em casos refratários após especialista.'
    },
    {
      front: 'Insuficiência adrenal: PA 85×50, glicemia 48, hiperpigmentação. Só glicose?',
      back: 'Não — crise addisoniana: hidrocortisona 100 mg EV + SF 0,9% + glicose · não dar só açúcar sem corticoide em suspeita de insuficiência adrenal.'
    },
    {
      front: 'Hipoglicemia induzida por exercício em DM1. Prevenção na alta?',
      back: 'Reduzir insulina pré-exercício ou carboidrato extra, monitorar pós-esforço, educar sobre hipoglicemia tardia (24 h) — ajuste com endocrinologia; prescrição de glucagon.'
    },
    {
      front: 'SG 50% 50 mL EV extravasou no antebraço. Complicação e prevenção?',
      back: 'Necrose tecidual por hiperosmolaridade — preferir glicose 10% em maior volume se acesso periférico frágil; aspirar se extravasamento; monitorar área.'
    },
    {
      front: 'Hipoglicemia grave: após correção, glicemia alvo na observação?',
      back: 'Manter 100–180 mg/dL nas próximas horas — evitar novo < 70; lanche/refeição + ajuste de medicação; glicemia capilar seriada 1–2 h.'
    },
    {
      front: 'Paciente em warfarina com hipoglicemia e queda. INR 4,2. Prioridade?',
      back: 'ABC + glicose + TC crânio se trauma craniano ou déficit neurológico persistente após normoglicemia — hipoglicemia pode ter causado queda e TCE.'
    },
    {
      front: 'Recusa comer após hipoglicemia corrigida (idoso com demência). Conduta?',
      back: 'Glicose EV em infusão lenta ou repetir bolus conforme protocolo + tentativa de alimentação assistida — internar se incapaz de manter glicemia; investigar causa de recusa.'
    },
    {
      front: 'Hipoglicemia em sepse: mecanismo e implicação?',
      back: 'Consumo aumentado + falha hepática/renal + nutrição inadequada — tratar infecção e glicose; meta mais alta temporariamente (140–180) em crítico; não ignorar sepse oculta.'
    },
    {
      front: 'Metformina isolada causa hipoglicemia grave?',
      back: 'Raro isoladamente — se hipoglicemia grave, buscar outra causa (insulina, sulfonilureia, sepse, hepatopatia, etanol). Metformina associada a acidose láctica se IRA.'
    },
    {
      front: 'Glucagon IM não funcionou em hepatopata alcoólico. Próximo passo?',
      back: 'Glicose EV imediata (glucagon depende de glicogênio hepático) — acesso venoso, SG 10–50% conforme protocolo, tiamina, internação.'
    },
    {
      front: 'Hipoglicemia assintomática < 54 mg/dL em DM2 assintomático. Tratar?',
      back: 'Sim — ADA recomenda tratar < 70 sintomático ou assintomático; investigar medicação (insulina/sulfonilureia), refeições omitidas, álcool; ajustar esquema.'
    },
    {
      front: 'Prova: qual NÃO é sintoma neuroglicopênico típico?',
      back: 'Taquicardia e tremores são adrenérgicos — confusão, convulsão, coma são neuroglicopênicos. Paciente pode ter poucos sintomas adrenérgicos com hipoglicemia recorrente (hipoglicemia ignorada).'
    },
    {
      front: 'Alta após hipoglicemia por insulina basal noturna excessiva. O que prescrever?',
      back: 'Reduzir dose basal 10–20%, plano de ação para hipoglicemia, glicemia capilar noturna, glucagon domiciliar se DM1, retorno ambulatorial em 1–2 semanas.'
    },
    {
      front: 'Hipoglicemia em paciente com tumor neuroendócrino em investigação. Cuidado com?',
      back: 'Insulinoma ou sulfonilureia-secreting — não alta sem plano; jejum prolongado perigoso; encaminhar endocrinologia; octreotide se sulfonilureia exógena confirmada.'
    },
    {
      front: 'Enfermaria: glicemia 62 mg/dL, paciente dormindo profundamente sem sudorese. Conduta?',
      back: 'Não ignorar — despertar e checar se responsivo; se não acordar ou glicemia < 54: glicose EV, glucagon IM, proteger via aérea; investigar hipoglicemia noturna ignorada.'
    }
  ]
};
