# Luar Móveis — Sistema de Gestão Boutique

Este projeto foi desenvolvido como parte da disciplina de **Desenvolvimento Web** do **Prof. Fernando**. A aplicação é um e-commerce boutique focado em curadoria de móveis de alto padrão, utilizando tecnologias modernas e seguindo rigorosos padrões de arquitetura de software.

## Estrutura do repositório

| Pasta | Conteúdo |
|--------|-----------|
| `apps/web/` | Front-end React (Vite + TypeScript). Variáveis em `apps/web/.env.local`. |
| `apps/api/` | Back-end Java (Maven, WAR `luar-api`). Ver `apps/api/README.md`. |
| `database/java/` | Script SQL do Postgres usado pela API Java (`schema_java_standalone.sql`). |
| `database/supabase/` | Scripts do schema Supabase (auth, RLS, checkout legado). |
| `scripts/` | Automação local (`stack-up.sh`, `ensure-front-env.sh`). |
| `design-system/` | Referência visual da marca. |
| Raiz | `docker-compose.yml`, `package.json`, `README.md`, `CLAUDE.md`. |

**Deploy (Vercel):** defina o diretório raiz do projeto como **`apps/web`** se o repositório for este monorepo.

## Comandos para rodar o sistema (ordem)

Execute na **raiz do repositório**. Antes, instale Docker Desktop, JDK 17, Maven e Node e configure `apps/web/.env.local` (Supabase + URL da API); veja a seção **Como rodar o projeto (infra → front)** mais abaixo para a tabela de ferramentas e o detalhe das variáveis.

