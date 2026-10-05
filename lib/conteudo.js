// Regras do conteúdo editável: quais campos cada seção aceita,
// validação do que chega do painel e montagem dos links de contato.
const padrao = require('../config');

const ICONES = [
  { id: 'icon-pensao.svg', nome: 'Pensão' },
  { id: 'icon-guarda.svg', nome: 'Guarda' },
  { id: 'icon-visitas.svg', nome: 'Visitas' },
  { id: 'icon-divorcio.svg', nome: 'Divórcio' },
  { id: 'icon-paternidade.svg', nome: 'Paternidade' },
  { id: 'icon-honra.svg', nome: 'Honra' },
  { id: 'icon-consumidor.svg', nome: 'Consumidor' },
  { id: 'icon-protetiva.svg', nome: 'Protetiva' },
  { id: 'icon-justica.svg', nome: 'Justiça' },
];

const DIAS = padrao.horarios.lista.map((item) => item.dia);

// Campos de texto de cada seção e o tamanho máximo de cada um
const CAMPOS = {
  site: { logo: 120, titulo: 160 },
  navegacao: { inicio: 40, sobre: 40, servicos: 40, horarios: 40, contato: 40 },
  perfil: { eyebrow: 60, nome: 120, titulo: 120, tagline: 400, botaoServicos: 60, botaoContato: 60 },
  sobre: { eyebrow: 60, titulo: 120, biografia: 5000 },
  servicos: { eyebrow: 60, titulo: 120 },
  horarios: { eyebrow: 60, titulo: 120, nota: 300, botaoWhatsapp: 60 },
  contato: { whatsapp: 20, instagram: 60 },
  rodape: { tituloNavegacao: 60, tituloContato: 60, direitos: 200 },
};

const SECOES = Object.keys(CAMPOS);

class ErroValidacao extends Error {}

function texto(valor, max, rotulo) {
  if (typeof valor !== 'string') throw new ErroValidacao(`Campo "${rotulo}" inválido.`);
  const limpo = valor.trim();
  if (limpo.length > max) throw new ErroValidacao(`Campo "${rotulo}" passa de ${max} caracteres.`);
  return limpo;
}

function normalizarWhatsapp(valor) {
  let digitos = valor.replace(/\D/g, '');
  // Número brasileiro digitado sem o DDI (DDD + número)
  if (digitos.length === 10 || digitos.length === 11) digitos = '55' + digitos;
  if (digitos && (digitos.length < 12 || digitos.length > 15)) {
    throw new ErroValidacao('Número de WhatsApp inválido. Use DDD + número, ex.: 51 99999-9999.');
  }
  return digitos;
}

function normalizarInstagram(valor) {
  const usuario = valor
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '');
  if (usuario && !/^[A-Za-z0-9._]{1,30}$/.test(usuario)) {
    throw new ErroValidacao('Usuário do Instagram inválido.');
  }
  return usuario;
}

// Recebe o corpo enviado pelo painel para uma seção e devolve
// o objeto limpo que será salvo. Lança ErroValidacao se algo estiver errado.
function validarSecao(secao, corpo) {
  if (!SECOES.includes(secao)) throw new ErroValidacao('Seção desconhecida.');
  if (!corpo || typeof corpo !== 'object') throw new ErroValidacao('Dados inválidos.');

  const resultado = {};
  for (const [campo, max] of Object.entries(CAMPOS[secao])) {
    resultado[campo] = texto(corpo[campo] ?? '', max, campo);
  }

  if (secao === 'contato') {
    resultado.whatsapp = normalizarWhatsapp(resultado.whatsapp);
    resultado.instagram = normalizarInstagram(resultado.instagram);
  }

  if (secao === 'servicos') {
    if (!Array.isArray(corpo.lista) || corpo.lista.length > 30) {
      throw new ErroValidacao('Lista de serviços inválida.');
    }
    const icones = ICONES.map((icone) => icone.id);
    resultado.lista = corpo.lista.map((item, i) => {
      const card = {
        icone: icones.includes(item && item.icone) ? item.icone : 'icon-justica.svg',
        titulo: texto(item && item.titulo, 120, `título do card ${i + 1}`),
        descricao: texto(item && item.descricao, 1000, `descrição do card ${i + 1}`),
      };
      if (!card.titulo) throw new ErroValidacao(`O card ${i + 1} precisa de um título.`);
      return card;
    });
  }

  if (secao === 'horarios') {
    if (!Array.isArray(corpo.lista) || corpo.lista.length !== DIAS.length) {
      throw new ErroValidacao('Lista de horários inválida.');
    }
    resultado.lista = DIAS.map((dia, i) => ({ dia, horario: texto(corpo.lista[i], 60, `horário de ${dia}`) }));
  }

  return resultado;
}

// Junta o conteúdo salvo com o padrão, para que campos novos
// (adicionados ao config.js depois) sempre tenham valor.
function mesclarComPadrao(salvo) {
  const conteudo = JSON.parse(JSON.stringify(padrao));
  if (!salvo) return conteudo;
  for (const secao of Object.keys(conteudo)) {
    if (salvo[secao] && typeof salvo[secao] === 'object') {
      Object.assign(conteudo[secao], salvo[secao]);
    }
  }
  return conteudo;
}

function links(conteudo) {
  const { whatsapp, instagram } = conteudo.contato;
  return {
    whatsapp: whatsapp ? `https://wa.me/${whatsapp}` : '#',
    instagram: instagram ? `https://www.instagram.com/${instagram}` : '#',
  };
}

module.exports = { ICONES, DIAS, SECOES, CAMPOS, ErroValidacao, validarSecao, mesclarComPadrao, links };
