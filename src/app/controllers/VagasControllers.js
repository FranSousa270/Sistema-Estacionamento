import prisma from '../../../lib/prisma.js';

class VagasControllers{

    async index(req,res){
        const data = await prisma.vaga.findMany();
        res.status(200).json(data);
        console.log("GET :: /vagas", JSON.stringify(data));
    }

    async show(req,res){
        const data = await prisma.vaga.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        const status = data ? 200 : 404;
        res.status(status);
        res.json(data);
    }

    async create(req,res){
        const {numero, tipo, setorId} = req.body
        const data = await prisma.vaga.create({
            data: {
                numero,
                tipo,
                setorId
            }
        });
        res.status(201).json(data);
    }

    async update(req,res){
        const {numero, tipo, setorId} = req.body
        const data = await prisma.vaga.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                numero,
                tipo,
                setorId
            }
        });
        res.status(200).json(data);
    }

    async destroy(req,res){
        const data = await prisma.vaga.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.status(200).json(data);
    }
}

export default new VagasControllers()