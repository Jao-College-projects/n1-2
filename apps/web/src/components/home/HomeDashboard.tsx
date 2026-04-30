import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLoja } from "../../store/LojaContext";
import { EditableText } from "../ui/EditableText";
import type { IProduto } from "../../types/IProduto";

const ROTACAO_CENTRO_MS = 4200;

type Slot = "top" | "mid" | "bot";

function montarSlots(vitrine: IProduto[], centroIdx: number): Array<{ produto: IProduto; slot: Slot; desfocado: boolean }> {
  const n = vitrine.length;
  if (n === 0) return [];
  if (n === 1) {
    return [{ produto: vitrine[0], slot: "mid", desfocado: false }];
  }
  if (n === 2) {
    const i = centroIdx % 2;
    const outro = vitrine[1 - i];
    const centro = vitrine[i];
    return [
      { produto: outro, slot: "top", desfocado: true },
      { produto: centro, slot: "mid", desfocado: false }
    ];
  }
  const centro = vitrine[centroIdx % n];
  const outros = vitrine.filter((_, idx) => idx !== centroIdx % n);
  const top = outros[0];
  const bot = outros[1];
  return [
    { produto: top, slot: "top", desfocado: true },
    { produto: centro, slot: "mid", desfocado: false },
    { produto: bot, slot: "bot", desfocado: true }
  ];
}

export function HomeDashboard(): JSX.Element {
  const { produtos, totalItensCarrinho } = useLoja();
  const produtosEmDestaque = produtos.slice(0, 2).length;
  const vitrine = produtos.slice(0, 3);
  const [centroIdx, setCentroIdx] = useState(0);

  useEffect(() => {
    if (vitrine.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setCentroIdx((c) => (c + 1) % vitrine.length);
    }, ROTACAO_CENTRO_MS);
    return () => window.clearInterval(t);
  }, [vitrine.length]);

  const slots = montarSlots(vitrine, centroIdx);

  return (
    <section className="dashboard-screen section-manifesto" aria-label="Manifesto e contexto institucional da marca">
      <div className="screen-shell">
        <div className="manifesto-shell manifesto-shell-animated">
          <div className="narrow-text manifesto-text-block">
            <p className="hero-kicker">Manifesto</p>
            <h2 className="section-title mb-3">Criamos moveis como quem compoe um espaco de silencio.</h2>
            <p className="mb-4">
              Cada peca nasce do equilibrio entre materia, luz e tempo, para que o ambiente nao apenas
              seja visto, mas vivido em profundidade.
            </p>
            <EditableText chave="secaoApresentacaoTexto" as="p" className="mb-5" />
            <EditableText chave="secaoProdutosTitulo" as="h2" className="section-title mb-3" />
            <EditableText chave="secaoProdutosTexto" as="p" className="mb-0" />
          </div>

          <div className="manifesto-spread-wrap" aria-hidden="true">
            <div className="manifesto-spread">
              {slots.map(({ produto, slot, desfocado }) => (
                <Link
                  key={produto.id}
                  to={`/produtos/${produto.id}`}
                  className={`manifesto-spread-card manifesto-spread-card--${slot}${
                    desfocado ? " manifesto-spread-card--desfocado" : ""
                  }`}
                >
                  <img src={produto.imagem} alt="" className="manifesto-spread-img" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>

          <div className="metrics-cloud metrics-cloud-animated" aria-label="Indicadores da casa">
            <article className="metric-block metric-block--pop" style={{ animationDelay: "0.05s" }}>
              <span className="metric-value">+12 anos</span>
              <p className="metric-label mb-0">de producao artesanal</p>
            </article>
            <article className="metric-block metric-block--pop" style={{ animationDelay: "0.15s" }}>
              <span className="metric-value">+3.000 pecas</span>
              <p className="metric-label mb-0">entregues em projetos autorais</p>
            </article>
            <article className="metric-block metric-block--pop" style={{ animationDelay: "0.25s" }}>
              <span className="metric-value">{produtos.length}</span>
              <p className="metric-label mb-0">modelos em curadoria permanente</p>
            </article>
            <article className="metric-block metric-block--pop" style={{ animationDelay: "0.35s" }}>
              <span className="metric-value">{totalItensCarrinho}</span>
              <p className="metric-label mb-0">itens sendo avaliados por clientes</p>
            </article>
            <article className="metric-block metric-block--pop" style={{ animationDelay: "0.45s" }}>
              <span className="metric-value">{produtosEmDestaque}</span>
              <p className="metric-label mb-0">pecas em destaque editorial neste ciclo</p>
            </article>
          </div>
        </div>
        <div className="gold-line mt-5 gold-line-shimmer" />
      </div>
    </section>
  );
}
