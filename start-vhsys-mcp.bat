@echo off
REM Script para iniciar o VHSys MCP Server
REM Resolve problemas com espaços no caminho no Windows

set VHSYS_TOKEN=ZDabNAdHZaEKQUBQERUNFSNAIdKHHJ
set VHSYS_SECRET=33DnRiebFchQb2GyrVNTKxPHY6C8q
set VHSYS_BASE_URL=https://api.vhsys.com.br/v2

cd /d "%~dp0"
node build\index.js 