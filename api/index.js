export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Headers de segurança
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      name: 'VHSys ERP - Remote MCP Server',
      description: 'Servidor MCP remoto para integração VHSys com Claude.ai',
      version: '1.0.0',
      platform: 'Vercel',
      endpoints: {
        sse: '/sse',
        rpc: '/rpc',
        health: '/health'
      },
      documentation: 'https://support.anthropic.com/en/articles/11176164-pre-built-integrations-using-remote-mcp'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 