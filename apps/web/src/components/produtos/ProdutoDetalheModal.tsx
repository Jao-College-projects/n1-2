import { useLoja } from "../../store/LojaContext";

export function ProdutoDetalheModal(): JSX.Element | null {
  const { produtoSelecionado, fecharDetalhesProduto, adicionarAoCarrinho } = useLoja();

  if (!produtoSelecionado) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={fecharDetalhesProduto}>
      <section
        className="modal-card"
        onClick={(evento) => evento.stopPropagation()}
        aria-label="Detalhes do movel"
      >
        <h2 className="section-title h3">{produtoSelecionado.nome}</h2>
        <p className="mb-3">{produtoSelecionado.categoria}</p>
        <p className="mb-3">{produtoSelecionado.descricaoLonga}</p>
        <p className="product-price mb-4">
          R$ {produtoSelecionado.preco.toLocaleString("pt-BR")}
        </p>
        <div className="product-actions">
          <button className="btn-minimal" onClick={() => adicionarAoCarrinho(produtoSelecionado.id)}>
            Adicionar ao carrinho
          </button>
          <button className="btn-line" onClick={fecharDetalhesProduto}>
            Fechar
          </button>
        </div>
      </section>
    </div>
  );
}
