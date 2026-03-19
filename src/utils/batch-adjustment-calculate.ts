import type { BatchedItems } from './batch-adjustment-read-file'
import { roundToDecimals } from './round-to-decimals'

export interface CalculateOptions {
    decimalPlaces: number
}

export function calculateBatchAdjustment(
    batches: Array<BatchedItems>,
    options: CalculateOptions,
): Array<BatchedItems> {
    const { decimalPlaces } = options

    return batches.map((batch) => {
        const ratio = batch.wonPrice / batch.originalPrice

        const items = batch.items.map((item) => ({
            ...item,
            unityWonPrice: roundToDecimals(item.unityOriginalPrice * ratio, decimalPlaces),
            totalWonPrice: roundToDecimals(item.totalOriginalPrice * ratio, decimalPlaces),
        }))

        const sumOfTotals = items.reduce((sum, item) => sum + item.totalWonPrice, 0)
        const roundedWonPrice = roundToDecimals(batch.wonPrice, decimalPlaces)
        const difference = roundToDecimals(roundedWonPrice - sumOfTotals, decimalPlaces)

        if (difference !== 0 && items.length > 0) {
            const lastItem = items[items.length - 1]
            lastItem.totalWonPrice = roundToDecimals(
                lastItem.totalWonPrice + difference,
                decimalPlaces,
            )
        }

        return { ...batch, items }
    })
}
