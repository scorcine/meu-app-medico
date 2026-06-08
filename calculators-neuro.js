/* Calculadoras — Neurologia */

function nNum (form, name) {
  const v = parseFloat(form[name]?.value);
  return Number.isFinite(v) ? v : NaN;
}

function nChk (form, name) {
  return !!form[name]?.checked;
}

function nSel (form, name) {
  return form[name]?.value ?? '';
}

const CALC_NEURO = {
  nihss: {
    title: 'NIHSS — AVC isquêmico',
    wide: true,
    html: `
      <label>1. Nível de consciência</label>
      <select name="loc" required>
        <option value="0">0 — alerta</option>
        <option value="1">1 — não alerta, despertável</option>
        <option value="2">2 — estimulo repetitivo/comatoso</option>
        <option value="3">3 — reflexos/postura/comatoso</option>
      </select>
      <label>1a. Perguntas (mes, idade)</label>
      <select name="locq" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>1b. Comandos (piscar, apertar mão)</label>
      <select name="locc" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>2. Olhar conjugado</label>
      <select name="gaze" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>3. Campos visuais</label>
      <select name="visual" required><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>
      <label>4. Paresia facial</label>
      <select name="face" required><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>
      <label>5a. Motor braço esquerdo</label>
      <select name="armL" required><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
      <label>5b. Motor braço direito</label>
      <select name="armR" required><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
      <label>6a. Motor perna esquerda</label>
      <select name="legL" required><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
      <label>6b. Motor perna direita</label>
      <select name="legR" required><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
      <label>7. Ataxia de membros</label>
      <select name="ataxia" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>8. Sensibilidade</label>
      <select name="sens" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>9. Linguagem</label>
      <select name="lang" required><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>
      <label>10. Disartria</label>
      <select name="dys" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
      <label>11. Extinção/negligência</label>
      <select name="neg" required><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>
    `,
    calculate (form) {
      const keys = ['loc', 'locq', 'locc', 'gaze', 'visual', 'face', 'armL', 'armR', 'legL', 'legR', 'ataxia', 'sens', 'lang', 'dys', 'neg'];
      const total = keys.reduce((s, k) => s + parseInt(nSel(form, k), 10), 0);
      let sever = total === 0 ? 'Sem déficit' : total <= 4 ? 'AVC leve' : total <= 15 ? 'Moderado' : total <= 20 ? 'Moderado-grave' : 'Grave';
      return `<p><strong>NIHSS:</strong> ${total}/42 — ${sever}</p>
              <p><strong>Conduta aguda:</strong> Avaliar elegibilidade para trombólise/endovascular conforme janela e diretriz local.</p>
              <p class="calc-note">NIH Stroke Scale. NIHSS ≥6 usado como referência em reperfusão.</p>`;
    }
  },

  abcd2: {
    title: 'ABCD² — risco pós-AIT',
    html: `
      <label class="calc-check"><input type="checkbox" name="idade"> Idade ≥60 anos (+1)</label>
      <label class="calc-check"><input type="checkbox" name="pa"> PAS ≥140 ou PAD ≥90 mmHg (+1)</label>
      <label class="calc-check"><input type="checkbox" name="dm"> Diabetes mellitus (+1)</label>
      <label>Duração dos sintomas</label>
      <select name="duracao" required>
        <option value="0">&lt;10 min</option>
        <option value="1">10–59 min (+1)</option>
        <option value="2">≥60 min (+2)</option>
      </select>
      <label>Características clínicas</label>
      <select name="clinica" required>
        <option value="0">Outras</option>
        <option value="1">Distúrbio da fala sem fraqueza (+1)</option>
        <option value="2">Fraqueza unilateral (+2)</option>
      </select>
    `,
    calculate (form) {
      let score = parseInt(nSel(form, 'duracao'), 10) + parseInt(nSel(form, 'clinica'), 10);
      if (nChk(form, 'idade')) score += 1;
      if (nChk(form, 'pa')) score += 1;
      if (nChk(form, 'dm')) score += 1;
      let risco = score <= 3 ? 'Baixo (~1% AVC em 2 dias)' : score <= 5 ? 'Moderado (~4% em 2 dias)' : 'Alto (~8% em 2 dias)';
      return `<p><strong>ABCD2:</strong> ${score}/7 — ${risco}</p>
              <p class="calc-note">Johnston et al., 2007. Score ≥4 = investigação urgente na maioria dos protocolos.</p>`;
    }
  },

  'hunt-hess': {
    title: 'Hunt-Hess — HSA aneurismática',
    html: `
      <label>Grau clínico</label>
      <select name="grau" required>
        <option value="1">I — cefaleia leve, rigidez de nuca</option>
        <option value="2">II — cefaleia intensa, rigidez, sem déficit exceto CN</option>
        <option value="3">III — sonolência, confusão, déficit focal leve</option>
        <option value="4">IV — estupor, hemiparesia moderada-grave</option>
        <option value="5">V — coma, postura decerebrada</option>
      </select>
    `,
    calculate (form) {
      const g = parseInt(nSel(form, 'grau'), 10);
      const mort = g === 1 ? '~30%' : g === 2 ? '~40%' : g === 3 ? '~50%' : g === 4 ? '~80%' : '~90%';
      return `<p><strong>Hunt-Hess:</strong> Grau ${g}</p>
              <p><strong>Mortalidade aproximada:</strong> ${mort}</p>
              <p><strong>Conduta:</strong> UTI; nimodipino; clipagem/embolização quando estável.</p>
              <p class="calc-note">Hunt &amp; Hess, 1968. Complementar com Fisher (TC) e WFNS.</p>`;
    }
  },

  mrs: {
    title: 'mRS — Modified Rankin Scale',
    html: `
      <label>Grau de incapacidade (mRS)</label>
      <select name="grau" required>
        <option value="0">0 — Sem sintomas</option>
        <option value="1">1 — Sem incapacidade significativa</option>
        <option value="2">2 — Incapacidade leve; independente</option>
        <option value="3">3 — Incapacidade moderada; precisa ajuda</option>
        <option value="4">4 — Incapacidade moderada-grave</option>
        <option value="5">5 — Incapacidade grave; acamado</option>
        <option value="6">6 — Óbito</option>
      </select>
      <label>Contexto</label>
      <select name="ctx" required>
        <option value="prev">Pré-AVC (baseline)</option>
        <option value="90d">90 dias pós-AVC (desfecho)</option>
      </select>
    `,
    calculate (form) {
      const g = parseInt(nSel(form, 'grau'), 10);
      const ctx = nSel(form, 'ctx');
      let interp = g <= 2 ? 'Desfecho favorável (independência)' : g <= 4 ? 'Dependência significativa' : g === 5 ? 'Incapacidade grave' : 'Óbito';
      let progn = ctx === 'prev'
        ? (g >= 3 ? 'Baseline desfavorável — impacta metas terapêuticas' : 'Baseline favorável')
        : (g <= 2 ? 'Meta atingida em trials de reperfusão' : 'Reabilitação prolongada necessária');
      return `<p><strong>mRS:</strong> ${g}/6 — ${interp}</p>
              <p><strong>Prognóstico:</strong> ${progn}</p>
              <p class="calc-note">Modified Rankin Scale — padrão para desfecho funcional pós-AVC.</p>`;
    }
  }
};
