import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLoja } from "../../store/LojaContext";
import { easeEditorial } from "./motionPresets";

export function LuarProductStrip(): JSX.Element {
  const { produtos } = useLoja();

  if (!produtos.length) return <></>;

  /* Repete para loop sem fim */
  const strip = [...produtos, ...produtos, ...produtos, ...produtos, ...produtos];

  return (
    <section className="overflow-hidden bg-white border-y border-stone-200/70">
      {/* ── Barra de topo ─────────────────────────────────── */}
      <motion.div
        className="flex items-center justify-between border-b border-stone-100 px-8 py-3 sm:px-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={easeEditorial}
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-6 bg-gold-soft/60" />
          <p className="font-sans text-[0.75rem] uppercase tracking-[0.32em] text-mist/70">
            Produtos em destaque
          </p>
        </div>

        {/* Brand stamp */}
        <div className="hidden items-center gap-3 md:flex">
          <p className="font-display text-[0.88rem] font-light italic tracking-wide text-charcoal/40">
            Boutique · Goiânia
          </p>
          <div className="h-px w-8 bg-gold-soft/40" />
        </div>

        <Link
          to="/produtos"
          className="flex items-center gap-2 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mist hover:text-charcoal transition"
        >
          Ver todos
          <svg className="stroke-current" width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </motion.div>

      {/* ── Faixa deslizante ──────────────────────────────── */}
      <div className="overflow-hidden">
        <div
          className="flex w-max"
          style={{ animation: "marquee 30s linear infinite", willChange: "transform", transform: "translateZ(0)" }}
        >
          {strip.map((p, i) => (
            <Link
              key={i}
              to={`/produtos/${p.id}`}
              tabIndex={-1}
              className="group relative flex-shrink-0 border-r border-stone-100"
              style={{ width: "clamp(160px, 14vw, 220px)" }}
            >
              {/* Linha dourada topo no hover */}
              <div className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-gold-soft/70 transition duration-500 group-hover:scale-x-100" />

              {/* Imagem */}
              <div className="overflow-hidden" style={{ height: "clamp(130px, 11vw, 175px)" }}>
                <img
                  src={p.imagem}
                  alt={p.nome}
                  className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="px-4 py-3">
                <p className="truncate font-sans text-[0.7rem] uppercase tracking-[0.16em] text-charcoal/65 leading-tight">
                  {p.nome}
                </p>
                <p className="mt-1 font-display text-[0.95rem] font-medium text-gold-soft">
                  R$ {p.preco.toLocaleString("pt-BR")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
