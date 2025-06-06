# VHSys MCP Server - Deploy no Vercel

Este projeto foi configurado para deploy no Vercel como um servidor MCP (Model Context Protocol) remoto para integração com Claude.ai.

## 🚀 Deploy no Vercel

### 1. Preparação

1. Clone este repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

### 2. Configuração das Variáveis de Ambiente

No painel do Vercel, configure as seguintes variáveis de ambiente:

- `VHSYS_TOKEN`: Token de acesso da API VHSys
- `VHSYS_SECRET`: Secret token da API VHSys  
- `VHSYS_BASE_URL`: URL base da API VHSys (geralmente `https://api.vhsys.com.br/v2`)

### 3. Deploy

#### Opção 1: Via CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Opção 2: Via GitHub
1. Conecte seu repositório GitHub ao Vercel
2. O deploy será automático a cada push

### 4. Configuração no Claude.ai

Após o deploy, você receberá uma URL do Vercel (ex: `https://seu-projeto.vercel.app`).

Para conectar no Claude.ai:
1. Vá em Settings > Integrations
2. Adicione uma nova integração MCP remota
3. Use a URL: `https://seu-projeto.vercel.app/sse`

## 📁 Estrutura do Projeto

```
├── api/                 # Funções serverless do Vercel
│   ├── index.js         # Endpoint principal
│   ├── health.js        # Health check
│   ├── sse.js          # Server-Sent Events
│   └── rpc.js          # JSON-RPC para MCP
├── lib/                 # Bibliotecas compartilhadas
│   └── vhsys-api.js    # Cliente da API VHSys
├── src/                 # Código fonte original (TypeScript)
├── vercel.json         # Configuração do Vercel
├── .vercelignore       # Arquivos ignorados no deploy
└── package.json        # Dependências e scripts
```

## 🔧 Endpoints Disponíveis

- `GET /` - Informações do servidor
- `GET /health` - Health check
- `GET /sse` - Server-Sent Events para MCP
- `POST /rpc` - JSON-RPC para comandos MCP

## 🛠 Ferramentas MCP Disponíveis

- `listar_clientes` - Lista clientes cadastrados
- `buscar_cliente` - Busca cliente por ID/nome/documento
- `listar_produtos` - Lista produtos cadastrados
- `buscar_produto` - Busca produto por ID/nome

## 🐛 Troubleshooting

### Erro de Timeout
O Vercel tem limite de 25 segundos para conexões. Se necessário, ajuste a lógica de reconexão.

### Variáveis de Ambiente
Certifique-se de que todas as variáveis estão configuradas no painel do Vercel.

### Logs
Acesse os logs no painel do Vercel para debug: Vercel Dashboard → Functions → Logs

## 📚 Documentação Adicional

- [Vercel Functions](https://vercel.com/docs/functions)
- [MCP Remote Integration](https://support.anthropic.com/en/articles/11176164-pre-built-integrations-using-remote-mcp)
- [VHSys API Documentation](https://vhsys.com.br/api) 