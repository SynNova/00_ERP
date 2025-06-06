# Script para habilitar caminhos longos no Windows
# Execute como Administrador

Write-Host "🔧 Habilitando suporte para caminhos longos no Windows..." -ForegroundColor Cyan

# Verificar se está rodando como administrador
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Host "❌ Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host "Por favor, abra o PowerShell como Administrador e execute novamente." -ForegroundColor Yellow
    exit 1
}

try {
    # Habilitar caminhos longos via registro
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -Type DWord
    
    Write-Host "✅ Caminhos longos habilitados com sucesso!" -ForegroundColor Green
    Write-Host "⚠️  Reinicie o computador para aplicar as mudanças." -ForegroundColor Yellow
    
    # Verificar o valor atual
    $currentValue = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled"
    Write-Host "Valor atual de LongPathsEnabled: $($currentValue.LongPathsEnabled)" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Erro ao habilitar caminhos longos: $_" -ForegroundColor Red
} 