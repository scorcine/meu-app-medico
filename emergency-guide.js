/* Guia rápido de emergência — tópicos e conteúdo */

const PARADA_PROTOCOLS = [
  {
    id: 'bls-adulto',
    icon: '🫀',
    name: 'Adulto – BLS 2025',
    html: `
      <p>Reconhecimento rápido, RCP de alta qualidade e DEA em <strong>≤ 2 minutos</strong>.</p>
      <ol class="emerg-steps">
        <li><strong>Segurança</strong> — verificar cena segura.</li>
        <li><strong>Responsividade</strong> — estimular o paciente; se não responder, acionar ajuda e buscar DEA/monitor.</li>
        <li><strong>Respiração e pulso</strong> — avaliar respiração anormal e pulso carotídeo/femoral simultaneamente por <strong>≤ 10 s</strong>.</li>
        <li><strong>RCP imediata</strong> — se sem pulso: compressões torácicas <strong>100–120/min</strong>, profundidade <strong>5–6 cm</strong>, retorno total do tórax, mínimas pausas.</li>
        <li><strong>Ventilação</strong> — se treinado: relação <strong>30:2</strong> ou dispositivo bolsa-válvula-máscara com O₂; evitar hiperventilação.</li>
        <li><strong>DEA</strong> — ligar, aplicar eletrodos, seguir comandos de voz; <strong>análise de ritmo em ≤ 2 min</strong> do início da RCP.</li>
        <li><strong>Choque indicado</strong> — retomar compressões imediatamente após o choque; ciclo de <strong>2 min</strong> entre análises.</li>
      </ol>
      <h4>Metas de qualidade</h4>
      <ul>
        <li>Trocar compressor a cada <strong>2 min</strong></li>
        <li>Profundidade e frequência adequadas; evitar ventilação excessiva</li>
        <li>Capnografia, se disponível, alvo PETCO₂ ≥ 10 mmHg durante RCP</li>
      </ul>
    `
  },
  {
    id: 'acls-adulto',
    icon: '💉',
    name: 'Adulto – ACLS',
    html: `
      <p>Manter RCP de alta qualidade, acesso IV/IO, medicações e choques conforme ritmo.</p>

      <h4>Ritmo chocável (FV / TV sem pulso)</h4>
      <p class="emerg-rhythm-intro">Dois ritmos que exigem <strong>desfibrilação imediata</strong> — confirmar ausência de pulso antes de choque:</p>
      <div class="emerg-rhythm-grid emerg-rhythm-grid-2">
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-fv.jpg" alt="ECG real: fibrilação ventricular — traçado caótico irregular sem complexos QRS organizados" class="emerg-ecg-img" width="672" height="110" loading="eager" decoding="async">
            <figcaption>FV — fibrilação ventricular</figcaption>
          </figure>
          <p>Ondas caóticas em “serrilhado”, <strong>sem QRS ou onda P</strong> identificáveis; ritmo totalmente irregular.</p>
          <p class="emerg-rhythm-hint">Pós-IAM, cardiopatia, QT longo.</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-tv-pulseless.png" alt="ECG real: taquicardia ventricular monomórfica — QRS largo regular sem pulso" class="emerg-ecg-img" width="800" height="200" loading="eager" decoding="async">
            <figcaption>TV sem pulso — QRS largo regular (monomórfica)</figcaption>
          </figure>
          <p>QRS largo (&gt; 120 ms), taquicardia <strong>regular</strong>; frequência alta — <strong>sem pulso central</strong>.</p>
          <p class="emerg-rhythm-hint">≠ TV com pulso (paciente estável → cardioversão).</p>
        </div>
      </div>

      <h4>Ritmo não chocável (AESP / assistolia)</h4>
      <p class="emerg-rhythm-intro">Sem pulso e traçado <strong>não chocável</strong> — <strong>não desfibrilar</strong>; iniciar RCP + epinefrina e tratar causas reversíveis.</p>
      <p class="emerg-flow-question">Identifique o padrão no monitor:</p>
      <div class="emerg-rhythm-grid">
        <div class="emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NÃO CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-asistolia.svg" alt="ECG: assistolia — linha isoelétrica sem atividade elétrica" class="emerg-ecg-img" loading="lazy">
            <figcaption>Assistolia</figcaption>
          </figure>
          <p>Linha reta / isoelétrica — <strong>ausência de atividade elétrica</strong> discernível (confirmar cabos, ganho e derivações).</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NÃO CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-aesp.svg" alt="ECG: AESP — complexos QRS organizados estreitos sem pulso" class="emerg-ecg-img" loading="lazy">
            <figcaption>AESP — QRS estreito organizado</figcaption>
          </figure>
          <p>Atividade elétrica <strong>organizada</strong> (ex.: ritmo sinusal, ESV) porém <strong>sem pulso</strong> — AESP/PEA.</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NÃO CHOCAR</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/ecg-aesp-lenta.svg" alt="ECG: AESP bradicárdica — QRS largo lento sem pulso" class="emerg-ecg-img" loading="lazy">
            <figcaption>AESP — bradicardia / idioventricular</figcaption>
          </figure>
          <p>Complexos <strong>largos e lentos</strong> ou bradicardia extrema — ainda é AESP se <strong>sem pulso</strong> (≠ bradicardia com pulso).</p>
        </div>
      </div>

      <div class="emerg-flowcharts-row">
        <div class="emerg-flow-col emerg-flow-col-shock">
          <h4>Fluxograma — ritmo chocável</h4>
          <div class="emerg-flow-v" aria-label="Fluxograma ritmo chocavel">
            <span class="emerg-flow-step">RCP + DEA</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP 2 min</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">1º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP 2 min</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">2º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP + ES</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">3º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP + AMIOD 300</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">4º CHOC</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP + AMIOD 150</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop">ES q3–5 min · reavaliar ritmo</span>
          </div>
        </div>

        <div class="emerg-flow-col emerg-flow-col-noshock">
          <h4>Fluxograma — ritmo não chocável</h4>
          <div class="emerg-flow-v" aria-label="Fluxograma ritmo nao chocavel">
            <span class="emerg-flow-step">Analisar ritmo ≤ 10 s</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-decision">Assistolia ou AESP</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-noshock">NÃO CHOCAR — RCP imediata</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">RCP 30:2 ou compressões contínuas</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Epinefrina 1 mg IV/IO</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Repetir ES q3–5 min</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Tratar 5H + 5T</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Via aérea + capnografia</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop">Reavaliar a cada 2 min</span>
          </div>
        </div>
      </div>

      <table class="emerg-table">
        <tr><th>Medicação</th><th>Dose</th><th>Observação</th></tr>
        <tr><td>Epinefrina (ES)</td><td>1 mg IV/IO</td><td>A cada 3–5 min (após 2º choque no chocável)</td></tr>
        <tr><td>Amiodarona (AMIOD)</td><td>300 mg IV/IO → 150 mg</td><td>Após 3º choque; alternativa: lidocaína 1–1,5 mg/kg</td></tr>
        <tr><td>Desfibrilação</td><td>120–200 J bifásico</td><td>Escalar se necessário; retomar RCP imediatamente</td></tr>
      </table>

      <div class="emerg-reversible-box">
        <h4>Causas reversíveis (5H + 5T)</h4>
        <div class="emerg-reversible-grid">
          <ul>
            <li><strong>H</strong>ipovolemia</li>
            <li><strong>H</strong>ipóxia</li>
            <li><strong>H</strong>⁺ (acidose)</li>
            <li><strong>H</strong>ipo / hipercalemia</li>
            <li><strong>H</strong>ipotermia</li>
          </ul>
          <ul>
            <li><strong>T</strong>amponamento</li>
            <li><strong>T</strong>ensão (pneumotórax)</li>
            <li><strong>T</strong>EP</li>
            <li><strong>T</strong>oxinas</li>
            <li><strong>T</strong>rombose (IAM / TEP)</li>
          </ul>
        </div>
      </div>
      <p class="emerg-note">Confirmar assistolia: ganho adequado, derivações corretas, dupla checagem. Ritmo organizado com pulso = não é parada — tratar bradicardia/taquicardia conforme estabilidade.</p>
    `
  },
  {
    id: 'pals-ped',
    icon: '👶',
    name: 'Pediátrico – PALS',
    html: `
      <p>Adaptar doses ao peso; priorizar oxigenação e ventilação (hipóxia e hipovolemia são causas frequentes).</p>
      <h4>Parada — sequência geral</h4>
      <ol class="emerg-steps">
        <li><strong>Avaliar ABC</strong> — oxigênio, monitor/cardioversor pediátrico, acesso IV/IO.</li>
        <li><strong>RCP</strong> — 1 socorrista: <strong>30:2</strong>; 2 socorristas: <strong>15:2</strong>; compressões <strong>100–120/min</strong>, profundidade ~1/3 do tórax.</li>
        <li><strong>Ritmo chocável</strong> — choque <strong>2 J/kg</strong> (1º), depois <strong>4 J/kg</strong>; subsequentes ≥ 4 J/kg (máx. 10 J/kg ou dose adulta).</li>
        <li><strong>Epinefrina</strong> — <strong>0,01 mg/kg</strong> IV/IO (0,1 mL/kg de 1:10.000) a cada <strong>3–5 min</strong>.</li>
        <li><strong>Amiodarona</strong> — <strong>5 mg/kg</strong> IV/IO (máx. 300 mg) nos ritmos chocáveis refratários.</li>
      </ol>
      <h4>Doses rápidas por peso (referência)</h4>
      <table class="emerg-table">
        <tr><th>Peso</th><th>Epinefrina 0,01 mg/kg</th><th>Amiodarona 5 mg/kg</th><th>1º choque 2 J/kg</th></tr>
        <tr><td>10 kg</td><td>0,1 mg (1 mL 1:10.000)</td><td>50 mg</td><td>20 J</td></tr>
        <tr><td>15 kg</td><td>0,15 mg</td><td>75 mg</td><td>30 J</td></tr>
        <tr><td>20 kg</td><td>0,2 mg</td><td>100 mg</td><td>40 J</td></tr>
        <tr><td>30 kg</td><td>0,3 mg</td><td>150 mg</td><td>60 J</td></tr>
      </table>
      <p class="emerg-note">Bradicardia sintomática pediátrica: epinefrina 0,01 mg/kg ou atropina 0,02 mg/kg (mín. 0,1 mg) antes de considerar marcapasso.</p>
    `
  },
  {
    id: 'bradicardia',
    icon: '🐢',
    name: 'Ritmo lentificado (< 50 bpm)',
    html: `
      <p>Bradicardia com <strong>instabilidade hemodinâmica</strong> (hipotensão, alteração de consciência, dor torácica, ICC).</p>
      <ol class="emerg-steps">
        <li><strong>O₂ + monitor + acesso IV</strong> — identificar fármacos causadores (β-bloqueador, BCC, digoxina).</li>
        <li><strong>Atropina 1 mg IV</strong> — repetir a cada <strong>3–5 min</strong> (dose máx. <strong>3 mg</strong>).</li>
        <li><strong>Se refratária ou bloqueio AV de alto grau</strong> — <strong>marcapasso transcutâneo</strong> imediato; aumentar corrente até captura.</li>
        <li><strong>Enquanto prepara marcapasso</strong> — epinefrina 2–10 µg/min ou dopamina 5–20 µg/kg/min.</li>
        <li><strong>Tratar causa</strong> — IAM inferior, hipercalemia, intoxicação, hipotermia.</li>
      </ol>
      <p class="emerg-note">Atropina não é eficaz em bloqueio AV de 2º grau Mobitz II ou 3º grau — priorizar marcapasso.</p>
    `
  },
  {
    id: 'taquicardia',
    icon: '⚡',
    name: 'Taquicardia instável',
    html: `
      <p>Instabilidade = hipotensão, rebaixamento de consciência, isquemia miocárdica ou edema agudo de pulmão.</p>
      <ol class="emerg-steps">
        <li><strong>Sincronizar monitor</strong> — confirmar QRS estreito vs largo e regularidade.</li>
        <li><strong>Choque sincronizado imediato</strong> — sedação/analgesia se consciente e tempo permitir.</li>
        <li><strong>Energia sugerida (bifásico)</strong>
          <ul>
            <li>QRS estreito regular (TSV): <strong>50–100 J</strong></li>
            <li>QRS estreito irregular (FA): <strong>120–200 J</strong></li>
            <li>QRS largo regular (TV): <strong>100 J</strong> sincronizado</li>
            <li>QRS largo irregular: considerar desfibrilação <strong>assíncrona</strong> (alta energia)</li>
          </ul>
        </li>
        <li><strong>Se persiste ou recorre</strong> — <strong>amiodarona 150 mg</strong> em 10 min; seguida de infusão 1 mg/min × 6 h, depois 0,5 mg/min.</li>
        <li><strong>Alternativas</strong> — procainamida 20–50 mg/min (máx. 17 mg/kg) ou sotalol 100 mg IV (se QRS estreito).</li>
      </ol>
      <p class="emerg-note">Taquicardia <em>estável</em>: manobras vagais (TSV), adenosina 6 mg → 12 mg, ou controle de frequência — não cardioverter de imediato.</p>
    `
  },
  {
    id: 'rosc',
    icon: '✅',
    name: 'ROSC pós-PCR',
    html: `
      <p>Retorno de circulação espontânea — foco em perfusão, neuroproteção e causa base.</p>
      <ol class="emerg-steps">
        <li><strong>Via aérea e ventilação</strong> — SpO₂ alvo <strong>92–98%</strong> (evitar hiperóxia); capnografia; evitar hiperventilação.</li>
        <li><strong>Controle de temperatura (TTM)</strong> — se comatoso, manter <strong>32–36 °C</strong> por ≥ 24 h; tratar febre agressivamente.</li>
        <li><strong>Pressão arterial</strong> — alvo prático <strong>PAM ≥ 65 mmHg</strong> ou PAS ≥ 90 mmHg; noradrenalina/vasopressina se hipotensão persistente.</li>
        <li><strong>Glicemia</strong> — checar imediatamente; manter <strong>140–180 mg/dL</strong>; evitar hipoglicemia (&lt; 70) e hiperglicemia severa.</li>
        <li><strong>ECG 12 derivações</strong> — IAM → cateterismo de urgência; tratar arritmias e causas (TEP, intoxicação, etc.).</li>
        <li><strong>Gasometria, lactato, eletrólitos</strong> — corrigir K⁺, Ca²⁺, acidose; considerar TC cerebral se causa neurológica.</li>
        <li><strong>Sedação/analgesia</strong> — se ventilado; evitar convulsões não tratadas; prognóstico neurológico ≥ 72 h.</li>
      </ol>
      <table class="emerg-table">
        <tr><th>Parâmetro</th><th>Alvo pós-ROSC</th></tr>
        <tr><td>SpO₂</td><td>92–98%</td></tr>
        <tr><td>Temperatura</td><td>32–36 °C (TTM) ou normotermia estrita</td></tr>
        <tr><td>PAM</td><td>≥ 65 mmHg</td></tr>
        <tr><td>Glicemia</td><td>140–180 mg/dL</td></tr>
        <tr><td>EtCO₂</td><td>35–45 mmHg (ajustar ventilação)</td></tr>
      </table>
      <p class="emerg-note">Referência: diretrizes AHA 2020/2025 (BLS/ACLS/PALS). Adaptar ao protocolo institucional.</p>
    `
  }
];

