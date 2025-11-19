# 🖥️ Pirambu Innovation — Frontend

FrontEnd do Pirambu Innovation, desenvolvido com **HTML, CSS e JavaScript**.  

[Pirambu Innovation(testes)](https://pirambuweb-testes.netlify.app/).

## Rodando localmente

Primeiro, clone o projeto
```bash
git clone https://github.com/Bebel132/Pirambu-Innovation-web.git
```

Entre na pasta clonada e abra o arquivo **index.html**

## AJUSTE NA ROTA DA API

Como não existe *.env* no em projetos js vanilla, existe um arquivo chamado **config.js** que guarda a rota da api que vão ser feitos os requests. Por questão de segurança, a api que está no remoto só aceita requests do netlify, então é preciso rodar a [api](https://github.com/Bebel132/Pirambu-Innovation-api/tree/tests). localmente para poder fazer request