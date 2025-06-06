// Teste simples para verificar se o servidor MCP está funcionando
const { spawn } = require('child_process');

console.log('🔧 Teste Simples MCP');
console.log('===================\n');

// Configurar ambiente
process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
process.env.VHSYS_SECRET = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';

console.log('✅ Variáveis configuradas');

// Iniciar servidor
const servidor = spawn('node', ['build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: process.env
});

let tempoInicio = Date.now();
let inicializou = false;

servidor.stdout.on('data', (data) => {
  const msg = data.toString();
  console.log('📤 STDOUT:', msg.substring(0, 100) + '...');
  
  if (msg.includes('protocolVersion')) {
    inicializou = true;
    console.log('✅ Servidor respondeu JSON-RPC!');
  }
});

servidor.stderr.on('data', (data) => {
  const msg = data.toString();
  console.log('📋 STDERR:', msg.trim());
  
  if (msg.includes('Servidor VHSys MCP iniciado')) {
    console.log('✅ Servidor inicializado!');
    
    // Enviar comando de teste após 2 segundos
    setTimeout(() => {
      console.log('\n🧪 Enviando comando initialize...');
      const initCmd = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '1.0.0' }
        }
      }) + '\n';
      
      servidor.stdin.write(initCmd);
    }, 2000);
  }
});

servidor.on('error', (error) => {
  console.log('❌ ERRO:', error.message);
});

// Timeout de 10 segundos
setTimeout(() => {
  if (inicializou) {
    console.log('\n🎉 TESTE PASSOU: Servidor funcionando!');
  } else {
    console.log('\n❌ TESTE FALHOU: Servidor não respondeu');
  }
  
  servidor.kill();
  process.exit(inicializou ? 0 : 1);
}, 10000);

console.log('⏳ Aguardando resposta do servidor...\n'); 