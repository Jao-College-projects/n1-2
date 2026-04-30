import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IProduto } from "../../types/IProduto";
import { EditableSectionField } from "../ui/EditableSectionField";

interface FiltroProdutosProps {
  produtos: IProduto[];
  filtroCategoria: string | null;
  setFiltroCategoria: React.Dispatch<React.SetStateAction<string | null>>;
  filtroPreco: string | null;
  setFiltroPreco: React.Dispatch<React.SetStateAction<string | null>>;
  filtroEstoque: boolean;
  setFiltroEstoque: React.Dispatch<React.SetStateAction<boolean>>;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function FiltroProdutos({
  produtos,
  filtroCategoria, setFiltroCategoria,
  filtroPreco, setFiltroPreco,
  filtroEstoque, setFiltroEstoque,
  viewMode, setViewMode
}: FiltroProdutosProps): JSX.Element {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isPrecoOpen, setIsPrecoOpen] = useState(false);

  const categoriasUnicas = useMemo(() => {
    return Array.from(new Set(produtos.map(p => p.categoria))).sort();
  }, [produtos]);

  const handleToggleCategoria = (item: string) => {
    setFiltroCategoria(prev => prev === item ? null : item);
    setIsCatOpen(false);
  };

  const handleTogglePreco = (item: string) => {
    setFiltroPreco(prev => prev === item ? null : item);
    setIsPrecoOpen(false);
  };

  const dropdownBtnStyle: React.CSSProperties = {
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    border: "1px solid #e7e5e4",
    background: "white",
    borderRadius: "999px",
    padding: "0.5rem 1.25rem",
    color: "#1c1917",
    transition: "border-color 0.3s ease",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem"
  };

  return (
    <div className="d-flex flex-column gap-4">

      {/* Grupos de filtros */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-1 g-3">

        {/* Categoria */}
        <div className="col">
          <div className="position-relative d-flex flex-column gap-2">
            <p className="font-sans fw-bold text-gold-soft uppercase mb-1" style={{ fontSize: "0.62rem", letterSpacing: "0.25em" }}>
              Categoria
            </p>
            <button onClick={() => { setIsCatOpen(!isCatOpen); setIsPrecoOpen(false); }} style={dropdownBtnStyle}>
              <span className="truncate">{filtroCategoria || "Todas"}</span>
              <svg className="flex-shrink-0 transition-transform-custom" style={{ transform: isCatOpen ? "rotate(180deg)" : "none" }} width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                <path d="M2 4l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {isCatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="position-absolute w-100 border border-stone-200 bg-white p-2 shadow"
                  style={{ top: "100%", left: 0, zIndex: 60, borderRadius: "0.75rem", minWidth: "220px", marginTop: "0.5rem" }}
                >
                  <button
                    onClick={() => handleToggleCategoria("")}
                    className="w-100 text-start border-0 bg-transparent font-sans text-mist uppercase tracking-wide transition-colors-custom"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.72rem", borderRadius: "0.5rem" }}
                  >
                    Todas as categorias
                  </button>
                  {categoriasUnicas.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleToggleCategoria(cat)}
                      className="w-100 text-start border-0 font-sans uppercase tracking-wide transition-smooth"
                      style={{
                        padding: "0.5rem 1rem", fontSize: "0.72rem", borderRadius: "0.5rem",
                        background: filtroCategoria === cat ? "#1c1917" : "transparent",
                        color: filtroCategoria === cat ? "white" : "#78716c",
                        cursor: "pointer"
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preço */}
        <div className="col">
          <div className="position-relative d-flex flex-column gap-2">
            <p className="font-sans fw-bold text-gold-soft uppercase mb-1" style={{ fontSize: "0.62rem", letterSpacing: "0.25em" }}>
              Faixa de Preço
            </p>
            <button onClick={() => { setIsPrecoOpen(!isPrecoOpen); setIsCatOpen(false); }} style={dropdownBtnStyle}>
              <span className="truncate">{filtroPreco || "Qualquer"}</span>
              <svg className="flex-shrink-0 transition-transform-custom" style={{ transform: isPrecoOpen ? "rotate(180deg)" : "none" }} width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                <path d="M2 4l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {isPrecoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="position-absolute w-100 border border-stone-200 bg-white p-2 shadow"
                  style={{ top: "100%", left: 0, zIndex: 60, borderRadius: "0.75rem", minWidth: "220px", marginTop: "0.5rem" }}
                >
                  <button
                    onClick={() => handleTogglePreco("")}
                    className="w-100 text-start border-0 bg-transparent font-sans text-mist uppercase tracking-wide transition-colors-custom"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.72rem", borderRadius: "0.5rem" }}
                  >
                    Todos os valores
                  </button>
                  {["Até R$ 2.000", "R$ 2.000 – 5.000", "R$ 5.000 – 10.000", "Acima de R$ 10.000"].map(p => (
                    <button
                      key={p}
                      onClick={() => handleTogglePreco(p)}
                      className="w-100 text-start border-0 font-sans uppercase tracking-wide transition-smooth"
                      style={{
                        padding: "0.5rem 1rem", fontSize: "0.72rem", borderRadius: "0.5rem",
                        background: filtroPreco === p ? "#1c1917" : "transparent",
                        color: filtroPreco === p ? "white" : "#78716c",
                        cursor: "pointer"
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="col">
          <p className="font-sans fw-bold text-gold-soft uppercase mb-2" style={{ fontSize: "0.62rem", letterSpacing: "0.25em" }}>
            Disponibilidade
          </p>
          <button
            type="button"
            onClick={() => setFiltroEstoque(prev => !prev)}
            className="font-sans uppercase tracking-wide transition-smooth"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              padding: "0.5rem 1.25rem",
              borderRadius: "999px",
              cursor: "pointer",
              border: filtroEstoque ? "none" : "1px solid #e7e5e4",
              background: filtroEstoque ? "#c9a86a" : "white",
              color: filtroEstoque ? "#1c1917" : "#78716c",
              fontWeight: filtroEstoque ? 700 : 400,
              boxShadow: filtroEstoque ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Em estoque
          </button>
        </div>
      </div>

      {/* Alternador de visualização */}
      <div className="d-flex flex-column gap-3 border-top border-stone-100 pt-4">
        <p className="font-sans fw-bold text-mist uppercase mb-0" style={{ fontSize: "0.62rem", letterSpacing: "0.25em", opacity: 0.6 }}>
          Visualização
        </p>
        <div className="d-inline-flex align-items-center gap-2 border border-stone-200 p-1" style={{ borderRadius: "999px", background: "rgba(255,255,255,0.5)" }}>
          <button
            onClick={() => setViewMode("grid")}
            className="border-0 p-2 transition-smooth"
            style={{ borderRadius: "999px", background: viewMode === "grid" ? "#1c1917" : "transparent", color: viewMode === "grid" ? "white" : "#78716c", cursor: "pointer" }}
            title="Visualização em Grade"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className="border-0 p-2 transition-smooth"
            style={{ borderRadius: "999px", background: viewMode === "list" ? "#1c1917" : "transparent", color: viewMode === "list" ? "white" : "#78716c", cursor: "pointer" }}
            title="Visualização em Lista"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
