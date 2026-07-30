import prisma from "../../../lib/prisma.js";
import { createPermanenciaSchema } from "../validations/permanencias.schema.js";

class PermanenciaControllers {
  async index(req, res) {
    try {
      const data = await prisma.permanencia.findMany({
        include: {
          veiculo: true,
          vaga: true,
        },
      });
      res.status(200).json(data);
      console.log("GET :: /permanencias", JSON.stringify(data));
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor.",
      });
    }
  }

  async show(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

      const data = await prisma.permanencia.findUnique({
        where: {
          id,
        },
        include: {
          veiculo: true,
          vaga: true,
        },
      });
      if (!data) {
        return res.status(404).json({
          message: "Permanência não encontrada",
        });
      }
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor.",
      });
    }
  }

  async create(req, res) {
    try {
      const dados = req.body;
      const veiculo = await prisma.veiculo.findUnique({
        where: {
          id: dados.veiculoId,
        },
      });

      if (!veiculo) {
        return res.status(404).json({
          message: "Veículo não encontrado.",
        });
      }

      const setor = await prisma.setor.findUnique({
        where: {
          id: vaga.setorId,
        },
      });

      if (!setor.ativo) {
        return res.status(400).json({
          message: "O setor desta vaga está inativo.",
        });
      }

      const vaga = await prisma.vaga.findUnique({
        where: {
          id: dados.vagaId,
        },
      });

      if (!vaga) {
        return res.status(404).json({
          message: "Vaga não encontrada.",
        });
      }

      if (!vaga.ativa) {
        return res.status(400).json({
          message: "Não é possível anexar á uma vaga inativa.",
        });
      }

      const veiculoEstacionado = await prisma.permanencia.findFirst({
        where: {
          veiculoId: dados.veiculoId,
          saida: null,
        },
      });

      if (veiculoEstacionado) {
        return res.status(400).json({
          message: "Este veículo já está estacionado.",
        });
      }

      const vagaOcupada = await prisma.permanencia.findFirst({
        where: {
          vagaId: dados.vagaId,
          saida: null,
        },
      });

      if (vagaOcupada) {
        return res.status(400).json({
          message: "Esta vaga já está ocupada.",
        });
      }

      const data = await prisma.permanencia.create({
        data: {
          veiculoId: dados.veiculoId,
          vagaId: dados.vagaId,
        },
        include: {
          veiculo: true,
          vaga: true,
        },
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor.",
      });
    }
  }
  async finalizar(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }
      const permanencia = await prisma.permanencia.findUnique({
        where: {
          id,
        },
      });

      if (!permanencia) {
        return res.status(404).json({
          message: "Permanência não encontrada.",
        });
      }

      if (permanencia.saida) {
        return res.status(400).json({
          message: "Esta permanência já foi encerrada.",
        });
      }

      const data = await prisma.permanencia.update({
        where: {
          id,
        },
        data: {
          saida: new Date(),
        },
        include: {
          veiculo: true,
          vaga: true,
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor.",
      });
    }
  }
}

export default new PermanenciaControllers();
