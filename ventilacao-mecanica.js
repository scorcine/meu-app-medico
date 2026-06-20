/* Ventilação mecânica — calculadora + parâmetros iniciais e ajustes */

const MEDHUB_VM_BUILD = 'vm-calc-v2';

const VM_PEEP_FIO2 = [
  { fio2Max: 0.3, peep: '5' },
  { fio2Max: 0.4, peep: '5–8' },
  { fio2Max: 0.5, peep: '8–10' },
  { fio2Max: 0.6, peep: '10' },
  { fio2Max: 0.7, peep: '10–12' },
  { fio2Max: 0.8, peep: '12–14' },
  { fio2Max: 0.9, peep: '14–16' },
  { fio2Max: 1.01, peep: '16–20' }
];

function medhubVmPbw (sex, heightCm) {
  const h = Number(heightCm);
  if (!Number.isFinite(h) || h < 120 || h > 230) return null;
  const base = sex === 'F' ? 45.5 : 50;
  return Math.max(30, base + 0.91 * (h - 152.4));
}

function medhubVmRoundVt (ml) {
  return Math.round(ml / 10) * 10;
}

function medhubVmPeepForFio2 (fio2) {
  const f = Number(fio2);
  if (!Number.isFinite(f)) return '5';
  for (const row of VM_PEEP_FIO2) {
    if (f <= row.fio2Max) return row.peep;
  }
  return '16–20';
}

function medhubVmInitialSettings (ctx, pbw) {
  const vt6 = medhubVmRoundVt(pbw * 6);
  const vt7 = medhubVmRoundVt(pbw * 7);
  const vt8 = medhubVmRoundVt(pbw * 8);

  const presets = {
    padrao: {
      vt: vt6,
      fr: 12,
      peep: 5,
      fio2: '100% só pós-IOT → reduzir logo (SpO₂ alvo 92–96%)',
      ie: '1:2',
      flow: '50–55 L/min',
      note: 'Ventilação protetora — <strong>inicie 6 mL/kg</strong>; 7–8 mL/kg só se hipercapnia/acidose persistir'
    },
    sdr: {
      vt: vt6,
      fr: 14,
      peep: 8,
      fio2: '40–60% → titular (SpO₂ 88–95%)',
      ie: '1:2',
      flow: '≥ 55 L/min',
      note: 'SDRA — mantenha 6 mL/kg; oxigene com FiO₂/PEEP, não com Vt'
    },
    dpoc: { vt: vt6, fr: 10, peep: 5, fio2: 'Titular (SpO₂ 88–92%)', ie: '1:3 ou 1:4', flow: '45–50 L/min', note: 'Hipercapnia permissiva se pH ≥ 7,20' },
    obeso: { vt: vt6, fr: 12, peep: 8, fio2: 'Titular', ie: '1:2', flow: '55 L/min', note: 'Vt sempre pelo PBW, não pelo peso real' }
  };

  return { ...(presets[ctx] || presets.padrao), vt6, vt7, vt8 };
}

