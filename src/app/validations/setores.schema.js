import { z } from "zod"

export const createSetorSchema = z.object({
    nome: z.string().trim().min(1, "O nome do setor deve ser preenchido.").transform((nome) => nome.toUpperCase())
})