| Passo | O quê | Comando |
|-------|--------|---------|
| 0 | Entrar na pasta do projeto | `cd /caminho/para/dev-web-n1-2026` |
| 1 | **Config (uma vez):** Supabase no front | Crie `apps/web/.env.local` a partir de `apps/web/.env.example` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. |
| 2 | Dependências do front (uma vez ou após mudar deps) | `npm run install:front` |
| 3 | **Back + banco local:** Postgres (Docker) + build do WAR + Tomcat com a API | `npm run stack` — sobe **http://localhost:8082/luar-api** e Postgres em **localhost:5434**. |
| 4 | Garantir URL da API no `.env.local` (não apaga outras variáveis) | `bash scripts/ensure-front-env.sh` |
| 5 | **Front** (Vite; URL no terminal, em geral **http://localhost:5173**) | `npm run dev` |

**Parar só o Docker** (API + Postgres): `docker compose down` na raiz.

**Resumo em sequência:** `cd` → `.env.local` (Supabase) → `install:front` → `stack` → `ensure-front-env` → `dev`.

## Infraestrutura Java

Toda a stack da **API Java** roda na **raiz do repositório** com `docker-compose.yml`. Você **não** precisa instalar Tomcat nem Postgres na máquina se usar Docker; precisa só de **Docker Desktop**, **JDK 17+** e **Maven** (o script compila o WAR antes de subir o Tomcat).

### O que sobe

| Serviço (compose) | Container | Imagem | Função |
|-------------------|-----------|--------|--------|
| `db-java` | `luar-java-db` | `postgres:16-alpine` | Banco `luar_java`, schema inicial em `database/java/schema_java_standalone.sql` (só na **primeira** criação do volume). |
| `tomcat` | `luar-java-tomcat` | `tomcat:10-jdk17-temurin-jammy` | Tomcat 10; monta `apps/api/target/luar-api.war` em `/luar-api`. JDBC via variáveis no compose (`JDBC_URL`, `JDBC_USER`, `JDBC_PASSWORD`). |

### Pré-requisitos só para a stack Java

- **Docker Desktop** ligado (`docker compose version`).
- **JDK 17+** (`java -version`) — o Maven usa esse Java para compilar `apps/api/`.
- **Maven 3.9+** (`mvn -v`).

Node/npm **não** são obrigatórios para subir a API: use `bash scripts/stack-up.sh` direto.

### Subir tudo (recomendado)

Na raiz do clone:

```bash
npm run stack
```

Equivalente (sem npm):

```bash
bash scripts/stack-up.sh
```

O script, em ordem: sobe **Postgres** (`db-java`), espera ficar pronto; roda **`mvn clean package`** em `apps/api/` (gera `apps/api/target/luar-api.war`); remove e recria o container **Tomcat** para o WAR montado por volume ser recarregado; espera `GET /api/produtos` responder em **http://localhost:8082/luar-api**.

### Portas, URL da API e banco (padrão deste repo)

| O quê | Valor |
|--------|--------|
| API (Tomcat no host) | **http://localhost:8082/luar-api** (ex.: produtos: `http://localhost:8082/luar-api/api/produtos`) |
| Postgres no host | **localhost:5434** → container escuta em `5432` |
| Banco | `luar_java` |
| Usuário / senha | `postgres` / `postgres` |

Se **5434** ou **8082** estiverem ocupadas, edite `docker-compose.yml` (mapeamento `ports:`) e, no front, `VITE_API_BASE_URL` em `apps/web/.env.local`. Dentro da rede Docker o Tomcat usa `JDBC_URL` com host `db-java` (já definido no compose).

### Só API + banco, sem o script (manual)

1. Gere o WAR: `cd apps/api && mvn clean package && cd ../..`
2. Suba os dois serviços: `docker compose up -d`

O script `stack-up.sh` além disso **recria** o Tomcat após cada build (evita WAR antigo em cache) e valida a API com `curl`. Para o dia a dia, prefira `npm run stack` ou `bash scripts/stack-up.sh`.

### Parar e resetar dados do Postgres

```bash
docker compose down
```

Apagar volume do banco e subir do zero (reaplica o SQL de init):

```bash
docker compose down -v
npm run stack
```

### Conferir se a API subiu

```bash
curl -s http://localhost:8082/luar-api/api/produtos
```

Se falhar, veja os logs: `docker compose logs tomcat --tail 80` (e, se necessário, `docker compose logs db-java --tail 40`).

### Documentação extra (JDBC, endpoints, pedidos no SQL)

Detalhes da API, variáveis `JDBC_*` e exemplos de `curl`/`psql`: **`apps/api/README.md`**.

---

A seção **“Como rodar o projeto (infra → front)”** abaixo repete o fluxo completo (front + Supabase + esta stack). Para **apenas** Java + Docker, basta esta seção até o `curl` e o link do `apps/api/README.md`.

## 🛠️ Tecnologias Utilizadas

- **React (Vite + TypeScript)**: Base da aplicação para alta performance e segurança de dados via tipagem forte.
- **Bootstrap (via CDN)**: Utilizado para a estrutura base e sistema de grades (Grid System).
- **Tailwind CSS**: Utilizado para estilização personalizada, cores e micro-interações.
- **Supabase**: Backend-as-a-Service para autenticação, banco de dados (PostgreSQL) e armazenamento de imagens.
- **Framer Motion**: Para animações fluidas e experiência de usuário premium.

## 🏗️ Arquitetura e Decisões Técnicas

A aplicação foi estruturada seguindo o princípio de **Responsabilidade Única (SRP)** e **Componentização**:

1. Separação de Camadas:
   - `src/components`: Dividido em pastas lógicas (`layout`, `produtos`, `ui`). Isso garante que componentes puramente visuais (UI) fiquem separados da lógica de negócio (Produtos).
   - `src/pages`: Componentes de página que orquestram os componentes menores e lidam com a lógica de roteamento.
   - `src/store`: Uso de **Context API** (`LojaContext`) para centralizar o estado global (Produtos, Carrinho, Usuário). Isso permite que o **Dashboard** e a **Listagem** estejam sempre sincronizados.
   - `src/types`: Interfaces TypeScript rigorosas que definem o "contrato" de dados do sistema, prevenindo erros de execução.

2. Layout Assimétrico (Bootstrap):
   - A página de Catálogo utiliza o **Sistema de Grades do Bootstrap** (`row`, `col-lg-3`, `col-lg-9`).
   - No Desktop, a organização é assimétrica: barra lateral de filtros (3 colunas) e conteúdo principal (9 colunas).
   - No Celular, as colunas se empilham automaticamente para 12 unidades, garantindo total responsividade.

3. Dashboard Dinâmico e Status Visual:
   - O Dashboard no topo do catálogo reage instantaneamente a qualquer alteração na lista (filtros, exclusão ou atualização de estoque).
   - Peças com estoque zerado recebem o status visual **"Esgotado"** com overlay e desabilitação de compra, conforme os requisitos de lógica de estado.

4. Semântica HTML5:
   - Uso rigoroso das tags `header`, `main`, `section`, `aside` e `address` para garantir acessibilidade e SEO.

## 🚀 Como rodar o projeto (infra → front)

Execute tudo na **raiz do repositório** (`dev-web-n1-2026/`). A parte **Postgres + Tomcat + build do WAR** está documentada em detalhe na seção **[Infraestrutura Java](#infraestrutura-java)** acima.

### Instalar a infraestrutura (uma vez na máquina)

A infra deste repo é **PostgreSQL 16** + **Tomcat 10** com o WAR da API, orquestrados pelo `docker-compose.yml`. O script `npm run stack` (ou `bash scripts/stack-up.sh`) sobe o Postgres, roda **`mvn clean package`** em `apps/api/` para gerar `luar-api.war` e sobe o Tomcat montando esse WAR. Na **primeira** subida do Postgres, o arquivo `database/java/schema_java_standalone.sql` é aplicado automaticamente (volume em `docker-entrypoint-initdb.d`).

Instale e verifique, nesta ordem:

| Ferramenta | Para quê | Como instalar / conferir |
|------------|----------|---------------------------|
| **Docker Desktop** | `docker compose` (Postgres + Tomcat) | [Docker Desktop](https://www.docker.com/products/docker-desktop/) — abra o app e espere ficar “running”. No terminal: `docker compose version`. |
| **JDK 17+** | Compilar a API com Maven | macOS (Homebrew): `brew install openjdk@17` e siga a mensagem do brew para exportar `PATH` (ou use um JDK 17 da Oracle/Eclipse Temurin). Confira: `java -version`. |
| **Maven 3.9+** | `mvn clean package` dentro de `stack-up.sh` | macOS: `brew install maven`. Confira: `mvn -v` (deve listar Java 17). |
| **Node.js + npm** | `npm run stack`, `npm run dev`, etc. | [Node.js LTS](https://nodejs.org/). Confira: `node -v` e `npm -v`. |

**Só API + banco, sem usar `npm` na raiz:** com Docker e Maven no PATH, na raiz do repo execute `bash scripts/stack-up.sh` (o script não depende do Node).

**Portas padrão:** Postgres no host **5434**, API em **http://localhost:8082/luar-api**. Se `5434` ou `8082` estiverem ocupadas, altere o mapeamento em `docker-compose.yml` e o `VITE_API_BASE_URL` do front.

Mais detalhes da API, JDBC e endpoints: `apps/api/README.md`.

### Pré-requisitos (resumo)

- **Node.js** + npm (front e atalho `npm run stack`).
- **Docker Desktop** ligado (Postgres + Tomcat via `docker compose`).
- **Maven** no PATH — o script da infra executa `mvn package` em `apps/api/`. **JDK 17+** obrigatório para o Maven compilar.

### Variáveis de ambiente do front

Crie o arquivo **`apps/web/.env.local`**. Use `apps/web/.env.example` como base e preencha pelo menos:

| Variável | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | Auth, depoimentos, seções, upload de imagens (Supabase). |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do projeto Supabase. |
| `VITE_API_BASE_URL` | URL da API Java (ex.: `http://localhost:8082/luar-api`). O script abaixo adiciona essa linha se ainda não existir. |

Se você mudar as portas no `docker-compose.yml`, ajuste `VITE_API_BASE_URL` para a mesma porta do Tomcat no host.

### Passo a passo (ordem)

```bash
# 1) Entrar na raiz do clone
cd /caminho/para/dev-web-n1-2026

# 2) Dependências do front (uma vez, ou após mudar package.json)
npm run install:front

# 3) Subir Postgres + build do WAR + Tomcat com a API
#    (Postgres no host :5434, API em http://localhost:8082/luar-api — valores padrão deste repo)
npm run stack

# 4) Garantir VITE_API_BASE_URL no .env.local (não apaga outras variáveis)
bash scripts/ensure-front-env.sh

# 5) Rodar o front (Vite). A URL exata aparece no terminal (geralmente http://localhost:5173)
npm run dev
```

**Resumo:** `install:front` → `stack` (infra + Java) → `ensure-front-env` → `dev`.

### Parar a infra (Docker)

```bash
docker compose down
```

Para apagar também os dados do Postgres do compose: `docker compose down -v`.

### Outros comandos úteis

| Comando | O que faz |
|---------|-----------|
| `npm run build` | Build de produção do front (`apps/web`). |
| `bash run.sh` | Instala deps do front se faltar `node_modules` e sobe o Vite (não sobe Docker; use após `npm run stack` se quiser só o front). |

## Checar produtos e pedidos (API + PostgreSQL)

Ajuste a porta **8082** e o host da API se o seu `docker-compose` ou Tomcat usarem outros valores.

### Produtos (há `GET` na API)

Lista o catálogo retornado pelo back-end Java (dados vindos do Postgres):

```bash
curl -s http://localhost:8082/luar-api/api/produtos
```

### Pedidos (não há `GET` na API)

O endpoint `POST /api/pedidos` serve só para **finalizar** um pedido (gravar pedido, itens e baixar estoque). **Não existe** `GET /api/pedidos` para listar pedidos via HTTP; por isso a checagem é feita **direto no banco** com `psql` no container do Postgres (nome padrão do compose: `luar-java-db`):

```bash
docker exec -it luar-java-db psql -U postgres -d luar_java -c "SELECT id, usuario_id, status, total, created_at FROM pedidos ORDER BY id DESC;"
```

Itens associados aos pedidos:

```bash
docker exec -it luar-java-db psql -U postgres -d luar_java -c "SELECT id, pedido_id, produto_id, quantidade, preco_unitario FROM itens_pedido ORDER BY id DESC LIMIT 20;"
```

Se o Postgres estiver só no host (sem Docker), use `psql -h localhost -p 5434 -U postgres -d luar_java` com os mesmos `SELECT`.

## 👤 Identificação

- **Aluno**: João Pedro
- **Disciplina**: Desenvolvimento Web
- **Professor**: Fernando
- **Data**: Abril de 2026

---
*Scripts SQL: `database/java/` (Postgres da API Java) e `database/supabase/` (Supabase).*
