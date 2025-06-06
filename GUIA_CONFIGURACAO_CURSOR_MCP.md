# 🔗 Guia Completo: Conectar Cursor com MCP VHSys

## 📋 Pré-requisitos

✅ **Verificar se tudo está funcionando:**
- [ ] Cursor IDE instalado
- [ ] Servidor MCP VHSys compilado (`npm run build`)
- [ ] API VHSys testada e funcionando
- [ ] Node.js instalado no sistema

## 🛠️ Configuração do MCP no Cursor

### Opção 1: Configuração Global (Recomendada)

Para usar o MCP VHSys em **todos os projetos** do Cursor:

#### **Windows:**
```powershell
# Criar diretório se não existir
mkdir ~/.cursor -Force

# Copiar arquivo de configuração
Copy-Item "cursor-global-mcp.json" "~/.cursor/mcp.json"
```

#### **Manual:**
1. Navegue até: `C:\Users\[SeuUsuario]\.cursor\`
2. Se a pasta não existir, crie-a
3. Copie o arquivo `cursor-global-mcp.json` e renomeie para `mcp.json`

### Opção 2: Configuração por Projeto

Para usar apenas neste projeto:

1. O arquivo `.cursor/mcp.json` já foi criado no projeto
2. Esta configuração funciona apenas quando o Cursor estiver aberto neste diretório

## 🔧 Configuração Detalhada

### Arquivo de Configuração:
```json
{
  "mcpServers": {
    "vhsys-erp": {
      "command": "node",
      "args": ["CAMINHO_COMPLETO/build/index.js"],
      "env": {
        "VHSYS_TOKEN": "ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ",
        "VHSYS_SECRET_TOKEN": "33DnRiebFchQb2GyrVNTKxPHY6C8q",
        "VHSYS_BASE_URL": "https://api.vhsys.com.br/v2"
      }
    }
  }
}
```

### Explicação dos Campos:

- **`mcpServers`**: Container principal para servidores MCP
- **`vhsys-erp`**: Nome identificador do servidor (aparecerá no Cursor)
- **`command`**: Comando para executar (`node`)
- **`args`**: Argumentos - caminho para o arquivo JS compilado
- **`env`**: Variáveis de ambiente (credenciais VHSys)

## 🚀 Como Usar no Cursor

### 1. **Verificar Conexão**

1. Abra o Cursor IDE
2. Vá em **Settings** → **Features** → **Model Context Protocol**
3. Verifique se `vhsys-erp` aparece na lista de servidores disponíveis
4. Status deve mostrar "✅ Connected"

### 2. **Usar no Chat do Cursor**

O Cursor Agent **automaticamente** detecta as ferramentas disponíveis. Você pode:

**Comandos de Exemplo:**
```
🔍 "Teste a conexão com VHSys"
👥 "Liste os primeiros 5 clientes cadastrados"
📦 "Mostre os produtos em estoque"
📊 "Gere um relatório de vendas de hoje"
🔧 "Liste as ordens de serviço pendentes"
💰 "Mostre as contas a receber em aberto"
```

### 3. **Ferramentas Disponíveis**

Quando conectado, o Cursor terá acesso a:

#### **🔍 Utilitários:**
- `testar_conexao` - Verificar conectividade VHSys
- `debug_api_vhsys` - Diagnóstico detalhado

#### **👥 Clientes:**
- `buscar_cliente` - Buscar por nome/email
- `consultar_cliente` - Detalhes por ID
- `cadastrar_cliente` - Novo cliente

#### **📦 Produtos:**
- `buscar_produtos` - Buscar por nome/categoria
- `consultar_produto` - Detalhes + estoque

#### **📋 Vendas:**
- `listar_pedidos` - Pedidos com filtros
- `consultar_pedido` - Detalhes do pedido
- `vendas_balcao` - Vendas PDV

#### **💰 Financeiro:**
- `contas_receber` - Contas a receber
- `contas_pagar` - Contas a pagar

#### **🔧 Serviços:**
- `listar_ordens_servico` - OS com filtros
- `consultar_ordem_servico` - Detalhes da OS
- `cadastrar_ordem_servico` - Nova OS
- `atualizar_ordem_servico` - Alterar OS
- `alterar_status_ordem_servico` - Mudar status

#### **📊 Relatórios:**
- `relatorio_vendas` - Vendas por período
- `relatorio_ordens_servico` - Relatório de OS

## 🔍 Verificação e Debug

### 1. **Verificar no Cursor:**
- Settings → Model Context Protocol
- Deve mostrar o servidor `vhsys-erp` como "Connected"

### 2. **Se não aparecer:**

```powershell
# Verificar se o arquivo existe
Test-Path "~/.cursor/mcp.json"

# Ver conteúdo
Get-Content "~/.cursor/mcp.json"

# Testar servidor manualmente
cd "D:\SynNova Software e Soluções Ltda\SynNova - Corporativo - Documentos\02_PRODUÇÃO\00_ERP"
node build/index.js
```

### 3. **Problemas Comuns:**

| Problema | Solução |
|----------|---------|
| "No tools found" | Verificar path do arquivo JS |
| "Connection failed" | Verificar se Node.js está no PATH |
| "Server not listed" | Reiniciar Cursor após configurar |
| "Tools not working" | Verificar credenciais VHSys |

## 📱 Teste de Funcionalidade

### Comando de Teste no Chat do Cursor:
```
Teste a integração VHSys:
1. Teste a conexão
2. Liste 3 clientes
3. Mostre 3 produtos
4. Verifique se há ordens de serviço
```

### Resposta Esperada:
```
✅ Conexão VHSys: OK
👥 Clientes: X encontrados
📦 Produtos: Y encontrados  
🔧 Ordens: Z pendentes
📊 Status: Sistema funcionando
```

## 🎯 Dicas de Uso

### **Comandos Naturais:**
- "Preciso cadastrar um novo cliente chamado João Silva"
- "Mostre o produto com ID 123"
- "Gere um relatório de vendas da semana passada"
- "Quais ordens de serviço estão atrasadas?"

### **Aprovação de Ferramentas:**
- Por padrão, Cursor pede aprovação antes de executar tools
- Você pode habilitar "auto-run" nas configurações para execução automática

### **Recursos Disponíveis:**
- Acesso a dados em tempo real do VHSys
- Operações CRUD (criar, ler, atualizar, deletar)
- Relatórios e análises automáticas
- Integração perfeita com o workflow de desenvolvimento

## 🚨 Segurança

### **Credenciais:**
- ✅ Credenciais armazenadas localmente no Cursor
- ✅ Não expostas no código
- ✅ Transmissão segura via HTTPS

### **Permissões:**
- ✅ Apenas leitura e operações autorizadas
- ✅ Logs de todas as operações
- ✅ Timeout de segurança (30s)

## 🎉 Conclusão

Após configurar, você terá acesso completo ao sistema VHSys diretamente no Cursor:
- **Consultas inteligentes** sobre dados do ERP
- **Relatórios automáticos** baseados em linguagem natural
- **Operações diretas** no sistema VHSys
- **Workflow integrado** desenvolvimento + ERP

**🚀 Sua produtividade vai para o próximo nível!** 