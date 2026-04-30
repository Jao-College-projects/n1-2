import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiltroProdutos } from "../components/produtos/FiltroProdutos";
import { ProdutoGrid } from "../components/produtos/ProdutoGrid";
import { ModalNovoProduto } from "../components/produtos/ModalNovoProduto";
import { useLoja } from "../store/LojaContext";
import { IProduto } from "../types/IProduto";
import { DashboardStats } from "../components/produtos/DashboardStats";
import { EditableSectionField } from "../components/ui/EditableSectionField";

const easeEd = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

export function ProdutosPage(): JSX.Element {
  const { produtos, isAdmin, totalItensCarrinho } = useLoja();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<IProduto | null>(null);

  const handleOpenNovo = () => {
    setProdutoParaEditar(null);
    setIsModalOpen(true);
  };

  const handleOpenEditar = (produto: IProduto) => {
    setProdutoParaEditar(produto);
    setIsModalOpen(true);
  };

  // Local state for filters
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroPreco, setFiltroPreco] = useState<string | null>(null);
  const [filtroEstoque, setFiltroEstoque] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Derive filtered products
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(produto => {
      // 1. Categoria
      if (filtroCategoria && produto.categoria !== filtroCategoria) {
        return false;
      }

      // 2. Preço
      if (filtroPreco) {
        if (filtroPreco === "Até R$ 2.000" && produto.preco > 2000) return false;
        if (filtroPreco === "R$ 2.000 – 5.000" && (produto.preco < 2000 || produto.preco > 5000)) return false;
        if (filtroPreco === "R$ 5.000 – 10.000" && (produto.preco < 5000 || produto.preco > 10000)) return false;
        if (filtroPreco === "Acima de R$ 10.000" && produto.preco <= 10000) return false;
      }

      // 3. Estoque
      if (filtroEstoque && produto.estoque <= 0) {
        return false;
      }

      return true;
    });
  }, [produtos, filtroCategoria, filtroPreco, filtroEstoque]);

  // OPT-8: Derived stats memoized to avoid 3 full iterations on every render
  const { categoriasUnicas, ticketMedio, totalEstoque } = useMemo(() => ({
    categoriasUnicas: new Set(produtosFiltrados.map(p => p.categoria)).size,
    ticketMedio: produtosFiltrados.length
      ? produtosFiltrados.reduce((soma, p) => soma + p.preco, 0) / produtosFiltrados.length
      : 0,
    totalEstoque: produtosFiltrados.reduce((soma, p) => soma + p.estoque, 0),
  }), [produtosFiltrados]);

  return (
    <div className="relative min-h-screen pb-20 container-fluid px-4 sm:px-6 lg:px-8">
      {/* ── Botão Adicionar (Admin) ────────────────────── */}
      {isAdmin && (
        <button
          onClick={handleOpenNovo}
          className="fixed bottom-10 right-10 z-[100] h-16 w-16 bg-charcoal text-gold-soft rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
          title="Adicionar Novo Produto"
        >
          <svg 
            width="28" height="28" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="group-hover:rotate-90 transition-transform duration-300"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}

      {/* ── Modal Produto ─────────────────────────────── */}
      <ModalNovoProduto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        produtoParaEditar={produtoParaEditar}
      />

      {/* ── Cabeçalho editorial ─────────────────────────── */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-2xl">
          <div className="h-6" />
          <h1
            className="font-display font-medium leading-[1.1] text-charcoal"
            style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)" }}
          >
            <EditableSectionField
              secaoIdentificador="produtos"
              conteudoKey="titulo"
              fallback="Catálogo de Móveis"
            />
          </h1>
        </div>
      </motion.div>

      {/* ── Dashboard de Contadores (Obrigatório) ─────────── */}
      <DashboardStats
        totalPecas={produtosFiltrados.length}
        totalCategorias={categoriasUnicas}
        ticketMedio={ticketMedio}
        totalEstoque={totalEstoque}
        itensSacola={totalItensCarrinho}
      />

      {/* ── Conteúdo Principal Assimétrico (Bootstrap Grid) ─ */}
      <main className="row g-5">
        {/* Lado Esquerdo: Filtros (Asymmetric - 3/12 colunas) */}
        <aside className="col-12 col-lg-3">
          <div className="sticky-top" style={{ top: '7rem' }}>
            <FiltroProdutos
              produtos={produtos}
              filtroCategoria={filtroCategoria}
              setFiltroCategoria={setFiltroCategoria}
              filtroPreco={filtroPreco}
              setFiltroPreco={setFiltroPreco}
              filtroEstoque={filtroEstoque}
              setFiltroEstoque={setFiltroEstoque}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>
        </aside>

        {/* Lado Direito: Listagem (Asymmetric - 9/12 colunas) */}
        <section className="col-12 col-lg-9">
          <div className="w-full">
            <ProdutoGrid 
              produtos={produtosFiltrados} 
              onEdit={handleOpenEditar}
              viewMode={viewMode}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
