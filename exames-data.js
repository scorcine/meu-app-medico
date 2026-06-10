/* Exames — referência de solicitação por cenário clínico */

const EXAMES_TOPICS = [
  { id: 'sepse-infeccao', name: 'Sepse / infecção grave', icon: '🦠', tags: 'sepse choque lactato procalcitonina' },
  { id: 'dor-toracica', name: 'Dor torácica / SCA', icon: '❤️', tags: 'troponina ecg sca infarto' },
  { id: 'abdome-agudo', name: 'Abdome agudo', icon: '🫃', tags: 'tc abdome amilase lipase' },
  { id: 'cefaleia-subita', name: 'Cefaleia súbita / SAV', icon: '🧠', tags: 'tc cranio puncao liquor' },
  { id: 'pneumonia', name: 'Pneumonia / dispneia', icon: '🫁', tags: 'rx torax gasometria' },
  { id: 'itu-pielonefrite', name: 'ITU / pielonefrite', icon: '💧', tags: 'urina urocultura' },
  { id: 'anemia', name: 'Anemia — investigação inicial', icon: '🩸', tags: 'hemograma ferritina b12 folato' },
  { id: 'hda-dispepsia', name: 'HDA / dispepsia alarme', icon: '🩸', tags: 'endoscopia hemoglobina' },
  { id: 'ic-descompensada', name: 'IC descompensada / EAP', icon: '🫁', tags: 'bnp proBNP ecocardiograma' },
  { id: 'avc-neuro', name: 'AVC / déficit neurológico', icon: '🧠', tags: 'tc cranio nihss' },
  { id: 'gestante-urgencia', name: 'Gestante — urgência', icon: '🤰', tags: 'beta hcg usg obstetrico' },
  { id: 'trauma', name: 'Trauma / politrauma', icon: '🆘', tags: 'fast tc corpo inteiro' },
  { id: 'dengue', name: 'Dengue — classificação', icon: '🦟', tags: 'hemograma plaquetas hematocrito' },
  { id: 'dm-descompensacao', name: 'DM — cetoacidose / hiperosmolar', icon: '🩸', tags: 'glicemia gasometria cetonas' },
  { id: 'tireotoxicose', name: 'Tireotoxicose / tempestade', icon: '🦋', tags: 'tsh t4 livre' },
  { id: 'hepatopatia', name: 'Hepatopatia aguda / icterícia', icon: '🧪', tags: 'transaminases bilirrubina inr' },
  { id: 'drc-monitorizacao', name: 'DRC — monitorização', icon: '💧', tags: 'creatinina egfr proteinuria' },
  { id: 'pre-operatorio', name: 'Pré-operatório (rotina)', icon: '🔪', tags: 'coagulograma hemograma ecg' }
];

