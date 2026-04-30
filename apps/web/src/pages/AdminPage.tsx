import { FormEvent, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLoja } from "../store/LojaContext";
import { EditableImageField } from "../components/ui/EditableImageField";

export function AdminPage(): JSX.Element {
  const {
    isAdmin,
    produtos,
    depoimentos,
    secoesHome,
    atualizarProduto,
    adicionarProduto,
    removerProduto,
    adicionarDepoimento,
    atualizarDepoimento,
    removerDepoimento,
    atualizarSecaoHome
  } = useLoja();

  const [novoProdutoNome, setNovoProdutoNome] = useState<string>("");
  const [novoProdutoCategoria, setNovoProdutoCategoria] = useState<string>("");
  const [novoProdutoPreco, setNovoProdutoPreco] = useState<number>(0);
  const [novoProdutoImagem, setNovoProdutoImagem] = useState<string>("");
  const [novoProdutoDescricao, setNovoProdutoDescricao] = useState<string>("");

  const [novoDepoimentoCliente, setNovoDepoimentoCliente] = useState<string>("");
  const [novoDepoimentoTexto, setNovoDepoimentoTexto] = useState<string>("");
  const [novoDepoimentoCidade, setNovoDepoimentoCidade] = useState<string>("");
  const [novoDepoimentoImagem, setNovoDepoimentoImagem] = useState<string>("");

  useEffect(() => {
    const urls: string[] = [
      ...produtos.map(p => p.imagem),
      ...depoimentos.map(d => d.imagem).filter(Boolean) as string[],
    ];
    urls.forEach(url => { if (url) { new Image().src = url; } });
  }, [produtos, depoimentos]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  function handleNovoProduto(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();
    adicionarProduto({
      nome: novoProdutoNome,
      categoria: novoProdutoCategoria,
      descricaoCurta: novoProdutoDescricao,
      descricaoLonga: novoProdutoDescricao,
      preco: novoProdutoPreco,
      estoque: 1,
      imagem: novoProdutoImagem,
      destaqueCarrossel: false
    });
    setNovoProdutoNome("");
    setNovoProdutoCategoria("");
    setNovoProdutoPreco(0);
    setNovoProdutoImagem("");
    setNovoProdutoDescricao("");
  }

  function handleNovoDepoimento(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();
    adicionarDepoimento({
      cliente: novoDepoimentoCliente,
      texto: novoDepoimentoTexto,
      cidade: novoDepoimentoCidade,
      imagem: novoDepoimentoImagem
    });
    setNovoDepoimentoCliente("");
    setNovoDepoimentoTexto("");
    setNovoDepoimentoCidade("");
    setNovoDepoimentoImagem("");
  }

  const heroSection = secoesHome.find(s => s.identificador === 'hero');
  const manifestoSection = secoesHome.find(s => s.identificador === 'manifesto');
  const atmosferaSection = secoesHome.find(s => s.identificador === 'atmosfera');
  const curadoriaSection = secoesHome.find(s => s.identificador === 'curadoria');

  return (
    <section>
      <h1 className="section-title mb-4">Painel administrativo</h1>

      <section className="mb-12 border-b border-stone-200 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium text-charcoal">Hero Principal</h2>
          {heroSection && (
            <span className={`text-[0.6rem] uppercase tracking-widest px-2 py-1 rounded ${heroSection.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {heroSection.ativo ? 'Ativa' : 'Inativa'}
            </span>
          )}
        </div>
        
        {heroSection && (
          <article className="lux-panel overflow-hidden p-0">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[0.65rem] uppercase tracking-widest text-mist mb-3 font-bold text-gold-soft">Imagem de Fundo (Hero)</label>
                <div className="h-64 w-full bg-stone-100 overflow-hidden border border-stone-200 rounded-lg">
                  <EditableImageField
                    secaoIdentificador="hero"
                    conteudoKey="imagem_url"
                    fallbackSrc="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800"
                    className="h-full w-full object-cover"
                    buttonPosition="top-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] uppercase tracking-widest text-mist mb-2">Título (Linha 1)</label>
                <input
                  className="field-input"
                  value={heroSection.conteudo.titulo_linha1 || ''}
                  onChange={(e) => atualizarSecaoHome('hero', { ...heroSection, conteudo: { ...heroSection.conteudo, titulo_linha1: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-[0.65rem] uppercase tracking-widest text-mist mb-2">Título (Linha 2)</label>
                <input
                  className="field-input"
                  value={heroSection.conteudo.titulo_linha2 || ''}
                  onChange={(e) => atualizarSecaoHome('hero', { ...heroSection, conteudo: { ...heroSection.conteudo, titulo_linha2: e.target.value } })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[0.65rem] uppercase tracking-widest text-mist mb-2">Tagline</label>
                <input
                  className="field-input"
                  value={heroSection.conteudo.tagline || ''}
                  onChange={(e) => atualizarSecaoHome('hero', { ...heroSection, conteudo: { ...heroSection.conteudo, tagline: e.target.value } })}
                />
              </div>
            </div>
          </article>
        )}
      </section>

      <section className="mb-12 border-b border-stone-200 pb-10">
        <h2 className="font-display text-2xl font-medium text-charcoal mb-6">Manifesto da Marca</h2>
        {manifestoSection && (
          <article className="lux-panel p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Imagem Fundo', key: 'imagem_back' },
                { label: 'Imagem Meio', key: 'imagem_mid' },
                { label: 'Imagem Frente', key: 'imagem_front' }
              ].map((item) => (
                <div key={item.key} className="flex flex-col gap-3">
                  <label className="block text-[0.65rem] uppercase tracking-widest text-mist font-bold text-gold-soft">{item.label}</label>
                  <div className="aspect-square w-full rounded bg-stone-100 overflow-hidden border border-stone-200 shadow-inner">
                    <EditableImageField
                      secaoIdentificador="manifesto"
                      conteudoKey={item.key}
                      fallbackSrc="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=400"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}
      </section>

      <section className="mb-12 border-b border-stone-200 pb-10">
        <h2 className="font-display text-2xl font-medium text-charcoal mb-6">Atmosfera e Ambientes</h2>
        {atmosferaSection && (
          <article className="lux-panel p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Array.isArray(atmosferaSection.conteudo?.ambientes) ? atmosferaSection.conteudo.ambientes : []).map((amb: any, index: number) => (
                <div key={index} className="flex flex-col gap-3">
                  <label className="block text-[0.65rem] uppercase tracking-widest text-mist font-bold text-gold-soft">{amb?.title || `Ambiente ${index + 1}`}</label>
                  <div className="aspect-[4/5] w-full rounded bg-stone-100 overflow-hidden border border-stone-200">
                    <EditableImageField
                      secaoIdentificador="atmosfera"
                      conteudoKey={["ambientes", index, "image"]}
                      fallbackSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}
        {!atmosferaSection && (
           <div className="p-16 text-center bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
             <div className="mb-4 text-mist font-display text-lg italic">Seção 'atmosfera' não encontrada.</div>
             <button 
               onClick={() => atualizarSecaoHome('atmosfera', {
                 identificador: 'atmosfera',
                 tituloSecao: 'Atmosfera e Ambientes',
                 ordem: 3,
                 ativo: true,
                 conteudo: { 
                   titulo: "Ambientes que definem o espaço", 
                   ambientes: [
                     { num: "01", title: "Sala", subtitle: "Estar", image: "", hint: "Conversas demoradas." },
                     { num: "02", title: "Jantar", subtitle: "Mesa", image: "", hint: "Rituais à mesa." },
                     { num: "03", title: "Quarto", subtitle: "Descanso", image: "", hint: "Descanso elevado." }
                   ]
                 }
               })}
               className="btn-minimal inline-flex items-center gap-2"
             >
               Criar Seção Manualmente
             </button>
           </div>
        )}
      </section>

      <section className="mb-12 border-b border-stone-200 pb-10">
        <h2 className="font-display text-2xl font-medium text-charcoal mb-6">Curadoria Editorial</h2>
        {curadoriaSection && (
          <article className="lux-panel p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {(Array.isArray(curadoriaSection.conteudo?.pieces) ? curadoriaSection.conteudo.pieces : []).map((piece: any, index: number) => (
              <div key={index} className="flex flex-col gap-3">
                <label className="block text-[0.65rem] uppercase tracking-widest text-mist font-bold text-gold-soft">{piece?.name || `Peça ${index + 1}`}</label>
                
                <div className="relative aspect-video w-full overflow-hidden rounded bg-stone-100 border border-stone-200 shadow-sm">
                  <EditableImageField
                    secaoIdentificador="curadoria"
                    conteudoKey={["pieces", index, "image"]}
                    fallbackSrc="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400"
                    className="h-full w-full"
                  />
                </div>
              </div>
            ))}
          </article>
        )}
      </section>

      <section className="mb-5 border-b border-stone-200 pb-8">
        <h2 className="section-title mb-3 text-xl">Editar moveis exibidos</h2>
        <div className="flex flex-col gap-3">
          {produtos.map((produto) => (
            <article className="lux-panel p-3" key={produto.id}>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-2">
                  <div className="relative group aspect-square rounded overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      loading="lazy"
                      className="h-full w-full object-cover transition-opacity duration-300"
                      style={{ opacity: 0 }}
                      onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                    />
                    <input 
                      type="file" 
                      className="hidden" 
                      id={`file-prod-${produto.id}`}
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { uploadFile } = await import("../utils/uploadFile");
                          const url = await uploadFile(file);
                          atualizarProduto({ ...produto, imagem: url });
                        }
                      }}
                    />
                    <label 
                      htmlFor={`file-prod-${produto.id}`}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <span className="text-[0.6rem] text-white uppercase font-bold">Trocar</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <input
                    className="field-input"
                    value={produto.nome}
                    onChange={(evento) =>
                      atualizarProduto({ ...produto, nome: evento.target.value })
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <input
                    className="field-input"
                    value={produto.categoria}
                    onChange={(evento) =>
                      atualizarProduto({ ...produto, categoria: evento.target.value })
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-1">
                  <input
                    className="field-input"
                    type="number"
                    value={produto.preco}
                    onChange={(evento) =>
                      atualizarProduto({ ...produto, preco: Number(evento.target.value) })
                    }
                    min="0"
                    title="Preço"
                  />
                </div>
                <div className="col-span-12 md:col-span-1">
                  <input
                    className="field-input"
                    type="number"
                    value={produto.estoque}
                    onChange={(evento) =>
                      atualizarProduto({ ...produto, estoque: Math.max(0, Number(evento.target.value)) })
                    }
                    min="0"
                    title="Estoque"
                    style={{ borderColor: produto.estoque <= 0 ? "rgba(220,38,38,0.5)" : undefined }}
                  />
                </div>
                <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`destaque-${produto.id}`}
                    checked={produto.destaqueCarrossel || false}
                    onChange={(e) => atualizarProduto({ ...produto, destaqueCarrossel: e.target.checked })}
                    className="accent-gold-soft cursor-pointer"
                  />
                  <label htmlFor={`destaque-${produto.id}`} className="text-sm font-medium text-stone-600 block cursor-pointer">
                    Destaque
                  </label>
                </div>
                <div className="col-span-12 flex items-end md:col-span-1">
                  <button
                    className="text-red-500 hover:text-red-700 text-xs uppercase font-bold"
                    type="button"
                    onClick={() => removerProduto(produto.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <form className="lux-panel mt-4 p-4" onSubmit={handleNovoProduto}>
          <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-stone-600">
            Adicionar novo movel
          </h3>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-2">
               <div className="aspect-square bg-stone-50 border border-dashed border-stone-300 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                  {novoProdutoImagem ? (
                    <>
                      <img src={novoProdutoImagem} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-[0.6rem] text-white uppercase font-bold">Trocar</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <svg className="w-6 h-6 text-stone-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-[0.55rem] text-mist uppercase">Foto</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const { uploadFile } = await import("../utils/uploadFile");
                        const url = await uploadFile(file);
                        setNovoProdutoImagem(url);
                      }
                    }}
                  />
               </div>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-col gap-3">
              <input
                className="field-input"
                placeholder="Nome do movel"
                value={novoProdutoNome}
                onChange={(evento) => setNovoProdutoNome(evento.target.value)}
                required
              />
              <input
                className="field-input"
                placeholder="Categoria"
                value={novoProdutoCategoria}
                onChange={(evento) => setNovoProdutoCategoria(evento.target.value)}
                required
              />
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-3">
              <input
                className="field-input"
                type="number"
                placeholder="Preco"
                value={novoProdutoPreco}
                onChange={(evento) => setNovoProdutoPreco(Number(evento.target.value))}
                required
              />
              <input
                className="field-input"
                placeholder="Descricao curta"
                value={novoProdutoDescricao}
                onChange={(evento) => setNovoProdutoDescricao(evento.target.value)}
                required
              />
            </div>
            <div className="col-span-12">
              <button className="btn-minimal w-full" type="submit" disabled={!novoProdutoImagem}>
                Adicionar movel
              </button>
            </div>
          </div>
        </form>
      </section>

      <section>
        <h2 className="section-title mb-3 text-xl">Editar experiencias de clientes</h2>
        <div className="flex flex-col gap-3">
          {depoimentos.map((depoimento) => (
            <article className="lux-panel p-3" key={depoimento.id}>
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 md:col-span-2">
                  <div className="relative group aspect-square rounded overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                    {depoimento.imagem ? (
                      <img
                        src={depoimento.imagem}
                        alt={depoimento.cliente}
                        loading="lazy"
                        className="h-full w-full object-cover transition-opacity duration-300"
                        style={{ opacity: 0 }}
                        onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="font-display text-stone-400 text-2xl">{depoimento.cliente.charAt(0)}</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      id={`file-dep-${depoimento.id}`}
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { uploadFile } = await import("../utils/uploadFile");
                          const url = await uploadFile(file);
                          atualizarDepoimento({ ...depoimento, imagem: url });
                        }
                      }}
                    />
                    <label 
                      htmlFor={`file-dep-${depoimento.id}`}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <span className="text-[0.6rem] text-white uppercase font-bold">Trocar</span>
                    </label>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <input
                    className="field-input"
                    value={depoimento.cliente}
                    onChange={(evento) =>
                      atualizarDepoimento({ ...depoimento, cliente: evento.target.value })
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <input
                    className="field-input"
                    value={depoimento.texto}
                    onChange={(evento) =>
                      atualizarDepoimento({ ...depoimento, texto: evento.target.value })
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-2">
                  <input
                    className="field-input"
                    value={depoimento.cidade}
                    onChange={(evento) =>
                      atualizarDepoimento({ ...depoimento, cidade: evento.target.value })
                    }
                  />
                </div>
                <div className="col-span-12 flex items-center justify-center md:col-span-1">
                  <button
                    className="text-red-500 hover:text-red-700 text-xs uppercase font-bold"
                    type="button"
                    onClick={() => removerDepoimento(depoimento.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <form className="lux-panel mt-3 p-3" onSubmit={handleNovoDepoimento}>
          <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wide text-stone-600">
            Adicionar depoimento
          </h3>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-1">
               <div className="aspect-square bg-stone-50 border border-dashed border-stone-300 rounded flex flex-col items-center justify-center relative overflow-hidden group">
                  {novoDepoimentoImagem ? (
                    <>
                      <img src={novoDepoimentoImagem} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-[0.4rem] text-white uppercase font-bold">X</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <svg className="w-4 h-4 text-stone-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const { uploadFile } = await import("../utils/uploadFile");
                        const url = await uploadFile(file);
                        setNovoDepoimentoImagem(url);
                      }
                    }}
                  />
               </div>
            </div>
            <div className="col-span-12 md:col-span-2">
              <input
                className="field-input"
                placeholder="Nome do cliente"
                value={novoDepoimentoCliente}
                onChange={(evento) => setNovoDepoimentoCliente(evento.target.value)}
                required
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <input
                className="field-input"
                placeholder="Texto da experiencia"
                value={novoDepoimentoTexto}
                onChange={(evento) => setNovoDepoimentoTexto(evento.target.value)}
                required
              />
            </div>
            <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
              <input
                className="field-input"
                placeholder="Cidade"
                value={novoDepoimentoCidade}
                onChange={(evento) => setNovoDepoimentoCidade(evento.target.value)}
                required
              />
              <button className="btn-minimal w-full py-1.5" type="submit" disabled={!novoDepoimentoImagem}>
                Salvar
              </button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
}
