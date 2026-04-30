import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLoja } from "../../store/LojaContext";
import logo from "../../assets/logo.png";

export function SiteHeader(): JSX.Element {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!isHome) { setPastHero(false); return; }
    const onScroll = (): void => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setPastHero(window.scrollY > window.innerHeight * 0.82);
        rafRef.current = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHome]);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const {
    totalItensCarrinho, itensCarrinho, produtos, subtotalCarrinho,
    usuarioLogado, isAdmin, modoEdicao, alternarModoEdicao, logout,
    adicionarAoCarrinho, removerDoCarrinho
  } = useLoja();

  return (
    <header className="header-fixed glass-header text-charcoal">
      <div className="container-fluid d-flex align-items-center justify-content-between px-4 px-lg-5 header-inner mx-auto">

        {/* LOGO */}
        <Link to="/" className="hover-opacity transition-opacity d-flex align-items-center">
          <img
            src={logo}
            alt="Luar Móveis"
            style={{ height: "2.5rem", width: "auto", objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const span = document.createElement("span");
              span.className = "font-display fs-4 fst-italic fw-medium text-charcoal";
              span.innerText = "Luar Móveis";
              (e.target as HTMLImageElement).parentElement?.appendChild(span);
            }}
          />
        </Link>

        {/* ACTIONS */}
        <div className="d-flex align-items-center gap-3">

          {/* NAV DESKTOP */}
          <nav className="d-none d-md-flex align-items-center gap-4">
            <NavLink to="/" end className={({ isActive }) => `nav-link-header ${isActive ? "active" : ""}`}>Home</NavLink>
            <NavLink to="/produtos" className={({ isActive }) => `nav-link-header ${isActive ? "active" : ""}`}>Produtos</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link-header ${isActive ? "active" : ""}`}>Painel</NavLink>
            )}
            {isAdmin && (
              <button
                onClick={alternarModoEdicao}
                className="border-0 bg-transparent p-0 nav-link-header"
                style={{ opacity: modoEdicao ? 1 : 0.5 }}
              >
                {modoEdicao ? "Editor ON" : "Editor OFF"}
              </button>
            )}
          </nav>

          {/* CART */}
          <div
            className="position-relative py-2"
            onMouseEnter={() => !window.matchMedia("(max-width: 768px)").matches && setCartDropdownOpen(true)}
            onMouseLeave={() => !window.matchMedia("(max-width: 768px)").matches && setCartDropdownOpen(false)}
          >
            <Link
              to="/carrinho"
              className="position-relative d-block border-0 bg-transparent p-0"
              onClick={() => setCartDropdownOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors-custom hover-gold">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItensCarrinho > 0 && (
                <span className="badge-cart">{totalItensCarrinho}</span>
              )}
            </Link>

            {/* DROPDOWN CARRINHO (Desktop) */}
            <AnimatePresence>
              {cartDropdownOpen && !window.matchMedia("(max-width: 768px)").matches && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0, x: "-50%" }}
                  animate={{ opacity: 1, scaleY: 1, x: "-50%" }}
                  exit={{ opacity: 0, scaleY: 0, x: "-50%" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="cart-dropdown-panel glass-dropdown"
                  style={{ originY: "top" }}
                >
                  <div className="position-absolute" style={{ top: "-1rem", left: 0, right: 0, height: "1rem" }} />
                  <h4 className="mb-4 font-display fw-medium text-charcoal border-bottom pb-3 text-center" style={{ fontSize: "1rem" }}>
                    Sacola de Compras
                  </h4>

                  {itensCarrinho.length === 0 ? (
                    <div className="py-5 text-center">
                      <p className="font-sans text-mist uppercase tracking-widest" style={{ fontSize: "0.7rem" }}>Sua sacola está vazia</p>
                    </div>
                  ) : (
                    <div className="overflow-auto" style={{ maxHeight: "450px" }}>
                      {itensCarrinho.map((item) => {
                        const prod = produtos.find(p => p.id === item.produtoId);
                        if (!prod) return null;
                        const isMany = itensCarrinho.length > 2;
                        return (
                          <div
                            key={item.produtoId}
                            className="d-flex align-items-center gap-3 border-bottom border-stone-100 pb-3 mb-3"
                          >
                            <Link to={`/produtos/${prod.id}`} className="flex-shrink-0 overflow-hidden border border-stone-100" style={{ width: "80px", height: "60px" }}>
                              <img src={prod.imagem} alt={prod.nome} className="w-100 h-100 object-fit-cover" />
                            </Link>
                            
                            <div className="flex-grow-1 overflow-hidden">
                              <Link to={`/produtos/${prod.id}`} className="text-decoration-none">
                                <p className="truncate font-display fw-medium text-charcoal mb-1" style={{ fontSize: "0.8rem" }}>
                                  {prod.nome}
                                </p>
                              </Link>
                              <div className="d-flex align-items-center justify-content-between">
                                <p className="font-sans fw-bold text-stone-600 mb-0" style={{ fontSize: "0.75rem" }}>
                                  R$ {prod.preco.toLocaleString("pt-BR")}
                                </p>
                                
                                <div className="d-flex align-items-center bg-stone-100 rounded-pill px-2 py-1 gap-2">
                                  <button 
                                    className="border-0 bg-transparent p-0 text-stone-400 hover-gold" 
                                    onClick={(e) => { e.preventDefault(); removerDoCarrinho(prod.id); }}
                                    style={{ fontSize: "0.8rem", width: "20px" }}
                                  >
                                    −
                                  </button>
                                  <span className="font-sans text-charcoal fw-medium" style={{ fontSize: "0.75rem" }}>{item.quantidade}</span>
                                  <button 
                                    className="border-0 bg-transparent p-0 text-stone-400 hover-gold" 
                                    onClick={(e) => { e.preventDefault(); adicionarAoCarrinho(prod.id); }}
                                    style={{ fontSize: "0.8rem", width: "20px" }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="border-top border-stone-100 pt-3 mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                      <span className="font-sans text-mist uppercase tracking-widest" style={{ fontSize: "0.7rem" }}>Subtotal</span>
                      <span className="font-display fw-semibold text-charcoal" style={{ fontSize: "1rem" }}>
                        R$ {subtotalCarrinho.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <Link
                      to="/carrinho"
                      className="d-block w-100 text-center text-decoration-none font-sans text-white py-3 transition-smooth"
                      style={{ background: "#1c1917", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase" }}
                    >
                      Ver Carrinho
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LOGIN/SAIR (Desktop) */}
          <div className="d-none d-md-flex align-items-center gap-4">
            {!usuarioLogado ? (
              <NavLink to="/auth" className="nav-link-header">Login</NavLink>
            ) : (
              <button onClick={logout} className="border-0 bg-transparent p-0 nav-link-header">Sair</button>
            )}
          </div>

          {/* HAMBURGER (Mobile) */}
          <button
            className="d-flex d-md-none border-0 bg-transparent p-0 text-charcoal"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="d-md-none mobile-menu-panel glass-mobile"
          >
            <nav className="d-flex flex-column gap-4 align-items-center">
              <NavLink to="/" end className="nav-link-header">Home</NavLink>
              <NavLink to="/produtos" className="nav-link-header">Produtos</NavLink>
              {isAdmin && <NavLink to="/admin" className="nav-link-header">Painel</NavLink>}
              {!usuarioLogado ? (
                <NavLink to="/auth" className="nav-link-header text-gold-soft fw-bold">Login</NavLink>
              ) : (
                <button onClick={logout} className="border-0 bg-transparent p-0 nav-link-header text-mist">Sair</button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
