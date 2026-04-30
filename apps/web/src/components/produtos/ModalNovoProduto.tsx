import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoja } from "../../store/LojaContext";
import { uploadFile } from "../../utils/uploadFile";
import { IProduto } from "../../types/IProduto";

interface ModalProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produtoParaEditar?: IProduto | null;
}

export function ModalNovoProduto({ isOpen, onClose, produtoParaEditar }: ModalProdutoProps): JSX.Element {
  const { adicionarProduto, atualizarProduto } = useLoja();
  
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("10");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados se for edição
  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome);
      setCategoria(produtoParaEditar.categoria);
      setPreco(produtoParaEditar.preco.toString());
      setEstoque(produtoParaEditar.estoque.toString());
      setDescricao(produtoParaEditar.descricaoLonga);
      setImagem(produtoParaEditar.imagem);
    } else {
      setNome("");
      setCategoria("");
      setPreco("");
      setEstoque("10");
      setDescricao("");
      setImagem("");
    }
  }, [produtoParaEditar, isOpen]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCarregando(true);
      const url = await uploadFile(file);
      setImagem(url);
    } catch (err) {
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !categoria || !preco || !imagem) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (produtoParaEditar) {
        await atualizarProduto({
          ...produtoParaEditar,
          nome,
          categoria,
          preco: Number(preco),
          estoque: Math.max(0, Number(estoque)),
          descricaoCurta: descricao.substring(0, 100),
          descricaoLonga: descricao,
          imagem,
        });
      } else {
        await adicionarProduto({
          nome,
          categoria,
          preco: Number(preco),
          estoque: Math.max(0, Number(estoque)),
          descricaoCurta: descricao.substring(0, 100),
          descricaoLonga: descricao,
          imagem,
          destaqueCarrossel: false
        });
      }
      onClose();
    } catch (err) {
      alert("Erro ao salvar produto.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-stone-100 p-6 flex justify-between items-center">
              <h2 className="font-display text-xl text-charcoal">
                {produtoParaEditar ? "Editar Móvel" : "Novo Móvel"}
              </h2>
              <button onClick={onClose} className="text-mist hover:text-charcoal transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase tracking-widest text-mist">Nome do Produto</label>
                  <input
                    type="text"
                    className="field-input"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase tracking-widest text-mist">Categoria</label>
                  <input
                    type="text"
                    className="field-input"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase tracking-widest text-mist">Preço (R$)</label>
                  <input
                    type="number"
                    className="field-input"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] uppercase tracking-widest text-mist">Estoque (unid.)</label>
                  <input
                    type="number"
                    className="field-input"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] uppercase tracking-widest text-mist">Descrição Completa</label>
                <textarea
                  className="field-input min-h-[120px]"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] uppercase tracking-widest text-mist">Imagem Principal</label>
                <div 
                  className="border-2 border-dashed border-stone-200 rounded-sm p-4 text-center cursor-pointer hover:bg-stone-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagem ? (
                    <div className="relative group/img">
                      <img src={imagem} alt="Preview" className="h-40 mx-auto object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white text-[0.6rem] uppercase tracking-widest">Alterar</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-mist text-sm">
                      {carregando ? "Fazendo upload..." : "Clique para selecionar imagem"}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </div>

              <button
                type="submit"
                className="btn-minimal w-full py-4 mt-4"
                disabled={carregando}
              >
                {carregando ? "Aguarde..." : (produtoParaEditar ? "Salvar Alterações" : "Adicionar à Coleção")}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
