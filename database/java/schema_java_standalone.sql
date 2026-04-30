-- PostgreSQL standalone para o back-end Java (Luar Móveis)
-- Docker (porta 5434 no host): na raiz do repo, `docker compose up -d` monta este arquivo em initdb.
-- Manual: psql -h localhost -p 5434 -U postgres -d luar_java -f database/java/schema_java_standalone.sql

DROP TABLE IF EXISTS itens_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS produtos;

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
    usuario_id VARCHAR(64),
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

CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido(produto_id);

INSERT INTO produtos (nome, categoria, descricao_curta, descricao_longa, preco, estoque, imagem, destaque_carrossel)
VALUES
    ('Sofá Aurora', 'Sala', 'Linhas baixas, abraço amplo.', 'Peça de curadoria para estar prolongado.', 12990.00, 5, '', true),
    ('Poltrona Eira', 'Sala', 'Um gesto de madeira sustenta o descanso.', 'Estrutura em madeira maciça, estofado premium.', 4890.00, 8, '', false),
    ('Mesa Lume', 'Jantar', 'Madeira escura e plano sereno.', 'Mesa extensível com acabamento fosco.', 7990.00, 3, '', true);
