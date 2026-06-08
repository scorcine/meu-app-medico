/* Calculadoras — Pediatria */

function pNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function pChk (form, name) {
  return !!form[name]?.checked;
}

function pSel (form, name) {
  return form[name]?.value ?? '';
}

const WHO_BMI_M = {
  5: 15.2, 6: 15.4, 7: 15.5, 8: 15.7, 9: 16.0, 10: 16.4,
  11: 16.8, 12: 17.2, 13: 17.7, 14: 18.2, 15: 18.8, 16: 19.4,
  17: 20.0, 18: 20.5, 19: 21.0
};

const WHO_BMI_F = {
  5: 15.0, 6: 15.1, 7: 15.2, 8: 15.4, 9: 15.8, 10: 16.3,
  11: 16.9, 12: 17.5, 13: 18.2, 14: 18.9, 15: 19.5, 16: 20.0,
  17: 20.4, 18: 20.6, 19: 20.7
};

function whoMedianBmi (sexo, idadeAnos) {
  const table = sexo === 'M' ? WHO_BMI_M : WHO_BMI_F;
  const lo = Math.floor(idadeAnos);
  const hi = Math.ceil(idadeAnos);
  if (lo < 5) return table[5];
  if (hi > 19) return table[19];
  if (lo === hi) return table[lo];
  const frac = idadeAnos - lo;
  return table[lo] + frac * (table[hi] - table[lo]);
}

function whoSdBmi (median) {
  return median * 0.11;
}

function hollidaySegar (kg) {
  if (kg <= 10) return kg * 100;
  if (kg <= 20) return 1000 + (kg - 10) * 50;
  return 1500 + (kg - 20) * 20;
}

