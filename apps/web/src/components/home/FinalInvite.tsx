import { Link } from "react-router-dom";

export function FinalInvite(): JSX.Element {
  return (
    <section className="dashboard-screen section-final-invite" aria-label="Convite final da experiencia">
      <div className="screen-shell">
        <div className="editorial-invite editorial-invite--animated editorial-reveal">
          <p className="hero-kicker">Convite</p>
          <h2 className="section-title mb-3">Descubra pecas que permanecem.</h2>
          <Link to="/produtos" className="btn-minimal btn-minimal-glow">
            Explorar colecao completa
          </Link>
        </div>
      </div>
    </section>
  );
}