const SCA_PROTOCOLS = [
  {
    id: 'dor-inicial',
    icon: '🩺',
    name: 'Dor torácica inicial',
    html: `
      <p>Suspeita de SCA até prova em contrário — <strong>ECG em ≤ 10 min</strong> do primeiro contato médico.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Avaliar estabilidade — ABC, SpO₂, PA, FC, ritmo</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Dor torácica sugestiva de isquemia?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step"><strong>ECG 12 derivações em ≤ 10 min</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Acesso venoso + troponina (serial) + eletrólitos + função renal</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Monitor contínuo + oxigênio se SpO₂ &lt; 90%</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Ácido acetilsalicílico 150–300 mg VO (mastigar) — se não contraindicado</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Classificar: STEMI · NSTEMI · Angina instável</span>
      </div>

      <h4>Sinais de alerta — instabilidade</h4>
      <ul>
        <li>Hipotensão, choque, arritmia maligna</li>
        <li>Dor refratária, ICC aguda, alteração de consciência</li>
        <li>→ estabilizar e acionar hemodinâmica / UTI</li>
      </ul>

      <table class="emerg-table">
        <tr><th>Conduta</th><th>Indicação</th></tr>
        <tr><td>Nitrato SL</td><td>Dor persistente, PA sistólica &gt; 90 mmHg, sem suspeita de VD / estenose aórtica</td></tr>
        <tr><td>Morfina</td><td>Dor refratária (usar com cautela — pode mascarar evolução)</td></tr>
        <tr><td>Anticoagulação</td><td>Conforme tipo de SCA (heparina / enoxaparina)</td></tr>
      </table>
      <p class="emerg-note">Repetir ECG se dor recorrer ou instabilidade — supra ST pode ser intermitente.</p>
    `
  },
  {
    id: 'stemi',
    icon: '🚨',
    name: 'STEMI',
    html: `
      <p>Supra de ST ou equivalente — reperfusão <strong>imediata</strong>. Metas: <strong>porta-balão ≤ 90 min</strong> ou <strong>fibrinólise ≤ 30 min</strong> se ICP indisponível.</p>

      <h4>Critérios ECG (resumo)</h4>
      <ul>
        <li>Supra ST ≥ 1 mm em ≥ 2 derivações contíguas (exceto V2–V3: ≥ 2 mm homens &gt;40 a; ≥ 1,5 mm homens &lt;40 a; ≥ 1 mm mulheres)</li>
        <li>Bloqueio de ramo esquerdo <strong>novo</strong> ou presumivelmente novo</li>
        <li>Equivalentes: de Winter, Wellens, supra ST em aVR com difuso ST↓</li>
      </ul>

      <div class="emerg-flowcharts-row">
        <div class="emerg-flow-col emerg-flow-col-shock">
          <h4>ICP primária (preferencial)</h4>
          <div class="emerg-flow-v">
            <span class="emerg-flow-step">Confirmar STEMI + acionar equipe / hemodinâmica</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">AAS 150–300 mg + P2Y12 (clopidogrel / ticagrelor / prasugrel)</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Anticoagulante (heparina ou enoxaparina)</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">Cateterismo + angioplastia</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop"><strong>Porta-balão ≤ 90 min</strong></span>
          </div>
        </div>

        <div class="emerg-flow-col emerg-flow-col-noshock">
          <h4>Fibrinólise (se ICP indisponível)</h4>
          <div class="emerg-flow-v">
            <span class="emerg-flow-step">Sem contraindicações + sintomas &lt; 12 h</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">AAS + heparina + P2Y12 conforme protocolo</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step">Alteplase / tenecteplase / reteplase / estreptoquinase</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-shock">Transferir para ICP após lise (estratégia farmaco-invasiva)</span>
            <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
            <span class="emerg-flow-step emerg-flow-loop"><strong>Porta-agulha ≤ 30 min</strong></span>
          </div>
        </div>
      </div>

      <h4>Contraindicações absolutas à fibrinólise</h4>
      <ul>
        <li>AVC hemorrágico ou isquêmico &lt; 3 meses</li>
        <li>Neoplasia / MAV cerebral, dissecção aórtica</li>
        <li>Sangramento ativo, cirurgia maior &lt; 3 semanas</li>
        <li>Trauma craniano grave recente</li>
      </ul>
      <p class="emerg-note">Porta-balão = tempo da chegada ao hospital até inflação do balão. Porta-agulha = chegada até início da fibrinólise.</p>
    `
  },
  {
    id: 'nstemi-ua',
    icon: '📊',
    name: 'NSTEMI / Angina instável',
    html: `
      <p>Sem supra ST — estratificar risco (GRACE) e definir estratégia invasiva precoce ou conservadora.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Confirmar ausência de STEMI no ECG</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Troponina elevada (NSTEMI) ou normal com alta suspeita (AI)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">AAS + P2Y12 + anticoagulação</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">Calcular escore GRACE</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock"><strong>GRACE ≥ 140</strong> → estratégia invasiva &lt; <strong>24 h</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">GRACE 109–139 → invasiva &lt; 72 h (alto risco)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">GRACE &lt; 109 → avaliar estratégia conservadora / invasiva eletiva</span>
      </div>

      <table class="emerg-table">
        <tr><th>GRACE (mortalidade hospitalar)</th><th>Estratégia sugerida</th></tr>
        <tr><td><strong>≥ 140</strong></td><td>Muito alto risco — cateterismo &lt; <strong>24 h</strong></td></tr>
        <tr><td>109 – 139</td><td>Alto risco — invasiva &lt; 72 h</td></tr>
        <tr><td>&lt; 109</td><td>Risco intermediário/baixo — individualizar</td></tr>
      </table>

      <h4>Indicadores de invasão imediata (&lt; 2 h) — independente do GRACE</h4>
      <ul>
        <li>Instabilidade hemodinâmica ou arritmia ameaçadora à vida</li>
        <li>Dor torácica refratária ao tratamento médico</li>
        <li>Complicações mecânicas (IAM com choque, MR aguda, VSR)</li>
        <li>Arritmias ventriculares recorrentes</li>
      </ul>
      <p class="emerg-note">Use a calculadora GRACE nas Calculadoras essenciais (Cardiologia) para estratificação precisa.</p>
    `
  }
];

