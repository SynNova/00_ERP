#!/bin/bash

echo "🚀 Iniciando deploy do VHSys MCP Server no Vercel..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se existe .env
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando exemplo..."
    cp env.example .env
    echo "📝 Configure as variáveis de ambiente no arquivo .env"
    echo "   Ou configure diretamente no painel do Vercel"
fi

# Fazer login no Vercel (se necessário)
echo "🔐 Fazendo login no Vercel..."
vercel login

# Deploy
echo "📦 Iniciando deploy..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🔗 Sua URL do MCP Server está disponível acima"
echo "📋 Para usar no Claude.ai, configure a integração remota com:"
echo "   https://seu-projeto.vercel.app/sse" 