import type { IProduto } from "../types/IProduto";
import { requireApiBase } from "./apiBase";

async function readErro(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { erro?: string };
    return j.erro ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

function mapProduto(p: Record<string, unknown>): IProduto {
  return {
    id: Number(p.id),
    nome: String(p.nome ?? ""),
    categoria: String(p.categoria ?? ""),
    descricaoCurta: String(p.descricaoCurta ?? ""),
    descricaoLonga: String(p.descricaoLonga ?? ""),
    preco: Number(p.preco ?? 0),
    estoque: Number(p.estoque ?? 0),
    imagem: String(p.imagem ?? ""),
    destaqueCarrossel: Boolean(p.destaqueCarrossel),
  };
}

export async function buscarProdutos(): Promise<IProduto[]> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/produtos`);
  if (!res.ok) throw new Error(await readErro(res));
  const data = (await res.json()) as Record<string, unknown>[];
  return data.map(mapProduto);
}

export async function criarProduto(novoProduto: Omit<IProduto, "id">): Promise<IProduto | null> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoProduto),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, unknown>;
  return mapProduto(data);
}

export async function editarProduto(produto: IProduto): Promise<boolean> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/produtos/${produto.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto),
  });
  return res.ok;
}

export async function excluirProduto(produtoId: number): Promise<boolean> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/produtos/${produtoId}`, { method: "DELETE" });
  return res.status === 204 || res.ok;
}
