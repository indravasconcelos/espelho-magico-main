const PRODUTOS_PADRAO = [
  {
    id: 1, nome: "Batom Matte Vermelho", categoria: "batons",
    preco: 20, destaque: true, disponivel: true,
    descricao: "Batom matte de longa duração com cor vermelho intenso. Acabamento aveludado que realça qualquer look.",
    imagens: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 2, nome: "Batom Matte Nude", categoria: "batons",
    preco: 15, destaque: false, disponivel: true,
    descricao: "Tom nude perfeito para o dia a dia. Fórmula hidratante com acabamento matte e alta pigmentação.",
    imagens: [
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 3, nome: "Batom Líquido Rosa", categoria: "batons",
    preco: 10, destaque: false, disponivel: true,
    descricao: "Batom líquido matte cor rosa vibrante. Secagem rápida e duração prolongada por até 12 horas.",
    imagens: [
      "https://images.unsplash.com/photo-1596522354195-e84ae3c98731?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 4, nome: "Tiara de Cristais", categoria: "tiaras",
    preco: 20, destaque: true, disponivel: true,
    descricao: "Tiara elegante com cristais brilhantes. Ideal para festas, casamentos e ocasiões especiais.",
    imagens: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 5, nome: "Tiara de Pérolas", categoria: "tiaras",
    preco: 15, destaque: false, disponivel: true,
    descricao: "Tiara delicada com pérolas artificiais de alto brilho. Toque sofisticado para qualquer visual.",
    imagens: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 6, nome: "Bobbi Pins Decorados", categoria: "tiaras",
    preco: 10, destaque: false, disponivel: true,
    descricao: "Kit com 10 bobbi pins decorados com pérolas e strass. Prendedor delicado e estiloso.",
    imagens: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596522354195-e84ae3c98731?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 7, nome: "Brincos Argola Dourada", categoria: "acessorios",
    preco: 15, destaque: true, disponivel: true,
    descricao: "Brincos argola em metal dourado de alto brilho. Design clássico que nunca sai de moda.",
    imagens: [
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 8, nome: "Pulseira Coração", categoria: "acessorios",
    preco: 20, destaque: false, disponivel: true,
    descricao: "Pulseira delicada com pingente de coração em metal dourado. Ajustável e cheia de charme.",
    imagens: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 9, nome: "Anel Ajustável", categoria: "acessorios",
    preco: 10, destaque: false, disponivel: true,
    descricao: "Anel ajustável em metal dourado com strass central. Combina com qualquer look e dedo.",
    imagens: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596522354195-e84ae3c98731?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 10, nome: "Colar Pérola", categoria: "acessorios",
    preco: 20, destaque: true, disponivel: true,
    descricao: "Colar curto com pérolas artificiais e fecho dourado. Elegância atemporal para qualquer ocasião.",
    imagens: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 11, nome: "Escova Modeladora", categoria: "acessorios",
    preco: 15, destaque: false, disponivel: true,
    descricao: "Escova modeladora térmica para penteados. Cria cachos e ondas perfeitos sem danificar os fios.",
    imagens: [
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596522354195-e84ae3c98731?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 12, nome: "Espelho de Bolsa", categoria: "acessorios",
    preco: 10, destaque: false, disponivel: true,
    descricao: "Espelho compacto dourado com estojo protetor. Perfeito para retocar a maquiagem onde estiver.",
    imagens: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

let produtos = [];
