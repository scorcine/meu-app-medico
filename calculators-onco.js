/* Calculadoras — Oncologia */

function oNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function oChk (form, name) {
  return !!form[name]?.checked;
}

function oSel (form, name) {
  return form[name]?.value ?? '';
}

const ECOG_KPS = {
  0: { kps: '90–100', desc: 'Totalmente ativo, sem restrição' },
  1: { kps: '70–80', desc: 'Restrito para atividade vigorosa; trabalho leve' },
  2: { kps: '50–60', desc: 'Deambula e autocuidado; incapaz de trabalhar' },
  3: { kps: '30–40', desc: 'Autocuidado limitado; &gt;50% do dia acamado/cadeira' },
  4: { kps: '10–20', desc: 'Completamente dependente; acamado' },
  5: { kps: '0', desc: 'Óbito' }
};

const KPS_ECOG = {
  100: { ecog: 0, desc: 'Normal, sem queixas' },
  90: { ecog: 0, desc: 'Atividade normal; sinais menores' },
  80: { ecog: 1, desc: 'Atividade normal com esforço' },
  70: { ecog: 1, desc: 'Autocuidado; incapaz para atividade normal' },
  60: { ecog: 2, desc: 'Assistência ocasional' },
  50: { ecog: 2, desc: 'Assistência frequente' },
  40: { ecog: 3, desc: 'Incapacitado; cuidados especiais' },
  30: { ecog: 3, desc: 'Gravemente incapacitado' },
  20: { ecog: 4, desc: 'Muito doente; hospitalização necessária' },
  10: { ecog: 4, desc: 'Moribundo' },
  0: { ecog: 5, desc: 'Óbito' }
};

