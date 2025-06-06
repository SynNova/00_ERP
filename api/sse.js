import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  // Configurar CORS completo para MCP
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Expose-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
  
  try {
    // Verificar se é uma requisição inicial de conexão
    if (req.headers.accept && req.headers.accept.includes('text/event-stream')) {
      // Resposta SSE real
      res.write(`data: {"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{"tools":{},"resources":{}}}}\n\n`);
      
      // Manter conexão simples
      const keepAlive = setInterval(() => {
        res.write(`data: {"jsonrpc":"2.0","method":"notifications/message","params":{"level":"info","message":"Server alive"}}\n\n`);
      }, 30000);

      req.on('close', () => {
        console.log('🔌 Cliente desconectado');
        clearInterval(keepAlive);
      });

      // Timeout menor
      setTimeout(() => {
        clearInterval(keepAlive);
        res.end();
      }, 10000);
    } else {
      // Resposta JSON simples para verificação
      res.status(200).json({
        type: 'mcp-server',
        status: 'ready',
        protocol: 'sse',
        endpoints: {
          sse: '/sse',
          rpc: '/rpc'
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro na conexão SSE:', error);
    res.status(500).json({ error: error.message });
  }
} 