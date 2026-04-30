import { ITextosSite } from "../../types/IProduto";
import { useLoja } from "../../store/LojaContext";

interface EditableTextProps {
  chave: keyof ITextosSite;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
}

export function EditableText({ chave, as = "p", className }: EditableTextProps): JSX.Element {
  const { textosSite, isAdmin, modoEdicao, atualizarTextoSite } = useLoja();
  const Tag = as;

  if (isAdmin && modoEdicao) {
    return (
      <textarea
        className={`editable-field ${className ?? ""}`}
        value={textosSite[chave]}
        onChange={(evento) => atualizarTextoSite(chave, evento.target.value)}
        rows={as === "p" ? 3 : 2}
      />
    );
  }

  return <Tag className={className}>{textosSite[chave]}</Tag>;
}