const CALC_ONCO = {
  mascc: {
    title: 'MASCC — Risco de febre neutropênica',
    wide: true,
    html: `
      <label>Carga de doença / sintomas no início da febre</label>
      <select name="carga" required>
        <option value="5">Nenhum ou leve (+5)</option>
        <option value="3">Moderada (+3)</option>
        <option value="0">Grave (+0)</option>
      </select>
      <label class="calc-check"><input type="checkbox" name="pas" checked> Sem hipotensão — PAS ≥90 mmHg (+5)</label>
      <label class="calc-check"><input type="checkbox" name="dpoc" checked> Sem DPOC (+4)</label>
      <label class="calc-check"><input type="checkbox" name="solido" checked> Tumor sólido ou linfoma sem infecção fúngica prévia (+4)</label>
      <label class="calc-check"><input type="checkbox" name="desidrat" checked> Sem desidratação que exija hidratação IV (+3)</label>
      <label class="calc-check"><input type="checkbox" name="ambulatorial" checked> Paciente ambulatorial no início da febre (+3)</label>
    `,
    calculate (form) {
      let score = parseInt(oSel(form, 'carga'), 10);
      if (oChk(form, 'pas')) score += 5;
      if (oChk(form, 'dpoc')) score += 4;
      if (oChk(form, 'solido')) score += 4;
      if (oChk(form, 'desidrat')) score += 3;
      if (oChk(form, 'ambulatorial')) score += 3;

      const baixo = score >= 21;
      const interp = baixo
        ? 'Baixo risco (MASCC ≥21) — candidato a antibiótico oral ambulatorial se critérios locais preenchidos'
        : 'Alto risco (MASCC &lt;21) — internação e antibiótico IV empírico recomendados';

      return `<p><strong>MASCC:</strong> ${score}/26</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Klastersky et al., 2000. Não substituir avaliação clínica; neutropenia grave ou instabilidade = internar independentemente do escore.</p>`;
    }
  },

  'kps-ecog': {
    title: 'Karnofsky (KPS) & ECOG',
    html: `
      <label>Escala de referência</label>
      <select name="escala" required>
        <option value="ecog">Informar ECOG (0–5)</option>
        <option value="kps">Informar Karnofsky (0–100)</option>
      </select>
      <label id="kps-ecog-val-label">ECOG Performance Status</label>
      <select name="valor" required>
        <option value="0">ECOG 0 — totalmente ativo</option>
        <option value="1">ECOG 1 — restrito para esforço vigoroso</option>
        <option value="2">ECOG 2 — deambula; autocuidado; incapaz de trabalhar</option>
        <option value="3">ECOG 3 — autocuidado limitado; &gt;50% acamado</option>
        <option value="4">ECOG 4 — completamente dependente</option>
        <option value="5">ECOG 5 — óbito</option>
      </select>
    `,
    onRender (form) {
      const escala = form.querySelector('[name="escala"]');
      const valor = form.querySelector('[name="valor"]');
      const label = form.querySelector('#kps-ecog-val-label');

      function refreshOptions () {
        const isEcg = escala.value === 'ecog';
        label.textContent = isEcg ? 'ECOG Performance Status' : 'Karnofsky Performance Status (%)';
        if (isEcg) {
          valor.innerHTML = `
            <option value="0">ECOG 0 — totalmente ativo</option>
            <option value="1">ECOG 1 — restrito para esforço vigoroso</option>
            <option value="2">ECOG 2 — deambula; autocuidado</option>
            <option value="3">ECOG 3 — autocuidado limitado</option>
            <option value="4">ECOG 4 — completamente dependente</option>
            <option value="5">ECOG 5 — óbito</option>`;
        } else {
          valor.innerHTML = `
            <option value="100">100 — normal, sem queixas</option>
            <option value="90">90 — atividade normal; sintomas menores</option>
            <option value="80">80 — atividade normal com esforço</option>
            <option value="70">70 — autocuidado; incapaz atividade normal</option>
            <option value="60">60 — assistência ocasional</option>
            <option value="50">50 — assistência considerável</option>
            <option value="40">40 — incapacitado; cuidados especiais</option>
            <option value="30">30 — gravemente incapacitado</option>
            <option value="20">20 — muito doente; hospitalização</option>
            <option value="10">10 — moribundo</option>
            <option value="0">0 — óbito</option>`;
        }
      }

      escala.addEventListener('change', refreshOptions);
      refreshOptions();
    },
    calculate (form) {
      const escala = oSel(form, 'escala');
      const val = parseInt(oSel(form, 'valor'), 10);

      let ecog; let kpsTxt; let desc;

      if (escala === 'ecog') {
        ecog = val;
        const map = ECOG_KPS[ecog] || ECOG_KPS[4];
        kpsTxt = map.kps;
        desc = map.desc;
      } else {
        const map = KPS_ECOG[val] || KPS_ECOG[10];
        ecog = map.ecog;
        kpsTxt = String(val);
        desc = map.desc;
      }

      let progn = ecog <= 1
        ? 'Bom performance status — elegível para maioria dos esquemas oncológicos'
        : ecog === 2
          ? 'Performance intermediário — quimioterapia possível com cautela'
          : ecog === 3
            ? 'Performance ruim — benefício de QT paliativa individualizado'
            : 'Performance muito ruim — cuidados paliativos/suporte em geral';

      return `<p><strong>ECOG:</strong> ${ecog}</p>
              <p><strong>Karnofsky equivalente:</strong> ${kpsTxt}%</p>
              <p><strong>Descrição:</strong> ${desc}</p>
              <p><strong>Implicação oncológica:</strong> ${progn}</p>
              <p class="calc-note">ECOG (Zubrod) e KPS são intercambiáveis em ensaios clínicos; ECOG ≥3 frequentemente exclui QT citotóxica intensiva.</p>`;
    }
  },

  'apgar-cx': {
    title: 'Apgar Cirúrgico — câncer de colo uterino',
    html: `
      <label>Perda sanguínea estimada (mL)</label>
      <input name="sangue" type="number" min="0" required>
      <label>Menor PAM intraoperatória (mmHg)</label>
      <input name="pam" type="number" min="0" required>
      <label>Menor FC intraoperatória (bpm)</label>
      <input name="fc" type="number" min="0" required>
    `,
    calculate (form) {
      const sangue = oNum(form, 'sangue');
      const pam = oNum(form, 'pam');
      const fc = oNum(form, 'fc');
      if (![sangue, pam, fc].every(Number.isFinite)) return alert('Preencha todos os campos.');

      let ptsSang = sangue <= 100 ? 2 : sangue <= 600 ? 1 : 0;
      let ptsPam = pam >= 70 ? 2 : pam >= 56 ? 1 : 0;
      let ptsFc = fc <= 70 ? 2 : fc <= 80 ? 1 : 0;
      const total = ptsSang + ptsPam + ptsFc;

      let interp = total >= 7
        ? 'Apgar ≥7 — baixo risco de complicações pós-operatórias maiores'
        : total >= 5
          ? 'Apgar 5–6 — risco intermediário; vigilância intensificada'
          : 'Apgar ≤4 — alto risco de complicações (incl. deiscência, infecção, reintervenção)';

      return `<p><strong>Apgar Cirúrgico:</strong> ${total}/10</p>
              <p>Sangramento: ${ptsSang} | PAM: ${ptsPam} | FC: ${ptsFc}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">Gawande et al., 2007 (Surgical Apgar Score). Validado em cirurgias ginecológicas/oncológicas incluindo histerectomia por câncer de colo uterino.</p>`;
    }
  },

  capra: {
    title: 'CAPRA — Câncer de próstata',
    wide: true,
    html: `
      <label>Idade no diagnóstico (anos)</label>
      <input name="idade" type="number" min="18" required>
      <label>PSA no diagnóstico (ng/mL)</label>
      <input name="psa" type="number" step="0.01" min="0" required>
      <label>Gleason (padrão primário + secundário)</label>
      <select name="gleason" required>
        <option value="0">6 (3+3) — +0</option>
        <option value="1">7 (3+4) — +1</option>
        <option value="3">7 (4+3) — +3</option>
        <option value="5">8–10 — +5</option>
      </select>
      <label>Estadio clínico</label>
      <select name="estadio" required>
        <option value="0">T1–T2 — +0</option>
        <option value="1">T3 — +1</option>
      </select>
      <label>Fragmentos positivos na biópsia (%)</label>
      <input name="posPct" type="number" step="0.1" min="0" max="100" required>
    `,
    calculate (form) {
      const idade = oNum(form, 'idade');
      const psa = oNum(form, 'psa');
      const posPct = oNum(form, 'posPct');
      if (!Number.isFinite(idade) || !Number.isFinite(psa) || !Number.isFinite(posPct)) {
        return alert('Preencha idade, PSA e % de cores positivos.');
      }

      let ptsIdade = idade < 50 ? 0 : idade < 60 ? 1 : 2;
      let ptsPsa = psa < 6 ? 0 : psa < 10 ? 1 : psa < 20 ? 2 : psa < 30 ? 3 : 4;
      const ptsGleason = parseInt(oSel(form, 'gleason'), 10);
      const ptsEstadio = parseInt(oSel(form, 'estadio'), 10);
      const ptsPos = posPct >= 34 ? 1 : 0;
      const total = ptsIdade + ptsPsa + ptsGleason + ptsEstadio + ptsPos;

      let risco = total <= 2
        ? 'Baixo risco (0–2) — favorável para vigilância ativa ou tratamento local curativo'
        : total <= 5
          ? 'Risco intermediário (3–5) — tratamento local com possível adjuvância'
          : 'Alto risco (6–10) — considerar abordagem multimodal';

      return `<p><strong>CAPRA:</strong> ${total}/10</p>
              <p>Idade: ${ptsIdade} | PSA: ${ptsPsa} | Gleason: ${ptsGleason} | Estadio: ${ptsEstadio} | Cores ≥34%: ${ptsPos}</p>
              <p><strong>Estratificação:</strong> ${risco}</p>
              <p class="calc-note">Cooperberg et al., UCSF CAPRA. Prediz recorrência bioquímica e mortalidade específica por câncer de próstata.</p>`;
    }
  }
};
