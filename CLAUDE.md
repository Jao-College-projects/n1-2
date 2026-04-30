# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Luar Móveis** — e-commerce boutique de móveis de luxo. SPA React + TypeScript com Supabase como backend (auth, banco PostgreSQL, storage).

## Commands

All commands run from `apps/web/`:

```bash
npm run dev       # Dev server → http://localhost:5173
npm run build     # TypeScript check + Vite build (tsc -b && vite build)
npm run preview   # Preview production build
```

Or from the root:

```bash
bash run.sh       # Instala deps e sobe o dev server automaticamente
```

No test or lint scripts are configured.

## Architecture

### State Management — LojaContext

`apps/web/src/store/LojaContext.tsx` é o coração do app. Um único contexto global gerencia tudo:

- **Produtos, depoimentos, secoesHome** — carregados do Supabase no mount
- **Carrinho** — estado local (client-side only); `totalItensCarrinho` e `subtotalCarrinho` são `useMemo`
- **Auth** — `supabase.auth.onAuthStateChange` sincroniza `usuarioLogado`, `tipoUsuario`, `isAdmin`
- **modoEdicao** — flag que habilita edição in-place de conteúdo (admin CMS)

Qualquer componente que precise de dados usa `useContext(LojaContext)` — não há Redux, Zustand nem prop-drilling.

### Routing

Todas as rotas são filhas de `ClassicLayout` (Header + Footer + `<Outlet />`):

```
/               → HomePage
/produtos       → ProdutosPage (grid + sidebar de filtros)
/produtos/:id   → ProdutoDetalhePage
/carrinho       → CarrinhoPage
/finalizar      → FinalizacaoPage (incompleta — sem gateway de pagamento)
/auth           → AuthPage (login/cadastro toggle)
/admin          → AdminPage (dashboard CMS)
```

### Supabase Integration

`apps/web/src/lib/supabase.ts` exporta o client singleton. Credenciais em `apps/web/.env.local`:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**Tabelas principais:**
- `produtos` — catálogo (`destaque_carrossel: boolean` controla o carrossel da home)
- `usuarios` — perfis linkados ao `auth.users`; `tipo_usuario: 'normal' | 'admin'`
- `depoimentos` — depoimentos de clientes
- `secoes_home` — conteúdo editorial da home em JSONB (CMS); 5 seções pré-populadas: `hero`, `manifesto`, `atmosfera`, `curadoria`, `produtos`
- `pedidos` / `itens_pedido` — estrutura existe no schema mas não está integrada no frontend

Schema completo em `database/supabase/schema.sql`. Políticas RLS em `database/supabase/policy_usuarios.sql`. Trigger de auth em `database/supabase/trigger_auth.sql`.

### Component Organization

```
src/components/
  layout/          # ClassicLayout, SiteHeader, SiteFooter
  home/            # Seções da HomePage (Hero, Carousel, Editorial, Experiencias)
  luar-editorial/  # Blocos editoriais da marca (Manifesto, Ambientes, Curated)
  produtos/        # Catálogo (FiltroProdutos, ProdutoGrid, modais de CRUD admin)
  carrinho/        # TabelaCarrinho, ResumoCarrinho
  ui/              # Primitivos reutilizáveis (EditableImageField, EditableSectionField)
  imoveis/         # Showcases de ambientes decorados
```

### Styling

Híbrido Bootstrap (grid) + Tailwind CSS (utilitários). Bootstrap carregado via CDN no `index.html`. O layout de catálogo usa split assimétrico **col-3 (sidebar filtros) + col-9 (grid produtos)**.

Design System em `design-system/luar-moveis/MASTER.md`. Regras específicas por página em `design-system/luar-moveis/pages/[page-name].md` — quando existir, **sobrepõe** o Master.

## Design System Rules

Seguir obrigatoriamente ao criar ou modificar UI:

- **Paleta**: primary `#1C1917`, accent/CTA `#CA8A04`, background `#FAFAF9`
- **Tipografia**: Playfair Display (headings) + Inter (body)
- **Estilo**: "Liquid Glass" — transições fluidas 400-600ms, backdrop-filter blur, morphing
- **Proibido**: emojis como ícones (usar SVG — Heroicons/Lucide), cores vibrantes/lúdicas, hover sem transição, elementos clicáveis sem `cursor-pointer`, foco invisível
- Transições de estado: sempre 150-300ms mínimo
- Contraste mínimo: 4.5:1
- Responsivo obrigatório: 375px, 768px, 1024px, 1440px
