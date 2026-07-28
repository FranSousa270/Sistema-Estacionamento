import prisma from "../../../lib/prisma.js";
import { createSetorSchema } from "../validations/setores.schema.js";

class SetoresControllers {
  async index(req, res) {
    try {
      const data = await prisma.setor.findMany();
      return res.status(200).json(data);
      console.log("GET :: /setores", JSON.stringify(data));
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
          message: "Id inválido",
        });
      }

      const data = await prisma.setor.findUnique({
        where: {
          id,
        },
      });

      if (!data) {
        return res.status(404).json({
          message: "Setor não encontrado",
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
      const resultado = createSetorSchema.safeParse(req.body);

      if (!resultado.success) {
        return res.status(400).json({
          errors: resultado.error.flatten().fieldErrors,
        });
      }

      const dados = resultado.data;

      const data = await prisma.setor.create({
        data: dados,
      });
      return res.status(201).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

      const setor = await prisma.setor.findUnique({
        where: {
          id,
        },
      });

      if (!setor) {
        return res.status(404).json({
          message: "Setor não encontrado",
        });
      }

      const resultado = createSetorSchema.safeParse(req.body);

      if (!resultado.success) {
        return res.status(400).json({
          errors: resultado.error.flatten().fieldErrors,
        });
      }

      const dados = resultado.data;

      const data = await prisma.setor.update({
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
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

      const setor = await prisma.setor.findUnique({
        where: {
          id,
        },
      });

      if (!setor) {
        return res.status(404).json({
          message: "Setor não encontrado",
        });
      }

      const vagas = await prisma.vaga.findMany({
        where: {
          setorId: id,
        },
      });

      let vagasIds = vagas.map((vaga) => vaga.id);

      if (vagas.length === 0) {
        const data = await prisma.setor.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: {
            ativo: false,
          },
        });
        return res.status(200).json(data);
      }

      const veiculoEstacionado = await prisma.permanencia.findFirst({
        where: {
          vagaId: {
            in: vagasIds,
          },
          saida: null,
        },
      });

      if (veiculoEstacionado) {
        return res.status(400).json({
          message: "Não é possível desativar um setor com vagas ocupadas",
        });
      }

      await prisma.vaga.updateMany({
        where: {
          setorId: id,
        },
        data: {
          ativa: false,
        },
      });

      const data = await prisma.setor.update({
        where: {
          id,
        },
        data: {
          ativo: false,
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async patch(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

      const setor = await prisma.setor.findUnique({
        where: {
          id,
        },
      });

      if (!setor) {
        return res.status(404).json({
          message: "Setor não encontrado.",
        });
      }

      const data = await prisma.setor.update({
        where: { id },
        data: {
          ativo: true,
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

export default new SetoresControllers();
