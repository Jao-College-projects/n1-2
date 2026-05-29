import { buscarSessao } from "../services/auth";
import { apiFetch, readApiErro, resolveApiAssetUrl } from "../services/apiFetch";

/**
 * Envia imagem para a API Java e retorna URL pública do arquivo.
 */
export async function uploadFile(file: File): Promise<string> {
  const sessao = await buscarSessao();
  if (sessao?.tipoUsuario !== "admin") {
    throw new Error("Faça login como administrador para enviar imagens.");
  }

  const form = new FormData();
  form.append("file", file);

  const res = await apiFetch("/api/uploads", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const msg = await readApiErro(res);
    if (res.status === 403) {
      throw new Error("Sessão expirada ou sem permissão. Entre novamente como admin.");
    }
    throw new Error(msg || "Erro no upload");
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Resposta de upload inválida");
  }
  return resolveApiAssetUrl(data.url);
}
