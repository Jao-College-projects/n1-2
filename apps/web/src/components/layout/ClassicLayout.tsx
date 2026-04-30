import { Outlet, useLocation } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { ProdutoDetalheModal } from "../produtos/ProdutoDetalheModal";

export function ClassicLayout(): JSX.Element {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteudo
      </a>
      <SiteHeader />
      {isHome ? (
        <main id="conteudo-principal" className="home-main" tabIndex={-1}>
          <Outlet />
        </main>
      ) : (
        <main id="conteudo-principal" className="layout-main" tabIndex={-1}>
          <Outlet />
        </main>
      )}
      {!isHome && <SiteFooter />}
      <ProdutoDetalheModal />
    </>
  );
}
