#!/bin/bash

# Define cores para os logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}Iniciando a verificação do projeto Luar Móveis...${NC}"

# Função para limpeza ao sair
cleanup() {
    echo -e "\n${RED}Parando os serviços...${NC}"
    kill 0
    exit 0
}

trap cleanup SIGINT EXIT

# ==========================================
# Frontend
# ==========================================
echo -e "\n${BLUE}[Frontend]${NC} Preparando ambiente..."
cd apps/web

# Instala as dependências se a pasta node_modules não existir
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}[Frontend] Instalando dependências (Primeira execução)...${NC}"
    npm install
fi

echo -e "${GREEN}[Frontend] Iniciando servidor de desenvolvimento em http://localhost:5173${NC}"
npm run dev &
cd ..

# ==========================================
# Status
# ==========================================
echo -e "\n${GREEN}==========================================${NC}"
echo -e "${GREEN}   Luar Móveis está rodando via Supabase!  ${NC}"
echo -e "${GREEN}   Pressione Ctrl+C para encerrar.         ${NC}"
echo -e "${GREEN}==========================================${NC}\n"

wait
