/* Baralho: Gasometria arterial — 30 cards */

var FLASHCARD_DECK_GASOMETRIA = {
  id: 'gasometria',
  name: 'Gasometria arterial',
  icon: '🧪',
  source: 'interpretacao-exame',
  sourceLabel: 'Interpretação do exame',
  desc: '30 cards — pH, PaCO₂, HCO₃ e compensação em minutos.',
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
    },
    {
      front: 'pH 7,55 · PaCO₂ 48 · HCO₃ 38. Distúrbio primário e causa?',
      back: 'Alcalose metabólica — HCO₃ elevado com compensação respiratória (PaCO₂ ↑). Causas: vômitos, diuréticos, hiperaldosteronismo, reposição excessiva de bicarbonato.'
    },
    {
      front: 'Alcalose metabólica: HCO₃ 32. PaCO₂ esperado (±2)?',
      back: 'PaCO₂ ≈ 0,7 × 32 + 20 = 42,4 (± 2). Acima disso: acidose respiratória associada; abaixo: alcalose respiratória associada.'
    },
    {
      front: 'pH 7,38 · PaCO₂ 60 · HCO₃ 36. Distúrbio primário?',
      back: 'Alcalose metabólica crônica compensada — HCO₃ muito elevado com PaCO₂ retida para manter pH quase normal. Investigar vômitos prolongados, diurético, hipocalemia.'
    },
    {
      front: 'AG 20, osmolaridade elevada, cristais urinários em paciente etilista. Intoxicação provável?',
      back: 'Metanol ou etilenoglicol — acidose com AG aumentado + gap osmolar. Fomepizol/etanol terapêutico, hemodiálise; não só bicarbonato.'
    },
    {
      front: 'Acidose metabólica AG normal (12), HCO₃ 18, ureia normal. Diarreia vs RTA?',
      back: 'Diarreia (perda GI de HCO₃) mais comum — RTA tipo 1 ou 4 se diarreia ausente; urina: gap urinário ajuda (diarreia: AG urinário baixo).'
    },
    {
      front: 'Gap urinário na acidose metabólica: Na_u 60, K_u 40, Cl_u 90. Interpretação?',
      back: 'AG urinário = 60 + 40 − 90 = 10 (baixo) — perda extrarrenal de bicarbonato (diarreia) ou RTA. AG urinário alto (> 12): acidose por acúmulo de ácidos (cetoacidose, lactato).'
    },
    {
      front: 'pH 7,10 · PaCO₂ 25 · HCO₃ 8 · K 6,2. Prioridade além da gasometria?',
      back: 'Hipercalemia com acidose — cálcio EV se alteração ECG, insulina+glicose, beta-2, diálise se refratário; tratar causa (acidose, IRA); monitor cardíaco contínuo.'
    },
    {
      front: 'DPOC: pH 7,32 · PaCO₂ 70 · HCO₃ 34. Agudo ou crônico?',
      back: 'Compensação metabólica (HCO₃ elevado) sugere retenção crônica de CO₂ com descompensação aguda — VMNI preferível a hiperventilação agressiva; alvo pH 7,25–7,35, não normalizar PaCO₂ de imediato.'
    },
    {
      front: 'Salicilatos: pH 7,50 · PaCO₂ 18 · HCO₃ 14 · AG alto. Paradoxo?',
      back: 'Alcalose respiratória inicial (estimulação central) + acidose metabólica tardia — intoxicação mista. Alcalinização urinária, hemodiálise se grave; não tratar só o pH.'
    },
    {
      front: 'PaO₂ 280 · FiO₂ 1,0 · PEEP 10. P/F e conduta?',
      back: 'P/F = 280 — ainda > 200 (SDRA leve). Reavaliar PEEP, driving pressure, prona se P/F < 150; evitar hiperóxia se estável.'
    },
    {
      front: 'Base excess (BE) −12. Equivale a qual HCO₃ aproximado em adulto?',
      back: 'BE negativo grande indica déficit de base — acidose metabólica significativa; correlacionar com HCO₃ e lactato; guiar reposição só se indicado (não rotina na sepse).'
    },
    {
      front: 'pH 7,28 · PaCO₂ 50 · HCO₃ 22 · lactato 6. Qual componente tratar primeiro?',
      back: 'Sepse/choque com acidose mista — perfusão (volume, vasopressor, ATB) reduz lactato; VM se falha ventilatória. Bicarbonato não é 1ª linha.'
    },
    {
      front: 'Hipocalemia 2,8 + alcalose metabólica leve. Mecanismo do distúrbio ácido-base?',
      back: 'Perda de H⁺ e K⁺ (vômitos/diurético) — alcalose metabólica com hipocalemia; corrigir K⁺ (difícil normalizar sem repor potássio); cloreto de potássio + tratar causa.'
    },
    {
      front: 'Gasometria venosa central: pH 7,20, ScvO₂ 55%. Interpretação na sepse?',
      back: 'Acidose + baixa extração de O₂ — inadequada perfusão tecidual (choque não resolvido) apesar de pressão; otimizar volume/vasopressor; não confundir com gasometria arterial para ventilação.'
    },
    {
      front: 'pH 7,42 · PaCO₂ 20 · HCO₃ 14. Três distúrbios possíveis?',
      back: 'Alcalose respiratória + acidose metabólica (AG avaliar) — pH pode estar “normal” com dois distúrbios opostos. Ex.: sepse + hiperventilação, intoxicação + hiperventilação.'
    },
    {
      front: 'Acidose hiperclorêmica pós-infusão massiva de SF 0,9%. Prevenção?',
      back: 'Usar cristaloides balanceados (Ringer lactato, Plasmalyte) em grandes volumes — SF 0,9% excessivo gera acidose dilucional/hiperclorêmica.'
    },
    {
      front: 'PaCO₂ 32 · HCO₃ 26 · pH 7,44. Paciente em VM com volume corrente 10 mL/kg. Problema?',
      back: 'Alcalose respiratória por hiperventilação (VC alto) — reduzir volume corrente (6–8 mL/kg PBW), ajustar frequência; evitar alcalose crônica na VM.'
    },
    {
      front: 'Cetoacidose euglicêmica: pH 7,15, glicemia 180, AG alto. Quando suspeitar?',
      back: 'Gestante, jejum, uso de iSGLT2, etilismo, insuficiência alimentar — tratar como CAD (fluido + insulina) mesmo com glicemia < 250; suspender iSGLT2.'
    },
    {
      front: 'Prova: fórmula do ânion gap com Na, Cl e HCO₃?',
      back: 'AG = Na⁺ − (Cl⁻ + HCO₃⁻) — normal ~ 8–12 mEq/L. AG elevado: ácidos não medidos (lactato, cetonas, toxinas, uremia). AG normal: perda de HCO₃ ou RTA.'
    },
    {
      front: 'pH 7,18 · PaCO₂ 38 · HCO₃ 14 · Na 142 · Cl 100. AG e delta-delta?',
      back: 'AG = 142 − (100 + 14) = 28 (alto). Delta AG ≈ 16, queda HCO₃ ≈ 10 — delta-delta < 1 sugere acidose hiperclorêmica associada (ex.: diarreia + lactato).'
    },
    {
      front: 'Co-oximetria: SpO₂ 98%, mas PaO₂ 60 e saturação funcional 85%. Explicação?',
      back: 'Metahemoglobinemia ou carboxihemoglobina — oxímetro pulse pode mentir. Tratar causa (nitratos, dapsone, CO); azul de metileno se metaHb sintomática.'
    },
    {
      front: 'Gasometria arterial: tempo até análise. Por que importa no plantão?',
      back: 'Amostra em gelo, sem bolhas — atraso aumenta PaO₂ falso (leucócitos consomem O₂) e lactato ↑. Resultado falso altera conduta (intubação, bicarbonato); repetir se dúvida clínica.'
    }
  ]
};
