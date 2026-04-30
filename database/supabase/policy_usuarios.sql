-- Execute este comando no SQL Editor do Supabase

-- Permite que um usuário logado consiga ler o seu próprio perfil
CREATE POLICY "Usuario pode ler seu proprio perfil"
ON public.usuarios
FOR SELECT
USING (auth.uid() = id);

-- Permite que o usuário insira o seu próprio perfil após o cadastro no Auth
CREATE POLICY "Usuario pode criar seu proprio perfil"
ON public.usuarios
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Permite que o usuário atualize o seu próprio perfil
CREATE POLICY "Usuario pode atualizar seu proprio perfil"
ON public.usuarios
FOR UPDATE
USING (auth.uid() = id);
