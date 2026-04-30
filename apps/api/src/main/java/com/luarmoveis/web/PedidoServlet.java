package com.luarmoveis.web;

import com.luarmoveis.dto.PedidoCreateRequest;
import com.luarmoveis.service.PedidoService;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;

@WebServlet(name = "PedidoServlet", urlPatterns = {"/api/pedidos"})
public class PedidoServlet extends HttpServlet {

    private final PedidoService pedidoService = new PedidoService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            PedidoCreateRequest body = JsonResponses.readJson(req, PedidoCreateRequest.class);
            PedidoService.ResultadoPedido r = pedidoService.criarPedidoComItens(body);
            Map<String, Object> out = new LinkedHashMap<>();
            out.put("id", r.id());
            out.put("total", r.total());
            JsonResponses.writeJson(resp, HttpServletResponse.SC_CREATED, out);
        } catch (IllegalArgumentException | IllegalStateException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (SQLException e) {
            JsonResponses.writeErro(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao finalizar pedido");
        }
    }
}
