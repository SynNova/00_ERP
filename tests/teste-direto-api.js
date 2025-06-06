#!/usr/bin/env node

const axios = require('axios');

// Configurações da API VHSys
const config = {
    baseURL: 'https://api.vhsys.com.br/v2',
    headers: {
        'Authorization': 'Bearer ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ',
        'X-Secret-Token': '33DnRiebFchQb2GyrVNTKxPHY6C8q',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000
};

// Criar instância do axios
const api = axios.create(config);

// Função para fazer requisições com log detalhado
async function testarEndpoint(nome, endpoint) {
    console.log(`\n🔍 === ${nome} ===`);
    console.log(`📍 Endpoint: ${config.baseURL}${endpoint}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    try {
        const inicioTempo = Date.now();
        const response = await api.get(endpoint);
        const tempoResposta = Date.now() - inicioTempo;
        
        console.log(`✅ Status: ${response.status} ${response.statusText}`);
        console.log(`⚡ Tempo de resposta: ${tempoResposta}ms`);
        console.log(`📦 Dados recebidos:`, JSON.stringify(response.data, null, 2));
        
        return { sucesso: true, dados: response.data, tempo: tempoResposta };
        
    } catch (error) {
        console.log(`❌ ERRO:`);
        
        if (error.response) {
            // Erro da API (4xx, 5xx)
            console.log(`📊 Status: ${error.response.status} ${error.response.statusText}`);
            console.log(`📋 Headers:`, error.response.headers);
            console.log(`💬 Resposta:`, error.response.data);
        } else if (error.request) {
            // Erro de rede
            console.log(`🌐 Erro de rede:`, error.message);
            console.log(`🔗 Request config:`, error.config);
        } else {
            // Outro erro
            console.log(`⚠️ Erro geral:`, error.message);
        }
        
        return { sucesso: false, erro: error.message };
    }
}

// Função principal
async function executarTestes() {
    console.log('🚀 ===== TESTE DIRETO API VHSYS =====');
    console.log('🏢 SynNova Software - Integração ERP');
    console.log(`🔧 Base URL: ${config.baseURL}`);
    console.log(`🔑 Token: ${config.headers.Authorization.substring(0, 20)}...`);
    console.log(`🔐 Secret: ${config.headers['X-Secret-Token'].substring(0, 10)}...`);
    
    const testes = [
        { nome: 'Conectividade Básica', endpoint: '/clientes?limite=1' },
        { nome: 'Listar Clientes', endpoint: '/clientes?limite=5' },
        { nome: 'Listar Produtos', endpoint: '/produtos?limite=5' },
        { nome: 'Listar Categorias', endpoint: '/categorias' },
        { nome: 'Pedidos de Hoje', endpoint: `/pedidos?data_inicio=${new Date().toISOString().split('T')[0]}&limite=5` },
        { nome: 'Contas a Receber', endpoint: '/contas-receber?limite=3' }
    ];
    
    const resultados = {};
    
    for (const teste of testes) {
        const resultado = await testarEndpoint(teste.nome, teste.endpoint);
        resultados[teste.nome] = resultado;
        
        // Aguardar um pouco entre as requisições
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Resumo final
    console.log('\n📊 ===== RESUMO DOS TESTES =====');
    
    let sucessos = 0;
    let falhas = 0;
    
    for (const [nome, resultado] of Object.entries(resultados)) {
        if (resultado.sucesso) {
            console.log(`✅ ${nome}: OK (${resultado.tempo}ms)`);
            sucessos++;
        } else {
            console.log(`❌ ${nome}: FALHOU - ${resultado.erro}`);
            falhas++;
        }
    }
    
    console.log(`\n📈 Total: ${sucessos} sucessos, ${falhas} falhas`);
    
    if (sucessos > 0) {
        console.log('🎉 A API VHSys está FUNCIONANDO!');
    } else {
        console.log('🚨 A API VHSys NÃO está respondendo corretamente.');
        console.log('💡 Verifique:');
        console.log('   - Credenciais (Token e Secret Token)');
        console.log('   - Conectividade com a internet');
        console.log('   - Status da API VHSys');
    }
    
    return resultados;
}

// Executar se chamado diretamente
if (require.main === module) {
    executarTestes()
        .then(() => {
            console.log('\n✅ Teste concluído!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Erro fatal:', error.message);
            process.exit(1);
        });
}

module.exports = { executarTestes, testarEndpoint }; 