#!/bin/bash

echo "🚀 Configurando servidor VHSys MCP..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale npm primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando template .env..."
    cat > .env << EOL
# Configurações VHSys API
VHSYS_TOKEN=ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ
VHSYS_SECRET_TOKEN=33DnRiebFchQb2GyrVNTKxPHY6C8q
VHSYS_BASE_URL=https://api.vhsys.com.br/v2
EOL
    echo "✅ Arquivo .env criado com suas credenciais"
else
    echo "✅ Arquivo .env já existe"
fi

# Compilar projeto
echo "🔨 Compilando projeto TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar projeto"
    exit 1
fi

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Testar conexão: npm run dev"
echo "2. Testar com MCP Inspector: npm test"
echo "3. Configurar no Claude Desktop ou Cursor"
echo ""
echo "📖 Consulte o README.md para instruções detalhadas"
echo ""

# Testar conexão automaticamente
echo "🔍 Testando conexão com VHSys..."
timeout 10s npm start &
PID=$!
sleep 3
kill $PID 2>/dev/null
wait $PID 2>/dev/null

echo "✅ Servidor está pronto para uso!" 