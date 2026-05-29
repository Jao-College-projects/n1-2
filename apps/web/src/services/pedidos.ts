import type { IItemCarrinho, IPedidoDados, IProduto } from "../types/IProduto";
import { apiFetch, readApiErro } from "./apiFetch";

export interface FinalizarPedidoInput {
  usuarioId: string | null | undefined;
  itens: IItemCarrinho[];
  produtos: IProduto[];
  dadosEntrega: IPedidoDados;
}

/**
 * Transação no servidor: grava pedido, itens e baixa estoque.
 */
export async function finalizarPedido(input: FinalizarPedidoInput): Promise<{ id: number; total: number }> {
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
  const res = await apiFetch("/api/pedidos", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readApiErro(res));
  }
  const data = (await res.json()) as { id: number; total: number };
  return { id: data.id, total: Number(data.total) };
}
