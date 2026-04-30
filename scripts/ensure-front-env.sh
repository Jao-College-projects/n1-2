#!/usr/bin/env bash
# Garante VITE_API_BASE_URL no .env.local sem apagar outras variáveis.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/apps/web/.env.local"
LINE='VITE_API_BASE_URL=http://localhost:8082/luar-api'

if [[ -f "$ENV_FILE" ]] && grep -q '^VITE_API_BASE_URL=' "$ENV_FILE" 2>/dev/null; then
  exit 0
fi
echo "$LINE" >> "$ENV_FILE"
echo "Adicionado ao apps/web/.env.local: $LINE"