function medhubVmBuildAdjustments (opts) {
  const { problema, pbw, preset, vitals, ctx } = opts;
  const vt6 = preset.vt6;
  const vt8 = preset.vt8;
  const vtUp = medhubVmRoundVt(Math.min(pbw * 8, preset.vt + pbw));
  const frUp = Math.min(34, (vitals.fr || preset.fr) + 4);
  const frDown = Math.max(8, (vitals.fr || preset.fr) - 4);
  const peepUp = (vitals.peep || preset.peep) + 2;
  const fio2Pct = vitals.fio2 != null ? Math.round(vitals.fio2 * 100) : null;
  const peepTable = vitals.fio2 != null ? medhubVmPeepForFio2(vitals.fio2) : null;

  const auto = [];
  if (vitals.spo2 != null && vitals.spo2 < 92) auto.push('hipoxemia');
  if (vitals.ph != null && vitals.ph < 7.25) auto.push('hipercapnia');
  if (vitals.pplat != null && vitals.pplat >= 30) auto.push('pressao_alta');

  const active = problema !== 'nenhum' ? problema : (auto[0] || 'nenhum');
  const steps = [];

  if (active === 'hipoxemia') {
    steps.push('Confirmar tubo, DOPE e circuito antes de subir parâmetros.');
    if (fio2Pct != null && fio2Pct < 100) {
      steps.push(`Subir <strong>FiO₂</strong> em degraus (+10%) — atual ~${fio2Pct}%.`);
    } else {
      steps.push('Subir <strong>FiO₂</strong> em degraus (+10%) até SpO₂ no alvo.');
    }
    if (fio2Pct != null && fio2Pct >= 60) {
      steps.push(`FiO₂ ≥ 60%: aumentar <strong>PEEP +2 cmH₂O</strong> (ex.: ${peepUp}) e reavaliar Pplat/PA.`);
      if (peepTable) steps.push(`Referência SDRA (FiO₂ ${fio2Pct}%): PEEP ${peepTable} cmH₂O.`);
    } else {
      steps.push(`Se FiO₂ &gt; 60% persistente → <strong>PEEP +2</strong> (ex.: ${peepUp} cmH₂O).`);
    }
    if (ctx === 'sdr') steps.push('Manter <strong>Vt ' + vt6 + ' mL</strong> (6 mL/kg PBW) — não compensar hipoxemia com Vt.');
  }

  if (active === 'hipercapnia') {
    steps.push(`Primeiro ↑ <strong>FR para ${frUp} irpm</strong> (+2–4) — evitar FR &gt; 30–35 se DPOC/auto-PEEP.`);
    const vtNext = medhubVmRoundVt(Math.min(preset.vt8, preset.vt + pbw));
    if (preset.vt <= preset.vt6 && vtNext > preset.vt6) {
      steps.push(`Se acidose persiste: subir <strong>Vt para ${vtNext} mL</strong> (+1 mL/kg; teto ${preset.vt8} mL = 8 mL/kg).`);
    } else if (preset.vt >= preset.vt8) {
      steps.push(`Vt já no teto protetor (${preset.vt8} mL) — priorize FR, sedação e causas reversíveis.`);
    } else {
      steps.push(`Se ainda acidótico: <strong>Vt ${vtNext} mL</strong> (+1 mL/kg, máx. ${preset.vt8} mL).`);
    }
    steps.push('Tratar febre, dor, broncoespasmo e sedação insuficiente.');
    if (ctx === 'sdr' || ctx === 'dpoc') steps.push('Se pH ≥ 7,20 com SDRA/DPOC → hipercapnia permissiva aceitável.');
  }

  if (active === 'pressao_alta') {
    steps.push(`Reduzir <strong>Vt para ${vt6} mL</strong> (6 mL/kg PBW).`);
    steps.push('Meta: <strong>Pplat &lt; 30</strong> e driving pressure (Pplat − PEEP) &lt; 15 cmH₂O.');
    steps.push('Pico ↑ com platô normal → broncodilatador, aspiração, resistência de tubo/filtro.');
    steps.push('Platô ↑ → atelectasia/SDRA/pneumotórax: Rx, PEEP, prona se indicado.');
  }

  if (active === 'auto_peep') {
    steps.push(`Reduzir <strong>FR para ${frDown} irpm</strong> e prolongar expiração (<strong>I:E 1:3 ou 1:4</strong>).`);
    steps.push(`Manter ou reduzir <strong>Vt ${vt6} mL</strong> · tratar broncoespasmo (β₂ + corticoide).`);
    steps.push('Medir auto-PEEP em pausa expiratória · ajustar trigger.');
  }

  if (active === 'assincronia') {
    steps.push('Otimizar sedação/analgesia — luta com ventilador é causa frequente.');
    steps.push('Revisar Vt insuficiente (double triggering) · trigger −1 a −2 cmH₂O.');
    steps.push('Flow starvation → ↑ fluxo insp. ou mudar para PCV.');
    steps.push('Refratário → BNM curto prazo + reavaliar causa.');
  }

  if (active === 'nenhum') {
    steps.push('Gasometria em 30–60 min · titule FiO₂ para SpO₂ 92–96% (SDRA: 88–95%).');
    steps.push('Reavaliar sedação, Rx tórax e curva de capnografia.');
  }

  return { active, steps, autoHints: auto };
}

