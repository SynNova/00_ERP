# Script para configurar MCP VHSys no Cursor
Write-Host "🔧 Configurando MCP VHSys no Cursor..." -ForegroundColor Green

# Diretório atual (evita problemas de encoding)
$currentDir = Get-Location

# Configuração MCP com caminho correto
$mcpConfig = @{
    mcpServers = @{
        "vhsys-erp" = @{
            command = "node"
            args = @("$currentDir\build\index.js")
            env = @{
                VHSYS_TOKEN = "ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ"
                VHSYS_SECRET_TOKEN = "33DnRiebFchQb2GyrVNTKxPHY6C8q"
                VHSYS_BASE_URL = "https://api.vhsys.com.br/v2"
            }
        }
    }
}

# Converter para JSON
$jsonConfig = $mcpConfig | ConvertTo-Json -Depth 4

Write-Host "📋 Configuração gerada:" -ForegroundColor Yellow
Write-Host $jsonConfig

# Diretório .cursor do usuário
$cursorDir = "$env:USERPROFILE\.cursor"

# Criar diretório se não existir
if (-not (Test-Path $cursorDir)) {
    New-Item -ItemType Directory -Path $cursorDir -Force
    Write-Host "✅ Diretório .cursor criado" -ForegroundColor Green
}

# Salvar configuração global
$globalConfigPath = "$cursorDir\mcp.json"
$jsonConfig | Out-File -FilePath $globalConfigPath -Encoding UTF8 -Force
Write-Host "✅ Configuração global salva em: $globalConfigPath" -ForegroundColor Green

# Salvar configuração local também
$localConfigDir = ".\.cursor"
if (-not (Test-Path $localConfigDir)) {
    New-Item -ItemType Directory -Path $localConfigDir -Force
}

$localConfigPath = "$localConfigDir\mcp.json"
$jsonConfig | Out-File -FilePath $localConfigPath -Encoding UTF8 -Force
Write-Host "✅ Configuração local salva em: $localConfigPath" -ForegroundColor Green

# Verificar se o servidor funciona
Write-Host "`n🔍 Testando servidor MCP..." -ForegroundColor Yellow

$env:VHSYS_TOKEN = "ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ"
$env:VHSYS_SECRET_TOKEN = "33DnRiebFchQb2GyrVNTKxPHY6C8q"
$env:VHSYS_BASE_URL = "https://api.vhsys.com.br/v2"

try {
    $testProcess = Start-Process -FilePath "node" -ArgumentList "build\index.js" -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 3
    
    if ($testProcess.HasExited) {
        Write-Host "❌ Servidor encerrou inesperadamente" -ForegroundColor Red
    } else {
        Write-Host "✅ Servidor MCP está rodando (PID: $($testProcess.Id))" -ForegroundColor Green
        $testProcess.Kill()
    }
} catch {
    Write-Host "❌ Erro ao testar servidor: $_" -ForegroundColor Red
}

Write-Host "`n🎯 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Reinicie o Cursor IDE completamente" -ForegroundColor White
Write-Host "2. Vá em Settings → Features → Model Context Protocol" -ForegroundColor White
Write-Host "3. Verifique se 'vhsys-erp' aparece como 'Connected'" -ForegroundColor White
Write-Host "4. Teste no chat: 'Teste a conexão com VHSys'" -ForegroundColor White

Write-Host "`n🔧 Se ainda não funcionar, execute:" -ForegroundColor Cyan
Write-Host "   npm run test" -ForegroundColor White

Write-Host "`n✅ Configuração concluída!" -ForegroundColor Green 