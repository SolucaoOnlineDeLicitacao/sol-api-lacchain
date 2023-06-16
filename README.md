<h1 align="center">SOL - Sistema online de licitação API </h1>

## :computer: Requisitos

[![NodeJS](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)]((https://nodejs.org/en//))
[![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/install/#install-compose)

## Descriçao

Sol API.

## Instalação do PM2

Documentação PM2: https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/

Execute o comando:

```bash
$ npm install pm2@latest -g
```

## Executando o PM2

Execute o comando:

```bash
pm2 start npm --name "sol-api-dev" -- run "start:dev"
```

## Instalação

Acesse o diretório raiz da API e execute o comando.

```bash
$ npm install --force
```

## Rodar seed

Execute o comando:

```bash
$ npm run seed
```

## Preparar o ambiente

**1**. Acesse o diretório raiz da API e execute o comando abaixo:

``` sh
$ docker-compose up -d
```

> Para utilizar o Docker, é necessário abrir o arquivo docker-compose.yml e configurar a senha, nome da base, etc.

**2**. Crie um arquivo `.env` na pasta raiz da API com o seguinte formato:

``` sh
PORT=4002
NOSQL_CONNECTION_STRING=
JWT_KEY=
JWT_REFRESH_TOKEN_KEY=
JWT_ACCESS_TOKEN_EXPIRATION=
JWT_REFRESH_TOKEN_EXPIRATION=
ENCRYPT_KEY=
SENDGRID_EMAIL_SENDER=
SENDGRID_API_KEY=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

S3_BUCKET=

S3_BUCKET_DOCUMENTS=

S3_BUCKET_ANNOUNCEMENT_PHOTO=
```

| Descrição | Parâmetro |
| --- | --- |
| PORT | Porta em que a API será iniciada |
| NOSQL_CONNECTION_STRING | String de conexão com a base de dados, aqui deve ser adicionado o caminho publicado pelo docker compose. |
| JWT_KEY | Chave utilizada para a criptografia JWT |
| JWT_REFRESH_TOKEN_KEY | Chave utilizada para verificar a autenticidade dos Tokens de atualização JWT |
| JWT_ACCESS_TOKEN_EXPIRATION | Tempo de expiração do Token JWT |
| JWT_REFRESH_TOKEN_EXPIRATION | Tempo de expiração do Token de atualização JWT |
| ENCRYPT_KEY | Chave utilizada para a criptografia do Payload. Deve ser gerada pelo usuário e o mesmo deve estar de acordo com o frontend. |
| SENDGRID_EMAIL_SENDER | Email de origem para os serviços SendGrid |
| SENDGRID_API_KEY | Chave utilizada para autenticar e autorizar o acesso aos recursos do serviço SendGrid |
| AWS_REGION | Região do servidor AWS (Nulo caso não utilize AWS) |
| AWS_ACCESS_KEY_ID | Chave de acesso da AWS | 
| AWS_SECRET_ACCESS_KEY | Autenticador de acesso para serviços AWS |
| S3_BUCKET | Bucket de armazenamento da AWS (Opcional, podendo utilizar outro bucket) |
| S3_BUCKET_DOCUMENTS | Bucket de armazenamento da AWS (Opcional, podendo utilizar outro bucket) | 
| S3_BUCKET_ANNOUNCEMENT_PHOTO | Bucket de armazenamento da AWS (Opcional, podendo utilizar outro bucket) |

## Executando a API

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Documentação

Após executar a api acesse http://localhost:4002/docs

> O Link pode mudar de acordo com a porta utilizada.

## Testes

```bash

# end to end tests
$ npm run test:e2e

# end to end test watch
$ npm run test:e2e:watch

# test coverage
$ npm run test:e2e:cov

```

## Suporte

contact@tgtdigital.com
