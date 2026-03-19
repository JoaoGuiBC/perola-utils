const formatterCache = new Map<number, Intl.NumberFormat>()

function getFormatter(decimalPlaces: number): Intl.NumberFormat {
    const cached = formatterCache.get(decimalPlaces)
    if (cached) return cached

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: decimalPlaces,
    })

    formatterCache.set(decimalPlaces, formatter)
    return formatter
}

export function currencyFormatter(value: number, decimalPlaces = 4): string {
    return getFormatter(decimalPlaces).format(value)
}
