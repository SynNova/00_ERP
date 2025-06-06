import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { VHSysAPI } from "./vhsys-api.js";

// Inicializar API VHSys
const vhsysAPI = new VHSysAPI();

// Inicializar servidor MCP
const server = new McpServer({
  name: "vhsys-erp",
  version: "1.0.0"
});

// ===== RESOURCES (Dados acessíveis pela IA) =====

server.resource(
  "vendas-hoje",
  "vhsys://vendas/hoje",
  async (uri) => {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const vendas = await vhsysAPI.listarPedidos({ 
        data_inicio: hoje, 
        data_fim: hoje 
      });
      
      const vendasBalcao = await vhsysAPI.listarVendasBalcao({
        data_inicio: hoje,
        data_fim: hoje
      });

      const totalVendas = vendas.reduce((sum, pedido) => sum + (pedido.valor_total || 0), 0) +
                         vendasBalcao.reduce((sum: number, venda: any) => sum + (venda.valor_total || 0), 0);
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            data: hoje,
            total_pedidos: vendas.length,
            total_vendas_balcao: vendasBalcao.length,
            valor_total: totalVendas,
            pedidos: vendas,
            vendas_balcao: vendasBalcao
          }, null, 2)
        }]
      };
    } catch (error: any) {
      return {
        contents: [{
          uri: uri.href,
          text: `Erro ao buscar vendas de hoje: ${error.message}`
        }]
      };
    }
  }
);

server.resource(
  "dashboard-vendas",
  "vhsys://dashboard/vendas",
  async (uri) => {
    try {
      const dashboard = await vhsysAPI.dashboardVendas();
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            resumo: "Dashboard de vendas em tempo real",
            dados: dashboard,
            ultima_atualizacao: new Date().toISOString()
          }, null, 2)
        }]
      };
    } catch (error: any) {
      return {
        contents: [{
          uri: uri.href,
          text: `Erro ao carregar dashboard: ${error.message}`
        }]
      };
    }
  }
);

server.resource(
  "estoque-baixo",
  "vhsys://estoque/baixo",
  async (uri) => {
    try {
      const produtos = await vhsysAPI.listarProdutos({ limite: 500 });
      const produtosEstoqueBaixo = produtos.filter(p => 
        p.estoque_atual !== undefined && 
        p.estoque_minimo !== undefined && 
        p.estoque_atual <= p.estoque_minimo
      );
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            alerta: "Produtos com estoque baixo",
            quantidade: produtosEstoqueBaixo.length,
            produtos: produtosEstoqueBaixo
          }, null, 2)
        }]
      };
    } catch (error: any) {
      return {
        contents: [{
          uri: uri.href,
          text: `Erro ao verificar estoque: ${error.message}`
        }]
      };
    }
  }
);

server.resource(
  "ordens-servico-pendentes",
  "vhsys://ordens-servico/pendentes",
  async (uri) => {
    try {
      const ordensPendentes = await vhsysAPI.listarOrdensServico({ 
        status: 'pendente',
        limite: 100
      });
      
      const ordensUrgentes = ordensPendentes.filter(o => o.prioridade === 'urgente');
      const ordensVencidas = ordensPendentes.filter(o => 
        o.data_prazo && new Date(o.data_prazo) < new Date()
      );
      
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            alerta: "Ordens de Serviço Pendentes",
            total_pendentes: ordensPendentes.length,
            urgentes: ordensUrgentes.length,
            vencidas: ordensVencidas.length,
            ordens_pendentes: ordensPendentes,
            ordens_urgentes: ordensUrgentes,
            ordens_vencidas: ordensVencidas
          }, null, 2)
        }]
      };
    } catch (error: any) {
      return {
        contents: [{
          uri: uri.href,
          text: `Erro ao verificar ordens de serviço: ${error.message}`
        }]
      };
    }
  }
);

// ===== TOOLS (Ações executáveis pela IA) =====

