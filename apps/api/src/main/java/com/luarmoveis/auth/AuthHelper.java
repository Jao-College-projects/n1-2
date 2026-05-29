package com.luarmoveis.auth;

import com.luarmoveis.model.Usuario;
import com.luarmoveis.web.JsonResponses;

import java.io.IOException;
import java.util.Optional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public final class AuthHelper {

    public static final String SESSION_USUARIO = "usuario";

    private AuthHelper() {
    }

    public static Optional<Usuario> usuarioDaSessao(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) {
            return Optional.empty();
        }
        Object attr = session.getAttribute(SESSION_USUARIO);
        if (attr instanceof Usuario u) {
            return Optional.of(u);
        }
        return Optional.empty();
    }

    public static boolean isAdmin(Usuario u) {
        return u != null && "admin".equalsIgnoreCase(u.getTipoUsuario());
    }

    public static boolean requireAdmin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Optional<Usuario> u = usuarioDaSessao(req);
        if (u.isEmpty() || !isAdmin(u.get())) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_FORBIDDEN, "Acesso restrito a administradores");
            return false;
        }
        return true;
    }

    public static void gravarSessao(HttpServletRequest req, Usuario usuario) {
        HttpSession session = req.getSession(true);
        session.setAttribute(SESSION_USUARIO, usuario);
    }

    public static void limparSessao(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
}
