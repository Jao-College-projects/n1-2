package com.luarmoveis.dto;

import com.google.gson.JsonElement;

import java.util.List;

public class PedidoCreateRequest {
    private String usuarioId;
    private List<ItemPedidoRequest> itens;
    private JsonElement dadosEntrega;

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public List<ItemPedidoRequest> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedidoRequest> itens) {
        this.itens = itens;
    }

    public JsonElement getDadosEntrega() {
        return dadosEntrega;
    }

    public void setDadosEntrega(JsonElement dadosEntrega) {
        this.dadosEntrega = dadosEntrega;
    }
}
