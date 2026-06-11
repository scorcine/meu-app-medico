const MEDHUB_TERMS_VERSION = '2026-06-07-v1';
const MEDHUB_PRIVACY_VERSION = '2026-06-07-v1';

const MEDHUB_TERMS_BODY = `
  <p><strong>MedHub é uma ferramenta educacional</strong> de apoio à decisão clínica para médicos. Ela <strong>não substitui</strong> julgamento médico, bula, protocolo institucional, segunda opinião nem <strong>prontuário legal</strong> exigido por lei, conselho profissional ou operadora.</p>
  <h3>1. Objeto</h3>
  <p>O MedHub Pro oferece conteúdos de referência (protocolos, calculadoras, modelos de anamnese e prescrição) para uso profissional individual (<strong>médico solo</strong>), mediante assinatura.</p>
  <h3>2. Responsabilidade clínica</h3>
  <ul>
    <li>Você é o único responsável por condutas, prescrições e orientações aos pacientes.</li>
    <li>Revise sempre textos, doses e checklists antes de utilizar no atendimento.</li>
    <li>Não utilize o app como único registro assistencial quando a instituição exige prontuário certificado.</li>
  </ul>
  <h3>3. Conta, assinatura e garantia</h3>
  <ul>
    <li>A conta é pessoal e intransferível (médico solo).</li>
    <li>O acesso depende de assinatura ativa (plano mensal ou anual) processada pela Stripe.</li>
    <li>Renovação automática conforme o plano escolhido, salvo cancelamento pelo portal de cobrança.</li>
    <li><strong>Garantia de 7 dias:</strong> nos primeiros 7 dias após a primeira cobrança, você pode solicitar reembolso integral pelo canal de suporte informado na fatura ou site, caso o serviço não atenda suas expectativas.</li>
  </ul>
  <h3>4. Conteúdo</h3>
  <p>Protocolos e fichas são referências resumidas e podem estar desatualizados ou incompletos. O MedHub não garante adequação a todos os cenários clínicos.</p>
  <h3>5. Limitação de responsabilidade</h3>
  <p>Na extensão permitida pela lei, o MedHub não responde por danos decorrentes de uso inadequado, indisponibilidade temporária ou decisões clínicas baseadas exclusivamente no app.</p>
  <h3>6. Alterações</h3>
  <p>Estes termos podem ser atualizados. Nova versão exigirá novo aceite no login.</p>
  <p><em>Versão ${MEDHUB_TERMS_VERSION}</em></p>
`;

const MEDHUB_PRIVACY_BODY = `
  <p>Esta política descreve como o MedHub trata dados quando você usa a versão online (conta na nuvem + assinatura).</p>
  <h3>1. Controlador</h3>
  <p>O responsável pelo tratamento é o operador do MedHub (dados de contato informados no site ou fatura Stripe).</p>
  <h3>2. Dados que coletamos</h3>
  <ul>
    <li><strong>Conta na nuvem:</strong> nome, e-mail e senha (armazenada apenas como hash PBKDF2).</li>
    <li><strong>Assinatura:</strong> e-mail e status de pagamento via Stripe (não armazenamos número de cartão).</li>
    <li><strong>Dados clínicos:</strong> anamneses, pacientes e consultas ficam <strong>no seu navegador</strong>, criptografados com chave derivada da sua senha — o servidor MedHub não recebe esse conteúdo.</li>
  </ul>
  <h3>3. Finalidades</h3>
  <ul>
    <li>Autenticar sua conta e liberar acesso ao app.</li>
    <li>Verificar assinatura ativa.</li>
    <li>Cumprir obrigações legais e responder solicitações de titulares (LGPD).</li>
  </ul>
  <h3>4. Compartilhamento</h3>
  <p>Usamos processadores: <strong>Vercel</strong> (hospedagem/API), <strong>Stripe</strong> (pagamentos) e, se você configurar, <strong>Google</strong> (backup opcional de anamnese). Não vendemos dados.</p>
  <h3>5. Retenção</h3>
  <p>Conta na nuvem: enquanto a assinatura/conta estiver ativa. Dados locais no dispositivo: até você apagar cache, restaurar backup ou redefinir senha local.</p>
  <h3>6. Seus direitos (LGPD)</h3>
  <p>Você pode solicitar acesso, correção ou exclusão da conta na nuvem pelo e-mail de contato do MedHub. Dados clínicos locais você controla diretamente no dispositivo (exportação/backup JSON).</p>
  <h3>7. Segurança</h3>
  <p>Senhas com hash PBKDF2; tráfego HTTPS; dados clínicos criptografados localmente (AES-GCM). Proteja sua senha e o dispositivo desbloqueado.</p>
  <h3>8. Alterações</h3>
  <p>Atualizações desta política podem exigir novo aceite.</p>
  <p><em>Versão ${MEDHUB_PRIVACY_VERSION}</em></p>
`;