function medhubVmCalculate (form) {
  const sex = form.querySelector('input[name="vm-sexo"]:checked')?.value || 'M';
  const height = Number(form.querySelector('[name="vm-altura"]')?.value);
  const weight = Number(form.querySelector('[name="vm-peso"]')?.value);
  const ctx = form.querySelector('[name="vm-contexto"]')?.value || 'padrao';
  const problema = form.querySelector('[name="vm-problema"]')?.value || 'nenhum';

  const pbw = medhubVmPbw(sex, height);
  if (!pbw) {
    return '<p class="calc-note">Informe sexo e altura válidos (120–230 cm).</p>';
  }

  const bmi = Number.isFinite(weight) && weight > 0
    ? weight / Math.pow(height / 100, 2)
    : null;
  const obese = (bmi != null && bmi >= 30) || (Number.isFinite(weight) && weight > pbw * 1.25);

  const vitals = {
    spo2: form.querySelector('[name="vm-spo2"]')?.value ? Number(form.querySelector('[name="vm-spo2"]').value) : null,
    fio2: form.querySelector('[name="vm-fio2"]')?.value ? Number(form.querySelector('[name="vm-fio2"]').value) : null,
    peep: form.querySelector('[name="vm-peep-atual"]')?.value ? Number(form.querySelector('[name="vm-peep-atual"]').value) : null,
    pplat: form.querySelector('[name="vm-pplat"]')?.value ? Number(form.querySelector('[name="vm-pplat"]').value) : null,
    ph: form.querySelector('[name="vm-ph"]')?.value ? Number(form.querySelector('[name="vm-ph"]').value) : null,
    fr: form.querySelector('[name="vm-fr-atual"]')?.value ? Number(form.querySelector('[name="vm-fr-atual"]').value) : null
  };

  const preset = medhubVmInitialSettings(ctx, pbw);
  const adj = medhubVmBuildAdjustments({ problema, pbw, preset, vitals, ctx });

  const sexLabel = sex === 'F' ? 'Feminino' : 'Masculino';
  let html = '<div class="vm-result-block">';
  html += '<h4 class="vm-result-title">Resumo do paciente</h4>';
  html += '<p><strong>PBW (peso predito):</strong> ' + pbw.toFixed(1) + ' kg · ' + sexLabel + ' · ' + height + ' cm';
  if (Number.isFinite(weight) && weight > 0) {
    html += ' · peso real ' + weight + ' kg';
    if (bmi) html += ' (IMC ' + bmi.toFixed(1) + ')';
  }
  html += '</p>';
  if (obese) {
    html += '<p class="vm-result-warn">Obesidade provável — use <strong>PBW</strong> para Vt, não o peso real.</p>';
  }
  html += '<p class="muted">Vt protetor: <strong>' + preset.vt6 + ' mL</strong> (6 mL/kg — <em>inicial recomendado</em>) · teto ' + preset.vt8 + ' mL (8 mL/kg) se hipercapnia refratária</p>';

  html += '<h4 class="vm-result-title">Configure no ventilador (inicial)</h4>';
  html += '<table class="emerg-table vm-result-table"><tr><th>Parâmetro</th><th>Sugestão</th></tr>';
  html += '<tr><td>Modo</td><td><strong>VCV</strong> (ou PCV local)</td></tr>';
  html += '<tr><td>Vt</td><td><strong>' + preset.vt + ' mL</strong> <span class="muted">(6 mL/kg PBW)</span></td></tr>';
  html += '<tr><td>FR</td><td><strong>' + preset.fr + ' irpm</strong></td></tr>';
  html += '<tr><td>FiO₂</td><td>' + preset.fio2 + '</td></tr>';
  html += '<tr><td>PEEP</td><td><strong>' + preset.peep + ' cmH₂O</strong></td></tr>';
  html += '<tr><td>I:E</td><td>' + preset.ie + '</td></tr>';
  html += '<tr><td>Fluxo insp.</td><td>' + preset.flow + '</td></tr>';
  html += '<tr><td>Trigger</td><td>−1 a −2 cmH₂O (fluxo se disponível)</td></tr>';
  html += '</table>';
  html += '<p class="calc-note">' + preset.note + ' · Pplat &lt; 30 · driving &lt; 15.</p>';

  const probLabels = {
    hipoxemia: 'Hipoxemia',
    hipercapnia: 'Hipercapnia / acidose',
    pressao_alta: 'Pressão alta',
    auto_peep: 'Auto-PEEP / DPOC',
    assincronia: 'Assincronia',
    nenhum: 'Manutenção / titulação'
  };

  html += '<h4 class="vm-result-title">Ajustes sugeridos — ' + (probLabels[adj.active] || adj.active) + '</h4>';
  if (adj.autoHints.length && problema === 'nenhum') {
    html += '<p class="vm-result-hint">Detectado pelos valores informados: ' + adj.autoHints.map(h => probLabels[h] || h).join(', ') + '.</p>';
  }
  html += '<ol class="vm-adjust-list">';
  adj.steps.forEach(s => { html += '<li>' + s + '</li>'; });
  html += '</ol></div>';

  return html;
}

