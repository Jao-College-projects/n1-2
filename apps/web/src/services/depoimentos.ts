import type { IDepoimento } from "../types/IDepoimento";
import { apiFetch, readApiErro } from "./apiFetch";

function mapDepoimento(d: Record<string, unknown>): IDepoimento {
  return {
    id: Number(d.id),
    cliente: String(d.cliente ?? ""),
    texto: String(d.texto ?? ""),
    cidade: String(d.cidade ?? ""),
    imagem: d.imagem ? String(d.imagem) : undefined,
  };
}

export async function buscarDepoimentos(): Promise<IDepoimento[]> {
  const res = await apiFetch("/api/depoimentos");
  if (!res.ok) throw new Error(await readApiErro(res));
  const data = (await res.json()) as Record<string, unknown>[];
  return data.map(mapDepoimento);
}

export async function criarDepoimento(novo: Omit<IDepoimento, "id">): Promise<IDepoimento | null> {
  const res = await apiFetch("/api/depoimentos", {
    method: "POST",
    body: JSON.stringify(novo),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, unknown>;
  return mapDepoimento(data);
}

export async function editarDepoimento(depoimento: IDepoimento): Promise<boolean> {
  const res = await apiFetch(`/api/depoimentos/${depoimento.id}`, {
    method: "PUT",
    body: JSON.stringify(depoimento),
  });
  return res.ok;
}

export async function excluirDepoimento(id: number): Promise<boolean> {
  const res = await apiFetch(`/api/depoimentos/${id}`, { method: "DELETE" });
  return res.status === 204 || res.ok;
}
