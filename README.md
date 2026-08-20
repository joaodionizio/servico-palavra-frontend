# Serviço da Palavra — Frontend

Frontend da plataforma **Serviço da Palavra**, uma aplicação web full stack voltada à formação bíblica e espiritual.

A aplicação foi desenvolvida com **Next.js, React e TypeScript** e consome uma API REST própria construída em **ASP.NET Core (.NET 8)**.

## 🚀 Tecnologias

* Next.js
* React
* TypeScript
* Tailwind CSS
* API REST
* Autenticação via cookies HttpOnly
* CSRF
* Git e GitHub

## 💻 Funcionalidades

Entre as funcionalidades implementadas estão:

* Cadastro e login de usuários
* Controle de sessão e autenticação
* Dashboard
* Visualização de conteúdos
* Favoritos
* Acompanhamento de progresso
* Plano bíblico
* Área administrativa
* Comunicação com API REST em ASP.NET Core
* Controle de acesso de acordo com perfil do usuário

## 🔗 Backend

O backend da aplicação foi desenvolvido separadamente utilizando:

* ASP.NET Core (.NET 8)
* Entity Framework Core
* PostgreSQL
* ASP.NET Core Identity
* Cookies HttpOnly
* Proteção CSRF

Repositório:

https://github.com/joaodionizio/servico-palavra-backend

## 🏗️ Arquitetura

O frontend utiliza o **App Router do Next.js** e se comunica com a API REST responsável por autenticação, persistência de dados e regras de negócio.

A autenticação é baseada em cookies HttpOnly. Para operações protegidas contra CSRF, o frontend obtém o token fornecido pela API e o envia nas requisições necessárias.

## 🎯 Sobre o projeto

O Serviço da Palavra é um projeto pessoal desenvolvido com o objetivo de aplicar conceitos de desenvolvimento web full stack em uma aplicação utilizada em contexto real.

O projeto envolve integração entre frontend e backend, autenticação e autorização, persistência de dados, consumo de APIs REST, gerenciamento de estado da aplicação e deploy dos diferentes componentes da solução.
