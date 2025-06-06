import axios, { AxiosInstance, AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface VHSysConfig {
  token: string;
  secretToken: string;
  baseURL: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpf_cnpj?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

export interface Produto {
  id?: number;
  nome: string;
  preco?: number;
  categoria?: string;
  estoque_atual?: number;
  estoque_minimo?: number;
}

export interface Pedido {
  id?: number;
  cliente_id: number;
  valor_total?: number;
  data_pedido?: string;
  status?: string;
  produtos?: Array<{
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
  }>;
}

export interface OrdemServico {
  id?: number;
  cliente_id: number;
  titulo: string;
  descricao?: string;
  status?: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';
  data_abertura?: string;
  data_prazo?: string;
  data_conclusao?: string;
  tecnico_responsavel?: string;
  valor_servico?: number;
  observacoes?: string;
  servicos?: Array<{
    descricao: string;
    quantidade: number;
    valor_unitario: number;
  }>;
  pecas_utilizadas?: Array<{
    produto_id: number;
    quantidade: number;
    valor_unitario: number;
  }>;
}

export class VHSysAPI {
  private api: AxiosInstance;
  private config: VHSysConfig;

  constructor() {
    this.config = {
      token: process.env.VHSYS_TOKEN || '',
      secretToken: process.env.VHSYS_SECRET_TOKEN || '',
      baseURL: process.env.VHSYS_BASE_URL || 'https://api.vhsys.com.br/v2'
    };

    if (!this.config.token || !this.config.secretToken) {
      throw new Error('VHSYS_TOKEN e VHSYS_SECRET_TOKEN são obrigatórios no arquivo .env');
    }

    this.api = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'access-token': this.config.token,
        'secret-access-token': this.config.secretToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    // Interceptor para logging de requests (via stderr para não interferir no MCP)
    this.api.interceptors.request.use(
      (config) => {
        // Log ativado para debug - será visível no terminal
        console.error(`[VHSys API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[VHSys API] Erro na requisição:', error.message);
        return Promise.reject(error);
      }
    );

    // Interceptor para tratamento de erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error(`[VHSys API] Erro ${error.response.status}:`, error.response.data);
        } else if (error.request) {
          console.error('[VHSys API] Erro de rede:', error.message);
        } else {
          console.error('[VHSys API] Erro:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // === CLIENTES ===
  async listarClientes(filtros?: { 
    nome?: string; 
    email?: string; 
    limite?: number;
    pagina?: number;
  }): Promise<Cliente[]> {
    const params = new URLSearchParams();
    if (filtros?.nome) params.append('nome', filtros.nome);
    if (filtros?.email) params.append('email', filtros.email);
    if (filtros?.limite) params.append('limite', filtros.limite.toString());
    if (filtros?.pagina) params.append('pagina', filtros.pagina.toString());

    const response = await this.api.get(`/clientes?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async consultarCliente(id: number): Promise<Cliente> {
    const response = await this.api.get(`/clientes/${id}`);
    return response.data.data || response.data;
  }

  async cadastrarCliente(dadosCliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const response = await this.api.post('/clientes', dadosCliente);
    return response.data.data || response.data;
  }

  async atualizarCliente(id: number, dadosCliente: Partial<Cliente>): Promise<Cliente> {
    const response = await this.api.put(`/clientes/${id}`, dadosCliente);
    return response.data.data || response.data;
  }

  async excluirCliente(id: number): Promise<boolean> {
    await this.api.delete(`/clientes/${id}`);
    return true;
  }

  // === PRODUTOS ===
  async listarProdutos(filtros?: { 
    nome?: string; 
    categoria?: string; 
    limite?: number;
    pagina?: number;
  }): Promise<Produto[]> {
    const params = new URLSearchParams();
    if (filtros?.nome) params.append('nome', filtros.nome);
    if (filtros?.categoria) params.append('categoria', filtros.categoria);
    if (filtros?.limite) params.append('limite', filtros.limite.toString());
    if (filtros?.pagina) params.append('pagina', filtros.pagina.toString());

    const response = await this.api.get(`/produtos?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async consultarProduto(id: number): Promise<Produto> {
    const response = await this.api.get(`/produtos/${id}`);
    return response.data.data || response.data;
  }

  async consultarEstoque(produtoId: number): Promise<any> {
    const response = await this.api.get(`/produtos/${produtoId}/estoque`);
    return response.data.data || response.data;
  }

  async cadastrarProduto(dadosProduto: Omit<Produto, 'id'>): Promise<Produto> {
    const response = await this.api.post('/produtos', dadosProduto);
    return response.data.data || response.data;
  }

  // === VENDAS/PEDIDOS ===
  async listarPedidos(filtros?: { 
    cliente_id?: number; 
    data_inicio?: string; 
    data_fim?: string;
    status?: string;
    limite?: number;
  }): Promise<Pedido[]> {
    const params = new URLSearchParams();
    if (filtros?.cliente_id) params.append('cliente_id', filtros.cliente_id.toString());
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros?.status) params.append('status', filtros.status);
    if (filtros?.limite) params.append('limite', filtros.limite.toString());

    const response = await this.api.get(`/pedidos?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async consultarPedido(id: number): Promise<Pedido> {
    const response = await this.api.get(`/pedidos/${id}`);
    return response.data.data || response.data;
  }

  async cadastrarPedido(dadosPedido: Omit<Pedido, 'id'>): Promise<Pedido> {
    const response = await this.api.post('/pedidos', dadosPedido);
    return response.data.data || response.data;
  }

  // === FINANCEIRO ===
  async listarContasReceber(filtros?: { 
    data_inicio?: string; 
    data_fim?: string; 
    situacao?: string;
    cliente_id?: number;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros?.situacao) params.append('situacao', filtros.situacao);
    if (filtros?.cliente_id) params.append('cliente_id', filtros.cliente_id.toString());

    const response = await this.api.get(`/contas-receber?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async listarContasPagar(filtros?: { 
    data_inicio?: string; 
    data_fim?: string; 
    situacao?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros?.situacao) params.append('situacao', filtros.situacao);

    const response = await this.api.get(`/contas-pagar?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async liquidarContaReceber(id: number, dadosLiquidacao: {
    valor_recebido: number;
    data_recebimento: string;
    conta_bancaria_id?: number;
  }): Promise<any> {
    const response = await this.api.post(`/contas-receber/${id}/liquidar`, dadosLiquidacao);
    return response.data.data || response.data;
  }

  // === ORÇAMENTOS ===
  async listarOrcamentos(filtros?: {
    cliente_id?: number;
    data_inicio?: string;
    data_fim?: string;
    status?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.cliente_id) params.append('cliente_id', filtros.cliente_id.toString());
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros?.status) params.append('status', filtros.status);

    const response = await this.api.get(`/orcamentos?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async consultarOrcamento(id: number): Promise<any> {
    const response = await this.api.get(`/orcamentos/${id}`);
    return response.data.data || response.data;
  }

  // === ORDENS DE SERVIÇO ===
  async listarOrdensServico(filtros?: {
    cliente_id?: number;
    status?: string;
    prioridade?: string;
    tecnico_responsavel?: string;
    data_inicio?: string;
    data_fim?: string;
    limite?: number;
    pagina?: number;
  }): Promise<OrdemServico[]> {
    const params = new URLSearchParams();
    if (filtros?.cliente_id) params.append('cliente_id', filtros.cliente_id.toString());
    if (filtros?.status) params.append('status', filtros.status);
    if (filtros?.prioridade) params.append('prioridade', filtros.prioridade);
    if (filtros?.tecnico_responsavel) params.append('tecnico_responsavel', filtros.tecnico_responsavel);
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros?.limite) params.append('limite', filtros.limite.toString());
    if (filtros?.pagina) params.append('pagina', filtros.pagina.toString());

    const response = await this.api.get(`/ordens-servico?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async consultarOrdemServico(id: number): Promise<OrdemServico> {
    const response = await this.api.get(`/ordens-servico/${id}`);
    return response.data.data || response.data;
  }

  async cadastrarOrdemServico(dadosOrdem: Omit<OrdemServico, 'id'>): Promise<OrdemServico> {
    const response = await this.api.post('/ordens-servico', dadosOrdem);
    return response.data.data || response.data;
  }

  async atualizarOrdemServico(id: number, dadosOrdem: Partial<OrdemServico>): Promise<OrdemServico> {
    const response = await this.api.put(`/ordens-servico/${id}`, dadosOrdem);
    return response.data.data || response.data;
  }

  async alterarStatusOrdemServico(id: number, novoStatus: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada', observacoes?: string): Promise<OrdemServico> {
    const dados: any = { status: novoStatus };
    if (observacoes) dados.observacoes = observacoes;
    if (novoStatus === 'concluida') dados.data_conclusao = new Date().toISOString();
    
    const response = await this.api.put(`/ordens-servico/${id}/status`, dados);
    return response.data.data || response.data;
  }

  async listarOrdensServicoTecnico(tecnicoId: string, filtros?: {
    status?: string;
    data_inicio?: string;
    data_fim?: string;
  }): Promise<OrdemServico[]> {
    const params = new URLSearchParams();
    params.append('tecnico_responsavel', tecnicoId);
    if (filtros?.status) params.append('status', filtros.status);
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);

    const response = await this.api.get(`/ordens-servico?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  async relatorioOrdensServico(dataInicio: string, dataFim: string): Promise<{
    periodo: string;
    ordens_abertas: number;
    ordens_concluidas: number;
    ordens_em_andamento: number;
    ordens_canceladas: number;
    tempo_medio_resolucao: number;
    valor_total_servicos: number;
    ordens: OrdemServico[];
  }> {
    // Converter formato de data se necessário (DD-MM-YYYY -> YYYY-MM-DD)
    const formatarData = (data: string): string => {
      if (data.includes('-') && data.length === 10) {
        const partes = data.split('-');
        if (partes[0].length === 2) {
          // Formato DD-MM-YYYY -> YYYY-MM-DD
          return `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
      }
      return data; // Já está no formato correto ou formato desconhecido
    };

    const dataInicioFormatada = formatarData(dataInicio);
    const dataFimFormatada = formatarData(dataFim);

    const ordens = await this.listarOrdensServico({ 
      data_inicio: dataInicioFormatada, 
      data_fim: dataFimFormatada,
      limite: 1000
    });
    
    const ordensAbertas = ordens.filter(o => o.status === 'pendente').length;
    const ordensConcluidas = ordens.filter(o => o.status === 'concluida').length;
    const ordensEmAndamento = ordens.filter(o => o.status === 'em_andamento').length;
    const ordensCanceladas = ordens.filter(o => o.status === 'cancelada').length;
    
    const valorTotal = ordens.reduce((sum, ordem) => sum + (ordem.valor_servico || 0), 0);
    
    // Calcular tempo médio de resolução (em dias)
    const ordensConclusao = ordens.filter(o => o.data_abertura && o.data_conclusao);
    let tempoMedio = 0;
    
    if (ordensConclusao.length > 0) {
      const totalDias = ordensConclusao.reduce((sum, ordem) => {
        const abertura = new Date(ordem.data_abertura!);
        const conclusao = new Date(ordem.data_conclusao!);
        const dias = Math.ceil((conclusao.getTime() - abertura.getTime()) / (1000 * 60 * 60 * 24));
        return sum + dias;
      }, 0);
      tempoMedio = totalDias / ordensConclusao.length;
    }
    
    return {
      periodo: `${dataInicioFormatada} a ${dataFimFormatada}`,
      ordens_abertas: ordensAbertas,
      ordens_concluidas: ordensConcluidas,
      ordens_em_andamento: ordensEmAndamento,
      ordens_canceladas: ordensCanceladas,
      tempo_medio_resolucao: tempoMedio,
      valor_total_servicos: valorTotal,
      ordens: ordens
    };
  }

  // === VENDAS BALCÃO (PDV) ===
  async listarVendasBalcao(filtros?: {
    data_inicio?: string;
    data_fim?: string;
    limite?: number;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros?.limite) params.append('limite', filtros.limite.toString());

    const response = await this.api.get(`/vendas-balcao?${params.toString()}`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  // === CATEGORIAS ===
  async listarCategorias(): Promise<any[]> {
    const response = await this.api.get('/categorias');
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  // === RELATÓRIOS E ANÁLISES ===
  async relatorioVendasPeriodo(dataInicio: string, dataFim: string): Promise<{
    periodo: string;
    total_vendas: number;
    quantidade_pedidos: number;
    ticket_medio: number;
    pedidos: Pedido[];
    vendas_balcao: any[];
  }> {
    const [pedidos, vendasBalcao] = await Promise.all([
      this.listarPedidos({ data_inicio: dataInicio, data_fim: dataFim }),
      this.listarVendasBalcao({ data_inicio: dataInicio, data_fim: dataFim })
    ]);
    
    const totalVendasPedidos = pedidos.reduce((sum, pedido) => sum + (pedido.valor_total || 0), 0);
    const totalVendasBalcao = vendasBalcao.reduce((sum: number, venda: any) => sum + (venda.valor_total || 0), 0);
    const totalVendas = totalVendasPedidos + totalVendasBalcao;
    const quantidadeTotal = pedidos.length + vendasBalcao.length;
    
    return {
      periodo: `${dataInicio} a ${dataFim}`,
      total_vendas: totalVendas,
      quantidade_pedidos: quantidadeTotal,
      ticket_medio: quantidadeTotal > 0 ? totalVendas / quantidadeTotal : 0,
      pedidos: pedidos,
      vendas_balcao: vendasBalcao
    };
  }

  async dashboardVendas(): Promise<{
    vendas_hoje: number;
    vendas_mes: number;
    contas_vencidas: number;
    produtos_estoque_baixo: number;
    ordens_pendentes: number;
    ordens_urgentes: number;
    ordens_vencidas: number;
  }> {
    const hoje = new Date().toISOString().split('T')[0];
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    try {
      const [vendasHoje, vendasMes, contasReceber, produtos, ordensPendentes] = await Promise.all([
        this.relatorioVendasPeriodo(hoje, hoje),
        this.relatorioVendasPeriodo(inicioMes, hoje),
        this.listarContasReceber({ situacao: 'vencido' }),
        this.listarProdutos({ limite: 1000 }),
        this.listarOrdensServico({ status: 'pendente', limite: 1000 })
      ]);

      const produtosEstoqueBaixo = produtos.filter(p => 
        p.estoque_atual !== undefined && 
        p.estoque_minimo !== undefined && 
        p.estoque_atual <= p.estoque_minimo
      );

      const ordensUrgentes = ordensPendentes.filter(o => o.prioridade === 'urgente');
      const ordensVencidas = ordensPendentes.filter(o => 
        o.data_prazo && new Date(o.data_prazo) < new Date()
      );

      return {
        vendas_hoje: vendasHoje.total_vendas,
        vendas_mes: vendasMes.total_vendas,
        contas_vencidas: contasReceber.length,
        produtos_estoque_baixo: produtosEstoqueBaixo.length,
        ordens_pendentes: ordensPendentes.length,
        ordens_urgentes: ordensUrgentes.length,
        ordens_vencidas: ordensVencidas.length
      };
    } catch (error: any) {
      // Log mantido via stderr para debug crítico
      console.error('Erro ao gerar dashboard:', error.message);
      throw error;
    }
  }

  // === UTILITÁRIOS ===
  async testarConexao(): Promise<boolean> {
    try {
      await this.listarClientes({ limite: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }
} 