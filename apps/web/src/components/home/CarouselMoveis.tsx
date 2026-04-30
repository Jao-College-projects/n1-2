import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLoja } from "../../store/LojaContext";

const AUTO_MS = 5000;

interface CarouselMoveisProps {
  modo?: "card" | "background";
}

export const CarouselMoveis = memo(function CarouselMoveis({ modo = "card" }: CarouselMoveisProps): JSX.Element {
  const { produtos } = useLoja();
  const [indiceAtual, setIndiceAtual] = useState<number>(0);

  useEffect(() => {
    if (!produtos.length) return;
    const t = window.setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % produtos.length);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [produtos.length]);

  if (!produtos.length) {
    return <p>Sem moveis em destaque.</p>;
  }

  const produtoAtual = produtos[indiceAtual];
  const indiceExibicao = String(indiceAtual + 1).padStart(2, "0");
  const totalExibicao = String(produtos.length).padStart(2, "0");
  return (
    <div
      className={`showcase-carousel ${modo === "background" ? "showcase-carousel--background" : ""}`}
      aria-label="Destaque principal de moveis"
    >
      <div className="showcase-frame">
        <Link
          to={`/produtos/${produtoAtual.id}`}
          className="showcase-product-link"
          key={produtoAtual.id}
        >
          <div className="showcase-image-wrap">
            <img
              src={produtoAtual.imagem}
              alt={produtoAtual.nome}
              className="showcase-image"
              loading="eager"
            />
            <span className="showcase-click-hint">Ver a peca</span>
          </div>
        </Link>
        <div className="showcase-caption">
          <div className="showcase-meta-row">
            <p className="showcase-kicker mb-0">{produtoAtual.categoria}</p>
            <span className="showcase-index">
              {indiceExibicao} / {totalExibicao}
            </span>
          </div>
          <h3 className="section-title mb-1">{produtoAtual.nome}</h3>
          <p className="mb-1">{produtoAtual.descricaoCurta}</p>
          <p className="mb-0">R$ {produtoAtual.preco.toLocaleString("pt-BR")}</p>
        </div>
      </div>
    </div>
  );
});