const EXAMES_CONTENT = {
  'sepse-infeccao': `
    <p class="muted">Painel inicial orientado por qSOFA/SOFA — adaptar ao protocolo institucional de sepse.</p>
    <h4>Laboratório (urgente)</h4>
    <ul>
      <li>Hemograma completo · PCR · procalcitonina (se disponível)</li>
      <li>Lactato arterial/venoso seriado (meta clearance)</li>
      <li>Creatinina, ureia, eletrólitos (Na, K, Mg, P)</li>
      <li>Gasometria arterial se hipoxemia/choque</li>
      <li>Glicemia · TAP/INR · bilirrubinas se coagulopatia/hepatopatia</li>
      <li>Tipagem sanguínea se possível transfusão</li>
      <li>Hemoculturas (2 pares) <strong>antes</strong> do ATB, se sem atrasar antibioticoterapia</li>
      <li>Urina I/E + urocultura · secreção/punção conforme foco</li>
    </ul>
    <h4>Imagem</h4>
    <ul>
      <li>Rx tórax · USG FAST/pulmão/pelve conforme foco</li>
      <li>TC com contraste se foco abdominal ou embolia pulmonar suspeita</li>
    </ul>
    <p class="emerg-note">Conteúdo educacional — não substitui protocolo institucional de sepse.</p>`,

  'dor-toracica': `
    <p class="muted">Suspeita de SCA: ECG em ≤ 10 min e troponina de alta sensibilidade seriada.</p>
    <h4>Imediato</h4>
    <ul>
      <li><strong>ECG 12 derivações</strong> — comparar com prévios</li>
      <li><strong>Troponina</strong> — 0 h e 1–3 h (algoritmo hs-cTn local)</li>
    </ul>
    <h4>Complementar</h4>
    <ul>
      <li>Hemograma · creatinina · eletrólitos (K, Mg) · glicemia</li>
      <li>TAP se anticoagulação · D-dímero se TEP no diferencial (Wells/PERC)</li>
      <li>Rx tórax — pneumotórax, pneumonia, congestão</li>
      <li>Ecocardiograma à beira-leito se instabilidade</li>
      <li>AngioTC coronárias/aorta se dissecção ou SCA com ECG inconclusivo (protocolo)</li>
    </ul>`,

  'abdome-agudo': `
    <h4>Laboratório</h4>
    <ul>
      <li>Hemograma · amilase/lipase · creatinina · eletrólitos · lactato se sepse</li>
      <li>β-hCG em mulher em idade fértil</li>
      <li>TAP se sangramento/cirurgia · bilirrubinas se icterícia</li>
      <li>Urina I/E · gasometria se acidose/vômitos</li>
    </ul>
    <h4>Imagem</h4>
    <ul>
      <li>Rx abdome (ortostático/decúbito) — obstrução/perfuração</li>
      <li>USG abdome — colecistite, apendicite pediátrica, gestante</li>
      <li>TC abdome com contraste — padrão-ouro adulto estável (apendicite, diverticulite, isquemia)</li>
    </ul>`,

  'cefaleia-subita': `
    <p class="muted">Cefaleia “a pior da vida” ou thunderclap — excluir HSA antes de alta.</p>
    <h4>Imagem</h4>
    <ul>
      <li><strong>TC crânio sem contraste</strong> — 1ª linha</li>
      <li>AngioTC ou RM se TC negativa e alta suspeita de HSA</li>
      <li>Punção lombar se TC/angio negativos e > 6 h do início (protocolo local)</li>
    </ul>
    <h4>Laboratório</h4>
    <ul>
      <li>Glicemia capilar · hemograma se febre/meningismo</li>
      <li>Liquor: celularidade, glicose, proteína, Gram, cultura se meningite no diferencial</li>
    </ul>`,

  'pneumonia': `
    <h4>Laboratório</h4>
    <ul>
      <li>Hemograma · PCR/procalcitonina (estratificação)</li>
      <li>Creatinina · eletrólitos · glicemia</li>
      <li>Gasometria se SpO₂ baixa ou DPOC</li>
      <li>Hemoculturas se internação/sepse</li>
      <li>Antígeno urinário <em>Streptococcus pneumoniae</em> / <em>Legionella</em> (selecionado)</li>
    </ul>
    <h4>Imagem</h4>
    <ul>
      <li><strong>Rx tórax PA + perfil</strong></li>
      <li>TC tórax se complicação, imunossuprimido ou não resposta</li>
    </ul>
    <p class="emerg-note">Use CURB-65/PSI na decisão ambulatorial vs internação.</p>`,

  'itu-pielonefrite': `
    <h4>Essencial</h4>
    <ul>
      <li>Urina I/E + urocultura (antes do ATB se possível)</li>
      <li>Hemograma · PCR · creatinina</li>
      <li>Glicemia se DM · β-hCG se gestante</li>
    </ul>
    <h4>Se internação / complicada</h4>
    <ul>
      <li>Hemoculturas · USG rins/vias urinárias (obstrução, abscesso)</li>
      <li>TC abdome/pelve se febre persistente ou suspeita de complicação</li>
    </ul>`,

  'anemia': `
    <h4>1ª linha</h4>
    <ul>
      <li>Hemograma com índices (VCM, HCM, RDW)</li>
      <li>Reticulócitos (hemólise/sangramento agudo)</li>
      <li>Ferritina · ferro sérico · TIBC (anemia ferropriva)</li>
      <li>Vitamina B12 · ácido fólico (macrocítica)</li>
      <li>Creatinina (anemia renal)</li>
    </ul>
    <h4>Conforme contexto</h4>
    <ul>
      <li>LDH, bilirrubina indireta, haptoglobina (hemólise)</li>
      <li>TSH · eletroforese Hb (talassemia) · mielograma se citopenias múltiplas</li>
      <li>Endoscopia/colonoscopia se ferropriva sem causa aparente</li>
    </ul>`,

  'hda-dispepsia': `
    <h4>Urgência (instabilidade / sangramento)</h4>
    <ul>
      <li>Hemograma seriado · TAP/INR · creatinina · tipagem</li>
      <li>Gasometria · lactato · ureia (síndrome urêmica)</li>
      <li>Endoscopia digestiva alta <strong>precoce</strong> (24 h) se HDA</li>
    </ul>
    <h4>Dispepsia sem alarme</h4>
    <ul>
      <li>Teste <em>H. pylori</em> (respiratório, antígeno fecal ou histologia)</li>
      <li>Hemograma se anemia · função hepática se icterícia</li>
      <li>EDA se > 45 anos, alarme ou refratariedade</li>
    </ul>`,

  'ic-descompensada': `
    <h4>Laboratório</h4>
    <ul>
      <li>Hemograma · creatinina · eletrólitos (Na, K) · ureia</li>
      <li>BNP ou NT-proBNP (diferencial dispneia)</li>
      <li>Troponina (injúria miocárdica associada)</li>
      <li>TSH · função hepática se congestão</li>
    </ul>
    <h4>Imagem</h4>
    <ul>
      <li>Rx tórax · ECG</li>
      <li>Ecocardiograma (FE, valvopatia, derrame)</li>
    </ul>`,

  'avc-neuro': `
    <h4>Imagem (urgente)</h4>
    <ul>
      <li><strong>TC crânio sem contraste</strong> ≤ 25 min — excluir hemorragia</li>
      <li>AngioTC se suspeita oclusão grande vaso / trombectomia</li>
      <li>RM/angioRM se janela estendida (critérios DAWN/DEFUSE)</li>
    </ul>
    <h4>Laboratório</h4>
    <ul>
      <li>Glicemia capilar · hemograma · plaquetas · TAP/INR · creatinina</li>
      <li>ECG · troponina</li>
    </ul>
    <p class="emerg-note">NIHSS seriado. Não atrasar imagem para laboratório completo.</p>`,

  'gestante-urgencia': `
    <h4>Toda gestante com dor abdominal/sangramento</h4>
    <ul>
      <li>β-hCG quantitativo</li>
      <li>USG obstétrico/transvaginal — ectópica, vitalidade, placenta</li>
      <li>Tipagem sanguínea · hemograma · TAP se sangramento</li>
    </ul>
    <h4>Conforme queixa</h4>
    <ul>
      <li>Urina I/E · urocultura (ITU/pielonefrite)</li>
      <li>Liquor se meningite · Rx se pneumonia</li>
      <li>Monitorização fetal contínua se viabilidade ≥ 24 sem</li>
    </ul>`,

  'trauma': `
    <h4>ATLS — laboratório paralelo à reanimação</h4>
    <ul>
      <li>Tipagem · hemograma · TAP · fibrinogênio</li>
      <li>Gasometria · lactato · glicemia</li>
      <li>Creatinina · eletrólitos · amilase se trauma abdominal</li>
    </ul>
    <h4>Imagem</h4>
    <ul>
      <li>Rx tórax + pelve (FAST extendido)</li>
      <li>USG FAST — hemoperitônio/hemotórax</li>
      <li>TC corpo inteiro com contraste se estável e mecanismo de alta energia</li>
    </ul>`,

  'dengue': `
    <h4>Classificação A/B/C/D (MS)</h4>
    <ul>
      <li>Hemograma completo — <strong>hematócrito seriado</strong> (extravasamento)</li>
      <li>Plaquetas · albumina · transaminases</li>
      <li>Creatinina · TAP se choque/sangramento</li>
    </ul>
    <h4>Não rotineiro</h4>
    <ul>
      <li>Sorologia/NS1 — confirmação epidemiológica; não atrasa conduta</li>
    </ul>
    <p class="emerg-note">Sinais de alarme: dor abdominal intensa, vômitos persistentes, hipotensão, sangramento mucoso.</p>`,

  'dm-descompensacao': `
    <h4>Cetoacidose / estado hiperglicêmico</h4>
    <ul>
      <li>Glicemia · gasometria venosa (pH, HCO₃, pCO₂)</li>
      <li>Cetonas séricas ou urinárias</li>
      <li>Eletrólitos (Na corrigido, K, Mg, P) · creatinina</li>
      <li>Hemograma · lactato · osmolaridade</li>
      <li>ECG (alterações por K)</li>
    </ul>
    <h4>Monitorização</h4>
    <ul>
      <li>Glicemia capilar 1–2 h · gasometria/eletrólitos conforme protocolo de reposição</li>
    </ul>`,

  'tireotoxicose': `
    <h4>Laboratório</h4>
    <ul>
      <li>TSH · T4 livre (± T3 livre se TSH suprimido)</li>
      <li>Hemograma · eletrólitos · transaminases</li>
      <li>ECG (FA frequente)</li>
    </ul>
    <h4>Tempestade tiroidiana (suspeita)</h4>
    <ul>
      <li>Gasometria · lactato · creatinina</li>
      <li>Culturas se foco infeccioso precipitante</li>
    </ul>`,

  'hepatopatia': `
    <h4>Painel hepático</h4>
    <ul>
      <li>TGO/TGP · bilirrubinas · FA · GGT · albumina</li>
      <li>TAP/INR · plaquetas (função sintética)</li>
      <li>Hemograma · creatinina (hepatorenal)</li>
    </ul>
    <h4>Etiologia</h4>
    <ul>
      <li>Sorologias virais (A, B, C) · álcool (AUDIT) · autoimune (AMA, ANA)</li>
      <li>USG abdome — vias biliares, esteatose, cirrose</li>
      <li>Amônia se encefalopatia</li>
    </ul>`,

  'drc-monitorizacao': `
    <h4>Estadiamento e progressão</h4>
    <ul>
      <li>Creatinina · eGFR (CKD-EPI) — 1–2×/ano estável</li>
      <li>Relação albumina/creatinina urinária (proteinúria)</li>
      <li>Eletrólitos · bicarbonato · PTH · vitamina D · hemograma</li>
    </ul>
    <h4>Comorbidades</h4>
    <ul>
      <li>Glicemia/HbA1c · perfil lipídico · PA</li>
      <li>ECG · Rx tórax se congestão</li>
    </ul>`,

  'pre-operatorio': `
    <p class="muted">Estratificar risco (ASA/RCRI) — evitar “painel completo” sem indicação.</p>
    <h4>Baixo risco (&lt; 45 anos, ASA I–II, cirurgia menor)</h4>
    <ul>
      <li>Glicemia se DM · β-hCG se mulher fértil</li>
      <li>Hemograma se sangramento esperado &gt; 500 mL</li>
    </ul>
    <h4>Risco intermediário/alto</h4>
    <ul>
      <li>Hemograma · creatinina · eletrólitos</li>
      <li>ECG (&gt; 50 anos ou cardiopatia)</li>
      <li>Rx tórax se DPOC/cardiopatia</li>
      <li>Coagulograma se anticoagulante, hepatopatia ou neuraxial</li>
      <li>Tipagem se cirurgia de grande porte</li>
    </ul>`
};

EXAMES_TOPICS.forEach(t => {
  t.html = EXAMES_CONTENT[t.id] || '<p class="coming-soon">Conteúdo em construção.</p>';
  t.searchText = (t.name + ' ' + (t.tags || '')).toLowerCase();
});
