import { Link } from "react-router-dom";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="footer-shell text-cream">
      <div className="container">

        {/* Topo: marca + navegação */}
        <div className="row g-4 g-md-5 border-bottom pb-5 mb-5" style={{ borderColor: "rgba(41,37,36,0.4)" }}>
          <div className="col-12 col-md-5">
            <h2 className="font-display fw-light fst-italic text-white mb-4" style={{ fontSize: "1.8rem" }}>
              Luar Móveis
            </h2>
            <p className="font-sans text-stone-400 leading-relaxed" style={{ fontSize: "0.85rem", maxWidth: "24rem" }}>
              Curadoria boutique de móveis para ambientes clássicos, elegantes e atemporais.
              <br /><span className="text-stone-500">Goiânia, Goiás.</span>
            </p>
            <div className="d-flex align-items-center gap-4 mt-4">
              <span className="font-sans text-gold-soft uppercase tracking-widest" style={{ fontSize: "0.62rem", opacity: 0.6 }}>Desde 2013</span>
              <Link to="/produtos" className="d-flex align-items-center gap-3 text-decoration-none transition-colors-custom hover-gold">
                <span className="font-sans text-white uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>Navegar</span>
                <div className="flex-shrink-0" style={{ height: "1px", width: "2rem", background: "#44403c" }} />
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <h3 className="font-sans text-gold-soft uppercase mb-4" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>Menu</h3>
            <nav className="d-flex flex-column gap-3 font-sans text-stone-400 uppercase tracking-wider" style={{ fontSize: "0.75rem" }}>
              <Link to="/produtos" className="text-decoration-none transition-colors-custom hover-gold">Coleção</Link>
              <Link to="/#ambientes" className="text-decoration-none transition-colors-custom hover-gold">Ambientes</Link>
              <Link to="/auth" className="text-decoration-none transition-colors-custom hover-gold">Conta</Link>
            </nav>
          </div>

          <div className="col-12 col-md-4">
            <h3 className="font-sans text-gold-soft uppercase mb-4" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>Contato</h3>
            <div className="d-flex flex-column gap-4">
              <div>
                <p className="font-sans text-white uppercase tracking-wider mb-1" style={{ fontSize: "0.75rem" }}>Goiânia · GO</p>
                <p className="font-sans text-stone-500 uppercase tracking-wide" style={{ fontSize: "0.7rem" }}>Atendimento sob consulta</p>
              </div>
              <a href="mailto:contato@luarmoveis.com.br" className="font-sans text-stone-400 text-decoration-underline transition-colors-custom hover-gold" style={{ fontSize: "0.75rem" }}>
                contato@luarmoveis.com.br
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé inferior: copyright + identificação */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-4">
          <p className="font-sans uppercase tracking-widest text-stone-600 mb-0" style={{ fontSize: "0.6rem" }}>
            © {new Date().getFullYear()} LUAR MÓVEIS · TODOS OS DIREITOS RESERVADOS
          </p>

          {/* Tag obrigatória pelo professor */}
          <address className="font-sans text-stone-600 mb-0" style={{ fontStyle: "normal", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.2em", lineHeight: 2 }}>
            Desenvolvido por: <span className="text-stone-400">João Pedro</span><br />
            Disciplina: Desenvolvimento Web · <span className="text-stone-400">Prof. Fernando</span><br />
            Data: {new Date().toLocaleDateString("pt-BR")}
          </address>
        </div>

      </div>
    </footer>
  );
}
