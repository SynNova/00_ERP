#!/usr/bin/env node

import { VHSysAPI } from './build/vhsys-api.js';

// Configurar credenciais
process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
process.env.VHSYS_SECRET_TOKEN = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';

const api = new VHSysAPI();

// Comandos disponíveis
const comandos = {
    'test': async () => {
        console.log('🔍 Testando conexão VHSys...');
        const conectado = await api.testarConexao();
        console.log(conectado ? '✅ Conectado!' : '❌ Falha na conexão');
        return conectado;
    },
    
    'clientes': async (limite = 5) => {
        console.log(`👥 Listando ${limite} clientes...`);
        const clientes = await api.listarClientes({ limite: parseInt(limite) });
        console.log(`Encontrados: ${clientes.length} clientes`);
        clientes.forEach((cliente, i) => {
            console.log(`${i+1}. ${cliente.razao_cliente || cliente.nome_cliente} (ID: ${cliente.id_cliente})`);
        });
        return clientes;
    },
    
    'produtos': async (limite = 5) => {
        console.log(`📦 Listando ${limite} produtos...`);
        const produtos = await api.listarProdutos({ limite: parseInt(limite) });
        console.log(`Encontrados: ${produtos.length} produtos`);
        produtos.forEach((produto, i) => {
            console.log(`${i+1}. ${produto.desc_produto} - R$ ${produto.valor_produto}`);
        });
        return produtos;
    },
    
    'ordens': async (limite = 5) => {
        console.log(`🔧 Listando ${limite} ordens de serviço...`);
        const ordens = await api.listarOrdensServico({ limite: parseInt(limite) });
        console.log(`Encontradas: ${ordens.length} ordens`);
        ordens.forEach((ordem, i) => {
            console.log(`${i+1}. ${ordem.nome_cliente} - ${ordem.referencia_ordem} (${ordem.status_pedido})`);
        });
        return ordens;
    },
    
    'dashboard': async () => {
        console.log('📊 Gerando dashboard...');
        try {
            const dash = await api.dashboardVendas();
            console.log('Dashboard VHSys:');
            console.log(`├─ Vendas hoje: R$ ${dash.vendas_hoje}`);
            console.log(`├─ Vendas mês: R$ ${dash.vendas_mes}`);
            console.log(`├─ Contas vencidas: ${dash.contas_vencidas}`);
            console.log(`├─ Produtos estoque baixo: ${dash.produtos_estoque_baixo}`);
            console.log(`├─ Ordens pendentes: ${dash.ordens_pendentes}`);
            console.log(`├─ Ordens urgentes: ${dash.ordens_urgentes}`);
            console.log(`└─ Ordens vencidas: ${dash.ordens_vencidas}`);
            return dash;
        } catch (error) {
            console.log('⚠️ Alguns dados do dashboard não disponíveis');
            return null;
        }
    },
    
    'help': () => {
        console.log(`
🚀 VHSys CLI - Comandos disponíveis:

📋 Básicos:
  node vhsys-cli.js test              - Testar conexão
  node vhsys-cli.js help              - Mostrar esta ajuda

👥 Clientes:
  node vhsys-cli.js clientes [num]    - Listar clientes (padrão: 5)

📦 Produtos:
  node vhsys-cli.js produtos [num]    - Listar produtos (padrão: 5)

🔧 Ordens:
  node vhsys-cli.js ordens [num]      - Listar ordens de serviço (padrão: 5)

📊 Relatórios:
  node vhsys-cli.js dashboard         - Dashboard completo

📝 Exemplos:
  node vhsys-cli.js clientes 10       - Listar 10 clientes
  node vhsys-cli.js produtos 3        - Listar 3 produtos
        `);
    }
};

// Executar comando
async function executar() {
    const [,, comando, ...args] = process.argv;
    
    if (!comando || comando === 'help') {
        comandos.help();
        return;
    }
    
    if (!comandos[comando]) {
        console.log(`❌ Comando '${comando}' não encontrado. Use 'help' para ver comandos disponíveis.`);
        return;
    }
    
    try {
        await comandos[comando](...args);
    } catch (error) {
        console.log(`❌ Erro: ${error.message}`);
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executar();
}

export { comandos, executar }; 