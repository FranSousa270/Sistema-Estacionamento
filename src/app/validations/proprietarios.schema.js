import { z } from "zod"

export const createProprietarioSchema = z.object({
    nome: z.string().trim().min(2, "O nome deve ter no minímo 2 carácteres.").regex(/^[\p{L} ]+$/u, "O nome deve conter apenas letras."),
    cpf: z.string().trim().length(11, "O CPF deve ter 11 digítos").regex(/^\d+$/, "O CPF deve conter apenas números."),
    telefone: z.string().trim().min(10, "O campo telefone deve ter no mínimo 10 digítos").max(11).regex(/^\d+$/, "O telefone deve conter apenas números.").optional().or(z.literal(""))
})