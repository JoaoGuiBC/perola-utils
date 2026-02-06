import z from 'zod'

export const rowSchema = z.object({
    item: z.coerce.number(),
    produto: z.string(),
    registro: z.coerce.string(),
    fornecedor: z.string(),
})

export const tableSchema = z.array(rowSchema)

export type RowSchemaType = {
    item: number
    produto: string
    registro: number
    fornecedor: string
}
