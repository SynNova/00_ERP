import { VHSysAPI } from './build/vhsys-api.js';

console.log('🚀 === TESTE RÁPIDO API VHSYS ===');

// Configurar variáveis de ambiente
process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
process.env.VHSYS_SECRET_TOKEN = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';

async function testarAPI() {
    try {
        console.log('🔧 Inicializando VHSysAPI...');
        const api = new VHSysAPI();
        
        console.log('🔍 Testando conectividade...');
        const conectado = await api.testarConexao();
        console.log(`📡 Conexão: ${conectado ? '✅ SUCESSO' : '❌ FALHOU'}`);
        
        if (conectado) {
            console.log('\n👥 Testando listagem de clientes...');
            const clientes = await api.listarClientes({ limite: 3 });
            console.log(`📊 Clientes encontrados: ${clientes.length}`);
            console.log('📄 Dados:', JSON.stringify(clientes, null, 2));
            
            console.log('\n📦 Testando listagem de produtos...');
            const produtos = await api.listarProdutos({ limite: 3 });
            console.log(`📊 Produtos encontrados: ${produtos.length}`);
            console.log('📄 Dados:', JSON.stringify(produtos, null, 2));
        }
        
    } catch (error) {
        console.error('💥 Erro no teste:', error.message);
        console.error('📋 Stack:', error.stack);
    }
}

testarAPI(); 