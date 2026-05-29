package com.luarmoveis.dao;

import com.luarmoveis.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class UsuarioDAO {

    public Optional<Usuario> findByEmail(Connection conn, String email) throws SQLException {
        final String sql = "SELECT id, nome_completo, email, senha_hash, tipo_usuario FROM usuarios WHERE email = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email.trim().toLowerCase());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs, true));
                }
            }
        }
        return Optional.empty();
    }

    public Optional<Usuario> findById(Connection conn, String id) throws SQLException {
        final String sql = "SELECT id, nome_completo, email, senha_hash, tipo_usuario FROM usuarios WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs, true));
                }
            }
        }
        return Optional.empty();
    }

    public void insert(Connection conn, Usuario u, String senhaHash) throws SQLException {
        final String sql = "INSERT INTO usuarios (id, nome_completo, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, u.getId());
            ps.setString(2, u.getNomeCompleto());
            ps.setString(3, u.getEmail().trim().toLowerCase());
            ps.setString(4, senhaHash);
            ps.setString(5, u.getTipoUsuario() != null ? u.getTipoUsuario() : "normal");
            ps.executeUpdate();
        }
    }

    public static Usuario semSenha(Usuario u) {
        Usuario pub = new Usuario();
        pub.setId(u.getId());
        pub.setNomeCompleto(u.getNomeCompleto());
        pub.setEmail(u.getEmail());
        pub.setTipoUsuario(u.getTipoUsuario());
        return pub;
    }

    private static Usuario mapRow(ResultSet rs, boolean comSenhaHash) throws SQLException {
        Usuario u = new Usuario();
        u.setId(rs.getString("id"));
        u.setNomeCompleto(rs.getString("nome_completo"));
        u.setEmail(rs.getString("email"));
        u.setTipoUsuario(rs.getString("tipo_usuario"));
        if (comSenhaHash) {
            u.setSenha(rs.getString("senha_hash"));
        }
        return u;
    }
}
