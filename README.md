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

Execute tudo na **raiz do repositório** (`dev-web-n1-2026/`).

### Pré-requisitos

- **Node.js** + npm (para o front).
- **Docker Desktop** ligado (Postgres + Tomcat vêm do `docker compose`).
- **Maven** no PATH (`mvn -v`), porque o script da infra roda `mvn package`. No macOS: `brew install maven`. Mais detalhes em `apps/api/README.md`.

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
