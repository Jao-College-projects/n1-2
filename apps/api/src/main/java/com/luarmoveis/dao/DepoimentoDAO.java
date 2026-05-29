package com.luarmoveis.dao;

import com.luarmoveis.model.Depoimento;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DepoimentoDAO {

    public List<Depoimento> findAll(Connection conn) throws SQLException {
        final String sql = "SELECT id, cliente, texto, cidade, imagem FROM depoimentos ORDER BY id DESC";
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<Depoimento> list = new ArrayList<>();
            while (rs.next()) {
                list.add(mapRow(rs));
            }
            return list;
        }
    }

    public Optional<Depoimento> findById(Connection conn, long id) throws SQLException {
        final String sql = "SELECT id, cliente, texto, cidade, imagem FROM depoimentos WHERE id = ?";
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

    public long insert(Connection conn, Depoimento d) throws SQLException {
        final String sql = "INSERT INTO depoimentos (cliente, texto, cidade, imagem) VALUES (?, ?, ?, ?) RETURNING id";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            bindWrite(ps, d);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        throw new SQLException("INSERT depoimentos sem id retornado");
    }

    public void update(Connection conn, Depoimento d) throws SQLException {
        final String sql = "UPDATE depoimentos SET cliente = ?, texto = ?, cidade = ?, imagem = ? WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            bindWrite(ps, d);
            ps.setLong(5, d.getId());
            int n = ps.executeUpdate();
            if (n != 1) {
                throw new SQLException("Depoimento id=" + d.getId() + " não encontrado");
            }
        }
    }

    public void delete(Connection conn, long id) throws SQLException {
        final String sql = "DELETE FROM depoimentos WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            int n = ps.executeUpdate();
            if (n != 1) {
                throw new SQLException("Depoimento id=" + id + " não encontrado");
            }
        }
    }

    private static void bindWrite(PreparedStatement ps, Depoimento d) throws SQLException {
        ps.setString(1, d.getCliente());
        ps.setString(2, d.getTexto());
        ps.setString(3, d.getCidade() != null ? d.getCidade() : "");
        ps.setString(4, d.getImagem() != null ? d.getImagem() : "");
    }

    private static Depoimento mapRow(ResultSet rs) throws SQLException {
        Depoimento d = new Depoimento();
        d.setId(rs.getLong("id"));
        d.setCliente(rs.getString("cliente"));
        d.setTexto(rs.getString("texto"));
        d.setCidade(rs.getString("cidade"));
        d.setImagem(rs.getString("imagem"));
        return d;
    }
}
