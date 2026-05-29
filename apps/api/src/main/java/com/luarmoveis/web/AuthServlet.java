package com.luarmoveis.web;

import com.luarmoveis.auth.AuthHelper;
import com.luarmoveis.auth.PasswordHasher;
import com.luarmoveis.dao.UsuarioDAO;
import com.luarmoveis.dto.LoginRequest;
import com.luarmoveis.dto.RegisterRequest;
import com.luarmoveis.infra.ConnectionFactory;
import com.luarmoveis.model.Usuario;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

@WebServlet(name = "AuthServlet", urlPatterns = {"/api/auth", "/api/auth/*"})
public class AuthServlet extends HttpServlet {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String action = action(req);
        if (!"me".equals(action)) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_NOT_FOUND, "Rota não encontrada");
            return;
        }
        Optional<Usuario> u = AuthHelper.usuarioDaSessao(req);
        if (u.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }
        JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, UsuarioDAO.semSenha(u.get()));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String action = action(req);
        switch (action) {
            case "login" -> login(req, resp);
            case "register" -> register(req, resp);
            case "logout" -> logout(req, resp);
            default -> JsonResponses.writeErro(resp, HttpServletResponse.SC_NOT_FOUND, "Rota não encontrada");
        }
    }

    private void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        LoginRequest body = JsonResponses.readJson(req, LoginRequest.class);
        if (body.getEmail() == null || body.getEmail().isBlank() || body.getSenha() == null) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Email e senha são obrigatórios");
            return;
        }
        try (var conn = ConnectionFactory.getConnection()) {
            Optional<Usuario> found = usuarioDAO.findByEmail(conn, body.getEmail());
            if (found.isEmpty() || !PasswordHasher.verify(body.getSenha(), found.get().getSenha())) {
                JsonResponses.writeErro(resp, HttpServletResponse.SC_UNAUTHORIZED, "Credenciais inválidas");
                return;
            }
            Usuario pub = UsuarioDAO.semSenha(found.get());
            AuthHelper.gravarSessao(req, pub);
            JsonResponses.writeJson(resp, HttpServletResponse.SC_OK, pub);
        } catch (SQLException e) {
            getServletContext().log("POST /api/auth/login", e);
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao autenticar");
        }
    }

    private void register(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        RegisterRequest body = JsonResponses.readJson(req, RegisterRequest.class);
        if (body.getNomeCompleto() == null || body.getNomeCompleto().isBlank()
                || body.getEmail() == null || body.getEmail().isBlank()
                || body.getSenha() == null || body.getSenha().length() < 6) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Preencha nome, email e senha (mín. 6 caracteres)");
            return;
        }
        try (var conn = ConnectionFactory.getConnection()) {
            if (usuarioDAO.findByEmail(conn, body.getEmail()).isPresent()) {
                JsonResponses.writeErro(resp, HttpServletResponse.SC_CONFLICT, "Email já cadastrado");
                return;
            }
            Usuario novo = new Usuario();
            novo.setId(UUID.randomUUID().toString());
            novo.setNomeCompleto(body.getNomeCompleto().trim());
            novo.setEmail(body.getEmail().trim().toLowerCase());
            novo.setTipoUsuario("normal");
            String hash = PasswordHasher.hash(body.getSenha());
            usuarioDAO.insert(conn, novo, hash);
            Usuario pub = UsuarioDAO.semSenha(novo);
            AuthHelper.gravarSessao(req, pub);
            JsonResponses.writeJson(resp, HttpServletResponse.SC_CREATED, pub);
        } catch (SQLException e) {
            getServletContext().log("POST /api/auth/register", e);
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao cadastrar");
        }
    }

    private void logout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        AuthHelper.limparSessao(req);
        resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    private static String action(HttpServletRequest req) {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.isEmpty() || "/".equals(pathInfo)) {
            return "";
        }
        return pathInfo.startsWith("/") ? pathInfo.substring(1) : pathInfo;
    }
}