const EMERGENCY_TOPICS = [
  {
    id: 'parada-cardio',
    icon: '⚡',
    name: 'Parada Cardiorrespiratória',
    protocols: PARADA_PROTOCOLS
  },
  {
    id: 'sca',
    icon: '❤️‍🔥',
    name: 'Síndromes Coronarianas Agudas',
    protocols: SCA_PROTOCOLS
  },
  {
    id: 'avc',
    icon: '🧠',
    name: 'AVC Isquêmico',
    protocols: []
  },
  {
    id: 'sepse',
    icon: '🩸',
    name: 'Sepse & Choque Séptico',
    protocols: []
  },
  {
    id: 'trauma',
    icon: '🆘',
    name: 'Trauma & Suporte Avançado',
    protocols: []
  },
  {
    id: 'via-aerea',
    icon: '🌬️',
    name: 'Via Aérea & Ventilação',
    protocols: []
  },
  {
    id: 'reacoes-metabolicas',
    icon: '💊',
    name: 'Reações Agudas & Metabólicas',
    protocols: []
  },
  {
    id: 'obstetricia',
    icon: '🤰',
    name: 'Obstetrícia de Urgência',
    protocols: []
  },
  {
    id: 'pediatrica',
    icon: '👶',
    name: 'Emergências Pediátricas',
    protocols: []
  },
  {
    id: 'toxicologia',
    icon: '☠️',
    name: 'Toxicologia & Ambientais',
    protocols: []
  },
  {
    id: 'pressao-arritmias',
    icon: '🔺',
    name: 'Pressão & Arritimias Agudas',
    protocols: []
  },
  {
    id: 'procedimentos',
    icon: '🛠️',
    name: 'Procedimentos & Checklists',
    protocols: []
  }
];

