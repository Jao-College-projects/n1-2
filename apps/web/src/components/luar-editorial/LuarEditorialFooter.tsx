import { Link } from "react-router-dom";

const year = new Date().getFullYear();

export function LuarEditorialFooter(): JSX.Element {
  return (
    <footer className="bg-charcoal px-6 pb-10 pt-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Gold top shimmer line */}
        <div className="mb-16 h-px w-full bg-gradient-to-r from-transparent via-gold-soft/38 to-transparent" />

        {/* Main columns */}
        <div className="grid grid-cols-1 gap-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <p className="font-display text-[1.85rem] font-light italic tracking-[0.02em] text-cream/88">
              Luar Móveis
            </p>
            <p className="mt-5 max-w-[280px] font-sans text-[0.84rem] font-light leading-[1.82] text-stone-400/65">
              Curadoria boutique de móveis para ambientes clássicos, elegantes e atemporais.
              Goiânia, Brasil.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-8 bg-gold-soft/38" />
              <span className="font-sans text-[0.55rem] uppercase tracking-[0.38em] text-stone-500/55">
                Desde 2013
              </span>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <p className="mb-7 font-sans text-[0.55rem] uppercase tracking-[0.32em] text-stone-500/55">
              Navegar
            </p>
            <nav className="flex flex-col gap-3.5">
              {[
                { type: "link" as const, to: "/produtos", label: "Coleção" },
                { type: "anchor" as const, href: "#ambientes", label: "Ambientes" },
                { type: "link" as const, to: "/login", label: "Conta" },
              ].map((item) =>
                item.type === "link" ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group inline-flex items-center gap-0 font-sans text-[0.8rem] font-light text-stone-400/55 transition-colors duration-300 hover:text-cream/82"
                  >
                    <span className="mr-0 inline-block h-px w-0 bg-gold-soft/55 transition-all duration-300 group-hover:mr-3 group-hover:w-4" />
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group inline-flex items-center gap-0 font-sans text-[0.8rem] font-light text-stone-400/55 transition-colors duration-300 hover:text-cream/82"
                  >
                    <span className="mr-0 inline-block h-px w-0 bg-gold-soft/55 transition-all duration-300 group-hover:mr-3 group-hover:w-4" />
                    {item.label}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* Contact column */}
          <div>
            <p className="mb-7 font-sans text-[0.55rem] uppercase tracking-[0.32em] text-stone-500/55">
              Contato
            </p>
            <div className="flex flex-col gap-3">
              <p className="font-sans text-[0.8rem] font-light leading-[1.75] text-stone-400/52">
                Goiânia · GO
                <br />
                Atendimento sob consulta
              </p>
              <a
                href="mailto:contato@luarmoveis.com.br"
                className="font-sans text-[0.75rem] font-light text-gold-soft/55 transition-colors duration-300 hover:text-gold-soft/90"
              >
                contato@luarmoveis.com.br
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-800/55 pt-8 md:flex-row">
          <p className="font-sans text-[0.58rem] uppercase tracking-[0.22em] text-stone-600/45">
            © {year} Luar Móveis · Todos os direitos reservados
          </p>
          <p className="font-sans text-[0.58rem] uppercase tracking-[0.2em] text-stone-600/35">
            Design & Curadoria · Goiânia
          </p>
        </div>
      </div>
    </footer>
  );
}
