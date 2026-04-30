import type { IItemCarrinho, IPedidoDados, IProduto } from "../types/IProduto";
import { requireApiBase } from "./apiBase";

export interface FinalizarPedidoInput {
  usuarioId: string | null | undefined;
  itens: IItemCarrinho[];
  produtos: IProduto[];
  dadosEntrega: IPedidoDados;
}

async function readErro(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { erro?: string };
    return j.erro ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

/**
 * Transação no servidor: grava pedido, itens e baixa estoque.
 */
export async function finalizarPedido(input: FinalizarPedidoInput): Promise<{ id: number; total: number }> {
  const base = requireApiBase();
  const body = {
    usuarioId: input.usuarioId ?? null,
    itens: input.itens.map((item) => {
      const produto = input.produtos.find((p) => p.id === item.produtoId);
      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: produto?.preco ?? 0,
      };
    }),
    dadosEntrega: input.dadosEntrega,
  };
  const res = await fetch(`${base}/api/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErro(res));
  }
  const data = (await res.json()) as { id: number; total: number };
  return { id: data.id, total: Number(data.total) };
}
