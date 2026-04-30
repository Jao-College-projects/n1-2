import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useLoja } from "../../store/LojaContext";
import { IProduto } from "../../types/IProduto";
import { ContextMenuProduto } from "./ContextMenuProduto";

interface ProdutoCardProps {
  produto: IProduto;
  onEdit?: (produto: IProduto) => void;
  viewMode?: "grid" | "list";
}

export const ProdutoCard = memo(function ProdutoCard({ produto, onEdit, viewMode = "grid" }: ProdutoCardProps): JSX.Element {
  const { adicionarAoCarrinho, removerProduto, isAdmin, modoEdicao, itensCarrinho } = useLoja();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [alertaSemEstoque, setAlertaSemEstoque] = useState(false);

  const semEstoque = produto.estoque <= 0;
  const itemNoCarrinho = itensCarrinho.find(i => i.produtoId === produto.id);

  const handleAddCarrinho = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (semEstoque) {
      setAlertaSemEstoque(true);
      setTimeout(() => setAlertaSemEstoque(false), 2500);
      return;
    }
    adicionarAoCarrinho(produto.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (semEstoque) {
      e.preventDefault();
      setAlertaSemEstoque(true);
      setTimeout(() => setAlertaSemEstoque(false), 2500);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isAdmin && modoEdicao) {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const borderColor = semEstoque
    ? "rgba(220, 38, 38, 0.5)"
    : modoEdicao
    ? "rgba(201,168,106,0.3)"
    : itemNoCarrinho
    ? "#c9a86a"
    : "rgba(231,229,228,0.6)";

  return (
    <div onContextMenu={handleContextMenu} className="position-relative h-100">
      {alertaSemEstoque && (
        <div
          className="position-absolute d-flex align-items-center justify-content-center"
          style={{ inset: 0, zIndex: 50, pointerEvents: "none" }}
        >
          <div
            className="font-sans fw-bold text-white text-center rounded-sm px-3 py-2"
            style={{ background: "rgba(220,38,38,0.92)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
          >
            Não há produtos em estoque
          </div>
        </div>
      )}
      <Link
        to={`/produtos/${produto.id}`}
        onClick={handleCardClick}
        className={`produto-card d-flex border overflow-hidden h-100 ${viewMode === "grid" ? "flex-column" : "flex-row align-items-center"}`}
        style={{ borderColor, background: semEstoque ? "rgba(254,242,242,0.7)" : "white" }}
      >
        {/* Imagem */}
        <div
          className="overflow-hidden position-relative flex-shrink-0"
          style={viewMode === "grid"
            ? { aspectRatio: "4/5" }
            : { height: "8rem", width: "8rem" }
          }
        >
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="produto-card-img"
            loading="lazy"
          />

          {/* Overlay hover */}
          <div
            className="position-absolute inset-0 transition-opacity-custom"
            style={{ background: "linear-gradient(to top, rgba(28,25,23,0.7), rgba(28,25,23,0.1), transparent)", opacity: 0, pointerEvents: "none" }}
          />

          {/* Categoria pill */}
          <div className="position-absolute" style={{ top: "1rem", left: "1rem" }}>
            <span
              className="font-sans text-charcoal uppercase tracking-wide"
              style={{ background: "rgba(247,244,239,0.92)", padding: "0.25rem 0.75rem", fontSize: "0.58rem", backdropFilter: "blur(4px)" }}
            >
              {produto.categoria}
            </span>
          </div>

          {/* Badge "Na sacola" */}
          {itemNoCarrinho && (
            <div
              className="position-absolute d-flex align-items-center gap-1 rounded-pill bg-gold-soft px-2 py-1"
              style={{ top: "0.75rem", right: "0.75rem", zIndex: 10 }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              <span className="font-sans fw-bold uppercase text-white" style={{ fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                {itemNoCarrinho.quantidade}
              </span>
            </div>
          )}

          {/* Botão adicionar ao carrinho (grid mode) */}
          {viewMode === "grid" && (
            <div className="position-absolute bottom-0 start-0 end-0 p-3 d-flex gap-2">
              <button
                type="button"
                onClick={handleAddCarrinho}
                className="w-100 py-2 font-sans uppercase tracking-wide transition-smooth"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  border: "none",
                  cursor: semEstoque ? "not-allowed" : "pointer",
                  background: semEstoque ? "rgba(220,38,38,0.15)" : itemNoCarrinho ? "#c9a86a" : "rgba(184,149,108,0.9)",
                  color: semEstoque ? "rgb(185,28,28)" : itemNoCarrinho ? "white" : "#1c1917",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              >
                {semEstoque ? "Esgotado" : itemNoCarrinho ? `Na sacola (${itemNoCarrinho.quantidade})` : "+ Carrinho"}
              </button>
            </div>
          )}

          {/* Overlay esgotado */}
          {produto.estoque <= 0 && (
            <div className="position-absolute inset-0 d-flex align-items-center justify-content-center" style={{ background: "rgba(28,25,23,0.4)", backdropFilter: "blur(2px)", zIndex: 20 }}>
              <span className="bg-white font-sans fw-bold uppercase text-charcoal" style={{ padding: "0.5rem 1rem", fontSize: "0.7rem", letterSpacing: "0.3em", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                Esgotado
              </span>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className={`d-flex flex-column flex-grow-1 gap-3 ${viewMode === "grid" ? "p-4" : "px-4 py-3"}`}>
          <div className={`d-flex ${viewMode === "list" ? "flex-sm-row align-items-sm-start justify-content-sm-between" : "flex-column"} gap-2`}>
            <div>
              <h3
                className="font-display fw-medium text-charcoal leading-tight mb-0"
                style={{ fontSize: viewMode === "grid" ? "clamp(1.05rem,1.6vw,1.3rem)" : "clamp(1.1rem,1.8vw,1.5rem)" }}
              >
                {produto.nome}
              </h3>
              <p className={`mt-2 font-sans fw-light text-mist mb-0 ${viewMode === "grid" ? "line-clamp-2" : "line-clamp-3"}`} style={{ fontSize: viewMode === "grid" ? "0.82rem" : "0.9rem", lineHeight: 1.65 }}>
                {produto.descricaoCurta}
              </p>
            </div>
            {viewMode === "list" && (
              <p className="font-price fw-medium text-charcoal whitespace-nowrap mb-0" style={{ fontSize: "1.4rem" }}>
                R$ {produto.preco.toLocaleString("pt-BR")}
              </p>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="border border-stone-200 bg-stone-50 font-sans text-mist uppercase" style={{ padding: "0.25rem 0.5rem", fontSize: "0.58rem", letterSpacing: "0.18em", opacity: 0.7 }}>
              Entrega cuidada
            </span>
            <span className="font-sans text-charcoal uppercase" style={{ border: "1px solid rgba(201,168,106,0.45)", background: "rgba(201,168,106,0.1)", padding: "0.25rem 0.5rem", fontSize: "0.58rem", letterSpacing: "0.18em", opacity: 0.75 }}>
              Curadoria
            </span>
          </div>

          <div className={`d-flex align-items-center justify-content-between border-top border-stone-100 pt-3 ${viewMode === "list" ? "mt-auto" : ""}`}>
            {viewMode === "grid" && (
              <p className="font-price fw-medium text-charcoal mb-0" style={{ fontSize: "1.15rem" }}>
                R$ {produto.preco.toLocaleString("pt-BR")}
              </p>
            )}
            <div className="d-flex align-items-center gap-4">
              {viewMode === "list" && (
                <button
                  type="button"
                  onClick={handleAddCarrinho}
                  className="border-0 bg-transparent p-0 font-sans uppercase tracking-wide transition-colors-custom"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    color: semEstoque ? "rgb(185,28,28)" : itemNoCarrinho ? "#c9a86a" : "#8a6535",
                    cursor: semEstoque ? "not-allowed" : "pointer",
                    fontWeight: itemNoCarrinho ? 700 : 400
                  }}
                >
                  {semEstoque ? "Esgotado" : itemNoCarrinho ? `Na sacola (${itemNoCarrinho.quantidade})` : "+ Carrinho"}
                </button>
              )}
              <span className="d-inline-flex align-items-center gap-2 font-sans text-mist uppercase tracking-wide transition-colors-custom" style={{ fontSize: "0.6rem", letterSpacing: "0.22em", cursor: "pointer" }}>
                Ver página
                <svg className="stroke-current" width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {contextMenu && (
        <ContextMenuProduto
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={() => onEdit?.(produto)}
          onDelete={() => removerProduto(produto.id)}
        />
      )}
    </div>
  );
});
