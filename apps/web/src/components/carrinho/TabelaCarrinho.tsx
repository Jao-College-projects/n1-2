import { useMemo } from "react";
import { useLoja } from "../../store/LojaContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function TabelaCarrinho(): JSX.Element {
  const { itensCarrinho, produtos, adicionarAoCarrinho, removerDoCarrinho } = useLoja();

  const produtosMap = useMemo(() => new Map(produtos.map(p => [p.id, p])), [produtos]);

  if (!itensCarrinho.length) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <div className="mb-4" style={{ height: "1px", width: "3rem", background: "rgba(201,168,106,0.5)" }} />
        <p className="font-display fw-light text-charcoal" style={{ fontSize: "1.8rem", opacity: 0.5 }}>Seu carrinho está vazio.</p>
        <p className="mt-3 font-sans text-mist" style={{ fontSize: "0.85rem" }}>Explore nossa coleção e encontre a peça ideal.</p>
        <Link
          to="/produtos"
          className="mt-4 d-inline-flex align-items-center gap-2 text-decoration-none font-sans text-mist uppercase tracking-widest transition-colors-custom hover-gold"
          style={{ fontSize: "0.7rem", borderBottom: "1px solid rgba(201,168,106,0.5)", paddingBottom: "2px" }}
        >
          Ver coleção
          <svg className="stroke-current" width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <section aria-label="Itens do carrinho">
      {/* Cabeçalho da listagem */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <p className="font-sans text-mist uppercase tracking-widest mb-0" style={{ fontSize: "0.65rem", opacity: 0.6 }}>
          {itensCarrinho.length} {itensCarrinho.length === 1 ? "peça selecionada" : "peças selecionadas"}
        </p>
        <Link
          to="/produtos"
          className="d-inline-flex align-items-center gap-2 text-decoration-none font-sans text-mist uppercase tracking-widest transition-colors-custom hover-gold"
          style={{ fontSize: "0.65rem" }}
        >
          <svg className="stroke-current" style={{ transform: "rotate(180deg)" }} width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Continuar comprando
        </Link>
      </div>

      {/* Grid de cards — Bootstrap row/col */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {itensCarrinho.map((item, i) => {
          const produto = produtosMap.get(item.produtoId);
          if (!produto) return null;

          return (
            <div className="col" key={item.produtoId}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                className="position-relative d-flex flex-column border border-stone-200 bg-white h-100"
                style={{ boxShadow: "0 2px 12px -4px rgba(28,25,23,0.08)" }}
              >
                {/* Linha topo dourada no hover */}
                <div
                  className="position-absolute top-0 start-0 end-0 transition-smooth"
                  style={{ height: "2px", background: "rgba(201,168,106,0.7)", transform: "scaleX(0)", transformOrigin: "left" }}
                />

                {/* Imagem */}
                <div className="overflow-hidden bg-stone-100 aspect-4-3" style={{ position: "relative" }}>
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="produto-card-img"
                    loading="lazy"
                  />
                </div>

                {/* Conteúdo */}
                <div className="d-flex flex-column flex-grow-1 p-4">
                  <p className="font-sans text-mist uppercase tracking-widest mb-1" style={{ fontSize: "0.6rem", opacity: 0.7 }}>
                    {produto.categoria}
                  </p>
                  <h3 className="font-display fw-medium text-charcoal leading-tight mt-1" style={{ fontSize: "clamp(1rem,1.4vw,1.15rem)" }}>
                    {produto.nome}
                  </h3>

                  <div className="mt-3" style={{ height: "1px", background: "#f5f5f4" }} />

                  <p className="mt-3 font-sans text-mist mb-0" style={{ fontSize: "0.72rem", opacity: 0.6 }}>
                    R$ {produto.preco.toLocaleString("pt-BR")} / un.
                  </p>

                  {/* Controles quantidade + subtotal */}
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-3">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="d-flex align-items-center justify-content-center border border-stone-200 text-charcoal transition-smooth"
                        style={{ width: "1.75rem", height: "1.75rem", fontSize: "0.8rem", background: "transparent" }}
                        onClick={() => removerDoCarrinho(produto.id)}
                        aria-label="Diminuir quantidade"
                      >−</button>
                      <span className="font-sans fw-medium text-charcoal" style={{ width: "1.25rem", textAlign: "center", fontSize: "0.85rem" }}>
                        {item.quantidade}
                      </span>
                      <button
                        type="button"
                        className="d-flex align-items-center justify-content-center border border-stone-200 text-charcoal transition-smooth"
                        style={{ width: "1.75rem", height: "1.75rem", fontSize: "0.8rem", background: "transparent" }}
                        onClick={() => adicionarAoCarrinho(produto.id)}
                        aria-label="Aumentar quantidade"
                      >+</button>
                    </div>
                    <p className="font-display fw-medium text-charcoal mb-0" style={{ fontSize: "1.1rem" }}>
                      R$ {(produto.preco * item.quantidade).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </motion.article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
