/* Calculadoras — Avaliação geral & estratificação de risco */

function num (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function chk (form, name) {
  return !!form[name]?.checked;
}

function mortalityLogit (logit) {
  const p = Math.exp(logit) / (1 + Math.exp(logit));
  return (p * 100).toFixed(1);
}

function charlsonMortality10y (score) {
  const table = [
    [0, 99], [1, 96], [2, 90], [3, 77], [4, 53], [5, 21]
  ];
  if (score >= 6) return 2;
  return table.find(([s]) => s === score)?.[1] ?? 2;
}

const CALC_RISCO = {
  charlson: {
    title: 'Índice de Comorbidade de Charlson',
    wide: true,
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" max="120" required>
      <fieldset class="calc-fieldset">
        <legend>Comorbidades (1 ponto)</legend>
        <label class="calc-check"><input type="checkbox" name="c_mi"> Infarto do miocárdio</label>
        <label class="calc-check"><input type="checkbox" name="c_ic"> Insuficiência cardíaca</label>
        <label class="calc-check"><input type="checkbox" name="c_vasc"> Doença vascular periférica</label>
        <label class="calc-check"><input type="checkbox" name="c_cvd"> Doença cerebrovascular</label>
        <label class="calc-check"><input type="checkbox" name="c_dem"> Demência</label>
        <label class="calc-check"><input type="checkbox" name="c_pulm"> Doença pulmonar crônica</label>
        <label class="calc-check"><input type="checkbox" name="c_ct"> Doença do tecido conjuntivo</label>
        <label class="calc-check"><input type="checkbox" name="c_pud"> Doença ulcerosa péptica</label>
        <label class="calc-check"><input type="checkbox" name="c_dm"> Diabetes sem complicações</label>
        <label class="calc-check"><input type="checkbox" name="c_hemi"> Hemiplegia</label>
        <label class="calc-check"><input type="checkbox" name="c_renal"> Doença renal moderada/grave</label>
        <label class="calc-check"><input type="checkbox" name="c_tumor"> Tumor sólido (sem metástase)</label>
        <label class="calc-check"><input type="checkbox" name="c_leu"> Leucemia</label>
        <label class="calc-check"><input type="checkbox" name="c_linf"> Linfoma</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Comorbidades (2–6 pontos)</legend>
        <label class="calc-check"><input type="checkbox" name="c_dmc"> Diabetes com lesão de órgão-alvo</label>
        <label class="calc-check"><input type="checkbox" name="c_hep_l"> Doença hepática moderada/grave (2 pts)</label>
        <label class="calc-check"><input type="checkbox" name="c_meta"> Tumor sólido metastático (6 pts)</label>
        <label class="calc-check"><input type="checkbox" name="c_aids"> AIDS (6 pts)</label>
      </fieldset>
    `,
    calculate (form) {
      const idade = num(form, 'idade');
      if (!idade || idade < 18) return alert('Informe a idade.');

      let score = 0;
      ['c_mi', 'c_ic', 'c_vasc', 'c_cvd', 'c_dem', 'c_pulm', 'c_ct', 'c_pud', 'c_dm', 'c_hemi', 'c_renal', 'c_tumor', 'c_leu', 'c_linf'].forEach(k => {
        if (chk(form, k)) score += 1;
      });
      if (chk(form, 'c_dmc') || chk(form, 'c_hep_l')) score += 2;
      if (chk(form, 'c_meta')) score += 6;
      if (chk(form, 'c_aids')) score += 6;

      if (idade >= 50 && idade <= 59) score += 1;
      else if (idade <= 69) score += 2;
      else if (idade <= 79) score += 3;
      else if (idade >= 80) score += 4;

      const surv = charlsonMortality10y(score);
      const mort = (100 - surv).toFixed(0);

      return `<p><strong>Charlson (idade + comorbidades):</strong> ${score} pontos</p>
              <p><strong>Sobrevida estimada em 10 anos:</strong> ${surv}%</p>
              <p><strong>Mortalidade estimada em 10 anos:</strong> ~${mort}%</p>
              <p class="calc-note">Baseado em Charlson et al., 1987 (índice original com ajuste etário).</p>`;
    }
  },

  news2: {
    title: 'NEWS2 (National Early Warning Score 2)',
    wide: true,
    html: `
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" min="0" required>
      <label>Escala SpO₂</label>
      <select name="spo2_scale" required>
        <option value="1">Escala 1 (padrão)</option>
        <option value="2">Escala 2 (insuf. resp. hipercápnica)</option>
      </select>
      <label>Saturação O₂ (%)</label>
      <input name="spo2" type="number" min="0" max="100" required>
      <label>Oxigênio suplementar?</label>
      <select name="o2" required>
        <option value="0">Ar ambiente</option>
        <option value="2">Oxigênio suplementar</option>
      </select>
      <label>Temperatura (°C)</label>
      <input name="temp" type="number" step="0.1" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" min="0" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" min="0" required>
      <label>Consciência (AVPU)</label>
      <select name="avpu" required>
        <option value="0">Alerta</option>
        <option value="3">Voz, Dor ou Não responde</option>
      </select>
    `,
    calculate (form) {
      const fr = num(form, 'fr');
      const spo2 = num(form, 'spo2');
      const temp = num(form, 'temp');
      const pas = num(form, 'pas');
      const fc = num(form, 'fc');
      const scale = form.spo2_scale.value;
      const o2 = parseInt(form.o2.value, 10);
      const avpu = parseInt(form.avpu.value, 10);

      let s = 0;

      if (fr <= 8) s += 3;
      else if (fr <= 11) s += 1;
      else if (fr <= 20) s += 0;
      else if (fr <= 24) s += 2;
      else s += 3;

      if (scale === '1') {
        if (spo2 <= 91) s += 3;
        else if (spo2 <= 93) s += 2;
        else if (spo2 <= 95) s += 1;
      } else {
        if (spo2 <= 83) s += 3;
        else if (spo2 <= 85) s += 2;
        else if (spo2 <= 87) s += 1;
        else if (spo2 <= 92) s += 0;
        else if (spo2 <= 94) s += 1;
        else if (spo2 <= 96) s += 2;
        else s += 3;
      }

      s += o2;

      if (temp <= 35) s += 3;
      else if (temp <= 36) s += 1;
      else if (temp <= 38) s += 0;
      else if (temp <= 39) s += 1;
      else s += 2;

      if (pas <= 90) s += 3;
      else if (pas <= 100) s += 2;
      else if (pas <= 110) s += 1;
      else if (pas <= 219) s += 0;
      else s += 3;

      if (fc <= 40) s += 3;
      else if (fc <= 50) s += 1;
      else if (fc <= 90) s += 0;
      else if (fc <= 110) s += 1;
      else if (fc <= 130) s += 2;
      else s += 3;

      s += avpu;

      let risk = 'Baixo — monitorização de rotina';
      if (s >= 7) risk = 'Alto — resposta urgente, avaliação imediata';
      else if (s >= 5) risk = 'Médio — revisão clínica urgente';
      else if (s === 4) risk = 'Baixo a moderado — vigilância estreita';

      return `<p><strong>NEWS2:</strong> ${s} pontos</p>
              <p><strong>Risco de deterioração:</strong> ${risk}</p>
              <p class="calc-note">Royal College of Physicians, NEWS2 (2017).</p>`;
    }
  },

  qsofa: {
    title: 'qSOFA (quick SOFA)',
    html: `
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required placeholder="≤100 = 1 ponto">
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" required placeholder="≥22 = 1 ponto">
      <label>Glasgow (GCS)</label>
      <input name="gcs" type="number" min="3" max="15" required placeholder="&lt;15 = 1 ponto">
    `,
    calculate (form) {
      const pas = num(form, 'pas');
      const fr = num(form, 'fr');
      const gcs = num(form, 'gcs');
      let score = 0;
      if (pas <= 100) score++;
      if (fr >= 22) score++;
      if (gcs < 15) score++;

      const interp = score >= 2
        ? 'Positivo (≥2) — alto risco de desfecho desfavorável / investigar disfunção orgânica'
        : score === 1
          ? 'Intermediário — vigilância clínica'
          : 'Negativo (0–1) — menor probabilidade de sepse grave';

      return `<p><strong>qSOFA:</strong> ${score}/3</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Sepsis-3 (Singer et al., JAMA 2016). Não substitui SOFA completo.</p>`;
    }
  },

  sofa: {
    title: 'SOFA completo (Sequential Organ Failure Assessment)',
    wide: true,
    html: `
      <label>PaO₂ (mmHg)</label>
      <input name="pao2" type="number" min="0" required>
      <label>FiO₂ (0–1, ex.: 0.21 ar ambiente)</label>
      <input name="fio2" type="number" step="0.01" min="0.21" max="1" value="0.21" required>
      <label>Ventilação mecânica?</label>
      <select name="vent" required>
        <option value="0">Não</option>
        <option value="1">Sim</option>
      </select>
      <label>Plaquetas (×10³/µL)</label>
      <input name="plt" type="number" min="0" required>
      <label>Bilirrubina (mg/dL)</label>
      <input name="bili" type="number" step="0.1" min="0" required>
      <label>PAM (mmHg)</label>
      <input name="pam" type="number" min="0" required>
      <label>Drogas vasoativas</label>
      <select name="vaso" required>
        <option value="0">Nenhuma (PAM ≥70)</option>
        <option value="1">PAM &lt;70 sem vasopressor</option>
        <option value="2">Dopamina ≤5 ou dobutamina (qualquer dose)</option>
        <option value="3">Dopamina &gt;5, adrenalina ≤0.1 ou noradrenalina ≤0.1</option>
        <option value="4">Dopamina &gt;15, adrenalina &gt;0.1 ou noradrenalina &gt;0.1</option>
      </select>
      <label>Glasgow (GCS)</label>
      <input name="gcs" type="number" min="3" max="15" required>
      <label>Creatinina (mg/dL)</label>
      <input name="cr" type="number" step="0.01" min="0" required>
      <label>Diálise nas últimas 24h?</label>
      <select name="dialise" required>
        <option value="0">Não</option>
        <option value="1">Sim</option>
      </select>
    `,
    calculate (form) {
      const pao2 = num(form, 'pao2');
      const fio2 = num(form, 'fio2');
      const vent = form.vent.value === '1';
      const pf = pao2 / fio2;

      let resp = 0;
      if (pf >= 400) resp = 0;
      else if (pf >= 300) resp = 1;
      else if (pf >= 200) resp = 2;
      else if (pf >= 100) resp = vent ? 3 : 2;
      else resp = vent ? 4 : 3;

      const plt = num(form, 'plt');
      let coag = 0;
      if (plt >= 150) coag = 0;
      else if (plt >= 100) coag = 1;
      else if (plt >= 50) coag = 2;
      else if (plt >= 20) coag = 3;
      else coag = 4;

      const bili = num(form, 'bili');
      let hep = 0;
      if (bili < 1.2) hep = 0;
      else if (bili < 2) hep = 1;
      else if (bili < 6) hep = 2;
      else if (bili < 12) hep = 3;
      else hep = 4;

      const cardio = parseInt(form.vaso.value, 10);

      const gcs = num(form, 'gcs');
      let cns = 0;
      if (gcs === 15) cns = 0;
      else if (gcs >= 13) cns = 1;
      else if (gcs >= 10) cns = 2;
      else if (gcs >= 6) cns = 3;
      else cns = 4;

      const cr = num(form, 'cr');
      const dialise = form.dialise.value === '1';
      let renal = 0;
      if (dialise) renal = 4;
      else if (cr < 1.2) renal = 0;
      else if (cr < 2) renal = 1;
      else if (cr < 3.5) renal = 2;
      else if (cr < 5) renal = 3;
      else renal = 4;

      const total = resp + coag + hep + cardio + cns + renal;
      const sepsis = total >= 2
        ? 'SOFA ≥2 — compatível com disfunção orgânica associada à infecção (critério Sepsis-3 com infecção suspeita/confirmada)'
        : 'SOFA &lt;2 — disfunção orgânica leve ou ausente';

      return `<p><strong>SOFA total:</strong> ${total}/24</p>
              <p>Respiração: ${resp} | Coagulação: ${coag} | Fígado: ${hep} | Cardiovascular: ${cardio} | SNC: ${cns} | Renal: ${renal}</p>
              <p><strong>Interpretação:</strong> ${sepsis}</p>
              <p class="calc-note">Vincent et al. / Sepsis-3. ΔSOFA ≥2 em contexto infeccioso define sepse.</p>`;
    }
  },

  'apache2': {
    title: 'APACHE II',
    wide: true,
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="0" required>
      <label>Tipo de admissão / saúde crônica</label>
      <select name="cronica" required>
        <option value="0">Sem insuf. orgânica crônica grave</option>
        <option value="2">Cirurgia eletiva + insuf. crônica</option>
        <option value="5">Não cirúrgico ou urgência + insuf. crônica</option>
      </select>
      <label>Temperatura rectal (°C) — pior valor 24h</label>
      <input name="temp" type="number" step="0.1" required>
      <label>PAM (mmHg)</label>
      <input name="pam" type="number" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" required>
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" required>
      <label>FiO₂ (0–1)</label>
      <input name="fio2" type="number" step="0.01" min="0.21" max="1" value="0.21" required>
      <label>PaO₂ (mmHg) — se FiO₂ ≥0,5 informe também PaCO₂</label>
      <input name="pao2" type="number" min="0" required>
      <label>PaCO₂ (mmHg) — necessário se FiO₂ ≥0,5</label>
      <input name="paco2" type="number" min="0" placeholder="Opcional se FiO₂ &lt;0,5">
      <label>pH arterial</label>
      <input name="ph" type="number" step="0.01" min="6.5" max="8" required>
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" required>
      <label>Potássio (mEq/L)</label>
      <input name="k" type="number" step="0.1" required>
      <label>Creatinina (mg/dL)</label>
      <input name="cr" type="number" step="0.01" min="0" required>
      <label><input type="checkbox" name="ira"> Insuficiência renal aguda (dobra pontuação creatinina)</label>
      <label>Hematócrito (%)</label>
      <input name="ht" type="number" step="0.1" required>
      <label>Leucócitos (×10³/µL)</label>
      <input name="wbc" type="number" step="0.1" required>
      <label>Glasgow (GCS) — pior valor 24h</label>
      <input name="gcs" type="number" min="3" max="15" required>
    `,
    calculate (form) {
      const idade = num(form, 'idade');
      let agePts = 0;
      if (idade >= 75) agePts = 5;
      else if (idade >= 65) agePts = 4;
      else if (idade >= 55) agePts = 3;
      else if (idade >= 45) agePts = 2;

      const cronica = parseInt(form.cronica.value, 10);
      const temp = num(form, 'temp');
      const pam = num(form, 'pam');
      const fc = num(form, 'fc');
      const fr = num(form, 'fr');
      const fio2 = num(form, 'fio2');
      const pao2 = num(form, 'pao2');
      const paco2 = num(form, 'paco2');
      const ph = num(form, 'ph');
      const na = num(form, 'na');
      const k = num(form, 'k');
      let cr = num(form, 'cr');
      const ira = chk(form, 'ira');
      const ht = num(form, 'ht');
      const wbc = num(form, 'wbc');
      const gcs = num(form, 'gcs');

      let tempPts = 0;
      if (temp >= 41) tempPts = 4;
      else if (temp >= 39) tempPts = 3;
      else if (temp >= 38.5) tempPts = 1;
      else if (temp >= 36) tempPts = 0;
      else if (temp >= 34) tempPts = 1;
      else if (temp >= 32) tempPts = 2;
      else if (temp >= 30) tempPts = 3;
      else tempPts = 4;

      let pamPts = 0;
      if (pam >= 160) pamPts = 4;
      else if (pam >= 130) pamPts = 2;
      else if (pam >= 110) pamPts = 0;
      else if (pam >= 70) pamPts = 0;
      else if (pam >= 50) pamPts = 2;
      else pamPts = 4;

      let fcPts = 0;
      if (fc >= 180) fcPts = 4;
      else if (fc >= 140) fcPts = 3;
      else if (fc >= 110) fcPts = 2;
      else if (fc >= 70) fcPts = 0;
      else if (fc >= 55) fcPts = 0;
      else if (fc >= 40) fcPts = 2;
      else fcPts = 4;

      let frPts = 0;
      if (fr >= 50) frPts = 4;
      else if (fr >= 35) frPts = 3;
      else if (fr >= 25) frPts = 1;
      else if (fr >= 12) frPts = 0;
      else if (fr >= 10) frPts = 1;
      else if (fr >= 6) frPts = 2;
      else frPts = 4;

      let oxyPts = 0;
      if (fio2 < 0.5) {
        if (pao2 < 55) oxyPts = 4;
        else if (pao2 < 61) oxyPts = 3;
        else if (pao2 < 71) oxyPts = 1;
      } else {
        const aa = (713 * fio2) - (paco2 / 0.8) - pao2;
        if (aa >= 500) oxyPts = 4;
        else if (aa >= 350) oxyPts = 3;
        else if (aa >= 200) oxyPts = 2;
      }

      let phPts = 0;
      if (ph >= 7.7) phPts = 4;
      else if (ph >= 7.6) phPts = 3;
      else if (ph >= 7.5) phPts = 1;
      else if (ph >= 7.33) phPts = 0;
      else if (ph >= 7.25) phPts = 2;
      else if (ph >= 7.15) phPts = 3;
      else phPts = 4;

      let naPts = 0;
      if (na >= 180) naPts = 4;
      else if (na >= 160) naPts = 3;
      else if (na >= 155) naPts = 2;
      else if (na >= 150) naPts = 1;
      else if (na >= 130) naPts = 0;
      else if (na >= 120) naPts = 2;
      else if (na >= 111) naPts = 3;
      else naPts = 4;

      let kPts = 0;
      if (k >= 7) kPts = 4;
      else if (k >= 6) kPts = 3;
      else if (k >= 5.5) kPts = 1;
      else if (k >= 3.5) kPts = 0;
      else if (k >= 3) kPts = 1;
      else if (k >= 2.5) kPts = 2;
      else kPts = 4;

      let crPts = 0;
      if (cr >= 3.5) crPts = 4;
      else if (cr >= 2) crPts = 3;
      else if (cr >= 1.5) crPts = 2;
      else if (cr >= 0.6) crPts = 0;
      else crPts = 2;
      if (ira) crPts *= 2;

      let htPts = 0;
      if (ht >= 60) htPts = 4;
      else if (ht >= 50) htPts = 2;
      else if (ht >= 46) htPts = 1;
      else if (ht >= 30) htPts = 0;
      else if (ht >= 20) htPts = 2;
      else htPts = 4;

      let wbcPts = 0;
      if (wbc >= 40) wbcPts = 4;
      else if (wbc >= 20) wbcPts = 2;
      else if (wbc >= 15) wbcPts = 1;
      else if (wbc >= 3) wbcPts = 0;
      else if (wbc >= 1) wbcPts = 2;
      else wbcPts = 4;

      const gcsPts = 15 - gcs;
      const phys = tempPts + pamPts + fcPts + frPts + oxyPts + phPts + naPts + kPts + crPts + htPts + wbcPts + gcsPts;
      const total = agePts + cronica + phys;
      const logit = -3.517 + (0.146 * total);
      const mort = mortalityLogit(logit);

      return `<p><strong>APACHE II:</strong> ${total} pontos (fisiológico: ${phys}, idade: ${agePts}, crônico: ${cronica})</p>
              <p><strong>Mortalidade hospitalar estimada:</strong> ${mort}%</p>
              <p class="calc-note">Knaus et al., 1985. Usar piores valores das primeiras 24h de UTI. APACHE IV usa coeficientes atualizados — consulte sistema validado para IV.</p>`;
    }
  },

  saps3: {
    title: 'SAPS III',
    wide: true,
    html: `
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" required>
      <label>Local de admissão</label>
      <select name="local" required>
        <option value="0">Outro / pronto-socorro</option>
        <option value="1">Enfermaria / unidade intermediária</option>
        <option value="2">Outra UTI</option>
      </select>
      <label>Dias de hospitalização antes da UTI</label>
      <input name="dias_antes" type="number" min="0" value="0" required>
      <label>Motivo de admissão</label>
      <select name="motivo" required>
        <option value="0">Médico</option>
        <option value="1">Cirurgia programada</option>
        <option value="2">Cirurgia de urgência</option>
      </select>
      <label>Câncer ativo?</label>
      <select name="cancer" required>
        <option value="0">Não</option>
        <option value="1">Sim</option>
      </select>
      <label>GCS</label>
      <input name="gcs" type="number" min="3" max="15" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" required>
      <label>Temperatura (°C)</label>
      <input name="temp" type="number" step="0.1" required>
      <label>PaO₂/FiO₂ (mmHg) — ou estimativa</label>
      <input name="pf" type="number" min="0" required>
      <label>Ventilação mecânica invasiva?</label>
      <select name="vm" required>
        <option value="0">Não</option>
        <option value="1">Sim</option>
      </select>
      <label>Bilirrubina (mg/dL)</label>
      <input name="bili" type="number" step="0.1" min="0" required>
      <label>Creatinina (mg/dL)</label>
      <input name="cr" type="number" step="0.01" min="0" required>
      <label>Leucócitos (×10³/µL)</label>
      <input name="wbc" type="number" step="0.1" required>
      <label>Plaquetas (×10³/µL)</label>
      <input name="plt" type="number" min="0" required>
      <label>Bicarbonato (mEq/L)</label>
      <input name="hco3" type="number" step="0.1" required>
    `,
    calculate (form) {
      const idade = num(form, 'idade');
      let logit = -32.6659;

      if (idade < 40) logit += 0;
      else if (idade < 50) logit += 0.589;
      else if (idade < 60) logit += 1.029;
      else if (idade < 70) logit += 1.429;
      else if (idade < 80) logit += 1.948;
      else logit += 2.245;

      const local = parseInt(form.local.value, 10);
      if (local === 1) logit += 0.997;
      else if (local === 2) logit += 1.669;

      const dias = num(form, 'dias_antes');
      if (dias >= 14) logit += 1.799;
      else if (dias >= 7) logit += 1.092;
      else if (dias >= 1) logit += 0.593;

      const motivo = parseInt(form.motivo.value, 10);
      if (motivo === 1) logit += 0.564;
      else if (motivo === 2) logit += 1.064;

      if (form.cancer.value === '1') logit += 1.798;

      const gcs = num(form, 'gcs');
      if (gcs < 6) logit += 2.081;
      else if (gcs < 9) logit += 1.798;
      else if (gcs < 11) logit += 1.279;
      else if (gcs < 14) logit += 0.723;
      else logit += 0;

      const pas = num(form, 'pas');
      if (pas < 70) logit += 1.386;
      else if (pas < 120) logit += 0.498;
      else if (pas >= 200) logit += 0.693;

      const fc = num(form, 'fc');
      if (fc >= 160) logit += 1.032;
      else if (fc >= 120) logit += 0.456;
      else if (fc < 40) logit += 0.891;

      const temp = num(form, 'temp');
      if (temp >= 39) logit += 0.927;
      else if (temp < 36) logit += 0.589;

      const pf = num(form, 'pf');
      if (pf < 100) logit += 1.798;
      else if (pf < 200) logit += 0.973;
      else if (pf < 300) logit += 0.456;

      if (form.vm.value === '1') logit += 1.292;

      const bili = num(form, 'bili');
      if (bili >= 6) logit += 1.798;
      else if (bili >= 2) logit += 0.724;

      const cr = num(form, 'cr');
      if (cr >= 3.5) logit += 1.798;
      else if (cr >= 1.5) logit += 0.724;

      const wbc = num(form, 'wbc');
      if (wbc >= 20) logit += 0.891;
      else if (wbc < 3) logit += 0.724;

      const plt = num(form, 'plt');
      if (plt < 50) logit += 1.192;
      else if (plt < 100) logit += 0.593;

      const hco3 = num(form, 'hco3');
      if (hco3 < 15) logit += 1.298;
      else if (hco3 < 20) logit += 0.593;

      const mort = mortalityLogit(logit);
      const sapsPoints = Math.round(logit + 32.6659);

      return `<p><strong>SAPS III (logit):</strong> ${logit.toFixed(2)}</p>
              <p><strong>Mortalidade hospitalar estimada:</strong> ${mort}%</p>
              <p><strong>Score aproximado:</strong> ${sapsPoints} (referência simplificada)</p>
              <p class="calc-note">Moreno et al., 2005. Modelo internacional com coeficientes principais. Para máxima precisão, use calculadora oficial com todas as variáveis regionais.</p>`;
    }
  },

  'lactate-clearance': {
    title: 'Lactate Clearance (clearance de lactato)',
    html: `
      <label>Lactato basal (mmol/L)</label>
      <input name="lact0" type="number" step="0.1" min="0.1" required>
      <label>Lactato controle (mmol/L)</label>
      <input name="lact1" type="number" step="0.1" min="0" required>
      <label>Intervalo desde basal (horas)</label>
      <input name="horas" type="number" step="0.5" min="0.5" value="2" required placeholder="Ex.: 2 ou 6">
    `,
    calculate (form) {
      const l0 = num(form, 'lact0');
      const l1 = num(form, 'lact1');
      const horas = num(form, 'horas');

      if (!l0 || l0 <= 0) return alert('Lactato basal inválido.');
      if (l1 < 0 || !horas) return alert('Preencha lactato controle e intervalo.');

      const clearance = ((l0 - l1) / l0) * 100;
      const rate = (l0 - l1) / horas;

      let meta = 'Meta não atingida — reavaliar perfusão e ressuscitação';
      if (horas <= 2 && clearance >= 10) meta = 'Meta 2h atingida (≥10% clearance) — resposta favorável';
      else if (horas <= 6 && clearance >= 20) meta = 'Meta 6h atingida (≥20% clearance) — resposta favorável';
      else if (clearance >= 10) meta = 'Clearance ≥10% — tendência favorável';

      if (l1 >= l0) meta = 'Sem queda ou lactato em ascensão — alto risco, intensificar ressuscitação';

      return `<p><strong>Clearance de lactato:</strong> ${clearance.toFixed(1)}%</p>
              <p><strong>Queda absoluta:</strong> ${(l0 - l1).toFixed(2)} mmol/L em ${horas}h</p>
              <p><strong>Taxa de queda:</strong> ${rate.toFixed(2)} mmol/L/h</p>
              <p><strong>Interpretação:</strong> ${meta}</p>
              <p class="calc-note">Metas usuais: ≥10% em 2h ou ≥20% em 6h após ressuscitação inicial.</p>`;
    }
  }
};
