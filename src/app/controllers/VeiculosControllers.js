import prisma from "../../../lib/prisma.js";
import { createVeiculoSchema, updateVeiculoSchema } from "../validations/veiculos.schema.js";

class VeiculosControllers {
  async index(req, res) {
    try {
      const data = await prisma.veiculo.findMany();
      res.status(200).json(data);
      console.log("GET :: /veiculos", JSON.stringify(data));
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async show(req, res) {
    try {
      const id = req.params.id;
      const veiculo = await prisma.veiculo.findUnique({
        where: {
          id,
        },
      });
      if (!veiculo) {
        return res.status(404).json({
          message: "Veículo não encontrado",
        });
      }
      return res.status(200).json(veiculo);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async create(req, res) {
    try {
      const dados = req.body;

      const placaExistente = await prisma.veiculo.findUnique({
        where: {
          placa: dados.placa,
        },
      });

      if (placaExistente) {
        return res.status(400).json({
          message: "Essa placa já existe",
        });
      }

      const proprietario = await prisma.proprietario.findUnique({
        where: {
          id: dados.proprietarioId,
        },
      });

      if (!proprietario) {
        return res.status(404).json({
          message: "Esse ID não existe",
        });
      }

      const veiculo = await prisma.veiculo.create({
        data: dados,
      });
      res.status(201).json(veiculo);
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

      const veiculo = await prisma.veiculo.findUnique({
        where: {
          id,
        },
      });

      if (!veiculo) {
        return res.status(400).json({
          message: "Veículo não encontrado",
        });
      }

      const placaExistente = await prisma.veiculo.findUnique({
        where: {
          placa: dados.placa,
        },
      });

      if (placaExistente && placaExistente.id !== veiculo.id) {
        return res.status(400).json({
          message: "Essa placa já está cadastrada em outro veículo.",
        });
      }

      const data = await prisma.veiculo.update({
        where: {
          id,
        },
        data: dados
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async destroy(req, res) {
    const id = req.params.id;

    const veiculo = await prisma.veiculo.findUnique({
      where: {
        id,
      },
    });

    if (!veiculo) {
      return res.status(404).json({
        message: "Veículo não encontrado",
      });
    }

    const permanencia = await prisma.permanencia.findFirst({
      where: {
        veiculoId: id,
      },
    });

    if (permanencia) {
      return res.status(409).json({
        message: "Esse veículo possui registros",
      });
    }

    const data = await prisma.veiculo.delete({
      where: {
        id,
      },
    });
    return res.json(data);
  }
}

export default new VeiculosControllers();
