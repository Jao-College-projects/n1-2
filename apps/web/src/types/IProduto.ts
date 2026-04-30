export interface IProduto {
  id: number;
  nome: string;
  categoria: string;
  descricaoCurta: string;
  descricaoLonga: string;
  preco: number;
  estoque: number;
  imagem: string;
  destaqueCarrossel?: boolean;
}

export interface IItemCarrinho {
  produtoId: number;
  quantidade: number;
}

export interface ICredenciaisLogin {
  email: string;
  senha: string;
}

export interface IFormularioCadastro {
  nomeCompleto: string;
  email: string;
  senha: string;
}

export type TipoUsuario = "normal" | "admin";

export interface ITextosSite {
  tituloLoja: string;
  legendaLoja: string;
  secaoApresentacaoTitulo: string;
  secaoApresentacaoTexto: string;
  secaoProdutosTitulo: string;
  secaoProdutosTexto: string;
  secaoExperienciasTitulo: string;
}

// Sub-interfaces para cada tipo de seção da home
export interface IConteudoAmbiente {
  num: string;
  title: string;
  subtitle: string;
  image: string;
  hint: string;
}

export interface IConteudoPeca {
  name: string;
  verse: string;
  image: string;
  num: string;
}

export interface IConteudoMetrica {
  value: string;
  unit: string;
  label: string;
  detail: string;
}

export interface IConteudoSecao {
  // Hero
  imagem_url?: string;
  titulo_linha1?: string;
  titulo_linha2?: string;
  tagline?: string;
  // Manifesto
  imagem_back?: string;
  imagem_mid?: string;
  imagem_front?: string;
  // Atmosfera
  titulo?: string;
  ambientes?: IConteudoAmbiente[];
  // Curadoria
  kicker?: string;
  label?: string;
  pieces?: IConteudoPeca[];
  // Brand Numbers
  marquee?: string[];
  marquee_1?: string;
  marquee_2?: string;
  marquee_3?: string;
  marquee_4?: string;
  marquee_5?: string;
  marquee_6?: string;
  titulo_secao?: string;
  metrics?: IConteudoMetrica[];
  citacao?: string;
  autor?: string;
}

export interface ISecaoHome {
  identificador: string;
  tituloSecao: string;
  ordem: number;
  ativo: boolean;
  conteudo: IConteudoSecao;
}

export interface IPedidoDados {
  nomeCompleto: string;
  cpf: string;
  endereco: string;
  cidade: string;
  cep: string;
  pagamento: string;
}
