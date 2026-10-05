// Rotas do painel administrativo (/painel).
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const { store, ErroBanco } = require('./store');
const { ICONES, SECOES, CAMPOS, ErroValidacao, validarSecao, links } = require('./conteudo');

const OITO_HORAS = 8 * 60 * 60 * 1000;
const MAX_TENTATIVAS = 5;
const TEMPO_BLOQUEIO = 15 * 60 * 1000;
const TAMANHO_MAX_FOTO = 2 * 1024 * 1024;
const TAMANHO_MIN_SENHA = 6;

const router = express.Router();

router.use((req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'no-store');
  next();
});

router.use(session({
  name: 'painel.sid',
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { path: '/painel', httpOnly: true, sameSite: 'strict', secure: 'auto', maxAge: OITO_HORAS },
}));

// ---------- Bloqueio por tentativas erradas (por IP) ----------
const tentativas = new Map();

function minutosBloqueado(ip) {
  const registro = tentativas.get(ip);
  if (!registro || !registro.bloqueadoAte) return 0;
  const restante = registro.bloqueadoAte - Date.now();
  if (restante <= 0) {
    tentativas.delete(ip);
    return 0;
  }
  return Math.ceil(restante / 60000);
}

function registrarFalha(ip) {
  const registro = tentativas.get(ip) || { falhas: 0, bloqueadoAte: 0 };
  registro.falhas += 1;
  if (registro.falhas >= MAX_TENTATIVAS) {
    registro.falhas = 0;
    registro.bloqueadoAte = Date.now() + TEMPO_BLOQUEIO;
  }
  tentativas.set(ip, registro);
}

setInterval(() => {
  for (const ip of tentativas.keys()) minutosBloqueado(ip);
}, TEMPO_BLOQUEIO).unref();

function mensagemBloqueio(minutos) {
  return `Muitas tentativas erradas. Tente novamente em ${minutos} minuto${minutos > 1 ? 's' : ''}.`;
}

// ---------- Sessão ----------
function autenticado(req) {
  return Boolean(req.session.autenticado) && req.session.versao === store.versaoSenha();
}

function exigirLogin(req, res, next) {
  if (autenticado(req)) return next();
  res.status(401).json({ erro: 'Sua sessão expirou. Entre novamente.' });
}

// ---------- Páginas ----------
router.get('/', (req, res) => {
  if (!autenticado(req)) {
    return res.render('painel/login', { erro: null, senhaConfigurada: store.senhaConfigurada() });
  }
  res.render('painel/index', {
    conteudo: store.conteudo,
    links: links(store.conteudo),
    icones: ICONES,
    limites: CAMPOS,
    online: store.online,
    modo: store.modo,
  });
});

router.post('/login', express.urlencoded({ extended: false }), async (req, res, next) => {
  const renderErro = (status, erro) =>
    res.status(status).render('painel/login', { erro, senhaConfigurada: store.senhaConfigurada() });

  const minutos = minutosBloqueado(req.ip);
  if (minutos) return renderErro(429, mensagemBloqueio(minutos));

  const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
  if (!senha || !(await store.conferirSenha(senha))) {
    registrarFalha(req.ip);
    const bloqueio = minutosBloqueado(req.ip);
    return renderErro(bloqueio ? 429 : 401, bloqueio ? mensagemBloqueio(bloqueio) : 'Senha incorreta.');
  }

  tentativas.delete(req.ip);
  req.session.regenerate((err) => {
    if (err) return next(err);
    req.session.autenticado = true;
    req.session.versao = store.versaoSenha();
    res.redirect('/painel');
  });
});

router.post('/sair', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('painel.sid', { path: '/painel' });
    res.redirect('/painel');
  });
});

// ---------- API ----------
router.use('/api', exigirLogin);

router.get('/api/status', (req, res) => {
  res.json({ online: store.online });
});

router.put('/api/secao/:secao', express.json({ limit: '200kb' }), async (req, res) => {
  const { secao } = req.params;
  if (!SECOES.includes(secao)) return res.status(404).json({ erro: 'Seção desconhecida.' });
  const valor = validarSecao(secao, req.body);
  await store.salvarSecao(secao, valor);
  res.json({ ok: true, dados: store.conteudo[secao], links: links(store.conteudo) });
});

// Identifica o tipo real da imagem pelos primeiros bytes do arquivo
function tipoDaImagem(buffer) {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANHO_MAX_FOTO, files: 1 },
});

router.post('/api/foto', upload.single('foto'), async (req, res) => {
  if (!req.file) throw new ErroValidacao('Nenhuma imagem enviada.');
  const mime = tipoDaImagem(req.file.buffer);
  if (!mime) throw new ErroValidacao('Formato não suportado. Envie uma imagem JPG, PNG ou WebP.');
  await store.salvarFoto(mime, req.file.buffer);
  res.json({ ok: true, foto: store.conteudo.perfil.foto });
});

router.delete('/api/foto', async (req, res) => {
  await store.removerFoto();
  res.json({ ok: true, foto: '' });
});

router.post('/api/senha', express.json(), async (req, res) => {
  const minutos = minutosBloqueado(req.ip);
  if (minutos) return res.status(429).json({ erro: mensagemBloqueio(minutos) });

  const { atual, nova, confirmacao } = req.body || {};
  if (typeof atual !== 'string' || typeof nova !== 'string' || typeof confirmacao !== 'string') {
    throw new ErroValidacao('Preencha todos os campos.');
  }
  if (!(await store.conferirSenha(atual))) {
    registrarFalha(req.ip);
    return res.status(400).json({ erro: 'A senha atual está incorreta.' });
  }
  if (nova.length < TAMANHO_MIN_SENHA) {
    throw new ErroValidacao(`A nova senha precisa ter pelo menos ${TAMANHO_MIN_SENHA} caracteres.`);
  }
  if (nova !== confirmacao) throw new ErroValidacao('A confirmação não confere com a nova senha.');

  // A versão nova invalida todas as outras sessões abertas
  req.session.versao = await store.definirSenha(nova);
  res.json({ ok: true });
});

// ---------- Erros ----------
router.use((err, req, res, next) => {
  if (err instanceof ErroValidacao) return res.status(400).json({ erro: err.message });
  if (err instanceof ErroBanco) return res.status(503).json({ erro: err.message });
  if (err instanceof multer.MulterError) {
    const erro = err.code === 'LIMIT_FILE_SIZE' ? 'A foto deve ter no máximo 2 MB.' : 'Envio de arquivo inválido.';
    return res.status(400).json({ erro });
  }
  if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }
  next(err);
});

module.exports = router;
