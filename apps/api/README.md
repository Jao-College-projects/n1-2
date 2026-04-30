# Luar Móveis — API Java (Servlets + JDBC)

## Requisitos

- JDK 17+
- Maven 3.9+ (no macOS com Homebrew: `brew install maven` — se aparecer `command not found: mvn`, o Maven não está instalado ou não está no `PATH`)
- Docker Desktop (opcional, para subir Postgres + Tomcat com um comando)
- Ou: PostgreSQL 14+ e Apache Tomcat 10+ instalados localmente

## Subir tudo com Docker (recomendado)

Na raiz do repositório:

```bash
npm run stack
# ou: bash scripts/stack-up.sh
```

Isso sobe o Postgres (porta **5434** no host), compila o WAR e sobe o Tomcat (porta **8082** no host). A API fica em `http://localhost:8082/luar-api`.

No front (`apps/web`), defina `VITE_API_BASE_URL=http://localhost:8082/luar-api` no `apps/web/.env.local` (o script `scripts/ensure-front-env.sh` adiciona essa linha se faltar).

**Nota técnica:** o `ConnectionFactory` chama `Class.forName("org.postgresql.Driver")` para o driver registrar no `DriverManager` dentro do Tomcat (evita *No suitable driver found*).

## Banco de dados

### Opção A — Docker na porta **5434** do host (recomendado se o Postgres local não estiver rodando)

Na **raiz do repositório**:

```bash
docker compose up -d
```

O script `database/java/schema_java_standalone.sql` roda na primeira subida do container.  
Conexão: host `localhost`, porta **5434**, banco `luar_java`, usuário `postgres`, senha `postgres`.

Se `5434` estiver ocupada, edite `docker-compose.yml` (`ports: "SUA_PORTA:5432"`) e defina `JDBC_URL` no Tomcat com a mesma porta.

Para recriar do zero (apaga dados do volume):

```bash
docker compose down -v && docker compose up -d
```

### Opção B — Postgres instalado na máquina

```bash
createdb luar_java
psql -h localhost -p 5434 -U postgres -d luar_java -f database/java/schema_java_standalone.sql
```

(Ajuste `-p` e `-U` conforme sua instalação.)

## Variáveis de ambiente (JDBC)

Defina antes de subir o Tomcat (ex.: `bin/setenv.sh`) se quiser sobrescrever os padrões do código:

| Variável        | Exemplo (Docker compose deste repo)            |
|-----------------|------------------------------------------------|
| `JDBC_URL`      | `jdbc:postgresql://localhost:5434/luar_java` |
| `JDBC_USER`     | `postgres`                                     |
| `JDBC_PASSWORD` | `postgres`                                     |

Os padrões no `ConnectionFactory` já apontam para **localhost:5434** com usuário/senha **postgres/postgres** (alinhado ao `docker-compose.yml`).

## Build

```bash
cd apps/api
mvn clean package
```

O WAR gerado fica em `target/luar-api.war`. Copie para `tomcat/webapps/` (o context path será `/luar-api`).

## Endpoints

| Método | Caminho              | Descrição                          |
|--------|----------------------|------------------------------------|
| GET    | `/api/produtos`      | Lista produtos                     |
| GET    | `/api/produtos/{id}` | Um produto                         |
| POST   | `/api/produtos`      | Cria produto (JSON camelCase)      |
| PUT    | `/api/produtos/{id}` | Atualiza produto                   |
| DELETE | `/api/produtos/{id}` | Exclui produto                     |
| POST   | `/api/pedidos`       | Finaliza pedido (transação: pedido + itens + baixa de estoque) |

Não há **`GET /api/pedidos`**: pedidos só são criados via `POST`. Para **listar** pedidos gravados, use o PostgreSQL (exemplo com o container `luar-java-db` do `docker compose`):

```bash
docker exec -it luar-java-db psql -U postgres -d luar_java -c "SELECT id, usuario_id, status, total, created_at FROM pedidos ORDER BY id DESC;"
docker exec -it luar-java-db psql -U postgres -d luar_java -c "SELECT id, pedido_id, produto_id, quantidade, preco_unitario FROM itens_pedido ORDER BY id DESC LIMIT 20;"
```

Produtos na API (há `GET`):

```bash
curl -s http://localhost:8082/luar-api/api/produtos
```

Corpo de `POST /api/pedidos` (JSON):

```json
{
  "usuarioId": "uuid-opcional",
  "itens": [
    { "produtoId": 1, "quantidade": 2, "precoUnitario": 12990.0 }
  ],
  "dadosEntrega": { "nomeCompleto": "...", "cpf": "...", ... }
}
```

CORS está habilitado para o front em `http://localhost:5173` (e reflete o header `Origin` quando enviado).
