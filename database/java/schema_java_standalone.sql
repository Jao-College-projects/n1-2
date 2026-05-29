-- PostgreSQL standalone para o back-end Java (Luar Móveis)
-- Docker: `docker compose up -d` monta este arquivo em initdb.
-- Recriar do zero: docker compose down -v && docker compose up -d

DROP TABLE IF EXISTS itens_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS depoimentos;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS secoes_home;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (tipo_usuario IN ('normal', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(150) NOT NULL,
    descricao_curta VARCHAR(500),
    descricao_longa TEXT,
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estoque INTEGER NOT NULL DEFAULT 0,
    imagem VARCHAR(500),
    destaque_carrossel BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id VARCHAR(36) REFERENCES usuarios(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'carrinho' CHECK (status IN ('carrinho', 'pago', 'enviado', 'entregue', 'cancelado')),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    dados_entrega JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE depoimentos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    cidade VARCHAR(150),
    imagem VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE secoes_home (
    identificador VARCHAR(100) PRIMARY KEY,
    titulo_secao VARCHAR(255),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    conteudo JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido(produto_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);

INSERT INTO produtos (nome, categoria, descricao_curta, descricao_longa, preco, estoque, imagem, destaque_carrossel)
VALUES
    ('Sofá Aurora', 'Sala', 'Linhas baixas, abraço amplo.', 'Peça de curadoria para estar prolongado.', 12990.00, 5, '', true),
    ('Poltrona Eira', 'Sala', 'Um gesto de madeira sustenta o descanso.', 'Estrutura em madeira maciça, estofado premium.', 4890.00, 8, '', false),
    ('Mesa Lume', 'Jantar', 'Madeira escura e plano sereno.', 'Mesa extensível com acabamento fosco.', 7990.00, 3, '', true);

INSERT INTO secoes_home (identificador, titulo_secao, ordem, conteudo) VALUES
    ('hero', 'Hero Principal', 1, '{"kicker": "Boutique · São Paulo", "titulo_linha1": "Luar", "titulo_linha2": "Móveis", "tagline": "A quiet expression of timeless living.", "descricao": "Curadoria boutique de móveis para ambientes clássicos, elegantes e atemporais.", "cta_1_texto": "Explorar coleção", "cta_2_texto": "Ver ambientes", "imagem_url": ""}'::jsonb),
    ('manifesto', 'Manifesto da Marca', 2, '{"titulo": "Criamos móveis como quem compõe um espaço de silêncio.", "linha1": "Cada peça nasce do equilíbrio entre matéria, luz e tempo — um gesto silencioso que acolhe o cotidiano sem apressar o olhar.", "linha2": "Na Luar Móveis, cada peça é apresentada como uma experiência: o toque da madeira, o desenho da costura, a calma de um ambiente que respira.", "citacao": "\"Móveis que envelhecem como a madeira — com graça e sem pressa.\"", "autor": "— Fundador, Luar Móveis", "imagem_back": "", "imagem_mid": "", "imagem_front": ""}'::jsonb),
    ('atmosfera', 'Atmosfera e Ambientes', 3, '{"titulo": "Ambientes que definem o espaço", "ambientes": [{"num": "01", "title": "Sala", "subtitle": "Estar", "image": "", "hint": "Conversas demoradas e luz lateral que aquece sem pressa."}, {"num": "02", "title": "Jantar", "subtitle": "Mesa", "image": "", "hint": "Rituais à mesa, no tempo certo e no lugar certo."}, {"num": "03", "title": "Quarto", "subtitle": "Descanso", "image": "", "hint": "Descanso elevado a experiência de luxo essencial."}]}'::jsonb),
    ('curadoria', 'Curadoria', 4, '{"titulo_linha1": "Peças escolhidas,", "titulo_linha2": "não exibidas em série.", "pieces": [{"name": "Sofá Aurora", "verse": "Linhas baixas, abraço amplo — o lugar onde a tarde se demora.", "image": "", "num": "I"}, {"name": "Poltrona Eira", "verse": "Um único gesto de madeira sustenta o descanso.", "image": "", "num": "II"}, {"name": "Mesa Lume", "verse": "Madeira escura e um plano sereno para reunir.", "image": "", "num": "III"}, {"name": "Estante Horizonte", "verse": "Prateleiras como horas — silenciosas, ordenadas, profundas.", "image": "", "num": "IV"}]}'::jsonb),
    ('produtos', 'Página de Produtos', 5, '{"kicker": "Coleção Inverno 2026", "titulo": "Catálogo de Móveis", "descricao": "Curadoria em composição de ambientes com linguagem autoral e atemporal. Cada peça selecionada por critérios de forma, função e permanência.", "sidebar_titulo": "Refinar coleção", "sidebar_subtitulo": "Seleção pensada para uma experiência de visita em loja física."}'::jsonb)
ON CONFLICT (identificador) DO NOTHING;

-- Admin padrão (senha: admin123) — apenas ambiente local
INSERT INTO usuarios (id, nome_completo, email, senha_hash, tipo_usuario)
VALUES (
    '00000000-0000-4000-8000-000000000001',
    'Administrador Luar',
    'admin@luar.com',
    '$2a$10$Uxjs9A1HYmFU5uKepUIiPOtc1QIIK32j5A/sEYpCgGzwJimaazi.S',
    'admin'
) ON CONFLICT (email) DO NOTHING;
