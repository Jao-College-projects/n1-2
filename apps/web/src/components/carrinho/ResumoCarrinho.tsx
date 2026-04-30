import { useNavigate } from "react-router-dom";
import { useLoja } from "../../store/LojaContext";

export function ResumoCarrinho(): JSX.Element {
  const { subtotalCarrinho, totalItensCarrinho, itensCarrinho } = useLoja();
  const navigate = useNavigate();

  if (!itensCarrinho.length) return <></>;

  return (
    <div className="bg-stone-50/80 border border-stone-200/70 p-8">
      <h2 className="font-display text-[1.1rem] text-charcoal mb-6">Resumo do Pedido</h2>

      <div className="mb-6 h-px w-full bg-gradient-to-r from-gold-soft/40 via-gold-soft/20 to-transparent" />

      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-mist/60 mb-0">Itens</p>
          <p className="font-sans text-[0.88rem] text-charcoal mb-0">
            {totalItensCarrinho} {totalItensCarrinho === 1 ? "peça" : "peças"}
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-mist/60 mb-0">Entrega</p>
          <p className="font-sans text-[0.88rem] text-green-700 mb-0">Grátis</p>
        </div>
        <div className="d-flex justify-content-between align-items-end border-t border-stone-100 pt-3">
          <p className="font-sans text-[0.8rem] uppercase tracking-widest text-charcoal font-bold mb-0">Total</p>
          <p className="font-display font-medium text-charcoal mb-0" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)" }}>
            R$ {subtotalCarrinho.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/finalizar")}
        className="group relative overflow-hidden w-full border border-charcoal bg-charcoal px-8 py-4 font-sans text-[0.72rem] font-medium uppercase tracking-[0.3em] text-cream transition-all duration-700 hover:bg-charcoal/88 mt-4"
      >
        <span className="relative z-10">Finalizar compra</span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </button>

      <div className="mt-6 d-flex flex-column gap-2">
        {["Pagamento seguro", "Entrega cuidadosa", "Garantia 2 anos"].map((item) => (
          <div key={item} className="d-flex align-items-center gap-2">
            <div className="h-px w-4 bg-gold-soft/60" />
            <span className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-mist/60">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
