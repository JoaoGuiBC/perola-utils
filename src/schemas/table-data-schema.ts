import z from 'zod'

export const rowSchema = z.object({
    item: z.coerce.number(),
    produto: z.string(),
    minimo: z.number(),
})

export const tableSchema = z.array(rowSchema)

export type RowSchemaType = {
    item: number
    produto: string
    minimo: number
}
