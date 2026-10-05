// ============================================================
// CONTEÚDO PADRÃO DO SITE
// Estas informações são usadas apenas na primeira execução, para
// preencher o banco de dados, e como reserva caso o banco fique
// fora do ar. Para editar o site, use o painel administrativo.
// ============================================================

module.exports = {
  site: {
    // Nome exibido na barra de navegação (logo)
    logo: "Dr. Cleber Moacir Gomes da Silva",
    // Frase pequena de saída (título da aba do navegador)
    titulo: "Advocacia & Consultoria Jurídica",
  },

  // Textos dos links da barra de navegação
  navegacao: {
    inicio: "Início",
    sobre: "Sobre",
    servicos: "Serviços",
    horarios: "Horários",
    contato: "Contato",
  },

  // Informações exibidas no cabeçalho do site (seção principal)
  perfil: {
    // Caminho da foto. Vazio = placeholder com a balança.
    foto: "/images/foto-perfil.jpg",
    eyebrow: "Advocacia",
    // Nome completo do advogado
    nome: "Cleber Moacir Gomes da Silva",
    // Título/cargo profissional
    titulo: "Advogado OAB/RS 134814",
    // Pequena frase de apresentação
    tagline: "Excelência, ética e compromisso com a justiça para defender os seus direitos.",
    botaoServicos: "Conheça os Serviços",
    botaoContato: "Entre em Contato",
  },

  // Seção "Sobre mim" / Biografia
  sobre: {
    eyebrow: "Quem sou",
    titulo: "Sobre Mim",
    biografia:
      "Cleber Moacir Gomes da Silva Advocacia, com registro na OAB/RS 134814, é especializado em oferecer soluções jurídicas personalizadas para nossos clientes. Atendemos com excelência em áreas como Direito de Família, Sucessões e Direito Civil, sempre priorizando o compromisso ético e a busca por resultados eficazes. Aqui, você encontra não apenas um advogado, mas um parceiro dedicado à sua causa."
  },

  // Seção "Serviços oferecidos"
  servicos: {
    eyebrow: "Especialidades",
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

  // Seção "Horários de atendimento" (os 7 dias são fixos)
  horarios: {
    eyebrow: "Atendimento",
    titulo: "Horários de Atendimento",
    nota: "Para agendar uma consulta, entre em contato pelo botão abaixo.",
    botaoWhatsapp: "Fale comigo no WhatsApp",
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

  // Contato / Redes sociais
  contato: {
    // Somente números, com DDI e DDD (ex.: 5551999999999)
    whatsapp: "555193524281",
    // Apenas o usuário, sem @
    instagram: "advogado.cleber",
  },

  // Rodapé
  rodape: {
    tituloNavegacao: "Navegação",
    tituloContato: "Contato",
    direitos: "Todos os direitos reservados.",
  },
};
