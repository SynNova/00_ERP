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
    // Sempre responder como SSE
    res.write(`data: {"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{"tools":{},"resources":{},"logging":{}}}}\n\n`);
    
    // Enviar lista de tools disponíveis
    res.write(`data: {"jsonrpc":"2.0","method":"tools/list","result":{"tools":[{"name":"listar_clientes","description":"Lista clientes cadastrados"},{"name":"buscar_cliente","description":"Busca cliente por ID/nome"},{"name":"listar_produtos","description":"Lista produtos"},{"name":"buscar_produto","description":"Busca produto por ID/nome"}]}}\n\n`);
    
    // Manter conexão viva
    const keepAlive = setInterval(() => {
      res.write(`data: {"jsonrpc":"2.0","method":"ping"}\n\n`);
    }, 25000);

    req.on('close', () => {
      console.log('🔌 Cliente desconectado');
      clearInterval(keepAlive);
    });

    req.on('error', () => {
      clearInterval(keepAlive);
    });

  } catch (error) {
    console.error('❌ Erro na conexão SSE:', error);
    res.status(500).json({ error: error.message });
  }
} 