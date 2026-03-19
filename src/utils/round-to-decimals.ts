export function roundToDecimals(value: number, decimalPlaces: number): number {
    const factor = 10 ** decimalPlaces
    return Math.round((value + Number.EPSILON) * factor) / factor
}
