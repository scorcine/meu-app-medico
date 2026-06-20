/* Ventilação mecânica — parâmetros iniciais e ajustes no plantão */

const MEDHUB_VM_BUILD = 'vm-v1';

const VM_CONTENT = `
  <p class="muted">Referência rápida pós-intubação e titulação na UTI/PS — ventilação protetora, metas gasométricas e resposta a alarmes. Revisado jun/2026.</p>

  <div class="vm-section-card">
    <h3>🫁 Parâmetros iniciais (pós-IOT)</h3>
    <p>Após IOT confirmada (capnografia + Rx tórax), conectar ao ventilador e iniciar em <strong>VCV</strong> (volume controlado) na maioria dos serviços — ajustar conforme protocolo local.</p>

    <h4>Peso predito (PBW) — base para Vt</h4>
    <table class="emerg-table">
      <tr><th>Sexo</th><th>Fórmula PBW</th><th>Exemplo (altura 170 cm)</th></tr>
      <tr><td>Homem</td><td><strong>50 + 0,91 × (altura cm − 152,4)</strong></td><td>~66 kg</td></tr>
      <tr><td>Mulher</td><td><strong>45,5 + 0,91 × (altura cm − 152,4)</strong></td><td>~61 kg</td></tr>
    </table>

    <h4>Configuração inicial sugerida (adulto estável)</h4>
    <table class="emerg-table">
      <tr><th>Parâmetro</th><th>Valor inicial</th><th>Observação</th></tr>
      <tr><td><strong>Modo</strong></td><td>VCV (ou PCV se protocolo institucional)</td><td>PCV: P insp inicial ~15–20 cmH₂O titulando Vt</td></tr>
      <tr><td><strong>Vt</strong></td><td><strong>6–8 mL/kg PBW</strong></td><td>Protetora: preferir 6 mL/kg se SDRA/hipoxemia grave</td></tr>
      <tr><td><strong>FR</strong></td><td>12–20 irpm</td><td>Ajustar para PaCO₂ alvo; evitar auto-PEEP se FR alta</td></tr>
      <tr><td><strong>FiO₂</strong></td><td>100% → titular</td><td>Meta SpO₂ <strong>92–96%</strong> (SDRA: 88–95% conforme protocolo)</td></tr>
      <tr><td><strong>PEEP</strong></td><td><strong>5 cmH₂O</strong></td><td>SDRA/obesidade: subir PEEP conforme tabela PEEP/FiO₂</td></tr>
      <tr><td><strong>Relação I:E</strong></td><td>1:2 (ou 1:2,5)</td><td>Prolongar expiração se auto-PEEP</td></tr>
      <tr><td><strong>Fluxo insp.</strong></td><td>50–60 L/min (ou auto)</td><td>Meta tempo insp. ~0,8–1,2 s</td></tr>
      <tr><td><strong>Trigger</strong></td><td>−1 a −2 cmH₂O (fluxo se disponível)</td><td>Evitar auto-ciclagem e assincronia</td></tr>
    </table>

    <h4>Metas de segurança (primeiras horas)</h4>
    <table class="emerg-table">
      <tr><th>Variável</th><th>Meta</th></tr>
      <tr><td>Pressão de platô (Pplat)</td><td><strong>&lt; 30 cmH₂O</strong></td></tr>
      <tr><td>Pressão de driving (Pplat − PEEP)</td><td><strong>&lt; 15 cmH₂O</strong> quando possível</td></tr>
      <tr><td>SpO₂</td><td>92–96% (individualizar SDRA)</td></tr>
      <tr><td>PaCO₂ / pH</td><td>Hipercapnia permissiva: pH ≥ <strong>7,20–7,25</strong> se necessário</td></tr>
      <tr><td>EtCO₂</td><td>Referência ~35–45 mmHg (≠ PaCO₂ se shunt/V/Q)</td></tr>
    </table>

    <h4>Checklist imediato pós-IOT</h4>
    <div class="emerg-flow-v">
      <span class="emerg-flow-step">Rx tórax — posição do tubo (2–4 cm acima da carina), pneumotórax, infiltrado</span>
      <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
      <span class="emerg-flow-step">Sedação + analgesia — evitar luta com ventilador</span>
      <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
      <span class="emerg-flow-step">Curva de capnografia + ausculta bilateral</span>
      <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
      <span class="emerg-flow-step">Gasometria em 30–60 min · ajustar FiO₂/FR/Vt</span>
      <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
      <span class="emerg-flow-step">Se dessaturação súbita → <strong>DOPE</strong> (ver Guia de emergência)</span>
    </div>
  </div>

  <div class="vm-section-card">
    <h3>⚙️ Ajustes de ventilação</h3>
    <p>Titular em ordem: <strong>oxigenação</strong> (FiO₂ → PEEP) · <strong>ventilação</strong> (FR/Vt) · <strong>pressões</strong> · <strong>hemodinâmica e assincronia</strong>.</p>

    <h4>1. Hipoxemia (SpO₂ &lt; alvo ou PaO₂ baixa)</h4>
    <div class="emerg-flow-v">
      <span class="emerg-flow-step"><strong>FiO₂ ↑</strong> em degraus (ex.: +0,10) até SpO₂ no alvo</span>
      <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
      <span class="emerg-flow-step">Se FiO₂ &gt; 0,6 persistente → <strong>PEEP ↑</strong> (2 cmH₂O por vez) + reavaliar Pplat e PA</span>
      <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
      <span class="emerg-flow-step">Excluir causas reversíveis: deslocamento, obstrução, pneumotórax, equipamento</span>
      <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
      <span class="emerg-flow-step">SDRA grave refratária → prona, óxido nítrico/inotrópico pulmonar, ECMO (centro referência)</span>
    </div>
    <table class="emerg-table">
      <tr><th>Situação</th><th>Conduta</th></tr>
      <tr><td>PaO₂/FiO₂ baixa, complacência ↓</td><td>Vt <strong>6 mL/kg</strong>, PEEP ↑, driving pressure &lt; 15</td></tr>
      <tr><td>Edema cardiogênico / IC</td><td>PEEP moderada + diurese/vasoativos; evitar hipervolemia</td></tr>
      <tr><td>Obesidade</td><td>PEEP mais alta, decúbito rampa, considerar VNI pré-IOT se indicada</td></tr>
    </table>

    <h4>2. Hipercapnia / acidose respiratória (pH &lt; 7,25)</h4>
    <table class="emerg-table">
      <tr><th>Passo</th><th>Ação</th><th>Limite / cuidado</th></tr>
      <tr><td>1</td><td><strong>↑ FR</strong> (+2–4 irpm)</td><td>FR &gt; 30–35 ↑ risco de auto-PEEP</td></tr>
      <tr><td>2</td><td><strong>↑ Vt</strong> (+1 mL/kg PBW)</td><td>Não ultrapassar 8 mL/kg; Pplat &lt; 30</td></tr>
      <tr><td>3</td><td>Tratar causa: broncoespasmo, febre, dor, sedação insuficiente</td><td>—</td></tr>
      <tr><td>4</td><td>Hipercapnia permissiva se SDRA (pH ≥ 7,20)</td><td>Evitar bicarbonato rotineiro</td></tr>
    </table>

    <h4>3. Pressão alta / risco barotrauma</h4>
    <table class="emerg-table">
      <tr><th>Achado</th><th>Interpretação</th><th>Ajuste</th></tr>
      <tr><td>Pico ↑, platô normal</td><td>Resistência ↑ (broncoespasmo, tubo, secreção)</td><td>Broncodilatador, aspirar, trocar filtro/tubo</td></tr>
      <tr><td>P platô ↑</td><td>Complacência ↓ (SDRA, atelectasia, pneumotórax)</td><td>↓ Vt, ↑ PEEP se indicado, Rx, prona</td></tr>
      <tr><td>Driving pressure ↑</td><td>Lesão pulmonar induzida por ventilador</td><td>Vt 6 mL/kg, otimizar PEEP, sedação/BNM se luta</td></tr>
    </table>

    <h4>4. Auto-PEEP / aprisionamento aéreo (DPOC, asma)</h4>
    <ul>
      <li><strong>↓ FR</strong> · prolongar tempo expiratório (I:E 1:3 ou 1:4)</li>
      <li><strong>↓ Vt</strong> se necessário · tratar broncoespasmo (β₂ + corticoide)</li>
      <li>Medir auto-PEEP em pausa expiratória · ajustar trigger se falso trigger</li>
      <li>Evitar FR alta e Vt grande — preferir hipercapnia permissiva controlada</li>
    </ul>

    <h4>5. Assincronia paciente–ventilador</h4>
    <table class="emerg-table">
      <tr><th>Padrão</th><th>Conduta</th></tr>
      <tr><td>Double triggering / esforço excessivo</td><td>↑ sedação/analgesia · revisar Vt insuficiente · trigger mais sensível</td></tr>
      <tr><td>Flow starvation</td><td>↑ fluxo insp. ou mudar para PCV</td></tr>
      <tr><td>Auto-ciclagem</td><td>↓ sensibilidade do trigger · ↑ PEEP se auto-PEEP</td></tr>
      <tr><td>Refratário com hipoxemia/pressão alta</td><td>Bloqueador neuromuscular <strong>curto prazo</strong> + reavaliar causas</td></tr>
    </table>

    <h4>6. Hemodinâmica com PEEP</h4>
    <p>PEEP ↑ reduz retorno venoso — monitorar PA, lactato, perfusão. Se hipotensão após PEEP:</p>
    <ul>
      <li>Fluido cauteloso se hipovolêmico · vasopressor se choque</li>
      <li>Reduzir PEEP temporariamente e tratar causa (pneumotórax, tamponamento)</li>
      <li>Balancear oxigenação vs perfusão com equipe e gasometria</li>
    </ul>

    <h4>Referência rápida PEEP / FiO₂ (SDRA — exemplo ARDSNet)</h4>
    <table class="emerg-table vm-peep-table">
      <tr><th>FiO₂</th><th>0,30</th><th>0,40</th><th>0,50</th><th>0,60</th><th>0,70</th><th>0,80</th><th>0,90</th><th>1,0</th></tr>
      <tr><td><strong>PEEP (cmH₂O)</strong></td><td>5</td><td>5–8</td><td>8–10</td><td>10</td><td>10–12</td><td>12–14</td><td>14–16</td><td>16–20</td></tr>
    </table>
    <p class="emerg-note">Tabela orientativa — usar protocolo institucional e resposta clínica (Pplat, driving pressure, hemodinâmica).</p>
  </div>

  <p class="emerg-note">Ferramenta educacional. Não substitui protocolo de UTI, fisioterapeuta intensivista nem manual do ventilador. Desmame ventilatório (RSBI/TRE): Guia rápido de emergência → Via Aérea &amp; Ventilação.</p>
  <p class="muted vm-build">Build Ventilação mecânica: <strong>${MEDHUB_VM_BUILD}</strong></p>
`;

function initVentilacaoMecanica () {
  const el = document.getElementById('vm-content');
  if (!el || el.dataset.vmBound) return;
  el.dataset.vmBound = '1';
  el.innerHTML = VM_CONTENT;
}

function showVentilacaoMecanicaHome () {
  const list = document.getElementById('vm-list-view');
  if (list) list.hidden = false;
}
