import { z } from "zod"

export const createPermanenciaSchema = z.object({
    veiculoId: z.number().int().positive(),
    vagaId: z.number().int().positive()
})