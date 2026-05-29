#!/usr/bin/env bash
# Sobe API Java (Docker) + front Vite — ambiente local completo.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

FRONT_PID=""
LOGS_PID=""

cleanup() {
  echo -e "\n${YELLOW}Encerrando...${NC}"
  [[ -n "$FRONT_PID" ]] && kill "$FRONT_PID" 2>/dev/null || true
  [[ -n "$LOGS_PID" ]] && kill "$LOGS_PID" 2>/dev/null || true
  # Mantém Docker rodando para próxima sessão (use: docker compose down)
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

echo -e "${BLUE}==> Luar Móveis — ambiente local${NC}"

echo -e "${BLUE}==> Config do front (.env.local)${NC}"
bash scripts/ensure-front-env.sh

echo -e "${BLUE}==> API Java + Postgres (Docker)${NC}"
bash scripts/stack-up.sh

echo -e "${BLUE}==> Dependências do front${NC}"
if [[ ! -d apps/web/node_modules ]]; then
  npm install --prefix apps/web
fi

echo -e "${BLUE}==> Logs da API (requisições [API] ...)${NC}"
bash scripts/logs-api.sh &
LOGS_PID=$!
sleep 1

echo -e "${BLUE}==> Front (Vite)${NC}"
npm run dev --prefix apps/web &
FRONT_PID=$!

sleep 2
echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}  Luar Móveis rodando localmente${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "  Front:  ${GREEN}http://localhost:5173${NC}"
echo -e "  API:    ${GREEN}http://localhost:8082/luar-api${NC}"
echo -e "  Admin:  admin@luar.com / admin123"
echo ""
echo -e "  ${YELLOW}Requisições da API${NC} aparecem acima com prefixo ${GREEN}[API]${NC}"
echo -e "  Só logs:  ${BLUE}npm run logs:api${NC}"
echo -e "  Testar:   ${BLUE}curl http://localhost:8082/luar-api/api/produtos${NC}"
echo -e "  Parar API:${BLUE} docker compose down${NC}"
echo -e "  ${YELLOW}Ctrl+C${NC} encerra o front e os logs (Docker continua)"
echo ""

wait "$FRONT_PID" 2>/dev/null || wait
