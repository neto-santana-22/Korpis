KORPIS — Plataforma SaaS de Gestão Financeira e Cobranças (MVP)

Status do Projeto: MVP Concluído e Estável

Arquitetura: SPA Desacoplada + API RESTful

Padrão Visual: Tema Claro (Light Mode Corporativo)

Visão Geral do Sistema

O Korpis é uma plataforma SaaS corporativa desenvolvida para o gerenciamento centralizado de carteiras de clientes, emissão automatizada de cobranças via Pix e acompanhamento sintético de métricas financeiras em tempo real.

A solução foi projetada com foco em alta performance, resposta instantânea de leitura e interface intuitiva sem poluição visual.

Arquitetura & Decisões Técnicas

A aplicação é dividida em duas camadas independentes que se comunicam estritamente via HTTP/REST utilizando JSON:

Backend (API RESTful)

Tecnologia: C# / .NET 8 / 10 (ASP.NET Core Web API)

Persistência de Dados: Micro-ORM Dapper + PostgreSQL (Consultas SQL otimizadas)

Segurança: Autenticação via Token JWT (Sessão de 8 horas)

Padrões: Controllers limpos, Injeção de Dependência nativa e Handlers isolados

Frontend (Single Page Application)

Tecnologia: React 18 + TypeScript (Build via Vite)

Interface & Estilização: Tailwind CSS (Design Corporativo Light Mode)

Navegação: Sidebar Deslizante (Drawer via botão Hamburger ☰)

Integração HTTP: Axios com interceptor de autorização automática (Bearer Token)

Stack Tecnológica

Camada

Tecnologia

Função Principal

Backend

.NET 8 / 10

API RESTful, Regras de Negócio e Autenticação

Micro-ORM

Dapper

Mapeamento SQL de Alta Performance

Database

PostgreSQL

Persistência Relacional de Dados

Frontend

React 18 + TS

Single Page Application Reativa

Estilização

Tailwind CSS

Interface Corporativa Limpa (Light Mode)

Build Tool

Vite

Bundler e Servidor de Desenvolvimento

Estrutura do Repositório

Korpis/
├── backend/                  # Código-fonte da API ASP.NET Core
│   ├── Controllers/          # Endpoints RESTful (Auth, Clients, Charges, Dashboard)
│   ├── Models/               # Entidades de Domínio e DTOs
│   ├── Repositories/         # Consultas SQL e Mapeamento via Dapper
│   ├── Services/             # Regras Financeiras e Simulação Pix
│   └── Program.cs            # Middlewares e Injeção de Dependências
│
├── frontend/                 # Aplicação Web (React + TypeScript)
│   ├── src/
│   │   ├── components/       # Módulos Visuais (ClientsManager, ChargesManager, DashboardView)
│   │   ├── services/         # Cliente Axios e Conexão HTTP
│   │   ├── types/            # Contratos de Tipagem TypeScript
│   │   ├── utils/            # Formatadores de Moeda e Documentos
│   │   └── App.tsx           # Componente Raiz e Controle da Sidebar
│
└── README.md                 # Documentação Oficial do Repositório


Especificação de Funcionalidades

1. Autenticação & Segurança

Formulário de Login corporativo com validação de credenciais.

Geração e validação de token JWT (Bearer Auth).

2. Gestão de Clientes

Cadastro completo de clientes (Nome/Razão Social, CPF/CNPJ, E-mail, Telefone).

Busca dinâmicamente filtrada em tempo real por nome ou documento.

Edição e remoção de cadastros.

3. Cobranças & Pagamentos Pix

Emissão de cobranças vinculadas ao cliente.

Geração automática de código Pix Copia e Cola.

Filtros por status: Todas, Pendentes, Pagas e Canceladas.

Ações rápidas para Simular Baixa (Pagamento) ou Cancelar Cobrança.

4. Dashboard Financeiro

Cartões sintéticos de métricas em tempo real:

Faturamento Acumulado (R$)

Valores Pendentes (R$)

Taxa de Inadimplência (%)

Total de Clientes Ativos

Como Executar o Projeto Localmente

Pré-requisitos

.NET SDK 8.0 ou superior

Node.js 18.0 ou superior

Instância do PostgreSQL ativa

Passo 1: Executando o Backend (.NET)

# 1. Entre na pasta do backend
cd backend

# 2. Restaure as dependências
dotnet restore

# 3. Inicie a API
dotnet run


A API estará disponível em https://localhost:7001 ou http://localhost:5000.

Passo 2: Executando o Frontend (React)

# 1. Entre na pasta do frontend (em outro terminal)
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev


Acesse o sistema no navegador pelo endereço indicado pelo Vite (ex: http://localhost:5173).
