export default async function handler(req, res) {
  // Configurar CORS completo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      name: 'VHSys MCP Server',
      version: '1.0.0',
      protocol: 'mcp',
      endpoints: {
        sse: '/sse',
        rpc: '/rpc'
      },
      capabilities: [
        'tools',
        'resources'
      ],
      authentication: 'none'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 