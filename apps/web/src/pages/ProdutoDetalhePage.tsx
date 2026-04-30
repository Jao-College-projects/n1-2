import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useLoja } from "../store/LojaContext";
import { EditableSectionField } from "../components/ui/EditableSectionField";

const ease = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] };

export function ProdutoDetalhePage(): JSX.Element {
  const { id } = useParams();
  const { produtos, adicionarAoCarrinho } = useLoja();
  const produto = produtos.find((item) => item.id === Number(id));

  if (!produto) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-[2rem] font-light text-charcoal">Peça não encontrada.</p>
        <Link to="/produtos" className="mt-6 font-sans text-[0.72rem] uppercase tracking-[0.28em] text-mist underline hover:text-charcoal">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 xl:gap-24 max-w-[1200px]">
      {/* Imagem */}
      <motion.div
        className="group relative overflow-hidden"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={ease}
      >
        {/* Categoria pill */}
        <div className="absolute left-5 top-5 z-10">
          <span className="bg-cream/90 px-3 py-1.5 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-charcoal/80 backdrop-blur-sm">
            {produto.categoria}
          </span>
        </div>
        <div className="overflow-hidden">
          <img
            src={produto.imagem}
            alt={produto.nome}
            className="w-full aspect-[4/5] object-cover transition duration-[1200ms] ease-editorial group-hover:scale-[1.03]"
          />
        </div>
      </motion.div>

      {/* Info */}
      <motion.div
        className="flex flex-col justify-center"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...ease, delay: 0.1 }}
      >
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-mist/60">
          <Link to="/produtos" className="hover:text-charcoal transition">Coleção</Link>
          <span>/</span>
          <span>{produto.categoria}</span>
        </div>

        {/* Nome */}
        <h1
          className="font-display font-medium leading-[1.08] text-charcoal"
          style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}
        >
          {produto.nome}
        </h1>

        {/* Linha dourada */}
        <div className="mt-6 h-px w-14 bg-gold-soft/60" />

        {/* Descrição longa */}
        <p className="mt-7 font-sans text-[0.95rem] font-light leading-[1.88] text-mist">
          {produto.descricaoLonga}
        </p>

        {/* Estoque */}
        <p className="mt-5 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mist/55">
          {produto.estoque > 0 ? `${produto.estoque} unidades disponíveis` : "Indisponível"}
        </p>

        {/* Preço */}
        <div className="mt-8 border-t border-stone-200/60 pt-7">
          <p className="font-price text-[2.2rem] font-medium text-charcoal">
            R$ {produto.preco.toLocaleString("pt-BR")}
          </p>
          <p className="mt-1 font-sans text-[0.72rem] text-mist/55">
            Em até 12x sem juros
          </p>
        </div>

        {/* Ação */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="group relative flex-1 inline-flex min-h-[52px] items-center justify-center overflow-hidden border border-charcoal bg-charcoal px-8 font-sans text-[0.72rem] font-medium uppercase tracking-[0.26em] text-cream transition-all duration-700 hover:bg-charcoal/88"
            onClick={() => adicionarAoCarrinho(produto.id)}
          >
            <span className="relative z-10">Adicionar ao carrinho</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
          <Link
            to="/carrinho"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center border border-stone-300 px-8 font-sans text-[0.72rem] font-medium uppercase tracking-[0.26em] text-mist transition hover:border-charcoal hover:text-charcoal"
          >
            Ver carrinho
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap gap-5 border-t border-stone-100 pt-8">
          {[
            { key: "badge_1", fallback: "Frete grátis GO" },
            { key: "badge_2", fallback: "Entrega cuidadosa" },
            { key: "badge_3", fallback: "Garantia 2 anos" }
          ].map((b) => (
            <div key={b.key} className="flex items-center gap-2">
              <div className="h-px w-4 bg-gold-soft/50" />
              <EditableSectionField
                secaoIdentificador="produto_detalhe_global"
                conteudoKey={b.key}
                fallback={b.fallback}
                className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-mist/65"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
