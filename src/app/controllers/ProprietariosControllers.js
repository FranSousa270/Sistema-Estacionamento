import prisma from "../../../lib/prisma.js";

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
      const id = parseInt(id);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Id inválido",
        });
      }
      const data = await prisma.proprietario.findUnique({
        where: {
          id: parseInt(req.params.id),
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
      let { nome, cpf, telefone } = req.body;

      if (!nome) {
        return res.status(400).json({
          message: "O campo nome deve ser preenchido",
        });
      }

      if (typeof nome !== "string") {
        return res.status(400).json({
          message: "O campo nome deve ser preenchido apenas por letras",
        });
      }

      nome = nome.trim();

      if (nome.length < 2) {
        return res.status(400).json({
          message: "O campo nome deve ter pelo menos 2 letras",
        });
      }

      const regexNome = /^[\p{L} ]+$/u;

      if (!regexNome.test(nome)) {
        return res.status(400).json({
          message: "Escreva apenas letras",
        });
      }

      if (!cpf) {
        return res.status(400).json({
          message: "O campo cpf deve ser preenchido",
        });
      }

      if (typeof cpf !== "string") {
        return res.status(400).json({
          message: "Digite um cpf válido",
        });
      }

      cpf = cpf.trim();

      const regex = /^\d+$/;

      if (!regex.test(cpf)) {
        return res.status(400).json({
          message: "O campo cpf deve ter apenas números",
        });
      }

      if (cpf.length !== 11) {
        return res.status(400).json({
          message: "O campo cpf deve ter 11 digítos",
        });
      }

      const cpfExistente = await prisma.proprietario.findUnique({
        where: {
          cpf,
        },
      });

      if (cpfExistente) {
        return res.status(400).json({
          message: "Esse cpf já existe",
        });
      }

      if (!telefone) {
        return res.status(400).json({
          message: "O campo telefone deve preenchido",
        });
      }

      if (typeof telefone !== "string") {
        return res.status(400).json({
          message: "Digite um telefone válido",
        });
      }

      if (telefone.length <= 11) {
        return res.status(400).json({
          message: "O campo deve ter no minímo 10 carácteres",
        });
      }

      telefone = telefone.trim();

      if (!regex.test(telefone)) {
        return res.status(400).json({
          message: "Escreva apenas numeros",
        });
      }

      const telefoneExistente = await prisma.proprietario.findUnique({
        where: {
          telefone,
        },
      });

      if (telefoneExistente) {
        return res.status(400).json({
          message: "Telefone já existe",
        });
      }

      const proprietario = await prisma.proprietario.create({
        data: {
          nome,
          cpf,
          telefone,
        },
      });
      res.status(201).json(proprietario);
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  async update(req, res) {
    let { nome, cpf, telefone } = req.body;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Id não encontrado",
      });
    }

    const proprietario = await prisma.proprietario.findUnique({
      where: {
        id
      }
    })

    if(!proprietario){
      res.status(404).json({
        message: "Proprietário não encontrado"
      })
    }

    if (!nome) {
      return res.status(400).json({
        message: "O campo nome deve ser preenchido",
      });
    }

    if (typeof nome !== "string") {
      return res.status(400).json({
        message: "O campo nome deve ser preenchido apenas por letras",
      });
    }

    nome = nome.trim();

    if (nome.length < 2) {
      return res.status(400).json({
        message: "O campo nome deve ter pelo menos 2 letras",
      });
    }

    const regexNome = /^[\p{L} ]+$/u;

    if (!regexNome.test(nome)) {
      return res.status(400).json({
        message: "Escreva apenas letras",
      });
    }

    if (!cpf) {
      return res.status(400).json({
        message: "O campo cpf deve ser preenchido",
      });
    }

    if (typeof cpf !== "string") {
      return res.status(400).json({
        message: "Digite um cpf válido",
      });
    }

    cpf = cpf.trim();

    const regex = /^\d+$/;

    if (!regex.test(cpf)) {
      return res.status(400).json({
        message: "O campo cpf deve ter apenas números",
      });
    }

    if (cpf.length !== 11) {
      return res.status(400).json({
        message: "O campo cpf deve ter 11 digítos",
      });
    }

    const cpfExistente = await prisma.proprietario.findUnique({
      where: {
        cpf,
      },
    });

    if (cpfExistente) {
      return res.status(400).json({
        message: "Esse cpf já existe",
      });
    }

    if (!telefone) {
      return res.status(400).json({
        message: "O campo telefone deve preenchido",
      });
    }

    if (typeof telefone !== "string") {
      return res.status(400).json({
        message: "Digite um telefone válido",
      });
    }

    if (telefone.length <= 11) {
      return res.status(400).json({
        message: "O campo deve ter no minímo 10 carácteres",
      });
    }

    telefone = telefone.trim();

    if (!regex.test(telefone)) {
      return res.status(400).json({
        message: "Escreva apenas numeros",
      });
    }

    const telefoneExistente = await prisma.proprietario.findUnique({
      where: {
        telefone,
      },
    });

    if (telefoneExistente) {
      return res.status(400).json({
        message: "Telefone já existe",
      });
    }
    const data = await prisma.proprietario.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        nome,
        cpf,
        telefone,
      },
    });
    res.status(201).json(data);
  }

  async destroy(req, res) {
    const data = await prisma.proprietario.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    const status = data ? 200 : 404;
    console.log("DELETE :: /proprietarios/:id", JSON.stringify(data));
    res.status(status).json(data);
  }
}

export default new ProprietariosControllers();
