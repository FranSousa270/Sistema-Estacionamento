import prisma from "../../../lib/prisma.js";

class SetoresControllers {
  async index(req, res) {
    try {
      const data = await prisma.setor.findMany();
      res.status(200).json(data);
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
      let { nome } = req.body;

      if (!nome) {
        return res.status(400).json({
          message: "O campo nome do setor deve ser preenchido",
        });
      }

      if (typeof nome !== "string") {
        return res.status(400).json({
          message: "Escreva um nome válido",
        });
      }

      nome = nome.trim().toUpperCase();

      const data = await prisma.setor.create({
        data: {
          nome,
        },
      });
      res.status(201).json(data);
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
      let { nome } = req.body;

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

      if (!nome) {
        return res.status(400).json({
          message: "O campo nome do setor deve ser preenchido",
        });
      }

      if (typeof nome !== "string") {
        return res.status(400).json({
          message: "Escreva um nome válido",
        });
      }

      nome = nome.trim().toUpperCase();

      if (nome.length < 1) {
        return res.status(400).json({
          message: "O nome do setor deve ter no minímo 1 carácter",
        });
      }
      const data = await prisma.setor.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          nome,
        },
      });
      res.status(200).json(data);
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Id inválido",
      });
    }
    const data = await prisma.setor.update({
      where: { id },
      data: {
        ativo: true,
      },
    });
    return res.status(200).json(data);
  }
}

export default new SetoresControllers();
