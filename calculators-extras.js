/* Calculadoras — Extras de conveniência */

function xNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function xSel (form, name) {
  return form[name]?.value ?? '';
}

function formatDateBR (d) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const CALC_EXTRAS = {
  'conv-medidas': {
    title: 'Conversor cm/pol & kg/lb',
    html: `
      <label>Conversão</label>
      <select name="tipo" required>
        <option value="cm-in">Centímetros → Polegadas</option>
        <option value="in-cm">Polegadas → Centímetros</option>
        <option value="kg-lb">Quilogramas → Libras</option>
        <option value="lb-kg">Libras → Quilogramas</option>
      </select>
      <label>Valor</label>
      <input name="valor" type="number" step="0.01" required>
    `,
    calculate (form) {
      const v = xNum(form, 'valor');
      if (!Number.isFinite(v)) return alert('Informe o valor.');
      const t = xSel(form, 'tipo');
      let txt;
      if (t === 'cm-in') txt = `${v} cm = ${(v / 2.54).toFixed(2)} pol`;
      else if (t === 'in-cm') txt = `${v} pol = ${(v * 2.54).toFixed(1)} cm`;
      else if (t === 'kg-lb') txt = `${v} kg = ${(v * 2.20462).toFixed(2)} lb`;
      else txt = `${v} lb = ${(v / 2.20462).toFixed(2)} kg`;
      return `<p><strong>Resultado:</strong> ${txt}</p>`;
    }
  },

  datas: {
    title: 'Calculadora de datas',
    html: `
      <label>Modo</label>
      <select name="modo" required>
        <option value="diff">Diferença entre duas datas</option>
        <option value="add">Somar/subtrair dias</option>
      </select>
      <label>Data inicial</label>
      <input name="d1" type="date" required>
      <label id="x-d2-label">Data final</label>
      <input name="d2" type="date" id="x-d2">
      <label id="x-dias-label" hidden>Dias (+ ou −)</label>
      <input name="dias" type="number" step="1" id="x-dias">
    `,
    onRender (form) {
      const modo = form.querySelector('[name="modo"]');
      const d2 = form.querySelector('#x-d2');
      const d2l = form.querySelector('#x-d2-label');
      const dl = form.querySelector('#x-dias-label');
      const di = form.querySelector('#x-dias');
      function refresh () {
        const add = modo.value === 'add';
        d2.hidden = add;
        d2l.hidden = add;
        dl.hidden = !add;
        di.hidden = !add;
      }
      modo.addEventListener('change', refresh);
      refresh();
    },
    calculate (form) {
      const d1s = form.d1.value;
      if (!d1s) return alert('Informe a data inicial.');
      const d1 = new Date(`${d1s}T12:00:00`);

      if (xSel(form, 'modo') === 'add') {
        const dias = xNum(form, 'dias');
        if (!Number.isFinite(dias)) return alert('Informe os dias.');
        const res = new Date(d1);
        res.setDate(res.getDate() + dias);
        return `<p><strong>Data resultante:</strong> ${formatDateBR(res)}</p>`;
      }

      const d2s = form.d2.value;
      if (!d2s) return alert('Informe a data final.');
      const d2 = new Date(`${d2s}T12:00:00`);
      const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      return `<p><strong>Intervalo:</strong> ${diff} dia(s) (${Math.floor(Math.abs(diff) / 7)} sem e ${Math.abs(diff) % 7} d)</p>
              <p class="calc-note">Útil para antibióticos, afastamentos e retorno.</p>`;
    }
  },

  superficie: {
    title: 'Superfície corporal (Mosteller)',
    html: `
      <label>Peso (kg)</label>
      <input name="peso" type="number" step="0.1" min="0.1" required>
      <label>Altura (cm)</label>
      <input name="altura" type="number" step="0.1" min="30" required>
    `,
    calculate (form) {
      const peso = xNum(form, 'peso');
      const alt = xNum(form, 'altura');
      if (!Number.isFinite(peso) || !Number.isFinite(alt)) return alert('Informe peso e altura.');
      const mosteller = Math.sqrt((peso * alt) / 3600);
      const dubois = 0.007184 * Math.pow(peso, 0.425) * Math.pow(alt, 0.725);
      return `<p><strong>Mosteller:</strong> ${mosteller.toFixed(2)} m²</p>
              <p><strong>Du Bois:</strong> ${dubois.toFixed(2)} m²</p>`;
    }
  },

  temp: {
    title: 'Conversor de temperatura',
    html: `
      <label>De</label>
      <select name="de" required>
        <option value="c">Celsius (°C)</option>
        <option value="f">Fahrenheit (°F)</option>
      </select>
      <label>Temperatura</label>
      <input name="valor" type="number" step="0.1" required>
    `,
    calculate (form) {
      const v = xNum(form, 'valor');
      if (!Number.isFinite(v)) return alert('Informe a temperatura.');
      const c = xSel(form, 'de') === 'c' ? v : (v - 32) * 5 / 9;
      const f = xSel(form, 'de') === 'f' ? v : (v * 9 / 5) + 32;
      const febre = c >= 38 ? 'Febre' : c >= 37.3 ? 'Subfebril' : 'Afebril';
      return `<p><strong>${c.toFixed(1)} °C</strong> = <strong>${f.toFixed(1)} °F</strong> — ${febre}</p>`;
    }
  },

  'lab-conv': {
    title: 'Conversor de unidades laboratoriais',
    html: `
      <label>Analito</label>
      <select name="analito" required>
        <option value="glic">Glicose (mg/dL ↔ mmol/L)</option>
        <option value="creat">Creatinina (mg/dL ↔ µmol/L)</option>
        <option value="col">Colesterol (mg/dL ↔ mmol/L)</option>
        <option value="bili">Bilirrubina (mg/dL ↔ µmol/L)</option>
        <option value="ureia">Ureia/BUN (mg/dL ↔ mmol/L)</option>
      </select>
      <label>Direção</label>
      <select name="dir" required>
        <option value="mg">mg/dL → SI</option>
        <option value="si">SI → mg/dL</option>
      </select>
      <label>Valor</label>
      <input name="valor" type="number" step="0.01" required>
    `,
    calculate (form) {
      const v = xNum(form, 'valor');
      if (!Number.isFinite(v)) return alert('Informe o valor.');
      const si = xSel(form, 'dir') === 'si';
      const a = xSel(form, 'analito');
      let txt;

      if (a === 'glic') {
        txt = si ? `${v} mmol/L = ${(v * 18.018).toFixed(0)} mg/dL` : `${v} mg/dL = ${(v / 18.018).toFixed(2)} mmol/L`;
      } else if (a === 'creat') {
        txt = si ? `${v} µmol/L = ${(v / 88.4).toFixed(2)} mg/dL` : `${v} mg/dL = ${(v * 88.4).toFixed(0)} µmol/L`;
      } else if (a === 'col') {
        txt = si ? `${v} mmol/L = ${(v / 0.02586).toFixed(0)} mg/dL` : `${v} mg/dL = ${(v * 0.02586).toFixed(2)} mmol/L`;
      } else if (a === 'bili') {
        txt = si ? `${v} µmol/L = ${(v / 17.1).toFixed(2)} mg/dL` : `${v} mg/dL = ${(v * 17.1).toFixed(0)} µmol/L`;
      } else {
        txt = si ? `${v} mmol/L = ${(v / 0.357).toFixed(0)} mg/dL BUN` : `${v} mg/dL BUN = ${(v * 0.357).toFixed(1)} mmol/L`;
      }
      return `<p><strong>Conversão:</strong> ${txt}</p>`;
    }
  },

  'peso-ideal': {
    title: 'Peso ideal & ajustado (Devine)',
    html: `
      <label>Sexo</label>
      <select name="sexo" required>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <label>Altura (cm)</label>
      <input name="altura" type="number" step="0.1" min="100" required>
      <label>Peso atual (kg) — opcional</label>
      <input name="peso" type="number" step="0.1" min="0" placeholder="Peso ajustado se obeso">
    `,
    calculate (form) {
      const altCm = xNum(form, 'altura');
      if (!Number.isFinite(altCm)) return alert('Informe a altura.');
      const altPol = altCm / 2.54;
      const base = xSel(form, 'sexo') === 'M' ? 50 : 45.5;
      const ibw = base + 2.3 * Math.max(altPol - 60, 0);
      const peso = xNum(form, 'peso');
      let adj = '';
      if (Number.isFinite(peso) && peso > ibw) {
        adj = `<p><strong>Peso ajustado:</strong> ${(ibw + 0.4 * (peso - ibw)).toFixed(1)} kg</p>`;
      }
      return `<p><strong>Peso ideal (Devine):</strong> ${ibw.toFixed(1)} kg</p>${adj}`;
    }
  },

  fio2: {
    title: 'FiO₂ estimada — O₂ suplementar',
    html: `
      <label>Dispositivo</label>
      <select name="disp" required>
        <option value="cn">Cateter nasal (L/min)</option>
        <option value="mfr">Máscara facial simples (L/min)</option>
        <option value="nrb">Máscara reservatório (L/min)</option>
        <option value="pct">FiO₂ direta (%)</option>
      </select>
      <label id="fio2-val-label">Fluxo (L/min)</label>
      <input name="valor" type="number" step="0.5" min="0" required>
    `,
    onRender (form) {
      const disp = form.querySelector('[name="disp"]');
      const label = form.querySelector('#fio2-val-label');
      disp.addEventListener('change', () => {
        label.textContent = disp.value === 'pct' ? 'FiO₂ (%)' : 'Fluxo (L/min)';
      });
    },
    calculate (form) {
      const v = xNum(form, 'valor');
      if (!Number.isFinite(v)) return alert('Informe o valor.');
      const disp = xSel(form, 'disp');
      let fio2 = disp === 'pct' ? v : disp === 'cn' ? Math.min(21 + 4 * v, 44)
        : disp === 'mfr' ? 35 + v * 4 : Math.min(60 + v * 10, 90);
      return `<p><strong>FiO₂ estimada:</strong> ${fio2.toFixed(0)}%</p>
              <p class="calc-note">Estimativa clínica; usar valor do ventilador se IOT/VNI.</p>`;
    }
  },

  'map-inv': {
    title: 'PAM & PAS estimada',
    html: `
      <label>Modo</label>
      <select name="modo" required>
        <option value="pam">Calcular PAM (PAS + PAD)</option>
        <option value="pas">Estimar PAS (PAM alvo + PAD)</option>
      </select>
      <label id="x-pas-label">PAS (mmHg)</label>
      <input name="pas" type="number" id="x-pas">
      <label>PAD (mmHg)</label>
      <input name="pad" type="number" id="x-pad">
      <label id="x-pam-label" hidden>PAM alvo (mmHg)</label>
      <input name="pam" type="number" id="x-pam" hidden>
    `,
    onRender (form) {
      const modo = form.querySelector('[name="modo"]');
      const pas = form.querySelector('#x-pas');
      const pam = form.querySelector('#x-pam');
      const pasL = form.querySelector('#x-pas-label');
      const pamL = form.querySelector('#x-pam-label');
      function refresh () {
        const inv = modo.value === 'pas';
        pas.hidden = inv;
        pasL.hidden = inv;
        pam.hidden = !inv;
        pamL.hidden = !inv;
      }
      modo.addEventListener('change', refresh);
      refresh();
    },
    calculate (form) {
      if (xSel(form, 'modo') === 'pam') {
        const pas = xNum(form, 'pas');
        const pad = xNum(form, 'pad');
        if (!Number.isFinite(pas) || !Number.isFinite(pad)) return alert('Informe PAS e PAD.');
        const pam = (pas + 2 * pad) / 3;
        return `<p><strong>PAM:</strong> ${pam.toFixed(1)} mmHg ${pam >= 65 ? '(≥65 OK)' : '(<65 — considerar suporte)'}</p>`;
      }
      const pamT = xNum(form, 'pam');
      const pad = xNum(form, 'pad');
      if (!Number.isFinite(pamT) || !Number.isFinite(pad)) return alert('Informe PAM e PAD.');
      return `<p><strong>PAS estimada:</strong> ${(3 * pamT - 2 * pad).toFixed(0)} mmHg</p>
              <p class="calc-note">PAS ≈ 3×PAM − 2×PAD</p>`;
    }
  },

  'rass-sedacao': {
    title: 'RASS — escala de sedação',
    html: `
      <label>Escore RASS observado</label>
      <select name="rass" required>
        <option value="4">+4 — Combativo</option>
        <option value="3">+3 — Muito agitado</option>
        <option value="2">+2 — Agitado</option>
        <option value="1">+1 — Inquieto</option>
        <option value="0">0 — Alerta e calmo</option>
        <option value="-1">−1 — Sonolento</option>
        <option value="-2">−2 — Sedação leve</option>
        <option value="-3">−3 — Sedação moderada</option>
        <option value="-4">−4 — Sedação profunda</option>
        <option value="-5">−5 — Não desperta</option>
      </select>
      <label class="calc-check"><input type="checkbox" name="vm"> Paciente em ventilação mecânica</label>
    `,
    calculate (form) {
      const rass = parseInt(xSel(form, 'rass'), 10);
      const onVm = !!form['vm']?.checked;

      const labels = {
        4: 'Combativo — perigo imediato',
        3: 'Muito agitado — puxa tubos/cateteres',
        2: 'Agitado — movimentos frequentes',
        1: 'Inquieto — ansioso, movimentos mínimos',
        0: 'Alerta e calmo',
        [-1]: 'Sonolento — desperta > 10 s',
        [-2]: 'Sedação leve — desperta < 10 s',
        [-3]: 'Sedação moderada — movimento ou abertura ocular ao estímulo',
        [-4]: 'Sedação profunda — resposta ao estímulo físico',
        [-5]: 'Não desperta — sem resposta'
      };

      const key = rass;
      let alvo = onVm
        ? 'Meta usual em VM: <strong>RASS −2 a 0</strong> (individualizar neurocirurgia/SDRA)'
        : 'Meta usual fora de VM: <strong>RASS 0 a −1</strong>';

      let conduta = '';
      if (rass >= 2) {
        conduta = 'Agitação — investigar dor, delirium, hipóxia, retirada; titular sedação/analgesia · dexmedetomidina se agitado em VM';
      } else if (rass === 1 || rass === 0 || rass === -1) {
        conduta = 'Faixa terapêutica usual — manter e reavaliar q4h ou após mudança de sedação';
      } else if (rass === -2) {
        conduta = 'Sedação leve — adequado para maioria em VM; evitar aprofundar sem indicação';
      } else {
        conduta = 'Sedação profunda — considerar reduzir sedação · avaliar TOF se BNM · considerar reversores se excesso medicamentoso';
      }

      return `<p class="emerg-calc-score"><strong>RASS ${rass >= 0 ? '+' + rass : rass}:</strong> ${labels[key]}</p>
              <p><strong>Alvo:</strong> ${alvo}</p>
              <p><strong>Conduta:</strong> ${conduta}</p>
              <p class="calc-note">RASS (Sessler et al.) · correlacionar com BIS/TOF conforme protocolo institucional.</p>`;
    }
  }
};
