# 🚨 Solução de Problemas - Servidor VHSys MCP

## Problemas Identificados nos Logs

### 1. **Múltiplas Instâncias Node.js**
**Sintoma**: Vários processos `node.exe` rodando simultaneamente
**Causa**: Servidor MCP não foi encerrado corretamente
**Solução**:
```batch
# Execute o arquivo de limpeza
.\cleanup-processes.bat
```

### 2. **Porta 6277 Ocupada**
**Sintoma**: `❌ Proxy Server PORT IS IN USE at port 6277 ❌`
**Causa**: Inspector MCP ainda está rodando em background
**Solução**:
```batch
# Finalizar todos os processos Node.js
taskkill /F /IM node.exe

# Aguardar alguns segundos e tentar novamente
npm run test
```

### 3. **Múltiplas Conexões/Reconexões**
**Sintoma**: Logs mostrando várias `sessionId` diferentes
**Causa**: Comportamento normal do Claude Desktop
**Status**: ✅ **NÃO É UM ERRO** - Cada interação cria uma nova sessão

## 🔧 Comandos de Diagnóstico

### Verificar Processos Node.js:
```batch
tasklist /FI "IMAGENAME eq node.exe"
```

### Verificar Portas em Uso:
```batch
netstat -ano | findstr :6277
```

### Testar Servidor MCP:
```batch
npm run test
```

### Executar Servidor em Modo Desenvolvimento:
```batch
npm run dev
```

## 📋 Checklist de Resolução

- [ ] ✅ Executar `cleanup-processes.bat`
- [ ] ✅ Verificar se todos os processos Node.js foram encerrados
- [ ] ✅ Tentar `npm run test` novamente
- [ ] ✅ Se ainda der erro, reiniciar o computador
- [ ] ✅ Verificar se as credenciais VHSys estão corretas no arquivo de configuração

## 🚀 Reiniciar Servidor Corretamente

1. **Parar todos os processos**:
   ```batch
   .\cleanup-processes.bat
   ```

2. **Iniciar servidor em desenvolvimento**:
   ```batch
   npm run dev
   ```

3. **Ou testar com inspector**:
   ```batch
   npm run test
   ```

## 📞 Logs Normais vs Problemas

### ✅ **Logs Normais (Ignore)**:
- `New connection`
- `Query parameters`
- `Stdio transport: command=...`
- `Spawned stdio transport`
- `Connected MCP client`
- `Received message for sessionId`

### ⚠️ **Logs de Problema**:
- `PORT IS IN USE`
- `Error: EADDRINUSE`
- `Connection refused`
- `Timeout`
- Erros da API VHSys

## 🔍 Monitoramento

Para monitorar o servidor em tempo real, observe os logs via `stderr` que aparecem no terminal quando o servidor está rodando. 