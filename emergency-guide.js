/* Guia rápido de emergência — tópicos e conteúdo — build 98041d1 */

const MEDHUB_EMERG_BUILD = 'avc-fix-3';

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
  },
  {
    id: 'ecg-modelos',
    icon: '📋',
    name: 'Modelos de ECG — SCA',
    html: `
      <p>Traçados reais de referência — compare com o ECG do paciente. <strong>Clique em qualquer imagem para ampliar.</strong> Fonte: Wikimedia Commons (domínio público / CC).</p>

      <div class="emerg-ecg-gallery">
        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-stemi-anterior.jpg" alt="ECG 12 derivações: IAM anterior com supra de ST" class="emerg-ecg-img emerg-ecg-img-strip" loading="lazy">
            <figcaption>IAM anterior — derivações precordiais</figcaption>
          </figure>
          <p><strong>Supra de ST</strong> em V1–V4 (≥ 2 mm em V2–V3 conforme sexo). Conduta: reperfusão imediata (ICP ou fibrinólise).</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-stemi-anterior-clinical.jpg" alt="ECG clínico: supra de ST extenso em derivações anteriores" class="emerg-ecg-img emerg-ecg-img-clinical" loading="lazy">
            <figcaption>IAM anterior — supra ST extenso</figcaption>
          </figure>
          <p><strong>Supra de ST</strong> em derivações anteriores (V2–V6). Pode evoluir com ondas Q. Acionar hemodinâmica — <strong>porta-balão ≤ 90 min</strong>.</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-stemi-inferior.jpg" alt="ECG 12 derivações: IAM inferior com supra ST em II III aVF" class="emerg-ecg-img emerg-ecg-img-strip" loading="lazy">
            <figcaption>IAM inferior — II, III, aVF</figcaption>
          </figure>
          <p><strong>Supra de ST</strong> em II, III e aVF. Observar <strong>infradesnivelamento recíproco</strong> em D1/aVL. Considerar IAM de VD se V1 + V4R.</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-noshock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-noshock">NSTEMI / AI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-nstemi-ischaemia.jpg?v=2" alt="ECG: ST deprimido horizontal — padrão de isquemia subendocárdica (V4–V6)" class="emerg-ecg-img emerg-ecg-img-clinical" loading="lazy">
            <figcaption>Isquemia subendocárdica</figcaption>
          </figure>
          <p><strong>ST deprimido</strong> horizontal ou descendente ≥ 0,5 mm em ≥ 2 derivações contíguas, ou inversão de T. Troponina ↑ = NSTEMI; normal = angina instável. Calcular <strong>GRACE</strong>.</p>
        </div>

        <div class="emerg-ecg-gallery-item emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">EQUIVALENTE STEMI</span>
          <figure class="emerg-ecg-figure">
            <img src="assets/ecg/sca/ecg-lbbb-novo.jpg" alt="ECG: bloqueio de ramo esquerdo novo em contexto de dor torácica" class="emerg-ecg-img emerg-ecg-img-clinical" loading="lazy">
            <figcaption>BRE novo ou presumivelmente novo</figcaption>
          </figure>
          <p><strong>Bloqueio de ramo esquerdo novo</strong> com dor torácica sugestiva = tratar como STEMI (reperfusão imediata). Usar critérios de Sgarbossa / Smith se BRE prévio.</p>
        </div>
      </div>

      <p class="emerg-note">Sempre correlacionar ECG com clínica, troponina seriada e repetir traçado se dor persistir ou piorar.</p>
    `
  }
];

