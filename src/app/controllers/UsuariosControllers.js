import prisma from "../../../lib/prisma.js";

class UsuariosControllers {
  async index(req, res) {
    const data = await prisma.usuario.findMany();
    res.status(200).json(data);
    console.log("GET :: /usuarios", JSON.stringify(data));
  }

  async show(req, res) {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    const status = usuario ? 200 : 404;

    res.status(status);
    res.json(usuario);
  }

  async create(req, res) {
    const { nome, email, senha } = req.body;
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
      },
    });
    res.status(201);
    res.json({ id: usuario.id, nome, email });
  }

  async update(req, res) {
    const { nome, email, senha } = req.body;
    const data = await prisma.usuario.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        nome,
        email,
        senha,
      },
    });
    res.json(data);
  }

  async destroy(req, res) {
    const data = await prisma.usuario.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(data);
  }
}

export default new UsuariosControllers();
