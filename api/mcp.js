import { VHSysAPI } from '../lib/vhsys-api.js';

// Cache para instância da API
let vhsysApiInstance = null;

function getVHSysAPI() {
  if (!vhsysApiInstance) {
    vhsysApiInstance = new VHSysAPI({
      token: process.env.VHSYS_TOKEN,
      secret: process.env.VHSYS_SECRET_TOKEN || process.env.VHSYS_SECRET,
      baseUrl: process.env.VHSYS_BASE_URL
    });
  }
  return vhsysApiInstance;
}

export default async function handler(req, res) {
  // Headers permissivos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // SSE para MCP
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    
    try {
      // Resposta MCP inicial
      res.write(`data: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{},"resources":{},"logging":{}}}}\n\n`);
      
      // Lista de ferramentas
      const tools = [
        {
          name: 'listar_clientes',
          description: 'Lista todos os clientes cadastrados no sistema VHSys',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'integer', description: 'Número máximo de clientes', default: 100 }
            }
          }
        },
        {
          name: 'buscar_cliente',
          description: 'Busca cliente por ID, nome ou documento',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'ID, nome ou documento do cliente' }
            },
            required: ['query']
          }
        },
        {
          name: 'listar_produtos',
          description: 'Lista produtos cadastrados no sistema',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'integer', description: 'Número máximo de produtos', default: 100 }
            }
          }
        },
        {
          name: 'buscar_produto',
          description: 'Busca produto por ID ou nome',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'ID ou nome do produto' }
            },
            required: ['query']
          }
        }
      ];

      res.write(`data: {"jsonrpc":"2.0","method":"tools/list","result":{"tools":${JSON.stringify(tools)}}}\n\n`);

      // Manter conexão
      const keepAlive = setInterval(() => {
        res.write(`data: {"jsonrpc":"2.0","method":"ping","params":{"timestamp":"${new Date().toISOString()}"}}\n\n`);
      }, 30000);

      req.on('close', () => {
        clearInterval(keepAlive);
      });

      req.on('error', () => {
        clearInterval(keepAlive);
      });

    } catch (error) {
      res.write(`data: {"jsonrpc":"2.0","error":{"code":-32603,"message":"${error.message}"}}\n\n`);
    }
    
  } else if (req.method === 'POST') {
    // RPC para execução de tools
    try {
      const message = req.body;
      const { method, params, id } = message;
      
      if (method === 'tools/call') {
        const { name: toolName, arguments: args } = params;
        const api = getVHSysAPI();
        
        let result;
        switch (toolName) {
          case 'listar_clientes':
            result = await api.listarClientes(args?.limit);
            break;
          case 'buscar_cliente':
            result = await api.buscarCliente(args.query);
            break;
          case 'listar_produtos':
            result = await api.listarProdutos(args?.limit);
            break;
          case 'buscar_produto':
            result = await api.buscarProduto(args.query);
            break;
          default:
            throw new Error(`Tool desconhecida: ${toolName}`);
        }

        res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        });
      } else {
        res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: { message: 'Method not implemented' }
        });
      }
      
    } catch (error) {
      res.status(200).json({
        jsonrpc: '2.0',
        id: req.body?.id || null,
        error: {
          code: -32603,
          message: error.message
        }
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 