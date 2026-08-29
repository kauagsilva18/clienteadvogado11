# Portfólio de Advogado

Site de portfólio para um advogado, com tema claro/escuro e design formal.

## Como rodar

```bash
npm install
npm start
```

Acesse `http://localhost:3000`.

## Como editar as informações

Todas as informações editáveis ficam no arquivo **`config.js`** na raiz do projeto:

- **Nome, biografia, tagline** → seção `perfil` e `sobre`
- **Serviços** → seção `servicos` (adicione ou remova itens na lista)
- **Horários** → seção `horarios`
- **Links WhatsApp/Instagram** → seção `contato` (deixe "" enquanto não tiver o link)
- **Logo / título do site** → seção `site`

## Adicionar foto de perfil

1. Coloque sua foto em `public/images/` (ex.: `foto.jpg`)
2. No `config.js`, em `perfil.foto`, escreva o nome do arquivo (ex.: `"foto.jpg"`)

Enquanto não houver foto, aparece um placeholder elegante.

## Imagens de fundo

As imagens de fundo são SVG (vetoriais) em `public/images/justica.svg` e `public/images/justica2.svg`, com temática de advocacia (balança da justiça e colunas). Você pode substituí-las por fotos suas — basta manter o mesmo nome de arquivo (ou `.jpg`).

## Tema claro/escuro

O botão ☀/☾ no topo alterna o tema. A preferência é salva no navegador.
isto memsmo teste