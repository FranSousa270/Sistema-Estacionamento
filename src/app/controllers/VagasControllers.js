import { TipoVaga } from "../../../generated/prisma/enums.ts";
import prisma from "../../../lib/prisma.js";

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
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

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
      let { numero, tipo, setorId } = req.body;


      if (!numero) {
        return res.status(400).json({
          message: "O numero da vaga deve ser preenchido",
        });
      }

      if (typeof numero !== "string") {
        return res.status(400).json({
          message: "Escreva uma vaga válida",
        });
      }

      numero = numero.trim();

      if (numero.length < 1) {
        return res.status(400).json({
          message: "A vaga deve ter pelo menos 1 caractere",
        });
      }

      if (!tipo) {
        res.status(400).json({
          message: "O tipo da vaga deve ser preenchido",
        });
      }

      if (typeof tipo !== "string") {
        return res.status(400).json({
          message: "Insira uma vaga válida",
        });
      }

      if (!Object.values(TipoVaga).includes(tipo)) {
        return res.status(400).json({
          message: "Tipo não é válido",
        });
      }

      if (!setorId) {
        return res.status(400).json({
          message: "Insira o setor",
        });
      }

      setorId = parseInt(setorId);

      if (isNaN(setorId)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

      const setorExistente = await prisma.setor.findUnique({
        where: {
          id: setorId,
        },
      });

      if (!setorExistente) {
        return res.status(404).json({
          message: "Setor não encontrado",
        });
      }

      const data = await prisma.vaga.create({
        data: {
          numero,
          tipo,
          setorId,
        },
      });
      res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async update(req, res) {
    try {
      let { numero, tipo, setorId } = req.body;

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

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

      if (!numero) {
        return res.status(400).json({
          message: "O numero da vaga deve ser preenchido",
        });
      }

      if (typeof numero !== "string") {
        return res.status(400).json({
          message: "Escreva uma vaga válida",
        });
      }

      numero = numero.trim();

      if (numero.length < 1) {
        return res.status(400).json({
          message: "A vaga deve ter pelo menos 1 caractere",
        });
      }

      if (!tipo) {
        res.status(400).json({
          message: "O tipo da vaga deve ser preenchido",
        });
      }

      if (typeof tipo !== "string") {
        return res.status(400).json({
          message: "Insira uma vaga válida",
        });
      }

      if (!Object.values(TipoVaga).includes(tipo)) {
        return res.status(400).json({
          message: "Tipo não é válido",
        });
      }

      if (!setorId) {
        return res.status(400).json({
          message: "Insira o setor",
        });
      }

      setorId = parseInt(setorId);

      if (isNaN(setorId)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }

      const setorExistente = await prisma.setor.findUnique({
        where: {
          id: setorId,
        },
      });

      if (!setorExistente) {
        return res.status(404).json({
          message: "Setor não encontrado",
        });
      }

      const data = await prisma.vaga.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          numero,
          tipo,
          setorId,
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
      res.status(200).json(data);
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
  }
}
export default new VagasControllers();
