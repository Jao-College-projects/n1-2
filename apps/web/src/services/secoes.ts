import { supabase } from "../lib/supabase";
import { ISecaoHome } from "../types/IProduto";

export async function buscarSecoesHome(): Promise<ISecaoHome[]> {
  const { data, error } = await supabase
    .from("secoes_home")
    .select("*")
    .eq("ativo", true);

  if (error || !data) return [];

  return data.map((s: any) => ({
    identificador: s.identificador,
    tituloSecao: s.titulo_secao,
    ordem: s.ordem,
    ativo: s.ativo,
    conteudo: s.conteudo,
  }));
}

export async function salvarSecaoHome(identificador: string, dados: ISecaoHome): Promise<boolean> {
  const { error } = await supabase
    .from("secoes_home")
    .upsert({
      identificador,
      titulo_secao: dados.tituloSecao,
      ordem: dados.ordem,
      ativo: dados.ativo,
      conteudo: dados.conteudo,
    }, { onConflict: "identificador" });

  return !error;
}
