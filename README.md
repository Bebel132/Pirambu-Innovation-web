# 🖥️ Pirambu Innovation — Frontend

Frontend do **Pirambu Innovation**, desenvolvido utilizando **HTML, CSS e JavaScript puro (Vanilla JS)**.

O projeto disponibiliza uma página pública para visitantes e um painel administrativo para gerenciamento de conteúdo, consumindo uma API REST desenvolvida em Flask.

### Links

- 🌐 **Site:** https://pirambuweb.netlify.app/
- 🔒 **Painel administrativo:** https://pirambuweb.netlify.app/pages/admin
- ⚙️ **Backend:** https://github.com/Bebel132/Pirambu-Innovation-api

---

# Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES Modules)
- Fetch API
- Google OAuth (via backend)
- HTTP Cache (Cache-Control e ETag)

---

# Funcionalidades

## Área pública

A área pública permite que qualquer visitante acesse informações do projeto, incluindo:

- Cursos
- Projetos
- Eventos
- Notícias
- Biografia
- Página institucional
- Apoie o projeto

Todo o conteúdo é obtido dinamicamente através da API.

---

## Painel administrativo

Após autenticação utilizando uma conta Google autorizada, o usuário pode administrar todo o conteúdo do site.

Entre as funcionalidades estão:

- Cadastro de cursos
- Cadastro de notícias
- Cadastro de eventos
- Cadastro de projetos
- Atualização da biografia
- Gerenciamento dos usuários autorizados
- Exclusão de registros

---

# Rodando localmente

Clone o repositório:

```bash
git clone https://github.com/Bebel132/Pirambu-Innovation-web.git

cd Pirambu-Innovation-web
```

Como o projeto foi desenvolvido em JavaScript puro, não existe etapa de build nem instalação de dependências.

Basta servir os arquivos utilizando qualquer servidor HTTP.

Exemplo utilizando Python:

```bash
python -m http.server 5500
```

Ou utilizando a extensão **Live Server** do VSCode.

---

# Configuração da API

Toda a comunicação com o backend utiliza a constante `API_URL`, localizada em:

```
assets/config.js
```

Durante o desenvolvimento, altere para sua API local:

```javascript
export const API_URL = "http://127.0.0.1:5000";
```

Em produção:

```javascript
export const API_URL = "https://seu-endpoint.trycloudflare.com";
```

> A API em produção possui CORS configurado para aceitar apenas o domínio oficial hospedado no Netlify. Para desenvolvimento local, recomenda-se executar também a API localmente.

---

# Arquitetura

A aplicação foi organizada em módulos independentes, separando responsabilidades mesmo utilizando JavaScript puro.

## Estrutura geral

```
assets/
│
├── apiHelper.js
├── config.js
├── markdown.js
├── markdownMenu.js
└── imgs/

pages/
│
├── admin/
└── visitor/
```

---

## assets

Contém recursos compartilhados por toda a aplicação.

```
assets/

apiHelper.js
```

Centraliza todas as requisições HTTP da aplicação.

Responsabilidades:

- comunicação com a API;
- tratamento de erros;
- envio automático de cookies de autenticação;
- tratamento de respostas JSON, texto e imagens;
- controle do indicador de carregamento.

```
config.js
```

Armazena a URL da API utilizada pelo frontend.

```
markdown.js
markdownMenu.js
```

Responsáveis pela renderização dos conteúdos em Markdown.

```
imgs/
```

Recursos estáticos utilizados em toda a aplicação.

---

## Área pública

```
pages/visitor/
```

Contém todas as páginas acessíveis aos visitantes.

Cada página possui:

- HTML
- CSS
- JavaScript

Além disso, existe uma pasta de scripts responsável pela lógica da aplicação.

```
visitor/

scripts/

aboutUs.js
courses.js
courses-details.js
events.js
eventos-details.js
news.js
news-details.js
projects.js
project-details.js
...
```

Esses módulos realizam:

- consumo da API;
- renderização dos dados;
- atualização dinâmica da interface.

---

## Painel administrativo

```
pages/admin/
```

O painel administrativo foi dividido em módulos independentes.

Cada módulo possui sua própria estrutura.

Exemplo:

```
courses/

courses.html
courses.css
index.js

scripts/

dom.js
events.js
navigation.js
state.js

services/

courseService.js

ui/

form.js
list.js
preview.js
```

A mesma organização é utilizada para:

- Courses
- Events
- News
- Biography

---

## Responsabilidade de cada módulo

### index.js

Ponto de entrada da página.

Responsável por inicializar toda a aplicação daquele módulo.

---

### dom.js

Centraliza todas as referências aos elementos HTML.

Evita chamadas repetidas de `querySelector()` espalhadas pelo código.

---

### state.js

Gerencia o estado da aplicação.

Mantém informações como:

- item selecionado;
- listas carregadas;
- modo de edição;
- dados temporários.

---

### events.js

Responsável por registrar todos os eventos da interface.

Exemplo:

- clique em botões;
- alteração de formulários;
- ações do usuário.

---

### navigation.js

Controla a navegação entre telas e componentes do módulo.

---

### services/

Contém toda a comunicação com a API.

Cada serviço é responsável apenas por realizar requisições HTTP relacionadas ao seu domínio.

Exemplo:

```
courseService.js
```

- listar cursos;
- cadastrar;
- editar;
- excluir.

---

### ui/

Contém os componentes responsáveis pela renderização da interface.

Exemplos:

- formulários;
- listas;
- pré-visualizações.

Essa separação reduz o acoplamento entre regras de negócio e manipulação do DOM.

---

# Autenticação

O login é realizado através do Google OAuth implementado pelo backend.

O frontend apenas inicia o fluxo de autenticação.

Após o login, a API cria uma sessão utilizando cookies HTTP.

Esses cookies são enviados automaticamente em todas as requisições protegidas, permitindo acesso ao painel administrativo sem armazenamento de tokens no navegador.

---

# Cache e performance

Uma das otimizações implementadas foi o uso do cache HTTP para imagens.

Inicialmente o carregamento era realizado através de:

```javascript
fetch(...)
Blob(...)
URL.createObjectURL(...)
```

Esse processo impedia que o navegador utilizasse todo o seu mecanismo nativo de cache.

Após a refatoração, as imagens passaram a ser carregadas diretamente pelos seus endpoints:

```javascript
img.src = `${API_URL}/projects/${id}/file`;
```

Como a API retorna cabeçalhos HTTP como:

- Cache-Control
- ETag
- 304 Not Modified

o próprio navegador passou a controlar automaticamente o cache dos arquivos, reduzindo requisições desnecessárias e tornando o carregamento das páginas significativamente mais rápido.

---

# Organização da aplicação

O projeto procura separar responsabilidades de maneira semelhante à arquitetura utilizada por frameworks modernos, mesmo sendo desenvolvido em JavaScript puro.

A divisão geral é:

- **assets** → recursos compartilhados
- **visitor** → páginas públicas
- **admin** → painel administrativo
- **services** → comunicação com a API
- **ui** → componentes de interface
- **state** → gerenciamento de estado
- **events** → eventos da aplicação
- **dom** → acesso aos elementos HTML

Essa organização torna a manutenção mais simples, reduz o acoplamento entre módulos e facilita a evolução do projeto sem depender de frameworks como React, Vue ou Angular.
