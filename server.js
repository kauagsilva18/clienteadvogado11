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