const CALC_PEDIATRIA = {
  silverman: {
    title: 'Silverman-Anderson — angústia respiratória',
    wide: true,
    html: `
      <p class="calc-note">Cada item: 0 = ausente, 1 = leve, 2 = grave.</p>
      <label>Tiragem torácica superior</label>
      <select name="sup" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>Tiragem torácica inferior</label>
      <select name="inf" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>Tiragem xifoidea</label>
      <select name="xifo" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>Batimento de asa de nariz</label>
      <select name="nariz" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label Gemido expiratório</label>
      <select name="gemido" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
    `,
    calculate (form) {
      const total = ['sup', 'inf', 'xifo', 'nariz', 'gemido']
        .reduce((s, k) => s + parseInt(pSel(form, k), 10), 0);

      let interp = total <= 3
        ? 'Leve ou sem angústia (0–3)'
        : total <= 6
          ? 'Angústia moderada (4–6) — monitorização e oxigenoterapia conforme SpO₂'
          : 'Angústia grave (7–10) — considerar CPAP/VNI ou ventilação; UTI neonatal/pediátrica';

      return `<p><strong>Silverman-Anderson:</strong> ${total}/10</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Silverman &amp; Anderson, 1960. RN e lactentes; correlaciona com necessidade de suporte ventilatório.</p>`;
    }
  },

  downes: {
    title: 'Downes — score respiratório (lactentes)',
    wide: true,
    html: `
      <label>Cianose</label>
      <select name="cianose" required>
        <option value="0">Ausente (ou corrigida em ar ambiente)</option>
        <option value="1">Presente em FiO₂ ~30%</option>
        <option value="2">Presente em FiO₂ ~40% ou mais</option>
      </select>
      <label>Tiragem intercostal</label>
      <select name="tiragem" required>
        <option value="0">Ausente</option>
        <option value="1">Leve</option>
        <option value="2">Grave</option>
      </select>
      <label>Gemido</label>
      <select name="gemido" required>
        <option value="0">Ausente</option>
        <option value="1">Audível apenas com estetoscópio</option>
        <option value="2">Audível sem estetoscópio</option>
      </select>
      <label>Entrada de ar</label>
      <select name="ar" required>
        <option value="0">Normal bilateral</option>
        <option value="1">Diminuída</option>
        <option value="2">Muito diminuída ou assimétrica</option>
      </select>
      <label>Frequência respiratória (irpm)</label>
      <select name="fr" required>
        <option value="0">&lt;60</option>
        <option value="1">60–80</option>
        <option value="2">&gt;80</option>
      </select>
    `,
    calculate (form) {
      const total = ['cianose', 'tiragem', 'gemido', 'ar', 'fr']
        .reduce((s, k) => s + parseInt(pSel(form, k), 10), 0);

      let interp = total <= 3
        ? 'Downes 0–3 — desconforto leve'
        : total <= 6
          ? 'Downes 4–6 — desconforto moderado; oxigenoterapia e investigação'
          : 'Downes 7–10 — desconforto grave; considerar surfactante, CPAP ou IOT';

      return `<p><strong>Downes:</strong> ${total}/10</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Downes et al., 1970. Útil em RN/lactentes com desconforto respiratório e SDR.</p>`;
    }
  },

  'parkland-ped': {
    title: 'Parkland pediátrico — queimaduras',
    html: `
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Superfície corporal queimada (%)</label>
      <input name="scq" type="number" step="0.5" min="0.1" max="100" required>
      <label>Horas desde a queimadura</label>
      <input name="horas" type="number" step="0.5" min="0" value="0" required>
    `,
    calculate (form) {
      const peso = pNum(form, 'peso');
      const scq = pNum(form, 'scq');
      const horas = pNum(form, 'horas');
      if (!Number.isFinite(peso) || !Number.isFinite(scq)) return alert('Informe peso e SCQ.');

      const parkland24 = 4 * peso * scq;
      const manut = hollidaySegar(peso);
      const total24Ped = parkland24 + manut;
      const restante8h = Math.max(0, 8 - (horas || 0));
      const vol8h = parkland24 / 2;
      const vol16h = parkland24 / 2;
      const taxa8h = restante8h > 0 ? vol8h / restante8h : 0;
      const taxa16h = vol16h / 16;
      const taxaManut = manut / 24;

      return `<p><strong>Parkland 24 h (coloide cristaloide):</strong> ${parkland24.toFixed(0)} mL</p>
              <p><strong>Manutenção pediátrica (Holliday-Segar):</strong> ${manut.toFixed(0)} mL/24 h</p>
              <p><strong>Volume total sugerido 24 h (resgate + manutenção):</strong> ${total24Ped.toFixed(0)} mL</p>
              <p><strong>1ª metade Parkland:</strong> ${vol8h.toFixed(0)} mL em 8 h (${taxa8h.toFixed(0)} mL/h restantes)</p>
              <p><strong>2ª metade Parkland:</strong> ${vol16h.toFixed(0)} mL em 16 h (${taxa16h.toFixed(0)} mL/h)</p>
              <p><strong>Manutenção:</strong> ~${taxaManut.toFixed(0)} mL/h contínua</p>
              <p class="calc-note">Parkland 4 mL×kg×%SCQ. Em crianças considerar fórmula de Galveston (5000 mL/m² SCQ + 2000 mL/m² manutenção) se &lt;10 anos/grandes queimados. Ajustar pela diurese alvo 1 mL/kg/h.</p>`;
    }
  },

  'pcr-ped': {
    title: 'PCR — adrenalina & amiodarona (por peso)',
    html: `
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Vias disponíveis</label>
      <select name="via" required>
        <option value="iv">IV / IO (adrenalina 1:10.000)</option>
        <option value="et">Intra-traqueal (adrenalina 1:1.000)</option>
      </select>
    `,
    calculate (form) {
      const peso = pNum(form, 'peso');
      if (!Number.isFinite(peso)) return alert('Informe o peso.');

      const via = pSel(form, 'via');
      let epiMg; let epiMl; let epiConc;

      if (via === 'iv') {
        epiMg = 0.01 * peso;
        epiMl = 0.1 * peso;
        epiConc = '1:10.000 (0,1 mg/mL)';
      } else {
        epiMg = 0.1 * peso;
        epiMl = 0.1 * peso;
        epiConc = '1:1.000 (1 mg/mL)';
      }

      const amioMg = 5 * peso;
      const amioDose = Math.min(amioMg, 300);

      return `<p><strong>Adrenalina (${via === 'iv' ? 'IV/IO' : 'ET'}):</strong> ${epiMg.toFixed(2)} mg = ${epiMl.toFixed(1)} mL (${epiConc})</p>
              <p>Repetir a cada 3–5 min na PCR</p>
              <p><strong>Amiodarona (1ª dose):</strong> ${amioDose.toFixed(0)} mg (5 mg/kg; máx. 300 mg)</p>
              <p><strong>Amiodarona (2ª dose):</strong> ${amioDose.toFixed(0)} mg — dose cumulativa máx. 15 mg/kg</p>
              <p class="calc-note">PALS/AHA 2020. Adrenalina IV: 0,01 mg/kg. Amiodarona: 5 mg/kg IV/IO para FV/TVSP refratária. Verificar diluição institucional.</p>`;
    }
  },

  'who-bmi': {
    title: 'Z-score IMC OMS (5–19 anos)',
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" step="0.1" min="5" max="19" required>
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.01" min="0.1" required>
      <label>Altura (cm)</label>
      <input name="altura" type="number" step="0.1" min="50" required>
    `,
    calculate (form) {
      const idade = pNum(form, 'idade');
      const peso = pNum(form, 'peso');
      const altura = pNum(form, 'altura');
      if (![idade, peso, altura].every(Number.isFinite)) return alert('Preencha idade, peso e altura.');

      const bmi = peso / Math.pow(altura / 100, 2);
      const med = whoMedianBmi(pSel(form, 'sexo'), idade);
      const sd = whoSdBmi(med);
      const z = (bmi - med) / sd;

      let classif = '';
      if (z < -3) classif = 'Magreza acentuada (Z &lt; -3)';
      else if (z < -2) classif = 'Magreza (Z &lt; -2)';
      else if (z <= 1) classif = 'Eutrofia (Z -2 a +1)';
      else if (z <= 2) classif = 'Sobrepeso (Z &gt; +1)';
      else if (z <= 3) classif = 'Obesidade (Z &gt; +2)';
      else classif = 'Obesidade severa (Z &gt; +3)';

      return `<p><strong>IMC:</strong> ${bmi.toFixed(2)} kg/m²</p>
              <p><strong>Z-score estimado (OMS):</strong> ${z.toFixed(2)}</p>
              <p><strong>Classificação:</strong> ${classif}</p>
              <p class="calc-note">Referência OMS 2007 (5–19 anos). Z-score preciso: WHO AnthroPlus (LMS por mês). &lt;5 anos usar peso/comprimento OMS.</p>`;
    }
  },

  'rochester-yos': {
    title: 'Rochester & YOS — febre no lactente',
    wide: true,
    html: `
      <fieldset class="calc-fieldset">
        <legend>Regra de Rochester (29–60 dias)</legend>
        <label class="calc-check"><input type="checkbox" name="r1" checked> RN a termo previamente saudável</label>
        <label class="calc-check"><input type="checkbox" name="r2" checked> Sem foco infeccioso ao exame</label>
        <label class="calc-check"><input type="checkbox" name="r3" checked> Leucócitos 5.000–15.000/mm³</label>
        <label class="calc-check"><input type="checkbox" name="r4" checked> Bastonetes ≤1.500/mm³</label>
        <label class="calc-check"><input type="checkbox" name="r5" checked> EAS ≤10 leucócitos/campo e gram negativo</label>
        <label class="calc-check"><input type="checkbox" name="r6" checked> Sem otite, pneumonia ou infecção de pele</label>
      </fieldset>
      <fieldset class="calc-fieldset">
        <legend>Yale Observation Scale (YOS) — 1 / 3 / 5 por item</legend>
        <label>Qualidade do choro</label>
        <select name="y1" required><option value="1">Normal (1)</option><option value="3">Anormal (3)</option><option value="5">Agudo/fraco (5)</option></select>
        <label>Reação à estimulação dos pais</label>
        <select name="y2" required><option value="1">Normal (1)</option><option value="3">Diminuída (3)</option><option value="5">Ausente (5)</option></select>
        <label>Comportamento</label>
        <select name="y3" required><option value="1">Normal (1)</option><option value="3">Irritável (3)</option><option value="5">Letárgico (5)</option></select>
        <label>Cor da pele</label>
        <select name="y4" required><option value="1">Rosa (1)</option><option value="3">Pálido (3)</option><option value="5">Cianótico/marmoreado (5)</option></select>
        <label>Hidratação</label>
        <select name="y5" required><option value="1">Normal (1)</option><option value="3">Reduzida (3)</option><option value="5">Marcada desidratação (5)</option></select>
        <label>Resposta social / sorriso</label>
        <select name="y6" required><option value="1">Normal (1)</option><option value="3">Diminuída (3)</option><option value="5">Ausente (5)</option></select>
      </fieldset>
    `,
    calculate (form) {
      const rochLow = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].every(k => pChk(form, k));
      const yos = ['y1', 'y2', 'y3', 'y4', 'y5', 'y6']
        .reduce((s, k) => s + parseInt(pSel(form, k), 10), 0);

      let rochTxt = rochLow
        ? 'Baixo risco bacteriano (~1%) — observação ambulatorial possível se &lt;60 dias e protocolo local permitir'
        : 'Não atende Rochester — considerar hemocultura, LP e antibiótico empírico conforme idade';

      let yosTxt = yos <= 10
        ? 'YOS ≤10 — baixo risco de doença bacteriana grave na observação'
        : yos <= 15
          ? 'YOS 11–15 — risco intermediário; observação prolongada ou investigação'
          : 'YOS ≥16 — alto risco; internação e investigação completa';

      return `<p><strong>Rochester:</strong> ${rochTxt}</p>
              <p><strong>YOS:</strong> ${yos}/30 — ${yosTxt}</p>
              <p class="calc-note">Rochester et al., 1985 (29–60 dias). YOS: McCarthy et al. Lactentes 3–36 meses com febre sem foco. &lt;28 dias = sempre investigar.</p>`;
    }
  }
};
