import { useLoja } from "../../store/LojaContext";
import React from "react";

// Função para buscar valor aninhado
function getDeepValue(obj: any, path: string | (string | number)[], fallback: any) {
  if (typeof path === "string") return obj[path] !== undefined ? obj[path] : fallback;
  let curr = obj;
  for (const p of path) {
    if (curr == null) return fallback;
    curr = curr[p];
  }
  return curr !== undefined ? curr : fallback;
}

// Função para setar valor aninhado criando novos objetos/arrays (imutabilidade)
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

interface EditableSectionFieldProps {
  secaoIdentificador: string;
  conteudoKey: string | (string | number)[];
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div" | "em";
  className?: string;
  style?: React.CSSProperties;
  fallback?: string;
  isHtml?: boolean;
}

export function EditableSectionField({
  secaoIdentificador,
  conteudoKey,
  as = "span",
  className,
  style,
  fallback = "",
  isHtml = false
}: EditableSectionFieldProps): JSX.Element {
  const { secoesHome, isAdmin, modoEdicao, atualizarSecaoHome } = useLoja();
  const secao = secoesHome.find(s => s.identificador === secaoIdentificador);
  
  let valorAtual = secao ? getDeepValue(secao.conteudo, conteudoKey, fallback) : fallback;
  if (typeof valorAtual !== "string") {
    valorAtual = String(valorAtual || "");
  }
  const Tag = as as any;

  if (isAdmin && modoEdicao) {
    const isMultiline = as === "p" || as === "div";
    const commonClasses = `bg-white/95 text-stone-900 border-2 border-gold-soft outline-none p-1.5 rounded shadow-lg transition-all focus:ring-2 focus:ring-gold-soft/20 ${className ?? ""}`;
    const commonStyles: React.CSSProperties = { 
      minWidth: "120px", 
      width: "auto", 
      maxWidth: "100%",
      fontSize: "inherit",
      ...style 
    };

    if (isMultiline) {
      return (
        <textarea
          className={commonClasses}
          value={valorAtual}
          onChange={(evento) => {
            const currentConteudo = secao ? secao.conteudo : {};
            const newConteudo = setDeepValue(currentConteudo, conteudoKey, evento.target.value);
            atualizarSecaoHome(secaoIdentificador, {
              identificador: secaoIdentificador,
              tituloSecao: secao?.tituloSecao || secaoIdentificador,
              ativo: true,
              ordem: secao?.ordem || 99,
              conteudo: newConteudo
            });
          }}
          rows={3}
          style={{ ...commonStyles, width: "100%" }}
        />
      );
    }

    return (
      <input
        type="text"
        className={commonClasses}
        value={valorAtual}
        onChange={(evento) => {
          const currentConteudo = secao ? secao.conteudo : {};
          const newConteudo = setDeepValue(currentConteudo, conteudoKey, evento.target.value);
          atualizarSecaoHome(secaoIdentificador, {
            identificador: secaoIdentificador,
            tituloSecao: secao?.tituloSecao || secaoIdentificador,
            ativo: true,
            ordem: secao?.ordem || 99,
            conteudo: newConteudo
          });
        }}
        style={commonStyles}
      />
    );
  }

  if (isHtml) {
    return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: valorAtual }} />;
  }

  return <Tag className={className} style={style}>{valorAtual}</Tag>;
}
