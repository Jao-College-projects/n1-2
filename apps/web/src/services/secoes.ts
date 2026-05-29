import type { ISecaoHome } from "../types/IProduto";
import { apiFetch, readApiErro } from "./apiFetch";

function mapSecao(s: Record<string, unknown>): ISecaoHome {
  return {
    identificador: String(s.identificador ?? ""),
    tituloSecao: String(s.tituloSecao ?? ""),
    ordem: Number(s.ordem ?? 0),
    ativo: Boolean(s.ativo ?? true),
    conteudo: (s.conteudo as ISecaoHome["conteudo"]) ?? {},
  };
}

export async function buscarSecoesHome(): Promise<ISecaoHome[]> {
  const res = await apiFetch("/api/secoes-home");
  if (!res.ok) throw new Error(await readApiErro(res));
  const data = (await res.json()) as Record<string, unknown>[];
  return data.map(mapSecao);
}

export async function salvarSecaoHome(identificador: string, dados: ISecaoHome): Promise<boolean> {
  const res = await apiFetch(`/api/secoes-home/${encodeURIComponent(identificador)}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
  return res.ok;
}
