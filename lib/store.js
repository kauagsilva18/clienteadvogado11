// Armazenamento do conteúdo do site, da senha do painel e da foto.
// Em produção usa MongoDB (variável MONGODB_URI). Sem ela, grava
// arquivos JSON na pasta data/ — apenas para desenvolvimento local.
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const padrao = require('../config');
const { mesclarComPadrao } = require('./conteudo');

const INTERVALO_VERIFICACAO = 30 * 1000;

class ErroBanco extends Error {
  constructor() {
    super('Banco de dados indisponível. As alterações não foram salvas.');
  }
}

class BancoMongo {
  constructor(uri) {
    this.uri = uri;
    this.cliente = null;
  }

  async conectar() {
    if (this.cliente) await this.cliente.close().catch(() => {});
    this.cliente = new MongoClient(this.uri, { serverSelectionTimeoutMS: 5000 });
    await this.cliente.connect();
    this.colecao = this.cliente.db(process.env.MONGODB_DB || 'site_advogado').collection('site');
  }

  async ping() {
    await this.cliente.db('admin').command({ ping: 1 });
  }

  async ler(id) {
    return this.colecao.findOne({ _id: id }, { promoteBuffers: true });
  }

  async gravar(id, doc) {
    await this.colecao.replaceOne({ _id: id }, { _id: id, ...doc }, { upsert: true });
  }

  async apagar(id) {
    await this.colecao.deleteOne({ _id: id });
  }
}

class BancoArquivo {
  constructor(pasta) {
    this.pasta = pasta;
  }

  arquivo(id) {
    return path.join(this.pasta, `${id}.json`);
  }

  async conectar() {
    await fs.mkdir(this.pasta, { recursive: true });
  }

  async ping() {}

  async ler(id) {
    try {
      const doc = JSON.parse(await fs.readFile(this.arquivo(id), 'utf8'));
      if (doc.dadosBase64) doc.dados = Buffer.from(doc.dadosBase64, 'base64');
      return doc;
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }
  }

  async gravar(id, doc) {
    const copia = Buffer.isBuffer(doc.dados)
      ? { ...doc, dados: undefined, dadosBase64: doc.dados.toString('base64') }
      : doc;
    const temporario = this.arquivo(id) + '.tmp';
    await fs.writeFile(temporario, JSON.stringify(copia, null, 2));
    await fs.rename(temporario, this.arquivo(id));
  }

  async apagar(id) {
    await fs.rm(this.arquivo(id), { force: true });
  }
}

const store = {
  modo: process.env.MONGODB_URI ? 'mongo' : 'arquivo',
  online: false,
  conteudo: mesclarComPadrao(null),
  auth: null,
  fotoCache: undefined,
  banco: null,

  async iniciar() {
    this.banco = this.modo === 'mongo'
      ? new BancoMongo(process.env.MONGODB_URI)
      : new BancoArquivo(path.join(__dirname, '..', 'data'));
    if (this.modo === 'arquivo') {
      console.warn('MONGODB_URI não definida: usando a pasta data/ (apenas para desenvolvimento local).');
    }
    await this.conectar();
    setInterval(() => this.verificar(), INTERVALO_VERIFICACAO).unref();
  },

  async conectar() {
    try {
      await this.banco.conectar();
      await this.carregar();
      this.online = true;
    } catch (err) {
      this.online = false;
      console.error('Falha ao conectar ao banco de dados:', err.message);
    }
  },

  async verificar() {
    if (!this.online) return this.conectar();
    try {
      await this.banco.ping();
    } catch (err) {
      this.online = false;
      console.error('Banco de dados ficou indisponível:', err.message);
    }
  },

  async carregar() {
    const doc = await this.banco.ler('conteudo');
    if (!doc) await this.banco.gravar('conteudo', { dados: padrao });
    this.conteudo = mesclarComPadrao(doc && doc.dados);

    let auth = await this.banco.ler('auth');
    if (process.env.ADMIN_PASSWORD_RESET) {
      auth = { hash: await bcrypt.hash(process.env.ADMIN_PASSWORD_RESET, 10), versao: ((auth && auth.versao) || 0) + 1 };
      await this.banco.gravar('auth', auth);
      console.warn('Senha do painel redefinida por ADMIN_PASSWORD_RESET. Remova essa variável agora.');
    } else if (!auth && process.env.ADMIN_PASSWORD) {
      auth = { hash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10), versao: 1 };
      await this.banco.gravar('auth', auth);
    }
    this.auth = auth;
    this.fotoCache = undefined;
  },

  // Executa uma escrita no banco; se falhar, marca o banco como fora do ar.
  async escrever(operacao) {
    if (!this.online) throw new ErroBanco();
    try {
      return await operacao();
    } catch (err) {
      console.error('Erro ao gravar no banco de dados:', err.message);
      this.online = false;
      throw new ErroBanco();
    }
  },

  async salvarSecao(secao, valor) {
    const novo = JSON.parse(JSON.stringify(this.conteudo));
    novo[secao] = { ...novo[secao], ...valor };
    await this.escrever(() => this.banco.gravar('conteudo', { dados: novo }));
    this.conteudo = novo;
  },

  // Confere a senha do painel. Se o banco nunca carregou (fora do ar
  // desde a inicialização), aceita a senha da variável ADMIN_PASSWORD.
  async conferirSenha(senha) {
    if (this.auth) return bcrypt.compare(senha, this.auth.hash);
    if (!process.env.ADMIN_PASSWORD) return false;
    const resumo = (valor) => crypto.createHash('sha256').update(valor).digest();
    return crypto.timingSafeEqual(resumo(senha), resumo(process.env.ADMIN_PASSWORD));
  },

  versaoSenha() {
    return this.auth ? this.auth.versao : 0;
  },

  senhaConfigurada() {
    return Boolean(this.auth || process.env.ADMIN_PASSWORD);
  },

  async definirSenha(senha) {
    const auth = { hash: await bcrypt.hash(senha, 10), versao: this.versaoSenha() + 1 };
    await this.escrever(() => this.banco.gravar('auth', auth));
    this.auth = auth;
    return auth.versao;
  },

  async obterFoto() {
    if (this.fotoCache === undefined && this.online) {
      const doc = await this.banco.ler('foto');
      this.fotoCache = doc && doc.dados ? { mime: doc.mime, dados: doc.dados } : null;
    }
    return this.fotoCache || null;
  },

  async salvarFoto(mime, dados) {
    await this.escrever(() => this.banco.gravar('foto', { mime, dados }));
    this.fotoCache = { mime, dados };
    await this.salvarSecao('perfil', { foto: `/foto?v=${Date.now()}` });
  },

  async removerFoto() {
    await this.escrever(() => this.banco.apagar('foto'));
    this.fotoCache = null;
    await this.salvarSecao('perfil', { foto: '' });
  },
};

module.exports = { store, ErroBanco };
