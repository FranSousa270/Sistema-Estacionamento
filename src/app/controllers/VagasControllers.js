import { safeParse } from "zod";
import prisma from "../../../lib/prisma.js";
import { createVagaSchema } from "../validations/vagas.schema.js";

class VagasControllers {
  async index(req, res) {
    try {
      const data = await prisma.vaga.findMany();
      res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async show(req, res) {
    try {
      const id = req.params.id;

      const data = await prisma.vaga.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!data) {
        return res.status(404).json({
          message: "Vaga não encontrada",
        });
      }
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async create(req, res) {
    try {

      const dados = req.body;

      const setorExistente = await prisma.setor.findUnique({
        where: {
          id: dados.setorId,
        },
      });

      if (!setorExistente) {
        return res.status(404).json({
          message: "Setor não encontrado",
        });
      }

      const vagaExistente = await prisma.vaga.findFirst({
        where: {
          numero: dados.numero
        }
      })

      if(vagaExistente){
        return res.status(404).json({
          message: "Essa vaga já existe",
        });
      }

      const data = await prisma.vaga.create({
        data: dados,
      });
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;

      const vaga = await prisma.vaga.findUnique({
        where: {
          id,
        },
      });

      if (!vaga) {
        return res.status(404).json({
          message: "Vaga não encontrada",
        });
      }

      const dados = req.body;

      const setorExistente = await prisma.setor.findUnique({
        where: {
          id: dados.setorId,
        },
      });

      if (!setorExistente) {
        return res.status(404).json({
          message: "Setor não encontrado",
        });
      }

      const data = await prisma.vaga.update({
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

  async desativarVaga(req, res) {
    try {
      const id = req.params.id;

      const vaga = await prisma.vaga.findUnique({
        where: {
          id,
        },
      });

      if (!vaga) {
        return res.status(404).json({
          message: "Vaga não encontrada",
        });
      }

      const carroEstacionado = await prisma.permanencia.findFirst({
        where: {
          vagaId: id,
          saida: null,
        },
      });

      if (carroEstacionado) {
        return res.status(400).json({
          message: "Não é possível desativar uma vaga ocupada",
        });
      }

      const data = await prisma.vaga.update({
        where: {
          id: id,
        },

        data: {
          ativa: false,
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async ativarVaga(req, res) {
    try {
      const id = req.params.id;

      const vaga = await prisma.vaga.findUnique({
        where: { id },
      });

      if (!vaga) {
        return res.status(404).json({
          message: "Vaga não encontrada",
        });
      }

      const setor = await prisma.setor.findUnique({
        where: {
          id: vaga.setorId,
        },
      });

      if (!setor) {
        return res.status(404).json({
          message: "Setor não encontrado",
        });
      }

      if (!setor.ativo) {
        return res.status(400).json({
          message: "Não é possível ativar uma vaga de um setor inativo.",
        });
      }

      const data = await prisma.vaga.update({
        where: { id },
        data: {
          ativa: true,
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
export default new VagasControllers();
