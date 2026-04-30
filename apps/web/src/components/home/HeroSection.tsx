import { Link } from "react-router-dom";
import { CarouselMoveis } from "./CarouselMoveis";
import { EditableText } from "../ui/EditableText";

export function HeroSection(): JSX.Element {
  return (
    <section className="dashboard-screen hero-screen" aria-label="Apresentacao principal da Luar Moveis">
      <CarouselMoveis modo="background" />
      <div className="screen-shell hero-shell-overlay">
        <div className="hero-grid hero-grid-editorial hero-grid-fullscreen">
          <div className="hero-copy hero-copy-right">
            <p className="hero-kicker hero-kicker-animate">Colecao Inverno 2026</p>
            <EditableText chave="tituloLoja" as="h1" className="hero-title hero-title-xl section-title" />
            <p className="hero-manifesto hero-line-reveal">A quiet expression of timeless living</p>
            <EditableText chave="legendaLoja" as="p" className="hero-subtitle" />
            <p className="hero-editorial-note">
              Cada ambiente e composto como um estudo de materia, luz e proporcao para uma vida
              que permanece.
            </p>
            <div className="hero-cta">
              <Link to="/produtos" className="btn-line">
                Explorar peca
              </Link>
              <Link to="/produtos" className="btn-minimal">
                Ver colecao
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
