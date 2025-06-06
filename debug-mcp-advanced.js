#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 VHSys MCP Server - Debug Avançado');
console.log('=====================================\n');

// Testar variáveis de ambiente
console.log('📋 Verificando Variáveis de Ambiente:');
console.log(`VHSYS_TOKEN: ${process.env.VHSYS_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`VHSYS_SECRET: ${process.env.VHSYS_SECRET ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`VHSYS_BASE_URL: ${process.env.VHSYS_BASE_URL || 'https://api.vhsys.com.br/v2'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

// Configurar variáveis se não estiverem definidas
if (!process.env.VHSYS_TOKEN) {
  process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
}
if (!process.env.VHSYS_SECRET) {
  process.env.VHSYS_SECRET = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
}
if (!process.env.VHSYS_BASE_URL) {
  process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';
}

console.log('🚀 Iniciando Servidor MCP...');

const serverPath = join(__dirname, 'build', 'index.js');
console.log(`📍 Caminho do servidor: ${serverPath}\n`);

// Iniciar o servidor
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: process.env
});

let initTimeout;
let hasInitialized = false;

// Capturar saída padrão
server.stdout.on('data', (data) => {
  const message = data.toString();
  console.log('📤 STDOUT:', message);
  
  if (message.includes('MCP Server running') || message.includes('VHSys MCP Server')) {
    hasInitialized = true;
    console.log('✅ Servidor inicializado com sucesso!');
    if (initTimeout) clearTimeout(initTimeout);
  }
});

// Capturar erro padrão
server.stderr.on('data', (data) => {
  const message = data.toString();
  console.log('❌ STDERR:', message);
});

// Capturar erro do processo
server.on('error', (error) => {
  console.log('🚫 ERRO DO PROCESSO:', error.message);
});

// Capturar saída do processo
server.on('close', (code, signal) => {
  console.log(`\n🔚 Processo encerrado - Código: ${code}, Sinal: ${signal}`);
  if (code !== 0 && code !== null) {
    console.log('❌ Servidor encerrou com erro');
  }
});

// Timeout para inicialização
initTimeout = setTimeout(() => {
  if (!hasInitialized) {
    console.log('\n⚠️  Servidor não inicializou em 10 segundos');
    console.log('💡 Possíveis problemas:');
    console.log('   - Dependências ausentes');
    console.log('   - Erro de compilação');
    console.log('   - Problema com variáveis de ambiente');
    console.log('   - Porta já em uso');
  }
}, 10000);

// Testar com dados simples
setTimeout(() => {
  console.log('\n🧪 Testando comunicação JSON-RPC...');
  
  const testMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'debug-test',
        version: '1.0.0'
      }
    }
  }) + '\n';
  
  server.stdin.write(testMessage);
  
  setTimeout(() => {
    console.log('\n🧪 Testando listagem de tools...');
    const toolsMessage = JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list'
    }) + '\n';
    
    server.stdin.write(toolsMessage);
  }, 2000);
  
}, 3000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando debug...');
  server.kill('SIGTERM');
  process.exit(0);
});

console.log('💡 Pressione Ctrl+C para encerrar o debug\n'); 