import { z } from "zod"
import { TipoVaga } from "../../../generated/prisma/enums.ts";

export const createVagaSchema = z.object({
    numero: z.string().trim().min(1, "O numéro da vaga precisa de no minímo 1 carácter.").transform((numero) => numero.toUpperCase()),
    tipo: z.nativeEnum(TipoVaga),
    setorId: z.number().int().positive()
})