const AVC_PROTOCOLS = [
  {
    id: 'fast',
    icon: '🚑',
    name: 'Fluxo FAST',
    html: `
      <p>Reconhecimento <strong>pré-hospitalar</strong> — identificar AVC, anotar horário e acionar SAMU. Meta: <strong>porta-agulha ≤ 60 min</strong> / <strong>porta-puncao ≤ 90 min</strong> no hospital de referência.</p>

      <h4>Mnemônico FAST</h4>
      <div class="emerg-rhythm-grid emerg-rhythm-grid-2">
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">F — Face</span>
          <p><strong>Assimetria facial</strong> — pedir para sorrir. Queda de um canto da boca, paralisia facial.</p>
        </div>
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">A — Arms</span>
          <p><strong>Queda de um braço</strong> — pedir para elevar os dois braços por 10 s. Queda unilateral ou pronación.</p>
        </div>
        <div class="emerg-rhythm-card">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">S — Speech</span>
          <p><strong>Fala alterada</strong> — pedir para repetir frase simples. Disartria, afasia, mudança súbita da fala.</p>
        </div>
        <div class="emerg-rhythm-card emerg-rhythm-card-shock">
          <span class="emerg-rhythm-tag emerg-rhythm-tag-shock">T — Time</span>
          <p><strong>Tempo é cérebro</strong> — anotar <strong>horário exato</strong> do início dos sintomas ou último momento conhecido bem (LKW). Ligar <strong>192 (SAMU)</strong> imediatamente.</p>
        </div>
      </div>

      <h4>BE-FAST (extensão recomendada)</h4>
      <ul>
        <li><strong>B — Balance:</strong> perda súbita de equilíbrio, vertigem, ataxia</li>
        <li><strong>E — Eyes:</strong> perda visual súbita unilateral ou diplopia</li>
      </ul>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Suspeita FAST/BE-FAST positivo</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Anotar horário dos sintomas / LKW</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Acionar SAMU — informar suspeita de <strong>AVC</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Posicionar paciente (decúbito lateral se rebaixamento), manter VA pérvia</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Glicemia capilar — hipoglicemia mimetiza AVC</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Oxigênio se SpO₂ &lt; 94%; evitar hiper/hipotensão</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">Transporte direto ao centro com capacidade de <strong>TC + trombólise/trombectomia</strong></span>
      </div>

      <h4>Não fazer no pré-hospitalar</h4>
      <ul>
        <li>Não administrar AAS ou anticoagulante antes da TC</li>
        <li>Não atrasar transporte para exame no local</li>
        <li>Não dar alimentação ou líquidos (risco de broncoaspiração)</li>
      </ul>
      <p class="emerg-note">LKW = Last Known Well — último momento em que o paciente estava assintomático. Despertar com déficit: horário do despertar = início.</p>
    `
  },
  {
    id: 'trombolise',
    icon: '💉',
    name: 'Protocolo Trombólise',
    html: `
      <p>Alteplase IV (rt-PA) — janela terapêutica <strong>0–4 h 30 min</strong> do início dos sintomas ou LKW. Exige <strong>TC de crânio sem sangramento</strong> antes da infusão.</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">Chegada — ABC, PA, glicemia, SpO₂, ECG</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step"><strong>TC crânio sem contraste em ≤ 25 min</strong> (porta-imagem)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Confirmar AVC isquêmico + janela ≤ 4 h 30</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">NIHSS + revisar contraindicações ABS/REL</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">PA &lt; 185/110 mmHg (tratar se necessário antes da lise)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">Alteplase <strong>0,9 mg/kg</strong> IV (máx. 90 mg)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">10% em bolus · 90% em infusão contínua <strong>60 min</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Internação UTI/AVC — neurochecks seriados</span>
      </div>

      <table class="emerg-table">
        <tr><th>Janela</th><th>Indicação</th></tr>
        <tr><td><strong>0 – 3 h</strong></td><td>Indicação clássica — avaliar ABS/REL padrão</td></tr>
        <tr><td><strong>3 – 4 h 30</strong></td><td>Indicação estendida — aplicar exclusões adicionais (REL 3–4,5 h)</td></tr>
        <tr><td>&gt; 4 h 30</td><td><strong>Não trombolisar</strong> — avaliar trombectomia se LVO + critérios de imagem</td></tr>
      </table>

      <h4>Contraindicações absolutas (ABS)</h4>
      <ul>
        <li>TC: hemorragia intracraniana ou sangramento ativo</li>
        <li>AVC isquêmico nos <strong>últimos 3 meses</strong></li>
        <li>Trauma craniano grave ou AVC hemorrágico prévio</li>
        <li>Neoplasia intracraniana ou MAV conhecida</li>
        <li>Cirurgia intracraniana / espinhal recente</li>
        <li>PA &gt; 185/110 mmHg refratária ao tratamento</li>
        <li>Plaquetas &lt; 100 000/mm³ · INR &gt; 1,7 · TP &gt; 15 s (varfarina)</li>
        <li>Uso de DOAC com efeito anticoagulante relevante (conforme protocolo local)</li>
        <li>Glicemia &lt; 50 ou &gt; 400 mg/dL</li>
        <li>Infarto multilobar (&gt; 1/3 território ACM na TC)</li>
        <li>Dissecção aórtica · endocardite · plaquetopenia / coagulopatia grave</li>
      </ul>

      <h4>Contraindicações relativas (REL)</h4>
      <ul>
        <li>AVC leve com recuperação rápida (TIA) — não indicar lise</li>
        <li>Gravidez · cirurgia maior recente · sangramento GI/URINário &lt; 21 dias</li>
        <li>IAM recente · punção arterial não compressível &lt; 7 dias</li>
        <li>Convulsão no início se déficit persiste</li>
      </ul>

      <h4>Exclusões adicionais na janela 3 – 4 h 30 (REL)</h4>
      <ul>
        <li>Idade <strong>&gt; 80 anos</strong></li>
        <li>Anticoagulação oral (independente do INR)</li>
        <li><strong>NIHSS &gt; 25</strong></li>
        <li>História prévia de <strong>AVC + diabetes mellitus</strong></li>
      </ul>

      <h4>Pós-trombólise — monitorização</h4>
      <ul>
        <li>Neurochecks: <strong>q 15 min</strong> durante infusão; q 30 min × 6 h; depois q 1 h × 16 h</li>
        <li>PA alvo geral: &lt; 180/105 mmHg nas primeiras 24 h</li>
        <li>Evitar AAS, heparina ou anticoagulante nas <strong>24 h</strong> (salvo indicação formal)</li>
        <li>TC de controle se deterioração neurológica</li>
      </ul>
      <p class="emerg-note">Referência: AHA/ASA 2019 · SBACV. Adaptar às diretrizes e formulário institucional. Meta porta-agulha ≤ 60 min.</p>
    `
  },
  {
    id: 'trombectomia',
    icon: '🔬',
    name: 'Trombectomia mecânica',
    html: `
      <p>Retirada do trombo em <strong>oclusão de grande vaso (LVO)</strong>. Janela clássica <strong>0–6 h</strong>; selecionados até <strong>24 h</strong> com critérios de imagem avançada (DAWN / DEFUSE-3).</p>

      <div class="emerg-flow-v">
        <span class="emerg-flow-step">AVC isquêmico + janela ≤ 24 h</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step"><strong>TC crânio</strong> + <strong>AngioTC</strong> (ou RM) — buscar LVO</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-decision">LVO em grande vaso?</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Calcular <strong>ASPECTS</strong> na TC sem contraste</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step">Trombólise IV se ≤ 4 h 30 e elegível (antes ou paralelo à MT)</span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-shock">Acionar neurointervenção — <strong>trombectomia</strong></span>
        <span class="emerg-flow-arrow" aria-hidden="true">↓</span>
        <span class="emerg-flow-step emerg-flow-loop">Meta porta-puncao ≤ 90 min · reperfusão TICI 2b–3</span>
      </div>

      <h4>LVO — vasos-alvo</h4>
      <table class="emerg-table">
        <tr><th>Vaso</th><th>Localização</th></tr>
        <tr><td><strong>ACI</strong></td><td>Carótida interna (cervical/intracraniana)</td></tr>
        <tr><td><strong>M1</strong></td><td>Segmento M1 da ACM</td></tr>
        <tr><td><strong>M2 proximal</strong></td><td>Divisão superior/inferior da ACM (proximal)</td></tr>
        <tr><td><strong>Basilar</strong></td><td>Artéria basilar (AVC posterior — prioridade máxima)</td></tr>
      </table>

      <h4>ASPECTS (Alberta Stroke Program Early CT Score)</h4>
      <p>Escore na <strong>TC sem contraste</strong> — avalia extensão de isquemia precoce. Pontuação inicial <strong>10</strong>; subtrair <strong>1 ponto</strong> por região com alteração isquêmica precoce:</p>
      <table class="emerg-table">
        <tr><th>Região (território ACM)</th><th>Região (território ACM)</th></tr>
        <tr><td>C · L · IC · I · M1 · M2</td><td>M3 · M4 · M5 · M6</td></tr>
      </table>
      <ul>
        <li><strong>C</strong> = caudado · <strong>L</strong> = lentiforme · <strong>IC</strong> = cápsula interna · <strong>I</strong> = ínsula</li>
        <li><strong>M1–M6</strong> = territórios corticais da ACM (anterior → posterior)</li>
      </ul>

      <table class="emerg-table">
        <tr><th>Janela</th><th>Critérios resumidos</th></tr>
        <tr><td><strong>0 – 6 h</strong></td><td>LVO + ASPECTS <strong>≥ 6</strong> + NIHSS tipicamente ≥ 6 (anterior)</td></tr>
        <tr><td><strong>6 – 24 h</strong></td><td>LVO anterior: mismatch perfusão/núcleo (CTP/RM) ou critérios DAWN (NIHSS + idade + core infarct)</td></tr>
        <tr><td><strong>Basilar</strong></td><td>LVO basilar — janela ampliada; não usar ASPECTS; tratar como emergência absoluta</td></tr>
      </table>

      <h4>Estratégias de rede</h4>
      <ul>
        <li><strong>Mothership:</strong> transporte direto ao centro com neurointervenção</li>
        <li><strong>Drip-and-ship:</strong> trombólise no hospital periférico + transferência imediata para MT</li>
        <li>Contato precoce com equipe de neurointervenção assim que LVO confirmado</li>
      </ul>
      <p class="emerg-note">ASPECTS ≤ 5 ou extensa área de infarto na TC basal sugere menor benefício — individualizar com imagem avançada. Basilar: considerar MT mesmo com NIHSS baixo se LVO confirmado.</p>
    `
  },
  {
    id: 'nihss',
    icon: '📋',
    name: 'NIHSS',
    html: `
      <p><strong>NIH Stroke Scale</strong> — padroniza gravidade do déficit neurológico (0–42). Preencha cada item e calcule para ver classificação e conduta sugerida.</p>

      <div class="calc-block calc-block-single emerg-calc-block emerg-calc-wide">
        <form class="calc-form" data-emerg-calc="nihss">
          ${typeof NIHSS_FORM_HTML !== 'undefined' ? NIHSS_FORM_HTML : '<p class="muted">Recarregue a página para carregar a calculadora.</p>'}
          <button type="submit">Calcular NIHSS</button>
        </form>
        <div class="calc-result" hidden></div>
      </div>

      <h4>Tabela de referência — interpretação</h4>
      <table class="emerg-table">
        <tr><th>NIHSS</th><th>Classificação</th><th>Implicação clínica</th></tr>
        <tr><td>0</td><td>Sem déficit</td><td>Investigar mimics; repetir avaliação</td></tr>
        <tr><td>1 – 4</td><td>AVC leve</td><td>Prognóstico favorável; avaliar elegibilidade à lise</td></tr>
        <tr><td>5 – 15</td><td>Moderado</td><td>Maioria dos candidatos à reperfusão</td></tr>
        <tr><td>16 – 20</td><td>Moderado-grave</td><td>Alto risco; monitorização intensiva</td></tr>
        <tr><td>21 – 42</td><td>Grave</td><td>NIHSS &gt; 25 = exclusão na janela 3–4,5 h para lise</td></tr>
      </table>

      <h4>Quando aplicar</h4>
      <ul>
        <li><strong>Admissão</strong> — antes de decidir trombólise / trombectomia</li>
        <li><strong>2 h e 24 h</strong> pós-trombólise (protocolo padrão)</li>
        <li><strong>Pré e pós trombectomia</strong> — documentar resposta (Δ NIHSS)</li>
        <li>Reavaliar se deterioração ou suspeita de transformação hemorrágica</li>
      </ul>
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
    protocols: AVC_PROTOCOLS
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

function ensureEmergEcgLightbox () {
  if (document.getElementById('emerg-ecg-lightbox')) return;

  const lb = document.createElement('div');
  lb.id = 'emerg-ecg-lightbox';
  lb.className = 'emerg-ecg-lightbox';
  lb.hidden = true;
  lb.innerHTML = `
    <button type="button" class="emerg-ecg-lightbox-close" aria-label="Fechar">×</button>
    <figure class="emerg-ecg-lightbox-inner">
      <img id="emerg-ecg-lightbox-img" alt="">
      <figcaption id="emerg-ecg-lightbox-caption"></figcaption>
    </figure>
    <p class="emerg-ecg-lightbox-hint">Clique fora ou pressione Esc para fechar</p>`;
  document.body.appendChild(lb);

  const close = () => closeEmergEcgLightbox();
  lb.querySelector('.emerg-ecg-lightbox-close').addEventListener('click', close);
  lb.addEventListener('click', e => {
    if (e.target === lb) close();
  });
  lb.querySelector('.emerg-ecg-lightbox-inner').addEventListener('click', e => e.stopPropagation());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lb.hidden) close();
  });
}

function closeEmergEcgLightbox () {
  const lb = document.getElementById('emerg-ecg-lightbox');
  if (!lb || lb.hidden) return;
  lb.hidden = true;
  document.body.classList.remove('emerg-ecg-lightbox-open');
  const img = document.getElementById('emerg-ecg-lightbox-img');
  if (img) img.removeAttribute('src');
}

function initEmergEcgLightbox (container) {
  if (!container) return;
  ensureEmergEcgLightbox();

  const lb = document.getElementById('emerg-ecg-lightbox');
  const lbImg = document.getElementById('emerg-ecg-lightbox-img');
  const lbCaption = document.getElementById('emerg-ecg-lightbox-caption');

  container.querySelectorAll('.emerg-ecg-img').forEach(img => {
    if (img.dataset.ecgZoomBound) return;
    img.dataset.ecgZoomBound = '1';
    img.classList.add('emerg-ecg-img-clickable');
    img.title = 'Clique para ampliar';
    img.addEventListener('click', () => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      const caption = img.closest('figure')?.querySelector('figcaption');
      lbCaption.textContent = caption?.textContent?.trim() || img.alt;
      lb.hidden = false;
      document.body.classList.add('emerg-ecg-lightbox-open');
    });
  });
}

function initEmergCalcForms (container) {
  if (!container) return;

  container.querySelectorAll('form[data-emerg-calc]').forEach(form => {
    if (form.dataset.emergCalcBound) return;
    form.dataset.emergCalcBound = '1';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const calcId = form.dataset.emergCalc;
      const calc = typeof CALC_FORMS !== 'undefined'
        ? CALC_FORMS[calcId]
        : (typeof CALC_NEURO !== 'undefined' ? CALC_NEURO[calcId] : null);

      if (!calc) return;

      const html = calc.calculate(form);
      const resultEl = form.parentElement.querySelector('.calc-result');
      if (resultEl && typeof html === 'string') {
        resultEl.innerHTML = html;
        resultEl.hidden = false;
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

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
    initEmergEcgLightbox(contentEl);
    return;
  }

  const expectedProtocols = { 'parada-cardio': 6, 'sca': 4, 'avc': 4 };
  if (expectedProtocols[topicId]) {
    contentEl.innerHTML = `
      <p class="coming-soon"><strong>Arquivo desatualizado no navegador.</strong> Os protocolos de <em>${topic.name}</em> já existem no projeto, mas o navegador carregou uma versão antiga de <code>emergency-guide.js</code>.</p>
      <ul>
        <li>Feche esta aba e abra de novo: <code>C:\\Users\\User\\Desktop\\meu-app-medico\\app.html</code></li>
        <li>Pressione <strong>Ctrl+F5</strong> (ou abra em aba anônima)</li>
        <li>No menu lateral deve aparecer: <strong>Build 2026.06.08 · AVC</strong></li>
      </ul>
      <p class="emerg-note">Build esperado do guia: <strong>${MEDHUB_EMERG_BUILD}</strong> (arquivo <code>emergency-guide.js</code>)</p>`;
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

  const contentEl = document.getElementById('emerg-topic-content');
  contentEl.innerHTML = `
    <div class="emerg-algo-block emerg-algo-single">
      ${protocol.html}
    </div>`;
  initEmergEcgLightbox(contentEl);
  initEmergCalcForms(contentEl);
}
