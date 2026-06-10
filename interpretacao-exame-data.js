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
  { id: 'bnp', name: 'BNP / NT-proBNP', icon: '💓', tags: 'ic dispneia congestao' }
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
    </ul>`
};

INTERP_TOPICS.forEach(t => {
  t.html = INTERP_CONTENT[t.id] || '<p class="coming-soon">Conteúdo em construção.</p>';
  t.searchText = (t.name + ' ' + (t.tags || '')).toLowerCase();
});
