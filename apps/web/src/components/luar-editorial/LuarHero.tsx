import { useState, useEffect } from "react";
import { motion, useReducedMotion, useMotionValue, useAnimation, useAnimationFrame, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { IMAGES } from "./assets";
import { easeEditorial, staggerChildren, fadeUp } from "./motionPresets";
import { useLoja } from "../../store/LojaContext";
import { EditableSectionField } from "../ui/EditableSectionField";
import { EditableImageField } from "../ui/EditableImageField";

export function LuarHero(): JSX.Element {
  const reduced = useReducedMotion();
  const { produtos, secoesHome, modoEdicao, isAdmin, isLoading } = useLoja();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const heroSection = secoesHome.find(s => s.identificador === 'hero');
  const produtosDestaque = produtos.filter(p => p.destaqueCarrossel);
  const produtosExibir = produtosDestaque.length > 0 ? produtosDestaque : produtos;
  
  // Repetimos a lista várias vezes para garantir que sempre haja itens preenchendo a tela
  const repeats = produtosExibir.length > 0 
    ? Math.max(10, Math.ceil(4000 / (produtosExibir.length * 180))) 
    : 1;
  const strip = produtosExibir.length > 0 ? Array(repeats).fill(produtosExibir).flat() : [];

  // Rotação automática contínua
  useAnimationFrame((t, delta) => {
    if (isDragging) return;
    
    const speed = isHovered ? 0.012 : 0.045;
    const moveBy = delta * speed;
    
    let nextX = x.get() - moveBy;
    
    // Ponto de reset dinâmico: largura de UM conjunto completo de produtos
    // Cada card tem clamp(130px, 11vw, 170px) + gap(16px)
    // Usamos um valor médio aproximado, mas o ideal é que a strip seja longa o suficiente
    const oneSetWidth = produtosExibir.length * 186; 
    
    if (nextX < -oneSetWidth) {
      // Em vez de ir para 0, somamos a largura de um conjunto para ser imperceptível
      nextX += oneSetWidth;
    }
    
    x.set(nextX);
  });

  const conteudo = heroSection?.conteudo || {};

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background Ken Burns (Estático) */}
      <motion.div
        className="absolute inset-0 origin-[60%_40%] z-0 bg-stone-950"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        {!isLoading && (
          <EditableImageField
            secaoIdentificador="hero"
            conteudoKey="imagem_url"
            fallbackSrc={IMAGES.hero}
            className="h-full w-full object-cover object-center"
            showButton={false}
          />
        )}
      </motion.div>

      {/* Camada superior apenas para o botão de edição */}
      {isAdmin && modoEdicao && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <EditableImageField
            secaoIdentificador="hero"
            conteudoKey="imagem_url"
            fallbackSrc={IMAGES.hero}
            onlyButton={true}
            className="w-full h-full"
            buttonStyle={{ 
              bottom: "10px", 
              left: "50%", 
              transform: "translateX(-50%)",
              pointerEvents: "auto"
            }}
          />
        </div>
      )}

      {/* Gradiente cinematográfico ultra-sutil apenas para legibilidade do texto */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        {/* Overlay lateral muito sutil */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-stone-950/30 via-stone-950/5 to-transparent" />
        {/* Sem gradiente inferior para evitar efeito de corte */}
      </div>


      {/* ── Layout principal: conteúdo + carrossel ──────── */}
      <div className="relative z-10 flex h-full flex-col">

        {/* Conteúdo — ocupa o espaço restante, centralizado verticalmente */}
        <div className="flex flex-1 flex-col justify-center pl-10 pr-8 sm:pl-16 md:pl-[12%] md:pr-16 lg:pl-[15%]">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="max-w-[680px]"
          >
            {/* Espaçador equivalente ao Kicker */}
            <div className="h-8" />

            {/* Título */}
            <motion.h1 variants={fadeUp} className="mt-6 leading-none">
              <EditableSectionField
                secaoIdentificador="hero"
                conteudoKey="titulo_linha1"
                fallback="Luar"
                className="block font-display font-light italic text-cream"
                style={{ fontSize: "clamp(4.5rem,11vw,9.5rem)", textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
              />
              <EditableSectionField
                secaoIdentificador="hero"
                conteudoKey="titulo_linha2"
                fallback="Móveis"
                className="block font-display font-medium tracking-[0.06em] text-cream"
                style={{ fontSize: "clamp(3.5rem,9vw,7.5rem)", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
              />
            </motion.h1>

            {/* Separador */}
            <motion.div variants={fadeUp} className="mt-7 flex items-center gap-3">
              <div className="h-px w-12 bg-cream/38" />
              <div className="h-px w-4 bg-cream/18" />
            </motion.div>

            {/* Tagline */}
            <motion.div
              variants={fadeUp}
              className="mt-6 max-w-lg font-serif italic font-light leading-[1.72] text-cream"
              style={{ fontSize: "clamp(1.1rem,1.9vw,1.45rem)" }}
            >
              <EditableSectionField
                secaoIdentificador="hero"
                conteudoKey="tagline"
                fallback="A quiet expression of timeless living."
                as="span"
              />
            </motion.div>

            {/* Descrição */}
            <motion.div
              variants={fadeUp}
              className="mt-4 max-w-[420px] font-sans font-light leading-[1.9] text-cream/90"
              style={{ fontSize: "clamp(0.95rem,1.3vw,1.08rem)" }}
            >
              <EditableSectionField
                secaoIdentificador="hero"
                conteudoKey="descricao"
                fallback="Curadoria boutique de móveis para ambientes clássicos, elegantes e atemporais."
                as="span"
              />
            </motion.div>

            {/* CTAs com Hierarquia Visual */}
            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-8">
              <Link
                to="/produtos"
                className="group relative inline-flex h-[64px] items-center px-12 font-sans text-[0.85rem] font-bold uppercase tracking-[0.35em] text-white transition-all duration-500 hover:text-charcoal"
              >
                {/* Background base */}
                <div className="absolute inset-0 border border-white/30 transition-all duration-500 group-hover:bg-white group-hover:border-white" />
                
                {/* Linha de progresso lateral */}
                <div className="absolute left-0 top-0 h-full w-[2px] bg-gold-soft origin-bottom scale-y-0 transition-transform duration-500 group-hover:scale-y-100" />
                
                <span className="relative z-10 whitespace-nowrap">Explorar coleção</span>
              </Link>

              <a
                href="#ambientes"
                className="group inline-flex items-center gap-3 font-sans text-[0.82rem] font-medium uppercase tracking-[0.26em] text-stone-400 transition-colors hover:text-cream"
              >
                <span className="relative">
                  Ver ambientes
                  <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold-soft transition-all duration-500 group-hover:w-full" />
                </span>
                <svg
                  className="stroke-current transition-transform duration-500 ease-editorial group-hover:translate-x-2"
                  width="18" height="8" viewBox="0 0 18 8" fill="none"
                >
                  <path d="M14 1L17 4L14 7M1 4H17" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>


        {strip.length > 0 && (
          <motion.div
            className="mx-auto mb-4 w-full"
            style={{ overflow: "visible", position: "relative" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeEditorial, delay: 1.4 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Removidos os fades laterais para evitar barras verticais e efeito de corte */}

            {/* Itens deslizantes — Padding maior para não cortar a sombra */}
            <div className="px-6 py-4 pb-20 cursor-grab active:cursor-grabbing" style={{ overflow: "visible" }}>
              <motion.div
                className="flex w-max gap-4"
                style={{ x }}
                drag="x"
                dragConstraints={{ right: 500, left: -4000 }} 
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                whileTap={{ cursor: "grabbing" }}
              >
                {strip.map((p, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.12, zIndex: 50 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative flex-shrink-0"
                    style={{ width: "clamp(130px, 11vw, 170px)", transformOrigin: "bottom center" }}
                  >
                    <Link
                      to={`/produtos/${p.id}`}
                      className="group relative block w-full no-underline transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                      onClick={(e) => {
                        if (e.defaultPrevented) return;
                      }}
                    >
                    {/* Moldura com efeito glass ultra-fino */}
                    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[8px] transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-white/[0.15]">
                      <div className="absolute inset-x-0 top-0 z-10 h-[1.5px] origin-left scale-x-0 bg-gold-soft transition duration-500 group-hover:scale-x-100" />
                      
                      <div className="overflow-hidden rounded-t-xl" style={{ height: "clamp(90px, 8vw, 120px)" }}>
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className="h-full w-full object-cover grayscale-[0.1] transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                      
                      <div className="px-3 py-3 border-t border-white/[0.05] bg-black/10">
                        <p className="truncate font-sans text-[0.6rem] uppercase tracking-[0.1em] text-white/90 leading-tight">
                          {p.nome}
                        </p>
                        <p className="mt-1 font-price text-[0.85rem] font-medium text-gold-soft">
                          R$ {p.preco.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

    </section>
  );
}
