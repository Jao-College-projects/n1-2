#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Postgres (Docker, host :5434)"
docker compose up -d db-java
echo "    Aguardando Postgres..."
until docker compose exec -T db-java pg_isready -U postgres -d luar_java 2>/dev/null; do
  sleep 1
done
echo "    OK"

echo "==> Build WAR (Maven)"
(cd apps/api && mvn -q clean package)

echo "==> Tomcat (Docker, host :8082 → API em /luar-api)"
# Recria o container do Tomcat para recarregar o WAR montado por volume (evita WAR antigo em cache)
docker compose rm -sf tomcat 2>/dev/null || true
docker compose up -d tomcat

echo "    Aguardando API..."
ok=0
for _ in $(seq 1 45); do
  if curl -sf "http://localhost:8082/luar-api/api/produtos" >/dev/null 2>&1; then
    ok=1
    break
  fi
  sleep 2
done
if [[ "$ok" -ne 1 ]]; then
  echo "    Erro: API não respondeu. Logs: docker compose logs tomcat --tail 80"
  exit 1
fi

echo "    OK — http://localhost:8082/luar-api/api/produtos"
echo ""
echo "Stack pronto."
echo "  • API:    http://localhost:8082/luar-api"
echo "  • Tudo:   npm start  (ou bash run.sh) → front + logs de requisição"
echo "  • Logs:   npm run logs:api"
echo "  • Parar:  docker compose down"
