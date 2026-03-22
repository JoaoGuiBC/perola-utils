import z, { type ZodNullable } from 'zod'

import {
    normalizeSistema,
    toUpperCase,
    parsePlatformName,
    roundHour,
    normalizeCityKey,
} from '@/utils/auction-schema-functions'

const isProd = !import.meta.env.DEV

function catchable<T extends z.ZodType>(schema: ZodNullable<T>) {
    return isProd ? schema.catch(null) : schema
}

export const auctionSchema = z.preprocess(
    normalizeCityKey,
    z.object({
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
        pede_amostra: z.preprocess(
            toUpperCase,
            catchable(z.enum(['NÃO', 'SIM', 'PODERÁ']).nullable()),
        ),
    }),
)

export type Auction = z.infer<typeof auctionSchema>

export type AuctionFullInfo = Omit<Auction, 'garantia' | 'sistema' | 'pede_amostra'> & {
    garantia: boolean
    sistema: 'ABERTO' | 'ABERTO E FECHADO' | null
    pede_amostra: 'SIM' | 'NÃO' | 'PODERÁ' | null
    produtos_ofertados: Array<string>
    docs: boolean
}
