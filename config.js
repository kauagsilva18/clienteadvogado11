// ============================================================
// ARQUIVO DE CONFIGURAÇÃO DO SITE
// Edite as informações abaixo para personalizar o seu site.
// ============================================================

module.exports = {
  site: {
    // Nome exibido na barra de navegação (logo)
    logo: "Dr. Cleber Moacir Gomes da Silva",
    // Frase pequena de saída (título do topo)
    titulo: "Advocacia & Consultoria Jurídica",
  },

  // Informações exibidas no cabeçalho do site (seção principal)
  perfil: {
    // Deixe vazio para usar a foto padrão placeholder.
    // Para usar sua foto, coloque o arquivo em /public/images e escreva o nome aqui,
    // ex.: "foto.jpg"
    foto: "foto-perfil.jpg",
    // Nome completo do advogado
    nome: "Cleber Moacir Gomes da Silva",
    // Título/cargo profissional
    titulo: "Advogado OAB/RS 134814",
    // Pequena frase de apresentação
    tagline: "Excelência, ética e compromisso com a justiça para defender os seus direitos.",
  },

  // Seção "Sobre mim" / Biografia
  sobre: {
    titulo: "Sobre Mim",
    biografia:
      "Cleber Moacir Gomes da Silva Advocacia, com registro na OAB/RS 134814, é especializado em oferecer soluções jurídicas personalizadas para nossos clientes. Atendemos com excelência em áreas como Direito de Família, Sucessões e Direito Civil, sempre priorizando o compromisso ético e a busca por resultados eficazes. Aqui, você encontra não apenas um advogado, mas um parceiro dedicado à sua causa."
  },

  // Seção "Serviços oferecidos"
  servicos: {
    titulo: "Serviços",
    lista: [
      {
        icone: "icon-pensao.svg",
        titulo: "Pensão Alimentícia",
        descricao: "Fixação, revisão e execução de pensão alimentícia, garantindo o sustento adequado de filhos e demais dependentes, com orientação sobre valores, prazos e cobrança judicial em caso de inadimplência.",
      },
      {
        icone: "icon-guarda.svg",
        titulo: "Guarda dos Filhos",
        descricao: "Organização das responsabilidades entre os pais de acordo com as circunstâncias da família e sempre priorizando o melhor interesse da criança ou adolescente.",
      },
      {
        icone: "icon-visitas.svg",
        titulo: "Convivência e Visitas",
        descricao: "Regularização judicial da convivência entre pais e filhos quando não há acordo, definindo finais de semana, feriados, férias escolares e datas comemorativas.",
      },
      {
        icone: "icon-divorcio.svg",
        titulo: "Divórcio",
        descricao: "Condução de processos de divórcio consensual ou litigioso, com mediação de acordos e resguardo dos direitos patrimoniais e familiares.",
      },
      {
        icone: "icon-paternidade.svg",
        titulo: "Reconhecimento de Paternidade",
        descricao: "Medidas judiciais para investigação e reconhecimento de paternidade, incluindo exame de DNA e regularização da filiação e seus efeitos jurídicos.",
      },
      {
        icone: "icon-honra.svg",
        titulo: "Danos Morais e Proteção da Honra",
        descricao: "Atuação em casos de ofensas, calúnia, difamação, injúria e exposição indevida de imagem, vídeos ou dados pessoais, buscando reparação pelos danos causados à honra e à reputação.",
      },
      {
        icone: "icon-consumidor.svg",
        titulo: "Direito do Consumidor e Cobranças Indevidas",
        descricao: "Contestação de negativações indevidas (SPC/Serasa) e cobranças de dívidas inexistentes ou já pagas, além de recuperação de prejuízos causados por fraudes, golpes e danos materiais.",
      },
      {
        icone: "icon-protetiva.svg",
        titulo: "Medida Protetiva",
        descricao: "Solicitação de proteção judicial em situações de ameaça, agressão, perseguição ou violência psicológica, com orientação sobre provas e boletim de ocorrência.",
      },
    ],
  },

  // Seção "Horários de atendimento"
  horarios: {
    titulo: "Horários de Atendimento",
    lista: [
      { dia: "Segunda", horario: "13:00 às 17:30h" },
      { dia: "Terça", horario: "13:30 às 16:30h" },
      { dia: "Quarta", horario: "13:30 às 16:15h" },
      { dia: "Quinta", horario: "13:30 às 16:00h" },
      { dia: "Sexta", horario: "14:00 às 18:00h" },
      { dia: "Sábado", horario: "Fechado" },
      { dia: "Domingo", horario: "Fechado" },
    ],
  },

  // Contato / Redes sociais (deixe o link vazio para adicionar depois)
  contato: {
    whatsapp: "https://wa.me/555193524281", // ex.: "https://wa.me/5511999999999"
    instagram: "https://www.instagram.com/advogado.cleber", // ex.: "https://instagram.com/seu.perfil"
  },
};
