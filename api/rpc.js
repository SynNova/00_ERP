// Importar as funções principais do MCP
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

// Função para processar tools MCP
async function processRPCMessage(message) {
  const { method, params, id } = message;
  
  try {
    switch (method) {
      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'listar_clientes',
                description: 'Lista todos os clientes cadastrados no sistema VHSys',
                inputSchema: {
                  type: 'object',
                  properties: {
                    limit: { type: 'integer', description: 'Número máximo de clientes a retornar', default: 100 }
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
            ]
          }
        };

      case 'tools/call':
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

        return {
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
        };

      default:
        throw new Error(`Método não suportado: ${method}`);
    }
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: error.message
      }
    };
  }
}

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

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  console.log('📨 Mensagem RPC recebida');
  
  try {
    const message = req.body;
    console.log('📤 Processando RPC:', JSON.stringify(message, null, 2));
    
    const response = await processRPCMessage(message);
    
    console.log('📥 Resposta RPC:', JSON.stringify(response, null, 2));
    res.status(200).json(response);
    
  } catch (error) {
    console.error('❌ Erro ao processar RPC:', error);
    res.status(500).json({ 
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: `Erro interno: ${error.message}`
      }
    });
  }
} 