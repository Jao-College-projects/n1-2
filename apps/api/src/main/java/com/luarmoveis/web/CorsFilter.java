package com.luarmoveis.web;

import com.luarmoveis.auth.AuthHelper;
import com.luarmoveis.model.Usuario;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Optional;

@WebFilter(urlPatterns = {"/api/*"})
public class CorsFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        String origin = req.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*");
        }
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");

        long start = System.nanoTime();
        String path = pathLog(req);
        try {
            if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
                res.setStatus(HttpServletResponse.SC_OK);
                return;
            }
            chain.doFilter(req, res);
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            System.out.printf(
                    "[API] %s %-6s %s → %d (%dms) %s%n",
                    usuarioLabel(req),
                    req.getMethod(),
                    path,
                    res.getStatus(),
                    ms,
                    req.getRemoteAddr()
            );
        }
    }

    private static String pathLog(HttpServletRequest req) {
        String path = req.getRequestURI();
        String ctx = req.getContextPath();
        if (ctx != null && !ctx.isEmpty() && path.startsWith(ctx)) {
            path = path.substring(ctx.length());
        }
        if (req.getQueryString() != null) {
            path = path + "?" + req.getQueryString();
        }
        return path;
    }

    private static String usuarioLabel(HttpServletRequest req) {
        Optional<Usuario> u = AuthHelper.usuarioDaSessao(req);
        if (u.isEmpty()) {
            return "[anon] ";
        }
        String tipo = u.get().getTipoUsuario();
        return "[user:" + (tipo != null ? tipo : "?") + "]";
    }
}