function medhubBindVmCalcForm (root) {
  const scope = root && root.querySelector ? root : document;
  const form = scope.querySelector('#vm-calc-form');
  if (!form || form.dataset.vmCalcBound) return;
  form.dataset.vmCalcBound = '1';

  const resultEl = scope.querySelector('#vm-calc-result');

  function refresh () {
    if (!resultEl) return;
    resultEl.innerHTML = medhubVmCalculate(form);
    resultEl.hidden = false;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    refresh();
  });

  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('change', refresh);
    if (el.type === 'number' || el.type === 'range') {
      el.addEventListener('input', refresh);
    }
  });

  refresh();
}

const VM_CALC_HTML = `
  <div class="vm-section-card vm-calc-card">
    <h3>🧮 Calculadora de ventilação</h3>
    <p class="muted">Informe sexo, altura e peso — o app calcula PBW, parâmetros iniciais e ajustes sugeridos.</p>
    <form id="vm-calc-form" class="calc-form vm-calc-form">
      <fieldset class="calc-fieldset vm-calc-fieldset">
        <legend>Paciente</legend>
        <div class="vm-calc-grid">
          <div class="vm-calc-sexo">
            <span class="vm-calc-label">Sexo</span>
            <label class="calc-check"><input type="radio" name="vm-sexo" value="M" checked> Masculino</label>
            <label class="calc-check"><input type="radio" name="vm-sexo" value="F"> Feminino</label>
          </div>
          <div>
            <label for="vm-altura">Altura (cm)</label>
            <input id="vm-altura" name="vm-altura" type="number" min="120" max="230" step="1" placeholder="Ex.: 170" required>
          </div>
          <div>
            <label for="vm-peso">Peso real (kg)</label>
            <input id="vm-peso" name="vm-peso" type="number" min="30" max="250" step="0.1" placeholder="Ex.: 80">
          </div>
          <div>
            <label for="vm-contexto">Situação clínica</label>
            <select id="vm-contexto" name="vm-contexto">
              <option value="padrao">Pós-IOT — protetora (padrão)</option>
              <option value="sdr">SDRA / hipoxemia grave</option>
              <option value="dpoc">DPOC / asma (risco auto-PEEP)</option>
              <option value="obeso">Obesidade (Vt pelo PBW)</option>
            </select>
          </div>
          <div>
            <label for="vm-problema">Problema agora (ajustes)</label>
            <select id="vm-problema" name="vm-problema">
              <option value="nenhum">Titulação / manutenção</option>
              <option value="hipoxemia">Hipoxemia (SpO₂ baixa)</option>
              <option value="hipercapnia">Hipercapnia / pH baixo</option>
              <option value="pressao_alta">Pressão alta (Pplat / driving)</option>
              <option value="auto_peep">Auto-PEEP / aprisionamento</option>
              <option value="assincronia">Assincronia / luta</option>
            </select>
          </div>
        </div>
      </fieldset>
      <fieldset class="calc-fieldset vm-calc-fieldset">
        <legend>Valores atuais (opcional — refina os ajustes)</legend>
        <div class="vm-calc-grid vm-calc-grid-vitals">
          <div><label for="vm-spo2">SpO₂ (%)</label><input id="vm-spo2" name="vm-spo2" type="number" min="50" max="100" step="1" placeholder="94"></div>
          <div><label for="vm-fio2">FiO₂ (0–1)</label><input id="vm-fio2" name="vm-fio2" type="number" min="0.21" max="1" step="0.05" placeholder="0.5"></div>
          <div><label for="vm-peep-atual">PEEP</label><input id="vm-peep-atual" name="vm-peep-atual" type="number" min="0" max="30" step="1" placeholder="5"></div>
          <div><label for="vm-pplat">Pplat</label><input id="vm-pplat" name="vm-pplat" type="number" min="5" max="50" step="1" placeholder="22"></div>
          <div><label for="vm-ph">pH</label><input id="vm-ph" name="vm-ph" type="number" min="6.8" max="7.6" step="0.01" placeholder="7.30"></div>
          <div><label for="vm-fr-atual">FR (irpm)</label><input id="vm-fr-atual" name="vm-fr-atual" type="number" min="6" max="40" step="1" placeholder="14"></div>
        </div>
      </fieldset>
      <button type="submit">Atualizar recomendações</button>
    </form>
    <div id="vm-calc-result" class="calc-result vm-calc-result" hidden></div>
  </div>`;

