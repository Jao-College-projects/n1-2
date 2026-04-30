import { useCallback, useEffect, useState } from "react";
import { useLoja } from "../../store/LojaContext";
import { EditableText } from "../ui/EditableText";
import type { IDepoimento } from "../../types/IDepoimento";

export function ExperienciasClientes(): JSX.Element {
  const { depoimentos, isAdmin, modoEdicao, removerDepoimento } = useLoja();
  const [aberto, setAberto] = useState<IDepoimento | null>(null);

  const fechar = useCallback(() => setAberto(null), []);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [aberto, fechar]);

  return (
    <section className="dashboard-screen section-experiencias" aria-label="Experiencias de clientes">
      <div className="screen-shell">
        <EditableText chave="secaoExperienciasTitulo" as="h2" className="section-title mb-5 editorial-reveal" />

        <div className="polaroid-mesa">
          <div className="polaroid-mesa-surface" aria-hidden="true" />
          <div className="polaroid-mesa-composicao">
            {depoimentos.map((depoimento, indice) => (
              <div key={depoimento.id} className={`polaroid-wrap polaroid-wrap--slot-${indice % 4}`}>
                <button
                  type="button"
                  className="polaroid-card polaroid-card--interactive"
                  onClick={() => setAberto(depoimento)}
                >
                  {depoimento.imagem ? (
                    <img src={depoimento.imagem} alt="" className="polaroid-photo" loading="lazy" />
                  ) : (
                    <div className="polaroid-photo" style={{ background: '#d6d3d1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '2.5rem', color: '#78716c', fontFamily: 'Georgia, serif' }}>{depoimento.cliente.charAt(0)}</span>
                    </div>
                  )}
                  <div className="polaroid-caption">
                    <p className="mb-2 polaroid-snippet">{depoimento.texto}</p>
                    <p className="mb-0 polaroid-signature">
                      {depoimento.cliente} — {depoimento.cidade}
                    </p>
                    <span className="polaroid-tap-hint">Toque para expandir</span>
                  </div>
                </button>
                {isAdmin && modoEdicao && (
                  <button
                    type="button"
                    className="polaroid-admin-remove"
                    onClick={() => removerDepoimento(depoimento.id)}
                  >
                    Remover depoimento
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {aberto && (
        <div
          className="modal-overlay modal-overlay--experience"
          role="dialog"
          aria-modal="true"
          aria-labelledby="experience-modal-title"
          onClick={fechar}
        >
          <div className="modal-card modal-experience-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={fechar} aria-label="Fechar">
              Fechar
            </button>
            {aberto.imagem ? (
              <img src={aberto.imagem} alt="" className="modal-experience-image" />
            ) : (
              <div className="modal-experience-image" style={{ background: '#d6d3d1', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <span style={{ fontSize: '4rem', color: '#78716c', fontFamily: 'Georgia, serif' }}>{aberto.cliente.charAt(0)}</span>
              </div>
            )}
            <h3 id="experience-modal-title" className="section-title mt-4 mb-2">
              Experiencia — {aberto.cliente}
            </h3>
            <p className="mb-3 modal-experience-quote">"{aberto.texto}"</p>
            <p className="mb-0 polaroid-signature">
              {aberto.cliente} — {aberto.cidade}
            </p>
            {isAdmin && modoEdicao && (
              <button type="button" className="btn-minimal mt-4" onClick={() => removerDepoimento(aberto.id)}>
                Remover depoimento
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