let currentEmergTopicId = null;
let currentEmergProtocolId = null;

function initGuiaEmergencia () {
  const grid = document.getElementById('emerg-topic-grid');
  if (!grid) return;

  grid.innerHTML = EMERGENCY_TOPICS.map(topic => `
    <button type="button" class="calc-category-btn" data-emerg-topic="${topic.id}">
      <span class="calc-category-icon">${topic.icon}</span>
      <span class="calc-category-name">${topic.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('[data-emerg-topic]').forEach(btn => {
    btn.addEventListener('click', () => showEmergenciaTopic(btn.dataset.emergTopic));
  });
}

function showEmergenciaCategories () {
  const listView = document.getElementById('emerg-categories-view');
  const topicView = document.getElementById('emerg-topic-view');
  if (!listView || !topicView) return;

  currentEmergTopicId = null;
  currentEmergProtocolId = null;
  listView.hidden = false;
  topicView.hidden = true;
}

function showEmergenciaTopic (topicId) {
  const topic = EMERGENCY_TOPICS.find(t => t.id === topicId);
  if (!topic) return;

  currentEmergTopicId = topicId;
  currentEmergProtocolId = null;
  document.getElementById('emerg-categories-view').hidden = true;
  document.getElementById('emerg-topic-view').hidden = false;
  document.getElementById('emerg-topic-title').textContent = `${topic.icon} ${topic.name}`;

  const backBtn = document.getElementById('emerg-topic-back');
  backBtn.textContent = '← Voltar aos protocolos';
  backBtn.onclick = showEmergenciaCategories;

  const contentEl = document.getElementById('emerg-topic-content');
  const protocols = topic.protocols || [];

  if (protocols.length) {
    contentEl.innerHTML = `
      <p class="muted">Escolha o algoritmo que deseja consultar:</p>
      <div class="calc-category-grid">
        ${protocols.map(p => `
          <button type="button" class="calc-category-btn" data-emerg-protocol="${p.id}">
            <span class="calc-category-icon">${p.icon}</span>
            <span class="calc-category-name">${p.name}</span>
          </button>
        `).join('')}
      </div>`;

    contentEl.querySelectorAll('[data-emerg-protocol]').forEach(btn => {
      btn.addEventListener('click', () => showEmergenciaProtocol(btn.dataset.emergProtocol));
    });
    return;
  }

  if (topic.html && topic.html.trim()) {
    contentEl.innerHTML = topic.html;
    return;
  }

  contentEl.innerHTML = `
    <p class="coming-soon">Conteúdo em construção — adicione algoritmos em <strong>emergency-guide.js</strong> no array <code>protocols</code> deste tópico.</p>`;
}

function showEmergenciaProtocol (protocolId) {
  const topic = EMERGENCY_TOPICS.find(t => t.id === currentEmergTopicId);
  if (!topic) return;

  const protocol = (topic.protocols || []).find(p => p.id === protocolId);
  if (!protocol) return;

  currentEmergProtocolId = protocolId;
  document.getElementById('emerg-topic-title').textContent = `${protocol.icon} ${protocol.name}`;

  const backBtn = document.getElementById('emerg-topic-back');
  backBtn.textContent = '← Voltar aos algoritmos';
  backBtn.onclick = () => showEmergenciaTopic(currentEmergTopicId);

  document.getElementById('emerg-topic-content').innerHTML = `
    <div class="emerg-algo-block emerg-algo-single">
      ${protocol.html}
    </div>`;
}
