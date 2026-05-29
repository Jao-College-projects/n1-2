package com.luarmoveis.web;

import com.luarmoveis.auth.AuthHelper;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@WebServlet(name = "UploadServlet", urlPatterns = {"/api/uploads", "/api/uploads/*"})
@MultipartConfig(maxFileSize = 10 * 1024 * 1024, maxRequestSize = 12 * 1024 * 1024)
public class UploadServlet extends HttpServlet {

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!AuthHelper.requireAdmin(req, resp)) {
            return;
        }
        try {
            Part filePart = req.getPart("file");
            if (filePart == null || filePart.getSize() == 0) {
                JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Arquivo não enviado");
                return;
            }
            String contentType = filePart.getContentType();
            if (contentType == null || !TIPOS_PERMITIDOS.contains(contentType)) {
                JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, "Tipo de arquivo não permitido");
                return;
            }
            String ext = extensao(contentType);
            String storedName = UUID.randomUUID() + ext;
            Path dir = uploadDir();
            Files.createDirectories(dir);
            Path dest = dir.resolve(storedName);
            try (InputStream in = filePart.getInputStream()) {
                Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
            }
            String base = req.getContextPath();
            String url = base + "/api/uploads/" + storedName;
            JsonResponses.writeJson(resp, HttpServletResponse.SC_CREATED, Map.of("url", url));
        } catch (Exception e) {
            getServletContext().log("POST /api/uploads", e);
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro no upload");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.isEmpty() || "/".equals(pathInfo)) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        String name = pathInfo.startsWith("/") ? pathInfo.substring(1) : pathInfo;
        if (name.contains("..") || name.contains("/")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        Path file = uploadDir().resolve(name);
        if (!Files.isRegularFile(file)) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        resp.setContentType(contentType);
        resp.setContentLengthLong(Files.size(file));
        Files.copy(file, resp.getOutputStream());
    }

    private Path uploadDir() {
        String env = System.getenv("UPLOAD_DIR");
        if (env != null && !env.isBlank()) {
            return Path.of(env);
        }
        return Path.of(System.getProperty("java.io.tmpdir"), "luar-uploads");
    }

    private static String extensao(String contentType) {
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
