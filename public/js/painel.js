// Painel administrativo: salvar seções, editar cards, foto e senha.
(function () {
  const TAMANHO_MAX_FOTO = 2 * 1024 * 1024;
  const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

  // ---------- Utilidades ----------
  async function enviar(url, opcoes) {
    let resposta;
    try {
      resposta = await fetch(url, opcoes);
    } catch (err) {
      throw new Error('Sem conexão com o servidor.');
    }
    if (resposta.status === 401) {
      window.location.reload();
      throw new Error('Sessão expirada.');
    }
    const dados = await resposta.json().catch(() => ({}));
    if (resposta.status === 503) definirBancoOnline(false);
    if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível salvar.');
    return dados;
  }

  function enviarJson(url, metodo, corpo) {
    return enviar(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
  }

  function mostrarStatus(el, texto, tipo) {
    el.textContent = texto;
    el.className = 'status' + (tipo ? ' status-' + tipo : '');
  }

  // ---------- Aviso de banco fora do ar ----------
  let bancoOnline = document.getElementById('avisoBanco').hidden;

  function definirBancoOnline(online) {
    bancoOnline = online;
    document.getElementById('avisoBanco').hidden = online;
    document.querySelectorAll('[data-requer-banco]').forEach((el) => {
      el.disabled = !online;
    });
  }

  setInterval(async () => {
    try {
      const resposta = await fetch('/painel/api/status');
      if (resposta.status === 401) return window.location.reload();
      const dados = await resposta.json();
      if (dados.online !== bancoOnline) definirBancoOnline(dados.online);
    } catch (err) {
      // Servidor inacessível: mantém o estado atual
    }
  }, 30000);

  // ---------- Alterações não salvas ----------
  const formsAlterados = new Set();

  function marcarAlterado(form) {
    formsAlterados.add(form);
    mostrarStatus(form.querySelector('.status'), 'Alterações não salvas', 'aviso');
  }

  window.addEventListener('beforeunload', (evento) => {
    if (formsAlterados.size) {
      evento.preventDefault();
      evento.returnValue = '';
    }
  });

  // ---------- Cards de serviço ----------
  const lista = document.getElementById('listaServicos');
  const modelo = document.getElementById('modeloServico');
  let proximoGrupo = 1000;

  function atualizarCards() {
    const cards = lista.querySelectorAll('.card-servico');
    cards.forEach((card, i) => {
      card.querySelector('.card-servico-num').textContent = 'Card ' + (i + 1);
      card.querySelector('[data-acao="subir"]').disabled = i === 0;
      card.querySelector('[data-acao="descer"]').disabled = i === cards.length - 1;
    });
  }

  document.getElementById('adicionarServico').addEventListener('click', () => {
    const fragmento = modelo.content.cloneNode(true);
    const grupo = 'icone-' + proximoGrupo++;
    fragmento.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.name = grupo;
    });
    lista.appendChild(fragmento);
    atualizarCards();
    marcarAlterado(lista.closest('form'));
    const novo = lista.lastElementChild;
    novo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    novo.querySelector('[data-card="titulo"]').focus({ preventScroll: true });
  });

  lista.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-acao]');
    if (!botao) return;
    const card = botao.closest('.card-servico');
    const acao = botao.dataset.acao;

    if (acao === 'subir' && card.previousElementSibling) {
      lista.insertBefore(card, card.previousElementSibling);
    } else if (acao === 'descer' && card.nextElementSibling) {
      lista.insertBefore(card.nextElementSibling, card);
    } else if (acao === 'remover') {
      const titulo = card.querySelector('[data-card="titulo"]').value || 'sem título';
      if (!window.confirm('Remover o card "' + titulo + '"?')) return;
      card.remove();
    } else {
      return;
    }
    atualizarCards();
    marcarAlterado(lista.closest('form'));
    if (acao !== 'remover') botao.focus();
  });

  atualizarCards();

  // ---------- Salvar seções ----------
  function coletar(form) {
    const dados = {};
    form.querySelectorAll('[data-chave]').forEach((campo) => {
      dados[campo.dataset.chave] = campo.value;
    });

    if (form.dataset.secao === 'servicos') {
      dados.lista = Array.from(lista.querySelectorAll('.card-servico')).map((card) => {
        const marcado = card.querySelector('input[type="radio"]:checked');
        return {
          icone: marcado ? marcado.value : '',
          titulo: card.querySelector('[data-card="titulo"]').value,
          descricao: card.querySelector('[data-card="descricao"]').value,
        };
      });
    }

    if (form.dataset.secao === 'horarios') {
      dados.lista = Array.from(form.querySelectorAll('[data-horario]')).map((campo) => campo.value);
    }

    return dados;
  }

  document.querySelectorAll('form[data-secao]').forEach((form) => {
    const status = form.querySelector('.status');
    const botao = form.querySelector('button[type="submit"]');

    form.addEventListener('input', () => marcarAlterado(form));
    form.addEventListener('change', () => marcarAlterado(form));

    form.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      botao.disabled = true;
      mostrarStatus(status, 'Salvando...');
      try {
        const resposta = await enviarJson('/painel/api/secao/' + form.dataset.secao, 'PUT', coletar(form));
        // Mostra os valores como foram gravados (ex.: WhatsApp normalizado)
        form.querySelectorAll('[data-chave]').forEach((campo) => {
          const valor = resposta.dados[campo.dataset.chave];
          if (typeof valor === 'string') campo.value = valor;
        });
        form.querySelectorAll('[data-link]').forEach((link) => {
          link.href = link.textContent = resposta.links[link.dataset.link];
        });
        formsAlterados.delete(form);
        mostrarStatus(status, 'Salvo ✓', 'ok');
      } catch (err) {
        mostrarStatus(status, err.message, 'erro');
      } finally {
        botao.disabled = !bancoOnline;
      }
    });
  });

  // ---------- Foto de perfil ----------
  const fotoArquivo = document.getElementById('fotoArquivo');
  const fotoPrevia = document.getElementById('fotoPrevia');
  const fotoPlaceholder = document.getElementById('fotoPlaceholder');
  const fotoSalvar = document.getElementById('fotoSalvar');
  const fotoCancelar = document.getElementById('fotoCancelar');
  const fotoRemover = document.getElementById('fotoRemover');
  const fotoStatus = document.getElementById('fotoStatus');
  let fotoAtual = fotoPrevia.hidden ? '' : fotoPrevia.getAttribute('src');
  let urlTemporaria = null;

  function exibirFoto(src) {
    fotoPrevia.hidden = !src;
    fotoPlaceholder.hidden = Boolean(src);
    if (src) fotoPrevia.src = src;
  }

  function limparSelecao() {
    if (urlTemporaria) URL.revokeObjectURL(urlTemporaria);
    urlTemporaria = null;
    fotoArquivo.value = '';
    fotoSalvar.hidden = true;
    fotoCancelar.hidden = true;
    fotoRemover.hidden = !fotoAtual;
  }

  fotoArquivo.addEventListener('change', () => {
    const arquivo = fotoArquivo.files[0];
    if (!arquivo) return;
    if (!TIPOS_FOTO.includes(arquivo.type)) {
      fotoArquivo.value = '';
      return mostrarStatus(fotoStatus, 'Formato não suportado. Use JPG, PNG ou WebP.', 'erro');
    }
    if (arquivo.size > TAMANHO_MAX_FOTO) {
      fotoArquivo.value = '';
      return mostrarStatus(fotoStatus, 'A foto deve ter no máximo 2 MB.', 'erro');
    }
    if (urlTemporaria) URL.revokeObjectURL(urlTemporaria);
    urlTemporaria = URL.createObjectURL(arquivo);
    exibirFoto(urlTemporaria);
    fotoSalvar.hidden = false;
    fotoCancelar.hidden = false;
    fotoRemover.hidden = true;
    mostrarStatus(fotoStatus, 'Prévia — clique em "Salvar foto" para publicar.', 'aviso');
  });

  fotoCancelar.addEventListener('click', () => {
    exibirFoto(fotoAtual);
    limparSelecao();
    mostrarStatus(fotoStatus, '');
  });

  fotoSalvar.addEventListener('click', async () => {
    const corpo = new FormData();
    corpo.append('foto', fotoArquivo.files[0]);
    fotoSalvar.disabled = true;
    mostrarStatus(fotoStatus, 'Enviando...');
    try {
      const resposta = await enviar('/painel/api/foto', { method: 'POST', body: corpo });
      fotoAtual = resposta.foto;
      exibirFoto(fotoAtual);
      limparSelecao();
      mostrarStatus(fotoStatus, 'Foto salva ✓', 'ok');
    } catch (err) {
      mostrarStatus(fotoStatus, err.message, 'erro');
    } finally {
      fotoSalvar.disabled = !bancoOnline;
    }
  });

  fotoRemover.addEventListener('click', async () => {
    if (!window.confirm('Remover a foto de perfil? O site passará a exibir o símbolo da balança.')) return;
    fotoRemover.disabled = true;
    try {
      await enviar('/painel/api/foto', { method: 'DELETE' });
      fotoAtual = '';
      exibirFoto('');
      limparSelecao();
      mostrarStatus(fotoStatus, 'Foto removida ✓', 'ok');
    } catch (err) {
      mostrarStatus(fotoStatus, err.message, 'erro');
    } finally {
      fotoRemover.disabled = !bancoOnline;
    }
  });

  // ---------- Troca de senha ----------
  const formSenha = document.getElementById('formSenha');

  formSenha.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const status = formSenha.querySelector('.status');
    const botao = formSenha.querySelector('button[type="submit"]');
    const campos = formSenha.elements;

    if (campos.nova.value !== campos.confirmacao.value) {
      return mostrarStatus(status, 'A confirmação não confere com a nova senha.', 'erro');
    }

    botao.disabled = true;
    mostrarStatus(status, 'Salvando...');
    try {
      await enviarJson('/painel/api/senha', 'POST', {
        atual: campos.atual.value,
        nova: campos.nova.value,
        confirmacao: campos.confirmacao.value,
      });
      formSenha.reset();
      mostrarStatus(status, 'Senha alterada ✓', 'ok');
    } catch (err) {
      mostrarStatus(status, err.message, 'erro');
    } finally {
      botao.disabled = !bancoOnline;
    }
  });
})();
