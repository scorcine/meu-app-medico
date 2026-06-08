/* Pronto Socorro — conteúdo clínico (lote 2) */

const PS_CONTENT_2 = {
  'cistite-itu-baixa': `
    <p class="muted">Infecção urinária limitada à bexiga (disúria, polaciúria, urgência) em mulher não grávida, sem febre, sem dor lombar ou sinais sistêmicos — tratar ambulatorialmente após exclusão de pielonefrite.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Triagem:</strong> temperatura, dor lombar/costovertebral, gravidez, imunossupressão, cateter vesical, ITU recente (&lt; 4 semanas) ou falha terapêutica.</li>
      <li><strong>Excluir pielonefrite</strong> (febre, dor lombar, prostração) → ver lote 3 (<em>pielonefrite</em>).</li>
      <li><strong>Antibiótico empírico VO</strong> (escolher uma opção):
        <ul>
          <li><strong>Nitrofurantoína</strong> 100 mg VO 12/12 h · 5 dias (Macrodantina®) — evitar se TFG &lt; 30 mL/min ou suspeita de pielonefrite.</li>
          <li><strong>Fosfomicina trometamol</strong> 3 g VO dose única (Monuril®) — alternativa de primeira linha.</li>
          <li><strong>Levofloxacino</strong> 250 mg VO 24/24 h · 3 dias — reservar se alergia ou falha; evitar rotina por resistência.</li>
        </ul>
      </li>
      <li><strong>Analgesia:</strong> dipirona ou paracetamol; fenazopiridina 200 mg VO 8/8 h · 2 dias (Urogesic®) se disúria intensa — não substitui ATB.</li>
      <li><strong>Hidratação oral</strong> · orientar retorno se febre, dor lombar ou piora em 48 h.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Completar esquema escolhido; evitar fluoroquinolona de rotina em mulheres jovens.</li>
      <li>Urina de controle só se recorrência, gravidez ou complicador.</li>
      <li>Profilaxia pós-coito ou baixa dose noturna se ITU de repetição — encaminhar ginecologia/urologia.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li><strong>EAS/urina tipo I</strong> e urocultura antes do ATB quando possível (não atrasar tratamento em quadro típico).</li>
      <li>Hemograma e PCR se febre ou suspeita de complicação.</li>
      <li>USG ou TC se suspeita de abscesso, litíase obstrutiva ou pielonefrite atípica.</li>
    </ul>
    <p class="emerg-note">MS/ANVISA · IDSA/ESCMID 2024. Pielonefrite e ITU complicada no lote 3. Conteúdo orientativo — adaptar ao protocolo institucional.</p>
  `,

  'colica-renal': `
    <p class="muted">Dor lombar ou flanco de início súbito, em cólica, irradiando para virilha — suspeitar de litíase urinária; excluir infecção associada (pielonefrite obstrutiva = emergência).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> · analgesia imediata · acesso venoso se vômitos.</li>
      <li><strong>Analgesia escalonada:</strong>
        <ul>
          <li><strong>1ª linha:</strong> dipirona 1 g EV/IM ou paracetamol 1 g VO/EV.</li>
          <li><strong>AINE:</strong> cetoprofeno 100 mg EV ou diclofenaco 75 mg IM — se função renal OK e sem contraindicação.</li>
          <li><strong>Opioide:</strong> tramadol 50–100 mg EV/IM ou morfina 2,5–5 mg EV se dor refratária.</li>
          <li><strong>Adjuvante:</strong> escopolamina 20 mg IM se componente espasmódico.</li>
        </ul>
      </li>
      <li><strong>Anti-emético</strong> se necessário: metoclopramida 10 mg EV ou ondansetrona 4 mg EV.</li>
      <li><strong>Hidratação</strong> EV ou oral conforme tolerância — meta diurese clara.</li>
      <li><strong>Red flags:</strong> febre + obstrução, anúria, rim único, imunossupressão, gravidez → internação e urologia.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Alta se dor controlada, afebril, função renal estável e sem sinais de infecção/obstrução.</li>
      <li>Prescrever analgesia VO (dipirona ± AINE curto prazo) e orientar hidratação abundante.</li>
      <li>Tamsulosina 0,4 mg VO 24/24 h se cálculo distal &lt; 10 mm — facilita expulsão.</li>
      <li>Retorno imediato se febre, vômitos incoercíveis ou oligúria.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li><strong>TC de abdome sem contraste</strong> — padrão-ouro para litíase (alternativa: USG se gestante ou indisponibilidade).</li>
      <li>EAS, urocultura, creatinina, eletrólitos — excluir ITU e IRA.</li>
      <li>Hemograma se febre; urina para cristais se indicado.</li>
    </ul>
    <p class="emerg-note">EAU/AUA guidelines litíase · MS. Litotripsia/cirurgia se cálculo obstrutivo, infecção, rim único ou falha clínica. Conteúdo orientativo.</p>
  `,

  'conjuntivite': `
    <p class="muted">Conjuntivite viral (mais comum), bacteriana ou alérgica — diferenciar pela história, exame e ausência de dor ocular profunda ou perda visual (red flags de ceratite/uveíte/glaucoma).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir emergência ocular:</strong> dor intensa, fotofobia marcada, visão turva, pupila irregular, trauma, corpo estranho, uso de CL → oftalmologia.</li>
      <li><strong>Medidas gerais:</strong> higiene ocular com SF 0,9%, compressas frias, evitar coçar, não compartilhar toalhas.</li>
      <li><strong>Viral</strong> (aquosa, linfonodo pré-auricular, contexto epidêmico): sintomáticos — lágrimas artificiais, compressas frias; <strong>não</strong> ATB de rotina.</li>
      <li><strong>Bacteriana</strong> (purulenta moderada/grave): colírio antibiótico — escolher uma opção:
        <ul>
          <li><strong>Tobramicina 0,3%</strong> 1 gota 4/4 h · 5–7 dias (Tobrex®).</li>
          <li><strong>Ciprofloxacino 0,3%</strong> 1 gota 4/4 h · 5–7 dias (Ciloxan®).</li>
          <li><strong>Moxifloxacino 0,5%</strong> 1 gota 8/8 h · 5–7 dias (Vigamox®) — se disponível.</li>
        </ul>
      </li>
      <li><strong>Alérgica</strong> (prurido, história atópica): anti-H1 oral (loratadina 10 mg/dia ou dexclorfeniramina 2 mg 8/8 h) + colírio anti-histamínico/mastocitário (olopatadina 0,1% 12/12 h).</li>
      <li><strong>Analgesia:</strong> dipirona ou paracetamol se desconforto.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Viral: autolimitada 7–14 dias; orientar isolamento escolar/trabalho enquanto secreção ativa.</li>
      <li>Bacteriana: completar ATB tópico; melhora esperada em 48–72 h.</li>
      <li>Alérgica: evitar alérgeno; manter anti-H1 conforme necessidade.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica na maioria; cultura de secreção só se neonatal, recorrente, refratária ou suspeita de gonococo.</li>
      <li>Teste rápido adenovírus se disponível (opcional).</li>
    </ul>
    <p class="emerg-note">AAO · MS. Conjuntivite neonatal e gonocócica = internação e ATB sistêmico. Conteúdo orientativo.</p>
  `,

  'constipacao': `
    <p class="muted">Evacuação infrequente ou fezes endurecidas — na urgência, tratar impactação fecal e causas secundárias (medicações, desidratação, obstrução).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir abdome agudo</strong> — dor intensa, distensão progressiva, vômitos biliosos, sangue, perda ponderal, idade &gt; 50 anos sem colonoscopia recente.</li>
      <li><strong>Impactação retal:</strong> toque retal · desimpactação manual + enema (glicerina ou fosfato de sódio) se necessário.</li>
      <li><strong>Laxativos osmóticos</strong> (preferir):
        <ul>
          <li><strong>Lactulose</strong> 15–30 mL VO 12/12 h (Lactulona®).</li>
          <li><strong>Polietilenoglicol (PEG)</strong> 17 g VO 1–2×/dia dissolvido em água (Muvinlax®).</li>
        </ul>
      </li>
      <li><strong>Estimulante</strong> se impactação resolvida: bisacodil 5–10 mg VO ou supositório 10 mg (Dulcolax®) — uso curto.</li>
      <li><strong>Analgesia</strong> se cólica: dipirona; escopolamina se espasmo.</li>
      <li><strong>Hidratação oral</strong> · mobilização · fibra na alta.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Manter PEG ou lactulose até regularização; aumentar fibra e líquidos.</li>
      <li>Revisar opioides, anti-histamínicos, ferro, bloqueadores de canal de cálcio.</li>
      <li>Encaminhar se constipação crônica refratária, alarme ou idade avançada sem rastreio.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica na maioria; Rx abdome se suspeita de obstrução ou megacólon.</li>
      <li>TSH, cálcio, eletrólitos se constipação crônica de início recente.</li>
      <li>Colonoscopia se sinais de alarme.</li>
    </ul>
    <p class="emerg-note">MS/ANVISA · WGO. Evitar laxativo estimulante crônico sem investigação. Conteúdo orientativo.</p>
  `,

  'corpo-estranho-ocular': `
    <p class="muted">Corpo estranho superficial (palpebral/conjuntival) vs intraocular/penetrante — não manipular suspeita de perfuração; remover CE superficial após anestesia tópica.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Não remover</strong> CE incrustado, projétil metálico ou suspeita de perfuração — proteger olho (escudo rígido), jejum, oftalmologia/cirurgia.</li>
      <li><strong>Anestésico tópico:</strong> proximetacaína 0,5% ou tetracaína 1% — 1 gota antes do exame.</li>
      <li><strong>CE conjuntival/palpebral superficial:</strong> eversão de pálpebra · remoção com cotonete umedecido ou pinça · irrigação abundante com SF 0,9%.</li>
      <li><strong>CE corneano superficial:</strong> remoção com agulha estéril ou Alger brush após fluoresceína — confirmar ausência de Seidel (perfuração).</li>
      <li><strong>Pós-remoção:</strong> colírio antibiótico (tobramicina ou ciprofloxacino) 6/6 h · 5 dias; analgesia (dipirona).</li>
      <li><strong>Tétano</strong> atualizado se corpo estranho metálico/vegetal e vacinação incerta.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Reavaliação oftalmológica em 24–48 h se CE corneano ou abrasão extensa.</li>
      <li>Evitar esfregar o olho; usar óculos de proteção.</li>
      <li>Retorno imediato se piora da dor, visão ou secreção purulenta.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Teste de fluoresceína + lâmpada de fenda (ou inspeção cuidadosa).</li>
      <li>TC órbita se CE intraocular, trauma de alta energia ou corpo estranho não visualizado.</li>
      <li>Rx órbita AP/lateral se suspeita de corpo metálico intraocular.</li>
    </ul>
    <p class="emerg-note">AAO · MS. Perfuração ocular = antibiótico sistêmico e cirurgia de urgência. Conteúdo orientativo.</p>
  `,

  'crise-convulsiva-em': `
    <p class="muted">Crise convulsiva tônico-clônica &gt; 5 min ou crises repetidas sem recuperação = estado de mal epiléptico (EM) — benzodiazepínico imediato, ABC e correção de glicemia.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> · posicionar lateralmente · oxigênio · monitor · acesso venoso · <strong>glicemia capilar</strong> (corrigir hipoglicemia se &lt; 60 mg/dL: SG 50% 50 mL EV).</li>
      <li><strong>Fase precoce (&lt; 5 min, crise única):</strong> diazepam 10 mg EV lento (2 mg/min) ou midazolam 10 mg IM se sem acesso — repetir 1× se persistir.</li>
      <li><strong>Estado de mal (&gt; 5 min ou recorrente):</strong>
        <ul>
          <li><strong>1ª linha:</strong> lorazepam 4 mg EV lento — repetir 4 mg em 5 min (máx. 8 mg) <em>ou</em> diazepam 10 mg EV q10 min (máx. 30 mg).</li>
          <li><strong>Sem acesso:</strong> midazolam 10 mg IM/IN ou diazepam 20 mg retal.</li>
        </ul>
      </li>
      <li><strong>Fase estabelecida (persistência após 2 doses de BZD):</strong> fenitoína 20 mg/kg EV (máx. 1500 mg) em SF — velocidade ≤ 50 mg/min · monitorar PA/ECG.</li>
      <li><strong>Alternativa:</strong> ácido valproico 20–40 mg/kg EV (máx. 3000 mg) em infusão lenta — se disponível e sem hepatopatia/gravidez.</li>
      <li><strong>EM refratário:</strong> midazolam EV contínuo 0,2 mg/kg bolus → 0,1–0,4 mg/kg/h <em>ou</em> propofol/tiopental em UTI — intubação e EEG.</li>
      <li><strong>Investigar causa:</strong> eletrólitos, gasometria, toxicológico, TC crânio, punção lombar se febre/meningismo e TC normal.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Crise única recuperada, causa tratada, exames normais — alta com antiepiléptico se epilepsia conhecida ou segunda crise não provocada.</li>
      <li>Orientar suspender álcool/drogas; aderência à medicação; restrição de direção conforme legislação.</li>
      <li>Encaminhar neurologia se primeira crise, EM ou epilepsia refratária.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Glicemia, Na+, Ca++, Mg++, ureia, creatinina, gasometria, hemograma.</li>
      <li>TC crânio na primeira crise, trauma, déficit focal ou EM.</li>
      <li>EEG após estabilização; nível sérico de fenitoína/valproato se em uso.</li>
    </ul>
    <p class="emerg-note">ILAE/ AAN · SBPT. Midazolam IM/IN útil pré-hospitalar. Conteúdo orientativo — adaptar ao protocolo institucional.</p>
  `,

  'crise-tireotoxica': `
    <p class="muted">Tempestade tireotóxica — febre, taquicardia, alteração mental, ICC ou instabilidade em hipertireoidismo — mortalidade alta; tratamento multimodal imediato.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> · monitor · UTI se instável · score Burch-Wartofsky (≥ 45 = tempestade provável).</li>
      <li><strong>Bloqueio adrenérgico:</strong> propranolol 40–80 mg VO 6/6 h <em>ou</em> 1–2 mg EV lento q5 min (máx. 6 mg) — se asma/broncoespasmo: esmolol EV titulado.</li>
      <li><strong>Antitireoidiano:</strong> tionamida — propiltiouracil (PTU) 200–250 mg VO/NG 4/4 h <em>ou</em> metimazol 20 mg VO/NG 4/6 h (Tapazol®).</li>
      <li><strong>Iodo</strong> (≥ 1 h após tionamida): lugol 5–10 gotas VO 8/8 h <em>ou</em> iodeto de potássio 500 mg VO 6/6 h · 10 dias.</li>
      <li><strong>Corticoide:</strong> hidrocortisona 100 mg EV 8/8 h — inibe conversão T4→T3 e trata possível insuficiência adrenal relativa.</li>
      <li><strong>Medidas de suporte:</strong> resfriamento se hipertermia, SF 0,9%, tratar precipitante (infecção, cirurgia, suspensão de ATD).</li>
      <li><strong>Evitar:</strong> AAS (aumenta T3 livre); salicilatos.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Internação até estabilização; transição para tionamida VO e ajuste endocrinológico.</li>
      <li>Definir tratamento definitivo (I-131 ou cirurgia) após resolução da tempestade.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>TSH suprimido, T4L/T3L elevados; hemograma, eletrólitos, função hepática.</li>
      <li>ECG, troponina se dor torácica; culturas se infecção precipitante.</li>
      <li>USG tireoide/ cintilografia após estabilização.</li>
    </ul>
    <p class="emerg-note">ATA 2016 · SBEM. PTU preferível na tempestade (inibe conversão periférica). Conteúdo orientativo.</p>
  `,

  'dengue': `
    <p class="muted">Dengue — classificação MS 2024 (grupos A a D) com prova do laço, hidratação guiada por risco e <strong>proibição de AAS/AINE</strong>; monitorar sinais de alarme e choque.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Classificação inicial (MS 2024):</strong>
        <ul>
          <li><strong>Grupo A:</strong> sem comorbidade, sem sinais de alarme, sem sangramento espontâneo — ambulatorial.</li>
          <li><strong>Grupo B:</strong> comorbidade ou sangramento de mucosa/prova do laço + — observação em leito de dengue.</li>
          <li><strong>Grupo C:</strong> sinais de alarme presentes — internação.</li>
          <li><strong>Grupo D:</strong> choque ou disfunção grave — UTI/emergência.</li>
        </ul>
      </li>
      <li><strong>Prova do laço (+):</strong> pressão 50 mmHg por 2 min no braço → ≥ 10 petéquias/2,5 cm² — reclassificar para grupo B ou superior.</li>
      <li><strong>Hidratação:</strong>
        <ul>
          <li><strong>Grupo A:</strong> oral 60 mL/kg/dia (1/3 SRO + 2/3 líquidos caseiros) — dividir em 5–6 fracionamentos.</li>
          <li><strong>Grupo B:</strong> oral 60–80 mL/kg/dia sob supervisão ou EV conforme tolerância.</li>
          <li><strong>Grupo C/D:</strong> SF 0,9% 10 mL/kg/h EV · reavaliar hematócrito q2–4 h — bolus se choque (20 mL/kg).</li>
        </ul>
      </li>
      <li><strong>Sinais de alarme:</strong> dor abdominal intensa, vômitos persistentes, derrame (ascite/ derrame pleural), hipotensão postural, hepatomegalia dolorosa, sangramento mucoso, letargia, hematócrito ↑ com plaquetopenia.</li>
      <li><strong>Analgesia/antitérmico:</strong> <strong>paracetamol</strong> 500–750 mg VO 6/6 h (máx. 3 g/dia) — <strong>contraindicado AAS e AINE</strong> (ibuprofeno, diclofenaco, naproxeno).</li>
      <li><strong>Evitar:</strong> corticoide de rotina, profilaxia plaquetária, transfusão profilática de plaquetas.</li>
      <li><strong>Monitorização:</strong> hematócrito, plaquetas seriadas; sinais vitais q4–6 h (grupo B) ou contínuos (C/D).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Grupo A: alta com hidratação oral, paracetamol e sinais de alarme por escrito.</li>
      <li>Retorno diário ou a cada 48 h para reavaliação clínica e laboratorial conforme protocolo local.</li>
      <li>Fase crítica (3º–7º dia de doença): orientar repouso relativo.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>NS1 antígeno (1º–5º dia) e/ou sorologia (a partir do 6º dia) — confirmar quando necessário.</li>
      <li>Hemograma completo seriado (hematócrito + plaquetas).</li>
      <li>Transaminases, albumina, USG abdome se sinais de alarme (derrame, hepatomegalia).</li>
    </ul>
    <p class="emerg-note">MS/Ministério da Saúde — Dengue: diagnóstico e manejo clínico (atualização 2024). Notificação compulsória. Conteúdo orientativo.</p>
  `,

  'desconforto-abdominal': `
    <p class="muted">Desconforto abdominal inespecífico, flatulência e distensão funcional — excluir causas orgânicas e cirúrgicas antes de tratamento sintomático.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Triagem:</strong> dor localizada intensa, defesa, febre, vômitos biliosos, sangue nas fezes, síncope, gravidez → investigar abdome agudo.</li>
      <li><strong>Medidas gerais:</strong> dieta leve fracionada, evitar gorduras e fermentáveis transitórios.</li>
      <li><strong>Antiespasmódico:</strong> escopolamina 10 mg VO/IM 8/8 h se necessário (Buscopan®) <em>ou</em> hioscina butilbrometo 10 mg VO 8/8 h.</li>
      <li><strong>Antiflatulento:</strong> simeticona 40–80 mg VO 8/8 h após refeições (Luftal®).</li>
      <li><strong>Analgesia leve:</strong> dipirona ou paracetamol — evitar AINE se suspeita de úlcera.</li>
      <li><strong>Probiótico</strong> (opcional): Saccharomyces boulardii 200 mg VO 12/12 h · 5 dias se diarreia associada pós-ATB.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Reavaliação ambulatorial se sintomas &gt; 2 semanas ou recorrentes.</li>
      <li>Investigar SII, intolerâncias alimentares, dispepsia funcional se exames normais.</li>
      <li>Modificar dieta (FODMAPs) e atividade física.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica na maioria; EAS, hemograma se febre ou leucocitose.</li>
      <li>Rx abdome se distensão marcada ou suspeita de obstrução.</li>
      <li>USG abdome se dor localizada persistente; teste H. pylori se dispepsia associada.</li>
    </ul>
    <p class="emerg-note">Rome IV · MS. Red flags = investigação imediata. Conteúdo orientativo.</p>
  `,

  'diabetes-insulina-hipo': `
    <p class="muted">Manejo de hipoglicemia aguda e esquemas de insulinoterapia hospitalar — sempre dosar glicemia capilar em paciente confuso, sudoreico ou convulsionando.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Hipoglicemia grave</strong> (glicemia &lt; 54 mg/dL + alteração de consciência ou incapacidade de ingerir):
        <ul>
          <li><strong>EV:</strong> glicose hipertônica 50% — 25 g (50 mL) EV em bolus; repetir glicemia em 15 min.</li>
          <li><strong>Sem acesso:</strong> glucagon 1 mg IM/SC (Glucagen®).</li>
          <li>Após recuperação: carboidrato oral + lanche; considerar SG 10% EV contínuo se sulfonilureia ou insulinoma.</li>
        </ul>
      </li>
      <li><strong>Hipoglicemia leve/moderada</strong> (alerta, capaz de ingerir): 15 g carboidrato rápido (suco, mel, tabletes glicose) → re-testar em 15 min.</li>
      <li><strong>Sulfonilureia como causa:</strong> octreotide 50 µg SC q6h — glucagon pode ser insuficiente.</li>
      <li><strong>Insulinoterapia hospitalar:</strong> insulina regular ou asparte EV em bomba ou esquema basal-bolus — ajustar conforme glicemia capilar q4–6 h (ou q1h se instável).</li>
      <li><strong>Meta glicemia hospitalar:</strong> 140–180 mg/dL na maioria; evitar &lt; 70 mg/dL.</li>
      <li><strong>Suspender/ajustar</strong> insulina basal se jejum, NPO ou hipoglicemia recorrente.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Educar reconhecimento de hipoglicemia; prescrever glucagon domiciliar se DM1 ou hipoglicemia grave recorrente.</li>
      <li>Revisar esquema insulínico e dose de sulfonilureia; evitar álcool em jejum.</li>
      <li>Encaminhar endocrinologia se hipoglicemia de repetição ou insulinoma suspeito.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Glicemia capilar seriada; HbA1c na internação eletiva.</li>
      <li>Na+, K+, ureia, creatinina; beta-hidroxibutirato se cetoacidose concomitante.</li>
      <li>Insulina, peptídeo C, sulfonilureia sérica se hipoglicemia inexplicada.</li>
    </ul>
    <p class="emerg-note">ADA 2024 · SBD. Hipoglicemia mimetiza AVC — glicemia capilar em todo rebaixamento de consciência. Conteúdo orientativo.</p>
  `,

  'diarreia-gastroenterite': `
    <p class="muted">Diarreia aguda (&lt; 14 dias) — priorizar reidratação oral (SRO), evitar antidiarreicos opióides na disenteria; antibiótico só se doença invasiva ou alto risco.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliar desidratação</strong> (sinais clínicos) · peso · acesso venoso se choque ou vômitos incoercíveis.</li>
      <li><strong>Reidratação oral (1ª linha):</strong> SRO MS/OMS 50–100 mL/kg nas primeiras 4–6 h — pequenos goles frequentes.</li>
      <li><strong>Reidratação EV</strong> se choque, rebaixamento de consciência ou falha VO: SF 0,9% 20 mL/kg rápido → plano B/C MS.</li>
      <li><strong>Antiemético</strong> se vômitos: ondansetrona 4–8 mg EV/IM (adulto) — facilita SRO.</li>
      <li><strong>Antidiarreico:</strong> racecadotril 100 mg VO 8/8 h (Tiorfan®) — reduz secreção; seguro em adultos e crianças &gt; 3 meses.</li>
      <li><strong>Evitar:</strong> loperamida na disenteria (febre, sangue/muco) ou &lt; 2 anos.</li>
      <li><strong>Antibiótico</strong> (doença invasiva/disenteria moderada-grave ou imunossupressão):
        <ul>
          <li><strong>Ciprofloxacino</strong> 500 mg VO 12/12 h · 3–5 dias (Cipro®) — adulto.</li>
          <li><strong>Alternativa:</strong> azitromicina 500 mg VO 24/24 h · 3 dias se resistência ou gestante.</li>
        </ul>
      </li>
      <li><strong>Probiótico</strong> (adjuvante): Saccharomyces boulardii 200 mg VO 12/12 h · 5 dias.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Continuar SRO após cada evacuação líquida; dieta habitual precoce (exceto álcool e irritantes).</li>
      <li>Retorno se sangue nas fezes persistente, febre &gt; 48 h, desidratação ou &gt; 7 dias de evolução.</li>
      <li>Orientar higiene das mãos — notificar surtos.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica na maioria; coprocultura e pesquisa de parasitas se prolongada, disenteria grave ou surto.</li>
      <li>Eletrólitos e função renal se desidratação moderada/grave.</li>
      <li>Pesquisa de C. difficile se uso recente de antibiótico ou internação.</li>
    </ul>
    <p class="emerg-note">MS/OMS · IDSA 2017. ATB empírico reservado para disenteria invasiva ou viajante. Conteúdo orientativo.</p>
  `,

  'dispepsia-drge': `
    <p class="muted">Dispepsia funcional, gastrite aguda ou DRGE — excluir alarmes (perda ponderal, disfagia, sangramento, anemia) antes de IBP empírico.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Alarmes:</strong> hematemese, melena, disfagia, vômitos persistentes, massa, idade &gt; 55 anos com sintomas novos → investigar HDA/obstrução.</li>
      <li><strong>Medidas gerais:</strong> elevar cabeceira, evitar refeições tardias, álcool, tabaco, AINE.</li>
      <li><strong>IBP:</strong> omeprazol 40 mg VO/EV 24/24 h (Losec®) <em>ou</em> pantoprazol 40 mg VO/EV 24/24 h — 4–8 semanas na alta ambulatorial.</li>
      <li><strong>Antácido</strong> se queimação aguda: hidróxido de alumínio/magnésio ou sucralfato 1 g VO 6/6 h.</li>
      <li><strong>Procinético</strong> se plenitude/náusea: domperidona 10 mg VO 8/8 h antes das refeições (Motilium®) — uso curto; metoclopramida 10 mg EV se vômitos.</li>
      <li><strong>Erradicação H. pylori</strong> se teste positivo: esquema MS (ex.: omeprazol + amoxicilina + claritromicina 14 dias) — prescrever na alta se confirmado.</li>
      <li><strong>Analgesia:</strong> dipirona; evitar AINE.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Teste H. pylori (respiratório, antígeno fecal ou biópsia) se não investigado.</li>
      <li>Manter IBP 4–8 sem; reduzir gradualmente se dispepsia funcional.</li>
      <li>Encaminhar endoscopia se alarmes ou refratariedade.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica na maioria; hemograma se anemia ou sangramento oculto.</li>
      <li>Endoscopia digestiva alta se alarmes, idade avançada ou sintomas persistentes.</li>
      <li>Teste H. pylori não invasivo antes de IBP prolongado quando possível.</li>
    </ul>
    <p class="emerg-note">ACG/CG · MS. IBP EV indicado na HDA — ver lote 3. Conteúdo orientativo.</p>
  `,

  'disturbios-eletroliticos': `
    <p class="muted">Distúrbios agudos de Na+, K+, Ca++ e Mg++ — corrigir conforme gravidade clínica e velocidade de instalação; monitor cardíaco se K+ ou Ca++ críticos.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Hipercalemia</strong> (K+ ≥ 6,5 ou ECG alterado): cálcio EV (gluconato 10% 10 mL) → insulina 10 U + SG 25 g → salbutamol nebul 10–20 mg; diálise se refratária.</li>
      <li><strong>Hipocalemia</strong> (K+ &lt; 3,0 ou arritmia): KCl EV máx. 10–20 mEq/h em acesso central se K+ &lt; 2,5; oral 40–80 mEq/dia se leve.</li>
      <li><strong>Hiponatremia grave</strong> (Na+ &lt; 120 + sintomas — convulsão, rebaixamento): SF 3% 100 mL EV em 10 min — repetir 2× se necessário; meta ↑ Na+ ≤ 8 mEq/L em 24 h (≤ 18 mEq/L em 48 h).</li>
      <li><strong>Hiponatremia crônica assintomática:</strong> restrição hídrica; correção lenta — evitar mielinólise.</li>
      <li><strong>Hipernatremia:</strong> SF 0,45% ou SG 5% — meta ↓ Na+ ≤ 10 mEq/L em 24 h; tratar causa (perdas, diabetes insípido).</li>
      <li><strong>Hipocalcemia sintomática</strong> (tetania, QT longo): gluconato de cálcio 10% 10 mL EV lento; manutenção e vitamina D conforme causa.</li>
      <li><strong>Hipomagnesemia:</strong> sulfato de magnésio 2 g EV em 20 min — frequentemente associada a hipocalemia refratária.</li>
      <li><strong>Monitorização:</strong> eletrólitos seriados q4–6 h durante correção aguda; ECG contínuo se K+ crítico.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Correção ambulatorial se distúrbio leve e causa identificada (ex.: diurético, vômitos).</li>
      <li>Ajustar medicações (IECA, espironolactona, diuréticos) e reavaliar laboratorialmente.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Eletrólitos séricos, osmolaridade, ureia, creatinina, glicemia, magnésio, cálcio ionizado.</li>
      <li>Gasometria se acidose/alcalose; ECG 12 derivações.</li>
      <li>Investigar causa: diuréticos, SIADH, insuficiência adrenal, rabdomiólise, vômitos/diarreia.</li>
    </ul>
    <p class="emerg-note">KDIGO · nefrologia. Velocidade de correção de Na+ — risco de mielinólise. Conteúdo orientativo.</p>
  `,

  'dpoc-exacerbada': `
    <p class="muted">Exacerbação de DPOC — dispneia ↑, volume/purulência do escarro; broncodilatador + corticoide sistêmico ± antibiótico se infecção bacteriana provável.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> · oximetria · O₂ titulado (SpO₂ 88–92% se hipercápnico conhecido) · gasometria se rebaixamento ou SpO₂ &lt; 88% em O₂.</li>
      <li><strong>Broncodilatador inalatório:</strong> salbutamol 100 mcg/puff — 4–10 puffs a cada 20 min × 3 ciclos (nebul: 2,5–5 mg) + ipratrópio 20 mcg/puff 4–8 puffs ou nebul 0,5 mg 6/6 h (Atrovent®).</li>
      <li><strong>Corticoide sistêmico:</strong> prednisona 40 mg VO 24/24 h · 5 dias <em>ou</em> metilprednisolona 40 mg EV 24/24 h se VO impossível.</li>
      <li><strong>Antibiótico</strong> se ↑ escarro purulento + dispneia (Anthonisen ≥ 2 critérios) ou ventilação mecânica:
        <ul>
          <li><strong>Amoxicilina + clavulanato</strong> 875/125 mg VO 12/12 h · 5–7 dias (Clavulin®).</li>
          <li><strong>Alternativa/alergia:</strong> levofloxacino 500 mg VO/EV 24/24 h · 5 dias.</li>
        </ul>
      </li>
      <li><strong>Suporte:</strong> VNI (BiPAP) se acidose respiratória (pH &lt; 7,35 + PaCO₂ &gt; 45) — contraindicar se instabilidade hemodinâmica ou rebaixamento sem proteção de via aérea.</li>
      <li><strong>Evitar:</strong> sedação excessiva; morfina de rotina (risco de retenção CO₂).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Alta se melhora clínica, SpO₂ estável em ar ambiente ou O₂ domiciliar habitual, sem acidose.</li>
      <li>Completar prednisona 5 dias e ATB se indicado; reforçar aderência a broncodilatador de manutenção (LAMA/LABA).</li>
      <li>Vacina influenza/pneumocócica; cessação tabágica; reabilitação pulmonar.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Oximetria, gasometria arterial se moderada/grave.</li>
      <li>Radiografia de tórax — excluir pneumonia, pneumotórax, edema.</li>
      <li>Hemograma, PCR; cultura de escarro se pneumonia associada.</li>
    </ul>
    <p class="emerg-note">GOLD 2024 · SBPT. VNI reduz intubação na acidose respiratória. Conteúdo orientativo.</p>
  `,

  'edema-agudo-pulmao': `
    <p class="muted">Edema agudo de pulmão cardiogênico — dispneia súbita, estertores, SpO₂ baixa; reduzir pré/pós-carga, diurese e suporte ventilatório.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> · posição sentada · O₂ alto fluxo · monitor · acesso venoso.</li>
      <li><strong>Diurético de alça:</strong> furosemida 40–80 mg EV (duplicar se uso crônico de furosemida) — repetir conforme diurese e clínica.</li>
      <li><strong>Vasodilatador:</strong> nitroglicerina EV titulada 10–20 mcg/min → ↑ 5–10 mcg/min q5 min (meta PA sistólica &gt; 90 mmHg) <em>ou</em> nitroglicerina SL 0,4 mg q5 min (máx. 3) se PA permitir.</li>
      <li><strong>CPAP/VNI</strong> 5–10 cmH₂O precoce se dispneia intensa e SpO₂ refratária — reduz intubação.</li>
      <li><strong>Morfina</strong> com cautela: 2–4 mg EV lento se ansiedade/dispneia refratária e PA estável — monitorar depressão respiratória (evitar rotina).</li>
      <li><strong>Tratar precipitante:</strong> crise hipertensiva, IAM, arritmia, valvopatia; não usar betabloqueador na fase aguda instável.</li>
      <li><strong>Intubação</strong> se falha VNI, rebaixamento ou instabilidade hemodinâmica.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Internação na maioria até euvolemia e estabilidade hemodinâmica.</li>
      <li>Ajuste de IECA/BRA, betabloqueador e diurético ambulatorial após estabilização.</li>
      <li>Restrição de sódio e monitorização de peso diário.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>ECG, troponina, BNP/NT-proBNP, radiografia de tórax.</li>
      <li>Gasometria arterial; ecocardiograma (bedside ou formal) se função ventricular desconhecida.</li>
      <li>Eletrólitos e função renal seriados durante diurese.</li>
    </ul>
    <p class="emerg-note">SBC · ESC 2021 IC aguda. Nitroprussiato se PA muito elevada e EAP — ver lote 3 (crise hipertensiva). Conteúdo orientativo.</p>
  `,

  'edema-angioneurotico': `
    <p class="muted">Edema angioneurótico (EAO) — face, lábios, língua ou extremidades; diferenciar histaminérgico (anafilaxia) de bradicinínico (IECA); risco de obstrução de via aérea.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Via aérea primeiro:</strong> avaliar estridor, voz abafada, progressão rápida — preparar intubação/cricotireoidostomia.</li>
      <li><strong>EAO histaminérgico / anafilaxia associada</strong> (urticária, prurido, broncoespasmo):
        <ul>
          <li><strong>Adrenalina IM</strong> 0,5 mg (0,5 mL 1:1000) — repetir q5–15 min se necessário.</li>
          <li>Anti-H1: prometazina 25 mg IM/EV ou dexclorfeniramina 2 mg EV.</li>
          <li>Corticoide: hidrocortisona 200 mg EV ou prednisona 40 mg VO.</li>
        </ul>
      </li>
      <li><strong>EAO bradicinínico (IECA)</strong> — sem urticária, uso de IECA/BRA:
        <ul>
          <li><strong>Suspender IECA/BRA</strong> definitivamente.</li>
          <li><strong>Icatibanto</strong> 30 mg SC (Firazyr®) se disponível — padrão para EAO hereditário e IECA.</li>
          <li>Alternativas: plasma fresco congelado 2–4 U EV; ácido tranexâmico 1 g EV (evidência limitada).</li>
          <li><strong>Adrenalina e anti-H1 têm eficácia limitada</strong> — não atrasar via aérea.</li>
        </ul>
      </li>
      <li><strong>Observação:</strong> mínimo 6–12 h se envolvimento de língua/laringe; UTI se via aérea comprometida.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Alta após resolução completa e via aérea estável por observação adequada.</li>
      <li>Cartão de alerta; evitar IECA/BRA se EAO bradicinínico; trocar por ARA II também contraindicado.</li>
      <li>Encaminhar alergologia/imunologia se EAO hereditário ou recorrente.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica — complemento C4 baixo sugere EAO hereditário ou adquirido por consumo.</li>
      <li>Investigar C1-inibidor (quantitativo/funcional) ambulatorialmente se recorrente sem IECA.</li>
    </ul>
    <p class="emerg-note">WAO/ACAAI · BRASH. EAO por IECA não responde a adrenalina como anafilaxia. Conteúdo orientativo.</p>
  `,

  'edema-mmi': `
    <p class="muted">Edema de membros inferiores agudo ou crônico agudizado — distinguir insuficiência venosa, celulite, TVP, ICC e linfedema; tratar causa e medidas mecânicas.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir TVP/EP</strong> (dor panturrilha unilateral, calor, Wells) e celulite (eritema, febre) — ver entradas específicas se confirmado.</li>
      <li><strong>Medidas gerais:</strong> elevação de MMII, meias de compressão elástica (20–30 mmHg) se sem suspeita de TVP aguda não investigada.</li>
      <li><strong>ICC descompensada:</strong> furosemida 40 mg VO/EV + restrição de sódio; investigar EAP (ver <em>edema-agudo-pulmao</em>).</li>
      <li><strong>Insuficiência venosa/crônico:</strong> compressão + hidroclorotiazida 25 mg VO/dia ou furosemida curso curto se sobrecarga.</li>
      <li><strong>Celulite sobre edema:</strong> cefalexina 500 mg VO 6/6 h ou clindamicina 300 mg VO 6/6 h se alergia a penicilina.</li>
      <li><strong>Analgesia:</strong> dipirona; elevar pernas acima do nível do coração.</li>
      <li><strong>Suspender</strong> AINE, bloqueador de canal de cálcio (anlodipino) se edema bilateral indolor recente.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Meias de compressão graduada; exercício de bomba muscular; perda ponderal se obesidade.</li>
      <li>Tratar insuficiência venosa crônica, linfedema ou ajustar medicações causadoras.</li>
      <li>Encaminhar vascular se úlcera, varizes sintomáticas ou suspeita de TVP (USG doppler ambulatorial urgente).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>USG doppler venoso MMII se edema unilateral, dor ou alto risco para TVP.</li>
      <li>BNP, radiografia de tórax, ECG se suspeita de ICC.</li>
      <li>Albumina, função hepática/renal se edema generalizado (anasarca).</li>
    </ul>
    <p class="emerg-note">SBACV · consenso linfedema. TVP não tratada antes de compressão firme. Conteúdo orientativo.</p>
  `,

  'estado-hiperosmolar': `
    <p class="muted">Estado hiperglicêmico hiperosmolar (EHH) — glicemia &gt; 600 mg/dL, osmolaridade &gt; 320 mOsm/kg, sem cetoacidose significativa; desidratação grave e alteração mental.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> · glicemia capilar · gasometria · osmolaridade sérica · eletrólitos · ureia/creatinina.</li>
      <li><strong>Hidratação agressiva (prioridade):</strong> SF 0,9% 15–20 mL/kg na 1ª hora (1–1,5 L/h adulto) — meta ↓ glicemia 50–70 mg/dL/h.</li>
      <li><strong>Ajuste de fluido:</strong> SF 0,45% se hipernatremia após 1ª hora; manter SF 0,9% se hipotensão.</li>
      <li><strong>Insulina EV</strong> (após hidratação inicial e se glicemia não cai adequadamente): insulina regular 0,05–0,1 U/kg/h — <strong>sem bolus</strong> ou bolus 0,1 U/kg conforme protocolo local.</li>
      <li><strong>Potássio:</strong> repor conforme níveis (K &lt; 3,3 → adiar insulina; K 3,3–5,2 → 20–30 mEq/L de fluido).</li>
      <li><strong>Evitar bicarbonato</strong> de rotina; tratar precipitante (infecção, IAM, diuréticos, suspensão insulina).</li>
      <li><strong>Monitorização:</strong> glicemia horária, eletrólitos q2–4 h, balanço hídrico; UTI se rebaixamento ou instabilidade.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Transição para insulina SC após estabilização (osmolaridade &lt; 315, glicemia &lt; 300, paciente alerta).</li>
      <li>Educar aderência, reconhecimento de desidratação e ajuste de medicações (SGLT2, diuréticos).</li>
      <li>Endocrinologia ambulatorial.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Glicemia, gasometria, β-hidroxibutirato (baixo/ausente), osmolaridade calculada.</li>
      <li>Hemograma, PCR, urina/culturas — buscar infecção precipitante.</li>
      <li>ECG; troponina se sintomas coronarianos.</li>
    </ul>
    <p class="emerg-note">ADA 2024 · SBD. Diferenciar de cetoacidose (lote 1). Osmolaridade = 2×Na + glicemia/18 + ureia/6. Conteúdo orientativo.</p>
  `,

  'erisipela': `
    <p class="muted">Erisipela — infecção cutânea superficial dermo-hipodérmica, bordas elevadas, febre; Streptococcus pyogenes mais comum — antibiótico precoce.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir fascite necrotizante</strong> — dor desproporcional, crepitação, hipotensão, bolhas hemorrágicas → cirurgia + ATB amplo imediato.</li>
      <li><strong>Medidas locais:</strong> repouso, elevação do membro, hidratação.</li>
      <li><strong>Antibiótico VO</strong> (erisipela leve, afebril ou febre baixa):
        <ul>
          <li><strong>Penicilina V</strong> 500 mg VO 6/6 h · 10–14 dias <em>ou</em></li>
          <li><strong>Amoxicilina</strong> 500 mg VO 8/8 h · 10–14 dias <em>ou</em></li>
          <li><strong>Cefalexina</strong> 500 mg VO 6/6 h · 10–14 dias (Keflex®).</li>
        </ul>
      </li>
      <li><strong>Antibiótico EV</strong> (febre alta, toxemia, falha VO, imunossupressão):
        <ul>
          <li><strong>Penicilina G cristalina</strong> 2–4 milhões UI EV 4/4 h <em>ou</em></li>
          <li><strong>Cefazolina</strong> 1–2 g EV 8/8 h.</li>
        </ul>
      </li>
      <li><strong>Alergia grave a penicilina:</strong> clindamicina 600 mg VO/EV 8/8 h.</li>
      <li><strong>Analgesia/antitérmico:</strong> dipirona ou paracetamol; AINE com cautela se desidratação.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Completar 10–14 dias de ATB; marcar bordas do eritema para monitorar progressão.</li>
      <li>Tratar porta de entrada (tinea pedis, úlcera, linfedema); profilaxia secundária se recorrente (penicilina V ou eritromicina).</li>
      <li>Retorno em 48 h se piora ou febre persistente.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico na maioria; hemocultura se febre alta ou bacteriemia suspeita.</li>
      <li>PCR, procalcitonina se moderada/grave; USG pele se abscesso ou celulite profunda.</li>
      <li>Hemoglobina glicada se DM ou obesidade.</li>
    </ul>
    <p class="emerg-note">IDSA SSTI 2014 · MS. Fascite necrotizante = emergência cirúrgica. Conteúdo orientativo.</p>
  `,

  'escabiose': `
    <p class="muted">Escabiose (sarna) — prurido noturno, túneis interdigitais, contágio familiar; tratamento tópico ou oral conforme extensão.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Confirmar diagnóstico clínico</strong> — prurido ↑ à noite, lesões em espaços interdigitais, punhos, axilas, região genital; raspado (+) se disponível.</li>
      <li><strong>Tratamento tópico (1ª linha):</strong> permetrina 5% creme — aplicar pescoço aos pés (incluir couro cabeludo em lactentes) · 8–12 h · repetir em 7 dias (Elimite®).</li>
      <li><strong>Alternativa tópica:</strong> enxofre 6–10% pomada noturna · 3 noites consecutivas (gestantes/lactantes — opção segura).</li>
      <li><strong>Escabiose norueguesa/crostosa ou falha tópica:</strong> ivermectina 200 mcg/kg VO dose única — repetir em 7–14 dias (Revectina®).</li>
      <li><strong>Anti-histamínico</strong> para prurido: hidroxizina 25 mg VO à noite ou dexclorfeniramina 2 mg 8/8 h.</li>
      <li><strong>Corticóide tópico baixa potência</strong> 3–5 dias se dermatite eczematizada secundária.</li>
      <li><strong>Tratar contactantes</strong> simultaneamente (mesmo esquema) — mesmo assintomáticos.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Roupas de cama e vestuário usado nos últimos 3 dias — lavar a ≥ 60 °C ou saco plástico fechado 72 h.</li>
      <li>Prurido pode persistir 2–4 semanas pós-tratamento — não significa falha isoladamente.</li>
      <li>Retorno se lesões novas distantes ou escabiose crostosa (imunossupressão).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Raspado cutâneo com lâmina e KOH — ácaro/ovos/escamas (sensibilidade moderada).</li>
      <li>Investigar imunossupressão se escabiose norueguesa.</li>
    </ul>
    <p class="emerg-note">CDC/MS · SBD. Ivermectina contraindicada &lt; 15 kg e gestação (categoria C — usar enxofre). Conteúdo orientativo.</p>
  `,

  'escorpionismo': `
    <p class="muted">Escorpionismo no Brasil (<em>Tityus</em>) — dor local intensa, sudorese, náuseas; casos graves (crianças): vômitos, sudorese profusa, bradicardia, ICC, edema pulmonar — suporte e UTI.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Classificação de gravidade:</strong> leve (local) · moderado (sistêmico sem disfunção) · grave (criança &lt; 7 anos, ICC, EAP, convulsão, choque).</li>
      <li><strong>Medidas iniciais:</strong> lavagem local, analgesia imediata, monitor cardíaco se sintomas sistêmicos.</li>
      <li><strong>Analgesia:</strong> dipirona 1 g EV/IM + lidocaína 2% sem vasoconstrictor infiltrada no ponto (se extremidade) — opioide (morfina 2–5 mg EV) se dor refratária.</li>
      <li><strong>Leve/moderado (adulto estável):</strong> observação 6–12 h; sintomáticos — antiemético (metoclopramida 10 mg EV), benzodiazepínico se agitação (diazepam 5–10 mg EV).</li>
      <li><strong>Grave (pediatria ou disfunção cardíaca/pulmonar):</strong>
        <ul>
          <li><strong>Suporte avançado:</strong> O₂, acesso venoso, UTI pediátrica/adulto.</li>
          <li><strong>Choque/ICC:</strong> dobutamina ou dopamina titulada; furosemida se EAP.</li>
          <li><strong>Convulsão:</strong> diazepam 0,2 mg/kg EV; fenitoína se EM.</li>
          <li><strong>Soro escorpiônico</strong> (Butantan/Fiocruz) — indicado em casos graves pediátricos conforme protocolo local e disponibilidade (evidência variável; priorizar suporte).</li>
        </ul>
      </li>
      <li><strong>Evitar:</strong> torniquete, incisão/sucção do local, corticoide de rotina.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Alta após 6–12 h de observação se leve, adulto, sem disfunção orgânica.</li>
      <li>Criança com sintomas sistêmicos — internar mínimo 24 h (risco de pico tardio).</li>
      <li>Orientar sinais de gravidade; notificação compulsória em alguns estados.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Glicemia capilar (hipo/hiperglicemia transitória), ECG, enzimas cardíacas se grave.</li>
      <li>Radiografia de tórax se dispneia; gasometria se insuficiência respiratória.</li>
      <li>Eletrólitos e função renal em casos moderados/graves.</li>
    </ul>
    <p class="emerg-note">MS/Fiocruz/Butantan · manual de acidentes por animais peçonhentos. Suporte clínico é pilar do tratamento. Conteúdo orientativo.</p>
  `,

  'delirium': `
    <p class="muted">Delirium (estado confusional agudo) — início agudo, curso flutuante, desatenção; tratar causa base e medidas não farmacológicas antes de sedação.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir emergências:</strong> hipoglicemia, hipoxia, AVC, meningite, intoxicação — glicemia capilar, SpO₂, TC crânio se focal/neurológico agudo.</li>
      <li><strong>Medidas não farmacológicas:</strong> orientar (relógio, calendário), presença de familiar, óculos/aparelho auditivo, mobilizar precocemente, evitar contenção.</li>
      <li><strong>Corrigir precipitantes:</strong> infecção, desidratação, retenção urinária/fecal, dor, hipoxia, eletrólitos (Na+, Ca++), suspender fármacos deliriogênicos (anticolinérgicos, benzodiazepínicos, opioides).</li>
      <li><strong>Agitação grave com risco:</strong> haloperidol 0,5–1 mg VO/IM/EV — repetir q30 min (máx. 5 mg/dia inicial) <em>ou</em> quetiapina 12,5–25 mg VO.</li>
      <li><strong>Evitar benzodiazepínicos</strong> exceto abstinência alcoólica ou sedação para procedimento.</li>
      <li><strong>Monitor cardíaco</strong> se haloperidol EV (risco QT longo); ECG se dose repetida.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Internação se causa não corrigida, agitação refratária ou incapacidade de cuidado domiciliar.</li>
      <li>Revisar polifarmácia ambulatorial; orientar cuidador sobre curso flutuante.</li>
      <li>Encaminhar geriatria/neurologia se delirium persistente após tratar causas.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Glicemia, eletrólitos, ureia, creatinina, hemograma, PCR; urina/cultura; Rx tórax se infecção.</li>
      <li>TC crânio se trauma, focal ou primeiro episódio atípico.</li>
      <li>Dosagem de fármacos (digoxina, lítio) se suspeita de toxicidade.</li>
    </ul>
    <p class="emerg-note">Confusion Assessment Method (CAM) · SBPT geriatria. Delirium ≠ demência — curso agudo e flutuante. Conteúdo orientativo.</p>
  `,

  'fissura-anal': `
    <p class="muted">Fissura anal aguda — dor anal intensa à evacuação, sangramento vivo em pequena quantidade; medidas conservadoras na maioria.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Excluir abscesso/fístula/hemorroida trombosada</strong> — inspeção anal cuidadosa (anestésico tópico se necessário).</li>
      <li><strong>Medidas conservadoras:</strong> fibras (psyllium 3–6 g/dia), hidratação, banho de assento morno 10–15 min 2–3×/dia.</li>
      <li><strong>Analgesia:</strong> dipirona ou paracetamol; AINE curto prazo se tolerado.</li>
      <li><strong>Relaxante esfincteriano tópico:</strong> diltiazem 2% pomada ou nifedipino 0,2–0,3% pomada — aplicar 8/8 h · 6–8 sem (manipulação ou formulações disponíveis).</li>
      <li><strong>Alternativa:</strong> nitroglicerina 0,2–0,4% pomada 8/8 h — cefaleia limita uso.</li>
      <li><strong>Evitar:</strong> laxativos estimulantes agressivos; opioides (pioram constipação).</li>
      <li><strong>Constipação associada:</strong> PEG 17 g/dia ou lactulose até fezes macias.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Continuar pomada tópica 6–8 sem; reavaliação proctológica se crônica (&gt; 8 sem) ou recorrente.</li>
      <li>Botox ou esfincterotomia lateral interna se falha conservadora — encaminhar coloproctologia.</li>
      <li>Investigar Crohn se fissuras múltiplas ou atípicas.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico; anuscopia se diagnóstico incerto.</li>
      <li>Colonoscopia se &gt; 50 anos, sangramento atípico ou sinais de alarme.</li>
      <li>Evitar TO digital vigoroso se dor extrema (risco de espasmo).</li>
    </ul>
    <p class="emerg-note">ASCRS · SBCP. Fissura crônica (ulcerada com papila sentinela) — menor taxa de cicatrização clínica. Conteúdo orientativo.</p>
  `
};
