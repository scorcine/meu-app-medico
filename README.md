# MedHub

Ferramenta **educacional** de apoio à decisão clínica no plantão — protocolos, prescrição interativa, calculadoras, medicações e roteiro local opcional de atendimento.

**Aviso:** não substitui julgamento médico, bula, protocolo institucional nem prontuário legal.

## O que o app inclui

| Módulo | Conteúdo |
|--------|----------|
| Guia de emergência | ACLS, AVC, sepse, trauma, fluxogramas |
| Pronto-socorro | 106 condições com prescrição interativa |
| Receituário / Tratamento hospitalar | 106 condições VO e posologias IM/EV (modelo educacional · CRM-SP opcional) |
| Medicações | 266+ fichas MedHub · 148 referência RENAME · consulta ANVISA |
| Calculadoras | Dezenas de scores e doses por especialidade |
| Exames | 30 cenários de solicitação laboratorial/imagem |
| Interpretação | 30 guias rápidos de labs e imagem |
| Roteiro local (opcional) | Formulário clínico queixa → protocolo · contexto de paciente · histórico local criptografado · PDF educacional |

## Uso local

1. Abra `index.html` no navegador **ou** acesse o deploy (Vercel).
2. **Planos** (`pricing.html`) → assine (Stripe) → **Cadastro** → **Login** → **`app.html`**
3. Dados clínicos ficam no **localStorage** do navegador, criptografados com sua senha.
4. Com **login na nuvem** configurado, a conta (e-mail/senha) fica no Vercel KV — dados clínicos continuam só no dispositivo.

### Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari).
- **Internet** para carregar o app e validar assinatura/conta.
- Pop-ups permitidos para exportar PDF de consultas/receitas.

## Deploy

Deploy estático + **API serverless** (`api/`) na Vercel:

- Em **Production**, Stripe + KV + JWT são **obrigatórios** — sem isso login e assinatura ficam bloqueados (não há mais “modo dev grátis” no ar).
- Configure **todas** as variáveis do `.env.example` na Vercel (ver checklist abaixo).
- Preview/local: bypass só se `MEDHUB_ALLOW_DEV_BYPASS=true` ou ambiente não-Production.
- Abrir `index.html` via `file://` ou `localhost` continua liberado para desenvolvimento local.

### Checklist Production (Vercel → Settings → Environment Variables)

| Variável | Obrigatória |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Sim |
| `STRIPE_PRICE_MONTHLY` | Sim |
| `STRIPE_PRICE_ANNUAL` | Sim |
| `MEDHUB_JWT_SECRET` | Sim |
| `KV_REST_API_URL` | Sim |
| `KV_REST_API_TOKEN` | Sim |
| `MEDHUB_SITE_URL` | Recomendado |
| `STRIPE_WEBHOOK_SECRET` | Recomendado |

Após salvar, **Redeploy** o projeto. A landing mostra quais variáveis faltam se algo estiver incompleto.

## MedHub Pro — assinatura (médico solo)

Venda B2C para **um médico por conta**, com pagamento via **Stripe** (cartão de crédito):

| Plano | Cobrança |
|-------|----------|
| **Mensal** | Renovação automática todo mês |
| **Anual** | Uma cobrança/ano com **~15% de desconto** vs 12× mensal |

### Fluxo completo

```
pricing.html → Stripe Checkout → subscribe-success.html
     → register.html (mesmo e-mail) → login → app.html
```

- **Assinatura:** verificada no login e ao abrir o app (`/api/verify-subscription`).
- **Conta na nuvem:** `/api/auth/register` e `/api/auth/login` (JWT 30 dias).
- **Termos + privacidade:** `termos.html`, `privacidade.html` — aceite no cadastro e modal na 1ª sessão.

### Configurar tudo (semi-automático)

```bash
npx vercel login          # uma vez
npx vercel link           # uma vez, na pasta do projeto
npm run setup:production  # Stripe + env na Vercel + deploy
```

No Windows: dê duplo clique em **`setup-production.bat`**.

O script:
1. Cria produto/preços Stripe (usa `stripe-key.local.txt` ou `.env`)
2. Gera `MEDHUB_JWT_SECRET`
3. Envia variáveis para **Production** e **Preview** na Vercel
4. Faz **deploy** se o KV já estiver conectado

**KV (único passo manual):** Vercel → projeto → **Storage** → Create Database → **KV** → Connect. Depois rode `npm run setup:production` de novo.

### Configurar Stripe (só Stripe, local)

1. Produto **MedHub Pro** no [Stripe Dashboard](https://dashboard.stripe.com/products).
2. Preços **BRL**: mensal + anual (mensal × 12 × 0,85).
3. Variáveis `STRIPE_*` na Vercel + Customer Portal ativo.

### Configurar login na nuvem

1. Vercel → Storage → **KV** → conectar ao projeto.
2. `MEDHUB_JWT_SECRET` = string longa aleatória.
3. `KV_REST_API_URL` e `KV_REST_API_TOKEN` são preenchidos pela Vercel.

Arquivos: `auth-cloud.js`, `api/auth/*.js`, `pricing.html`, `termos.html`, `privacidade.html`.

## Testes e auditorias

```bash
npm test                  # smoke: auditorias + catálogos exames/interpretação
npm run audit             # receituário + consistência PS
npm run audit:med         # lacunas fármacos nos protocolos
npm run pipeline:med      # regenerar catálogo de medicações
```

### Checklist manual (antes de release)

- [ ] Login → desbloqueio com senha → salvar roteiro → contexto de paciente + histórico automático
- [ ] Exportar PDF educacional (roteiro e histórico de atendimentos)
- [ ] **Backup:** exportar JSON na home → restaurar (mesmo login)
- [ ] Receituário: CRM-SP + gerar receita (modelo educacional) + imprimir
- [ ] PS: buscar dengue/sepse e abrir prescrição interativa
- [ ] Medicações: buscar dipirona (ficha A) e fármaco RENAME (≥ 2 letras)

## Estrutura principal

```
app.html              # App logado (menu lateral)
index.html            # Landing pública
login.html / register.html / reset-password.html / pricing.html / termos.html / privacidade.html / app.html
auth-cloud.js / subscription.js / billing.js / api/auth/*.js
subscription.js / billing.js / api/*.js   # Stripe (Vercel)
anamnese.js           # Roteiro de atendimento + histórico criptografado
pacientes.js / consultas.js / clinical-storage.js
backup.js              # Exportar/restaurar dados locais (JSON)
exames-data.js / interpretacao-exame-data.js
receituario.js / pronto-socorro*.js / medicacoes*.js
scripts/              # Pipeline e auditorias Node
medicacoes-sources/   # JSON fonte (RENAME, monografias A)
```

## Privacidade

- Senhas: hash PBKDF2.
- **Esqueci minha senha:** redefinição local em `reset-password.html` (sem e-mail) — apaga dados clínicos criptografados neste navegador.
- Notas locais (roteiro, contexto de paciente, histórico): AES-GCM local (chave derivada da senha na sessão).
- Google Drive (opcional no roteiro): requer Client ID OAuth configurado pelo usuário.

## Licença e responsabilidade

Uso por conta do profissional de saúde, conforme política institucional e LGPD. Revise sempre condutas e prescrições antes de aplicar com pacientes.
