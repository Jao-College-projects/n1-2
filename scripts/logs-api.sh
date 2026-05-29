#!/usr/bin/env bash
# Acompanha requisições da API Java no Tomcat (stdout do container).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "Logs da API (linhas [API] ...) — Ctrl+C para sair"
echo "Base: http://localhost:8082/luar-api"
echo ""
docker compose logs -f tomcat 2>&1 | grep --line-buffered -E '\[API\]|ERROR|Exception|SEVERE' || docker compose logs -f tomcat
