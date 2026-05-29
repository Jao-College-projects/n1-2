import { apiFetch, readApiErro, resolveApiAssetUrl } from "../services/apiFetch";

/**
 * Envia imagem para a API Java e retorna URL pública do arquivo.
 */
export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await apiFetch("/api/uploads", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(await readApiErro(res));
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Resposta de upload inválida");
  }
  return resolveApiAssetUrl(data.url);
}
