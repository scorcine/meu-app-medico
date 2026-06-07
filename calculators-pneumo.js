/* Calculadoras — Pneumologia & Gasometrias */

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

const CALC_PNEUMO = {
  psi: {
    title: 'PSI / PORT (Pneumonia Severity Index)',
    wide: true,
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" required>
      <fieldset class="calc-fieldset">
        <legend>Comorbidades</legend>
        <label class="calc-check"><input type="checkbox" name="asilo"> Residência em instituição (+10)</label>
        <label class="calc-check"><input type="checkbox" name="neo"> Neoplasia (+30)</label>
        <label class="calc-check"><input type="checkbox" name="hep"> Doença hepática (+20)</label>
        <label class="calc-check"><input type="checkbox" name="ic"> Insuficiência cardíaca (+10)</label>
        <label class="calc-check"><input type="checkbox" name="cvd"> Doença cerebrovascular (+10)</label>
        <label class="calc-check"><input type="checkbox" name="renal"> Doença renal (+10)</label>
      </fieldset>
      <label class="calc-check"><input type="checkbox" name="mental"> Alteração do estado mental (+20)</label>
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" required>
      <label>PAS (mmHg)</label>
      <input name="pas" type="number" required>
      <label>Temperatura (°C)</label>
      <input name="temp" type="number" step="0.1" required>
      <label>Frequência cardíaca (bpm)</label>
      <input name="fc" type="number" required>
      <label>pH arterial</label>
      <input name="ph" type="number" step="0.01" placeholder="Opcional">
      <label>Ureia/BUN (mg/dL)</label>
      <input name="bun" type="number" placeholder="Opcional; ≥30 = +20">
      <label>Sódio (mEq/L)</label>
      <input name="na" type="number" placeholder="Opcional; &lt;130 = +20">
      <label>Glicose (mg/dL)</label>
      <input name="glic" type="number" placeholder="Opcional; ≥250 = +10">
      <label>Hematócrito (%)</label>
      <input name="ht" type="number" placeholder="Opcional; &lt;30 = +10">
      <label>PaO₂ (mmHg)</label>
      <input name="pao2" type="number" placeholder="Opcional; &lt;60 = +10">
      <label class="calc-check"><input type="checkbox" name="derrame"> Derrame pleural (+10)</label>
    `,
    calculate (form) {
      const sexo = pSel(form, 'sexo');
      const idade = pNum(form, 'idade');
      let score = sexo === 'F' ? Math.max(idade - 10, 0) : idade;

      if (pChk(form, 'asilo')) score += 10;
      if (pChk(form, 'neo')) score += 30;
      if (pChk(form, 'hep')) score += 20;
      if (pChk(form, 'ic')) score += 10;
      if (pChk(form, 'cvd')) score += 10;
      if (pChk(form, 'renal')) score += 10;
      if (pChk(form, 'mental')) score += 20;

      const fr = pNum(form, 'fr');
      const pas = pNum(form, 'pas');
      const temp = pNum(form, 'temp');
      const fc = pNum(form, 'fc');
      if (fr >= 30) score += 20;
      if (pas < 90) score += 20;
      if (temp < 35 || temp >= 40) score += 15;
      if (fc >= 125) score += 10;

      const ph = pNum(form, 'ph');
      if (ph && ph < 7.35) score += 30;
      const bun = pNum(form, 'bun');
      if (bun >= 30) score += 20;
      const na = pNum(form, 'na');
      if (na && na < 130) score += 20;
      const glic = pNum(form, 'glic');
      if (glic >= 250) score += 10;
      const ht = pNum(form, 'ht');
      if (ht && ht < 30) score += 10;
      const pao2 = pNum(form, 'pao2');
      if (pao2 && pao2 < 60) score += 10;
      if (pChk(form, 'derrame')) score += 10;

      let classe = 'I–II';
      let mort = '<1%';
      let conduta = 'Tratamento ambulatorial (considerar)';
      if (score > 130) { classe = 'V'; mort = '~29%'; conduta = 'Internação + considerar UTI'; }
      else if (score > 90) { classe = 'IV'; mort = '~8%'; conduta = 'Internação hospitalar'; }
      else if (score > 70) { classe = 'III'; mort = '~2%'; conduta = 'Internação ou observação'; }

      return `<p><strong>PSI (PORT):</strong> ${score} pontos — Classe ${classe}</p>
              <p><strong>Mortalidade em 30 dias:</strong> ${mort}</p>
              <p><strong>Conduta sugerida:</strong> ${conduta}</p>
              <p class="calc-note">Fine et al., 1997 (Pneumonia Severity Index).</p>`;
    }
  },

  mallampati: {
    title: 'Escore de Mallampati (via aérea)',
    html: `
      <label>Classe de Mallampati</label>
      <select name="classe" required>
        <option value="1">I — palato mole, úvula, pilares visíveis</option>
        <option value="2">II — palato mole, úvula parcialmente visível</option>
        <option value="3">III — palato mole, base da úvula visível</option>
        <option value="4">IV — palato mole não visível</option>
      </select>
    `,
    calculate (form) {
      const c = pSel(form, 'classe');
      const risco = c <= 2
        ? 'Via aérea provável de fácil visualização'
        : c === '3'
          ? 'Via aérea de visualização difícil — preparar plano B'
          : 'Via aérea difícil — considerar estratégia avançada';
      return `<p><strong>Mallampati ${c}:</strong> ${risco}</p>
              <p class="calc-note">Avaliar junto com outros preditores (distância tireomentoniana, abertura oral, mobilidade cervical).</p>`;
    }
  },

  'agem-pram': {
    title: 'Asma pediátrica — AGEM / PRAM',
    html: `
      <label>Escore</label>
      <select name="tipo" required>
        <option value="pram">PRAM (Pediatric Respiratory Assessment Measure)</option>
        <option value="agem">AGEM (gravidade clínica)</option>
      </select>
      <div id="agem-pram-fields"></div>
    `,
    calculate (form) {
      const tipo = pSel(form, 'tipo');
      if (tipo === 'pram') {
        const score =
          parseInt(pSel(form, 'pr_supra'), 10) +
          parseInt(pSel(form, 'pr_escal'), 10) +
          parseInt(pSel(form, 'pr_sibil'), 10) +
          parseInt(pSel(form, 'pr_entrada'), 10) +
          parseInt(pSel(form, 'pr_spo2'), 10);

        let grav = 'Leve — alta precoce possível';
        if (score >= 8) grav = 'Grave — considerar UTI / tratamento intensivo';
        else if (score >= 4) grav = 'Moderada — observação e tratamento inalatório';

        return `<p><strong>PRAM:</strong> ${score}/12</p>
                <p><strong>Gravidade:</strong> ${grav}</p>
                <p class="calc-note">Ducharme et al. PRAM — exacerbação asmática pediátrica.</p>`;
      }

      const spo2 = pNum(form, 'ag_spo2');
      const fala = pSel(form, 'ag_fala');
      const sibil = pSel(form, 'ag_sibil');
      const musc = pSel(form, 'ag_musc');
      let grav = 'Leve';
      let pts = 0;
      if (spo2 < 90) pts += 3;
      else if (spo2 < 95) pts += 2;
      if (fala === 'palavras') pts += 2;
      else if (fala === 'frases') pts += 1;
      if (sibil === 'grave') pts += 2;
      else if (sibil === 'moderado') pts += 1;
      if (musc === 'sim') pts += 2;

      if (pts >= 5) grav = 'Grave';
      else if (pts >= 3) grav = 'Moderada';

      return `<p><strong>AGEM (gravidade clínica):</strong> ${grav}</p>
              <p><strong>Pontos internos:</strong> ${pts}</p>
              <p class="calc-note">Classificação clínica de exacerbação asmática pediátrica — use PRAM para score validado.</p>`;
    },
    onRender (form) {
      const tipo = form?.querySelector('[name=tipo]');
      const container = form?.closest('.calc-block')?.querySelector('#agem-pram-fields')
        || document.getElementById('agem-pram-fields');
      if (!tipo || !container) return;

      const render = () => {
        if (tipo.value === 'pram') {
          container.innerHTML = `
            <label>Retração supraesternal</label>
            <select name="pr_supra" required>
              <option value="0">Ausente (0)</option><option value="1">Leve (1)</option><option value="2">Grave (2)</option>
            </select>
            <label>Retração escalena/ intercostal</label>
            <select name="pr_escal" required>
              <option value="0">0</option><option value="1">1</option><option value="2">2</option>
            </select>
            <label>Sibilos (ausculta)</label>
            <select name="pr_sibil" required>
              <option value="0">Ausente (0)</option><option value="1">Expiração (1)</option>
              <option value="2">Insp+exp (2)</option><option value="3">Mínimos ou ausentes com GRAVIDADE (3)</option>
            </select>
            <label>Entrada de ar</label>
            <select name="pr_entrada" required>
              <option value="0">Normal (0)</option><option value="1">Diminuída (1)</option><option value="2">Muito diminuída (2)</option>
            </select>
            <label>SpO₂ em ar ambiente</label>
            <select name="pr_spo2" required>
              <option value="0">≥97% (0)</option><option value="1">94–96% (1)</option>
              <option value="2">90–93% (2)</option><option value="3">&lt;90% (3)</option>
            </select>`;
        } else {
          container.innerHTML = `
            <label>SpO₂ (%)</label>
            <input name="ag_spo2" type="number" min="0" max="100" required>
            <label>Capacidade de fala</label>
            <select name="ag_fala" required>
              <option value="normal">Frases completas</option>
              <option value="frases">Frases curtas</option>
              <option value="palavras">Palavras isoladas</option>
            </select>
            <label>Sibilos</label>
            <select name="ag_sibil" required>
              <option value="leve">Leves</option><option value="moderado">Moderados</option><option value="grave">Graves / silent chest</option>
            </select>
            <label>Uso de musculatura acessória</label>
            <select name="ag_musc" required>
              <option value="nao">Não</option><option value="sim">Sim</option>
            </select>`;
        }
      };
      tipo.addEventListener('change', render);
      render();
    }
  },

  vef1: {
    title: 'VEF1 previsto (espirometria)',
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Idade (anos)</label>
      <input name="idade" type="number" min="18" max="90" required>
      <label>Altura (cm)</label>
      <input name="altura" type="number" min="100" max="220" required>
      <label>VEF1 medido (L)</label>
      <input name="vef1" type="number" step="0.01" min="0" placeholder="Opcional — calcular % previsto">
    `,
    calculate (form) {
      const sexo = pSel(form, 'sexo');
      const idade = pNum(form, 'idade');
      const altura = pNum(form, 'altura');
      let previsto;
      if (sexo === 'M') previsto = (0.0430 * altura) - (0.0290 * idade) - 2.49;
      else previsto = (0.0395 * altura) - (0.0252 * idade) - 2.38;

      const vef1 = pNum(form, 'vef1');
      let extra = '';
      if (vef1 > 0) {
        const pct = (vef1 / previsto) * 100;
        let obstr = 'Normal (≥80%)';
        if (pct < 30) obstr = 'Muito grave (<30%)';
        else if (pct < 50) obstr = 'Grave (30–49%)';
        else if (pct < 80) obstr = 'Moderado (50–79%)';
        extra = `<p><strong>VEF1 medido/previsto:</strong> ${pct.toFixed(0)}% — ${obstr}</p>`;
      }

      return `<p><strong>VEF1 previsto:</strong> ${previsto.toFixed(2)} L</p>
              ${extra}
              <p class="calc-note">Equações de Pereira et al. (Brasil). Para laudo oficial, use equações GLI-2012.</p>`;
    }
  },

  'aa-pafi': {
    title: 'Gradiente A-a e relação PaO₂/FiO₂ (PAFi)',
    html: `
      <label>PaO₂ (mmHg)</label>
      <input name="pao2" type="number" min="0" required>
      <label>PaCO₂ (mmHg)</label>
      <input name="paco2" type="number" min="0" required>
      <label>FiO₂ (0–1, ex.: 0.21 ar ambiente)</label>
      <input name="fio2" type="number" step="0.01" min="0.21" max="1" value="0.21" required>
      <label>Idade (anos) — para A-a esperado</label>
      <input name="idade" type="number" min="0" value="30">
    `,
    calculate (form) {
      const pao2 = pNum(form, 'pao2');
      const paco2 = pNum(form, 'paco2');
      const fio2 = pNum(form, 'fio2');
      const idade = pNum(form, 'idade') || 30;

      const pao2Alveolar = (fio2 * 713) - (paco2 / 0.8);
      const aaGrad = pao2Alveolar - pao2;
      const aaEsperado = (idade / 4) + 4;
      const pafi = pao2 / fio2;

      let sdrA = 'Normal (≥300)';
      if (pafi < 100) sdrA = 'SDRA grave (PaFi &lt;100)';
      else if (pafi < 200) sdrA = 'SDRA moderada (PaFi &lt;200)';
      else if (pafi < 300) sdrA = 'SDRA leve (PaFi &lt;300)';

      const aaInterp = aaGrad > aaEsperado + 5
        ? 'Gradiente A-a elevado — distúrbio V/Q ou shunt'
        : 'Gradiente A-a dentro do esperado para a idade';

      return `<p><strong>Gradiente A-a:</strong> ${aaGrad.toFixed(1)} mmHg (esperado ~${aaEsperado.toFixed(0)})</p>
              <p><strong>PaO₂/FiO₂ (PAFi):</strong> ${pafi.toFixed(0)} mmHg</p>
              <p><strong>Interpretação A-a:</strong> ${aaInterp}</p>
              <p><strong>Interpretação PAFi:</strong> ${sdrA}</p>
              <p class="calc-note">A-a = (FiO₂×713) − (PaCO₂/0.8) − PaO₂ (nível do mar). PAFi = PaO₂/FiO₂.</p>`;
    }
  },

  rox: {
    title: 'Índice de ROX (cateter nasal alto fluxo)',
    html: `
      <label>SpO₂ (%)</label>
      <input name="spo2" type="number" min="0" max="100" required>
      <label>FiO₂ (0–1)</label>
      <input name="fio2" type="number" step="0.01" min="0.21" max="1" required>
      <label>Frequência respiratória (irpm)</label>
      <input name="fr" type="number" min="1" required>
    `,
    calculate (form) {
      const spo2 = pNum(form, 'spo2');
      const fio2 = pNum(form, 'fio2');
      const fr = pNum(form, 'fr');
      const rox = (spo2 / fio2) / fr;

      let interp = 'Zona intermediária — monitorar de perto';
      if (rox >= 4.88) interp = 'ROX ≥4,88 — maior chance de sucesso da CNAF (referência 2–12h)';
      else if (rox < 3.85) interp = 'ROX &lt;3,85 — alto risco de falha da CNAF; considerar escalonamento';

      return `<p><strong>Índice ROX:</strong> ${rox.toFixed(2)}</p>
              <p><strong>Interpretação:</strong> ${interp}</p>
              <p class="calc-note">ROX = SpO₂ / FiO₂ / FR. Roca et al., 2016.</p>`;
    }
  }
};
