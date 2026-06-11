/* Interpretação de exames — guias rápidos */

const INTERP_TOPICS = [
  { id: 'hemograma', name: 'Hemograma — visão geral', icon: '🩸', tags: 'leucocitos hemoglobina plaquetas' },
  { id: 'leucocitose', name: 'Leucocitose / leucopenia', icon: '🦠', tags: 'neutrofilos linfocitos' },
  { id: 'anemia-vcm', name: 'Anemia pelo VCM', icon: '🔬', tags: 'micro macro normocitica' },
  { id: 'sodio', name: 'Distúrbios do sódio', icon: '⚗️', tags: 'hiponatremia hipernatremia' },
  { id: 'potassio', name: 'Distúrbios do potássio', icon: '⚡', tags: 'hipocalemia hipercalemia ecg' },
  { id: 'gasometria', name: 'Gasometria arterial/venosa', icon: '💨', tags: 'acidemia alcalose pco2 hco3' },
  { id: 'funcao-renal', name: 'Função renal (Cr/eGFR)', icon: '💧', tags: 'creatinina clearance aki' },
  { id: 'funcao-hepatica', name: 'Função hepática', icon: '🧪', tags: 'tgo tgp bilirrubina inr' },
  { id: 'troponina', name: 'Troponina de alta sensibilidade', icon: '❤️', tags: 'sca infarto miocardio' },
  { id: 'd-dimero', name: 'D-dímero', icon: '🫁', tags: 'tep tvp wells perc' },
  { id: 'lactato', name: 'Lactato sérico', icon: '🦠', tags: 'sepse perfusao clearance' },
  { id: 'glicemia-hba1c', name: 'Glicemia / HbA1c', icon: '🩸', tags: 'diabetes dm jeum' },
  { id: 'tsh-t4', name: 'TSH / T4 livre', icon: '🦋', tags: 'hipo hipertireoidismo' },
  { id: 'urina-rotina', name: 'Urina tipo I / sedimento', icon: '💧', tags: 'leucocituria nitrito proteinuria' },
  { id: 'pcr-pct', name: 'PCR e procalcitonina', icon: '🌡️', tags: 'infeccao bacteriana viral' },
  { id: 'rx-torax', name: 'Rx tórax — padrões comuns', icon: '🫁', tags: 'consolidacao derrame pneumotorax' },
  { id: 'ecg-basico', name: 'ECG — leitura sistemática', icon: '📈', tags: 'ritmo eixo intervalo supra st' },
  { id: 'bnp', name: 'BNP / NT-proBNP', icon: '💓', tags: 'ic dispneia congestao' },
  { id: 'calcio-magnesio', name: 'Cálcio / magnésio / fósforo', icon: '🦴', tags: 'hipocalcemia hipomagnesemia pth' },
  { id: 'coagulograma', name: 'Coagulograma (TAP/INR)', icon: '🩸', tags: 'tp inr fibrinogenio dic' },
  { id: 'amilase-lipase', name: 'Amilase / lipase', icon: '🫃', tags: 'pancreatite abdome agudo' },
  { id: 'beta-hcg', name: 'β-hCG — gestação / ectópica', icon: '🤰', tags: 'gravidez ectopica aborto' },
  { id: 'acidose-gap', name: 'Acidose metabólica / anion gap', icon: '⚗️', tags: 'gap delta winter mudpiles' },
  { id: 'toxicologia-serica', name: 'Toxicologia sérica (plantão)', icon: '☠️', tags: 'paracetamol salicilato etanol' },
  { id: 'hemocultura-urina', name: 'Culturas — hemocultura / urocultura', icon: '🧫', tags: 'bacteremia itu sepse' },
  { id: 'osmolaridade', name: 'Osmolaridade / tonicidade', icon: '💧', tags: 'hiperosmolar siadh diabetes insipidus' },
  { id: 'pediatria-electrolitos', name: 'Eletrólitos na pediatria', icon: '👶', tags: 'desidratacao sodio potassio' },
  { id: 'tc-cranio-basico', name: 'TC crânio — achados básicos', icon: '🧠', tags: 'hemorragia edema hernia' },
  { id: 'ferritina-inflamacao', name: 'Ferritina / marcadores inflamatórios', icon: '🔥', tags: 'ferropriva doenca cronica ferritina' },
  { id: 'curva-glicemica', name: 'Curva glicêmica / hipoglicemia', icon: '📉', tags: 'insulina sulfonilureia whippple' }
];

