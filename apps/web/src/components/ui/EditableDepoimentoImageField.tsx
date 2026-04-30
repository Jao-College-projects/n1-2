import { useLoja } from "../../store/LojaContext";
import React, { useRef, useState } from "react";
import { uploadFile } from "../../utils/uploadFile";
import type { IDepoimento } from "../../types/IDepoimento";

interface EditableDepoimentoImageFieldProps {
  depoimento: IDepoimento;
  fallbackSrc: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
  buttonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function EditableDepoimentoImageField({
  depoimento,
  fallbackSrc,
  className,
  alt = "",
  style,
  buttonPosition = "top-left"
}: EditableDepoimentoImageFieldProps): JSX.Element {
  const { isAdmin, modoEdicao, atualizarDepoimento } = useLoja();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [carregando, setCarregando] = useState(false);
  
  const urlAtual = depoimento.imagem || fallbackSrc;

  const placeholderStyle: React.CSSProperties = {
    background: '#d6d3d1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleFileChange = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    try {
      setCarregando(true);
      const urlPublica = await uploadFile(arquivo);
      
      await atualizarDepoimento({
        ...depoimento,
        imagem: urlPublica
      });
    } catch (erro) {
      console.error(erro);
      alert("Falha no upload da imagem do depoimento.");
    } finally {
      setCarregando(false);
    }
  };

  const getPositionClasses = () => {
    switch (buttonPosition) {
      case "top-right": return "top-10 right-10";
      case "bottom-left": return "bottom-10 left-10";
      case "bottom-right": return "bottom-10 right-10";
      case "top-left":
      default: return "top-10 left-10";
    }
  };

  if (isAdmin && modoEdicao) {
    return (
      <div className={`relative group pointer-events-none ${className ?? ""}`} style={style}>
        {urlAtual ? (
          <img src={urlAtual} alt={alt} className={`w-full h-full object-cover transition-opacity ${carregando ? 'opacity-50' : ''}`} />
        ) : (
          <div className="w-full h-full" style={{ ...placeholderStyle, opacity: carregando ? 0.5 : 1 }}>
            <span style={{ fontSize: '3rem', color: '#78716c', fontFamily: 'Georgia, serif' }}>
              {depoimento.cliente?.charAt(0) ?? '?'}
            </span>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Botão flutuante para trocar imagem */}
        <div className={`absolute z-[60] pointer-events-auto ${getPositionClasses()}`}>
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

        {/* Overlay sutil ao passar o mouse */}
        <div 
          className="absolute inset-0 bg-gold-soft/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-gold-soft/30" 
        />
      </div>
    );
  }

  if (!urlAtual) {
    return (
      <div className={className} style={{ ...style, ...placeholderStyle }}>
        <span style={{ fontSize: '3rem', color: '#78716c', fontFamily: 'Georgia, serif' }}>
          {depoimento.cliente?.charAt(0) ?? '?'}
        </span>
      </div>
    );
  }

  return <img src={urlAtual} alt={alt} className={className} style={style} />;
}
