-- =====================================================
-- Migration: Checkout Persistence
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- 1. Adicionar campo dados_entrega na tabela pedidos
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS dados_entrega JSONB DEFAULT '{}'::jsonb;

-- 2. Policy: usuário autenticado pode inserir seu próprio pedido
--    (a policy original já cobre isso, mas garantimos aqui)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'pedidos' AND policyname = 'Usuario insere seus pedidos'
  ) THEN
    CREATE POLICY "Usuario insere seus pedidos"
      ON public.pedidos FOR INSERT
      WITH CHECK (auth.uid() = usuario_id);
  END IF;
END$$;

-- 3. Policy: usuário autenticado pode inserir itens do seu pedido
CREATE POLICY IF NOT EXISTS "Usuario insere itens do pedido"
  ON public.itens_pedido FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pedidos
      WHERE id = pedido_id AND usuario_id = auth.uid()
    )
  );
