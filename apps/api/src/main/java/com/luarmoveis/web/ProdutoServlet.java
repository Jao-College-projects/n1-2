package com.luarmoveis.web;

import com.luarmoveis.dao.ProdutoDAO;
import com.luarmoveis.infra.ConnectionFactory;
import com.luarmoveis.model.Produto;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@WebServlet(name = "ProdutoServlet", urlPatterns = {"/api/produtos", "/api/produtos/*"})
public class ProdutoServlet extends HttpServlet {

    private final ProdutoDAO produtoDAO = new ProdutoDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.isEmpty() || "/".equals(pathInfo)) {
            try (var conn = ConnectionFactory.getConnection()) {
                List<Produto> list = produtoDAO.findAll(conn);
                JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, list);
            } catch (SQLException e) {
                getServletContext().log("GET /api/produtos", e);
                JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao acessar o banco");
            }
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
            Optional<Produto> p = produtoDAO.findById(conn, id);
            if (p.isEmpty()) {
                JsonResponses.writeErro(resp, HttpServletResponse.SC_NOT_FOUND, "Produto não encontrado");
                return;
            }
            JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, p.get());
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao acessar o banco");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Produto body = JsonResponses.readJson(req, Produto.class);
            try (var conn = ConnectionFactory.getConnection()) {
                long id = produtoDAO.insert(conn, body);
                body.setId(id);
                JsonResponses.writeJson(resp, HttpServletResponse.SC_CREATED, body);
            }
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao salvar produto");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.isEmpty() || "/".equals(pathInfo)) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Informe o id na URL");
            return;
        }
        final long idUrl;
        try {
            idUrl = parseId(pathInfo);
        } catch (IllegalArgumentException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Id inválido");
            return;
        }
        try {
            Produto body = JsonResponses.readJson(req, Produto.class);
            body.setId(idUrl);
            try (var conn = ConnectionFactory.getConnection()) {
                produtoDAO.update(conn, body);
                JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, body);
            }
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
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
            produtoDAO.delete(conn, id);
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
