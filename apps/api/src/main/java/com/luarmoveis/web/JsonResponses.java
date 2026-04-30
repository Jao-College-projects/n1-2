package com.luarmoveis.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public final class JsonResponses {

    public static final Gson GSON = new GsonBuilder()
            .disableHtmlEscaping()
            .create();

    private JsonResponses() {
    }

    public static void writeJson(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resp.setContentType("application/json; charset=UTF-8");
        try (Writer w = resp.getWriter()) {
            GSON.toJson(body, w);
        }
    }

    public static void writeErro(HttpServletResponse resp, int status, String mensagem) throws IOException {
        JsonObject o = new JsonObject();
        o.addProperty("erro", mensagem);
        writeJson(resp, status, o);
    }

    public static <T> T readJson(HttpServletRequest req, Class<T> type) throws IOException {
        try (Reader r = req.getReader()) {
            return GSON.fromJson(r, type);
        }
    }
}
