/* Pronto Socorro — conteúdo clínico (lote 3) */

const PS_CONTENT_3 = {
  'flebite': `
    <p class="muted">Tromboflebite superficial de veia periférica — dor, cordão endurecido e eritema ao longo do trajeto venoso. Diferenciar de TVP profunda e celulite adjacente.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Exame clínico</strong> — cordão palpável, calor local; medir circunferência do membro; avaliar sinais de TVP (Homans não confiável — preferir Wells + USG se dúvida).</li>
      <li><strong>Analgesia</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 1 g VO/EV 6/6 h.</li>
          <li><strong>Alternativa:</strong> ibuprofeno 400 mg VO 8/8 h (se sem contraindicação renal/gástrica).</li>
        </ul>
      </li>
      <li><strong>Medidas locais</strong> — elevação do membro, compressa morna, meia elástica se confortável.</li>
      <li><strong>Extensão &gt; 5 cm ou próximo à safena</strong> — considerar anticoagulação:
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> enoxaparina 40 mg SC 1×/dia por 4–6 semanas.</li>
          <li><strong>Alternativa:</strong> rivaroxabana 10 mg VO 1×/dia conforme protocolo local.</li>
        </ul>
      </li>
      <li><strong>Suspeita de TVP/SEP</strong> — USG Doppler venoso; internar se trombose profunda, febre, celulite sobreposta ou imunossupressão.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno em 48–72 h se piora, febre ou extensão proximal.</li>
      <li>Evitar cateter venoso no mesmo membro até resolução.</li>
      <li>Reavaliar necessidade de anticoagulação se progressão.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>USG Doppler se dúvida TVP, edema importante ou dor poplítea.</li>
      <li>Hemograma se febre ou celulite associada.</li>
    </ul>
    <p class="emerg-note">ACCP / SBC trombose venosa. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'frieira': `
    <p class="muted">Tinea pedis (frieira) — dermatofitose interdigital ou plantar; prurido, maceração e descamação. Comum após umidade e calçado fechado.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Forma interdigital (mais comum)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> clotrimazol creme 1% (Canesten®) tópico 2×/dia por 2–4 semanas.</li>
          <li><strong>Alternativa:</strong> miconazol 2% tópico 2×/dia por 2–4 semanas.</li>
        </ul>
      </li>
      <li><strong>Forma mocócica/plantar</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> terbinafina creme 1% (Lamisil®) 1–2×/dia.</li>
          <li><strong>Alternativa:</strong> naftifina 1% tópico 1×/dia.</li>
        </ul>
      </li>
      <li><strong>Resistente ou extensa</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> terbinafina 250 mg VO 1×/dia por 2–6 semanas (adulto).</li>
          <li><strong>Alternativa:</strong> itraconazol 100 mg VO 2×/dia por 1 semana (pulso).</li>
        </ul>
      </li>
      <li><strong>Infecção bacteriana secundária</strong> (eritema, dor, secreção purulenta) —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cefalexina 500 mg VO 6/6 h por 7–10 dias.</li>
          <li><strong>Alternativa:</strong> clindamicina 300 mg VO 6/6 h (cobertura MRSA).</li>
          <li><strong>Alérgico (anafilaxia a β-lactâmico):</strong> clindamicina 300 mg VO 6/6 h.</li>
        </ul>
      </li>
      <li><strong>Higiene</strong> — manter pés secos, trocar meias, calçado ventilado; evitar compartilhar toalhas.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Tratamento tópico mínimo 2 semanas após resolução clínica.</li>
      <li>Reavaliar se sem melhora em 2–3 semanas — considerar onicomicose associada.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico na maioria dos casos.</li>
      <li>Exame micológico direto/cultura se atípico ou refratário.</li>
    </ul>
    <p class="emerg-note">SBDT / MS atenção básica. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'furunculose': `
    <p class="muted">Infecção profunda do folículo piloso por <em>S. aureus</em> — nódulo doloroso com pústula central. Carbúnculo = múltiplos furúnculos confluentes.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Flutuante e &gt; 1 cm</strong> — incisão e drenagem (I&amp;D) após anestesia local; não fechar; curativo oclusivo.</li>
      <li><strong>Sem celulite extensa</strong> — após I&amp;D, pode dispensar ATB se imunocompetente e drenagem adequada.</li>
      <li><strong>Celulite associada, imunossupressão, face, mão ou febre</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cefalexina 500 mg VO 6/6 h por 7–10 dias.</li>
          <li><strong>Alternativa:</strong> clindamicina 300 mg VO 6/6 h (cobertura MRSA).</li>
          <li><strong>Alérgico (anafilaxia a penicilina):</strong> clindamicina 300 mg VO 6/6 h.</li>
        </ul>
      </li>
      <li><strong>MRSA conhecido ou falha terapêutica</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> sulfametoxazol-trimetoprima 800/160 mg VO 12/12 h.</li>
          <li><strong>Alternativa:</strong> doxiciclina 100 mg VO 12/12 h.</li>
        </ul>
      </li>
      <li><strong>Carbúnculo, sepse ou abscesso profundo</strong> —
        <ul class="ps-med-options">
          <li><strong>Grave:</strong> ceftriaxona 1 g EV 12/12 h.</li>
          <li><strong>MRSA suspeito:</strong> associar vancomicina EV conforme protocolo local; avaliar cirurgia.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Curativos diários; retorno em 48 h se piora ou febre.</li>
      <li>Higiene das mãos; não compartilhar toalhas/roupas.</li>
      <li>Furúnculos recorrentes — investigar portador nasal de S. aureus.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Cultura de secreção se recorrente, MRSA ou falha de ATB.</li>
      <li>Hemocultura se febre &gt; 38,5 °C ou sinais sistêmicos.</li>
    </ul>
    <p class="emerg-note">IDSA pele e partes moles. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'gonorreia-clamidia': `
    <p class="muted">Uretrite/cervicite não complicada por <em>Neisseria gonorrhoeae</em> e/ou <em>Chlamydia trachomatis</em>. Tratar ambos empiricamente até exclusão.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Esquema não complicado (adulto)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 500 mg IM dose única + azitromicina 1 g VO dose única.</li>
          <li><strong>Alternativa (resistência local documentada):</strong> ceftriaxona 1 g IM dose única + azitromicina 1 g VO dose única.</li>
          <li><strong>Alérgico (anafilaxia a cefalosporina):</strong> gentamicina 240 mg IM dose única + azitromicina 2 g VO dose única (discutir com infectologia).</li>
        </ul>
      </li>
      <li><strong>Contraceptivo oral</strong> — azitromicina não reduz eficácia de COC; orientar uso de preservativo.</li>
      <li><strong>Complicada (DIP, epididimite, artrite gonocócica)</strong> —
        <ul class="ps-med-options">
          <li><strong>Grave:</strong> ceftriaxona 1 g IM/EV 24/24 h + doxiciclina 100 mg VO 12/12 h por 14 dias; internar se grave.</li>
          <li><strong>Alternativa (gestante, DIP):</strong> ceftriaxona 1 g IM/EV 24/24 h + azitromicina 1 g VO semanal por 2 semanas.</li>
        </ul>
      </li>
      <li><strong>Notificação e rastreio</strong> — tratar parceiros dos últimos 60 dias; abstinência até 7 dias após tratamento; testar HIV e sífilis.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno em 7 dias se sintomas persistem — repetir cultura/NAAT.</li>
      <li>Teste de cura para gonorreia em gestantes ou falha terapêutica (não rotineiro se assintomático).</li>
      <li>Orientar ISTs, preservativo e vacinação anti-HPV/hepatite B.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>NAAT (PCR) de urina 1ª jato ou swab uretral/cervical.</li>
      <li>Sorologias HIV, sífilis, hepatites conforme risco.</li>
    </ul>
    <p class="emerg-note">MS — Protocolo Clínico IST 2022 / CDC. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'gota': `
    <p class="muted">Artrite inflamatória por cristais de urato — monoartrite aguda (1º MTP clássico), muito dolorosa. <strong>Não iniciar alopurinol na crise aguda.</strong></p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Confirmar diagnóstico</strong> — artrite mono/oligoarticular; excluir sepse articular (artrocentese se dúvida ou febre).</li>
      <li><strong>Anti-inflamatório (escolher conforme contraindicações)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha (primeiras 12 h):</strong> colchicina 1 mg VO, depois 0,5 mg 1 h depois; manutenção 0,5 mg VO 12/12 h (máx. 3 dias se TFG normal; reduzir se TFG &lt; 60).</li>
          <li><strong>Alternativa:</strong> naproxeno 500 mg VO 12/12 h ou ibuprofeno 600 mg VO 8/8 h por 5–7 dias (evitar se DRC, úlcera ativa, anticoagulação).</li>
          <li><strong>Alérgico/contraindicação a AINE e colchicina:</strong> prednisona 30–40 mg VO 1×/dia por 5–7 dias.</li>
          <li><strong>Grave/refratária (monoarticular):</strong> triancinolona intra-articular 40 mg (joelho) sob técnica asséptica.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li><strong>Alopurinol ou febuxostat</strong> — iniciar apenas após resolução da crise (geralmente 2–4 semanas), com colchicina profilática 0,5 mg/dia por 6 meses.</li>
      <li>Reduzir álcool, frutos do mar, carnes vermelhas; hidratação adequada.</li>
      <li>Reumatologia se gota tofácea, nefrolitíase ou crises frequentes.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Ácido úrico sérico (pode estar normal na crise).</li>
      <li>Artrocentese — cristais de urato em birrefringência negativa (padrão-ouro).</li>
      <li>PCR, hemograma; radiografia se diagnóstico incerto.</li>
    </ul>
    <p class="emerg-note">ACR/EULAR gota 2020 · SB Reumatologia. <strong>Alopurinol não na crise aguda.</strong> Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'gripe-influenza': `
    <p class="muted">Síndrome gripal viral — febre, mialgia, tosse seca, cefaleia. Influenza (H1N1, H3N2) pode evoluir com pneumonia; diferenciar de resfriado comum (sintomas mais leves, coriza predominante).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Estabilização</strong> — oximetria; O₂ se SatO₂ &lt; 94%; acesso venoso se desidratação ou hipotensão.</li>
      <li><strong>Antiviral (iniciar &lt; 48 h dos sintomas, ou até 5 dias se grave)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha (adulto):</strong> oseltamivir 75 mg VO 12/12 h por 5 dias.</li>
          <li><strong>Pediatria:</strong> oseltamivir dose por peso (3 mg/kg/dose 12/12 h se &lt; 15 kg — ver bula).</li>
          <li><strong>Grave/hospitalizado:</strong> oseltamivir 75 mg VO 12/12 h por 10 dias; considerar ceftriaxona 1 g EV 24/24 h se pneumonia bacteriana sobreposta.</li>
        </ul>
      </li>
      <li><strong>Sintomáticos</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona ou paracetamol; hidratação oral.</li>
          <li><strong>Evitar:</strong> AAS em crianças (risco Reye).</li>
        </ul>
      </li>
      <li><strong>Sinais de gravidade</strong> — dispneia, PAO₂ baixa, rebaixamento — internar; considerar ceftriaxona se pneumonia bacteriana sobreposta.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Repouso, hidratação, isolamento respiratório por 5–7 dias.</li>
      <li>Retorno se dispneia, febre &gt; 3 dias ou piora clínica.</li>
      <li>Vacinação anual contra influenza na próxima temporada.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>RT-PCR influenza ou teste rápido se disponível (não obrigatório para tratar).</li>
      <li>Radiografia de tórax se hipoxemia, estertores ou febre persistente.</li>
    </ul>
    <p class="emerg-note">MS/ANVISA oseltamivir · OPAS influenza. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'hda': `
    <p class="muted">Hemorragia digestiva alta — hematêmese ou melena. Priorizar estabilização hemodinâmica, estratificação de risco (Glasgow-Blatchford/Rockall) e endoscopia precoce.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — 2 acessos venosos calibrosos; monitor; tipagem e reserva de hemácias.</li>
      <li><strong>Reposição volêmica</strong> — SF 0,9% ou Ringer lactato; transfusão se Hb &lt; 7 g/dL (ou &lt; 9 se coronariopata/instável).</li>
      <li><strong>Úlcera péptica (suspeita)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> omeprazol 80 mg EV bolus + infusão 8 mg/h EV por 72 h.</li>
          <li><strong>Alternativa (alta):</strong> omeprazol 40 mg VO 12/12 h por 8 semanas após endoscopia.</li>
        </ul>
      </li>
      <li><strong>Varizes esofágicas</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> octreotide 50 mcg EV bolus + 50 mcg/h EV infusão + ceftriaxona 1 g EV 24/24 h (profilaxia PBE).</li>
          <li><strong>Alternativa:</strong> terlipressina EV se disponível (mesma indicação).</li>
          <li><strong>Grave/refratário:</strong> manter octreotide + ceftriaxona; endoscopia em &lt; 12 h.</li>
        </ul>
      </li>
      <li><strong>Anticoagulantes/antiplaquetários</strong> — suspender; reversão conforme indicação (vitamina K, PCC, idarucizumabe).</li>
      <li><strong>Endoscopia</strong> — idealmente em &lt; 24 h (em &lt; 12 h se instável ou alta suspeita de varize).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Somente após endoscopia e estabilização — casos de baixo risco (Glasgow-Blatchford 0–1).</li>
      <li>Omeprazol 40 mg VO 12/12 h por 8 semanas se úlcera; erradicar <em>H. pylori</em> se positivo.</li>
      <li>Evitar AINE e álcool; seguimento gastroenterologia.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma, ureia (ureia elevada na HDA), coagulograma, função hepática se varize.</li>
      <li>Endoscopia digestiva alta — padrão-ouro.</li>
      <li>AngioTC ou arteriografia se sangramento refratário.</li>
    </ul>
    <p class="emerg-note">BSG/ESGE HDA 2021 · SB Hepatologia varizes. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'hemorroidas': `
    <p class="muted">Dilatação de plexos hemorroidários — sangramento vivo indolor (internas) ou dor e trombose (externas). Excluir fissura, abscesso e neoplasia.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Trombose hemorroidária externa aguda</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona; banho de assento morno; lactulose 10–20 mL VO (evacuação macia).</li>
          <li><strong>Alternativa (dor intensa):</strong> tramadol 50–100 mg VO 6/6 h se necessário.</li>
          <li><strong>Grave (trombose extensa, &lt; 72 h):</strong> considerar evacuação trombótica (proctologia/cirurgia).</li>
        </ul>
      </li>
      <li><strong>Sangramento ativo</strong> — compressão local; reposição volêmica se instabilidade; investigar HDA se hematêmese/melena associados.</li>
      <li><strong>Tópico</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> pomada com lidocaína + hidrocortisona (uso curto).</li>
          <li><strong>Alternativa:</strong> polidocanol conforme formulário hospitalar.</li>
        </ul>
      </li>
      <li><strong>Internar</strong> — sangramento abundante, anemia sintomática, prolapso irredutível ou estrangulamento.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Fibras (psyllium), hidratação, evitar esforço evacuatório prolongado.</li>
      <li>Ligadura elástica ou cirurgia ambulatorial se sangramento recorrente (proctologia).</li>
      <li>Colonoscopia se &gt; 50 anos ou sangramento atípico (anemia, perda ponderal).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Inspeção anal e toque retal — avaliar fissura, abscesso, massa.</li>
      <li>Hemograma se sangramento significativo.</li>
      <li>Colonoscopia conforme idade e fatores de risco para CCR.</li>
    </ul>
    <p class="emerg-note">ASCRS / consensos proctologia BR. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'herpes-zoster': `
    <p class="muted">Reativação do VZV — erupção vesicular unilateral em dermátomo, dor neuropática. Imunossuprimidos e idosos têm maior risco de complicações.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Antiviral (iniciar &lt; 72 h do rash)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> valaciclovir 1 g VO 8/8 h por 7 dias.</li>
          <li><strong>Alternativa:</strong> aciclovir 800 mg VO 5×/dia por 7 dias.</li>
          <li><strong>Grave/imunossuprimido:</strong> aciclovir 10 mg/kg EV 8/8 h; internar se disseminado ou meningoencefalite.</li>
        </ul>
      </li>
      <li><strong>Analgesia</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona.</li>
          <li><strong>Alternativa (dor moderada):</strong> tramadol ou codeína.</li>
          <li><strong>Neuralgia persistente:</strong> amitriptilina 25 mg VO à noite ou pregabalina 75 mg VO 12/12 h.</li>
        </ul>
      </li>
      <li><strong>Herpes oftálmico (V1)</strong> — aciclovir EV + avaliação oftalmológica urgente; corticoide tópico sob orientação oftalmo.</li>
      <li><strong>Ramsay Hunt, disseminado ou pneumonia</strong> — internar; antiviral EV.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Completar 7 dias de antiviral; cobrir lesões; evitar contato com gestantes sem imunidade e imunossuprimidos.</li>
      <li>Vacina recombinante (Shingrix) após resolução — prevenção de recorrência e neuralgia.</li>
      <li>Seguimento se neuralgia pós-herpética &gt; 30 dias.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico na maioria dos casos.</li>
      <li>PCR VZV de lesão se atípico ou imunossuprimido.</li>
      <li>TC/RNM se suspeita de envolvimento SNC.</li>
    </ul>
    <p class="emerg-note">CDC/IDSA herpes zoster · MS vacinação. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'crise-hipertensiva': `
    <p class="muted">PA severamente elevada — distinguir <strong>urgência</strong> (sem lesão aguda de órgão-alvo) de <strong>emergência</strong> (lesão aguda: encefalopatia, EAP, AVC, dissecção, eclâmpsia). SCA tratado em protocolo específico (lote 4).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliação inicial</strong> — PA ambos braços, FC, exame neurológico, ausculta pulmonar, ECG, creatinina; fundo de olho se cefaleia intensa.</li>
      <li><strong>Urgência hipertensiva</strong> (PA elevada, assintomático ou cefaleia leve, sem LOA) —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> captopril 25 mg VO (repetir 25 mg após 30 min se necessário).</li>
          <li><strong>Alternativa:</strong> reiniciar anti-hipertensivo habitual; observação 4–6 h; meta em dias, não minutos.</li>
        </ul>
      </li>
      <li><strong>Emergência hipertensiva</strong> — acesso venoso, monitor, droga IV titulada conforme cenário; redução inicial ~10–25% na 1ª hora.</li>
      <li><strong>Escolha por cenário (emergência)</strong> —
        <ul class="ps-med-options">
          <li><strong>Encefalopatia hipertensiva:</strong> hidralazina 5–10 mg IV ou labetalol 10–20 mg IV (nicardipina EV se disponível).</li>
          <li><strong>EAP:</strong> nitroglicerina EV + furosemida 40–80 mg EV.</li>
          <li><strong>Dissecção aórtica (após β-bloqueio):</strong> nitroprussiato de sódio 0,25–10 mcg/kg/min EV — uso curto, UTI.</li>
          <li><strong>Eclâmpsia:</strong> hidralazina 5 mg IV + sulfato de magnésio 4 g EV bolus.</li>
        </ul>
      </li>
      <li><strong>Evitar</strong> — nifedipino sublingual (queda abrupta); normalizar PA rapidamente em urgência sem LOA.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Somente urgência estável — ajuste de anti-hipertensivos VO; retorno ambulatorial em 24–72 h.</li>
      <li>PA domiciliar; adesão medicamentosa; redução de sal e álcool.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>ECG, creatinina, urina (proteinúria/hematúria), TSH se primeira crise.</li>
      <li>TC crânio se déficit neurológico; TC tórax se dor torácica (dissecção).</li>
    </ul>
    <p class="emerg-note">SBC diretriz hipertensão 2020 · ESC/ACC. SCA/infarto — ver lote 4. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'hipoglicemia-grave': `
    <p class="muted">Glicemia &lt; 54 mg/dL com alteração de consciência, convulsão ou incapacidade de ingerir — tratar imediatamente. Mimetiza AVC.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — glicemia capilar imediata; via aérea se rebaixamento; acesso venoso.</li>
      <li><strong>Tratamento conforme via e consciência</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha (rebaixado, com acesso):</strong> glicose EV 25 g (SG 50% 50 mL ou SG 10% 250 mL) em bolus; repetir em 15 min se glicemia &lt; 54.</li>
          <li><strong>Alternativa (sem acesso venoso):</strong> glucagon 1 mg IM/SC (menos eficaz em hepatopatia ou jejum prolongado).</li>
          <li><strong>Consciente e capaz de deglutir:</strong> 15–20 g carboidrato rápido (suco, mel, glicose oral) + lanche após 15 min.</li>
          <li><strong>Grave (sulfonilureia como causa):</strong> octreotide 50 mcg SC 6/6 h; observação prolongada (risco recorrência).</li>
        </ul>
      </li>
      <li><strong>Pós-resolução</strong> — investigar causa (insulina, hipoglicemiante, etanol, sepse, IR); SF com glicose se jejum prolongado.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Somente se causa clara, glicemia estável e paciente orientado com suporte domiciliar.</li>
      <li>Ajuste de dose de insulina/sulfonilureia; educação sobre reconhecimento de sintomas.</li>
      <li>Internar se recorrente, sem causa identificada ou incapaz de autogestão.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Glicemia capilar seriada; glicemia venosa de confirmação.</li>
      <li>Investigar: insulina, peptídeo C, sulfonilureia sérica se causa obscura.</li>
    </ul>
    <p class="emerg-note">SBD / ADA hipoglicemia. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'hordeolo': `
    <p class="muted">Hordéolo (terçol) — abscesso agudo da glândula de Zeis ou Moll; pápula dolorosa na margem palpebral. Calázio é crônico (granuloma) — conduta diferente.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Compressas mornas</strong> — 4–6×/dia por 10–15 min; promove drenagem espontânea.</li>
      <li><strong>Higiene palpebral</strong> — limpeza com shampoo neutro diluído ou compressas; não espremer.</li>
      <li><strong>ATB tópico (inflamação importante)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> tobramicina pomada oftálmica 3–4×/dia por 7–10 dias.</li>
          <li><strong>Alternativa:</strong> eritromicina pomada oftálmica 3–4×/dia por 7–10 dias.</li>
        </ul>
      </li>
      <li><strong>Celulite pré-septal extensa ou febre</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cefalexina 500 mg VO 6/6 h por 7–10 dias.</li>
          <li><strong>Alternativa:</strong> clindamicina 300 mg VO 6/6 h (alergia a β-lactâmico).</li>
        </ul>
      </li>
      <li><strong>Orbital (pós-septal)</strong> —
        <ul class="ps-med-options">
          <li><strong>Grave:</strong> ceftriaxona EV + vancomicina EV; TC órbitas; oftalmologia/cirurgia.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Resolução espontânea em 1–2 semanas na maioria.</li>
      <li>I&amp;D ou excisão se abscesso flutuante sem drenagem espontânea.</li>
      <li>Oftalmologia se calázio crônico ou recorrência frequente.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico.</li>
      <li>TC órbitas se proptose, oftalmoplegia, dor à movimentação ou visão reduzida.</li>
    </ul>
    <p class="emerg-note">AAO / consensos oftalmologia. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'impetigo': `
    <p class="muted">Infecção superficial da pele por <em>S. aureus</em> ou <em>S. pyogenes</em> — crostas melicéricas (não bolhoso) ou bolhas flácidas (bolhoso). Comum em crianças.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Forma localizada (≤ 3 lesões)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> mupirocina 2% pomada tópica 3×/dia por 5–7 dias; higiene e remoção suave de crostas.</li>
        </ul>
      </li>
      <li><strong>Forma extensa ou bolhosa</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cefalexina 500 mg VO 6/6 h por 7 dias (adulto).</li>
          <li><strong>Alternativa:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h por 7 dias.</li>
          <li><strong>Alérgico (anafilaxia a penicilina):</strong> clindamicina 300 mg VO 6/6 h por 7 dias.</li>
        </ul>
      </li>
      <li><strong>MRSA suspeito</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> sulfametoxazol-trimetoprima 800/160 mg VO 12/12 h.</li>
          <li><strong>Alternativa:</strong> clindamicina 300 mg VO 6/6 h.</li>
        </ul>
      </li>
      <li><strong>Complicações</strong> — glomerulonefrite pós-estreptocócica (urina escura, edema) — internar e nefrologia; celulite — ATB sistêmico.</li>
      <li><strong>Isolamento</strong> — evitar contato escolar até 24 h de ATB ou crostas ressecadas.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Completar ciclo de ATB; lavar roupas e toalhas.</li>
      <li>Retorno se febre, lesões disseminadas ou urina alterada.</li>
      <li>Descolonização nasal com mupirocina se recorrente (discutir).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico.</li>
      <li>Cultura se MRSA, falha terapêutica ou surto institucional.</li>
      <li>Urina 1/EAS se suspeita de GNPE.</li>
    </ul>
    <p class="emerg-note">IDSA pele e partes moles. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'insolacao': `
    <p class="muted">Exposição solar excessiva — eritema, dor, eventual bolhas (queimadura 1º–2º grau). Diferenciar de insolação/heat stroke (hipertermia &gt; 40 °C com disfunção SNC) — emergência distinta.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Classificar gravidade</strong> — queimadura solar leve vs. insolação/heat exhaustion (confusão, temperatura &gt; 40 °C = heat stroke — resfriamento agressivo e UTI).</li>
      <li><strong>Medidas gerais</strong> — sombra, roupas leves, compressas frias; hidratação oral (SRO) se consciente.</li>
      <li><strong>Analgesia</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona ou paracetamol.</li>
          <li><strong>Alternativa (após 24 h, sem desidratação):</strong> ibuprofeno 400 mg VO 8/8 h.</li>
        </ul>
      </li>
      <li><strong>Bolhas extensas ou desidratação</strong> — SF 0,9% EV conforme débito urinário; considerar internação.</li>
      <li><strong>Tópico</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dexpantenol creme.</li>
          <li><strong>Alternativa:</strong> aloe vera gel. <strong>Não</strong> romper bolhas; evitar anestésicos tópicos em área extensa.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Hidratação abundante por 48 h; protetor solar FPS ≥ 30 nas próximas exposições.</li>
      <li>Retorno se febre, bolhas extensas, sinais de infecção ou alteração neurológica.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico.</li>
      <li>Eletrólitos e função renal se desidratação ou heat exhaustion.</li>
      <li>Monitorar temperatura central se suspeita de heat stroke.</li>
    </ul>
    <p class="emerg-note">MS atenção a calor · ACEP hipertermia. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'intoxicacoes-exogenas': `
    <p class="muted">Abordagem sindrômica da intoxicação — toxíndrome (anticolinérgica, colinérgica, sedativa, simpatomimética, opioide) orienta antídoto. Sempre: ABC, glicemia, ECG.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Estabilização</strong> — via aérea (intubar se rebaixamento/GCS ≤ 8); O₂; acesso venoso; glicemia capilar; ECG 12 derivações.</li>
      <li><strong>Descontaminação</strong> — carvão ativado 50 g VO/SNG se ingestão recente (&lt; 1–2 h) e via aérea protegida; <strong>não</strong> em corrosivos ou hidrocarbonetos.</li>
      <li><strong>Antídotos por toxíndrome</strong> —
        <ul class="ps-med-options">
          <li><strong>Opioide:</strong> naloxona 0,4–2 mg EV/IM (titular).</li>
          <li><strong>Paracetamol:</strong> N-acetilcisteína EV/VO (nomograma).</li>
          <li><strong>Benzodiazepínico:</strong> flumazenil 0,2 mg EV (cautela — convulsão).</li>
          <li><strong>Organofosforado:</strong> atropina EV + pralidoxima EV (CEATOX).</li>
          <li><strong>Salicilato/etilenoglicol/metanol:</strong> bicarbonato (salicilato); fomepizol ou etanol (tóxicos alcoóis) — discutir com toxicologia/diálise.</li>
        </ul>
      </li>
      <li><strong>Observação</strong> — drogas de liberação prolongada (metoprolol, sulfonilureia, opioides) exigem monitor prolongado.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Somente intoxicações leves, estáveis, com observação adequada e suporte psiquiátrico se tentativa autolesiva.</li>
      <li>Encaminhar CEATOX/centro de informação toxicológica (0800-722-6001) em dúvidas.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Glicemia, eletrólitos, gasometria, função hepática e renal.</li>
      <li>Nível sérico de droga quando disponível (paracetamol, carboxihemoglobina, metemoglobina).</li>
      <li>TC crânio se trauma associado ou rebaixamento sem causa clara.</li>
    </ul>
    <p class="emerg-note">CEATOX-SP / MS intoxicações. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'pielonefrite': `
    <p class="muted">ITU alta — infecção do parênquima renal. Febre, dor lombar, náuseas; diferenciar de cistite (lote 2). Risco de sepse em gestantes, idosos e diabéticos.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Estabilização</strong> — hemoculturas antes do ATB se possível; hidratação EV se sepse ou vômitos.</li>
      <li><strong>ATB empírico (adulto, comunidade)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> levofloxacino 750 mg VO/EV 24/24 h por 7–10 dias.</li>
          <li><strong>Alternativa:</strong> ceftriaxona 1 g EV 24/24 h + amoxicilina-clavulanato 875/125 mg VO 12/12 h após melhora.</li>
          <li><strong>Alérgico (anafilaxia a β-lactâmico):</strong> ciprofloxacino 500 mg VO 12/12 h por 7 dias (se resistência local baixa).</li>
          <li><strong>Gestante:</strong> ceftriaxona 1 g EV 24/24 h até melhora; evitar fluoroquinolonas.</li>
          <li><strong>Grave/sepse:</strong> ceftriaxona 1 g EV 24/24 h; internar; ajustar por urocultura.</li>
        </ul>
      </li>
      <li><strong>Internar</strong> — sepse, vômitos incoercíveis, gestação, comorbidades graves, falha de ATB oral em 48 h ou abscesso renal.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Completar 7–10 dias de ATB; hidratação oral abundante.</li>
      <li>Retorno em 48–72 h; urocultura de controle após tratamento se recorrente.</li>
      <li>Investigar fatores anatômicos (cálculo, refluxo) se ITU de repetição.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Urina 1/EAS e urocultura com antibiograma.</li>
      <li>Hemograma, PCR, creatinina; hemoculturas se febre alta ou sepse.</li>
      <li>USG rins e vias se febre &gt; 72 h de ATB, suspeita de obstrução ou abscesso.</li>
    </ul>
    <p class="emerg-note">IDSA/MS ITU 2023. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'leptospirose': `
    <p class="muted">Zoonose por <em>Leptospira</em> — exposição a água/urina de roedores. Fase aguda: febre, mialgia (especialmente panturrilha), cefaleia. Forma grave: Weil (icterícia, IRA, hemorragia).</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Forma leve/anictérica</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> doxiciclina 100 mg VO 12/12 h por 7 dias (adulto).</li>
          <li><strong>Alternativa:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h por 7 dias.</li>
          <li><strong>Gestante:</strong> amoxicilina 500 mg VO 8/8 h por 7 dias (evitar doxiciclina).</li>
        </ul>
      </li>
      <li><strong>Forma grave (Weil, IRA, hemorragia, SDRA)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> penicilina G cristalina 1,5 MIU EV 6/6 h por 7 dias.</li>
          <li><strong>Alternativa:</strong> ceftriaxona 1 g EV 24/24 h por 7 dias.</li>
          <li><strong>Grave:</strong> internar em UTI; hidratação cuidadosa (risco SDRA); diálise se IRA.</li>
        </ul>
      </li>
      <li><strong>Notificação compulsória</strong> — registrar caso suspeito/confirmado.</li>
      <li><strong>Profilaxia pós-exposição</strong> — doxiciclina 200 mg VO 1×/semana em exposição de alto risco (enchentes, trabalho de esgoto).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Forma leve — completar ATB; repouso; retorno se icterícia, oligúria ou sangramento.</li>
      <li>Orientar controle de roedores e uso de EPI em atividades de risco.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Sorologia (MAT, ELISA IgM) — par de amostras (aguda e convalescente).</li>
      <li>Hemograma (leucocitose com neutrofilia), PCR, ureia/creatinina, bilirrubinas, TGO/TGP.</li>
      <li>Radiografia de tórax se dispneia.</li>
    </ul>
    <p class="emerg-note">MS leptospirose / OPAS. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'micoses-superficiais': `
    <p class="muted">Dermatofitoses (tinea corporis, crural, pedis) e pitiríase versicolor — lesões circinadas, descamativas ou hipocrômicas. Onicomicose requer tratamento prolongado.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Tinea corporis/crural (lesão limitada)</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> clotrimazol 1% creme 2×/dia por 2–4 semanas.</li>
          <li><strong>Alternativa:</strong> terbinafina 1% creme 2×/dia por 2–4 semanas.</li>
        </ul>
      </li>
      <li><strong>Pitiríase versicolor</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cetoconazol shampoo 2% aplicado 5–10 min 1×/dia por 7 dias.</li>
          <li><strong>Alternativa:</strong> fluconazol 300 mg VO dose única semanal × 2.</li>
        </ul>
      </li>
      <li><strong>Extensa ou refratária</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> itraconazol 100 mg VO 2×/dia por 1 semana (pulso).</li>
          <li><strong>Alternativa:</strong> terbinafina 250 mg VO 1×/dia por 2–4 semanas.</li>
        </ul>
      </li>
      <li><strong>Onicomicose</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> terbinafina 250 mg VO 1×/dia por 12 semanas (unha).</li>
          <li><strong>Alternativa:</strong> itraconazol 200 mg VO 12/12 h por 7 dias/mês (3 meses); confirmação micológica preferível.</li>
        </ul>
      </li>
      <li><strong>Candidíase intertriginosa</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> nistatina creme 2–3×/dia.</li>
          <li><strong>Alternativa:</strong> clotrimazol tópico 2–3×/dia.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Manter tratamento tópico 1–2 semanas após resolução clínica.</li>
      <li>Higiene: roupas secas, evitar oclusão; tratar tinea pedis concomitante para prevenir recorrência crural.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Exame micológico direto (KOH) ou cultura se diagnóstico incerto.</li>
      <li>Lâmpada de Wood auxilia em pitiríase versicolor (fluorescência amarelo-dourada).</li>
    </ul>
    <p class="emerg-note">SBDT dermatofitoses. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'mononucleose': `
    <p class="muted">Mononucleose infecciosa por EBV — febre, faringite, linfadenopatia, fadiga. Rash após amoxicilina é clássico. Complicações: esplenomegalia (risco ruptura), hepatitis.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Tratamento de suporte</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona ou paracetamol; hidratação, repouso.</li>
          <li><strong>Evitar:</strong> AINE se plaquetopenia.</li>
        </ul>
      </li>
      <li><strong><em>Não</em> prescrever amoxicilina/ampicilina</strong> — rash maculopapular em &gt; 90% dos casos (não é alergia verdadeira).</li>
      <li><strong>Faringite bacteriana concomitante</strong> (Streptococcus confirmado) —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> azitromicina 500 mg VO 1×/dia por 5 dias.</li>
          <li><strong>Alternativa:</strong> claritromicina 500 mg VO 12/12 h por 5 dias.</li>
        </ul>
      </li>
      <li><strong>Complicações</strong> —
        <ul class="ps-med-options">
          <li><strong>Estridor/obstrução de via aérea:</strong> prednisona 1 mg/kg VO.</li>
          <li><strong>Grave:</strong> ruptura esplênica — cirurgia urgente; hepatitis grave — internar.</li>
        </ul>
      </li>
      <li><strong>Esplenomegalia</strong> — evitar esportes de contato por 3–4 semanas.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Resolução em 2–4 semanas; fadiga pode persistir meses.</li>
      <li>Retorno se dor abdominal intensa (ruptura esplênica), icterícia ou dispneia.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma — linfocitose com linfócitos atípicos.</li>
      <li>Teste Monospot ou sorologia EBV (IgM VCA) se diagnóstico incerto.</li>
      <li>TGO/TGP se icterícia; USG abdome se esplenomegalia sintomática.</li>
    </ul>
    <p class="emerg-note">IDSA mononucleose. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'otite-externa': `
    <p class="muted">Infecção do conduto auditivo externo — otalgia intensa, tragalgesia, edema do CAE. Predisponentes: natação, trauma local, umidade.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Forma não complicada</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ciprofloxacino 0,3% + dexametasona 0,1% gotas otológicas (Otociriax®, Otocin® ou genérico) 3–4 gotas 12/12 h por 7–10 dias.</li>
          <li><strong>Alternativa:</strong> ciprofloxacino 0,3% gotas 4 gotas 8/8 h por 7–10 dias.</li>
          <li><strong>Alérgico/contraindicação a fluoroquinolona tópica:</strong> neomicina-polimixina-hidrocortisona gotas (cautela se perfuração timpânica).</li>
        </ul>
      </li>
      <li><strong>Edema intenso do CAE</strong> — inserir mecha com corticoide tópico; analgesia (dipirona + tramadol se necessário).</li>
      <li><strong>Celulite periauricular ou imunossupressão</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ciprofloxacino 500 mg VO 12/12 h por 7–10 dias.</li>
          <li><strong>Alternativa:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12 h por 7–10 dias.</li>
          <li><strong>Alérgico (anafilaxia a penicilina):</strong> ciprofloxacino 500 mg VO 12/12 h.</li>
        </ul>
      </li>
      <li><strong>Otite externa maligna (diabético, idoso)</strong> —
        <ul class="ps-med-options">
          <li><strong>Grave:</strong> ciprofloxacino EV + avaliação ORL; internar.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Manter ouvido seco; evitar natação durante tratamento.</li>
      <li>Retorno em 48–72 h se piora ou febre.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Otoscopia — excluir perfuração timpânica antes de gotas com aminoglicosídeo.</li>
      <li>Cultura de secreção se refratária ou diabético.</li>
      <li>TC osso temporal se otite externa maligna suspeita.</li>
    </ul>
    <p class="emerg-note">AAO-HNS otite externa. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'otite-media': `
    <p class="muted">Otite média aguda — infecção do ouvido médio, comum em crianças; em adultos considerar etiologia viral ou obstrução tubária. Otalgia, febre, abaulamento timpânico.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Analgesia</strong> — dipirona ou ibuprofeno; essencial em todos os casos.</li>
      <li><strong>ATB indicado</strong> — &lt; 6 meses; bilateral; otorreia; febre ≥ 39 °C; otalgia ≥ 48 h; imunossupressão; falha observação 48–72 h.</li>
      <li><strong>Esquema antibiótico</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> amoxicilina 50 mg/kg/dia VO dividido 8/8 h (máx. 3 g/dia) por 5–7 dias; adulto: 500 mg VO 8/8 h.</li>
          <li><strong>Alternativa (falha em 48–72 h ou ATB recente):</strong> amoxicilina-clavulanato 45 mg/kg/dia (base amox) 12/12 h por 7 dias; adulto: 875/125 mg VO 12/12 h.</li>
          <li><strong>Alérgico (não anafilaxia):</strong> cefuroxima 30 mg/kg/dia VO 12/12 h.</li>
          <li><strong>Alérgico (anafilaxia a penicilina):</strong> azitromicina 10 mg/kg VO 24/24 h por 5 dias (adulto: 500 mg 24/24 h).</li>
          <li><strong>Grave/complicações (mastoidite, abscesso):</strong> ceftriaxona EV + ORL; internar.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Observação 48–72 h sem ATB em OMA leve &gt; 2 anos (watchful waiting) — analgesia adequada.</li>
      <li>Retorno se febre persistente, otorreia ou piora da otalgia.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Otoscopia — abaulamento, opacidade, mobilidade reduzida do MT.</li>
      <li>Audiometria se recorrência ou suspeita de efusão persistente.</li>
    </ul>
    <p class="emerg-note">AAP/MS otite média aguda. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'parasitoses-intestinais': `
    <p class="muted">Helmintíases e protozooses intestinais — giardíase, amebíase, oxiurose, ancilostomíase. Diagnóstico por clínica e exame de fezes; tratar conforme agente.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Giardíase</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> metronidazol 250 mg VO 8/8 h por 5 dias (adulto).</li>
          <li><strong>Alternativa:</strong> tinidazol 2 g VO dose única.</li>
          <li><strong>Pediatria:</strong> metronidazol 15 mg/kg/dia 8/8 h por 5 dias.</li>
        </ul>
      </li>
      <li><strong>Amebíase intestinal</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha (tecido):</strong> metronidazol 750 mg VO 8/8 h por 7–10 dias.</li>
          <li><strong>Alternativa (forma luminal/cistos):</strong> paromomicina 25–30 mg/kg/dia VO 8/8 h por 7 dias ou iodoquinol 650 mg VO 8/8 h por 20 dias.</li>
        </ul>
      </li>
      <li><strong>Oxiurose</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> albendazol 400 mg VO dose única; repetir em 14 dias.</li>
        </ul>
      </li>
      <li><strong>Ascaridíase / ancilostomíase</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> albendazol 400 mg VO dose única.</li>
          <li><strong>Alternativa:</strong> mebendazol 100 mg VO 12/12 h por 3 dias.</li>
        </ul>
      </li>
      <li><strong>Desidratação ou disenteria grave</strong> — hidratação EV; internar se toxemia, sangramento abundante ou abscesso hepático (amebíase).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Higiene: lavar mãos, tratar simultaneamente contactantes em parasitoses contagiosas.</li>
      <li>Repetir exame de fezes 2–4 semanas após tratamento se sintomas persistem.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Parasitológico de fezes (3 amostras) ou teste antígeno (Giardia, Entamoeba).</li>
      <li>Hemograma (eosinofilia em helmintos); USG abdome se suspeita de abscesso hepático amebiano.</li>
    </ul>
    <p class="emerg-note">MS parasitoses / OPAS. Conteúdo educacional — não substitui julgamento clínico.</p>
  `,

  'pediculose': `
    <p class="muted">Infestação por <em>Pediculus humanus capitis</em> (piolho de cabeça) — prurido occipital, lêndeas aderidas aos fios. Diferenciar de caspa e dermatite seborreica.</p>
    <h4>Pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Tratamento tópico</strong> —
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> permetrina loção 1% (Piolix®) aplicar couro cabeludo seco, aguardar 10 min, enxaguar; repetir em 7–10 dias.</li>
          <li><strong>Alternativa:</strong> ivermectina loção 0,5% tópica dose única (≥ 6 meses) ou dimeticona 4% (mecanismo físico — sem resistência).</li>
          <li><strong>Resistência ou falha:</strong> ivermectina 200 mcg/kg VO dose única (repetir em 7–10 dias) — ≥ 15 kg.</li>
        </ul>
      </li>
      <li><strong>Remoção mecânica</strong> — pente fino úmido diário por 2 semanas; essencial em complemento ao tópico.</li>
      <li><strong>Tratar contactantes</strong> — exame e tratamento simultâneo de familiares; lavar roupas de cama e bonés em água quente (&gt; 60 °C).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno em 7–10 dias para reavaliação e segunda aplicação se necessário.</li>
      <li>Não suspender criança da escola se tratamento iniciado (orientação MS).</li>
      <li>Evitar lindano (tóxico) e produtos inflamáveis próximos a chama.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico — visualização de lêndeas vivas ou piolhos.</li>
      <li>Diferenciar lêndea viva (opaca, próxima ao couro) de vazia (branca, distante).</li>
    </ul>
    <p class="emerg-note">MS pediculose / AAP. Conteúdo educacional — não substitui julgamento clínico.</p>
  `
};
