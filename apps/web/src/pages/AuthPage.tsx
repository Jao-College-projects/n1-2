import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoja } from "../store/LojaContext";

export function AuthPage(): JSX.Element {
  const { login, cadastrar } = useLoja();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setMensagemSucesso("");
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email, senha });
        navigate("/");
      } else {
        await cadastrar({ email, senha, nomeCompleto });
        setMensagemSucesso("Cadastro realizado! Verifique seu email se necessário, ou tente fazer login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setErro(err.message || "Ocorreu um erro durante a autenticação.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #d6d3d1",
    background: "white",
    padding: "0.75rem 1rem",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "0.9rem",
    color: "#1c1917",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease"
  };

  return (
    <div className="d-flex min-vh-60 align-items-center justify-content-center py-5">
      <div className="auth-card">
        <div className="border-top border-2 mb-4" style={{ borderColor: "#c9a86a" }} />

        {/* Marca */}
        <div className="text-center mb-4">
          <p className="font-display fw-light fst-italic text-charcoal" style={{ fontSize: "1.6rem", letterSpacing: "0.02em" }}>
            Luar Móveis
          </p>
          <div className="mx-auto mt-3" style={{ height: "1px", width: "2.5rem", background: "rgba(201,168,106,0.55)" }} />
        </div>

        <h1 className="font-display fw-medium text-charcoal mb-4" style={{ fontSize: "1.6rem" }}>
          {isLogin ? "Entrar na conta" : "Criar conta"}
        </h1>

        {erro && (
          <div className="mb-4 border border-red-200 bg-red-50 p-3 text-center text-red-600" style={{ fontSize: "0.875rem" }}>
            {erro}
          </div>
        )}

        {mensagemSucesso && (
          <div className="mb-4 border border-green-200 bg-green-50 p-3 text-center text-green-700" style={{ fontSize: "0.875rem" }}>
            {mensagemSucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {!isLogin && (
            <div>
              <label className="d-block font-sans fw-medium text-charcoal uppercase tracking-widest mb-2" style={{ fontSize: "0.65rem", opacity: 0.65 }}>
                Nome completo
              </label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={e => setNomeCompleto(e.target.value)}
                required={!isLogin}
                style={inputStyle}
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label className="d-block font-sans fw-medium text-charcoal uppercase tracking-widest mb-2" style={{ fontSize: "0.65rem", opacity: 0.65 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="d-block font-sans fw-medium text-charcoal uppercase tracking-widest mb-2" style={{ fontSize: "0.65rem", opacity: 0.65 }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-100 font-sans fw-medium uppercase text-cream transition-smooth mt-2"
            style={{
              padding: "1rem",
              fontSize: "0.72rem",
              letterSpacing: "0.3em",
              background: "#1c1917",
              border: "1px solid #1c1917",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
          </button>

          <p className="text-center font-sans mb-0" style={{ fontSize: "0.75rem", color: "rgba(120,113,108,0.7)" }}>
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setErro(""); setMensagemSucesso(""); }}
              className="border-0 bg-transparent p-0 text-charcoal text-decoration-underline transition-colors-custom hover-gold"
              style={{ fontSize: "0.75rem" }}
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
