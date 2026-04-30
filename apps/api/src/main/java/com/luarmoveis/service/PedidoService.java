package com.luarmoveis.service;

import com.luarmoveis.dao.PedidoDAO;
import com.luarmoveis.dao.ProdutoDAO;
import com.luarmoveis.dto.ItemPedidoRequest;
import com.luarmoveis.dto.PedidoCreateRequest;
import com.luarmoveis.infra.ConnectionFactory;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Finalização de pedido em transação: insere pedido e itens e baixa estoque.
 * Se qualquer baixa de estoque falhar, faz rollback de tudo.
 */
public class PedidoService {

    private final PedidoDAO pedidoDAO = new PedidoDAO();
    private final ProdutoDAO produtoDAO = new ProdutoDAO();

    public record ResultadoPedido(long id, BigDecimal total) {
    }

    public ResultadoPedido criarPedidoComItens(PedidoCreateRequest req) throws SQLException {
        List<ItemPedidoRequest> itens = req.getItens();
        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Pedido sem itens");
        }

        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedidoRequest item : itens) {
            if (item.getQuantidade() <= 0) {
                throw new IllegalArgumentException("Quantidade inválida");
            }
            if (item.getPrecoUnitario() == null) {
                throw new IllegalArgumentException("preço unitário obrigatório em cada item");
            }
            BigDecimal linha = item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()));
            total = total.add(linha);
        }

        try (Connection conn = ConnectionFactory.getConnection()) {
            conn.setAutoCommit(false);
            try {
                long pedidoId = pedidoDAO.insertPedido(conn, req.getUsuarioId(), total, req.getDadosEntrega());

                for (ItemPedidoRequest item : itens) {
                    int ok = produtoDAO.decrementarEstoque(conn, item.getProdutoId(), item.getQuantidade());
                    if (ok != 1) {
                        throw new IllegalStateException(
                                "Estoque insuficiente ou produto inexistente (id=" + item.getProdutoId() + ")"
                        );
                    }
                    pedidoDAO.insertItem(
                            conn,
                            pedidoId,
                            item.getProdutoId(),
                            item.getQuantidade(),
                            item.getPrecoUnitario()
                    );
                }

                conn.commit();
                return new ResultadoPedido(pedidoId, total);
            } catch (RuntimeException e) {
                conn.rollback();
                throw e;
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } catch (Exception e) {
                conn.rollback();
                throw new SQLException(e);
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }
}
