import { supabase } from "../lib/supabase";
import { ICredenciaisLogin, IFormularioCadastro, TipoUsuario } from "../types/IProduto";

export async function fazerLogin(dados: ICredenciaisLogin): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: dados.email,
    password: dados.senha,
  });
  if (error) throw new Error(error.message);
}

export async function fazerCadastro(dados: IFormularioCadastro): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email: dados.email,
    password: dados.senha,
    options: { data: { nome_completo: dados.nomeCompleto } },
  });
  if (error) throw new Error(error.message);
}

export async function fazerLogout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function buscarTipoUsuario(userId: string): Promise<TipoUsuario> {
  const { data } = await supabase
    .from("usuarios")
    .select("tipo_usuario")
    .eq("id", userId)
    .maybeSingle();

  return data?.tipo_usuario === "admin" ? "admin" : "normal";
}
