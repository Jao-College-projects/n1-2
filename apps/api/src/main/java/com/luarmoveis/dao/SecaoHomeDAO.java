package com.luarmoveis.dao;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.luarmoveis.model.SecaoHome;
import com.luarmoveis.web.JsonResponses;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class SecaoHomeDAO {

    public List<SecaoHome> findAtivas(Connection conn) throws SQLException {
        final String sql = "SELECT identificador, titulo_secao, ordem, ativo, conteudo FROM secoes_home WHERE ativo = TRUE ORDER BY ordem";
        return queryList(conn, sql);
    }

    public List<SecaoHome> findAll(Connection conn) throws SQLException {
        final String sql = "SELECT identificador, titulo_secao, ordem, ativo, conteudo FROM secoes_home ORDER BY ordem";
        return queryList(conn, sql);
    }

    public Optional<SecaoHome> findByIdentificador(Connection conn, String identificador) throws SQLException {
        final String sql = "SELECT identificador, titulo_secao, ordem, ativo, conteudo FROM secoes_home WHERE identificador = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, identificador);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
            }
        }
        return Optional.empty();
    }

    public void upsert(Connection conn, SecaoHome s) throws SQLException {
        final String sql = "INSERT INTO secoes_home (identificador, titulo_secao, ordem, ativo, conteudo) "
                + "VALUES (?, ?, ?, ?, ?::jsonb) "
                + "ON CONFLICT (identificador) DO UPDATE SET "
                + "titulo_secao = EXCLUDED.titulo_secao, ordem = EXCLUDED.ordem, ativo = EXCLUDED.ativo, "
                + "conteudo = EXCLUDED.conteudo, updated_at = NOW()";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, s.getIdentificador());
            ps.setString(2, s.getTituloSecao());
            ps.setInt(3, s.getOrdem());
            ps.setBoolean(4, s.isAtivo());
            String json = s.getConteudo() != null ? JsonResponses.GSON.toJson(s.getConteudo()) : "{}";
            ps.setString(5, json);
            ps.executeUpdate();
        }
    }

    private List<SecaoHome> queryList(Connection conn, String sql) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<SecaoHome> list = new ArrayList<>();
            while (rs.next()) {
                list.add(mapRow(rs));
            }
            return list;
        }
    }

    private static SecaoHome mapRow(ResultSet rs) throws SQLException {
        SecaoHome s = new SecaoHome();
        s.setIdentificador(rs.getString("identificador"));
        s.setTituloSecao(rs.getString("titulo_secao"));
        s.setOrdem(rs.getInt("ordem"));
        s.setAtivo(rs.getBoolean("ativo"));
        String json = rs.getString("conteudo");
        if (json == null || json.isBlank()) {
            s.setConteudo(JsonParser.parseString("{}"));
        } else {
            s.setConteudo(JsonParser.parseString(json));
        }
        return s;
    }
}
