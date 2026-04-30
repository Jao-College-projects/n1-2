import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useLoja } from "../store/LojaContext";

const ease = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

export function FinalizacaoPage(): JSX.Element {
  const { subtotalCarrinho, itensCarrinho, produtos, criarPedido, usuarioLogado } = useLoja();

  const [pedidoConcluido, setPedidoConcluido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [pagamento, setPagamento] = useState("Pix");

  if (!itensCarrinho.length && !pedidoConcluido) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-[2rem] font-light text-charcoal">Seu carrinho está vazio.</p>
        <Link to="/produtos" className="mt-6 font-sans text-[0.72rem] uppercase tracking-[0.28em] text-mist underline hover:text-charcoal">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  if (!usuarioLogado && !pedidoConcluido) {
    return <Navigate to="/auth" replace />;
  }

  if (pedidoConcluido) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-32 text-center max-w-xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={ease}
      >
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gold-soft/10 text-gold-soft">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 className="font-display text-[2.5rem] font-medium text-charcoal leading-tight">Pedido Reservado</h1>
        <p className="mt-4 font-sans text-[1rem] font-light leading-[1.8] text-mist">
          Agradecemos sua escolha. Um curador da Luar Móveis entrará em contato em breve para finalizar os detalhes da entrega e pagamento.
        </p>
        <Link
          to="/"
          className="mt-12 inline-flex border border-charcoal bg-charcoal px-10 py-4 font-sans text-[0.72rem] font-medium uppercase tracking-[0.3em] text-cream transition-all hover:bg-charcoal/88"
        >
          Voltar para Home
        </Link>
      </motion.div>
    );
  }

  const handleConfirmar = async () => {
    if (!nome || !endereco || !cidade || !cep) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setErro("");
    setLoading(true);
    try {
      await criarPedido({ nomeCompleto: nome, cpf, endereco, cidade, cep, pagamento });
      setPedidoConcluido(true);
    } catch {
      setErro("Erro ao registrar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <motion.div
        className="mb-12 border-b border-stone-200/60 pb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-gold-soft/60" />
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.35em] text-mist">Checkout</p>
        </div>
        <h1
          className="font-display font-medium leading-[1.08] text-charcoal"
          style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
        >
          Finalizar Pedido
        </h1>
      </motion.div>

      <div className="row g-5">
        {/* Formulário */}
        <motion.section
          className="col-12 col-lg-8 space-y-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...ease, delay: 0.2 }}
        >
          <section>
            <h2 className="font-display text-[1.4rem] text-charcoal mb-8 border-b border-stone-100 pb-4">Dados de Entrega</h2>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="d-block text-[0.6rem] uppercase tracking-widest text-mist mb-1">Nome Completo *</label>
                <input type="text" className="field-input w-full" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="col-12 col-md-6">
                <label className="d-block text-[0.6rem] uppercase tracking-widest text-mist mb-1">CPF</label>
                <input type="text" className="field-input w-full" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} />
              </div>
              <div className="col-12">
                <label className="d-block text-[0.6rem] uppercase tracking-widest text-mist mb-1">Endereço de Entrega *</label>
                <input type="text" className="field-input w-full" placeholder="Rua, número, complemento" value={endereco} onChange={e => setEndereco(e.target.value)} />
              </div>
              <div className="col-12 col-md-6">
                <label className="d-block text-[0.6rem] uppercase tracking-widest text-mist mb-1">Cidade *</label>
                <input type="text" className="field-input w-full" placeholder="Sua cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
              </div>
              <div className="col-12 col-md-6">
                <label className="d-block text-[0.6rem] uppercase tracking-widest text-mist mb-1">CEP *</label>
                <input type="text" className="field-input w-full" placeholder="00000-000" value={cep} onChange={e => setCep(e.target.value)} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[1.4rem] text-charcoal mb-8 border-b border-stone-100 pb-4">Pagamento</h2>
            <div className="row g-3">
              {["Pix", "Cartão", "Boleto"].map((metodo) => (
                <div key={metodo} className="col-12 col-sm-4">
                  <label className={`d-flex flex-column align-items-center justify-content-center p-4 border cursor-pointer transition-all group ${pagamento === metodo ? 'border-gold-soft bg-gold-soft/5' : 'border-stone-200 hover:border-gold-soft'}`}>
                    <input
                      type="radio"
                      name="pagamento"
                      className="mb-2 accent-gold-soft"
                      checked={pagamento === metodo}
                      onChange={() => setPagamento(metodo)}
                    />
                    <span className="font-sans text-[0.7rem] uppercase tracking-widest text-mist group-hover:text-charcoal">{metodo}</span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {erro && (
            <p className="font-sans text-[0.75rem] text-red-600 border border-red-200 bg-red-50 px-4 py-3">{erro}</p>
          )}

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading}
            className="w-full bg-charcoal text-cream py-6 font-sans text-[0.8rem] uppercase tracking-[0.4em] font-medium transition-all hover:bg-charcoal/92 hover:tracking-[0.45em] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : `Confirmar Reserva — R$ ${subtotalCarrinho.toLocaleString("pt-BR")}`}
          </button>
        </motion.section>

        {/* Resumo Lateral */}
        <motion.aside
          className="col-12 col-lg-4 bg-stone-50/50 p-8 border border-stone-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...ease, delay: 0.4 }}
        >
          <h2 className="font-display text-[1.2rem] text-charcoal mb-6">Resumo da Seleção</h2>
          <div className="space-y-6">
            {itensCarrinho.map((item) => {
              const p = produtos.find(x => x.id === item.produtoId);
              if (!p) return null;
              return (
                <div key={item.produtoId} className="flex gap-4 items-center">
                  <img src={p.imagem} className="h-16 w-12 object-cover grayscale-[0.3]" alt={p.nome} loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-sans text-[0.75rem] text-charcoal">{p.nome}</p>
                    <p className="font-sans text-[0.65rem] text-mist/60 uppercase tracking-widest">{item.quantidade}x</p>
                  </div>
                  <p className="font-sans text-[0.8rem] text-charcoal">R$ {(p.preco * item.quantidade).toLocaleString("pt-BR")}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-stone-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans text-[0.7rem] uppercase tracking-widest text-mist">Subtotal</span>
              <span className="font-sans text-[0.9rem] text-charcoal">R$ {subtotalCarrinho.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-sans text-[0.7rem] uppercase tracking-widest text-mist">Entrega</span>
              <span className="font-sans text-[0.7rem] uppercase tracking-widest text-green-700">Cortesia</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-stone-100">
              <span className="font-sans text-[0.8rem] uppercase tracking-widest text-charcoal font-bold">Total</span>
              <span className="font-display text-[1.8rem] text-charcoal leading-none">R$ {subtotalCarrinho.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 p-4 bg-white/50 border border-stone-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8956c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span className="font-sans text-[0.6rem] uppercase tracking-[0.1em] text-gold-soft">Ambiente de Compra Seguro</span>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
