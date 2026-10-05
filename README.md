# Portfólio de Advogado

Site de portfólio para um advogado, com tema claro/escuro e design formal.

## Como rodar

```bash
npm install
npm start
```

Acesse `http://localhost:3000`.

## Painel administrativo

Todo o conteúdo do site (textos, biografia, cards de serviços, horários, WhatsApp, Instagram e foto) é editado pelo painel em **`/painel`** (ex.: `https://seu-site.onrender.com/painel`). Não há nenhum link para ele no site; acesse digitando o endereço. O painel não é indexado pelo Google.

O arquivo `config.js` contém apenas o **conteúdo padrão**, usado para preencher o banco na primeira execução e como reserva se o banco ficar fora do ar.

### Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `MONGODB_URI` | Sim (produção) | Conexão com o MongoDB Atlas. Sem ela, os dados vão para a pasta `data/` (apenas para desenvolvimento local). |
| `ADMIN_PASSWORD` | Sim | Senha inicial do painel. Depois de trocada pelo painel, passa a valer a senha salva no banco. |
| `ADMIN_PASSWORD_RESET` | Não | Use apenas se esquecer a senha: defina a nova senha aqui, reinicie o serviço, entre no painel e **apague a variável**. |
| `MONGODB_DB` | Não | Nome do banco (padrão: `site_advogado`). |
| `SESSION_SECRET` | Não | Chave das sessões. Se não for definida, uma aleatória é gerada a cada reinício. |

### Configurar o MongoDB Atlas (gratuito)

1. Crie uma conta em <https://www.mongodb.com/cloud/atlas> e crie um cluster **M0 (Free)**.
2. Em **Database Access**, crie um usuário com senha.
3. Em **Network Access**, adicione o IP `0.0.0.0/0` (o Render não tem IP fixo no plano gratuito).
4. Em **Connect → Drivers**, copie a string de conexão (`mongodb+srv://usuario:senha@...`), substituindo `<password>` pela senha do usuário.
5. No Render, em **Environment**, adicione `MONGODB_URI` com essa string e `ADMIN_PASSWORD` com a senha inicial do painel. Salve para o serviço reiniciar.

### Observações

- Sessões ficam na memória do servidor: após um deploy ou reinício do Render é preciso entrar no painel novamente.
- Depois de 5 senhas erradas, o acesso fica bloqueado por 15 minutos para aquele IP.
- Se o banco ficar fora do ar, o site continua funcionando com o último conteúdo carregado (ou o padrão) e o painel exibe um aviso, sem permitir salvar.

## Imagens de fundo

As imagens de fundo são SVG (vetoriais) em `public/images/justica.svg` e `public/images/justica2.svg`, com temática de advocacia (balança da justiça e colunas). Você pode substituí-las por fotos suas — basta manter o mesmo nome de arquivo (ou `.jpg`).

## Tema claro/escuro

O botão ☀/☾ no topo alterna o tema. A preferência é salva no navegador.
isto memsmo teste