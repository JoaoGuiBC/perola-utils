import z from 'zod'

export const rowSchema = z.object({
    batch: z.coerce.number(),
    item: z.coerce.number(),
    name: z.string(),
    quantity: z.coerce.number(),
    unityPrice: z.coerce.number(),
    totalPrice: z.coerce.number(),
})

export const tableSchema = z.array(rowSchema)

export type RowSchemaType = {
    batch: number
    item: number
    name: string
    quantity: number
    unityPrice: number
    totalPrice: number
}
