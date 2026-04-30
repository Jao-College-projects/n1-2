import { Link } from "react-router-dom";

export function NotFoundPage(): JSX.Element {
  return (
    <section className="auth-shell text-center">
      <h1 className="section-title mb-3">Pagina nao encontrada</h1>
      <Link to="/" className="btn-minimal">
        Voltar para Home
      </Link>
    </section>
  );
}
