@echo off
echo 🚀 Configurando servidor VHSys MCP...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale Node.js 18+ primeiro.
    pause
    exit /b 1
)

REM Verificar se npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado. Instale npm primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Instalar dependências
echo 📦 Instalando dependências...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

REM Verificar se .env existe
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado!
    echo 📝 Criando template .env...
    echo # Configurações VHSys API > .env
    echo VHSYS_TOKEN=ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ >> .env
    echo VHSYS_SECRET_TOKEN=33DnRiebFchQb2GyrVNTKxPHY6C8q >> .env
    echo VHSYS_BASE_URL=https://api.vhsys.com.br/v2 >> .env
    echo ✅ Arquivo .env criado com suas credenciais
) else (
    echo ✅ Arquivo .env já existe
)

REM Compilar projeto
echo 🔨 Compilando projeto TypeScript...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro ao compilar projeto
    pause
    exit /b 1
)

echo.
echo 🎉 Setup concluído com sucesso!
echo.
echo 📋 Próximos passos:
echo 1. Testar conexão: npm run dev
echo 2. Testar com MCP Inspector: npm test
echo 3. Configurar no Claude Desktop ou Cursor
echo.
echo 📖 Consulte o README.md para instruções detalhadas
echo.
echo ✅ Servidor está pronto para uso!

pause 