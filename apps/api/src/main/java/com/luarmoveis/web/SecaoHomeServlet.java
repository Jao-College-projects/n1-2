package com.luarmoveis.web;

import com.luarmoveis.auth.AuthHelper;
import com.luarmoveis.dao.SecaoHomeDAO;
import com.luarmoveis.infra.ConnectionFactory;
import com.luarmoveis.model.SecaoHome;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "SecaoHomeServlet", urlPatterns = {"/api/secoes-home", "/api/secoes-home/*"})
public class SecaoHomeServlet extends HttpServlet {

    private final SecaoHomeDAO secaoHomeDAO = new SecaoHomeDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try (var conn = ConnectionFactory.getConnection()) {
            List<SecaoHome> list = secaoHomeDAO.findAtivas(conn);
            JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, list);
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao listar seções");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!AuthHelper.requireAdmin(req, resp)) {
            return;
        }
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.isEmpty() || "/".equals(pathInfo)) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Informe o identificador na URL");
            return;
        }
        String identificador = pathInfo.startsWith("/") ? pathInfo.substring(1) : pathInfo;
        try {
            SecaoHome body = JsonResponses.readJson(req, SecaoHome.class);
            body.setIdentificador(identificador);
            try (var conn = ConnectionFactory.getConnection()) {
                secaoHomeDAO.upsert(conn, body);
                JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, body);
            }
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao salvar seção");
        }
    }
}
