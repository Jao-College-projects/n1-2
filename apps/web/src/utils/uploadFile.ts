import { supabase } from "../lib/supabase";

/**
 * Faz upload de um arquivo para o bucket 'loja' do Supabase.
 * Retorna a URL pública do arquivo.
 */
export async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  // Faz o upload
  const { error: uploadError } = await supabase.storage
    .from('loja')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Erro no upload: ${uploadError.message}`);
  }

  // Pega a URL pública
  const { data } = supabase.storage
    .from('loja')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
