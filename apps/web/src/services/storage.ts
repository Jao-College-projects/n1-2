import { supabase } from "../lib/supabase";

export async function uploadImagem(arquivo: File): Promise<string> {
  const nomeArquivo = `${Date.now()}-${arquivo.name.replace(/\s+/g, "_")}`;

  const { error } = await supabase.storage
    .from("imagens")
    .upload(nomeArquivo, arquivo, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("imagens").getPublicUrl(nomeArquivo);
  return data.publicUrl;
}
