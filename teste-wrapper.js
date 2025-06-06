#!/usr/bin/env node

// Teste síncrono para verificar se o wrapper funciona

const path = require('path');
const fs = require('fs');

console.log('🔧 Teste do Script Wrapper');
console.log('==========================\n');

// Definir variáveis de ambiente
process.env.VHSYS_TOKEN = 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ';
process.env.VHSYS_SECRET = '33DnRiebFchQb2GyrVNTKxPHY6C8q';
process.env.VHSYS_BASE_URL = 'https://api.vhsys.com.br/v2';

console.log('✅ Variáveis de ambiente configuradas');

// Verificar caminho
const buildPath = path.join(__dirname, 'build', 'index.js');
console.log('📂 Caminho calculado:', buildPath);

// Verificar se arquivo existe
if (fs.existsSync(buildPath)) {
  console.log('✅ Arquivo encontrado');
} else {
  console.log('❌ Arquivo não encontrado');
}

console.log('\n🧪 Testando comunicação com servidor...');

// Importar e testar o servidor
try {
  const serverModule = require('./build/index.js');
  console.log('✅ Módulo carregado com sucesso');
} catch (error) {
  console.error('❌ Erro ao carregar módulo:', error.message);
} 