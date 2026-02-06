import { Ref } from 'vue'
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

export async function readFile(
    file: File,
    errorMessage: Ref<string, string>,
    screenContent: Ref<'error' | 'success' | undefined, 'error' | 'success' | undefined>,
) {
    try {
        const xlsxData = await readXLSXFile(file)
        const mappedData = xlsxData.map((row) => {
            return {
                batch: row[0],
                item: row[1],
                name: row[3],
                quantity: row[2],
                unityPrice: row[7],
                totalPrice: row[8],
            }
        })

        const { success, data } = tableSchema.safeParse(mappedData)

        console.log(success)
        console.log(data)

        if (!success) {
            errorMessage.value = 'FALHA AO AJUSTAR DADOS DO ARQUIVO'
            screenContent.value = 'error'
        }

        const batchedItems = data!.reduce((acc: Array<BatchedItems>, cur) => {
            const existingBatch = acc.find((value) => value.batch === cur.batch)

            if (existingBatch) {
                existingBatch.originalPrice += cur.totalPrice
                existingBatch.items.push({
                    item: cur.item,
                    name: cur.name.split(' ').slice(0, 5).join(' '),
                    quantity: cur.quantity,
                    unityOriginalPrice: cur.unityPrice,
                    totalOriginalPrice: cur.totalPrice,
                    unityWonPrice: 0,
                    totalWonPrice: 0,
                })
            } else {
                acc.push({
                    batch: cur.batch,
                    originalPrice: cur.totalPrice,
                    wonPrice: 0,
                    items: [
                        {
                            item: cur.item,
                            name: cur.name.split(' ').slice(0, 5).join(' '),
                            quantity: cur.quantity,
                            unityOriginalPrice: cur.unityPrice,
                            totalOriginalPrice: cur.totalPrice,
                            unityWonPrice: 0,
                            totalWonPrice: 0,
                        },
                    ],
                })
            }

            return acc
        }, [] as Array<BatchedItems>)

        console.log(batchedItems)

        return batchedItems
    } catch (error) {
        throw error
    }
}