server.tool(
  "testar_conexao",
  "Testar conectividade com a API VHSys",
  {},
  async () => {
    try {
      console.error("🔍 [DEBUG] Iniciando teste de conexão...");
      const conectado = await vhsysAPI.testarConexao();
      console.error(`🔍 [DEBUG] Resultado do teste: ${conectado}`);
      return {
        content: [{
          type: "text",
          text: conectado ? "✅ Conexão com VHSys estabelecida com sucesso!" : "❌ Falha na conexão com VHSys"
        }]
      };
    } catch (error: any) {
      console.error(`🔍 [DEBUG] Erro capturado: ${error.message}`);
      return {
        content: [{
          type: "text",
          text: `❌ Erro na conexão: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "debug_api_vhsys",
  "Testar detalhadamente a conexão e requisições para VHSys",
  {},
  async () => {
    try {
      console.error("🔍 [DEBUG] === TESTE DETALHADO DE CONEXÃO VHSYS ===");
      
      // Verificar variáveis de ambiente
      const token = process.env.VHSYS_TOKEN;
      const secretToken = process.env.VHSYS_SECRET;
      const baseURL = process.env.VHSYS_BASE_URL;
      
      console.error(`🔍 [DEBUG] Token: ${token ? token.substring(0, 10) + '...' : 'NÃO DEFINIDO'}`);
      console.error(`🔍 [DEBUG] Secret Token: ${secretToken ? secretToken.substring(0, 10) + '...' : 'NÃO DEFINIDO'}`);
      console.error(`🔍 [DEBUG] Base URL: ${baseURL || 'NÃO DEFINIDO'}`);
      
      // Tentar listar 1 cliente para testar conectividade
      console.error("🔍 [DEBUG] Tentando listar clientes...");
      const clientes = await vhsysAPI.listarClientes({ limite: 1 });
      console.error(`🔍 [DEBUG] Clientes retornados: ${clientes.length}`);
      
      return {
        content: [{
          type: "text",
          text: `🔍 **Debug VHSys API:**\n\n` +
                `**Configuração:**\n` +
                `- Token: ${token ? '✅ Configurado' : '❌ Não configurado'}\n` +
                `- Secret Token: ${secretToken ? '✅ Configurado' : '❌ Não configurado'}\n` +
                `- Base URL: ${baseURL || 'Padrão'}\n\n` +
                `**Teste de Conectividade:**\n` +
                `- Status: ✅ Sucesso\n` +
                `- Clientes encontrados: ${clientes.length}\n` +
                `- Dados: ${JSON.stringify(clientes, null, 2)}\n\n` +
                `**Logs de requisições visíveis no terminal do servidor.**`
        }]
      };
    } catch (error: any) {
      console.error(`🔍 [DEBUG] ERRO: ${error.message}`);
      console.error(`🔍 [DEBUG] Stack: ${error.stack}`);
      return {
        content: [{
          type: "text",
          text: `❌ **Erro no Debug:**\n\n` +
                `**Mensagem:** ${error.message}\n\n` +
                `**Possíveis Causas:**\n` +
                `- Credenciais inválidas\n` +
                `- API VHSys fora do ar\n` +
                `- Problemas de rede\n` +
                `- URL da API incorreta\n\n` +
                `**Verifique os logs no terminal para mais detalhes.**`
        }]
      };
    }
  }
);

server.tool(
  "buscar_cliente",
  "Buscar clientes no VHSys por nome ou email",
  {
    query: z.string().describe("Nome ou email do cliente para buscar"),
    limite: z.number().optional().default(10).describe("Número máximo de resultados")
  },
  async ({ query, limite }) => {
    try {
      const resultados = await vhsysAPI.listarClientes({
        nome: query.includes('@') ? undefined : query,
        email: query.includes('@') ? query : undefined,
        limite
      });

      return {
        content: [{
          type: "text",
          text: `🔍 Encontrados ${resultados.length} cliente(s) para "${query}":\n\n${JSON.stringify(resultados, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao buscar cliente: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "consultar_cliente",
  "Consultar detalhes de um cliente específico",
  {
    cliente_id: z.number().describe("ID do cliente para consultar")
  },
  async ({ cliente_id }) => {
    try {
      const cliente = await vhsysAPI.consultarCliente(cliente_id);

      return {
        content: [{
          type: "text",
          text: `👤 Detalhes do cliente:\n\n${JSON.stringify(cliente, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao consultar cliente: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "cadastrar_cliente",
  "Cadastrar novo cliente no sistema",
  {
    nome: z.string().describe("Nome completo do cliente"),
    email: z.string().email().optional().describe("Email do cliente"),
    telefone: z.string().optional().describe("Telefone do cliente"),
    cpf_cnpj: z.string().optional().describe("CPF ou CNPJ do cliente"),
    logradouro: z.string().optional().describe("Endereço - Logradouro"),
    numero: z.string().optional().describe("Endereço - Número"),
    bairro: z.string().optional().describe("Endereço - Bairro"),
    cidade: z.string().optional().describe("Endereço - Cidade"),
    uf: z.string().optional().describe("Endereço - UF"),
    cep: z.string().optional().describe("Endereço - CEP")
  },
  async ({ nome, email, telefone, cpf_cnpj, logradouro, numero, bairro, cidade, uf, cep }) => {
    try {
      const dadosCliente = {
        nome,
        email,
        telefone,
        cpf_cnpj,
        logradouro,
        numero,
        bairro,
        cidade,
        uf,
        cep
      };

      const resultado = await vhsysAPI.cadastrarCliente(dadosCliente);

      return {
        content: [{
          type: "text",
          text: `✅ Cliente cadastrado com sucesso:\n\n${JSON.stringify(resultado, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao cadastrar cliente: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "buscar_produtos",
  "Buscar produtos por nome ou categoria",
  {
    nome: z.string().optional().describe("Nome do produto para buscar"),
    categoria: z.string().optional().describe("Categoria do produto"),
    limite: z.number().optional().default(20).describe("Limite de resultados")
  },
  async ({ nome, categoria, limite }) => {
    try {
      const produtos = await vhsysAPI.listarProdutos({ nome, categoria, limite });

      return {
        content: [{
          type: "text",
          text: `🛍️ Encontrados ${produtos.length} produto(s):\n\n${JSON.stringify(produtos, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao buscar produtos: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "consultar_produto",
  "Consultar detalhes de um produto específico incluindo estoque",
  {
    produto_id: z.number().describe("ID do produto para consultar")
  },
  async ({ produto_id }) => {
    try {
      const [produto, estoque] = await Promise.all([
        vhsysAPI.consultarProduto(produto_id),
        vhsysAPI.consultarEstoque(produto_id)
      ]);

      return {
        content: [{
          type: "text",
          text: `📦 Produto encontrado:\n\nDetalhes: ${JSON.stringify(produto, null, 2)}\n\nEstoque: ${JSON.stringify(estoque, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao consultar produto: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "listar_pedidos",
  "Listar pedidos com filtros opcionais",
  {
    cliente_id: z.number().optional().describe("ID do cliente"),
    data_inicio: z.string().optional().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().optional().describe("Data final no formato YYYY-MM-DD"),
    status: z.string().optional().describe("Status do pedido"),
    limite: z.number().optional().default(20).describe("Limite de resultados")
  },
  async ({ cliente_id, data_inicio, data_fim, status, limite }) => {
    try {
      const pedidos = await vhsysAPI.listarPedidos({
        cliente_id,
        data_inicio,
        data_fim,
        status,
        limite
      });

      return {
        content: [{
          type: "text",
          text: `📋 Encontrados ${pedidos.length} pedido(s):\n\n${JSON.stringify(pedidos, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao listar pedidos: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "consultar_pedido",
  "Consultar detalhes de um pedido específico",
  {
    pedido_id: z.number().describe("ID do pedido para consultar")
  },
  async ({ pedido_id }) => {
    try {
      const pedido = await vhsysAPI.consultarPedido(pedido_id);

      return {
        content: [{
          type: "text",
          text: `📋 Detalhes do pedido:\n\n${JSON.stringify(pedido, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao consultar pedido: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "relatorio_vendas",
  "Gerar relatório de vendas por período",
  {
    data_inicio: z.string().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().describe("Data final no formato YYYY-MM-DD")
  },
  async ({ data_inicio, data_fim }) => {
    try {
      const relatorio = await vhsysAPI.relatorioVendasPeriodo(data_inicio, data_fim);

      return {
        content: [{
          type: "text",
          text: `📊 Relatório de Vendas (${data_inicio} a ${data_fim}):\n\n${JSON.stringify(relatorio, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao gerar relatório: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "contas_receber",
  "Listar contas a receber com filtros",
  {
    data_inicio: z.string().optional().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().optional().describe("Data final no formato YYYY-MM-DD"),
    situacao: z.enum(["aberto", "pago", "vencido"]).optional().describe("Situação das contas"),
    cliente_id: z.number().optional().describe("ID do cliente")
  },
  async ({ data_inicio, data_fim, situacao, cliente_id }) => {
    try {
      const contas = await vhsysAPI.listarContasReceber({ 
        data_inicio, 
        data_fim, 
        situacao,
        cliente_id
      });

      const totalReceber = contas.reduce((sum: number, conta: any) => sum + (conta.valor || 0), 0);

      return {
        content: [{
          type: "text",
          text: `💰 Contas a Receber:\n\nTotal: ${contas.length} conta(s)\nValor Total: R$ ${totalReceber.toFixed(2)}\n\n${JSON.stringify(contas, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao consultar contas a receber: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "contas_pagar",
  "Listar contas a pagar com filtros",
  {
    data_inicio: z.string().optional().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().optional().describe("Data final no formato YYYY-MM-DD"),
    situacao: z.enum(["aberto", "pago", "vencido"]).optional().describe("Situação das contas")
  },
  async ({ data_inicio, data_fim, situacao }) => {
    try {
      const contas = await vhsysAPI.listarContasPagar({ 
        data_inicio, 
        data_fim, 
        situacao
      });

      const totalPagar = contas.reduce((sum: number, conta: any) => sum + (conta.valor || 0), 0);

      return {
        content: [{
          type: "text",
          text: `💸 Contas a Pagar:\n\nTotal: ${contas.length} conta(s)\nValor Total: R$ ${totalPagar.toFixed(2)}\n\n${JSON.stringify(contas, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao consultar contas a pagar: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "listar_orcamentos",
  "Listar orçamentos com filtros",
  {
    cliente_id: z.number().optional().describe("ID do cliente"),
    data_inicio: z.string().optional().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().optional().describe("Data final no formato YYYY-MM-DD"),
    status: z.string().optional().describe("Status do orçamento")
  },
  async ({ cliente_id, data_inicio, data_fim, status }) => {
    try {
      const orcamentos = await vhsysAPI.listarOrcamentos({
        cliente_id,
        data_inicio,
        data_fim,
        status
      });

      return {
        content: [{
          type: "text",
          text: `📝 Encontrados ${orcamentos.length} orçamento(s):\n\n${JSON.stringify(orcamentos, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao listar orçamentos: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "vendas_balcao",
  "Listar vendas de balcão (PDV)",
  {
    data_inicio: z.string().optional().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().optional().describe("Data final no formato YYYY-MM-DD"),
    limite: z.number().optional().default(50).describe("Limite de resultados")
  },
  async ({ data_inicio, data_fim, limite }) => {
    try {
      const vendas = await vhsysAPI.listarVendasBalcao({
        data_inicio,
        data_fim,
        limite
      });

      const totalVendas = vendas.reduce((sum: number, venda: any) => sum + (venda.valor_total || 0), 0);

      return {
        content: [{
          type: "text",
          text: `🏪 Vendas Balcão/PDV:\n\nTotal: ${vendas.length} venda(s)\nValor Total: R$ ${totalVendas.toFixed(2)}\n\n${JSON.stringify(vendas, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao consultar vendas de balcão: ${error.message}`
        }]
      };
    }
  }
);

// === ORDENS DE SERVIÇO ===

server.tool(
  "listar_ordens_servico",
  "Listar ordens de serviço com filtros opcionais",
  {
    cliente_id: z.number().optional().describe("ID do cliente"),
    status: z.enum(["pendente", "em_andamento", "concluida", "cancelada"]).optional().describe("Status da ordem"),
    prioridade: z.enum(["baixa", "media", "alta", "urgente"]).optional().describe("Prioridade da ordem"),
    tecnico_responsavel: z.string().optional().describe("Nome do técnico responsável"),
    data_inicio: z.string().optional().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().optional().describe("Data final no formato YYYY-MM-DD"),
    limite: z.number().optional().default(20).describe("Limite de resultados")
  },
  async ({ cliente_id, status, prioridade, tecnico_responsavel, data_inicio, data_fim, limite }) => {
    try {
      const ordens = await vhsysAPI.listarOrdensServico({
        cliente_id,
        status,
        prioridade,
        tecnico_responsavel,
        data_inicio,
        data_fim,
        limite
      });

      const valorTotal = ordens.reduce((sum, ordem) => sum + (ordem.valor_servico || 0), 0);

      return {
        content: [{
          type: "text",
          text: `🔧 Ordens de Serviço:\n\nTotal: ${ordens.length} ordem(ns)\nValor Total: R$ ${valorTotal.toFixed(2)}\n\n${JSON.stringify(ordens, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao listar ordens de serviço: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "consultar_ordem_servico",
  "Consultar detalhes de uma ordem de serviço específica",
  {
    ordem_id: z.number().describe("ID da ordem de serviço para consultar")
  },
  async ({ ordem_id }) => {
    try {
      const ordem = await vhsysAPI.consultarOrdemServico(ordem_id);

      return {
        content: [{
          type: "text",
          text: `🔧 Detalhes da Ordem de Serviço #${ordem_id}:\n\n${JSON.stringify(ordem, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao consultar ordem de serviço: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "cadastrar_ordem_servico",
  "Cadastrar nova ordem de serviço",
  {
    cliente_id: z.number().describe("ID do cliente"),
    titulo: z.string().describe("Título da ordem de serviço"),
    descricao: z.string().optional().describe("Descrição detalhada do problema/serviço"),
    prioridade: z.enum(["baixa", "media", "alta", "urgente"]).optional().default("media").describe("Prioridade"),
    data_prazo: z.string().optional().describe("Data prazo no formato YYYY-MM-DD"),
    tecnico_responsavel: z.string().optional().describe("Nome do técnico responsável"),
    valor_servico: z.number().optional().describe("Valor estimado do serviço"),
    observacoes: z.string().optional().describe("Observações adicionais")
  },
  async ({ cliente_id, titulo, descricao, prioridade, data_prazo, tecnico_responsavel, valor_servico, observacoes }) => {
    try {
      const dadosOrdem = {
        cliente_id,
        titulo,
        descricao,
        prioridade,
        data_prazo,
        tecnico_responsavel,
        valor_servico,
        observacoes,
        status: 'pendente' as const,
        data_abertura: new Date().toISOString()
      };

      const resultado = await vhsysAPI.cadastrarOrdemServico(dadosOrdem);

      return {
        content: [{
          type: "text",
          text: `✅ Ordem de Serviço cadastrada com sucesso:\n\n${JSON.stringify(resultado, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao cadastrar ordem de serviço: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "atualizar_ordem_servico",
  "Atualizar dados de uma ordem de serviço",
  {
    ordem_id: z.number().describe("ID da ordem de serviço"),
    titulo: z.string().optional().describe("Novo título"),
    descricao: z.string().optional().describe("Nova descrição"),
    prioridade: z.enum(["baixa", "media", "alta", "urgente"]).optional().describe("Nova prioridade"),
    data_prazo: z.string().optional().describe("Novo prazo no formato YYYY-MM-DD"),
    tecnico_responsavel: z.string().optional().describe("Novo técnico responsável"),
    valor_servico: z.number().optional().describe("Novo valor do serviço"),
    observacoes: z.string().optional().describe("Novas observações")
  },
  async ({ ordem_id, ...dadosAtualizacao }) => {
    try {
      const resultado = await vhsysAPI.atualizarOrdemServico(ordem_id, dadosAtualizacao);

      return {
        content: [{
          type: "text",
          text: `✅ Ordem de Serviço #${ordem_id} atualizada:\n\n${JSON.stringify(resultado, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao atualizar ordem de serviço: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "alterar_status_ordem_servico",
  "Alterar o status de uma ordem de serviço",
  {
    ordem_id: z.number().describe("ID da ordem de serviço"),
    novo_status: z.enum(["pendente", "em_andamento", "concluida", "cancelada"]).describe("Novo status"),
    observacoes: z.string().optional().describe("Observações sobre a mudança de status")
  },
  async ({ ordem_id, novo_status, observacoes }) => {
    try {
      const resultado = await vhsysAPI.alterarStatusOrdemServico(ordem_id, novo_status, observacoes);

      return {
        content: [{
          type: "text",
          text: `✅ Status da Ordem #${ordem_id} alterado para "${novo_status}":\n\n${JSON.stringify(resultado, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao alterar status: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "listar_ordens_tecnico",
  "Listar ordens de serviço de um técnico específico",
  {
    tecnico_id: z.string().describe("ID/Nome do técnico"),
    status: z.enum(["pendente", "em_andamento", "concluida", "cancelada"]).optional().describe("Filtrar por status"),
    data_inicio: z.string().optional().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().optional().describe("Data final no formato YYYY-MM-DD")
  },
  async ({ tecnico_id, status, data_inicio, data_fim }) => {
    try {
      const ordens = await vhsysAPI.listarOrdensServicoTecnico(tecnico_id, {
        status,
        data_inicio,
        data_fim
      });

      const valorTotal = ordens.reduce((sum, ordem) => sum + (ordem.valor_servico || 0), 0);

      return {
        content: [{
          type: "text",
          text: `👨‍🔧 Ordens do Técnico "${tecnico_id}":\n\nTotal: ${ordens.length} ordem(ns)\nValor Total: R$ ${valorTotal.toFixed(2)}\n\n${JSON.stringify(ordens, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao listar ordens do técnico: ${error.message}`
        }]
      };
    }
  }
);

server.tool(
  "relatorio_ordens_servico",
  "Gerar relatório de ordens de serviço por período",
  {
    data_inicio: z.string().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().describe("Data final no formato YYYY-MM-DD")
  },
  async ({ data_inicio, data_fim }) => {
    try {
      const relatorio = await vhsysAPI.relatorioOrdensServico(data_inicio, data_fim);

      return {
        content: [{
          type: "text",
          text: `📊 Relatório de Ordens de Serviço (${data_inicio} a ${data_fim}):\n\n${JSON.stringify(relatorio, null, 2)}`
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `❌ Erro ao gerar relatório: ${error.message}`
        }]
      };
    }
  }
);

// ===== PROMPTS (Templates para IA) =====

server.prompt(
  "relatorio_diario",
  "Gera um relatório diário completo usando as tools disponíveis",
  {
    data: z.string().optional().describe("Data para o relatório (YYYY-MM-DD), padrão hoje")
  },
  ({ data }) => {
    const dataRelatorio = data || new Date().toISOString().split('T')[0];
    
    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Gere um relatório diário completo do VHSys para ${dataRelatorio}. Use as tools disponíveis para buscar informações sobre vendas, produtos e financeiro.`
        }
      }]
    };
  }
);

server.prompt(
  "relatorio_ordens_servico",
  "Gera um relatório detalhado de ordens de serviço",
  {
    data_inicio: z.string().describe("Data inicial no formato YYYY-MM-DD"),
    data_fim: z.string().describe("Data final no formato YYYY-MM-DD"),
    incluir_detalhes: z.string().optional().describe("Incluir detalhes das ordens (sim/não)")
  },
  ({ data_inicio, data_fim, incluir_detalhes }) => {
    const comDetalhes = !incluir_detalhes || incluir_detalhes?.toLowerCase() === 'sim';
    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Gere um relatório completo de ordens de serviço do período de ${data_inicio} a ${data_fim}. ${comDetalhes ? 'Inclua análises detalhadas, ordens por status, técnicos, prioridades e sugestões de melhorias.' : 'Faça um resumo executivo.'} Use as ferramentas de ordens de serviço disponíveis.`
        }
      }]
    };
  }
);

server.prompt(
  "dashboard_tecnico",
  "Gera um dashboard personalizado para um técnico específico",
  {
    tecnico_id: z.string().describe("ID/Nome do técnico"),
    data_inicio: z.string().optional().describe("Data inicial (padrão: início do mês)"),
    data_fim: z.string().optional().describe("Data final (padrão: hoje)")
  },
  ({ tecnico_id, data_inicio, data_fim }) => {
    const hoje = new Date().toISOString().split('T')[0];
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    const dataIni = data_inicio || inicioMes;
    const dataFim = data_fim || hoje;
    
    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Gere um dashboard personalizado para o técnico "${tecnico_id}" no período de ${dataIni} a ${dataFim}. Inclua: ordens pendentes, em andamento, concluídas, análise de performance, tempo médio de resolução e sugestões de otimização. Use as ferramentas de ordens de serviço disponíveis.`
        }
      }]
    };
  }
);

// Prompts adicionais podem ser adicionados aqui no futuro

// ===== INICIALIZAÇÃO DO SERVIDOR =====

async function main() {
  // Redirecionar logs para stderr para não interferir no protocolo MCP
  console.error("🚀 Iniciando servidor VHSys MCP...");
  
  try {
    // Testar conexão com VHSys
    const conectado = await vhsysAPI.testarConexao();
    if (!conectado) {
      console.error("❌ Falha na conexão com VHSys - verifique suas credenciais no .env");
      process.exit(1);
    }
    
    console.error("✅ Conexão com VHSys estabelecida");
    
    // Conectar servidor MCP
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // Log MCP válido via stderr
    console.error("🎉 Servidor VHSys MCP iniciado com sucesso!");
    
  } catch (error: any) {
    console.error("💥 Erro ao iniciar servidor:", error.message);
    process.exit(1);
  }
}

// Tratar sinais do sistema
process.on('SIGINT', () => {
  console.error('\n🛑 Encerrando servidor VHSys MCP...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 Encerrando servidor VHSys MCP...');
  process.exit(0);
});

// Iniciar servidor
main().catch((error) => {
  console.error("💥 Erro crítico:", error);
  process.exit(1);
}); 