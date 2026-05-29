#!/usr/bin/env bash
# Garante apps/web/.env.local com VITE_API_BASE_URL (não apaga outras variáveis).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/apps/web/.env.local"
EXAMPLE="$ROOT/apps/web/.env.example"
LINE='VITE_API_BASE_URL=/luar-api'

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
  if grep -q '^VITE_API_BASE_URL=http://localhost:8082/luar-api' "$ENV_FILE" 2>/dev/null; then
    if [[ "$(uname)" == "Darwin" ]]; then
      sed -i '' 's|^VITE_API_BASE_URL=http://localhost:8082/luar-api|VITE_API_BASE_URL=/luar-api|' "$ENV_FILE"
    else
      sed -i 's|^VITE_API_BASE_URL=http://localhost:8082/luar-api|VITE_API_BASE_URL=/luar-api|' "$ENV_FILE"
    fi
    echo "Atualizado VITE_API_BASE_URL para /luar-api (proxy Vite — sessão no upload)"
  fi
  exit 0
fi

echo "$LINE" >> "$ENV_FILE"
echo "Adicionado ao apps/web/.env.local: $LINE"
