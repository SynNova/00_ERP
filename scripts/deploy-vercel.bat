@echo off
echo 🚀 Iniciando deploy do VHSys MCP Server no Vercel...

REM Verificar se o Vercel CLI está instalado
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI não encontrado. Instalando...
    npm install -g vercel
)

REM Verificar se existe .env
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado. Criando exemplo...
    copy env.example .env
    echo 📝 Configure as variáveis de ambiente no arquivo .env
    echo    Ou configure diretamente no painel do Vercel
)

REM Fazer login no Vercel
echo 🔐 Fazendo login no Vercel...
vercel login

REM Deploy
echo 📦 Iniciando deploy...
vercel --prod

echo ✅ Deploy concluído!
echo 🔗 Sua URL do MCP Server está disponível acima
echo 📋 Para usar no Claude.ai, configure a integração remota com:
echo    https://seu-projeto.vercel.app/sse

pause 