import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoja } from "../../store/LojaContext";
import { easeEditorial } from "./motionPresets";
import type { IDepoimento } from "../../types/IDepoimento";
import { EditableSectionField } from "../ui/EditableSectionField";
import { EditableDepoimentoField } from "../ui/EditableDepoimentoField";
import { EditableDepoimentoImageField } from "../ui/EditableDepoimentoImageField";

export function LuarExperiencias(): JSX.Element {
  const { depoimentos, isAdmin, modoEdicao, removerDepoimento } = useLoja();
  const [ativo, setAtivo] = useState(0);
  const [modal, setModal] = useState<IDepoimento | null>(null);

  const fechar = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal, fechar]);

  /* auto-avança a cada 6s */
  useEffect(() => {
    if (depoimentos.length < 2) return;
    const id = setInterval(() => {
      setAtivo((prev) => (prev + 1) % depoimentos.length);
    }, 6000);
    return () => clearInterval(id);
  }, [depoimentos.length]);

  const dep = depoimentos[ativo];

  if (!dep) return <></>;

  return (
    <>
      <section
        className="relative overflow-hidden bg-cream px-6 py-28 sm:px-10 md:py-40 lg:px-16"
        aria-label="Experiências de clientes"
      >
        {/* Faint background number */}
        <div
          className="pointer-events-none absolute right-4 top-6 select-none font-display font-light leading-none text-parchment/60 lg:right-10"
          style={{ fontSize: "clamp(8rem,18vw,14rem)" }}
          aria-hidden
        >
          03
        </div>

        <div className="mx-auto max-w-[1440px]">
          {/* ── Header ─────────────────────────────────────── */}
          <motion.div
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={easeEditorial}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-gold-soft/60" />
              <EditableSectionField
                secaoIdentificador="experiencias"
                conteudoKey="kicker"
                fallback="Experiências"
                as="span"
                className="font-sans text-[0.72rem] uppercase tracking-[0.32em] text-mist"
              />
            </div>
            <h2
              className="font-display font-medium leading-[1.08] text-charcoal"
              style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}
            >
              <EditableSectionField
                secaoIdentificador="experiencias"
                conteudoKey="titulo_linha1"
                fallback="O que nossos clientes"
                as="span"
              />
              <br />
              <EditableSectionField
                secaoIdentificador="experiencias"
                conteudoKey="titulo_linha2"
                fallback="dizem sobre nós"
                as="em"
                className="font-light italic text-ink/70"
              />
            </h2>
          </motion.div>

          {/* ── Layout split: foto grande + quote destaque ── */}
          <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-16 xl:gap-24">

            {/* Foto em destaque — animada por active */}
            <div className="relative w-full overflow-hidden lg:w-[44%] lg:flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={dep.id}
                  className="relative h-[min(70vh,600px)] w-full overflow-hidden lg:h-full lg:min-h-[520px]"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <EditableDepoimentoImageField
                    depoimento={dep}
                    fallbackSrc=""
                    alt={dep.cliente}
                    className="h-full w-full object-cover"
                  />
                  {/* Gradient bottom */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent" />
                  {/* Nome sobre a foto */}
                  <div className="absolute bottom-6 left-6 w-[80%] pr-4">
                    <EditableDepoimentoField
                      depoimentoId={dep.id}
                      campo="cliente"
                      as="p"
                      className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-cream/90"
                    />
                    <EditableDepoimentoField
                      depoimentoId={dep.id}
                      campo="cidade"
                      as="p"
                      className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-gold-soft/80 mt-1"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Lado direito: quote grande + navegação + lista */}
            <div className="flex flex-1 flex-col justify-between">

              {/* Quote em destaque */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={dep.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1"
                >
                  {/* Aspas decorativas grandes */}
                  <span
                    className="select-none font-display font-light leading-none text-gold-soft/25"
                    style={{ fontSize: "5rem", lineHeight: 0.85 }}
                    aria-hidden
                  >
                    "
                  </span>

                  {/* Quote text — grande e legível */}
                  <EditableDepoimentoField
                    depoimentoId={dep.id}
                    campo="texto"
                    as="blockquote"
                    className="mt-3 font-serif italic leading-[1.65] text-charcoal/88 w-full"
                    style={{ fontSize: "clamp(1.2rem,2.2vw,1.65rem)" }}
                  />

                  {/* Linha dourada + assinatura */}
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-px w-10 bg-gold-soft/55" />
                    <div className="w-full">
                      <EditableDepoimentoField
                        depoimentoId={dep.id}
                        campo="cliente"
                        as="p"
                        className="font-sans text-[0.82rem] font-medium uppercase tracking-[0.2em] text-charcoal/80"
                      />
                      <EditableDepoimentoField
                        depoimentoId={dep.id}
                        campo="cidade"
                        as="p"
                        className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mist/70 mt-1"
                      />
                    </div>
                  </div>

                  {/* Botão expandir */}
                  <button
                    type="button"
                    onClick={() => setModal(dep)}
                    className="group mt-8 inline-flex items-center gap-2 border-b border-gold-soft/40 pb-0.5 font-sans text-[0.7rem] uppercase tracking-[0.26em] text-mist/70 transition-all duration-400 hover:border-gold-soft hover:text-charcoal"
                  >
                    Ler completo
                    <svg className="stroke-current transition-transform duration-400 group-hover:translate-x-1" width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* ── Navegação por dots + miniaturas ────────── */}
              <div className="mt-14 flex flex-col gap-6">
                {/* Barra de progresso */}
                <div className="h-px w-full bg-stone-200/60">
                  <motion.div
                    className="h-full bg-gold-soft"
                    key={ativo}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                </div>

                {/* Lista de clientes — clicáveis */}
                <div className="flex flex-col gap-0 divide-y divide-stone-200/50">
                  {depoimentos.map((d, i) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setAtivo(i)}
                      className={`group flex items-center justify-between py-4 text-left transition-colors duration-300 ${
                        i === ativo ? "text-charcoal" : "text-mist/55 hover:text-charcoal/70"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Dot ativo */}
                        <div
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-400 ${
                            i === ativo ? "bg-gold-soft scale-125" : "bg-stone-300 group-hover:bg-stone-400"
                          }`}
                        />
                        <span className="font-sans text-[0.78rem] font-medium uppercase tracking-[0.18em]">
                          {d.cliente}
                        </span>
                      </div>
                      <span className="font-sans text-[0.68rem] uppercase tracking-[0.15em] text-mist/45">
                        {d.cidade}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Admin */}
                {isAdmin && modoEdicao && (
                  <button
                    type="button"
                    className="self-start font-sans text-[0.62rem] uppercase tracking-[0.18em] text-stone-400 underline transition hover:text-charcoal"
                    onClick={() => removerDepoimento(dep.id)}
                  >
                    Remover este depoimento
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/80 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exp-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={fechar}
          >
            <motion.div
              className="relative w-full max-w-2xl overflow-hidden bg-cream shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-5 top-5 z-10 border border-stone-300/60 bg-cream/95 px-3 py-1.5 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-mist transition hover:text-charcoal"
                onClick={fechar}
                aria-label="Fechar"
              >
                Fechar
              </button>

              <EditableDepoimentoImageField
                depoimento={modal}
                fallbackSrc=""
                className="h-56 w-full object-cover sm:h-72"
              />

              <div className="p-8 sm:p-12">
                <span
                  className="select-none font-display font-light leading-none text-gold-soft/28"
                  style={{ fontSize: "4rem", lineHeight: 0.8 }}
                  aria-hidden
                >
                  "
                </span>
                <p
                  id="exp-modal-title"
                  className="mt-3 font-serif italic leading-[1.72] text-charcoal/85"
                  style={{ fontSize: "clamp(1.1rem,2vw,1.35rem)" }}
                >
                  {modal.texto}
                </p>
                <div className="mt-7 flex items-center gap-3">
                  <div className="h-px w-8 bg-gold-soft/45" />
                  <p className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.22em] text-charcoal/70">
                    {modal.cliente} · {modal.cidade}
                  </p>
                </div>
                {isAdmin && modoEdicao && (
                  <button
                    type="button"
                    className="mt-8 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-mist underline transition hover:text-charcoal"
                    onClick={() => { removerDepoimento(modal.id); fechar(); }}
                  >
                    Remover depoimento
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
