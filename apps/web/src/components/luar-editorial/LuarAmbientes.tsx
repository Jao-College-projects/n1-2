import { motion } from "framer-motion";
import { IMAGES } from "./assets";
import { easeEditorial } from "./motionPresets";
import { useLoja } from "../../store/LojaContext";
import { EditableSectionField } from "../ui/EditableSectionField";
import { EditableImageField } from "../ui/EditableImageField";

const ambientesFallback = [
  {
    num: "01",
    title: "Sala",
    subtitle: "Estar",
    image: IMAGES.sala,
    hint: "Conversas demoradas e luz lateral que aquece sem pressa.",
  },
  {
    num: "02",
    title: "Jantar",
    subtitle: "Mesa",
    image: IMAGES.jantar,
    hint: "Rituais à mesa, no tempo certo e no lugar certo.",
  },
  {
    num: "03",
    title: "Quarto",
    subtitle: "Descanso",
    image: IMAGES.quarto,
    hint: "Descanso elevado a experiência de luxo essencial.",
  },
];

const shadow = "0 2px 14px rgba(0,0,0,0.88), 0 1px 4px rgba(0,0,0,0.7)";
const shadowMid = "0 1px 8px rgba(0,0,0,0.75)";

export function LuarAmbientes(): JSX.Element {
  const { secoesHome } = useLoja();
  const atmosferaSecao = secoesHome.find(s => s.identificador === 'atmosfera');
  const conteudo = atmosferaSecao?.conteudo || {};

  const listaAmbientes = conteudo.ambientes && conteudo.ambientes.length > 0 ? conteudo.ambientes : ambientesFallback;

  return (
    <section id="ambientes" className="bg-parchment/25 py-20 md:py-28">

      {/* ── Cabeçalho ──────────────────────────────────── */}
      <div className="mx-auto mb-12 max-w-[1600px] px-6 sm:px-10 lg:px-16 md:mb-16">
        <motion.div
          className="flex items-end justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={easeEditorial}
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-gold-soft/60" />
              <p className="font-sans text-[0.82rem] uppercase tracking-[0.30em] text-mist">
                Atmosfera
              </p>
            </div>
            <EditableSectionField
              secaoIdentificador="atmosfera"
              conteudoKey="titulo"
              fallback="Ambientes que<br/><em class='font-light italic'>definem o espaço</em>"
              as="h2"
              className="font-display font-medium leading-[1.08] text-charcoal"
              style={{ fontSize: "clamp(1.9rem,4vw,3rem)" }}
              isHtml
            />
          </div>
          <p className="hidden font-sans text-[0.78rem] uppercase tracking-[0.24em] text-mist/60 md:block">
            Passe o mouse para explorar
          </p>
        </motion.div>
      </div>

      {/* ── Grade horizontal 3 colunas ─────────────────── */}
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {listaAmbientes.map((amb: any, i: number) => {
            const fallbackImg = ambientesFallback[i]?.image || IMAGES.sala;
            return (
              <motion.article
                key={amb.title || i}
                className="group relative cursor-pointer overflow-hidden"
                style={{ height: "clamp(420px, 72vh, 720px)" }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...easeEditorial, delay: i * 0.1 }}
              >
                {/* Imagem */}
                <div className="absolute inset-0 overflow-hidden">
                  <EditableImageField
                    secaoIdentificador="atmosfera"
                    conteudoKey={["ambientes", i, "image"]}
                    fallbackSrc={fallbackImg}
                    alt={amb.title}
                    className="h-full w-full scale-100 object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>

                {/* Gradiente base — sempre visível */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" />
                {/* Escurecimento no hover */}
                <div className="pointer-events-none absolute inset-0 bg-stone-950/0 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-stone-950/30" />

                {/* Número faint — topo direito */}
                <div className="absolute right-5 top-5" aria-hidden>
                  <EditableSectionField
                    secaoIdentificador="atmosfera"
                    conteudoKey={["ambientes", i, "num"]}
                    fallback={amb.num}
                    as="span"
                    className="select-none font-display font-light leading-none text-cream/12 transition duration-700 group-hover:text-cream/20"
                    style={{ fontSize: "clamp(3.5rem,6vw,5rem)" }}
                  />
                </div>

                {/* Conteúdo inferior — sempre visível */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 md:p-8">
                  <EditableSectionField
                    secaoIdentificador="atmosfera"
                    conteudoKey={["ambientes", i, "subtitle"]}
                    fallback={amb.subtitle}
                    as="p"
                    className="font-sans text-[0.8rem] font-medium uppercase tracking-[0.28em] text-gold-soft"
                    style={{ textShadow: shadowMid }}
                  />
                  <EditableSectionField
                    secaoIdentificador="atmosfera"
                    conteudoKey={["ambientes", i, "title"]}
                    fallback={amb.title}
                    as="h3"
                    className="mt-1.5 font-display font-medium leading-none text-cream"
                    style={{
                      fontSize: "clamp(2.2rem,4.5vw,3.8rem)",
                      textShadow: shadow,
                    }}
                  />

                  {/* Reveal no hover */}
                  <div className="mt-4 translate-y-4 opacity-0 transition duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    <EditableSectionField
                      secaoIdentificador="atmosfera"
                      conteudoKey={["ambientes", i, "hint"]}
                      fallback={amb.hint}
                      as="p"
                      className="max-w-[260px] font-sans text-[0.9rem] font-light leading-[1.72] text-stone-200/90"
                      style={{ textShadow: shadowMid }}
                    />
                    <div className="mt-5 inline-flex items-center gap-2.5 border-b border-gold-soft/50 pb-0.5">
                      <span className="font-sans text-[0.75rem] uppercase tracking-[0.24em] text-gold-soft">
                        Explorar
                      </span>
                      <svg className="stroke-gold-soft" width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Linha topo que cresce no hover */}
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gold-soft/60 transition duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  );
}
