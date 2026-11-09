# KORPIS — Plataforma SaaS de Gestão Financeira e Cobranças (MVP)


Status do Projeto: MVP Concluído e Estável


Arquitetura: SPA Desacoplada + API RESTful


Padrão Visual: Tema Claro (Light Mode Corporativo)


Visão Geral do Sistema


O Korpis é uma plataforma SaaS corporativa desenvolvida para o gerenciamento centralizado de carteiras de clientes, emissão automatizada de cobranças via Pix e acompanhamento sintético de métricas financeiras em tempo real.

A solução foi projetada com foco em alta performance, resposta instantânea de leitura e interface intuitiva sem poluição visual.

Tecnologias e Stack

Backend & Persistência

Frontend & Interface

Ferramentas & Versionamento

Arquitetura & Decisões Técnicas




A aplicação é dividida em duas camadas independentes que se comunicam estritamente via HTTP/REST utilizando JSON:


Backend (API RESTful)

Tecnologia: C# / .NET 8 / 10 (ASP.NET Core Web API)

Persistência de Dados: Micro-ORM Dapper + PostgreSQL (Consultas SQL otimizadas)

Ambiente de Banco: Conteinerizado via Docker Compose

Segurança: Autenticação via Token JWT (Sessão de 8 horas)

Padrões: Controllers limpos, Injeção de Dependência nativa e Handlers isolados

Frontend (Single Page Application)

Tecnologia: React 18 + TypeScript (Build via Vite)

Interface & Estilização: Tailwind CSS (Design Corporativo Light Mode)

Navegação: Sidebar Deslizante (Drawer via botão Hamburger ☰)

Integração HTTP: Axios com interceptor de autorização automática (Bearer Token)


# Estrutura do Repositório


Diretório / Arquivo

Responsabilidade / Conteúdo

backend/

Código-fonte da API REST desenvolvida em C# / ASP.NET Core

├── Controllers/

Endpoints HTTP da API (Autenticação, Clientes, Cobranças e Dashboard)

├── Models/

Entidades de domínio da aplicação e DTOs de entrada/saída

├── Repositories/

Mapeamento e consultas SQL diretas via Dapper para o PostgreSQL

├── Services/

Regras de negócio financeiras e módulo de geração Pix

└── Program.cs

Configuração da API, injeção de dependências e middlewares

frontend/

Aplicação Single Page Application (SPA) em React + TypeScript

└── src/components/

Componentes visuais (ClientsManager, ChargesManager, DashboardView)

└── src/services/

Cliente Axios configurado com interceptor para Token JWT

└── src/types/

Definições e contratos de tipagem TypeScript

└── src/utils/

Funções utilitárias de formatação monetária e documentos

└── src/App.tsx

Componente principal e gerenciador do menu lateral (Drawer)

docker-compose.yml

Orquestração do banco de dados PostgreSQL em ambiente conteinerizado

README.md


# 1. Autenticação & Segurança


Formulário de Login corporativo com validação de credenciais.

Geração e validação de token JWT (Bearer Auth).


# 2. Gestão de Clientes


Cadastro completo de clientes (Nome/Razão Social, CPF/CNPJ, E-mail, Telefone).

Busca dinamicamente filtrada em tempo real por nome ou documento.

Edição e remoção de cadastros.


# 3. Cobranças & Pagamentos Pix


Emissão de cobranças vinculadas ao cliente.

Geração automática de código Pix Copia e Cola.

Filtros por status: Todas, Pendentes, Pagas e Canceladas.

Ações rápidas para Simular Baixa (Pagamento) ou Cancelar Cobrança.


# 4. Dashboard Financeiro


Cartões sintéticos de métricas em tempo real:

Faturamento Acumulado (R$)

Valores Pendentes (R$)

Taxa de Inadimplência (%)

Total de Clientes Ativos

Como Executar o Projeto Localmente

Pré-requisitos

.NET SDK 8.0 ou superior

Node.js 18.0 ou superior

Docker Desktop (opcional, para rodar o banco PostgreSQL)

Passo 1: Subir o Banco de Dados (PostgreSQL via Docker)

Caso utilize o Docker Compose para o banco de dados:

docker compose up -d


Passo 2: Executando o Backend (.NET)

# 1. Entre na pasta do backend
cd backend

# 2. Restaure as dependências
dotnet restore

# 3. Inicie a API
dotnet run


A API estará disponível em https://localhost:7001 ou http://localhost:5000.

Passo 3: Executando o Frontend (React)

# 1. Entre na pasta do frontend (em outro terminal)
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev


Acesse o sistema no navegador pelo endereço indicado pelo Vite (ex: http://localhost:5173).
