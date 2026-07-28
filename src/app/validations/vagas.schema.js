import { z } from "zod"
import { TipoVaga } from "@prisma/client";

export const createVagaSchema = z.object({
    numero: z.string().trim().min(1, "O numéro da vaga precisa de no minímo 1 carácter."),
    tipo: z.nativeEnum(TipoVaga),
    setorId: z.number().int().positive()
})