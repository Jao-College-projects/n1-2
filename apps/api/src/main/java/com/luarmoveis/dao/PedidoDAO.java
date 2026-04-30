package com.luarmoveis.dao;

import com.google.gson.JsonElement;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class PedidoDAO {

    public long insertPedido(Connection conn, String usuarioId, BigDecimal total, JsonElement dadosEntrega) throws SQLException {
        final String sql = "INSERT INTO pedidos (usuario_id, status, total, dados_entrega) VALUES (?, 'carrinho', ?, CAST(? AS jsonb)) RETURNING id";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            if (usuarioId != null && !usuarioId.isBlank()) {
                ps.setString(1, usuarioId);
            } else {
                ps.setNull(1, Types.VARCHAR);
            }
            ps.setBigDecimal(2, total);
            String json = (dadosEntrega == null || dadosEntrega.isJsonNull()) ? "{}" : dadosEntrega.toString();
            ps.setString(3, json);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        throw new SQLException("INSERT pedidos sem id");
    }

    public void insertItem(Connection conn, long pedidoId, int produtoId, int quantidade, BigDecimal precoUnitario) throws SQLException {
        final String sql = "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, pedidoId);
            ps.setInt(2, produtoId);
            ps.setInt(3, quantidade);
            ps.setBigDecimal(4, precoUnitario);
            ps.executeUpdate();
        }
    }
}
