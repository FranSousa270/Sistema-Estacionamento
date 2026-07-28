import { z } from "zod"

export const createVeiculoSchema = z.object({
    placa: z.string().trim().length(7, "A placa deve conter 7 carácteres.").transform((placa) => placa.toUpperCase()),
    modelo: z.string().trim().min(2, "O modelo deve ter no minímo 2 carácteres."),
    ano: z.number().min(1900).max(new Date().getFullYear() + 1),
    proprietarioId: z.number().int().positive()
})

