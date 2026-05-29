import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  buscarSessao,
  fazerCadastro,
  fazerLogin,
  fazerLogout,
  type IUsuarioSessao,
} from "../services/auth";
import {
  buscarDepoimentos,
  criarDepoimento,
  editarDepoimento,
  excluirDepoimento,
} from "../services/depoimentos";
import { buscarSecoesHome, salvarSecaoHome } from "../services/secoes";
import { buscarProdutos, criarProduto, editarProduto, excluirProduto } from "../services/produtos";
import { finalizarPedido } from "../services/pedidos";
import { requireApiBase } from "../services/apiBase";
import {
  ICredenciaisLogin,
  IFormularioCadastro,
  IItemCarrinho,
  IProduto,
  ITextosSite,
  ISecaoHome,
  IPedidoDados,
  TipoUsuario
} from "../types/IProduto";
import { IDepoimento } from "../types/IDepoimento";

interface ILojaContextData {
  produtos: IProduto[];
  depoimentos: IDepoimento[];
  textosSite: ITextosSite;
  secoesHome: ISecaoHome[];
  itensCarrinho: IItemCarrinho[];
  produtoSelecionado: IProduto | null;
  usuarioLogado: boolean;
  tipoUsuario: TipoUsuario;
  modoEdicao: boolean;
  isAdmin: boolean;
  totalItensCarrinho: number;
  subtotalCarrinho: number;
  selecionarProduto: (produto: IProduto) => void;
  fecharDetalhesProduto: () => void;
  adicionarAoCarrinho: (produtoId: number) => void;
  removerDoCarrinho: (produtoId: number) => void;
  adicionarProduto: (novoProduto: Omit<IProduto, "id">) => Promise<void>;
  atualizarProduto: (produtoAtualizado: IProduto) => Promise<void>;
  removerProduto: (produtoId: number) => Promise<void>;
  adicionarDepoimento: (novoDepoimento: Omit<IDepoimento, "id">) => Promise<void>;
  atualizarDepoimento: (depoimentoAtualizado: IDepoimento) => Promise<void>;
  removerDepoimento: (depoimentoId: number) => Promise<void>;
  atualizarTextoSite: (chave: keyof ITextosSite, valor: string) => void;
  atualizarSecaoHome: (identificador: string, dados: ISecaoHome) => Promise<void>;
  alternarModoEdicao: () => void;
  isLoading: boolean;
  apiErro: string | null;
  login: (dados: ICredenciaisLogin) => Promise<void>;
  cadastrar: (dados: IFormularioCadastro) => Promise<void>;
  logout: () => Promise<void>;
  limparCarrinho: () => void;
  criarPedido: (dados: IPedidoDados) => Promise<void>;
}

const LojaContext = createContext<ILojaContextData | undefined>(undefined);

function aplicarSessao(
  usuario: IUsuarioSessao | null,
  setUsuarioLogado: (v: boolean) => void,
  setTipoUsuario: (v: TipoUsuario) => void
): void {
  setUsuarioLogado(!!usuario);
  setTipoUsuario(usuario?.tipoUsuario === "admin" ? "admin" : "normal");
}

