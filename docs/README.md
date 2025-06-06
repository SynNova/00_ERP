# 🚀 Servidor MCP VHSys

Servidor MCP (Model Context Protocol) para integração com a API do VHSys ERP, permitindo que assistentes de IA interajam diretamente com seu sistema ERP através de linguagem natural.

## 📋 Funcionalidades

### 🛠️ Tools (Ferramentas)
- **testar_conexao** - Testa conectividade com API VHSys
- **buscar_cliente** - Busca clientes por nome ou email
- **consultar_cliente** - Consulta detalhes de cliente específico
- **cadastrar_cliente** - Cadastra novo cliente
- **buscar_produtos** - Busca produtos por nome/categoria
- **consultar_produto** - Consulta produto específico + estoque
- **listar_pedidos** - Lista pedidos com filtros
- **consultar_pedido** - Consulta pedido específico
- **relatorio_vendas** - Relatório de vendas por período
- **contas_receber** - Lista contas a receber
- **contas_pagar** - Lista contas a pagar
- **listar_orcamentos** - Lista orçamentos
- **vendas_balcao** - Lista vendas PDV/balcão

### 📊 Resources (Recursos)
- **vhsys://vendas/hoje** - Vendas do dia atual
- **vhsys://dashboard/vendas** - Dashboard em tempo real
- **vhsys://estoque/baixo** - Produtos com estoque baixo

### 📝 Prompts (Templates)
- **relatorio_diario** - Template para relatório diário
- **analise_cliente** - Template para análise de cliente
- **alerta_gestao** - Template para alertas de gestão

## 🔧 Instalação

### 1. Clonar e configurar o projeto:

```bash
git clone <seu-repo>
cd vhsys-mcp-server
npm install
```

### 2. Configurar credenciais no `.env`:

```env
VHSYS_TOKEN=seu_token_aqui
VHSYS_SECRET_TOKEN=seu_secret_token_aqui
VHSYS_BASE_URL=https://api.vhsys.com.br/v2
```

### 3. Compilar e executar:

```bash
npm run build
npm start
```

## 🧪 Testando

### Testar com MCP Inspector:

```bash
npm test
# ou
npx @modelcontextprotocol/inspector node build/index.js
```

### Verificar conexão:

```bash
npm run dev
```

## 🔌 Integração com Clientes AI

### Claude Desktop

Adicione ao arquivo de configuração do Claude (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "vhsys": {
      "command": "node",
      "args": ["/caminho/absoluto/para/vhsys-mcp-server/build/index.js"],
      "env": {
        "VHSYS_TOKEN": "seu_token_aqui",
        "VHSYS_SECRET_TOKEN": "seu_secret_token_aqui"
      }
    }
  }
}
```

### Cursor

1. Cursor Settings → MCP → Add new global MCP server
2. Use a mesma configuração JSON do Claude

## 💡 Exemplos de Uso

```bash
# Perguntas que a IA pode responder:
"Quais foram as vendas de hoje?"
"Buscar cliente João Silva"
"Consultar produto ID 123"
"Gerar relatório de vendas da última semana"
"Cadastrar cliente: Maria Santos, email: maria@email.com"
"Quais contas estão vencidas?"
"Produtos com estoque baixo"
"Dashboard de vendas do mês"
```

## 📁 Estrutura do Projeto

```
vhsys-mcp-server/
├── src/
│   ├── vhsys-api.ts      # Cliente da API VHSys
│   └── index.ts          # Servidor MCP principal
├── build/                # Código compilado
├── .env                  # Credenciais (não versionar)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Segurança

- Nunca versione o arquivo `.env` com suas credenciais
- Use variáveis de ambiente em produção
- Mantenha seus tokens VHSys seguros
- Monitore logs para detectar uso indevido

## 🐛 Solução de Problemas

### Erro de conexão com VHSys:
1. Verifique se o token e secret estão corretos no `.env`
2. Confirme se o app "Integração via API" está instalado no VHSys
3. Teste a conectividade: `npm run dev`

### Erro ao executar no cliente AI:
1. Use caminho absoluto para o arquivo `build/index.js`
2. Confirme que as variáveis de ambiente estão configuradas
3. Verifique logs do cliente AI para erros específicos

### Dependencies não encontradas:
```bash
npm install
npm run build
```

## 📞 Suporte

Para suporte com:
- **API VHSys**: Consulte a [documentação oficial](https://developers.vhsys.com.br/api/)
- **MCP**: Consulte a [documentação MCP](https://modelcontextprotocol.io/)
- **Este projeto**: Abra uma issue no repositório

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ para integrar VHSys com assistentes de IA através do MCP** 