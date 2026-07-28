import prisma from "../../../lib/prisma.js";
import { createVeiculoSchema } from "../validations/veiculo.schema.js";

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
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          message:
            "Veículo não encontrado, tente novamente com um id existente ou válido",
        });
      }
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
      const resultado = createVeiculoSchema.safeParse(req.body);

      if (!resultado.success) {
        return res.status(400).json({
          errors: resultado.error.flatten().fieldErrors,
        });
      }

      const dados = resultado.data;

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
      let { modelo, ano, placa } = req.body;
      let id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "O id é invalido",
        });
      }

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

      if (!modelo) {
        return res.status(400).json({
          message: "O campo modelo é obrigatório",
        });
      }

      if (typeof modelo !== "string") {
        return res.status(400).json({
          message: "O modelo deve ser um texto",
        });
      }

      modelo = modelo.trim();

      if (modelo.length < 2) {
        return res.status(400).json({
          message: "O campo modelo não pode conter menos que 2 letras",
        });
      }

      if (!ano) {
        return res.status(400).json({
          message: "O campo ano é obrigatório",
        });
      }

      if (!Number.isInteger(ano)) {
        return res.status(400).json({
          message: "Escreva números inteiros",
        });
      }

      const anoMaximo = new Date().getFullYear() + 1;

      if (ano < 1930 || ano > anoMaximo) {
        return res.status(400).json({
          message: "Coloque um ano válido",
        });
      }

      if (!placa) {
        return res.status(400).json({
          message: "O campo placa não pode estar vazio",
        });
      }

      if (typeof placa !== "string") {
        return res.status(400).json({
          message: "Escreva apenas uma placa válida",
        });
      }

      placa = placa.trim().toUpperCase();

      if (placa.length < 7) {
        return res.status(400).json({
          message: "O campo placa deve conter pelo menos 7 caracteres",
        });
      }

      const placaExistente = await prisma.veiculo.findUnique({
        where: {
          placa,
        },
      });

      if (placaExistente) {
        return res.status(400).json({
          message: "Essa placa já existe",
        });
      }

      if (placaExistente && placaExistente.id !== veiculo.id) {
        return res.status(400).json({
          message: "Essa placa já está cadastrada em outro veículo.",
        });
      }

      const data = await prisma.veiculo.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          modelo,
          placa,
          ano,
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async destroy(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Id inválido",
      });
    }

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
