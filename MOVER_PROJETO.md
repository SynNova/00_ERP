# 📁 Instruções para Mover o Projeto

## Opção 1: Criar um Link Simbólico (Recomendado)

Execute como Administrador no PowerShell:

```powershell
# Criar um link simbólico de D:\ERP para o projeto atual
New-Item -ItemType SymbolicLink -Path "D:\ERP" -Target "D:\SynNova Software e Soluções Ltda\SynNova - Corporativo - Documentos\02_PRODUÇÃO\00_ERP"
```

Depois, atualize o .cursor/mcp.json para usar o caminho curto:
```json
{
  "mcpServers": {
    "vhsys-erp": {
      "command": "node",
      "args": ["D:\\ERP\\build\\index.js"],
      "env": {
        "VHSYS_TOKEN": "ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ",
        "VHSYS_SECRET": "33DnRiebFchQb2GyrVNTKxPHY6C8q",
        "VHSYS_BASE_URL": "https://api.vhsys.com.br/v2"
      }
    }
  }
}
```

## Opção 2: Mover Fisicamente o Projeto

1. Copie todo o projeto para `D:\ERP`
2. Abra o Cursor neste novo local
3. Use a configuração acima

## Opção 3: Usar SUBST para Criar Drive Virtual

```cmd
# Criar drive virtual E: apontando para o projeto
subst E: "D:\SynNova Software e Soluções Ltda\SynNova - Corporativo - Documentos\02_PRODUÇÃO\00_ERP"
```

Depois use `E:\build\index.js` na configuração. 