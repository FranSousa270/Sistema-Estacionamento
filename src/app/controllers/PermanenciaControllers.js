import prisma from "../../../lib/prisma.js";

class PermanenciaControllers {
  async index(req, res) {
    try {
      const data = await prisma.permanencia.findMany({
        include: {
          carro: true,
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
          id: parseInt(req.params.id),
        },
        include: {
          carro: true,
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
      let { carroId, vagaId } = req.body;

      carroId = parseInt(carroId);
      vagaId = parseInt(vagaId);

      if (isNaN(carroId)) {
        return res.status(400).json({
          message: "Id inválido.",
        });
      }

      const carro = await prisma.carro.findUnique({
        where: { id: carroId },
      });

      if (!carro) {
        return res.status(404).json({
          message: "Carro não encontrado.",
        });
      }

      if (isNaN(vagaId)) {
        return res.status(400).json({
          message: "Id inválido.",
        });
      }

      const vaga = await prisma.vaga.findUnique({
        where: {
          id: vagaId,
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

      const carroEstacionado = await prisma.permanencia.findFirst({
        where: {
          carroId,
          saida: null,
        },
      });

      if (carroEstacionado) {
        return res.status(400).json({
          message: "Este carro já está estacionado.",
        });
      }

      const vagaOcupada = await prisma.permanencia.findFirst({
        where: {
          vagaId,
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
          carroId,
          vagaId,
        },
        include: {
          carro: true,
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
