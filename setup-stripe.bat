@echo off
chcp 65001 >nul
cd /d "%~dp0"
title MedHub - Setup Stripe

set "KEY_OK=0"
if exist stripe-key.local.txt (
  findstr /B /C:"sk_" stripe-key.local.txt >nul 2>&1
  if not errorlevel 1 set "KEY_OK=1"
)

if "%KEY_OK%"=="1" (
  echo Chave encontrada em stripe-key.local.txt. Executando setup...
  call npm run setup:stripe
  if errorlevel 1 (
    echo.
    echo Setup falhou. Apague stripe-key.local.txt e rode de novo.
  )
  pause
  exit /b %ERRORLEVEL%
)

echo.
echo  MedHub - Configurar Stripe automaticamente
echo  ==========================================
echo.
echo  1. Stripe - Desenvolvedores - Chaves de API
echo  2. Copie a CHAVE SECRETA que comeca com sk_test_
echo  3. Cole abaixo e pressione Enter
echo.
set /p "STRIPE_KEY=Cole a chave aqui: "

if "%STRIPE_KEY%"=="" (
  echo.
  echo  Nenhuma chave informada. Cancelado.
  pause
  exit /b 1
)

echo %STRIPE_KEY%> stripe-key.local.txt
echo.
echo  Chave salva em stripe-key.local.txt
echo  Executando setup...
echo.

set "STRIPE_SECRET_KEY=%STRIPE_KEY%"
call npm run setup:stripe
pause
