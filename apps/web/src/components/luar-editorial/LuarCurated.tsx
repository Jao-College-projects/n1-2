import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IMAGES } from "./assets";
import { easeEditorial } from "./motionPresets";
import { useLoja } from "../../store/LojaContext";
import { EditableSectionField } from "../ui/EditableSectionField";
import { EditableImageField } from "../ui/EditableImageField";

const piecesFallback = [
  {
    name: "Sofá Aurora",
    verse: "Linhas baixas, abraço amplo — o lugar onde a tarde se demora.",
    image: IMAGES.piece1,
    num: "I",
  },
  {
    name: "Poltrona Eira",
    verse: "Um único gesto de madeira sustenta o descanso.",
    image: IMAGES.piece2,
    num: "II",
  },
  {
    name: "Mesa Lume",
    verse: "Madeira escura e um plano sereno para reunir.",
    image: IMAGES.piece3,
    num: "III",
  },
  {
    name: "Estante Horizonte",
    verse: "Prateleiras como horas — silenciosas, ordenadas, profundas.",
    image: IMAGES.piece4,
    num: "IV",
  },
];

function PieceBlock({
  name = "",
  verse = "",
  image = "",
  num = "",
  className = "",
  sizesClass = "",
  pieceIndex = 0,
  onRemove,
}: {
  name?: string;
  verse?: string;
  image?: string;
  num?: string;
  className?: string;
  sizesClass?: string;
  pieceIndex?: number;
  onRemove?: (index: number) => void;
}): JSX.Element {
  // Fallbacks locais caso algo passe como nulo
  const safeName = name || "Peça Luar";
  const safeVerse = verse || "Design atemporal.";
  const safeImage = image || "";
  const safeNum = num || "I";

  return (
    <motion.figure
      className={`group relative overflow-hidden bg-stone-100 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...easeEditorial, duration: 0.9 }}
    >
      <div className={`relative w-full overflow-hidden ${sizesClass || "min-h-[280px]"}`}>
        {safeImage && (
          <EditableImageField
            secaoIdentificador="curadoria"
            conteudoKey={["pieces", pieceIndex, "image"]}
            fallbackSrc={safeImage}
            alt={safeName}
            className="h-full w-full object-cover transition duration-[1500ms] ease-out group-hover:scale-110 group-hover:rotate-1"
            buttonPosition="top-right"
          />
        )}

        {/* Cinematic Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-stone-950/20 mix-blend-multiply opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-40 transition-opacity duration-700 group-hover:opacity-90" />

        {/* Piece Number (Roman) */}
        <div className="absolute right-6 top-6 z-10 overflow-hidden" aria-hidden>
          <EditableSectionField
            secaoIdentificador="curadoria"
            conteudoKey={["pieces", pieceIndex, "num"]}
            fallback={safeNum}
            as="span"
            className="block select-none font-display text-[2.5rem] font-light leading-none text-white/10 transition-transform duration-1000 group-hover:-translate-y-2 group-hover:text-gold-soft/30"
          />
        </div>

        {/* Content Overlay */}
        <figcaption className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
          {/* Decorative bar */}
          <div className="mb-4 h-px w-0 bg-gold-soft transition-all duration-700 group-hover:w-16" />
          
          <div className="translate-y-6 transition-transform duration-700 ease-out group-hover:translate-y-0">
            <EditableSectionField
              secaoIdentificador="curadoria"
              conteudoKey={["pieces", pieceIndex, "name"]}
              fallback={safeName}
              as="h3"
              className="font-display text-[1.8rem] font-medium leading-tight text-white md:text-[2.2rem]"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            />
            
            <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-700 group-hover:max-h-32 group-hover:opacity-100">
              <EditableSectionField
                secaoIdentificador="curadoria"
                conteudoKey={["pieces", pieceIndex, "verse"]}
                fallback={safeVerse}
                as="p"
                className="max-w-[320px] font-sans text-[0.95rem] font-light leading-relaxed text-stone-200/90"
              />
              
              <Link
                to="/produtos"
                className="mt-6 inline-flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.3em] text-gold-soft transition-colors hover:text-white"
              >
                Explorar Obra
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </figcaption>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(pieceIndex);
            }}
            className="absolute left-4 top-4 z-[70] flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
            title="Remover Peça"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        )}
      </div>
    </motion.figure>
  );
}

export function LuarCurated(): JSX.Element {
  const { secoesHome, isAdmin, modoEdicao, atualizarSecaoHome } = useLoja();
  const curadoriaSecao = secoesHome?.find(s => s.identificador === 'curadoria');
  const conteudo = curadoriaSecao?.conteudo || {};

  const rawPieces = Array.isArray(conteudo.pieces) ? conteudo.pieces : piecesFallback;
  
  const getPiece = (index: number) => {
    try {
      const p = (rawPieces[index] || {}) as { name?: string; verse?: string; image?: string; num?: string };
      const d = ((piecesFallback && piecesFallback[index]) ? piecesFallback[index] : (piecesFallback ? piecesFallback[0] : {})) as { name?: string; verse?: string; image?: string; num?: string };
      
      const safeStr = (val: any, fallback: string) => {
        if (typeof val === 'string') return val;
        if (val === null || val === undefined) return fallback;
        return String(val);
      };
      
      const pieceData = {
        name: safeStr(p.name, d.name || ""),
        verse: safeStr(p.verse, d.verse || ""),
        image: safeStr(p.image, d.image || ""),
        num: safeStr(p.num, d.num || "")
      };
      return pieceData;
    } catch (err) {
      return { name: "Peça", verse: "", image: "", num: "I" };
    }
  };

  const p0 = getPiece(0);
  const p1 = getPiece(1);
  const p2 = getPiece(2);
  const p3 = getPiece(3);
  const extras = rawPieces.length > 4 ? rawPieces.slice(4) : [];

  const handleAdicionarPeca = () => {
    const novaPeca = {
      name: "Nova Peça",
      verse: "Descrição da nova obra selecionada.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800",
      num: (rawPieces.length + 1).toString()
    };
    
    const newPieces = [...rawPieces, novaPeca];
    atualizarSecaoHome('curadoria', {
      ...curadoriaSecao!,
      conteudo: { ...conteudo, pieces: newPieces }
    });
  };

  const handleRemoverPeca = (index: number) => {
    const newPieces = rawPieces.filter((_: unknown, i: number) => i !== index);
    atualizarSecaoHome('curadoria', {
      ...curadoriaSecao!,
      conteudo: { ...conteudo, pieces: newPieces }
    });
  };

  return (
    <section id="curadoria" className="bg-cream px-6 py-28 sm:px-10 md:py-48 lg:px-16">
      <div className="mx-auto max-w-[1500px]">

        {/* ── Editorial Header ─────────────────────────────── */}
        <div className="relative mb-20 flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between lg:mb-28">
          <motion.div
            className="relative z-10 max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={easeEditorial}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-gold-soft/50" />
              <EditableSectionField
                secaoIdentificador="curadoria"
                conteudoKey="kicker"
                fallback="Boutique · Goiânia"
                className="font-display text-[1rem] font-light italic tracking-widest text-gold-soft/80"
              />
            </div>

            <EditableSectionField
              secaoIdentificador="curadoria"
              conteudoKey="label"
              fallback="Curadoria"
              className="mb-8 block font-sans text-[0.8rem] uppercase tracking-[0.4em] text-mist/60"
            />

            <h2
              className="font-display font-medium leading-[1.05] text-charcoal"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              <EditableSectionField
                secaoIdentificador="curadoria"
                conteudoKey="titulo_linha1"
                fallback="Essência capturada"
                as="span"
              />
              <br />
              <EditableSectionField
                secaoIdentificador="curadoria"
                conteudoKey="titulo_linha2"
                fallback="em cada detalhe."
                as="em"
                className="font-light italic text-stone-500"
              />
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...easeEditorial, delay: 0.3 }}
          >
            <Link
              to="/produtos"
              className="group flex flex-col items-end gap-2 text-right transition-all"
            >
              <span className="font-sans text-[0.7rem] uppercase tracking-[0.4em] text-mist group-hover:text-gold-soft">Descubra a coleção</span>
              <div className="flex items-center gap-4">
                <span className="font-display text-[1.1rem] italic text-charcoal">Ver todas as peças</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 transition-all group-hover:scale-110 group-hover:border-gold-soft group-hover:bg-gold-soft group-hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ── Dynamic Layout ────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main vertical piece */}
          <div className="lg:col-span-7">
            <PieceBlock
              {...p0}
              pieceIndex={0}
              sizesClass="aspect-[4/5] lg:aspect-auto lg:h-[820px]"
              onRemove={isAdmin && modoEdicao ? handleRemoverPeca : undefined}
            />
          </div>
 
          {/* Secondary stack */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <PieceBlock 
              {...p1} 
              pieceIndex={1} 
              sizesClass="aspect-square lg:aspect-auto lg:h-[397px]" 
              onRemove={isAdmin && modoEdicao ? handleRemoverPeca : undefined}
            />
            <PieceBlock 
              {...p2} 
              pieceIndex={2} 
              sizesClass="aspect-square lg:aspect-auto lg:h-[397px]" 
              onRemove={isAdmin && modoEdicao ? handleRemoverPeca : undefined}
            />
          </div>
 
          {/* Wide final piece */}
          <div className="lg:col-span-12">
            <PieceBlock
              {...p3}
              pieceIndex={3}
              sizesClass="aspect-[16/7] lg:h-[480px]"
              onRemove={isAdmin && modoEdicao ? handleRemoverPeca : undefined}
            />
          </div>
 
          {/* Extra pieces in a grid */}
          {extras.map((piece: { name?: string; verse?: string; image?: string; num?: string }, idx: number) => (
            <div key={idx + 4} className="lg:col-span-4">
              <PieceBlock
                {...piece}
                pieceIndex={idx + 4}
                sizesClass="aspect-square lg:h-[400px]"
                onRemove={isAdmin && modoEdicao ? handleRemoverPeca : undefined}
              />
            </div>
          ))}

          {/* ADD BUTTON */}
          {isAdmin && modoEdicao && (
            <div className="lg:col-span-4 flex items-center justify-center border-2 border-dashed border-stone-300 rounded-xl min-h-[400px] hover:border-gold-soft transition-colors group">
              <button
                onClick={handleAdicionarPeca}
                className="flex flex-col items-center gap-4 text-stone-400 group-hover:text-gold-soft transition-colors"
              >
                <div className="h-16 w-16 rounded-full border-2 border-stone-300 flex items-center justify-center group-hover:border-gold-soft transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] font-medium">Adicionar Peça à Curadoria</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
