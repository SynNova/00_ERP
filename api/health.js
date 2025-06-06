export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ 
      status: 'healthy',
      server: 'VHSys MCP Remote Server',
      platform: 'Vercel',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: {
        hasVhsysToken: !!process.env.VHSYS_TOKEN,
        hasVhsysSecret: !!process.env.VHSYS_SECRET,
        hasVhsysBaseUrl: !!process.env.VHSYS_BASE_URL
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 