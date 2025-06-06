@echo off
echo Limpando processos Node.js do servidor VHSys MCP...

REM Finalizar todos os processos node.exe
taskkill /F /IM node.exe 2>nul

echo Aguardando 2 segundos...
timeout /t 2 >nul

echo Verificando processos restantes...
tasklist /FI "IMAGENAME eq node.exe"

echo.
echo Processos limpos! Agora você pode reiniciar o servidor MCP.
echo Para reiniciar: npm run dev
pause 