const INTERP_CONTENT = {
  hemograma: `
    <h4>Leitura rápida</h4>
    <ul>
      <li><strong>Hb/Ht</strong> — anemia, policitemia, hemoconcentração (desidratação/dengue)</li>
      <li><strong>Leucócitos</strong> — infecção, estresse, corticoide, leucemia (ver diferencial)</li>
      <li><strong>Plaquetas</strong> — trombocitopenia (DIC, sepse, ITP) vs trombocitose reativa</li>
      <li><strong>Índices eritrocitários</strong> — VCM/HCM/RDW orientam anemia (micro/macro/normo)</li>
    </ul>
    <p class="emerg-note">Sempre correlacionar com clínica e tendência (valores seriados).</p>`,

  leucocitose: `
    <h4>Neutrofilia</h4>
    <ul>
      <li>Infecção bacteriana · estresse · corticoide · pós-operatório</li>
      <li><strong>Bastões ↑</strong> — “desvio à esquerda” (infecção grave)</li>
    </ul>
    <h4>Linfocitose</h4>
    <ul>
      <li>Viral (EBV, CMV) · linfoma · hipotireoidismo · estresse crônico</li>
    </ul>
    <h4>Leucopenia</h4>
    <ul>
      <li>Viral · drogas (clozapina, quimio) · B12/folato · hiperesplenismo · SLE</li>
      <li><strong>Neutropenia febril</strong> — emergência oncológica/infecciosa</li>
    </ul>`,

  'anemia-vcm': `
    <h4>Microcítica (VCM baixo)</h4>
    <ul>
      <li>Ferropriva (ferritina baixa) · talassemia (ferritina normal/alta, RDW normal)</li>
      <li>Doença crônica (ferritina normal/alta, PCR ↑)</li>
    </ul>
    <h4>Macrocítica</h4>
    <ul>
      <li>B12/folato · álcool · hipotireoidismo · mielodisplasia · medicamentos (MTX, AZT)</li>
    </ul>
    <h4>Normocítica</h4>
    <ul>
      <li>Sangramento agudo · hemólise (reticulócitos ↑) · DRC · doença crônica</li>
    </ul>`,

  sodio: `
    <h4>Hiponatremia</h4>
    <ul>
      <li>Classificar: hipovolêmica, euvolêmica (SIADH), hipervolêmica (IC, cirrose)</li>
      <li>Na osmolar, Na urinário, ácido úrico, TSH/cortisol se euvolêmica</li>
      <li>Corrigir lentamente — risco mielinólise se &gt; 8–10 mEq/L/24 h</li>
    </ul>
    <h4>Hipernatremia</h4>
    <ul>
      <li>Déficit hídrico (diabetes insipidus, baixa ingesta) · perdas (diurese osmótica)</li>
      <li>Repor água livre — meta queda Na ~ 10 mEq/L/24 h</li>
    </ul>`,

  potassio: `
    <h4>Hipocalemia</h4>
    <ul>
      <li>Perdas GI/renal · alcalose · insulina · diuréticos</li>
      <li>ECG: achatamento T, onda U, arritmias</li>
      <li>Reposição VO/EV conforme gravidade; corrigir Mg se refratária</li>
    </ul>
    <h4>Hipercalemia</h4>
    <ul>
      <li>DRC · IECA/BRA · espironolactona · hemólise · rabdomiólise</li>
      <li>ECG: ondas T apiculadas, alargamento QRS — tratar se alteração ECG ou K &gt; 6,5</li>
      <li>Medidas: gluconato Ca, insulina+glicose, beta-2, diurético, diálise se grave</li>
    </ul>`,

  gasometria: `
    <h4>Passo a passo</h4>
    <ol class="emerg-steps">
      <li>pH — acidemia (&lt; 7,35) ou alcalemia (&gt; 7,45)</li>
      <li>pCO₂ — respiratório (inverso ao pH)</li>
      <li>HCO₃ — metabólico (paralelo ao pH)</li>
      <li>Compensação esperada (Winter, etc.)</li>
      <li>Anion gap se acidose metabólica</li>
    </ol>
    <h4>Gap elevado (MUDPILES)</h4>
    <p>Metanol, Uremia, DKA, Paraldehyde, Isoniazida, Lactato, Etanol, Salicilatos</p>`,

  'funcao-renal': `
    <h4>Creatinina / eGFR</h4>
    <ul>
      <li>AKI (KDIGO): ↑ Cr ≥ 0,3 mg/dL em 48 h ou ↑ ≥ 1,5× basal ou diurese &lt; 0,5 mL/kg/h</li>
      <li>DRC: eGFR &lt; 60 por ≥ 3 meses ± albuminúria</li>
    </ul>
    <h4>Causas AKI</h4>
    <ul>
      <li>Pré-renal (FeNa &lt; 1%) · renal (NTA, glomerulonefrite) · pós-renal (obstrução)</li>
      <li>USG vias urinárias se suspeita obstrução</li>
    </ul>`,

  'funcao-hepatica': `
    <h4>Padrão hepatocelular (TGO/TGP ↑↑)</h4>
    <ul>
      <li>Viral · tóxico (paracetamol) · isquemia · autoimune</li>
      <li>Razão AST/ALT &gt; 2 sugere álcool</li>
    </ul>
    <h4>Padrão colestático (FA/GGT ↑)</h4>
    <ul>
      <li>Obstrução biliar · colangite · medicamentos</li>
    </ul>
    <h4>Função sintética</h4>
    <ul>
      <li>INR ↑ · albumina ↓ · plaquetopenia (hipertensão portal)</li>
      <li>Child-Pugh / MELD para prognóstico</li>
    </ul>`,

  troponina: `
    <h4>Interpretação hs-cTn</h4>
    <ul>
      <li>Elevação + clínica/ECG compatível → SCA até prova em contrário</li>
      <li>Algoritmo 0 h/1 h ou 0 h/3 h conforme protocolo local</li>
      <li>Causas não isquêmicas: TEP, miocardite, sepse, IC, rabdomiólise, IRC</li>
    </ul>
    <p class="emerg-note">Curva seriada &gt; valor único isolado.</p>`,

  'd-dimero': `
    <h4>Uso principal</h4>
    <ul>
      <li><strong>Exclusão</strong> de TEP/TVP em baixa/intermediária probabilidade (Wells/PERC)</li>
      <li>VPP baixo — não confirma trombose</li>
    </ul>
    <h4>Falso positivo</h4>
    <ul>
      <li>Gravidez · pós-operatório · câncer · idade &gt; 65 · infecção · gestação</li>
    </ul>`,

  lactato: `
    <h4>Valores</h4>
    <ul>
      <li>&gt; 2 mmol/L — disfunção tecidual / hipoperfusão</li>
      <li>&gt; 4 mmol/L — sepse grave / choque (qSOFA complementar)</li>
    </ul>
    <h4>Clearance</h4>
    <ul>
      <li>Queda ≥ 10% ou normalização em 2–6 h após ressuscitação — boa prognóstico</li>
      <li>Causas: hipoperfusão, metformina, convulsão, linhas de diálise</li>
    </ul>`,

  'glicemia-hba1c': `
    <h4>Glicemia de jejum</h4>
    <ul>
      <li>&lt; 100 normal · 100–125 pré-DM · ≥ 126 DM (2 dosagens ou + sintomas)</li>
    </ul>
    <h4>HbA1c</h4>
    <ul>
      <li>&lt; 5,7% normal · 5,7–6,4% pré-DM · ≥ 6,5% DM</li>
      <li>Não usar na gestação · cautela em anemia/hemoglobinopatias</li>
    </ul>
    <h4>Plantão</h4>
    <ul>
      <li>Hipoglicemia &lt; 70 mg/dL — tratar; &lt; 54 mg/dL grave</li>
      <li>Hiperglicemia &gt; 250–300 + cetose/cetonúria → investigar CAD</li>
    </ul>`,

  'tsh-t4': `
    <h4>Padrões</h4>
    <ul>
      <li>TSH ↑ + T4 ↓ — hipotireoidismo primário</li>
      <li>TSH ↓ + T4 ↑ — hipertireoidismo primário</li>
      <li>TSH ↓ + T4 normal — subclínico ou doença não tireoidiana</li>
      <li>TSH ↑ + T4 normal — hipotireoidismo subclínico</li>
    </ul>
    <p class="emerg-note">Doença aguda pode alterar TSH/T4 (“eutireoid doente”).</p>`,

  'urina-rotina': `
    <h4>ITU</h4>
    <ul>
      <li>Leucocitúria + nitrito + esterase leucocitária → alta especificidade</li>
      <li>Urocultura confirma e guia ATB</li>
    </ul>
    <h4>Outros</h4>
    <ul>
      <li>Proteinúria — DRC, glomerulonefrite (relacionar A/C)</li>
      <li>Hematúria — calculose, ITU, neoplasia, glomerular vs não glomerular</li>
      <li>Cetonúria — jejum, CAD</li>
    </ul>`,

  'pcr-pct': `
    <h4>PCR</h4>
    <ul>
      <li>Marcador inespecífico de inflamação — infecção, autoimune, pós-op</li>
      <li>Útil para tendência, não diagnóstico isolado</li>
    </ul>
    <h4>Procalcitonina</h4>
    <ul>
      <li>↑ em infecção bacteriana sistêmica; útil para iniciar/parar ATB (sepse, pneumonia)</li>
      <li>Normal não exclui infecção localizada</li>
    </ul>`,

  'rx-torax': `
    <h4>Consolidação</h4>
    <ul>
      <li>Pneumonia bacteriana · aspiração · edema cardiogênico (batimento de asa)</li>
    </ul>
    <h4>Intersticial / linhas B (USG)</h4>
    <ul>
      <li>Edema pulmonar · pneumonite viral · fibrose</li>
    </ul>
    <h4>Derrame pleural</h4>
    <ul>
      <li>Menisco · decúbito — investigar exsudato/transudato (Light)</li>
    </ul>
    <h4>Pneumotórax</h4>
    <ul>
      <li>Linha pleural + ausência de trama — urgência se hipertensivo</li>
    </ul>`,

  'ecg-basico': `
    <ol class="emerg-steps">
      <li><strong>Ritmo</strong> — sinusal? FA? taqui/bradicardia?</li>
      <li><strong>FC</strong> e <strong>intervalos</strong> — PR, QRS, QTc (corrigido)</li>
      <li><strong>Eixo</strong> — desvio?</li>
      <li><strong>Supra/ST</strong> — SCA, pericardite, repolarização precoce</li>
      <li><strong>Infra ST</strong> — isquemia subendocárdica</li>
      <li><strong>Onda Q</strong> patológica — IAM antigo</li>
      <li><strong>Hipertrofia</strong> — VE (Sokolow-Lyon, Cornell)</li>
      <li><strong>Compare</strong> com ECG prévio</li>
    </ol>`,

  bnp: `
    <h4>Interpretação</h4>
    <ul>
      <li>Elevado — congestão/IC (suporte, não substitui clínica/eco)</li>
      <li>BNP &lt; 100 ou NT-proBNP &lt; 300 pg/mL — IC aguda improvável (contexto ED)</li>
    </ul>
    <h4>Limitações</h4>
    <ul>
      <li>Obesidade (falsamente baixo) · DRC · idade avançada · TEP · FA</li>
    </ul>`,

  'calcio-magnesio': `
    <h4>Hipocalcemia</h4>
    <ul>
      <li>Sintomas: parestesias, tetania, prolongamento QT</li>
      <li>Causas: hipoparatireoidismo, DRC, pancreatite, hipomagnesemia</li>
      <li>Corrigir Mg antes de reposição de Ca refratária</li>
    </ul>
    <h4>Hipomagnesemia</h4>
    <ul>
      <li>Diuréticos · álcool · diarreia · PPI crônico</li>
      <li>Associa-se a hipocalemia e hipocalcemia refratárias</li>
    </ul>
    <h4>Hipercalcemia</h4>
    <ul>
      <li>Hiperparatireoidismo · malignidade · intoxicação vitamina D</li>
      <li>Hidratação EV + calcitonina/bifosfonato se sintomática</li>
    </ul>`,

  coagulograma: `
    <h4>TAP/INR prolongado</h4>
    <ul>
      <li>Anticoagulantes · hepatopatia · deficiência vitamina K · CIVD</li>
      <li>INR terapêutico AVK: meta usual 2–3 (válvula mecânica: 2,5–3,5)</li>
    </ul>
    <h4>CIVD</h4>
    <ul>
      <li>TAP ↑ + plaquetopenia + fibrinogênio ↓ + D-dímero ↑</li>
      <li>Sepse, trauma, obstetrícia, leucemia — tratar causa base</li>
    </ul>
    <h4>TTPa</h4>
    <ul>
      <li>Heparina · fator deficiente · anticoagulante lúpico</li>
    </ul>`,

  'amilase-lipase': `
    <h4>Pancreatite aguda</h4>
    <ul>
      <li>Lipase &gt; 3× LSN mais específica que amilase</li>
      <li>Correlacionar com clínica + imagem (USG/TC) — valor isolado não fecha diagnóstico</li>
    </ul>
    <h4>Outras causas de elevação</h4>
    <ul>
      <li>Insuficiência renal · salpingite · macroamilase · perfuração intestinal</li>
    </ul>
    <h4>Gravidade</h4>
    <ul>
      <li>Usar escores (BISAP, Ranson) + lactato, creatinina, Ca, hematócrito</li>
    </ul>`,

  'beta-hcg': `
    <h4>Interpretação</h4>
    <ul>
      <li>Positivo — gestação intrauterina, ectópica, molár ou pós-parto recente</li>
      <li><strong>Curva seriada</strong> — ectópica: subida lenta (&lt; 53% em 48 h) ou queda anômala</li>
    </ul>
    <h4>Plantão</h4>
    <ul>
      <li>USG transvaginal se β-hCG acima do limiar de discriminação (~1500–2000 mUI/mL) e dor/sangramento</li>
      <li>Negativo não exclui ectópica muito precoce — repetir em 48 h</li>
    </ul>`,

  'acidose-gap': `
    <h4>Anion gap</h4>
    <ul>
      <li>AG = Na − (Cl + HCO₃) — normal ~ 8–12 mEq/L</li>
      <li>AG ↑: MUDPILES + cetoacidose, lactato, renal avançada</li>
    </ul>
    <h4>Delta-delta</h4>
    <ul>
      <li>ΔAG/ΔHCO₃ ≈ 1 — acidose pura com gap</li>
      <li>Δ &lt; 1 — acidose mista (gap + hiperclorêmica)</li>
      <li>Δ &gt; 1 — alcalose metabólica concomitante</li>
    </ul>
    <h4>Compensação respiratória (Winter)</h4>
    <p>pCO₂ esperado ≈ 1,5 × HCO₃ + 8 (± 2)</p>`,

  'toxicologia-serica': `
    <h4>Paracetamol</h4>
    <ul>
      <li>Dosagem ≥ 4 h pós-ingestão · nomograma Rumack-Matthew</li>
      <li>N-acetilcisteína se acima da linha de tratamento ou ingestão &gt; 150 mg/kg</li>
    </ul>
    <h4>Salicilato</h4>
    <ul>
      <li>Nível sérico + gasometria (alcalose respiratória + acidose metabólica)</li>
      <li>Alcalinização urinária se moderado/grave</li>
    </ul>
    <h4>Etanol / tóxicos voláteis</h4>
    <ul>
      <li>Osmolaridade gap ↑ sugere metanol/etilenoglicol — tratar empiricamente se suspeita alta</li>
    </ul>`,

  'hemocultura-urina': `
    <h4>Hemocultura positiva</h4>
    <ul>
      <li>Contaminante vs verdadeira bacteremia: múltiplos frascos, mesmo germe, patógeno típico</li>
      <li>Coagulase negativo em 1 frasco — frequentemente contaminante cutâneo</li>
    </ul>
    <h4>Urocultura</h4>
    <ul>
      <li>≥ 10⁵ UFC/mL (micção espontânea) — ITU bacteriana</li>
      <li>Contagem intermediária: correlacionar com sintomas e piúria</li>
    </ul>
    <p class="emerg-note">Antibiograma guia ATB dirigido — não atrasar empírico em sepse.</p>`,

  osmolaridade: `
    <h4>Osmolaridade calculada</h4>
    <ul>
      <li>2×Na + glicose/18 + ureia/6 (mg/dL)</li>
      <li>Gap osmolar &gt; 10: etanol, metanol, manitol, sorbitol</li>
    </ul>
    <h4>Tonicidade efetiva</h4>
    <ul>
      <li>2×Na + glicose/18 — ureia não contribui (penetra célula)</li>
      <li>Hiponatremia hipotônica vs hipertônica (hiperglicemia)</li>
    </ul>
    <h4>Hiperosmolar</h4>
    <ul>
      <li>Estado hiperglicêmico hiperosmolar · diabetes insipidus · desidratação grave</li>
    </ul>`,

  'pediatria-electrolitos': `
    <h4>Desidratação</h4>
    <ul>
      <li>Clínica &gt; laboratório isolado — peso pré-doença se possível</li>
      <li>Na sérico: hiponatremia, isonatremia ou hipernatremia — reidratação conforme tipo</li>
    </ul>
    <h4>Hipocalemia / hiponatremia pediátrica</h4>
    <ul>
      <li>Gastroenterite + baixa ingesta — corrigir lentamente (risco edema cerebral)</li>
      <li>Reposição K VO/EV conforme gravidade e ECG</li>
    </ul>
    <p class="emerg-note">RN: estreita janela — consultar protocolo neonatal institucional.</p>`,

  'tc-cranio-basico': `
    <h4>Hemorragia</h4>
    <ul>
      <li>Subdural (crescente) · epidural (lente biconvexa) · subaracnóidea · intraparenquimatosa</li>
    </ul>
    <h4>Isquemia / edema</h4>
    <ul>
      <li>Hipodensidade precoce · perda diferenciação córtico-subcortical · efeito de massa</li>
    </ul>
    <h4>Urgências radiológicas</h4>
    <ul>
      <li>Desvio de linha média · herniação · hidrocefalia aguda · pneumoencéfalo</li>
    </ul>
    <p class="emerg-note">Correlacionar sempre com clínica — TC normal não exclui HSA muito precoce.</p>`,

  'ferritina-inflamacao': `
    <h4>Ferritina baixa</h4>
    <ul>
      <li>Anemia ferropriva (&lt; 30 ng/mL adulto) — investigar sangramento GI em homens/pós-menopausa</li>
    </ul>
    <h4>Ferritina alta</h4>
    <ul>
      <li>Inflamação/infecção (reactante de fase aguda) — interpretar com PCR</li>
      <li>Hemocromatose · síndrome inflamatória multissistêmica</li>
    </ul>
    <h4>Anemia de doença crônica</h4>
    <ul>
      <li>Ferritina normal/alta + saturação transferrina baixa + PCR ↑</li>
    </ul>`,

  'curva-glicemica': `
    <h4>Hipoglicemia (&lt; 70 mg/dL)</h4>
    <ul>
      <li>Tríade Whipple: sintomas + glicemia baixa + alívio com glicose</li>
      <li>Causas: insulina/sulfonilureia · insuficiência hepática · sepsis · tumor secretor</li>
    </ul>
    <h4>Investigação (jejum prolongado)</h4>
    <ul>
      <li>Glicemia + insulina + peptídeo C + sulfonilureia sérica durante hipoglicemia</li>
      <li>Insulina ↑ + peptídeo C ↓ → exógena · ambos ↑ → endógena</li>
    </ul>
    <h4>Plantão</h4>
    <ul>
      <li>Tratar primeiro: glicose EV/VO · glucagon IM se via oral impossível</li>
    </ul>`
};

INTERP_TOPICS.forEach(t => {
  t.html = INTERP_CONTENT[t.id] || '<p class="coming-soon">Conteúdo em construção.</p>';
  t.searchText = (t.name + ' ' + (t.tags || '')).toLowerCase();
});
