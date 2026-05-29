package com.luarmoveis.model;

import com.google.gson.JsonElement;

public class SecaoHome {
    private String identificador;
    private String tituloSecao;
    private int ordem;
    private boolean ativo;
    private JsonElement conteudo;

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getTituloSecao() {
        return tituloSecao;
    }

    public void setTituloSecao(String tituloSecao) {
        this.tituloSecao = tituloSecao;
    }

    public int getOrdem() {
        return ordem;
    }

    public void setOrdem(int ordem) {
        this.ordem = ordem;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public JsonElement getConteudo() {
        return conteudo;
    }

    public void setConteudo(JsonElement conteudo) {
        this.conteudo = conteudo;
    }
}