const VM_REFERENCE_HTML = `
  <details class="vm-ref-details">
    <summary>📋 Referência — parâmetros iniciais e metas</summary>
    <div class="vm-section-card vm-ref-inner">
      <h4>Peso predito (PBW)</h4>
      <table class="emerg-table">
        <tr><th>Sexo</th><th>Fórmula</th></tr>
        <tr><td>Homem</td><td>50 + 0,91 × (altura cm − 152,4)</td></tr>
        <tr><td>Mulher</td><td>45,5 + 0,91 × (altura cm − 152,4)</td></tr>
      </table>
      <h4>Metas de segurança</h4>
      <ul>
        <li>Pplat &lt; 30 cmH₂O · driving &lt; 15 cmH₂O</li>
        <li>SpO₂ 92–96% (SDRA: 88–95%) · pH permissivo ≥ 7,20–7,25</li>
      </ul>
      <h4>Checklist pós-IOT</h4>
      <p>Rx tórax · sedação · capnografia · gasometria 30–60 min · DOPE se dessaturação súbita.</p>
    </div>
  </details>
  <details class="vm-ref-details">
    <summary>⚙️ Referência — tabela PEEP / FiO₂ (SDRA)</summary>
    <div class="vm-section-card vm-ref-inner">
      <table class="emerg-table vm-peep-table">
        <tr><th>FiO₂</th><th>0,30</th><th>0,40</th><th>0,50</th><th>0,60</th><th>0,70</th><th>0,80</th><th>0,90</th><th>1,0</th></tr>
        <tr><td><strong>PEEP</strong></td><td>5</td><td>5–8</td><td>8–10</td><td>10</td><td>10–12</td><td>12–14</td><td>14–16</td><td>16–20</td></tr>
      </table>
    </div>
  </details>
  <p class="emerg-note">Ferramenta educacional — não substitui protocolo de UTI nem manual do ventilador.</p>
  <p class="muted vm-build">Build Ventilação mecânica: <strong>${MEDHUB_VM_BUILD}</strong></p>`;

const VM_CONTENT = VM_CALC_HTML + VM_REFERENCE_HTML;

const VM_PROTOCOL_HTML = VM_CONTENT;

function medhubRegisterVentilacaoEmergProtocol () {
  if (typeof VIA_AEREA_PROTOCOLS === 'undefined') return false;

  const entry = {
    id: 'ventilacao-mecanica',
    icon: '🫁',
    name: 'Ventilação Mecânica — calculadora',
    html: VM_PROTOCOL_HTML
  };

  const idx = VIA_AEREA_PROTOCOLS.findIndex(p => p.id === 'ventilacao-mecanica');
  if (idx >= 0) {
    VIA_AEREA_PROTOCOLS[idx] = entry;
    return true;
  }

  const rsiIdx = VIA_AEREA_PROTOCOLS.findIndex(p => p.id === 'rsi-7-passos');
  VIA_AEREA_PROTOCOLS.splice(rsiIdx >= 0 ? rsiIdx + 1 : 0, 0, entry);
  return true;
}

function initVentilacaoMecanica () {
  const el = document.getElementById('vm-content');
  if (!el || el.dataset.vmBound) return;
  el.dataset.vmBound = '1';
  el.innerHTML = VM_CONTENT;
  medhubBindVmCalcForm(el);
}

function showVentilacaoMecanicaHome () {
  const list = document.getElementById('vm-list-view');
  if (list) list.hidden = false;
}
