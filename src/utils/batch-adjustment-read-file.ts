import { readXLSXFile } from './xlsx-file-reader'
import { tableSchema } from '@/schemas/batch-adjustment-table-schema'

type Item = {
    item: number
    name: string
    quantity: number
    unityOriginalPrice: number
    unityWonPrice: number
    totalOriginalPrice: number
    totalWonPrice: number
}

export interface BatchedItems {
    batch: number
    originalPrice: number
    wonPrice: number
    items: Array<Item>
}

export class ReadFileError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ReadFileError'
    }
}

export async function readFile(file: File): Promise<Array<BatchedItems>> {
    const xlsxData = await readXLSXFile(file)

    const mappedData = xlsxData.map((row) => ({
        batch: row[9],
        item: row[1],
        name: row[3],
        quantity: row[2],
        unityPrice: row[7],
        totalPrice: row[8],
    }))

    const { success, data } = tableSchema.safeParse(mappedData)

    if (!success) {
        throw new ReadFileError('FALHA AO AJUSTAR DADOS DO ARQUIVO')
    }

    return data.reduce<Array<BatchedItems>>((acc, cur) => {
        const existingBatch = acc.find((value) => value.batch === cur.batch)
        const itemData: Item = {
            item: cur.item,
            name: cur.name.split(' ').slice(0, 5).join(' '),
            quantity: cur.quantity,
            unityOriginalPrice: cur.unityPrice,
            totalOriginalPrice: cur.totalPrice,
            unityWonPrice: 0,
            totalWonPrice: 0,
        }

        if (existingBatch) {
            existingBatch.originalPrice += cur.totalPrice
            existingBatch.items.push(itemData)
        } else {
            acc.push({
                batch: cur.batch,
                originalPrice: cur.totalPrice,
                wonPrice: 0,
                items: [itemData],
            })
        }

        return acc
    }, [])
}
