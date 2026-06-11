@echo off
chcp 65001 >nul
cd /d "%~dp0"
title MedHub - Setup Producao (Vercel + Stripe)

echo.
echo  MedHub - Configurar producao automaticamente
echo  =============================================
echo.
echo  O script vai:
echo    - Configurar Stripe (produto e precos)
echo    - Gerar JWT e enviar variaveis para a Vercel
echo    - Fazer deploy (se KV ja estiver conectado)
echo.
echo  Antes da primeira vez:
echo    npx vercel login
echo    npx vercel link
echo.

if not exist stripe-key.local.txt (
  echo  Cole sua chave Stripe ^(sk_test_... ou sk_live_...^):
  set /p "STRIPE_KEY=Cole a chave aqui: "
  if not "%STRIPE_KEY%"=="" (
    echo %STRIPE_KEY%> stripe-key.local.txt
    echo  Chave salva em stripe-key.local.txt
  )
)

echo.
call npm run setup:production
echo.
pause
