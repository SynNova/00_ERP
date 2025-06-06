# 🚀 Guia de Instalação VHSys MCP

## ✅ O que foi criado:

### 📁 Estrutura do Projeto:
```
00_ERP/
├── src/
│   ├── vhsys-api.ts          # Cliente da API VHSys
│   └── index.ts              # Servidor MCP principal
├── build/                    # Código compilado (TypeScript → JavaScript)
├── .env                      # Suas credenciais VHSys
├── package.json              # Dependências do projeto
├── tsconfig.json             # Configuração TypeScript
├── claude_desktop_config.json # Exemplo configuração Claude
├── setup.sh                  # Script instalação Linux/Mac
├── setup.bat                 # Script instalação Windows
├── README.md                 # Documentação completa
└── .gitignore                # Arquivos ignorados pelo Git
```

## 🛠️ Funcionalidades Implementadas:

### Tools (15 ferramentas):
- ✅ `testar_conexao` - Testa conectividade
- ✅ `buscar_cliente` - Busca clientes por nome/email
- ✅ `consultar_cliente` - Detalhes de cliente específico
- ✅ `cadastrar_cliente` - Cadastra novo cliente
- ✅ `buscar_produtos` - Busca produtos
- ✅ `consultar_produto` - Detalhes produto + estoque
- ✅ `listar_pedidos` - Lista pedidos com filtros
- ✅ `consultar_pedido` - Detalhes de pedido
- ✅ `relatorio_vendas` - Relatório por período
- ✅ `contas_receber` - Contas a receber
- ✅ `contas_pagar` - Contas a pagar
- ✅ `listar_orcamentos` - Lista orçamentos
- ✅ `vendas_balcao` - Vendas PDV/balcão

### Resources (2 recursos):
- ✅ `vhsys://vendas/hoje` - Vendas do dia
- ✅ `vhsys://dashboard/vendas` - Dashboard tempo real

### Prompts (1 template):
- ✅ `relatorio_diario` - Template relatório diário

## 🚀 Como Usar:

### 1. O projeto já está configurado! Execute:
```bash
# Windows:
npm start

# Linux/Mac:
npm run dev
```

### 2. Testar com MCP Inspector:
```bash
npm test
```

### 3. Configurar no Claude Desktop:
1. Abra Claude Desktop
2. Settings → Developer → Edit Config
3. Cole o conteúdo do arquivo `claude_desktop_config.json`
4. Reinicie o Claude Desktop

### 4. Configurar no Cursor:
1. Cursor Settings → MCP → Add new global MCP server
2. Use a mesma configuração do Claude

## 💡 Exemplos de Perguntas:

Agora você pode perguntar ao Claude ou Cursor:

```
"Quais foram as vendas de hoje?"
"Buscar cliente João Silva"
"Consultar produto ID 123"
"Gerar relatório de vendas desta semana"
"Cadastrar cliente: Maria Santos, email: maria@email.com"
"Quais contas estão vencidas?"
"Dashboard de vendas atual"
```

## 🔧 Se algo der errado:

### Problema: Erro de conexão
**Solução:** Verifique se suas credenciais estão corretas no arquivo `.env`

### Problema: Dependencies não encontradas
**Solução:** Execute `npm install` novamente

### Problema: Erro de compilação
**Solução:** Execute `npm run build`

### Problema: Cliente AI não encontra o servidor
**Solução:** Use o caminho ABSOLUTO do arquivo `build/index.js`

## 🎉 Parabéns!

Seu servidor MCP VHSys está funcionando! Agora você pode:

1. **Fazer consultas em linguagem natural** ao seu ERP
2. **Gerar relatórios automaticamente** 
3. **Cadastrar clientes via IA**
4. **Monitorar vendas em tempo real**
5. **Integrar com Claude Desktop e Cursor**

---

**🤖 Desenvolvido para integrar VHSys com IA através do MCP** 