import { Link } from "react-router-dom";
import { useLoja } from "../../store/LojaContext";

export function EditorialLayers(): JSX.Element {
  const { produtos } = useLoja();
  const curadoria = produtos.slice(0, 3);
  const ambientes = [
    {
      id: "ambiente-sala",
      nome: "Sala de convivencia",
      descricao: "Volumes macios, luz lateral e materiais naturais para encontros longos.",
      imagem:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80"
    },
    {
      id: "ambiente-quarto",
      nome: "Quarto essencial",
      descricao: "Um ritmo silencioso entre texturas, sombras e conforto permanente.",
      imagem:
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=80"
    },
    {
      id: "ambiente-escritorio",
      nome: "Escritorio autoral",
      descricao: "Linhas limpas e presenca equilibrada para concentracao e clareza.",
      imagem:
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1400&q=80"
    }
  ];

  return (
    <section className="dashboard-screen section-editorial" aria-label="Camadas editoriais da home">
      <div className="screen-shell editorial-flow">
        <header className="section-intro section-intro-wide editorial-reveal">
          <p className="hero-kicker">Curadoria Luar</p>
          <h2 className="section-title mb-3">Pecas que definem o espaco.</h2>
          <p className="mb-0">
            Uma selecao da casa para leitura de forma, proporcao e atmosfera em escala real.
          </p>
        </header>

        <div className="curadoria-grid">
          {curadoria.map((produto, i) => (
            <article
              key={produto.id}
              className={`curadoria-card curadoria-card--lift editorial-reveal editorial-reveal--delay-${Math.min(i + 1, 4)}`}
            >
              <Link to={`/produtos/${produto.id}`} className="curadoria-link">
                <div className="curadoria-image-wrap">
                  <img src={produto.imagem} alt={produto.nome} className="curadoria-image" loading="lazy" />
                  <span className="curadoria-shine" />
                </div>
                <div className="curadoria-caption">
                  <h3 className="section-title mb-2">{produto.nome}</h3>
                  <p className="mb-2">{produto.descricaoCurta}</p>
                  <p className="curadoria-ver-peca mb-0">Ver a peca</p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <header className="section-intro section-intro-wide editorial-reveal">
          <p className="hero-kicker">Ambientes</p>
          <h2 className="section-title mb-3">Composicoes reais para viver o design.</h2>
          <p className="mb-0">
            Mais que produto isolado: cenarios completos para conectar materia e sensacao.
          </p>
        </header>

        <div className="ambientes-stack">
          {ambientes.map((ambiente, i) => (
            <article
              key={ambiente.id}
              className={`ambiente-card ambiente-card--motion editorial-reveal editorial-reveal--delay-${Math.min(i + 1, 4)}`}
            >
              <div className="ambiente-image-wrap">
                <img src={ambiente.imagem} alt="" className="ambiente-image" loading="lazy" />
                <span className="ambiente-parallax-shade" />
              </div>
              <div className="ambiente-caption">
                <h3 className="section-title mb-2">{ambiente.nome}</h3>
                <p className="mb-0">{ambiente.descricao}</p>
              </div>
            </article>
          ))}
        </div>

        <header className="section-intro section-intro-wide editorial-reveal">
          <p className="hero-kicker">Catalogo</p>
          <h2 className="section-title mb-3">Uma colecao continua de formas, materiais e presenca.</h2>
          <p className="mb-0">
            Explore a galeria completa com leitura detalhada de cada peca e sua aplicacao no ambiente.
          </p>
          <div className="hero-cta mt-4">
            <Link to="/produtos" className="btn-line btn-line-pulse">
              Explorar colecao
            </Link>
          </div>
        </header>
      </div>
    </section>
  );
}
