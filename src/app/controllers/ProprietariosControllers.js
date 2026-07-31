import prisma from "../../../lib/prisma.js";
import { createProprietarioSchema } from "../validations/proprietarios.schema.js";

class ProprietariosControllers {
  async index(req, res) {
    try {
      const data = await prisma.proprietario.findMany();
      res.status(200).json(data);
      console.log("GET :: /proprietarios", JSON.stringify(data));
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async show(req, res) {
    try {
      const id = req.params.id;
      const data = await prisma.proprietario.findUnique({
        where: {
          id,
        },
      });

      if (!data) {
        return res.status(404).json({
          message: "Proprietário não encontrado",
        });
      }
      res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async create(req, res) {
    try {
  
      const dados = req.body;

      const cpfExistente = await prisma.proprietario.findUnique({
        where: {
          cpf: dados.cpf,
        },
      });

      if (cpfExistente) {
        return res.status(400).json({
          message: "Esse cpf já existe",
        });
      }

      const telefoneExistente = await prisma.proprietario.findUnique({
        where: {
          telefone: dados.telefone,
        },
      });

      if (telefoneExistente) {
        return res.status(400).json({
          message: "Telefone já existe",
        });
      }

      const proprietario = await prisma.proprietario.create({
        data: dados,
      });
      return res.status(201).json(proprietario);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;

      const dados = req.body;

      const proprietario = await prisma.proprietario.findUnique({
        where: {
          id,
        },
      });

      if (!proprietario) {
        return res.status(404).json({
          message: "Proprietário não encontrado",
        });
      }

      const cpfExistente = await prisma.proprietario.findUnique({
        where: {
          cpf: dados.cpf,
        },
      });

      if (cpfExistente && cpfExistente.id !== proprietario.id) {
        return res.status(400).json({
          message: "CPF já cadastrado",
        });
      }

      const telefoneExistente = await prisma.proprietario.findUnique({
        where: {
          telefone: dados.cpf,
        },
      });

      if (telefoneExistente && telefoneExistente.id !== proprietario.id) {
        return res.status(400).json({
          message: "Telefone já existe",
        });
      }

      const data = await prisma.proprietario.update({
        where: {
          id,
        },
        data: dados,
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async destroy(req, res) {
    try {
      const id = req.params.id;

      const proprietario = await prisma.proprietario.findUnique({
        where: {
          id,
        },
      });

      if (!proprietario) {
        return res.status(404).json({
          message: "Proprietário não encontrado",
        });
      }

      const veiculos = await prisma.veiculo.findMany({
        where: {
          proprietarioId: id,
        },
      });

      const veiculosProprietario = veiculos.map(() => veiculos.id);

      const excluirPermanencia = await prisma.permanencia.deleteMany({
        where: {
          veiculoIdId: {
            in: veiculosProprietario,
          },
        },
      });

      const excluirVeiculos = await prisma.veiculo.deleteMany({
        where: {
          id: {
            in: veiculosProprietario,
          },
        },
      });

      const data = await prisma.proprietario.delete({
        where: {
          id,
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }
}

export default new ProprietariosControllers();
