#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
let failures = 0;
const pass = text => console.log('  OK   ' + text);
const fail = text => { failures += 1; console.error('  FAIL ' + text); };

async function run () {
  const dom = new JSDOM(`<!doctype html><body>
    <input id="cons-filter">
    <p id="cons-empty"></p>
    <p id="cons-locked"></p>
    <ul id="cons-list"></ul>
  </body>`, { url: 'https://www.medhub.ia.br/app.html' });

  dom.window.getSession = () => ({ email: 'medico@teste.com', name: 'Dra. Teste' });
  dom.window.confirm = () => true;
  dom.window.medhubCloudPushClinical = async () => ({ ok: true, updatedAt: new Date().toISOString() });
  dom.window.medhubCloudSyncEnabledByUser = () => true;

  const context = vm.createContext(dom.window);
  for (const file of ['clinical-storage.js', 'consultas.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context);
  }

  const result = await vm.runInContext(`consultasRegisterEmergencyProtocol({
    sourceId: 'emergency:stemi:2026-08-15T20:00:00-03:00',
    protocolo: 'STEMI',
    pacienteNome: 'Paciente Nuvem',
    data: '15/08/2026 20:00',
    queixa: 'Dor torácica',
    medico: 'Dra. Teste',
    crm: 'CRM-SP 123456',
    reperfusao: 'success',
    summaryHtml: '<h1>STEMI</h1>',
    summaryText: 'Critérios de reperfusão\\nResultado: reperfusão satisfatória.'
  })`, context);

  const list = await vm.runInContext(`clinicalLoadList('consultas')`, context);
  if (result.ok && result.cloudSaved && list.length === 1) {
    pass('Atendimento finalizado é salvo e enviado imediatamente à nuvem');
  } else {
    fail('Persistência do atendimento falhou: ' + JSON.stringify({ result, list }));
  }

  if (list[0]?.reperfusao === 'success' &&
      /Critérios de reperfusão/.test(list[0]?.conduta || '') &&
      list[0]?.crm === 'CRM-SP 123456') {
    pass('Registro preserva reperfusão, resumo e CRM');
  } else {
    fail('Registro clínico incompleto: ' + JSON.stringify(list[0]));
  }

  await vm.runInContext(`consultasRegisterEmergencyProtocol({
    sourceId: 'emergency:stemi:2026-08-15T20:00:00-03:00',
    protocolo: 'STEMI',
    pacienteNome: 'Paciente Nuvem',
    summaryText: 'Resumo atualizado',
    reperfusao: 'failure'
  })`, context);
  const updated = await vm.runInContext(`clinicalLoadList('consultas')`, context);
  if (updated.length === 1 && updated[0].reperfusao === 'failure') {
    pass('Finalizar novamente atualiza o atendimento sem duplicar paciente');
  } else {
    fail('Deduplicação falhou: ' + JSON.stringify(updated));
  }

  await vm.runInContext(`consultasRenderList()`, context);
  const rendered = dom.window.document.getElementById('cons-list').textContent;
  if (/Paciente Nuvem/.test(rendered) && /Abrir atendimento/.test(rendered)) {
    pass('Lista rolável mostra o paciente e permite abrir o atendimento');
  } else {
    fail('Paciente não apareceu no histórico: ' + rendered);
  }

  const appHtml = fs.readFileSync(path.join(ROOT, 'app.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
  const siteConfig = fs.readFileSync(path.join(ROOT, 'medhub-site-config.js'), 'utf8');
  const retiredMatch = siteConfig.match(/MEDHUB_RETIRED_SECTIONS\s*=\s*\[([^\]]*)\]/);
  const retiredList = retiredMatch ? retiredMatch[1] : '';
  if (/data-section="consultas">Atendimentos realizados/.test(appHtml) &&
      /completed-encounters[\s\S]*overflow-y:\s*auto/.test(css) &&
      !/'consultas'|"consultas"/.test(retiredList)) {
    pass('Menu lateral expõe Atendimentos realizados com caixa de rolagem');
  } else {
    fail('Menu ou rolagem do histórico ausente');
  }

  console.log('\n' + (failures ? `FALHAS: ${failures}` : 'TODOS OS TESTES PASSARAM'));
  process.exit(failures ? 1 : 0);
}

console.log('=== MedHub — atendimentos realizados e nuvem ===\n');
run().catch(error => {
  console.error(error);
  process.exit(1);
});
