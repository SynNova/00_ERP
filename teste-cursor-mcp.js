#!/usr/bin/env node

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🔧 Teste de Comunicação MCP para Cursor');
console.log('=====================================\n');

// Configurar variáveis de ambiente
process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
process.env.VHSYS_SECRET = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';

// Testar diferentes comandos que o Cursor pode usar
const comandos = [
  {
    nome: 'Node Direto',
    comando: 'node',
    args: ['build/index.js']
  },
  {
    nome: 'CMD + Node',
    comando: 'cmd',
    args: ['/c', 'node', 'build/index.js']
  }
];

for (const teste of comandos) {
  console.log(`\n🧪 Testando: ${teste.nome}`);
  console.log(`Comando: ${teste.comando} ${teste.args.join(' ')}`);
  
  try {
    const processo = spawn(teste.comando, teste.args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
      shell: false
    });

    let saida = '';
    let erro = '';
    let inicializou = false;

    processo.stdout.on('data', (data) => {
      saida += data.toString();
      if (data.toString().includes('protocolVersion')) {
        inicializou = true;
        console.log('✅ Servidor respondeu ao JSON-RPC');
      }
    });

    processo.stderr.on('data', (data) => {
      erro += data.toString();
      if (data.toString().includes('Servidor VHSys MCP iniciado')) {
        console.log('✅ Servidor iniciado com sucesso');
      }
    });

    // Enviar comando de inicialização
    setTimeout(async () => {
      const initMsg = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'cursor-test', version: '1.0.0' }
        }
      }) + '\n';

      processo.stdin.write(initMsg);
      
      // Aguardar resposta
      await setTimeout(3000);
      
      if (inicializou) {
        console.log('✅ SUCESSO: Comunicação funcionando!');
      } else {
        console.log('❌ FALHA: Sem resposta JSON-RPC');
        console.log('STDOUT:', saida.substring(0, 200));
        console.log('STDERR:', erro.substring(0, 200));
      }
      
      processo.kill();
    }, 2000);

    // Timeout geral
    setTimeout(async () => {
      processo.kill();
    }, 8000);

    await new Promise((resolve) => {
      processo.on('close', () => resolve());
    });

  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
  }
  
  console.log('─'.repeat(50));
} 