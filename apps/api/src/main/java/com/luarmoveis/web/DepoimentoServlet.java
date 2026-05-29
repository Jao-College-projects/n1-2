package com.luarmoveis.web;

import com.luarmoveis.auth.AuthHelper;
import com.luarmoveis.dao.DepoimentoDAO;
import com.luarmoveis.infra.ConnectionFactory;
import com.luarmoveis.model.Depoimento;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "DepoimentoServlet", urlPatterns = {"/api/depoimentos", "/api/depoimentos/*"})
public class DepoimentoServlet extends HttpServlet {

    private final DepoimentoDAO depoimentoDAO = new DepoimentoDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (var conn = ConnectionFactory.getConnection()) {
            List<Depoimento> list = depoimentoDAO.findAll(conn);
            JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, list);
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao listar depoimentos");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!AuthHelper.requireAdmin(req, resp)) {
            return;
        }
        try {
            Depoimento body = JsonResponses.readJson(req, Depoimento.class);
            try (var conn = ConnectionFactory.getConnection()) {
                long id = depoimentoDAO.insert(conn, body);
                body.setId(id);
                JsonResponses.writeJson(resp, HttpServletResponse.SC_CREATED, body);
            }
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao criar depoimento");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!AuthHelper.requireAdmin(req, resp)) {
            return;
        }
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.isEmpty() || "/".equals(pathInfo)) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Informe o id na URL");
            return;
        }
        final long id;
        try {
            id = parseId(pathInfo);
        } catch (IllegalArgumentException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Id inválido");
            return;
        }
        try {
            Depoimento body = JsonResponses.readJson(req, Depoimento.class);
            body.setId(id);
            try (var conn = ConnectionFactory.getConnection()) {
                depoimentoDAO.update(conn, body);
                JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, body);
            }
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!AuthHelper.requireAdmin(req, resp)) {
            return;
        }
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.isEmpty() || "/".equals(pathInfo)) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Informe o id na URL");
            return;
        }
        final long id;
        try {
            id = parseId(pathInfo);
        } catch (IllegalArgumentException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Id inválido");
            return;
        }
        try (var conn = ConnectionFactory.getConnection()) {
            depoimentoDAO.delete(conn, id);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    private static long parseId(String pathInfo) {
        String s = pathInfo.startsWith("/") ? pathInfo.substring(1).trim() : pathInfo.trim();
        return Long.parseLong(s);
    }
}
