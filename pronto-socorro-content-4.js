/* Pronto Socorro — conteúdo clínico (lote 4) */
const PS_CONTENT_4 = {
  'pneumonia-comunitaria': `
    <p class="muted">Infecção aguda do parênquima pulmonar adquirida fora do hospital. Estratificar gravidade com <strong>CURB-65</strong> (confusão, ureia &gt; 50 mg/dl, FR ≥ 30, PAS &lt; 90 ou PAD ≤ 60, idade ≥ 65) e definir ambiente de tratamento.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — SpO₂, FR, PA; O₂ suplementar se SpO₂ &lt; 92% (alvo 94–98%).</li>
      <li><strong>CURB-65</strong> — 0–1: ambulatorial; 2: considerar internação; ≥ 3: internação/UCI.</li>
      <li><strong>Exames</strong> — Rx tórax, hemograma, ureia/creatinina, eletrólitos; hemocultura e cultura de escarro se grave.</li>
      <li><strong>Ambulatorial (CURB 0–1, sem comorbidades graves)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> amoxicilina + clavulanato 875/125 mg VO 12/12h · 5–7 dias (Clavulin®, Sinot Clav®).</li>
          <li><strong>Alternativa:</strong> levofloxacino 750 mg VO 24/24h · 5 dias (adulto sem comorbidades) <em>ou</em> azitromicina 500 mg VO 24/24h · 3 dias + amoxicilina 1 g VO 8/8h · 7 dias.</li>
          <li><strong>Alérgico:</strong> levofloxacino 750 mg VO 24/24h · 5 dias <em>ou</em> moxifloxacino 400 mg VO 24/24h · 5 dias (alergia grave à penicilina).</li>
          <li><strong>Refractário:</strong> reavaliar cobertura de <em>atípicos</em> e aderência; considerar amoxicilina-clavulanato EV ou internação com ceftriaxona + macrolídeo.</li>
        </ul>
      </li>
      <li><strong>Internação (enfermaria)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 1 g EV 24/24h + azitromicina 500 mg EV/VO 24/24h (cobertura de <em>atípicos</em>).</li>
          <li><strong>Alternativa:</strong> ceftriaxona 1 g EV 24/24h + claritromicina 500 mg EV/VO 12/12h.</li>
          <li><strong>Alérgico:</strong> levofloxacino 750 mg EV/VO 24/24h monoterapia <em>ou</em> aztreonam 2 g EV 8/8h + levofloxacino (alergia grave a β-lactâmico).</li>
          <li><strong>Refractário:</strong> piperacilina-tazobactam 4,5 g EV 6/6h + levofloxacino 750 mg EV 24/24h; considerar vancomicina se MRSA de risco.</li>
        </ul>
      </li>
      <li><strong>Grave/UCI</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 1 g EV 12/12h + azitromicina 500 mg EV 24/24h.</li>
          <li><strong>Alternativa:</strong> piperacilina-tazobactam 4,5 g EV 6/6h + levofloxacino 750 mg EV 24/24h (risco de Pseudomonas).</li>
          <li><strong>Alérgico:</strong> aztreonam 2 g EV 8/8h + levofloxacino 750 mg EV 24/24h + vancomicina se MRSA.</li>
          <li><strong>Refractário:</strong> meropenem 1 g EV 8/8h + levofloxacino; vancomicina 15 mg/kg EV 12/12h se MRSA ou falha terapêutica.</li>
        </ul>
      </li>
      <li><strong>Suporte</strong> — hidratação, antitérmico (dipirona/paracetamol), fisioterapia respiratória se necessário.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Reavaliação em 48–72 h se sem melhora clínica ou piora de dispneia/febre.</li>
      <li>Vacinação pneumocócica e influenza após recuperação.</li>
      <li>Evitar tabagismo; orientar sinais de alarme (dispneia, confusão, hipotensão).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Rx tórax PA (e perfil se dúvida); repetir se não melhora em 48–72 h.</li>
      <li>Procalcitonina opcional para guiar duração de ATB em casos selecionados.</li>
      <li>Investigar comorbidades: DPOC, ICC, DM, imunossupressão.</li>
    </ul>
    <p class="emerg-note">Referência: SBPT/MS — pneumonia adquirida na comunidade. CURB-65 disponível em Calculadoras essenciais. Conduta não substitui julgamento clínico individualizado.</p>`,

  'trauma-atls': `
    <p class="muted">Abordagem sistemática do trauma politraumatizado conforme <strong>ATLS</strong> — tratar ameaças à vida na ordem de prioridade antes de investigações definitivas.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>A — Via aérea + coluna cervical</strong> — proteção cervical; aspirar secreções; intubação se GCS ≤ 8, obstrução ou insuficiência respiratória.</li>
      <li><strong>B — Respiração</strong> — inspecionar tórax (equimoses, MV abolido, crepitação); O₂ 15 L/min; drenagem de pneumotórax hipertensivo imediata (2º EIC linha hemiclavicular).</li>
      <li><strong>C — Circulação</strong> — controlar hemorragia externa (compressão/torniquete); 2 acessos calibrosos; protocolo de transfusão maciça se choque hemorrágico.
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> SF 0,9% 1–2 L EV bolus se hipotensão/taquicardia; reavaliar volemia.</li>
          <li><strong>Alternativa:</strong> Ringer lactato 1–2 L EV bolus (equivalente ao SF).</li>
          <li><strong>Alérgico:</strong> SF 0,9% (sem alternativa rotineira em emergência); plasma fresco se coagulopatia.</li>
          <li><strong>Refractário:</strong> protocolo de transfusão maciça (PFC : CH : plaquetas 1:1:1); ácido tranexâmico 1 g EV nas primeiras 3 h se trauma grave.</li>
        </ul>
      </li>
      <li><strong>D — Disfunção neurológica</strong> — GCS, pupilas; glicemia capilar.
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 1 g EV/IM para analgesia.</li>
          <li><strong>Alternativa:</strong> tramadol 50–100 mg EV/IM se dor moderada.</li>
          <li><strong>Alérgico:</strong> paracetamol 1 g EV/VO.</li>
          <li><strong>Refractário:</strong> cetamina 0,5–1 mg/kg EV (analgesia em choque hemodinâmico) ou morfina 2–5 mg EV titulada.</li>
        </ul>
      </li>
      <li><strong>E — Exposição</strong> — desvestir, prevenir hipotermia (cobertores, fluidos aquecidos); buscar lesões ocultas.</li>
      <li><strong>Imagem</strong> — FAST à beira-leito se instável; TC corpo inteiro se estável e mecanismo de alto impacto.</li>
      <li><strong>Encaminhamento</strong> — centro de trauma se ISS elevado, choque refratário, TCE grave, fraturas instáveis.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Trauma leve isolado (contusão, laceração superficial) — curativo, analgesia, sinais de alarme.</li>
      <li>Retorno se vômitos persistentes, cefaleia progressiva, dor abdominal crescente.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma, tipagem, coagulograma, lactato, gasometria se grave.</li>
      <li>Rx tórax, pelve e coluna conforme mecanismo; TC se indicado.</li>
      <li>Monitorização contínua nas primeiras horas (rebaixamento tardio em TCE).</li>
    </ul>
    <p class="emerg-note">Referência: ATLS 11ª ed. · MS — linha de cuidado trauma. Ver protocolos detalhados no Guia de emergência → Trauma.</p>`,

  'queilite': `
    <p class="muted">Inflamação dos lábios por ressecamento, exposição solar, alergia de contato, infecção (Candida, herpes) ou deficiência nutricional. Tratar causa e barreira cutânea.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Higiene</strong> — evitar lambedura; hidratação oral adequada; protetor labial sem fragrância.</li>
      <li><strong>Barreira</strong> — vaselina, lanolina ou pomada de óxido de zinco 2–3×/dia.</li>
      <li><strong>Inflamação intensa</strong> (evitar uso prolongado de corticoide tópico)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> hidrocortisona 1% tópica fina camada 12/12h · 5–7 dias.</li>
          <li><strong>Alternativa:</strong> desonida 0,5 mg/g tópica 12/12h · 5 dias.</li>
          <li><strong>Alérgico:</strong> barreira (vaselina/lanolina) + anti-H1 oral (loratadina 10 mg 24/24h).</li>
          <li><strong>Refractário:</strong> encaminhar dermatologia; investigar alergia de contato.</li>
        </ul>
      </li>
      <li><strong>Suspeita de Candida</strong> (maceração, placas brancas)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> nistatina creme tópico 2×/dia · 7–14 dias.</li>
          <li><strong>Alternativa:</strong> miconazol creme 2% tópico 2×/dia · 7–14 dias.</li>
          <li><strong>Alérgico:</strong> nistatina creme (baixo risco de reação sistêmica).</li>
          <li><strong>Refractário:</strong> fluconazol 150 mg VO dose única (se extensa/recorrente) — avaliar imunossupressão.</li>
        </ul>
      </li>
      <li><strong>Herpes labial</strong> (início &lt; 48 h)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> aciclovir 400 mg VO 8/8h · 5 dias.</li>
          <li><strong>Alternativa:</strong> valaciclovir 500 mg VO 12/12h · 3 dias.</li>
          <li><strong>Alérgico:</strong> aciclovir tópico 5×/dia (eficácia menor) + suporte.</li>
          <li><strong>Refractário:</strong> aciclovir 400 mg VO 5×/dia · 5 dias ou valaciclovir 1 g VO 12/12h · 2 dias.</li>
        </ul>
      </li>
      <li><strong>Analgesia</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 500 mg–1 g VO/EV 6/6h se necessário.</li>
          <li><strong>Alternativa:</strong> paracetamol 750 mg–1 g VO 6/6h (máx. 3 g/dia).</li>
          <li><strong>Alérgico:</strong> paracetamol VO.</li>
          <li><strong>Refractário:</strong> ibuprofeno 400 mg VO 8/8h (se sem contraindicação) + barreira tópica.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Fotoproteção (FPS ≥ 30); evitar cosméticos irritantes.</li>
      <li>Suplementar ferro/B12/folato se queilite angular recorrente.</li>
      <li>Retorno se fissuras profundas, ulceração ou sem melhora em 7–10 dias.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Clínica na maioria; investigar anemia/avitaminose se angular crônica.</li>
      <li>Descartar dermatite de contato (patch test ambulatorial se recorrente).</li>
    </ul>
    <p class="emerg-note">Referência: MS — atenção básica dermatologia. Uso prolongado de corticoide tópico nos lábios pode atrofiar mucosa.</p>`,

  'queimaduras': `
    <p class="muted">Lesão térmica, química ou elétrica da pele e tecidos profundos. Classificar profundidade (1º–3º grau) e <strong>superfície corporal queimada (SCQ)</strong> para definir destino.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Segurança</strong> — cessar agente causador; remover roupas/jóias; irrigar abundante se química (20 min água corrente).</li>
      <li><strong>ABC</strong> — via aérea se queimadura face/pescoço/inalação (fuligem nasal, rouquidão) — intubação precoce.</li>
      <li><strong>Resfriamento</strong> — água corrente 15–20 °C por 20 min (não gelo); não estourar bolhas.</li>
      <li><strong>Analgesia</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 1 g EV/VO 6/6h.</li>
          <li><strong>Alternativa:</strong> paracetamol 1 g EV/VO 6/6h.</li>
          <li><strong>Alérgico:</strong> paracetamol EV/VO.</li>
          <li><strong>Refractário:</strong> morfina 2–5 mg EV titulada ou tramadol 50–100 mg EV 6/6h.</li>
        </ul>
      </li>
      <li><strong>Curativo</strong> — gazes estéreis úmidas.
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> sulfadiazina de prata 1% tópica 12/12h (exceto face/genitais).</li>
          <li><strong>Alternativa:</strong> nitrato de prata 0,5% tópico 24/24h.</li>
          <li><strong>Alérgico:</strong> curativo úmido com SF 0,9% + vaselina estéril (sem sulfadiazina).</li>
          <li><strong>Refractário:</strong> sulfadiazina de prata + analgesia EV; encaminhar centro de queimados.</li>
        </ul>
      </li>
      <li><strong>Hidratação</strong> — acesso venoso se SCQ ≥ 10% (adulto) ou ≥ 5% (criança); SF conforme Parkland (4 ml × kg × %SCQ nas 24 h, metade nas 8 h).</li>
      <li><strong>Tétano</strong> — vacina + soro antitetânico se esquema incompleto.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Queimaduras &lt; 10% SCQ, superficiais, sem face/mãos/genitais/articulações.</li>
      <li>Curativo diário; analgesia; retorno em 48 h.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Encaminhar centro de queimados: SCQ &gt; 10%, 2º–3º grau profundas, face, mãos, pés, genitais, circunferenciais, elétrica, química, criança/idoso.</li>
      <li>Eletrólitos, hemograma, função renal se internação; carboxihemoglobina se inalação.</li>
    </ul>
    <p class="emerg-note">Referência: ABQ/SBCT — manejo de queimaduras. Regra dos 9 (Wallace) para SCQ. Não usar pomadas oleosas nem aloe em queimaduras profundas.</p>`,

  'rinite-alergica': `
    <p class="muted">Inflamação nasal mediada por IgE com prurido, espirros em salva, rinorreia aquosa e obstrução. Diferenciar de resfriado e sinusite bacteriana.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Medidas ambientais</strong> — evitar alérgenos (pólen, ácaros, fumaça); lavagem nasal com SF 0,9%.</li>
      <li><strong>Anti-H1 de 2ª geração</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> loratadina 10 mg VO 24/24h (Claritin®).</li>
          <li><strong>Alternativa:</strong> desloratadina 5 mg VO 24/24h (Desalex®) <em>ou</em> cetirizina 10 mg VO 24/24h.</li>
          <li><strong>Alérgico:</strong> fexofenadina 180 mg VO 24/24h (menor sedação).</li>
          <li><strong>Refractário:</strong> associar corticoide intranasal; encaminhar alergologia.</li>
        </ul>
      </li>
      <li><strong>Corticoide intranasal</strong> (efeito pleno em 3–7 dias; 1ª linha se moderado/grave)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> budesonida nasal 2 jatos/narina 12/12h (Busonid®).</li>
          <li><strong>Alternativa:</strong> mometasona nasal 2 jatos/narina 24/24h (Nasonex®).</li>
          <li><strong>Alérgico:</strong> budesonida nasal (baixa absorção sistêmica); lavagem nasal com SF 0,9%.</li>
          <li><strong>Refractário:</strong> fluticasona nasal 2 jatos/narina 12/12h + anti-H1; considerar imunoterapia.</li>
        </ul>
      </li>
      <li><strong>Crise intensa</strong> (obstrução severa)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> budesonida nasal + loratadina 10 mg VO 24/24h.</li>
          <li><strong>Alternativa:</strong> mometasona nasal + desloratadina 5 mg VO 24/24h.</li>
          <li><strong>Alérgico:</strong> oximetazolina nasal ≤ 3 dias (risco de rebote) + lavagem nasal SF.</li>
          <li><strong>Refractário:</strong> prednisona 40 mg VO 24/24h · 5 dias (curto prazo) + corticoide intranasal.</li>
        </ul>
      </li>
      <li><strong>Conjuntivite associada</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> olopatadina 0,1% colírio 1 gota 12/12h.</li>
          <li><strong>Alternativa:</strong> ketotifeno 0,025% colírio 1 gota 12/12h.</li>
          <li><strong>Alérgico:</strong> lágrimas artificiais + compressas frias.</li>
          <li><strong>Refractário:</strong> olopatadina + loratadina VO; oftalmologia se sem melhora.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Manter corticoide nasal regularmente na temporada alérgica.</li>
      <li>Imunoterapia (alérgeno-específica) se falha ao tratamento farmacológico — encaminhar alergologia.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico na maioria.</li>
      <li>Teste cutâneo ou IgE específica se dúvida diagnóstica ou candidato à imunoterapia.</li>
    </ul>
    <p class="emerg-note">Referência: ARIA 2024 · SBIA. Corticoide intranasal é mais eficaz que anti-H1 isolado em rinite persistente moderada-grave.</p>`,

  'sangramento-uterino': `
    <p class="muted">Sangramento anormal do trato genital fora do ciclo esperado ou com volume/duração excessivos. Estabilizar hemodinamicamente e classificar (PALM-COEIN).</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — PA, FC, Hb; acesso venoso se instável; tipagem e reserva se sangramento intenso.</li>
      <li><strong>Gestação</strong> — β-hCG em toda mulher em idade fértil com sangramento — descartar aborto/ectópica.</li>
      <li><strong>Hemodinamicamente estável</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ácido tranexâmico 1 g VO 8/8h · 5 dias (se não contraindicado).</li>
          <li><strong>Alternativa:</strong> ácido tranexâmico 1 g EV 8/8h se VO impossível.</li>
          <li><strong>Alérgico:</strong> controle hormonal agudo (sem antifibrinolítico).</li>
          <li><strong>Refractário:</strong> associar controle hormonal; ginecologia para SIU-LNG ou procedimento.</li>
        </ul>
      </li>
      <li><strong>Controle hormonal agudo</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> noretisterona 5 mg VO 8/8h até cessar sangramento → desmame gradual.</li>
          <li><strong>Alternativa:</strong> medroxiprogesterona 10 mg VO 12/12h até cessar → desmame.</li>
          <li><strong>Alérgico:</strong> ACO combinado monofásico 2 comprimidos VO 12/12h · 5–7 dias (se sem contraindicação).</li>
          <li><strong>Refractário:</strong> ACO combinado contínuo ou SIU levonorgestrel; curetagem se instável.</li>
        </ul>
      </li>
      <li><strong>Anemia sintomática</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> transfusão de CH conforme Hb e clínica (geralmente Hb &lt; 7 g/dL ou sintomática).</li>
          <li><strong>Alternativa:</strong> sulfato ferroso 325 mg VO 8/8h após estabilização.</li>
          <li><strong>Alérgico:</strong> ferro IV (sacarato de hidróxido férrico) se intolerância oral documentada.</li>
          <li><strong>Refractário:</strong> repetir transfusão + investigar causa estrutural (USG, biópsia).</li>
        </ul>
      </li>
      <li><strong>Dor/cólicas</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> dipirona 1 g VO/EV 6/6h.</li>
          <li><strong>Alternativa:</strong> paracetamol 1 g VO 6/6h.</li>
          <li><strong>Alérgico:</strong> paracetamol VO.</li>
          <li><strong>Refractário:</strong> buscopan 20 mg VO 8/8h; evitar AINE se sangramento intenso.</li>
        </ul>
      </li>
      <li><strong>Instabilidade refratária</strong> — curetagem/aspiração uterina ou embolização — ginecologia.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Seguimento ginecológico em 1–2 semanas; investigar causa estrutural (USG transvaginal).</li>
      <li>Anticoncepcional combinado ou SIU levonorgestrel se anovulação crônica.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma, β-hCG, coagulograma se suspeita de coagulopatia.</li>
      <li>USG pélvica; biópsia endometrial se &gt; 45 anos ou fatores de risco para neoplasia.</li>
    </ul>
    <p class="emerg-note">Referência: FEBRASGO/MS — sangramento uterino anormal. PALM-COEIN: pólipo, adenomiose, leiomioma, malignidade, coagulopatia, ovulatório, endometrial, iatrogênico, não classificado.</p>`,

  'sca-iam': `
    <p class="muted">Síndrome coronariana aguda (angina instável, NSTEMI, STEMI). Tratar como isquemia miocárdica até prova em contrário — <strong>ECG em ≤ 10 min</strong>.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Monitor + O₂</strong> — apenas se SpO₂ &lt; 90%; acesso venoso calibroso.</li>
      <li><strong>ECG 12 derivações</strong> em ≤ 10 min; repetir se dor recorrer.</li>
      <li><strong>MONABH</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> AAS 300 mg VO mastigar + enoxaparina 1 mg/kg SC 12/12h + nitrato SL 5 mg (repetir 5 min × 3 se PAS &gt; 90, sem IAM de VD) + metoprolol 25 mg VO (se FC &gt; 60) + morfina 2–4 mg EV se dor refratária + O₂ se SpO₂ &lt; 90%.</li>
          <li><strong>Alternativa:</strong> AAS 300 mg + heparina não fracionada 60 U/kg bolus (máx. 4000 U) + 12 U/kg/h + metoprolol 5 mg EV fracionado.</li>
          <li><strong>Alérgico:</strong> AAS se tolerado; fondaparinux 2,5 mg SC 24/24h se alergia a heparina (consultar cardiologia).</li>
          <li><strong>Refractário:</strong> morfina EV titulada + nitrato EV (se PAS &gt; 90); acionar hemodinâmica imediata se STEMI.</li>
        </ul>
      </li>
      <li><strong>P2Y12 (antiagregante)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> clopidogrel 300 mg VO ataque (600 mg se fibrinólise) + AAS 300 mg.</li>
          <li><strong>Alternativa:</strong> ticagrelor 180 mg VO ataque + AAS 300 mg (preferencial em ICP planejada — SBC).</li>
          <li><strong>Alérgico:</strong> clopidogrel isolado se intolerância a ticagrelor (dispneia); evitar prasugrel se &gt; 75 anos/AVC prévio.</li>
          <li><strong>Refractário:</strong> ticagrelor 90 mg VO 12/12h manutenção ou prasugrel 60 mg ataque (se &lt; 75 anos, sem AVC) — decisão hemodinâmica.</li>
        </ul>
      </li>
      <li><strong>Troponina</strong> seriada (0 h, 3–6 h); eletrólitos e função renal.</li>
      <li><strong>STEMI</strong> — acionar hemodinâmica; meta <strong>porta-balão ≤ 90 min</strong> ou fibrinólise ≤ 30 min se ICP indisponível.</li>
      <li><strong>NSTEMI/AI de alto risco</strong> — estratificar GRACE; <strong>encaminhar cateterismo</strong> &lt; 24 h (muito alto risco) ou &lt; 72 h.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Não aplicável na suspeita aguda — observação mínima até troponina e ECG estáveis.</li>
      <li>Alta apenas em dor atípica com troponina negativa e ECG normal após observação protocolada.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>ECG seriado, troponina ultrassensível, Rx tórax, ecocardiograma se instabilidade.</li>
      <li>Calcular GRACE (Calculadoras → Cardiologia) para NSTEMI/AI.</li>
    </ul>
    <p class="emerg-note">Referência: Diretriz SBC SCA 2025 · MONABH. Ver Guia de emergência → SCA para fluxos STEMI/NSTEMI detalhados. Não atrasar reperfusão por exames complementares.</p>`,

  'sinusite-aguda': `
    <p class="muted">Inflamação dos seios paranasais, geralmente pós-viral. Antibiótico apenas se sintomas persistentes (&gt; 10 dias), piora após melhora inicial ou quadro grave.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Suporte</strong> — lavagem nasal com SF 0,9%; analgesia (dipirona, paracetamol); hidratação.</li>
      <li><strong>Congestão</strong> — budesonida nasal ou oximetazolina ≤ 3 dias.</li>
      <li><strong>Indicação de ATB</strong> (sintomas &gt; 10 dias, piora após melhora ou quadro grave)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> amoxicilina + clavulanato 875/125 mg VO 12/12h · 5–7 dias.</li>
          <li><strong>Alternativa:</strong> amoxicilina 1 g VO 8/8h · 7 dias (se quadro leve sem comorbidades).</li>
          <li><strong>Alérgico:</strong> levofloxacino 500 mg VO 24/24h · 5–7 dias <em>ou</em> doxiciclina 100 mg VO 12/12h · 7 dias.</li>
          <li><strong>Refractário:</strong> amoxicilina-clavulanato 875/125 mg VO 12/12h · 10 dias; TC seios se falha ou complicação.</li>
        </ul>
      </li>
      <li><strong>Complicações</strong> (celulite orbitária, abscesso, meningite)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 2 g EV 12/12h + vancomicina 15 mg/kg EV 12/12h.</li>
          <li><strong>Alternativa:</strong> piperacilina-tazobactam 4,5 g EV 6/6h + vancomicina.</li>
          <li><strong>Alérgico:</strong> levofloxacino 750 mg EV 24/24h + metronidazol 500 mg EV 8/8h + vancomicina.</li>
          <li><strong>Refractário:</strong> meropenem 1 g EV 8/8h + vancomicina; TC seios + órbita; otorrino/oftalmo.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Maioria viral — sem ATB nas primeiras 7–10 dias se quadro leve.</li>
      <li>Retorno se febre &gt; 39 °C, edema periorbitário, alteração visual ou cefaleia intensa.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico (dor facial, secreção purulenta, congestão &gt; 10 dias).</li>
      <li>TC seios se complicação suspeita, imunossuprimido ou falha terapêutica.</li>
    </ul>
    <p class="emerg-note">Referência: MS/IDSA — sinusite aguda bacteriana. Uso indiscriminado de ATB aumenta resistência; critérios clínicos guiam prescrição.</p>`,

  'abstinencia-alcoolica': `
    <p class="muted">Síndrome de abstinência alcoólica (tremor, sudorese, ansiedade, agitação) 6–24 h após última ingestão. Risco de <strong>delirium tremens</strong> e convulsões — prevenir com benzodiazepínico.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — glicemia capilar; eletrólitos (K⁺, Mg²⁺); acesso venoso.</li>
      <li><strong>Tiamina</strong> — 300 mg EV/IM antes de glicose (prevenir Wernicke).</li>
      <li><strong>Benzodiazepínico</strong> (titular por CIWA-Ar)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> diazepam 10 mg VO/EV 6/6h.</li>
          <li><strong>Alternativa:</strong> lorazepam 2 mg EV 4/4h (meia-vida intermediária; preferível em hepatopata).</li>
          <li><strong>Alérgico:</strong> clometiazol 192 mg VO 6/6h (uso hospitalar — risco de depressão respiratória).</li>
          <li><strong>Refractário:</strong> diazepam EV em bolus repetido até sedação leve; internação UTI se CIWA ≥ 15.</li>
        </ul>
      </li>
      <li><strong>Convulsão</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> diazepam 10 mg EV lento.</li>
          <li><strong>Alternativa:</strong> lorazepam 4 mg EV lento.</li>
          <li><strong>Alérgico:</strong> fenitoína 20 mg/kg EV em infusão lenta (após diazepam se disponível).</li>
          <li><strong>Refractário:</strong> fenitoína 20 mg/kg EV + manutenção 100 mg VO/EV 8/8h; levetiracetam 1 g EV se falha.</li>
        </ul>
      </li>
      <li><strong>Delirium tremens</strong> (UTI)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> diazepam EV em bolus + infusão contínua titulada.</li>
          <li><strong>Alternativa:</strong> lorazepam EV 2 mg 4/4h + infusão.</li>
          <li><strong>Alérgico:</strong> fenobarbital EV (ambiente monitorizado — especialista).</li>
          <li><strong>Refractário:</strong> haloperidol 2,5–5 mg EV se agitação psicótica (após sedação com BZD) + suporte intensivo.</li>
        </ul>
      </li>
      <li><strong>Suporte</strong> — SF + tiamina + multivitamínico; corrigir hipomagnesemia.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Abstinência leve (CIWA &lt; 8) — diazepam 10 mg VO 6/6h por 2–3 dias com retorno diário.</li>
      <li>Encaminhar CAPS-AD / grupo de apoio; naltrexona ou acamprosato ambulatorial.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Hemograma, TGO/TGP, GGT, INR, amilase se pancreatite suspeita.</li>
      <li>Internar se CIWA ≥ 15, história de DT, comorbidades graves ou falha ambulatorial.</li>
    </ul>
    <p class="emerg-note">Referência: MS/CAPS-AD — dependência de álcool. Benzodiazepínico é tratamento de escolha; fenitoína não previne convulsão por abstinência.</p>`,

  'sepse-choque-septico': `
    <p class="muted">Resposta desregulada à infecção com disfunção orgânica (Sepsis-3). Choque séptico = necessidade de vasopressor para PAM ≥ 65 + lactato &gt; 2 mmol/L apesar de volume.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Reconhecer</strong> — qSOFA ≥ 2 ou suspeita clínica de infecção + hipotensão/hipoperfusão.</li>
      <li><strong>Bundle hora-1</strong> (iniciar imediatamente):
        <ul>
          <li><strong>Lactato</strong> sérico — dosar na admissão; repetir em 2–4 h se &gt; 2 mmol/L.</li>
          <li><strong>Culturas</strong> — ≥ 2 hemoculturas (e urina/escarro conforme foco) <em>antes</em> do ATB, sem atrasar antibiótico &gt; 45 min.</li>
          <li><strong>Antibiótico de amplo espectro</strong> — iniciar em <strong>≤ 1 h</strong> do reconhecimento:
            <ul class="ps-med-options">
              <li><strong>1ª linha:</strong> foco pulmonar — ceftriaxona 1 g EV 12/12h + azitromicina 500 mg EV 24/24h; foco abdominal — piperacilina-tazobactam 4,5 g EV 6/6h; foco urinário — ceftriaxona 1 g EV 24/24h.</li>
              <li><strong>Alternativa:</strong> foco pulmonar — ampicilina-sulbactam 3 g EV 6/6h + azitromicina; foco abdominal — meropenem 1 g EV 8/8h.</li>
              <li><strong>Alérgico:</strong> aztreonam 2 g EV 8/8h + levofloxacino 750 mg EV 24/24h + vancomicina se MRSA.</li>
              <li><strong>Refractário:</strong> meropenem 1 g EV 8/8h + vancomicina 15 mg/kg EV 12/12h + anfotericina B se fungo suspeito; ajustar conforme culturas.</li>
            </ul>
          </li>
          <li><strong>Cristaloide</strong> — <strong>SF 0,9% 30 ml/kg</strong> IV se hipotensão (PAS &lt; 90) ou lactato ≥ 4 mmol/L; infundir nas primeiras 3 h.</li>
        </ul>
      </li>
      <li><strong>Vasopressor</strong> (PAM &lt; 65 mmHg após/durante fluidos)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> noradrenalina EV em infusão titulada (0,05–3 mcg/kg/min).</li>
          <li><strong>Alternativa:</strong> vasopressina 0,03 U/min EV (adjuvante se choque refratário à noradrenalina).</li>
          <li><strong>Alérgico:</strong> noradrenalina (sem alternativa de 1ª linha em choque séptico).</li>
          <li><strong>Refractário:</strong> noradrenalina + vasopressina + hidrocortisona 50 mg EV 6/6h (choque séptico refratário).</li>
        </ul>
      </li>
      <li><strong>Controle de foco</strong> — drenar abscesso, remover cateter infectado, cirurgia se indicado.</li>
      <li><strong>UTI</strong> — monitorização invasiva; reavaliar lactato (meta clearance ≥ 40% em 6 h).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Não aplicável — sepse/choque exige internação e monitorização.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Lactato seriado, hemoculturas, procalcitonina, hemograma, função renal/hepática.</li>
      <li>Imagem do foco (Rx tórax, USG abdome, TC conforme suspeita).</li>
      <li>Calcular SOFA/qSOFA (Calculadoras essenciais).</li>
    </ul>
    <p class="emerg-note">Referência: Surviving Sepsis Campaign 2021 · Sepsis-3. Ver Guia de emergência → Sepse (bundle hora-1, noradrenalina, lactato). Cada hora de atraso no ATB aumenta mortalidade.</p>`,

  'sindrome-vestibular': `
    <p class="muted">Tontura/vertigem aguda por disfunção periférica (VPPB, neurite vestibular, labirintite) ou central (AVC posterior — sempre descartar). Avaliar HINTS se agudo contínuo.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — glicemia capilar; PA; exame neurológico (HINTS se vertigem aguda contínua).</li>
      <li><strong>Sinais centrais</strong> — diplopia, disartria, ataxia truncal, cefaleia intensa, déficit focal → TC crânio urgente.</li>
      <li><strong>VPPB (canal posterior)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> manobra de Epley no PS (tratamento definitivo).</li>
          <li><strong>Alternativa:</strong> meclizina 25 mg VO 8/8h · 3 dias se náusea pós-manobra.</li>
          <li><strong>Alérgico:</strong> dimenidrinato 50 mg VO 6/6h se náusea.</li>
          <li><strong>Refractário:</strong> repetir Epley; exercícios de Brandt-Daroff; ORL se recorrente.</li>
        </ul>
      </li>
      <li><strong>Neurite vestibular</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> prednisona 60 mg VO 24/24h · 5 dias com desmame + dimenidrinato 50 mg VO 6/6h se náusea.</li>
          <li><strong>Alternativa:</strong> prednisolona 60 mg VO 24/24h · 5 dias + metoclopramida 10 mg EV/VO 8/8h se vômitos.</li>
          <li><strong>Alérgico:</strong> metoclopramida 10 mg EV 8/8h + ondansetrona 4 mg EV 8/8h (sem corticoide se contraindicado).</li>
          <li><strong>Refractário:</strong> reabilitação vestibular precoce; TC crânio se HINTS anormal.</li>
        </ul>
      </li>
      <li><strong>Labirintite aguda</strong> — antiemético + suporte; ATB apenas se mastoidite suspeita.</li>
      <li><strong>Hidratação</strong> — SF EV se vômitos impedem VO.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Evitar dirigir até resolução; exercícios de Brandt-Daroff para VPPB.</li>
      <li>Reabilitação vestibular se sintomas &gt; 2 semanas.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>TC crânio se qualquer sinal central ou HINTS anormal (AVC posterior).</li>
      <li>Audiometria ambulatorial se perda auditiva associada (doença de Ménière).</li>
    </ul>
    <p class="emerg-note">Referência: ABORL-CCF · AAO-HNS. Vertigem aguda contínua + HINTS central = AVC até prova em contrário. Benzodiazepínicos prolongam compensação vestibular.</p>`,

  'soluco-persistente': `
    <p class="muted">Contrações diafragmáticas involuntárias &gt; 48 h. Investigar causas secundárias (eletrólitos, infecção, medicamentos, irritação diafragmática).</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Causas tratáveis</strong> — corrigir hiponatremia, hipocalemia, hipercalcemia; suspender opioides, benzodiazepínicos, corticoides se possível.</li>
      <li><strong>Medidas físicas</strong> — Valsalva, retenção de CO₂ (saco de papel), massagem do seio carotídeo (cautela em idosos/aterosclerose).</li>
      <li><strong>Tratamento farmacológico</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> clorpromazina 25 mg VO 8/8h <em>ou</em> 25 mg IM dose única se VO impossível.</li>
          <li><strong>Alternativa:</strong> metoclopramida 10 mg EV/IM 8/8h <em>ou</em> baclofeno 10 mg VO 8/8h (escalar se necessário).</li>
          <li><strong>Alérgico:</strong> baclofeno 10 mg VO 8/8h (escalar até 20 mg 8/8h).</li>
          <li><strong>Refractário:</strong> gabapentina 300 mg VO 8/8h; bloqueio do nervo frênico ou fármaco intratecal em UTI.</li>
        </ul>
      </li>
      <li><strong>Investigar</strong> — Rx tórax/abdome se suspeita de abscesso subfrênico, pneumonia basal, pancreatite.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Soluço &lt; 48 h e sem causa orgânica — observação, retorno se persistir.</li>
      <li>Evitar álcool e refeições volumosas; tratar DRGE se associado.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Eletrólitos, função renal/hepática, amilase se dor abdominal.</li>
      <li>TC abdome/tórax se &gt; 48 h sem resposta ou sinais de irritação diafragmática.</li>
    </ul>
    <p class="emerg-note">Referência: MS — manejo de soluço persistente. Clorpromazina é gold standard; monitorar hipotensão e sedação.</p>`,

  'tinea': `
    <p class="muted">Dermatofitose superficial (<em>T. pedis, cruris, corporis</em>). Lesões anulares com borda ativa e centro clareando; prurido variável.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Higiene</strong> — manter área seca; trocar meias diariamente; não compartilhar toalhas.</li>
      <li><strong>Tinea pedis/cruris leve</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> clotrimazol 1% creme 12/12h · 2–4 semanas (Canesten®).</li>
          <li><strong>Alternativa:</strong> terbinafina 1% creme 24/24h · 1–2 semanas.</li>
          <li><strong>Alérgico:</strong> terbinafina tópica (menor reação de contato que azóis).</li>
          <li><strong>Refractário:</strong> terbinafina 250 mg VO 24/24h · 2 semanas.</li>
        </ul>
      </li>
      <li><strong>Tinea corporis extensa</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> terbinafina 250 mg VO 24/24h · 2 semanas.</li>
          <li><strong>Alternativa:</strong> itraconazol 100 mg VO 12/12h · 1 semana.</li>
          <li><strong>Alérgico:</strong> terbinafina VO (evitar azóis se interação com estatinas).</li>
          <li><strong>Refractário:</strong> fluconazol 150 mg VO semanal · 4 semanas; cultura se falha.</li>
        </ul>
      </li>
      <li><strong>Onicomicose</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> terbinafina 250 mg VO 24/24h · 6–12 semanas (unha).</li>
          <li><strong>Alternativa:</strong> itraconazol 200 mg VO 24/24h · 12 semanas.</li>
          <li><strong>Alérgico:</strong> ciclopirox esmalte tópico diário · 6 meses (eficácia menor).</li>
          <li><strong>Refractário:</strong> encaminhar dermatologia; confirmar diagnóstico (KOH/cultura).</li>
        </ul>
      </li>
      <li><strong>Prurido intenso</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> loratadina 10 mg VO 24/24h.</li>
          <li><strong>Alternativa:</strong> hidroxizina 25 mg VO à noite.</li>
          <li><strong>Alérgico:</strong> cetirizina 10 mg VO 24/24h.</li>
          <li><strong>Refractário:</strong> hidroxizina 25 mg VO 8/8h + antifúngico VO se extensa.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Completar ciclo mesmo com melhora clínica precoce.</li>
      <li>Calçados ventilados; antifúngico em pó profilático se recorrência.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Diagnóstico clínico na maioria.</li>
      <li>Exame direto KOH ou cultura se atípico ou falha terapêutica.</li>
    </ul>
    <p class="emerg-note">Referência: SBD — dermatofitoses. Corticoide tópico isolado piora tinea (tinea incognito). Verificar interações de azóis com estatinas.</p>`,

  'tosse': `
    <p class="muted">Reflexo de defesa das vias aéreas. Tosse &lt; 3 semanas geralmente pós-infecciosa; investigar se &gt; 3 semanas (asma, DRGE, medicamentos, TB).</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Gravidade</strong> — SpO₂, FR; dispneia, hemoptise, estridor → priorizar via aérea e investigação urgente.</li>
      <li><strong>Hemoptise</strong> — estabilizar; Rx tórax; considerar TB, bronquiectasia, TEP — internar se maciça.</li>
      <li><strong>Tosse seca pós-viral</strong> — hidratação; mel (adulto) ou xarope simples; evitar supressores rotineiros.</li>
      <li><strong>Tosse produtiva</strong> (suspeita bacteriana: febre, purulência, &gt; 10 dias)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> amoxicilina 500 mg VO 8/8h · 5 dias.</li>
          <li><strong>Alternativa:</strong> amoxicilina + clavulanato 875/125 mg VO 12/12h · 5 dias (comorbidades/DPOC).</li>
          <li><strong>Alérgico:</strong> azitromicina 500 mg VO 24/24h · 3 dias <em>ou</em> levofloxacino 500 mg VO 24/24h · 5 dias.</li>
          <li><strong>Refractário:</strong> levofloxacino 750 mg VO 24/24h · 5 dias; Rx tórax e investigar TB se &gt; 3 semanas.</li>
        </ul>
      </li>
      <li><strong>Expectorante adjuvante</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ambroxol 30 mg VO 8/8h.</li>
          <li><strong>Alternativa:</strong> acetilcisteína 600 mg VO 24/24h.</li>
          <li><strong>Alérgico:</strong> hidratação oral abundante + mel (adulto).</li>
          <li><strong>Refractário:</strong> nebulização com SF 0,9%; investigar asma/DPOC.</li>
        </ul>
      </li>
      <li><strong>Broncoespasmo associado</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> salbutamol spray 2 jatos 6/6h + prednisona 40 mg VO 24/24h · 5 dias.</li>
          <li><strong>Alternativa:</strong> fenoterol spray 2 jatos 6/6h + prednisolona 40 mg VO 24/24h · 5 dias.</li>
          <li><strong>Alérgico:</strong> salbutamol nebulização 5 mg 6/6h + metilprednisolona 40 mg EV 24/24h · 3 dias.</li>
          <li><strong>Refractário:</strong> salbutamol + ipratrópio nebulização + hidrocortisona 200 mg EV; internar se insuficiência respiratória.</li>
        </ul>
      </li>
      <li><strong>Evitar</strong> — codeína de rotina (pouca evidência, risco de dependência); AAS/AINE se suspeita de dengue.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Tosse pós-infecciosa pode durar 3–8 semanas — orientar e reavaliar.</li>
      <li>Investigar TB se tosse &gt; 3 semanas + perda ponderal, sudorese noturna, contato com TB.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Rx tórax se febre persistente, hemoptise, imunossupressão ou &gt; 3 semanas.</li>
      <li>Espirometria ambulatorial se suspeita de asma/DPOC.</li>
    </ul>
    <p class="emerg-note">Referência: SBPT/MS — tosse crônica. Tosse isolada raramente necessita antibiótico; hemoptise nunca é banal.</p>`,

  'trauma-ocular': `
    <p class="muted">Lesão mecânica ou química do olho e anexos. <strong>Emergência oftalmológica</strong> se penetração, perda de conteúdo, química grave ou hematoma hiposfagma com suspeita de ruptura.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Não manipular</strong> — escudo rígido sem pressão; não remover corpo estranho aderido; não avaliar PIO digital se suspeita de ruptura.</li>
      <li><strong>Química</strong> — irrigar imediatamente com SF 0,9% ou Ringer lactato ≥ 1–2 L (mín. 30 min); pH conjuntival entre irrigações.</li>
      <li><strong>Contusão</strong> — analgesia (dipirona); elevar cabeceira 30°; gelo intermitente na pálpebra (não no globo).</li>
      <li><strong>Corpo estranho superficial</strong> — após anestesia tópica (proparacaína), remover com cotonete úmido ou agulha estéril.
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> tobramicina 0,3% colírio 1 gota 6/6h · 5 dias (Tobrex®).</li>
          <li><strong>Alternativa:</strong> ciprofloxacino 0,3% colírio 1 gota 6/6h · 5 dias.</li>
          <li><strong>Alérgico:</strong> eritromicina 0,5% pomada ocular 6/6h · 5 dias.</li>
          <li><strong>Refractário:</strong> moxifloxacino 0,5% colírio 8/8h; oftalmologia em 24 h.</li>
        </ul>
      </li>
      <li><strong>Hiposfagma total</strong> — suspeitar ruptura escleral; TC órbita; oftalmologia urgente.</li>
      <li><strong>ATB profilático</strong> (ferida penetrante)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ciprofloxacino 500 mg VO 12/12h até avaliação especializada.</li>
          <li><strong>Alternativa:</strong> levofloxacino 750 mg VO 24/24h.</li>
          <li><strong>Alérgico:</strong> moxifloxacino 400 mg VO 24/24h (cobertura ocular sistêmica).</li>
          <li><strong>Refractário:</strong> ceftriaxona 1 g EV 24/24h + vancomicina EV — internação + oftalmologia.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Abrasão corneana leve — lubrificante + tobramicina colírio 5 dias; retorno em 24 h.</li>
      <li>Retorno imediato se dor crescente, visão turva, fotofobia intensa.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Acuidade visual, reflexo pupilar, fluoresceína (Seidel se penetração).</li>
      <li>TC órbita se trauma de alto impacto, enoftalmia, diplopia.</li>
    </ul>
    <p class="emerg-note">Referência: CBO/Conselho Federal de Medicina — trauma ocular. Química alcalina &gt; ácida em gravidade. Nunca atrasar irrigação para documentação.</p>`,

  'tuberculose': `
    <p class="muted">Infecção por <em>M. tuberculosis</em>, geralmente pulmonar. Iniciar esquema padronizado do MS após confirmação ou forte suspeita clínico-radiológica.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Isolamento</strong> — máscara cirúrgica no paciente; N95 para equipe se suspeita de TB pulmonar bacilífera.</li>
      <li><strong>Diagnóstico</strong> — escarro (BAAR + GeneXpert/tríplice amostra); Rx tórax PA.</li>
      <li><strong>Esquema RHZE (fase intensiva — 2 meses)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> rifampicina + isoniazida + pirazinamida + etambutol (kit MS RHZE fixo-dose) 1×/dia em jejum.</li>
          <li><strong>Alternativa:</strong> comprimidos separados — R 600 mg + H 300 mg + Z 1500 mg + E 1200 mg VO 24/24h (ajustar por peso).</li>
          <li><strong>Alérgico:</strong> esquema individualizado em referência TB (substituir fármaco causador — nunca monoterapia).</li>
          <li><strong>Refractário:</strong> GeneXpert com resistência a rifampicina → encaminhar referência TB-MDR imediatamente.</li>
        </ul>
      </li>
      <li><strong>Fase manutenção (4 meses)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> rifampicina + isoniazida (kit MS RH) 1×/dia em jejum.</li>
          <li><strong>Alternativa:</strong> R 600 mg + H 300 mg VO 24/24h (comprimidos separados).</li>
          <li><strong>Alérgico:</strong> referência TB para esquema alternativo supervisionado.</li>
          <li><strong>Refractário:</strong> investigar adesão, resistência e comorbidades (HIV, DM); TDO obrigatório.</li>
        </ul>
      </li>
      <li><strong>Doses adulto (referência MS)</strong> — R 10 mg/kg (máx. 600 mg); H 10 mg/kg (máx. 300 mg); Z 35 mg/kg (máx. 2 g); E 15 mg/kg (máx. 1,6 g) — 1×/dia em jejum.</li>
      <li><strong>Profilaxia neuropatia</strong> — piridoxina 25–50 mg/dia com isoniazida.</li>
      <li><strong>TB grave/meninge</strong> — internar; rifampicina EV se disponível; corticoide adjuvante na meningite TB.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>TDO (tratamento diretamente observado) preferencial nos primeiros 2 meses.</li>
      <li>Notificação compulsória; investigar contactantes.</li>
      <li>Monitorar TGO/TGP mensal (hepatotoxicidade).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>BAAR, GeneXpert, cultura e TSA; Rx tórax comparativo.</li>
      <li>HIV (coinfecção altera esquema); teste de função hepática basal.</li>
    </ul>
    <p class="emerg-note">Referência: MS/PNCT — esquema <strong>2RHZE/4RH</strong> para TB pulmonar nova. Resistência a rifampicina (GeneXpert R) → encaminhar referência TB-MDR. Não usar monoterapia.</p>`,

  'ulcera-varicosa': `
    <p class="muted">Úlcera de perna por hipertensão venosa crônica. Tratar edema, infecção e ferida; compressão é pilar do tratamento.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliar</strong> — bordas, exsudato, odor, celulite perilesional; palpar pulsos (descartar componente arterial).</li>
      <li><strong>Curativo</strong> — limpeza com SF 0,9%; desbridamento de tecido necrótico solto; cobertura: hidrogel (leito limpo) ou carvão ativado (exsudato).</li>
      <li><strong>Infecção</strong> (celulite perilesional)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cefalexina 500 mg VO 6/6h · 7–10 dias.</li>
          <li><strong>Alternativa:</strong> amoxicilina + clavulanato 875/125 mg VO 12/12h · 7–10 dias.</li>
          <li><strong>Alérgico:</strong> clindamicina 300 mg VO 6/6h · 7–10 dias.</li>
          <li><strong>Refractário:</strong> clindamicina 600 mg VO 8/8h <em>ou</em> cefalexina 1 g VO 6/6h; cultura de ferida se ATB repetido.</li>
        </ul>
      </li>
      <li><strong>Compressão</strong> — meia elástica 30–40 mmHg ou bandagem multicamadas se ABI &gt; 0,8 e sem ICC descompensada.</li>
      <li><strong>Edema</strong> — elevar MMII; furosemida 40 mg VO se congestão associada.</li>
      <li><strong>Dor</strong> — dipirona; pentoxifilina 400 mg 8/8h adjuvante em úlcera crônica.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Curativo ambulatorial 2–3×/semana; compressão contínua diurna.</li>
      <li>Encaminhar cirurgia vascular se úlcera &gt; 6 meses sem cicatrização ou suspeita de etiologia arterial.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Índice tornozelo-braquial (ITB) antes de compressão forte.</li>
      <li>USG Doppler venoso ambulatorial; cultura de ferida se ATB repetido.</li>
    </ul>
    <p class="emerg-note">Referência: SBACV — úlcera venosa. Compressão acelera cicatrização; contraindicada se ITB &lt; 0,5. Descartar úlcera neoplásica se bordas elevadas.</p>`,

  'ulceras-genitais': `
    <p class="muted">Úlceras infecciosas do trato genital: sífilis, herpes, cancro mole, donovanose, LGV. Diagnóstico clínico + sorologias; tratar empiricamente conforme epidemiologia BR.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Higiene</strong> — lavar com água e sabão; evitar relações até diagnóstico; notificar parceiros.</li>
      <li><strong>Sífilis (úlcera indolor, borda dura)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> penicilina benzatina 2,4 milhões UI IM dose única (1,2 milhão UI em cada glúteo).</li>
          <li><strong>Alternativa:</strong> penicilina benzatina 2,4 milhões UI IM semanal · 3 semanas (sífilis secundária).</li>
          <li><strong>Alérgico:</strong> doxiciclina 100 mg VO 12/12h · 14 dias (sífilis primária — sem anafilaxia documentada à penicilina).</li>
          <li><strong>Refractário:</strong> repetir penicilina benzatina; VDRL controle; referência infectologia se falha.</li>
        </ul>
      </li>
      <li><strong>Herpes (vesículas dolorosas, múltiplas)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> aciclovir 400 mg VO 8/8h · 7–10 dias.</li>
          <li><strong>Alternativa:</strong> valaciclovir 500 mg VO 12/12h · 7–10 dias.</li>
          <li><strong>Alérgico:</strong> aciclovir tópico 5×/dia (eficácia limitada em primoinfecção).</li>
          <li><strong>Refractário:</strong> aciclovir 400 mg VO 5×/dia · 10 dias ou valaciclovir 1 g VO 12/12h · 7 dias.</li>
        </ul>
      </li>
      <li><strong>Cancro mole (úlcera dolorosa, borda irregular, pus)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> azitromicina 1 g VO dose única.</li>
          <li><strong>Alternativa:</strong> ceftriaxona 500 mg IM dose única.</li>
          <li><strong>Alérgico:</strong> ciprofloxacino 500 mg VO 12/12h · 3 dias (se resistência local baixa).</li>
          <li><strong>Refractário:</strong> ceftriaxona 500 mg IM + azitromicina 1 g VO; referência se úlcera persiste &gt; 7 dias.</li>
        </ul>
      </li>
      <li><strong>Donovanose</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> azitromicina 1 g VO semanal até cicatrização (mín. 3 semanas).</li>
          <li><strong>Alternativa:</strong> azitromicina 500 mg VO 24/24h até cicatrização.</li>
          <li><strong>Alérgico:</strong> doxiciclina 100 mg VO 12/12h até cicatrização.</li>
          <li><strong>Refractário:</strong> referência infectologia; biópsia para confirmar <em>Klebsiella granulomatis</em>.</li>
        </ul>
      </li>
      <li><strong>LGV (úlcera pequena + linfadenopatia inguinal)</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> doxiciclina 100 mg VO 12/12h · 21 dias.</li>
          <li><strong>Alternativa:</strong> azitromicina 1 g VO semanal · 3 semanas.</li>
          <li><strong>Alérgico:</strong> eritromicina 500 mg VO 6/6h · 21 dias.</li>
          <li><strong>Refractário:</strong> doxiciclina 100 mg VO 12/12h · 6 semanas; drenagem de bubão se flutuante.</li>
        </ul>
      </li>
      <li><strong>Analgesia</strong> — dipirona; banho de assento morno.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno em 7 dias para reavaliação e resultados (VDRL, HIV, hepatites).</li>
      <li>Tratar parceiros conforme protocolo IST MS.</li>
      <li>Sífilis — VDRL controle 3, 6, 12 meses.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>VDRL/RPR + FTA-Abs; sorologia HIV; HBsAg; anti-HCV.</li>
      <li>PCR HSV-2, cultura se atípico; biópsia se úlcera atípica ou não cicatriza.</li>
    </ul>
    <p class="emerg-note">Referência: MS/PN-DST 2022 — manejo de úlceras genitais. Tratar sífilis e herpes empiricamente se dúvida. Donovanose e cancro mole são endêmicos na Amazônia.</p>`,

  'varizes-mmi': `
    <p class="muted">Insuficiência venosa crônica dos membros inferiores com veias dilatadas, dor, edema e desconforto. Classificar CEAP; tratar com medidas conservadoras na maioria.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliar complicações</strong> — úlcera ativa, tromboflebite superficial, sangramento varicoso (compressão imediata + elevação).</li>
      <li><strong>Sangramento de variz</strong> — compressão direta 10 min; elevar membro; curativo compressivo; investigar coagulopatia se recorrente.</li>
      <li><strong>Tromboflebite superficial</strong> (se extensa/proximal)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> cefalexina 500 mg VO 6/6h · 7 dias + ibuprofeno 400 mg VO 8/8h + compressão.</li>
          <li><strong>Alternativa:</strong> diclofenaco 50 mg VO 8/8h + compressão (se sem infecção).</li>
          <li><strong>Alérgico:</strong> clindamicina 300 mg VO 6/6h · 7 dias + dipirona para dor.</li>
          <li><strong>Refractário:</strong> USG Doppler urgente (descartar TVP); enoxaparina se extensão &gt; 5 cm da junção safeno-femoral.</li>
        </ul>
      </li>
      <li><strong>Edema e dor</strong> — meia elástica 20–30 mmHg; elevação; diosmina + hesperidina 500 mg 12/12h (adjuvante).</li>
      <li><strong>Prurido/dermatite ocre</strong> — hidrocortisona 1% tópica curto prazo + emoliente.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Meias de compressão diurnas; exercício (caminhada); perda de peso.</li>
      <li>Encaminhar cirurgia vascular/dermatologia para escleroterapia ou cirurgia se sintomático refratário.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>USG Doppler venoso ambulatorial (refluxo safeno-femoral).</li>
      <li>ITB se suspeita de doença arterial concomitante.</li>
    </ul>
    <p class="emerg-note">Referência: SBACV — insuficiência venosa crônica (CEAP). Tromboflebite &gt; 5 cm da junção safeno-femoral → avaliar anticoagulação (TVP associada).</p>`,

  'violencia-sexual-pep': `
    <p class="muted">Profilaxias pós-exposição (PEP) após violência sexual conforme protocolo MS. Janelas: contracepção de emergência até 5 dias; IST bacterianas imediato; HIV até 72 h.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Acolhimento</strong> — privacidade, equipe treinada, consentimento; registro de lesões (corpo de delito se desejado, sem bloquear assistência).</li>
      <li><strong>Contracepção de emergência</strong> — <strong>levonorgestrel</strong> 1,5 mg VO dose única (até 72 h, eficácia decrescente até 5 dias) ou DIU de cobre (até 5 dias, mais eficaz).</li>
      <li><strong>Profilaxia IST bacterianas</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ceftriaxona 500 mg IM dose única (gonorreia) + azitromicina 1 g VO dose única (clamídia) + metronidazol 2 g VO dose única (tricomonas).</li>
          <li><strong>Alternativa:</strong> cefixima 400 mg VO dose única (gonorreia) + azitromicina 1 g VO + metronidazol 2 g VO.</li>
          <li><strong>Alérgico:</strong> espectinomicina 2 g IM dose única (gonorreia — se disponível) + azitromicina 1 g VO + metronidazol 2 g VO.</li>
          <li><strong>Refractário:</strong> repetir ceftriaxona 500 mg IM + azitromicina 1 g VO se exposição repetida; cultura se corrimento persistente.</li>
        </ul>
      </li>
      <li><strong>PEP HIV (TARV)</strong> — iniciar em <strong>≤ 72 h</strong> se exposição de risco
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> tenofovir + lamivudina + dolutegravir (TDF/3TC/DTG) VO 24/24h · 28 dias.</li>
          <li><strong>Alternativa:</strong> tenofovir + emtricitabina + dolutegravir (TDF/FTC/DTG) · 28 dias.</li>
          <li><strong>Alérgico:</strong> zidovudina + lamivudina + raltegravir (esquema alternativo — infectologia).</li>
          <li><strong>Refractário:</strong> ajustar conforme resistência do parceiro (se conhecida); adesão rigorosa 28 dias.</li>
        </ul>
      </li>
      <li><strong>Hepatite B</strong> — vacina + imunoglobulina anti-HBs se não vacinado ou esquema incompleto.</li>
      <li><strong>Suporte</strong> — profilaxia tétano se feridas; analgesia; encaminhamento psicossocial (CRAS, delegacia especializada se desejado).</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno em 7, 14 e 30 dias — adesão TARV, efeitos adversos, sorologias baseline.</li>
      <li>Reteste HIV, sífilis, hepatite B/C e gravidez em 3 e 6 meses.</li>
      <li>Acompanhamento psicológico contínuo.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Sorologias baseline: HIV, sífilis (VDRL), HBsAg, anti-HCV, β-hCG.</li>
      <li>Exame físico completo com documentação de lesões; coleta de secreção se corrimento.</li>
    </ul>
    <p class="emerg-note">Referência: MS — Protocolo de atenção às pessoas em situação de violência sexual (2022). PEP HIV: 28 dias TARV. Não negar assistência por ausência de BO.</p>`,

  'vomitos-agudos': `
    <p class="muted">Vômitos de início recente por gastroenterite, intoxicação, gravidez, obstrução ou causa metabólica. Priorizar hidratação e tratar causa base.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>ABC</strong> — avaliar desidratação (turgor, PA, diurese); glicemia capilar; β-hCG em mulher fértil.</li>
      <li><strong>Hidratação</strong> — leve: SRO 200 ml após cada vômito; moderada/grave: SF 0,9% 500–1000 ml EV bolus, reavaliar.</li>
      <li><strong>Antiemético</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> ondansetrona 4 mg EV/IM 8/8h (gastroenterite, gravidez).</li>
          <li><strong>Alternativa:</strong> metoclopramida 10 mg EV/IM 8/8h.</li>
          <li><strong>Alérgico:</strong> dimenidrinato 50 mg VO 6/6h <em>ou</em> bromoprida 10 mg EV 8/8h.</li>
          <li><strong>Refractário:</strong> ondansetrona 8 mg EV 8/8h + hidratação EV; investigar obstrução (Rx abdome).</li>
        </ul>
      </li>
      <li><strong>Gastroenterite viral</strong> — suporte; racecadotril 100 mg VO 8/8h (adulto) adjuvante; sem ATB de rotina.</li>
      <li><strong>Suspeita de obstrução</strong> — SNG em drenagem; Rx abdome; cirurgia se distensão, ausência de flatus, dor em cólica.</li>
      <li><strong>Intoxicação</strong> — tratar conforme agente; carvão ativado se ingestão recente e via pérvia.</li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Dieta leve progressiva após 6 h sem vômitos; evitar álcool e gordura inicialmente.</li>
      <li>Retorno se vômitos com sangue, fezes escuras, dor abdominal intensa ou sinais de desidratação.</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>Eletrólitos, ureia/creatinina se desidratação moderada-grave.</li>
      <li>Rx abdome ou TC se suspeita de obstrução, apendicite, pancreatite.</li>
      <li>Amilase/lipase se dor epigástrica irradiada para dorso.</li>
    </ul>
    <p class="emerg-note">Referência: MS — gastroenterite aguda. Ondansetrona prolonga QT — cautela com outros QT-prolongadores. Obstrução intestinal: antiemético não substitui avaliação cirúrgica.</p>`,

  'vulvovaginites': `
    <p class="muted">Inflamação vulvovaginal por vaginose bacteriana (VB), candidíase ou tricomoníase. Diagnóstico clínico (corrimento, pH, Whiff, microscopia) orienta tratamento específico.</p>
    <h4>Prescrições de pronto-socorro</h4>
    <ol class="emerg-steps">
      <li><strong>Avaliar</strong> — corrimento (cor, odor, prurido), pH vaginal, sinais de PID (dor pélvica, febre) → encaminhar ginecologia.</li>
      <li><strong>Vaginose bacteriana</strong> (corrimento cinza, odor de peixe, pH &gt; 4,5, Whiff+)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> metronidazol 500 mg VO 12/12h · 7 dias.</li>
          <li><strong>Alternativa:</strong> secnidazol 2 g VO dose única <em>ou</em> gel vaginal metronidazol 0,75% 1 aplicador 24/24h · 5 dias.</li>
          <li><strong>Alérgico:</strong> clindamicina 300 mg VO 12/12h · 7 dias <em>ou</em> creme vaginal clindamicina 2% 7 noites.</li>
          <li><strong>Refractário:</strong> metronidazol 500 mg VO 12/12h · 14 dias; investigar Gardnerella resistente ou reinfecção.</li>
        </ul>
      </li>
      <li><strong>Candidíase</strong> (prurido intenso, corrimento grumoso branco, pH &lt; 4,5)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> fluconazol 150 mg VO dose única.</li>
          <li><strong>Alternativa:</strong> miconazol creme vaginal 2% 1 aplicador 24/24h · 7 noites.</li>
          <li><strong>Alérgico:</strong> nistatina óvulo vaginal 100.000 UI 24/24h · 14 dias.</li>
          <li><strong>Refractário:</strong> fluconazol 150 mg VO dose única repetir em 72 h; investigar DM/imunossupressão.</li>
        </ul>
      </li>
      <li><strong>Tricomoníase</strong> (corrimento amarelo-esverdeado, espumoso, colo em framboesa)
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> metronidazol 2 g VO dose única + tratar parceiro.</li>
          <li><strong>Alternativa:</strong> secnidazol 2 g VO dose única + tratar parceiro.</li>
          <li><strong>Alérgico:</strong> metronidazol 500 mg VO 12/12h · 7 dias (teste de tolerância).</li>
          <li><strong>Refractário:</strong> metronidazol 500 mg VO 12/12h · 7 dias (esquema prolongado); repetir em 3 meses se recorrência.</li>
        </ul>
      </li>
      <li><strong>Sintomáticos</strong> — evitar duchas; higiene externa apenas com água.</li>
      <li><strong>Gestante</strong>
        <ul class="ps-med-options">
          <li><strong>1ª linha:</strong> VB/tricomonas — metronidazol 250 mg VO 8/8h · 7 dias; candida — clotrimazol creme vaginal 2% · 7 noites.</li>
          <li><strong>Alternativa:</strong> VB — metronidazol gel vaginal 0,75% · 5 dias; candida — miconazol óvulo vaginal · 7 noites.</li>
          <li><strong>Alérgico:</strong> clotrimazol tópico (candida); clindamicina creme vaginal (VB — 2º trimestre).</li>
          <li><strong>Refractário:</strong> evitar fluconazol oral na gestação; referência ginecologia se recorrente.</li>
        </ul>
      </li>
    </ol>
    <h4>Alta / ambulatorial</h4>
    <ul>
      <li>Retorno se sintomas persistem em 7–14 dias (recorrência, resistência, outra IST).</li>
      <li>Tratar parceiros em tricomoníase; investigar IST concomitantes (HIV, sífilis).</li>
    </ul>
    <h4>Exames / investigação</h4>
    <ul>
      <li>pH, teste de Whiff (KOH), microscopia a fresco se disponível.</li>
      <li>Citologia/cultura se recorrente (&gt; 4 episódios/ano) ou falha terapêutica.</li>
    </ul>
    <p class="emerg-note">Referência: MS/PN-DST 2022 · FEBRASGO. VB: metronidazol. Candida: fluconazol. Tricomonas: metronidazol. Não misturar tratamentos sem diagnóstico — piora candidíase com metronidazol isolado em VB mal diagnosticada.</p>`
};
