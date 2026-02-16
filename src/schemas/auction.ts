import z from 'zod'

export const auctionSchema = z.object({
    municipio_uf: z.string().nullable(),
    hora: z.string().nullable(),
    plataforma: z.string().nullable(),
    pe: z.string().nullable(),
    validade_proposta: z.string().nullable(),
    sistema: z.enum(['ABERTO', 'ABERTO E FECHADO']).nullable(),
    uasg: z.string().nullable(),
    garantia: z.string().nullable(),
    pede_amostra: z.enum(['NÃO', 'SIM', 'PODERÁ']).nullable(),
})

export type Auction = {
    municipio_uf: string | null
    hora: string | null
    plataforma: string | null
    pe: string | null
    validade_proposta: string | null
    sistema: 'ABERTO' | 'ABERTO E FECHADO' | null
    uasg: string | null
    garantia: string | null
    pede_amostra: 'NÃO' | 'SIM' | 'PODERÁ' | null
}
