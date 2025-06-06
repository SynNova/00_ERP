# 🎯 Solução para Problema de Caminho Longo no Windows

## ✅ Solução Funcionando: Script Batch

O script `start-vhsys-mcp.bat` já está funcionando e contorna todos os problemas:
- Espaços no caminho
- Tamanho do caminho
- Variáveis de ambiente

### Configuração no Cursor:

```json
{
  "mcpServers": {
    "vhsys-erp": {
      "command": "D:\\SynNova Software e Soluções Ltda\\SynNova - Corporativo - Documentos\\02_PRODUÇÃO\\00_ERP\\start-vhsys-mcp.bat"
    }
  }
}
```

## 🔍 Por que Funciona?

1. **Script Batch**: O Windows executa o .bat diretamente sem problemas de parsing
2. **CD para o diretório**: O script muda para o diretório correto usando `cd /d "%~dp0"`
3. **Caminho relativo**: Usa `build\index.js` em vez do caminho completo
4. **Variáveis definidas**: Define as variáveis de ambiente dentro do script

## ⚠️ Nota Importante

Ao reiniciar o Cursor, uma janela do CMD pode aparecer. **NÃO FECHE ESTA JANELA!** 
Ela precisa ficar aberta para o MCP funcionar.

## 🚀 Próximos Passos (Opcionais)

1. **Criar link simbólico** para ter um caminho mais curto
2. **Habilitar caminhos longos** no Windows (requer reinicialização)
3. **Mover o projeto** para um local com caminho mais curto (ex: D:\ERP) 