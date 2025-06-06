const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://claude.ai', 'https://api.anthropic.com'],
  credentials: true
}));
app.use(express.json());

// Headers de segurança
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Armazenar conexões ativas
const activeConnections = new Map();

// Endpoint principal MCP via Server-Sent Events
app.get('/sse', (req, res) => {
  console.log('🔗 Nova conexão SSE recebida');
  
  // Configurar SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const connectionId = Date.now().toString();
  
  // Iniciar processo MCP
  const mcpProcess = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      VHSYS_TOKEN: process.env.VHSYS_TOKEN,
      VHSYS_SECRET: process.env.VHSYS_SECRET,
      VHSYS_BASE_URL: process.env.VHSYS_BASE_URL
    }
  });

  // Armazenar conexão
  activeConnections.set(connectionId, { res, mcpProcess });

  // Configurar comunicação com processo MCP
  mcpProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      try {
        // Verificar se é JSON válido
        JSON.parse(message);
        res.write(`data: ${message}\n\n`);
      } catch (e) {
        console.log('📤 Mensagem não-JSON ignorada:', message);
      }
    }
  });

  mcpProcess.stderr.on('data', (data) => {
    console.log('🔍 MCP Process:', data.toString());
  });

  mcpProcess.on('close', (code) => {
    console.log(`🔚 Processo MCP encerrado com código ${code}`);
    activeConnections.delete(connectionId);
  });

  // Cleanup quando cliente desconecta
  req.on('close', () => {
    console.log('🔌 Cliente desconectado');
    mcpProcess.kill();
    activeConnections.delete(connectionId);
  });

  // Enviar mensagem inicial
  res.write(`data: {"type":"connection","status":"connected","id":"${connectionId}"}\n\n`);
});

// Endpoint para receber mensagens JSON-RPC do Claude
app.post('/rpc', express.raw({ type: 'application/json' }), (req, res) => {
  console.log('📨 Mensagem RPC recebida');
  
  try {
    const message = req.body.toString();
    console.log('📤 Enviando para MCP:', message);
    
    // Encontrar uma conexão ativa para processar a mensagem
    const activeConnection = Array.from(activeConnections.values())[0];
    
    if (activeConnection && activeConnection.mcpProcess) {
      activeConnection.mcpProcess.stdin.write(message + '\n');
      res.json({ status: 'sent' });
    } else {
      res.status(503).json({ error: 'No active MCP connection' });
    }
  } catch (error) {
    console.error('❌ Erro ao processar RPC:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    server: 'VHSys MCP Remote Server',
    version: '1.0.0',
    activeConnections: activeConnections.size
  });
});

// Informações do servidor
app.get('/', (req, res) => {
  res.json({
    name: 'VHSys ERP - Remote MCP Server',
    description: 'Servidor MCP remoto para integração VHSys com Claude.ai',
    version: '1.0.0',
    endpoints: {
      sse: '/sse',
      rpc: '/rpc',
      health: '/health'
    },
    activeConnections: activeConnections.size,
    documentation: 'https://support.anthropic.com/en/articles/11176164-pre-built-integrations-using-remote-mcp'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔚 Encerrando servidor...');
  activeConnections.forEach(({ mcpProcess }) => {
    mcpProcess.kill();
  });
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 VHSys Remote MCP Server rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoint SSE: http://localhost:${PORT}/sse`);
  console.log(`🔧 Health Check: http://localhost:${PORT}/health`);
  
  console.log('\n🔗 Para conectar no Claude.ai:');
  console.log(`   Integration URL: http://localhost:${PORT}/sse`);
}); 