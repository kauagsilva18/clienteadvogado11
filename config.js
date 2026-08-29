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
      "Cleber Moacir Gomes da Silva Advocacia, com registro na OAB/RS 134814, é especializado em oferecer soluções jurídicas personalizadas para nossos clientes. Atendemos com excelência em áreas como Direito de Família, Sucessões, Direito  e Direito Civil, sempre priorizando o compromisso ético e a busca por resultados eficazes. Aqui, você encontra não apenas um advogado, mas um parceiro dedicado à sua causa."
  },

  // Seção "Serviços oferecidos"
  servicos: {
    titulo: "Serviços",
    lista: [
      {
        icone: "icon-gavel.svg",
        titulo: "Direito Civil",
        descricao: "Conhecido como o 'direito do cidadão', ele estabelece as normas fundamentais para a convivência em sociedade, garantindo ordem, segurança e justiça nas interações privadas. ",
      },
      {
        icone: "icon-briefcase.svg",
        titulo: "Direito",
        descricao: "Direito é o conjunto de normas jurídicas que regulam a vida em sociedade, estabelecendo direitos, deveres e sanções para garantir a ordem, a justiça e a segurança jurídica.",
      },
      {
        icone: "icon-family.svg",
        titulo: "Direito de Família",
        descricao: "Direito de Família é o ramo que regula as relações familiares — tanto os vínculos pessoais quanto os efeitos patrimoniais — entre pessoas ligadas por parentesco, afinidade, casamento, união estável, adoção ou afeto.",
      },
      {
        icone: "icon-scale.svg",
        titulo: "Sucessões",
        descricao: "Direito das Sucessões é o ramo do Direito Civil que regula a transmissão do patrimônio de uma pessoa falecida aos seus sucessores, seja por lei ou por testamento.",
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