export function LojaProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [depoimentos, setDepoimentos] = useState<IDepoimento[]>([]);
  const [secoesHome, setSecoesHome] = useState<ISecaoHome[]>([]);
  const [apiErro, setApiErro] = useState<string | null>(null);

  const [textosSite, setTextosSite] = useState<ITextosSite>({
    tituloLoja: "Luar Moveis",
    legendaLoja: "Curadoria boutique de moveis para ambientes classicos, elegantes e atemporais.",
    secaoApresentacaoTitulo: "Uma jornada de design e conforto",
    secaoApresentacaoTexto: "Na Luar Moveis, cada peca e apresentada como uma experiencia...",
    secaoProdutosTitulo: "Colecao exclusiva de moveis",
    secaoProdutosTexto: "Explore pecas selecionadas...",
    secaoExperienciasTitulo: "Experiencias de clientes"
  });

  const [itensCarrinho, setItensCarrinho] = useState<IItemCarrinho[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<IProduto | null>(null);

  const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false);
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("normal");
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      requireApiBase();
    } catch (e) {
      setApiErro(e instanceof Error ? e.message : "API Java não configurada");
      setIsLoading(false);
      return;
    }

    async function loadData() {
      setIsLoading(true);
      setApiErro(null);
      try {
        const [listaProdutos, listaDepoimentos, listaSecoes, sessao] = await Promise.all([
          buscarProdutos(),
          buscarDepoimentos(),
          buscarSecoesHome(),
          buscarSessao(),
        ]);

        setProdutos(listaProdutos);
        setDepoimentos(listaDepoimentos);
        setSecoesHome(listaSecoes);
        aplicarSessao(sessao, setUsuarioLogado, setTipoUsuario);

        const imageUrls: string[] = [];
        listaProdutos.forEach((p) => { if (p.imagem) imageUrls.push(p.imagem); });
        listaDepoimentos.forEach((d) => { if (d.imagem) imageUrls.push(d.imagem); });
        listaSecoes.forEach((s) => {
          const c = s.conteudo ?? {};
          if (c.imagem_url) imageUrls.push(c.imagem_url);
          if (c.imagem_back) imageUrls.push(c.imagem_back);
          if (c.imagem_mid) imageUrls.push(c.imagem_mid);
          if (c.imagem_front) imageUrls.push(c.imagem_front);
          (c.ambientes ?? []).forEach((a) => { if (a.image) imageUrls.push(a.image); });
          (c.pieces ?? []).forEach((p) => { if (p.image) imageUrls.push(p.image); });
        });
        imageUrls.forEach((url) => { const img = new Image(); img.src = url; });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Falha ao conectar com a API Java";
        console.error("API Java:", err);
        setApiErro(msg);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const selecionarProduto = useCallback((produto: IProduto): void => {
    setProdutoSelecionado(produto);
  }, []);

  const fecharDetalhesProduto = useCallback((): void => {
    setProdutoSelecionado(null);
  }, []);

  const adicionarAoCarrinho = useCallback((produtoId: number): void => {
    setItensCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.produtoId === produtoId);
      if (itemExistente) {
        return prev.map((item) =>
          item.produtoId === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { produtoId, quantidade: 1 }];
    });
  }, []);

  const removerDoCarrinho = useCallback((produtoId: number): void => {
    setItensCarrinho((prev) =>
      prev
        .map((item) => item.produtoId === produtoId ? { ...item, quantidade: Math.max(item.quantidade - 1, 0) } : item)
        .filter((item) => item.quantidade > 0)
    );
  }, []);

  const adicionarProduto = useCallback(async (novoProduto: Omit<IProduto, "id">) => {
    const data = await criarProduto(novoProduto);
    if (data) {
      setProdutos((prev) => [data, ...prev]);
    }
  }, []);

  const atualizarProduto = useCallback(async (produtoAtualizado: IProduto) => {
    const ok = await editarProduto(produtoAtualizado);
    if (ok) {
      setProdutos((prev) => prev.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p)));
    }
  }, []);

  const removerProduto = useCallback(async (produtoId: number) => {
    const ok = await excluirProduto(produtoId);
    if (ok) {
      setProdutos((prev) => prev.filter((p) => p.id !== produtoId));
    }
  }, []);

  const adicionarDepoimento = useCallback(async (novo: Omit<IDepoimento, "id">) => {
    const data = await criarDepoimento(novo);
    if (data) {
      setDepoimentos((prev) => [data, ...prev]);
    }
  }, []);

  const atualizarDepoimento = useCallback(async (atualizado: IDepoimento) => {
    const ok = await editarDepoimento(atualizado);
    if (ok) {
      setDepoimentos((prev) => prev.map((d) => (d.id === atualizado.id ? atualizado : d)));
    }
  }, []);

  const removerDepoimento = useCallback(async (id: number) => {
    const ok = await excluirDepoimento(id);
    if (ok) {
      setDepoimentos((prev) => prev.filter((d) => d.id !== id));
    }
  }, []);

  const atualizarTextoSite = useCallback((chave: keyof ITextosSite, valor: string): void => {
    if (tipoUsuario !== "admin") return;
    setTextosSite((prev) => ({ ...prev, [chave]: valor }));
  }, [tipoUsuario]);

  const atualizarSecaoHome = useCallback(async (identificador: string, novaSecao: ISecaoHome) => {
    const ok = await salvarSecaoHome(identificador, novaSecao);
    if (ok) {
      setSecoesHome((prev) => {
        const index = prev.findIndex((s) => s.identificador === identificador);
        if (index >= 0) return prev.map((s, i) => (i === index ? novaSecao : s));
        return [...prev, novaSecao];
      });
    }
  }, []);

  const alternarModoEdicao = useCallback((): void => {
    if (tipoUsuario !== "admin") return;
    setModoEdicao((prev) => !prev);
  }, [tipoUsuario]);

  const login = useCallback(async (dados: ICredenciaisLogin): Promise<void> => {
    const usuario = await fazerLogin(dados);
    aplicarSessao(usuario, setUsuarioLogado, setTipoUsuario);
  }, []);

  const cadastrar = useCallback(async (dados: IFormularioCadastro): Promise<void> => {
    const usuario = await fazerCadastro(dados);
    aplicarSessao(usuario, setUsuarioLogado, setTipoUsuario);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await fazerLogout();
    setUsuarioLogado(false);
    setTipoUsuario("normal");
    setModoEdicao(false);
  }, []);

  const limparCarrinho = useCallback((): void => {
    setItensCarrinho([]);
  }, []);

  const criarPedido = useCallback(async (dados: IPedidoDados): Promise<void> => {
    const sessao = await buscarSessao();
    await finalizarPedido({
      usuarioId: sessao?.id ?? null,
      itens: itensCarrinho,
      produtos,
      dadosEntrega: dados,
    });

    setItensCarrinho([]);
    setProdutos(await buscarProdutos());
  }, [itensCarrinho, produtos]);

  const totalItensCarrinho = useMemo(
    () => itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0),
    [itensCarrinho]
  );

  const subtotalCarrinho = useMemo(() => {
    return itensCarrinho.reduce((acc, item) => {
      const p = produtos.find((x) => x.id === item.produtoId);
      return p ? acc + p.preco * item.quantidade : acc;
    }, 0);
  }, [itensCarrinho, produtos]);

  const isAdmin = tipoUsuario === "admin";

  const contextValue = useMemo<ILojaContextData>(() => ({
    produtos,
    depoimentos,
    textosSite,
    secoesHome,
    itensCarrinho,
    produtoSelecionado,
    usuarioLogado,
    tipoUsuario,
    modoEdicao,
    isAdmin,
    totalItensCarrinho,
    subtotalCarrinho,
    selecionarProduto,
    fecharDetalhesProduto,
    adicionarAoCarrinho,
    removerDoCarrinho,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    adicionarDepoimento,
    atualizarDepoimento,
    removerDepoimento,
    atualizarTextoSite,
    atualizarSecaoHome,
    alternarModoEdicao,
    isLoading,
    apiErro,
    login,
    cadastrar,
    logout,
    limparCarrinho,
    criarPedido,
  }), [
    produtos, depoimentos, textosSite, secoesHome, itensCarrinho,
    produtoSelecionado, usuarioLogado, tipoUsuario, modoEdicao, isAdmin,
    totalItensCarrinho, subtotalCarrinho, selecionarProduto, fecharDetalhesProduto,
    adicionarAoCarrinho, removerDoCarrinho, adicionarProduto, atualizarProduto,
    removerProduto, adicionarDepoimento, atualizarDepoimento, removerDepoimento,
    atualizarTextoSite, atualizarSecaoHome, alternarModoEdicao, isLoading, apiErro,
    login, cadastrar, logout, limparCarrinho, criarPedido,
  ]);

  if (apiErro && !isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: "#FAFAF9" }}>
        <div className="text-center" style={{ maxWidth: 480 }}>
          <h1 className="h4 mb-3" style={{ fontFamily: "Playfair Display, serif", color: "#1C1917" }}>
            API indisponível
          </h1>
          <p className="text-muted mb-0">{apiErro}</p>
          <p className="small text-muted mt-3 mb-0">
            Suba o backend com <code>npm run stack</code> e configure{" "}
            <code>VITE_API_BASE_URL</code> em <code>apps/web/.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LojaContext.Provider value={contextValue}>
      {children}
    </LojaContext.Provider>
  );
}

export function useLoja(): ILojaContextData {
  const contexto = useContext(LojaContext);
  if (!contexto) {
    throw new Error("useLoja deve ser usado dentro de LojaProvider.");
  }
  return contexto;
}
