package com.luarmoveis.dao;

import com.luarmoveis.model.Produto;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ProdutoDAO {

    public List<Produto> findAll(Connection conn) throws SQLException {
        final String sql = "SELECT id, nome, categoria, descricao_curta, descricao_longa, preco, estoque, imagem, destaque_carrossel "
                + "FROM produtos ORDER BY id DESC";
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<Produto> list = new ArrayList<>();
            while (rs.next()) {
                list.add(mapRow(rs));
            }
            return list;
        }
    }

    public Optional<Produto> findById(Connection conn, long id) throws SQLException {
        final String sql = "SELECT id, nome, categoria, descricao_curta, descricao_longa, preco, estoque, imagem, destaque_carrossel "
                + "FROM produtos WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
            }
        }
        return Optional.empty();
    }

    public long insert(Connection conn, Produto p) throws SQLException {
        final String sql = "INSERT INTO produtos (nome, categoria, descricao_curta, descricao_longa, preco, estoque, imagem, destaque_carrossel) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            bindWrite(ps, p);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        throw new SQLException("INSERT produtos sem id retornado");
    }

    public void update(Connection conn, Produto p) throws SQLException {
        final String sql = "UPDATE produtos SET nome = ?, categoria = ?, descricao_curta = ?, descricao_longa = ?, "
                + "preco = ?, estoque = ?, imagem = ?, destaque_carrossel = ? WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            bindWrite(ps, p);
            ps.setLong(9, p.getId());
            int n = ps.executeUpdate();
            if (n != 1) {
                throw new SQLException("Produto id=" + p.getId() + " não encontrado para atualização");
            }
        }
    }

    public void delete(Connection conn, long id) throws SQLException {
        final String sql = "DELETE FROM produtos WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            int n = ps.executeUpdate();
            if (n != 1) {
                throw new SQLException("Produto id=" + id + " não encontrado para exclusão");
            }
        }
    }

    /**
     * Baixa estoque se houver quantidade suficiente.
     *
     * @return 1 se atualizou uma linha, 0 se estoque insuficiente ou produto inexistente
     */
    public int decrementarEstoque(Connection conn, long produtoId, int quantidade) throws SQLException {
        if (quantidade <= 0) {
            return 0;
        }
        final String sql = "UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantidade);
            ps.setLong(2, produtoId);
            ps.setInt(3, quantidade);
            return ps.executeUpdate();
        }
    }

    private static void bindWrite(PreparedStatement ps, Produto p) throws SQLException {
        ps.setString(1, p.getNome());
        ps.setString(2, p.getCategoria());
        ps.setString(3, nullToEmpty(p.getDescricaoCurta()));
        ps.setString(4, nullToEmpty(p.getDescricaoLonga()));
        ps.setBigDecimal(5, p.getPreco() != null ? p.getPreco() : BigDecimal.ZERO);
        ps.setInt(6, p.getEstoque());
        ps.setString(7, nullToEmpty(p.getImagem()));
        ps.setBoolean(8, p.isDestaqueCarrossel());
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    private static Produto mapRow(ResultSet rs) throws SQLException {
        Produto p = new Produto();
        p.setId(rs.getLong("id"));
        p.setNome(rs.getString("nome"));
        p.setCategoria(rs.getString("categoria"));
        p.setDescricaoCurta(rs.getString("descricao_curta"));
        p.setDescricaoLonga(rs.getString("descricao_longa"));
        p.setPreco(rs.getBigDecimal("preco"));
        p.setEstoque(rs.getInt("estoque"));
        p.setImagem(rs.getString("imagem"));
        p.setDestaqueCarrossel(rs.getBoolean("destaque_carrossel"));
        return p;
    }
}
