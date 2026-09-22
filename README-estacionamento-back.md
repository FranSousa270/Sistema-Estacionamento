# 🅿️ Sistema de Estacionamento — API (Back End)

API REST para gerenciamento de um sistema de estacionamento: setores, vagas, proprietários, veículos e o controle de entrada/saída (permanência) de veículos nas vagas.

## ✨ Funcionalidades

- **Setores**: cadastro, edição, ativação/desativação
- **Vagas**: cadastro, edição, ativação/desativação, vinculadas a um setor, com tipos (carro, moto, PCD, idoso)
- **Proprietários**: cadastro, edição e exclusão (com cascata: remove permanências e veículos vinculados)
- **Veículos**: cadastro, edição e exclusão, sempre vinculados a um proprietário
- **Permanências**: registro de entrada e saída de um veículo em uma vaga, mantendo histórico completo (cada entrada gera um novo registro, mesmo repetindo vaga/veículo)

## 🛠️ Tecnologias

- **Node.js** com **Express**
- **Prisma ORM**
- **PostgreSQL**
- **CORS** (middleware para liberar acesso do front end)

## 🗂️ Modelo de dados

| Entidade | Principais campos | Relação |
|---|---|---|
| Setor | nome, ativo | possui várias Vagas |
| Vaga | nome, tipo (carro/moto/pcd/idoso), ativa | pertence a um Setor |
| Proprietário | nome, CPF, telefone | possui vários Veículos |
| Veículo | modelo, placa, ano | pertence a um Proprietário |
| Permanência | vagaId, veiculoId, entrada/saída | referencia Vaga e Veículo |

## 🔌 Padrões da API

- **Ativação/desativação** (Setor e Vaga): `PATCH /setores/:id/ativar`, `PATCH /setores/:id/desativar` (e equivalente para vagas) — sem body, a rota decide o estado
- **Exclusão real** (Proprietário e Veículo): `DELETE`, com cascata no proprietário (permanências → veículos → proprietário)
- **Finalização de permanência**: `PATCH /permanencias/:id/finalizar` — sem body

## 🚧 Status do projeto

Em desenvolvimento. Sem testes automatizados ainda. Sem autenticação/login implementada (planejada para uma próxima etapa).

## 🔧 Rodando localmente

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

## 📄 Licença

Este projeto está sob a licença MIT.
