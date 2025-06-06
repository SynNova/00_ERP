#!/usr/bin/env node

// Script de diagnóstico para problemas MCP
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('🔍 === DIAGNÓSTICO MCP VHSYS ===\n');

// 1. Verificar arquivos necessários
console.log('📂 Verificando arquivos...');
const buildPath = path.join(process.cwd(), 'build', 'index.js');
const configPath = path.join(process.cwd(), '.cursor', 'mcp.json');

console.log(`✓ Build path: ${buildPath}`);
console.log(`  Existe: ${fs.existsSync(buildPath) ? '✅ SIM' : '❌ NÃO'}`);

console.log(`✓ Config path: ${configPath}`);
console.log(`  Existe: ${fs.existsSync(configPath) ? '✅ SIM' : '❌ NÃO'}`);

if (fs.existsSync(configPath)) {
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('  Conteúdo:', JSON.stringify(config, null, 2));
    } catch (error) {
        console.log(`  ❌ Erro ao ler config: ${error.message}`);
    }
}

// 2. Testar execução direta do servidor
console.log('\n🚀 Testando execução do servidor MCP...');

const env = {
    ...process.env,
    VHSYS_TOKEN: 'ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ',
    VHSYS_SECRET_TOKEN: '33DnRiebFchQb2GyrVNTKxPHY6C8q',
    VHSYS_BASE_URL: 'https://api.vhsys.com.br/v2'
};

const serverProcess = spawn('node', ['build/index.js'], {
    env,
    stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

serverProcess.stdout.on('data', (data) => {
    output += data.toString();
});

serverProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

// Enviar mensagem de inicialização MCP
setTimeout(() => {
    console.log('📤 Enviando mensagem de inicialização MCP...');
    
    const initMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {
                tools: {},
                resources: {},
                prompts: {}
            },
            clientInfo: {
                name: 'cursor-debug',
                version: '1.0.0'
            }
        }
    };
    
    serverProcess.stdin.write(JSON.stringify(initMessage) + '\n');
    
    // Aguardar resposta
    setTimeout(() => {
        console.log('\n📥 Output do servidor:');
        console.log(output || 'Nenhum output');
        
        console.log('\n⚠️ Errors:');
        console.log(errorOutput || 'Nenhum error');
        
        // Enviar requisição de tools
        const toolsMessage = {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list'
        };
        
        serverProcess.stdin.write(JSON.stringify(toolsMessage) + '\n');
        
        setTimeout(() => {
            console.log('\n📋 Output final:');
            console.log(output);
            
            serverProcess.kill();
            
            // Análise
            console.log('\n🔍 === ANÁLISE ===');
            
            if (output.includes('tools')) {
                console.log('✅ Servidor respondendo com tools');
            } else {
                console.log('❌ Servidor NÃO está respondendo com tools');
            }
            
            if (errorOutput.includes('Error')) {
                console.log('❌ Erros detectados na execução');
            } else {
                console.log('✅ Nenhum erro crítico detectado');
            }
            
            console.log('\n💡 Próximos passos:');
            console.log('1. Verificar se o servidor está inicializando corretamente');
            console.log('2. Verificar se as credenciais VHSys são válidas');
            console.log('3. Testar usando npx @modelcontextprotocol/inspector');
            
        }, 2000);
    }, 2000);
}, 1000);

serverProcess.on('exit', (code) => {
    console.log(`\n🏁 Servidor encerrado com código: ${code}`);
});

serverProcess.on('error', (error) => {
    console.log(`\n💥 Erro ao iniciar servidor: ${error.message}`);
}); 