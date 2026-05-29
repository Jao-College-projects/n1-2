#!/usr/bin/env bash
# Garante apps/web/.env.local com VITE_API_BASE_URL (não apaga outras variáveis).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/apps/web/.env.local"
EXAMPLE="$ROOT/apps/web/.env.example"
LINE='VITE_API_BASE_URL=http://localhost:8082/luar-api'

if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$EXAMPLE" ]]; then
    cp "$EXAMPLE" "$ENV_FILE"
    echo "Criado apps/web/.env.local a partir de .env.example"
  else
    echo "$LINE" > "$ENV_FILE"
    echo "Criado apps/web/.env.local"
  fi
  exit 0
fi

if grep -q '^VITE_API_BASE_URL=' "$ENV_FILE" 2>/dev/null; then
  exit 0
fi

echo "$LINE" >> "$ENV_FILE"
echo "Adicionado ao apps/web/.env.local: $LINE"
