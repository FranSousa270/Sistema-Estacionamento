# Sistema de Estacionamento — API (Back End)

API REST para gerenciamento de um sistema de estacionamento: setores, vagas, proprietários, veículos e o controle de entrada/saída (permanência) de veículos nas vagas.

## Funcionalidades

- **Setores**: cadastro, edição, ativação/desativação
- **Vagas**: cadastro, edição, ativação/desativação, vinculadas a um setor, com tipos (carro, moto, PCD, idoso)
- **Proprietários**: cadastro, edição e exclusão (com cascata: remove permanências e veículos vinculados)
- **Veículos**: cadastro, edição e exclusão, sempre vinculados a um proprietário
- **Permanências**: registro de entrada e saída de um veículo em uma vaga, mantendo histórico completo (cada entrada gera um novo registro, mesmo repetindo vaga/veículo)

## Tecnologias

- **Node.js** com **Express**
- **Prisma ORM**
- **PostgreSQL**

## Modelo de dados

| Entidade | Principais campos | Relação |
|---|---|---|
| Setor | nome, ativo | possui várias Vagas |
| Vaga | nome, tipo (carro/moto/pcd/idoso), ativa | pertence a um Setor |
| Proprietário | nome, CPF, telefone | possui vários Veículos |
| Veículo | modelo, placa, ano | pertence a um Proprietário |
| Permanência | vagaId, veiculoId, entrada/saída | referencia Vaga e Veículo |

## Padrões da API

- **Ativação/desativação** (Setor e Vaga): `PATCH /setores/:id/ativar`, `PATCH /setores/:id/desativar` (e equivalente para vagas) — sem body, a rota decide o estado
- **Exclusão real** (Proprietário e Veículo): `DELETE`, com cascata no proprietário (permanências → veículos → proprietário)
- **Finalização de permanência**: `PATCH /permanencias/:id/finalizar` — sem body

## Status do projeto

Em desenvolvimento. Sem testes automatizados ainda. Sem autenticação/login implementada (planejada para uma próxima etapa).

## Rodando localmente

```bash
git clone <url-do-repositório>
cd estacionamento-backend
npm install
```

Configure o banco no `.env`:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/estacionamento"
```

Rode as migrations e inicie o servidor:

```bash
npx prisma migrate dev
npm run dev
```

A API sobe por padrão em `http://localhost:3000`.

## Licença

Este projeto está sob a licença MIT.

## (English Version)

# Parking Management System — API (Back End)

REST API for a parking management system, handling sectors, parking spaces, owners, vehicles, and vehicle entry/exit tracking (parking sessions).

## Features

- **Sectors**: Creation, editing, activation, and deactivation.
- **Parking Spaces**: Creation, editing, activation, and deactivation. Each space is linked to a sector and supports different types (car, motorcycle, disabled parking, and senior parking).
- **Owners**: Creation, editing, and deletion, including cascading deletion of associated parking sessions and vehicles.
- **Vehicles**: Creation, editing, and deletion. Each vehicle is linked to an owner.
- **Parking Sessions**: Records vehicle entry and exit from a parking space while maintaining a complete history. Each entry creates a new record, even when the same vehicle or parking space is used again.

## Technologies

- **Node.js** with **Express**
- **Prisma ORM**
- **PostgreSQL**

## Data Model

| Entity | Main Fields | Relationship |
|---|---|---|
| Sector | name, active | Has many parking spaces |
| Parking Space | name, type (car/motorcycle/disabled/senior), active | Belongs to a sector |
| Owner | name, CPF, phone | Has many vehicles |
| Vehicle | model, license plate, year | Belongs to an owner |
| Parking Session | parkingSpaceId, vehicleId, entry/exit timestamps | References a parking space and a vehicle |

## API Conventions

- **Activation/deactivation** (Sector and Parking Space): `PATCH /setores/:id/ativar`, `PATCH /setores/:id/desativar` (and equivalent endpoints for parking spaces). No request body is required; the endpoint determines the state.
- **Permanent deletion** (Owner and Vehicle): Uses `DELETE` requests, with cascading deletion for owners (parking sessions → vehicles → owner).
- **Parking Session Completion**: `PATCH /permanencias/:id/finalizar`. No request body is required.

## Project Status

Currently in development. Automated tests have not been implemented yet. Authentication and login are not yet available and are planned for a future stage.

## Running Locally

```bash
git clone <repository-url>
cd estacionamento-backend
npm install
```

Configure the database connection in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/estacionamento"
```

Run the database migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

The API runs by default at `http://localhost:3000`.

## License

This project is licensed under the MIT License.
