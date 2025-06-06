# Estrutura do Projeto VHSys MCP Server

## 📁 Organização dos Arquivos

```
00_ERP/
├── 📁 api/                         # Funções serverless do Vercel
│   ├── index.js                    # Endpoint principal
│   ├── health.js                   # Health check
│   ├── sse.js                      # Server-Sent Events
│   └── rpc.js                      # JSON-RPC para MCP
│
├── 📁 lib/                         # Bibliotecas compartilhadas
│   └── vhsys-api.js               # Cliente da API VHSys
│
├── 📁 src/                         # Código fonte original (TypeScript)
│   ├── index.ts                    # Servidor MCP principal
│   ├── vhsys-api.ts               # Cliente da API VHSys (TypeScript)
│   └── remote-mcp-server.js       # Servidor remoto Express
│
├── 📁 scripts/                     # Scripts de deploy e utilitários
│   ├── deploy-vercel.sh           # Deploy para Vercel (Linux/Mac)
│   ├── deploy-vercel.bat          # Deploy para Vercel (Windows)
│   ├── setup.sh                   # Configuração inicial (Linux/Mac)
│   ├── setup.bat                  # Configuração inicial (Windows)
│   └── cleanup-processes.bat      # Limpeza de processos
│
├── 📁 docs/                        # Documentação
│   ├── README.md                   # Documentação principal
│   ├── README-VERCEL.md           # Instruções para Vercel
│   ├── INSTALACAO.md              # Guia de instalação
│   └── SOLUCAO_PROBLEMAS.md       # Troubleshooting
│
├── 📁 tests/                       # Arquivos de teste
│   ├── teste-completo.js          # Teste completo da API
│   ├── teste-rapido.js            # Teste rápido
│   ├── teste-direto-api.js        # Teste direto da API
│   ├── teste-api.html             # Interface de teste
│   └── teste-vhsys-api.html       # Interface de teste VHSys
│
├── 📁 config/                      # Arquivos de configuração
│   ├── cursor_mcp_config.json     # Configuração do Cursor
│   └── claude_desktop_config.json # Configuração do Claude Desktop
│
├── 📁 build/                       # Arquivos compilados (TypeScript)
│
├── 🔧 vercel.json                  # Configuração do Vercel
├── 🔧 package.json                 # Dependências e scripts
├── 🔧 tsconfig.json                # Configuração TypeScript
├── 🔧 env.example                  # Exemplo de variáveis de ambiente
├── 🔧 .gitignore                   # Arquivos ignorados pelo Git
├── 🔧 .vercelignore               # Arquivos ignorados pelo Vercel
└── 📋 ESTRUTURA.md                 # Este arquivo
```

## 🚀 Como Usar

### Para Desenvolvimento Local
```bash
npm install
npm run dev
```

### Para Deploy no Vercel
```bash
# Windows
scripts\deploy-vercel.bat

# Linux/Mac
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

### Para Configurar no Claude.ai
1. Faça o deploy no Vercel
2. Use a URL: `https://seu-projeto.vercel.app/sse`
3. Configure nas integrações do Claude.ai

## 📚 Documentação

- **docs/README.md**: Documentação principal do projeto
- **docs/README-VERCEL.md**: Instruções específicas para Vercel
- **docs/INSTALACAO.md**: Guia completo de instalação
- **docs/SOLUCAO_PROBLEMAS.md**: Troubleshooting e soluções

## 🧪 Testes

- **tests/**: Contém todos os arquivos de teste
- Execute `npm test` para testar a conexão MCP
- Use os arquivos HTML para testar a API via browser

## ⚙️ Configuração

- **config/**: Arquivos de configuração para diferentes ambientes
- **env.example**: Template das variáveis de ambiente necessárias
- Configure as variáveis no Vercel ou crie um arquivo `.env` local 