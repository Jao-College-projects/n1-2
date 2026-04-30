import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { IMAGES } from "./assets";
import { easeEditorial } from "./motionPresets";
import { useLoja } from "../../store/LojaContext";
import { EditableSectionField } from "../ui/EditableSectionField";
import { EditableImageField } from "../ui/EditableImageField";

export function LuarManifesto(): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.1"] });

  const { secoesHome } = useLoja();
  const manifestoSection = secoesHome.find(s => s.identificador === 'manifesto');
  const conteudo = manifestoSection?.conteudo || {};

  // Removendo linhas hardcoded em favor de usar o EditableSectionField diretamente.

  const yBack = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -40]);
  const yMid = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -20]);
  const yFront = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -58]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream px-6 py-28 sm:px-10 md:py-40 lg:px-16"
    >
      {/* Giant decorative quote mark */}
      <div
        className="pointer-events-none absolute left-4 top-6 select-none font-display font-light leading-none text-parchment/60 sm:left-8 lg:left-12"
        style={{ fontSize: "clamp(10rem,20vw,18rem)" }}
        aria-hidden
      >
        "
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-16 lg:flex-row lg:items-center lg:gap-14 xl:gap-28">

        {/* ── Text side ────────────────────────────────────── */}
        <div className="relative z-10 max-w-xl lg:w-[50%] lg:max-w-none">

          {/* Brand stamp */}
          <motion.div
            className="mb-8 inline-flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...easeEditorial, duration: 0.8 }}
          >
            <div className="h-px w-8 bg-gold-soft/65" />
            <EditableSectionField
              secaoIdentificador="manifesto"
              conteudoKey="kicker"
              fallback="Boutique · Goiânia"
              className="font-display text-[0.95rem] font-light italic tracking-[0.06em] text-gold-soft/80"
            />
          </motion.div>

          {/* Section label */}
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...easeEditorial, duration: 0.9, delay: 0.08 }}
          >
            <EditableSectionField
              secaoIdentificador="manifesto"
              conteudoKey="label"
              fallback="Manifesto"
              className="font-sans text-[0.82rem] uppercase tracking-[0.32em] text-mist"
            />
          </motion.div>

          {/* Main heading — bigger & more dramatic */}
          <motion.h2
            className="font-display font-medium leading-[1.08] tracking-[0.01em] text-charcoal"
            style={{ fontSize: "clamp(2.4rem,5.5vw,4.2rem)" }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={easeEditorial}
          >
            <EditableSectionField
              secaoIdentificador="manifesto"
              conteudoKey="titulo"
              fallback="Criamos móveis como quem compõe<br/><em class='font-light italic'>um espaço de silêncio.</em>"
              as="span"
              isHtml
            />
          </motion.h2>

          {/* Animated gold accent line */}
          <motion.div
            className="mt-10 h-[1.5px] w-20 origin-left bg-gold-soft/60"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...easeEditorial, delay: 0.3 }}
          />

          {/* Paragraphs */}
          <div className="mt-10 space-y-7">
            <motion.div
              className="font-sans font-light leading-[1.95] text-ink/85"
              style={{ fontSize: "clamp(1rem,1.3vw,1.1rem)" }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...easeEditorial, delay: 0.1 }}
            >
              <EditableSectionField
                secaoIdentificador="manifesto"
                conteudoKey="linha1"
                fallback="Cada peça nasce do equilíbrio entre matéria, luz e tempo — um gesto silencioso que acolhe o cotidiano sem apressar o olhar."
                as="p"
              />
            </motion.div>
            <motion.div
              className="font-sans font-light leading-[1.95] text-ink/85"
              style={{ fontSize: "clamp(1rem,1.3vw,1.1rem)" }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...easeEditorial, delay: 0.22 }}
            >
              <EditableSectionField
                secaoIdentificador="manifesto"
                conteudoKey="linha2"
                fallback="Na Luar Móveis, cada peça é apresentada como uma experiência: o toque da madeira, o desenho da costura, a calma de um ambiente que respira."
                as="p"
              />
            </motion.div>
          </div>

          {/* Pull quote */}
          <motion.blockquote
            className="mt-14 border-l-[2px] border-gold-soft/55 pl-6"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...easeEditorial, delay: 0.28 }}
          >
            <EditableSectionField
              secaoIdentificador="manifesto"
              conteudoKey="citacao"
              fallback='"Móveis que envelhecem como a madeira — com graça e sem pressa."'
              as="p"
              className="font-display font-light italic leading-[1.65] text-charcoal/70"
              style={{ fontSize: "clamp(1.05rem,1.5vw,1.3rem)" }}
            />
            <EditableSectionField
              secaoIdentificador="manifesto"
              conteudoKey="autor"
              fallback="— Fundador, Luar Móveis"
              as="p"
              className="mt-3 font-sans text-[0.75rem] uppercase tracking-[0.28em] text-mist/60"
            />
          </motion.blockquote>
        </div>

        {/* ── Visual side — parallax layered images ────────── */}
        <div className="relative mx-auto min-h-[480px] w-full max-w-xl flex-1 lg:mx-0 lg:max-w-none lg:min-h-[600px]">
          {/* Back Image */}
          <motion.div
            style={{ y: yBack, willChange: "transform" }}
            whileHover={{ zIndex: 20, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -right-2 top-4 z-0 h-[50%] w-[56%] overflow-hidden rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-shadow duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] sm:right-0 sm:top-8 sm:w-[50%]"
          >
            <EditableImageField
              secaoIdentificador="manifesto"
              conteudoKey="imagem_back"
              fallbackSrc={IMAGES.manifestoBack}
              className="h-full w-full scale-[1.08] object-cover blur-[1.5px] brightness-[0.88] transition-all duration-700 hover:blur-0 hover:brightness-100"
            />
          </motion.div>

          {/* Mid Image */}
          <motion.div
            style={{ y: yMid, willChange: "transform" }}
            whileHover={{ zIndex: 20, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute left-0 top-[26%] z-[1] h-[44%] w-[48%] overflow-hidden rounded-[3px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] transition-shadow duration-500 hover:shadow-[0_45px_90px_rgba(0,0,0,0.45)] sm:left-4 sm:w-[46%]"
          >
            <EditableImageField
              secaoIdentificador="manifesto"
              conteudoKey="imagem_mid"
              fallbackSrc={IMAGES.manifestoMid}
              className="h-full w-full object-cover brightness-[0.94] transition-all duration-700 hover:brightness-100"
            />
          </motion.div>

          {/* Front Image */}
          <motion.div
            style={{ y: yFront, willChange: "transform" }}
            whileHover={{ zIndex: 20, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-2 right-0 z-[2] h-[48%] w-[60%] overflow-hidden rounded-[4px] shadow-[0_30px_70px_rgba(0,0,0,0.3)] transition-shadow duration-500 hover:shadow-[0_50px_100px_rgba(0,0,0,0.5)] sm:bottom-6 sm:right-4 sm:w-[58%]"
          >
            <EditableImageField
              secaoIdentificador="manifesto"
              conteudoKey="imagem_front"
              fallbackSrc={IMAGES.manifestoFront}
              className="h-full w-full object-cover transition-all duration-700"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
