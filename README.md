# Food Giver

|Deploy|Coverage|
|------|--------|
|[![Deploy de Produção](https://github.com/sergioflores-j/food-giver/workflows/deploy/badge.svg?branch=master&label=Production)](https://github.com/sergioflores-j/food-giver/actions?query=branch%3Amaster)|TODO


![image](./app/src/assets/logo.jpeg)

[Acessar a aplicação](https://d6x206yew963j.cloudfront.net)

TODO: descrever mais detalhes da aplicação aqui

## Estrutura do projeto

TODO

## Desenvolvimento

### Primeiros passos

- Instalando as dependências:
```bash
npm run install-all
```

- Iniciando os serviços e a aplicação
```bash
npm run all
```

### Comandos disponíveis

TODO: descrever comandos após serem criados

### Dependências externas

Essas dependências devem estar previamente instaladas na máquina antes de começar a interagir com o projeto.

- Node v12.x+
- Java v8+

### Criando um novo service `module`

Arquivos a serem alterados:

- dev.serverless.env.json (alocar uma nova porta) - TODO: deixar dinâmico
- services/package.json (adicionar no script) - TODO: deixar dinâmico
- services/module/<novo_nome>/serverless.yml (alterar nome do serviço, trocar rotas, etc) - TODO: criar script para criar sozinho
- services/module/<novo_nome>/package.json (alterar nome) - TODO: criar script para criar sozinho
- services/module/<novo_nome>/test/serverless.test.js (alterar nome do serviço) - TODO: criar script para criar sozinho

Obs: arquivos em `services/module/<novo_nome>` devem ser copiados de outro module existente.