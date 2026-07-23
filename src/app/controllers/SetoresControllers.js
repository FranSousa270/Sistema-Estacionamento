import prisma from '../../../lib/prisma.js';

class SetoresControllers{

   async index(req,res){
        const data = await prisma.setor.findMany();
        res.status(200).json(data);
        console.log("GET :: /setores", JSON.stringify(data));
    }

    async show(req,res){
        const data = await prisma.setor.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        const status = data ? 200 : 404;
        res.status(status);
        res.json(data);
    }

    async create(req,res){
        const {nome} = req.body
        const data = await prisma.setor.create({
            data: {
                nome
            }
        });
        res.status(201).json(data);
    }
    
    async update(req,res){
        const {nome} = req.body
        const data = await prisma.setor.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                nome
            }
        });
        res.status(200).json(data);
    }

    async destroy(req,res){
        const data = await prisma.setor.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.status(200).json(data);
    }
}

export default new SetoresControllers()