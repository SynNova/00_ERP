#!/usr/bin/env node

// Script wrapper para iniciar o MCP server
// Versão CommonJS para contornar problemas de ES modules

const { spawn } = require('child_process');
const path = require('path');

// Definir variáveis de ambiente
process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
process.env.VHSYS_SECRET = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';

// Caminho para o build
const buildPath = path.join(__dirname, 'build', 'index.js');

console.log('🚀 Iniciando VHSys MCP Server...');
console.log('📂 Caminho:', buildPath);
console.log('📁 Diretório atual:', __dirname);

// Executar o servidor
const server = spawn('node', [buildPath], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log(`🔴 Servidor finalizado com código: ${code}`);
});

server.on('error', (err) => {
  console.error('❌ Erro ao iniciar servidor:', err);
}); 