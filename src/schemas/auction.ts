import z, { type ZodNullable } from 'zod'

import {
    normalizeSistema,
    toUpperCase,
    parsePlatformName,
    roundHour,
} from '@/utils/auction-schema-functions'

const isProd = !import.meta.env.DEV

function catchable<T extends z.ZodType>(schema: ZodNullable<T>) {
    return isProd ? schema.catch(null) : schema
}

export const auctionSchema = z.object({
    municipio_uf: catchable(z.string().nullable()),
    hora: z.preprocess(roundHour, catchable(z.string().nullable())),
    plataforma: z.preprocess(parsePlatformName, catchable(z.string().nullable())),
    pe: catchable(z.string().nullable()),
    validade_proposta: catchable(z.string().nullable()),
    sistema: z.preprocess(
        normalizeSistema,
        catchable(z.enum(['ABERTO', 'ABERTO E FECHADO']).nullable()),
    ),
    uasg: catchable(z.string().nullable()),
    garantia: catchable(z.string().nullable()),
    pede_amostra: z.preprocess(toUpperCase, catchable(z.enum(['NÃO', 'SIM', 'PODERÁ']).nullable())),
})

export type Auction = z.infer<typeof auctionSchema>
