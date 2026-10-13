const express = require('express');
const path = require('path');
const { store } = require('./lib/store');
const { links } = require('./lib/conteudo');
const painel = require('./lib/painel');

const app = express();
const PORT = process.env.PORT || 3000;

// Necessário no Render (proxy) para cookies seguros e IP real do visitante
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' blob:", // blob: = prévia da foto no painel
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const HOSTS_LOCAIS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

// Força HTTPS fora do ambiente local (/health fica de fora para os testes da plataforma)
app.use((req, res, next) => {
  if (req.secure || HOSTS_LOCAIS.has(req.hostname) || req.path === '/health') return next();
  res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
});

app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': CSP,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  });
  if (req.secure) res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { config: store.conteudo, links: links(store.conteudo) });
});

// Foto de perfil enviada pelo painel (a URL muda a cada novo envio)
app.get('/foto', async (req, res) => {
  const foto = await store.obterFoto();
  if (!foto) return res.sendStatus(404);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.type(foto.mime).send(foto.dados);
});

app.use('/painel', painel);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

store.iniciar().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
