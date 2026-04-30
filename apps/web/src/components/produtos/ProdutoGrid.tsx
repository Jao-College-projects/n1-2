import { IProduto } from "../../types/IProduto";
import { ProdutoCard } from "./ProdutoCard";

interface ProdutoGridProps {
  produtos: IProduto[];
  onEdit?: (produto: IProduto) => void;
  viewMode?: "grid" | "list";
}

export function ProdutoGrid({ produtos, onEdit, viewMode = "grid" }: ProdutoGridProps): JSX.Element {
  if (!produtos.length) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <div className="mb-3" style={{ height: "1px", width: "3rem", background: "rgba(201,168,106,0.55)" }} />
        <p className="font-display fw-light text-mist" style={{ fontSize: "1.4rem" }}>Nenhum produto encontrado.</p>
        <p className="mt-2 font-sans text-mist" style={{ fontSize: "0.85rem", opacity: 0.6 }}>Ajuste os filtros para ver mais opções.</p>
      </div>
    );
  }

  return (
    <section aria-label="Catálogo de produtos">
      {viewMode === "grid" ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
          {produtos.map((produto) => (
            <div className="col" key={produto.id}>
              <ProdutoCard produto={produto} onEdit={onEdit} viewMode={viewMode} />
            </div>
          ))}
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onEdit={onEdit} viewMode={viewMode} />
          ))}
        </div>
      )}
      <p className="mt-4 font-sans text-mist uppercase tracking-widest text-end" style={{ fontSize: "0.72rem", opacity: 0.5 }}>
        {produtos.length} {produtos.length === 1 ? "peça" : "peças"}
      </p>
    </section>
  );
}
