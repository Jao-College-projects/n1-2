import { useLoja } from "../../store/LojaContext";
import React, { useRef, useState } from "react";
import { uploadFile } from "../../utils/uploadFile";

// Helpers para aninhamento (mesmos do EditableSectionField)
function getDeepValue(obj: any, path: string | (string | number)[], fallback: any) {
  if (typeof path === "string") return obj[path] !== undefined ? obj[path] : fallback;
  let curr = obj;
  for (const p of path) {
    if (curr == null) return fallback;
    curr = curr[p];
  }
  return curr !== undefined ? curr : fallback;
}

function setDeepValue(obj: any, path: string | (string | number)[], value: any): any {
  if (typeof path === "string") return { ...obj, [path]: value };
  if (path.length === 0) return value;
  
  const p = path[0];
  if (path.length === 1) {
    if (Array.isArray(obj)) {
      const newArr = [...obj];
      newArr[p as number] = value;
      return newArr;
    }
    return { ...obj, [p]: value };
  }
  
  if (Array.isArray(obj)) {
    const newArr = [...obj];
    newArr[p as number] = setDeepValue(obj[p as number] || {}, path.slice(1), value);
    return newArr;
  }
  return { ...obj, [p]: setDeepValue(obj[p] || {}, path.slice(1), value) };
}

interface EditableImageFieldProps {
  secaoIdentificador: string;
  conteudoKey: string | (string | number)[];
  fallbackSrc: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
  buttonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  buttonStyle?: React.CSSProperties;
  onlyButton?: boolean;
  showButton?: boolean;
}

export function EditableImageField({
  secaoIdentificador,
  conteudoKey,
  fallbackSrc,
  className,
  alt = "",
  style,
  buttonPosition = "top-left",
  buttonStyle,
  onlyButton = false,
  showButton = true
}: EditableImageFieldProps): JSX.Element {
  const { secoesHome, isAdmin, modoEdicao, atualizarSecaoHome } = useLoja();
  // useRef to avoid re-reading window.location on every render
  const isPaginaAdmin = useRef(window.location.pathname.includes("/admin")).current;
  const exibirControles = isAdmin && (modoEdicao || isPaginaAdmin);
  
  const secao = secoesHome.find(s => s.identificador === secaoIdentificador);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [carregando, setCarregando] = useState(false);
  
  const urlAtual = secao ? getDeepValue(secao.conteudo, conteudoKey, fallbackSrc) : fallbackSrc;

  const handleFileChange = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    try {
      setCarregando(true);
      const urlPublica = await uploadFile(arquivo);
      
      const currentConteudo = secao ? secao.conteudo : {};
      const newConteudo = setDeepValue(currentConteudo, conteudoKey, urlPublica);
      
      await atualizarSecaoHome(secaoIdentificador, {
        identificador: secaoIdentificador,
        tituloSecao: secao?.tituloSecao || secaoIdentificador,
        ativo: true,
        ordem: secao?.ordem || 99,
        conteudo: newConteudo
      });
    } catch (erro) {
      console.error(erro);
      alert("Falha no upload da imagem. Certifique-se de que o bucket 'loja' existe no Supabase.");
    } finally {
      setCarregando(false);
    }
  };

  const getPositionClasses = () => {
    if (buttonStyle) return ""; // Prioriza o style inline se fornecido
    switch (buttonPosition) {
      case "top-right": return "top-10 right-10";
      case "bottom-left": return "bottom-10 left-10";
      case "bottom-right": return "bottom-10 right-10";
      case "top-left":
      default: return "top-10 left-10";
    }
  };

  if (exibirControles) {
    return (
      <div className={`relative group ${className ?? ""}`} style={style}>
        {!onlyButton && (
          <img src={urlAtual || fallbackSrc} alt={alt} loading="lazy" className={`w-full h-full object-cover transition-opacity ${carregando ? 'opacity-50' : ''}`} />
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Botão flutuante para trocar imagem */}
        {showButton && (
          <div 
            className={`absolute z-[60] pointer-events-auto ${getPositionClasses()}`}
            style={buttonStyle}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-2 bg-stone-900/90 text-white px-3 py-1.5 rounded-full text-[0.65rem] font-sans uppercase tracking-widest backdrop-blur-sm border border-gold-soft/50 hover:bg-gold-soft hover:text-stone-900 transition-all shadow-lg"
              title="Trocar Imagem"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Trocar</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Overlay sutil ao passar o mouse */}
        {!onlyButton && (
          <div 
            className="absolute inset-0 bg-gold-soft/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-gold-soft/30" 
          />
        )}
      </div>
    );
  }

  if (onlyButton) return <></>;

  return <img src={urlAtual || fallbackSrc} alt={alt} loading="lazy" className={className} style={style} />;
}
