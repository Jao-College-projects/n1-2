# Luar Móveis — Sistema de Gestão Boutique

Este projeto foi desenvolvido como parte da disciplina de **Desenvolvimento Web** do **Prof. Fernando**. A aplicação é um e-commerce boutique focado em curadoria de móveis de alto padrão, utilizando tecnologias modernas e seguindo rigorosos padrões de arquitetura de software.

## 🛠️ Tecnologias Utilizadas

- **React (Vite + TypeScript)**: Base da aplicação para alta performance e segurança de dados via tipagem forte.
- **Bootstrap (via CDN)**: Utilizado para a estrutura base e sistema de grades (Grid System).
- **Tailwind CSS**: Utilizado para estilização personalizada, cores e micro-interações.
- **Supabase**: Backend-as-a-Service para autenticação, banco de dados (PostgreSQL) e armazenamento de imagens.
- **Framer Motion**: Para animações fluidas e experiência de usuário premium.

## 🏗️ Arquitetura e Decisões Técnicas

A aplicação foi estruturada seguindo o princípio de **Responsabilidade Única (SRP)** e **Componentização**:

1. Separação de Camadas:
   - `src/components`: Componentes reutilizáveis de UI (Botões, Cards, Modais).
   - `src/pages`: Componentes de página que orquestram os componentes menores.
   - `src/store`: Gerenciamento de estado global via Context API (LojaContext), centralizando a lógica de carrinho, autenticação e dados do banco.
   - `src/lib`: Configurações de bibliotecas externas (Supabase client).

2. Layout Assimétrico:
   - Conforme requisitado, a página de Catálogo utiliza uma organização assimétrica no Desktop: uma barra lateral (`aside`) de filtros ocupando **3 colunas** e a listagem principal (`main/section`) ocupando **9 colunas** do sistema de grid. No mobile, os elementos se empilham em 12 colunas para melhor usabilidade.

3. Lógica de Estado e Dashboard:
   - O sistema conta com contadores dinâmicos no carrinho e no cabeçalho.
   - A manipulação de estado (`useState` e `useMemo`) garante que, ao adicionar um item ou filtrar a coleção, a interface reaja instantaneamente, refletindo as mudanças nos totais e na visualização.

4. Semântica HTML5:
   - Uso rigoroso das tags `header`, `main`, `section`, `aside` e `address` para garantir acessibilidade e SEO.

## 👤 Identificação

- **Aluno**: João Pedro
- **Disciplina**: Desenvolvimento Web
- **Professor**: Fernando
- **Data**: Abril de 2026

---
*Este projeto é uma aplicação funcional integrada ao banco de dados Supabase.*
