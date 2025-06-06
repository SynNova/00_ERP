import axios from 'axios';

export class VHSysAPI {
  constructor(config) {
    this.config = {
      token: config?.token || process.env.VHSYS_TOKEN || '',
      secret: config?.secret || process.env.VHSYS_SECRET_TOKEN || process.env.VHSYS_SECRET || '',
      baseUrl: config?.baseUrl || process.env.VHSYS_BASE_URL || 'https://api.vhsys.com.br/v2'
    };

    if (!this.config.token || !this.config.secret) {
      throw new Error('VHSYS_TOKEN e VHSYS_SECRET são obrigatórios');
    }

    this.api = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'access-token': this.config.token,
        'secret-access-token': this.config.secret,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    // Interceptor para logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[VHSys API] ${config.method?.toUpperCase()} ${config.url}`);
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
  async listarClientes(limite = 100) {
    try {
      const params = new URLSearchParams();
      if (limite) params.append('limite', limite.toString());
      
      const response = await this.api.get(`/clientes?${params.toString()}`);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao listar clientes:', error.message);
      return [];
    }
  }

  async buscarCliente(query) {
    try {
      // Se for um número, buscar por ID
      if (!isNaN(query)) {
        const response = await this.api.get(`/clientes/${query}`);
        return response.data.data || response.data;
      }
      
      // Caso contrário, buscar por nome
      const params = new URLSearchParams();
      params.append('nome', query);
      
      const response = await this.api.get(`/clientes?${params.toString()}`);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao buscar cliente:', error.message);
      return null;
    }
  }

  async consultarCliente(id) {
    try {
      const response = await this.api.get(`/clientes/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao consultar cliente:', error.message);
      return null;
    }
  }

  async cadastrarCliente(dadosCliente) {
    try {
      const response = await this.api.post('/clientes', dadosCliente);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error.message);
      throw error;
    }
  }

  // === PRODUTOS ===
  async listarProdutos(limite = 100) {
    try {
      const params = new URLSearchParams();
      if (limite) params.append('limite', limite.toString());
      
      const response = await this.api.get(`/produtos?${params.toString()}`);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao listar produtos:', error.message);
      return [];
    }
  }

  async buscarProduto(query) {
    try {
      // Se for um número, buscar por ID
      if (!isNaN(query)) {
        const response = await this.api.get(`/produtos/${query}`);
        return response.data.data || response.data;
      }
      
      // Caso contrário, buscar por nome
      const params = new URLSearchParams();
      params.append('nome', query);
      
      const response = await this.api.get(`/produtos?${params.toString()}`);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao buscar produto:', error.message);
      return null;
    }
  }

  async consultarProduto(id) {
    try {
      const response = await this.api.get(`/produtos/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao consultar produto:', error.message);
      return null;
    }
  }

  async consultarEstoque(produtoId) {
    try {
      const response = await this.api.get(`/produtos/${produtoId}/estoque`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao consultar estoque:', error.message);
      return null;
    }
  }

  // === PEDIDOS ===
  async listarPedidos(filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.limite) params.append('limite', filtros.limite.toString());
      if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
      if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
      if (filtros.status) params.append('status', filtros.status);
      
      const response = await this.api.get(`/pedidos?${params.toString()}`);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao listar pedidos:', error.message);
      return [];
    }
  }

  async consultarPedido(id) {
    try {
      const response = await this.api.get(`/pedidos/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao consultar pedido:', error.message);
      return null;
    }
  }

  // === ORDENS DE SERVIÇO ===
  async listarOrdensServico(filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.limite) params.append('limite', filtros.limite.toString());
      if (filtros.cliente_id) params.append('cliente_id', filtros.cliente_id.toString());
      if (filtros.status) params.append('status', filtros.status);
      if (filtros.prioridade) params.append('prioridade', filtros.prioridade);
      
      const response = await this.api.get(`/ordens-servico?${params.toString()}`);
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao listar ordens de serviço:', error.message);
      return [];
    }
  }

  async consultarOrdemServico(id) {
    try {
      const response = await this.api.get(`/ordens-servico/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao consultar ordem de serviço:', error.message);
      return null;
    }
  }

  // === TESTE DE CONEXÃO ===
  async testarConexao() {
    try {
      const response = await this.api.get('/clientes?limite=1');
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao testar conexão:', error.message);
      return false;
    }
  }

  // === RELATÓRIOS ===
  async dashboardVendas() {
    try {
      // Simulação de dashboard - adapte conforme sua API
      const hoje = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      
      const [pedidosHoje, pedidosMes] = await Promise.all([
        this.listarPedidos({ data_inicio: hoje, data_fim: hoje }),
        this.listarPedidos({ data_inicio: inicioMes, data_fim: hoje })
      ]);

      return {
        vendas_hoje: pedidosHoje.reduce((acc, p) => acc + (p.valor_total || 0), 0),
        vendas_mes: pedidosMes.reduce((acc, p) => acc + (p.valor_total || 0), 0),
        pedidos_hoje: pedidosHoje.length,
        pedidos_mes: pedidosMes.length,
        ticket_medio: pedidosMes.length > 0 ? 
          pedidosMes.reduce((acc, p) => acc + (p.valor_total || 0), 0) / pedidosMes.length : 0
      };
    } catch (error) {
      console.error('Erro ao gerar dashboard:', error.message);
      return null;
    }
  }
} 