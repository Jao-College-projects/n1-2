-- Estrutura de Banco de Dados PostgreSQL (Supabase)
-- Sistema Luar Móveis - Editável & Seguro

-- ==========================================
-- 0. Extensões úteis (Opcional)
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Tabela: usuarios (Integrada com auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- Senha é gerida pelo Supabase nativamente
    tipo_usuario VARCHAR(50) DEFAULT 'normal' CHECK (tipo_usuario IN ('normal', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Tabela: secoes_home
-- ==========================================
-- Esta tabela armazena cada seção da home como um objeto JSON flexível.
CREATE TABLE IF NOT EXISTS public.secoes_home (
    identificador VARCHAR(100) PRIMARY KEY, -- ex: 'hero_principal', 'manifesto'
    titulo_secao VARCHAR(255),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    conteudo JSONB DEFAULT '{}'::jsonb NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserindo o estado inicial para que o frontend não quebre
INSERT INTO public.secoes_home (identificador, titulo_secao, ordem, conteudo) VALUES
    ('hero', 'Hero Principal', 1, '{"kicker": "Boutique · São Paulo", "titulo_linha1": "Luar", "titulo_linha2": "Móveis", "tagline": "A quiet expression of timeless living.", "descricao": "Curadoria boutique de móveis para ambientes clássicos, elegantes e atemporais.", "cta_1_texto": "Explorar coleção", "cta_2_texto": "Ver ambientes", "imagem_url": ""}'::jsonb),
    ('manifesto', 'Manifesto da Marca', 2, '{"titulo": "Criamos móveis como quem compõe um espaço de silêncio.", "linha1": "Cada peça nasce do equilíbrio entre matéria, luz e tempo — um gesto silencioso que acolhe o cotidiano sem apressar o olhar.", "linha2": "Na Luar Móveis, cada peça é apresentada como uma experiência: o toque da madeira, o desenho da costura, a calma de um ambiente que respira.", "citacao": "\\"Móveis que envelhecem como a madeira — com graça e sem pressa.\\"", "autor": "— Fundador, Luar Móveis", "imagem_back": "", "imagem_mid": "", "imagem_front": ""}'::jsonb),
    ('atmosfera', 'Atmosfera e Ambientes', 3, '{"titulo": "Ambientes que definem o espaço", "ambientes": [{"num": "01", "title": "Sala", "subtitle": "Estar", "image": "", "hint": "Conversas demoradas e luz lateral que aquece sem pressa."}, {"num": "02", "title": "Jantar", "subtitle": "Mesa", "image": "", "hint": "Rituais à mesa, no tempo certo e no lugar certo."}, {"num": "03", "title": "Quarto", "subtitle": "Descanso", "image": "", "hint": "Descanso elevado a experiência de luxo essencial."}]}'::jsonb),
    ('curadoria', 'Curadoria', 4, '{"titulo_linha1": "Peças escolhidas,", "titulo_linha2": "não exibidas em série.", "pieces": [{"name": "Sofá Aurora", "verse": "Linhas baixas, abraço amplo — o lugar onde a tarde se demora.", "image": "", "num": "I"}, {"name": "Poltrona Eira", "verse": "Um único gesto de madeira sustenta o descanso.", "image": "", "num": "II"}, {"name": "Mesa Lume", "verse": "Madeira escura e um plano sereno para reunir.", "image": "", "num": "III"}, {"name": "Estante Horizonte", "verse": "Prateleiras como horas — silenciosas, ordenadas, profundas.", "image": "", "num": "IV"}]}'::jsonb),
    ('produtos', 'Página de Produtos', 5, '{"kicker": "Coleção Inverno 2026", "titulo": "Catálogo de Móveis", "descricao": "Curadoria em composição de ambientes com linguagem autoral e atemporal. Cada peça selecionada por critérios de forma, função e permanência.", "sidebar_titulo": "Refinar coleção", "sidebar_subtitulo": "Seleção pensada para uma experiência de visita em loja física."}'::jsonb)
ON CONFLICT (identificador) DO UPDATE SET conteudo = EXCLUDED.conteudo, titulo_secao = EXCLUDED.titulo_secao;

-- ==========================================
-- 3. Tabela: produtos
-- ==========================================
CREATE TABLE IF NOT EXISTS public.produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(150) NOT NULL,
    descricao_curta VARCHAR(500),
    descricao_longa TEXT,
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estoque INTEGER NOT NULL DEFAULT 0,
    imagem VARCHAR(500),
    destaque_carrossel BOOLEAN DEFAULT FALSE, -- Flag para exibir na Home
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. Tabela: depoimentos
-- ==========================================
CREATE TABLE IF NOT EXISTS public.depoimentos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    cidade VARCHAR(150),
    imagem VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. Tabelas: pedidos e itens_pedido
-- ==========================================
CREATE TABLE IF NOT EXISTS public.pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'carrinho' CHECK (status IN ('carrinho', 'pago', 'enviado', 'entregue', 'cancelado')),
    total NUMERIC(10, 2) DEFAULT 0.00,
    dados_entrega JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    quantidade INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco_unitario NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- Funções e Triggers de Atualização
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_usuarios BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_timestamp_produtos BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_timestamp_pedidos BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_timestamp_secoes BEFORE UPDATE ON public.secoes_home FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habiitando RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secoes_home ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

-- Função Helper: Check de Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() AND tipo_usuario = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Regras p/ secoes_home
CREATE POLICY "Secoes_home disponiveis para todos" ON public.secoes_home FOR SELECT USING (ativo = TRUE);
CREATE POLICY "Somente admins modificam secoes_home" ON public.secoes_home FOR ALL USING (public.is_admin());

-- Regras p/ produtos
CREATE POLICY "Produtos visíveis ao publico" ON public.produtos FOR SELECT USING (true);
CREATE POLICY "Somente admins modificam produtos" ON public.produtos FOR ALL USING (public.is_admin());

-- Regras p/ depoimentos
CREATE POLICY "Depoimentos visíveis ao publico" ON public.depoimentos FOR SELECT USING (true);
CREATE POLICY "Somente admins modificam depoimentos" ON public.depoimentos FOR ALL USING (public.is_admin());

-- Regras p/ pedidos
CREATE POLICY "Usuario enxerga proprios pedidos" ON public.pedidos FOR SELECT USING (auth.uid() = usuario_id OR public.is_admin());
CREATE POLICY "Usuario insere seus pedidos" ON public.pedidos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Admin pode modificar pedidos gerais" ON public.pedidos FOR UPDATE USING (public.is_admin());

-- Regras p/ itens pedido
CREATE POLICY "Usuario enxerga proprios itens do pedido" ON public.itens_pedido FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pedidos WHERE public.pedidos.id = pedido_id AND public.pedidos.usuario_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Usuario insere itens do pedido" ON public.itens_pedido FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.pedidos WHERE id = pedido_id AND usuario_id = auth.uid())
);
CREATE POLICY "Admin gereitens_pedido geral" ON public.itens_pedido FOR ALL USING (public.is_admin());


-- ==========================================
-- SUPABASE STORAGE BUCKETS
-- ==========================================
-- Categoria "site" para imagens fixas ou da tela inicial
INSERT INTO storage.buckets (id, name, public) VALUES ('site', 'site', true) ON CONFLICT DO NOTHING;
-- Categoria "produtos" para fotos de mobiliario
INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true) ON CONFLICT DO NOTHING;

-- Storage Policies: Permite QUALQUER PESSOA recuperar a imagem. Mas só Admin faz upload.
CREATE POLICY "Imagens visíveis publicamente" 
ON storage.objects FOR SELECT USING (bucket_id IN ('site', 'produtos'));

CREATE POLICY "Admin insere imagens" 
ON storage.objects FOR INSERT WITH CHECK (public.is_admin() AND bucket_id IN ('site', 'produtos'));

CREATE POLICY "Admin modifica imagens" 
ON storage.objects FOR UPDATE USING (public.is_admin() AND bucket_id IN ('site', 'produtos'));

CREATE POLICY "Admin deleta imagens" 
ON storage.objects FOR DELETE USING (public.is_admin() AND bucket_id IN ('site', 'produtos'));
