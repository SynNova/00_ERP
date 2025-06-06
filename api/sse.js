import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');

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
    // Enviar mensagem inicial
    res.write(`data: {"type":"connection","status":"connected","id":"${connectionId}","platform":"vercel"}\n\n`);
    
    // Criar uma função para manter a conexão viva
    const keepAlive = setInterval(() => {
      res.write(`data: {"type":"heartbeat","timestamp":"${new Date().toISOString()}"}\n\n`);
    }, 30000); // 30 segundos

    // Enviar informações de status
    res.write(`data: {"type":"status","message":"MCP Server ready on Vercel","environment":{"hasToken":${!!process.env.VHSYS_TOKEN},"hasSecret":${!!process.env.VHSYS_SECRET},"hasBaseUrl":${!!process.env.VHSYS_BASE_URL}}}\n\n`);

    // Cleanup quando cliente desconecta
    req.on('close', () => {
      console.log('🔌 Cliente desconectado');
      clearInterval(keepAlive);
    });

    // Manter conexão por até 25 segundos (limite do Vercel)
    setTimeout(() => {
      clearInterval(keepAlive);
      res.write(`data: {"type":"timeout","message":"Connection timeout reached"}\n\n`);
      res.end();
    }, 25000);

  } catch (error) {
    console.error('❌ Erro na conexão SSE:', error);
    res.write(`data: {"type":"error","message":"Connection error: ${error.message}"}\n\n`);
    res.end();
  }
} 