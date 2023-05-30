# Contacts-book-API

É uma API RESTful desenvolvida utilizando Node.js, Express, TypeORM e PostgreSQL para gerenciar uma agenda de contatos.
Esta API é utilizada em produção na aplicação [Contacts-Book](https://contacts-books-pi.vercel.app/), a qual pode ter seu repositório acessado neste [link](https://github.com/AntonioSantosBJPE/contacts-books-frontend) .
A API permite que os usuários se cadastrem como clientes, façam login na aplicação, atualizem suas informações de perfil e gerenciem sua lista de contatos. Os usuários podem criar, atualizar, excluir e listar todos os contatos. 

---

## Tabela de Conteúdos

- [Visão Geral](#1-visão-geral)
- [Diagrama ER](#2-diagrama-er)
- [Início Rápido](#3-início-rápido)
  - [Instalando Dependências](#31-instalando-dependências)
  - [Variáveis de Ambiente](#32-variáveis-de-ambiente)
  - [Migrations](#33-migrations)
  - [Rodando a API](#34-rodando-a-api)
  - [Testes](#35-testes)
- [Documentação da API](#4-documentação-da-api)
- [Estrutura da API](#5-estrutura-da-api)
  
---

## 1. Visão Geral
O projeto foi desenvolvido totalmente em typescript, utilizando o node.Js, e o framwwork escolhido para o desenvolvimento foi o express. 
Para realizar a serialização dos dados, das requisições, foi utilizado a biblioteca zod, e no que diz respeito a banco de dados a escolha foi
por utilizar um banco de dados relacional, o postgres, onde as consultas eram gerenciadas pelo o typeORM. 
A aplicação conta com testes de integração em todas as rotas que foram feitos utilizando jest e supertest.
Para realizar o deploy do projeto foi escolhido o render, tanto para o banco de dados, quanto para o servidor.
Segue os links para mais informações sobre as tecnologias utilizadas:
- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Zod](https://zod.dev/)

---

## 2. Diagrama ER
Diagrama ER da API definindo bem as relações entre as tabelas do banco de dados.

![Diagrama do projeto com suas relações!](https://i.ibb.co/4TdLLwX/contact-book-DER-drawio.png "Contacts-Book-Diragrama")

---

## 3. Início rapído
[ Voltar para o topo ](#documentação-da-api)

### 3.1. Instalando dependências

Clone o projeto em sua máquina e instale as dependências com o comando:

```
yarn install ou yarn
```

Utilizando npm

```
npm install
```

### 3.2. Variáveis de Ambiente
Em seguida, crie um arquivo **.env**, copiando o formato do arquivo **.env.example**:

```
cp .env.example .env
```

Configure suas variáveis de ambiente com suas credenciais do Postgres e uma nova database da sua escolha.

### 3.3. Migrations
Suba suas migrations com o comando:

```
yarn run typeorm migration:run -- -d ./src/data-source
```

### 3.4. Rodando a API

Para rodar a API localmente use o comando:

```
yarn run dev
```

Segue abaixo os comandos para a build do projeto:

```
yarn run build
```

```
yarn typeorm migration:run -d dist/data-source
```

```
yarn run start
```

### 3.5. Testes
Execute o seguinte comando no terminal:

```
yarn run test
```

Você pode tambem rodar os testes individualmente:

```
yarn run test <Nome do arquivo.router.spec.ts>
```

---

## 4. Documentação da API

[ Voltar para o topo ](#tabela-de-conteúdos)

É possivel acessar a documentação da API criada com Swagger de forma local utilizando o endpoint /api-docs/ ou pelo link ([Contacts-Book-Documentação-local](http://localhost:3000/api-docs/#/)) , lembrando que é necessário que o servidor esteja rodando de forma local, para o link funcionar.
Essa documentação descreve os recusos que a API possuí, como Endpoints, exemplos de requisição, exemplos de retorno e metodos de autenticação.
Também é possível acessar a documentação da API pelos seguintes links:

- [Contacts-Book-Documentação-em-produção](https://contacts-book-api-6ydl.onrender.com/api-docs/)
- [Contacts-Book-Documentação-site-swagger](https://app.swaggerhub.com/apis-docs/CONTACTSBOOKSDEPLOY_1/Contacts-Book-API/1.0.0)

---

## 5. Estrutura da API

[ Voltar para o topo ](#tabela-de-conteúdos)

### Índice

- [Clients](#1-clients)
    - POST - /clients
    - GET - /clients/profile/:clientId
    - PATCH - /clients/profile/:clientId
    - DELETE - /clients/profile/:clientId
    - GET - /clients/profile/:clientId/contacts
    - GET - /clients/profile/
    - POST - /login
- [Contacts](#2-contacts)
    - POST - /contacts
    - GET - /contacts/:contactId
    - PATCH - /contacts/:contactId
    - DELETE - /contacts/:contacttId
 
---

## 1. **Clients**
[ Voltar para a Estrutura da API ](#5-estrutura-da-api)

O objeto Client é definido como:

| Campo      | Tipo   | Descrição                                     |
| -----------|--------|-------------------------------------------------|
| id         | UUID   | Identificador único do cliente                  |
| name       | string | O nome do cliente.                              |
| email      | string | O e-mail do cliente.                            |
| phone      | string | O telefone do cliente.                          |
| password   | string | A senha de acesso do cliente                    |
| createdAt  | string | A data de registro do cliente                   |
| updatedAt  | string | A data de atualiazação do registro do cliente   |
| deletedAt  | string | A data de deleção do registro do cliente        |

### Endpoints

| Método   | Rota       | Descrição                               |
|----------|------------|-----------------------------------------|
| POST     | /clients   | Criação de um cliente.                  |
| POST     |  /login | Login com um cliente.             |
| GET      | /clients/profile/ | Lista os dados do cliente logado|
| GET      | /clients/profile/:clientId  | Lista os dados do cliente logado a partir do seu id| 
| PATCH     | /clients/profile/:clientId  | Atualiza os dados de um cliente.   |
| DELETE     | /clients/profile/:clientId  | Realiza um softdelete em um usuário   |
| GET     | /clients/profile/:clientId/contacts | Lista todos os contatos cadastrados pelo cliente  |
---



## 2. **Contacts**
[ Voltar para a Estrutura da API ](#5-estrutura-da-api)

O objeto Contacts é definido como:

| Campo      | Tipo   | Descrição                                     |
| -----------|--------|-------------------------------------------------|
| id         | UUID   | Identificador único do contato                  |
| name       | string | O nome do contato.                              |
| email      | string | O e-mail do contato.                            |
| phone      | string | O telefone do contato.                          |
| createdAt  | string | A data de registro do contato                   |
| updatedAt  | string | A data de atualiazação do registro do contato   |
| deletedAt  | string | A data de deleção do registro do contato        |

### Endpoints

| Método   | Rota       | Descrição                               |
|----------|------------|-----------------------------------------|
| POST     | /contacts  | Criação de um contato.                  |
| GET      | /contacts/:contactId | Lista os dados do contato a partir do seu id| 
| PATCH     | /contacts/:contactId | Atualiza os dados de um contato.   |
| DELETE     | /contacts/:contactId | Apaga os dados de um contato|


---

## Autor

- [@Antonio Santos](https://github.com/AntonioSantosBJPE)


