import prisma from '../../../lib/prisma.js';

class PermanenciaControllers{

    async index(req,res){
        const data = await prisma.permanencia.findMany();
        res.status(200).json(data);
        console.log("GET :: /permanencias", JSON.stringify(data));
    }

    async show(req,res){
        const data = await prisma.permanencia.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
        const status = data ? 200 : 404;
        res.status(status);
        res.json(data);
    }

    async create(req, res) {

    const { carroId, vagaId } = req.body;

    const carro = await prisma.carro.findUnique({
        where: { id: carroId }
    });

    if (!carro) {
        return res.status(404).json({
            message: "Carro não encontrado."
        });
    }

    const vaga = await prisma.vaga.findUnique({
        where: { id: vagaId }
    });

    if (!vaga) {
        return res.status(404).json({
            message: "Vaga não encontrada."
        });
    }

    if (vaga.ocupada) {
        return res.status(400).json({
            message: "A vaga já está ocupada."
        });
    }

    const carroEstacionado = await prisma.permanencia.findFirst({
        where: {
            carroId,
            saida: null
        }
    });

    if (carroEstacionado) {
        return res.status(400).json({
            message: "Este carro já está estacionado."
        });
    }

    const data = await prisma.permanencia.create({
        data: {
            carroId,
            vagaId
        }
    });

    await prisma.vaga.update({
        where: {
            id: vagaId
        },
        data: {
            ocupada: true
        }
    });

    return res.status(201).json(data);
}
    async finalizar(req, res) {
    const { id } = req.params;

    const permanencia = await prisma.permanencia.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!permanencia) {
        return res.status(404).json({
            message: "Permanência não encontrada."
        });
    }

    const data = await prisma.permanencia.update({
        where: {
            id: Number(id)
        },
        data: {
            saida: new Date()
        }
    });

    await prisma.vaga.update({
        where: {
            id: permanencia.vagaId
        },
        data: {
            ocupada: false
        }
    });

    return res.status(200).json(data);
}
}

export default new PermanenciaControllers()