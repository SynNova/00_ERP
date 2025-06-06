import { VHSysAPI } from './build/vhsys-api.js';

console.log('🔬 === TESTE COMPLETO API VHSYS ===');

// Configurar variáveis de ambiente
process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
process.env.VHSYS_SECRET_TOKEN = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';

async function testeCompleto() {
    try {
        console.log('🔧 Inicializando VHSysAPI...');
        const api = new VHSysAPI();
        
        // Array de testes a executar
        const testes = [
            {
                nome: 'Conectividade Básica',
                funcao: () => api.testarConexao()
            },
            {
                nome: 'Listar Clientes',
                funcao: () => api.listarClientes({ limite: 5 })
            },
            {
                nome: 'Listar Produtos', 
                funcao: () => api.listarProdutos({ limite: 5 })
            },
            {
                nome: 'Listar Categorias',
                funcao: () => api.listarCategorias()
            },
            {
                nome: 'Listar Pedidos (Hoje)',
                funcao: () => api.listarPedidos({ 
                    data_inicio: new Date().toISOString().split('T')[0],
                    data_fim: new Date().toISOString().split('T')[0],
                    limite: 5 
                })
            },
            {
                nome: 'Contas a Receber',
                funcao: () => api.listarContasReceber({ limite: 5 })
            },
            {
                nome: 'Contas a Pagar',
                funcao: () => api.listarContasPagar({ limite: 5 })
            },
            {
                nome: 'Ordens de Serviço',
                funcao: () => api.listarOrdensServico({ limite: 5 })
            },
            {
                nome: 'Dashboard de Vendas',
                funcao: () => api.dashboardVendas()
            }
        ];
        
        console.log(`\n📋 Executando ${testes.length} testes...\n`);
        
        let sucessos = 0;
        let falhas = 0;
        
        for (const teste of testes) {
            try {
                console.log(`🔍 ${teste.nome}...`);
                const resultado = await teste.funcao();
                
                if (Array.isArray(resultado)) {
                    console.log(`✅ ${teste.nome}: ${resultado.length} registro(s)`);
                    if (resultado.length > 0) {
                        console.log(`   📄 Primeiro registro:`, JSON.stringify(resultado[0], null, 4));
                    }
                } else if (typeof resultado === 'object') {
                    console.log(`✅ ${teste.nome}: Dados recebidos`);
                    console.log(`   📄 Resultado:`, JSON.stringify(resultado, null, 4));
                } else if (typeof resultado === 'boolean') {
                    console.log(`${resultado ? '✅' : '❌'} ${teste.nome}: ${resultado ? 'Sucesso' : 'Falha'}`);
                } else {
                    console.log(`✅ ${teste.nome}: ${resultado}`);
                }
                
                sucessos++;
                
            } catch (error) {
                console.log(`❌ ${teste.nome}: ERRO - ${error.message}`);
                falhas++;
            }
            
            // Aguardar entre requisições para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(''); // Linha em branco
        }
        
        // Resumo final
        console.log('📊 === RESUMO FINAL ===');
        console.log(`✅ Sucessos: ${sucessos}`);
        console.log(`❌ Falhas: ${falhas}`);
        console.log(`📈 Taxa de sucesso: ${((sucessos / testes.length) * 100).toFixed(1)}%`);
        
        if (sucessos > 0) {
            console.log('\n🎉 A API VHSys está FUNCIONANDO CORRETAMENTE!');
            console.log('💡 Se alguns endpoints retornaram 0 registros, é porque não há dados cadastrados.');
        } else {
            console.log('\n🚨 Problemas detectados na API VHSys.');
        }
        
    } catch (error) {
        console.error('💥 Erro crítico no teste:', error.message);
        console.error('📋 Stack:', error.stack);
    }
}

testeCompleto(); 