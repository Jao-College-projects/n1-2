import { supabase } from "../lib/supabase";
import { IDepoimento } from "../types/IDepoimento";

export async function buscarDepoimentos(): Promise<IDepoimento[]> {
  const { data, error } = await supabase
    .from("depoimentos")
    .select("*")
    .order("id", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function criarDepoimento(novo: Omit<IDepoimento, "id">): Promise<IDepoimento | null> {
  const { data, error } = await supabase
    .from("depoimentos")
    .insert([novo])
    .select("*")
    .single();

  if (error || !data) return null;
  return data;
}

export async function editarDepoimento(depoimento: IDepoimento): Promise<boolean> {
  const { error } = await supabase
    .from("depoimentos")
    .update({
      cliente: depoimento.cliente,
      texto: depoimento.texto,
      cidade: depoimento.cidade,
      imagem: depoimento.imagem,
    })
    .eq("id", depoimento.id);

  return !error;
}

export async function excluirDepoimento(id: number): Promise<boolean> {
  const { error } = await supabase.from("depoimentos").delete().eq("id", id);
  return !error;
}
