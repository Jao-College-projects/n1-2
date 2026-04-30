import { useLoja } from "../../store/LojaContext";
import React from "react";
import { IDepoimento } from "../../types/IDepoimento";

interface EditableDepoimentoFieldProps {
  depoimentoId: number;
  campo: keyof Omit<IDepoimento, "id">;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div" | "blockquote";
  className?: string;
  style?: React.CSSProperties;
}

export function EditableDepoimentoField({
  depoimentoId,
  campo,
  as = "span",
  className,
  style
}: EditableDepoimentoFieldProps): JSX.Element {
  const { depoimentos, isAdmin, modoEdicao, atualizarDepoimento } = useLoja();
  const depoimento = depoimentos.find(d => d.id === depoimentoId);
  const valorAtual = depoimento ? depoimento[campo] : "";
  const Tag = as as any;

  if (isAdmin && modoEdicao && depoimento) {
    return (
      <textarea
        className={`bg-white/90 text-stone-900 border border-gold-soft outline-none p-2 rounded shadow-md ${className ?? ""}`}
        value={String(valorAtual)}
        onChange={(evento) => {
          atualizarDepoimento({
            ...depoimento,
            [campo]: evento.target.value
          });
        }}
        rows={as === "p" || as === "blockquote" || as === "div" ? 3 : 1}
        style={{ width: "100%", ...style }}
      />
    );
  }

  return <Tag className={className} style={style}>{valorAtual}</Tag>;
}
