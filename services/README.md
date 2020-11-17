# Food Giver Services

## Estrutura de pastas
```
services/            | raiz de services
  modules/           | raiz dos ms
    auth/            | pasta do ms de auth
    resources/       | pasta do ms de resources (por ex: tabelas do dynamo compartilhadas entre todos os ms), aqui irá todo o código da camada de comunicação com o banco
  shared/            | pasta com utilitários compartilhados, ex: integração com outros ms, etc.
  .eslintrc          | config do eslint global (cada ms terá um proprio por causa do webpack, porém este é o root)
  .gitignore         | config de ignore do git (webpack builda e gera uma pasta, pode ficar só aqui no root)
  package-lock.json  | 
  package.json       | 
```

Motivos:
- Para que seja possivel não duplicar código entre esses microservices
- Não estourar o limite de recursos em um unico serviço
- Mais agilidade na escrita de novos endpoints, por reutilizar muita coisa já criada, por ex: comunicação com a tabela X do dynamo
- Redução do tamanho do package do lambda final (mais agilidade no deploy e no coldstart do lambda também)

Observação: essa arquitetura transforma a API em um "microlítico", onde existe um ecossistema de microsserviços que se comunicam e compartilham código, porém com responsabilidades unicas.

### :warning: Tomar bastante cuidado nas diferenças abaixo:
- Na raíz é node normal (com CommonJS = require, module.exports)
- Dentro da pasta do ms com webpack são ESModules (import/export)

## Testes

### Geração de dados de testes

- https://www.4devs.com.br/gerador_de_pessoas