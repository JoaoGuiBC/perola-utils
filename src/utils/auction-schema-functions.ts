const platformStringRules = [
    {
        match: (s: string) => s === 'Portal de Compras Públicas',
        transform: () => 'Compras Públicas',
    },
    {
        match: (s: string) => s === 'Licitar Digital',
        transform: () => 'Licitar',
    },
] as const

export const parsePlatformName = (val: unknown): unknown | string => {
    if (typeof val !== 'string') return val

    const rule = platformStringRules.find(({ match }) => match(val))
    return rule ? rule.transform() : val
}

export const roundHour = (val: unknown) => {
    if (typeof val !== 'string') return val

    let [hour, minutes] = val.split(':', 2).map((numericVal) => Number(numericVal))

    if (isNaN(hour) || isNaN(minutes)) return val

    minutes = Math.round(minutes / 5) * 5

    if (minutes === 60) {
        minutes = 0
        hour = hour + 1
    }

    const formattedHour = hour.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')

    return `${formattedHour}:${formattedMinutes}`
}

export const toUpperCase = (val: unknown) => (typeof val === 'string' ? val.toUpperCase() : val)

export const normalizeSistema = (val: unknown) => {
    if (typeof val !== 'string') return val

    const upper = val.toUpperCase().trim()

    const fechadoVariants = [
        'ABERTO/FECHADO',
        'ABERTA/FECHADA',
        'ABERTA/FECHADO',
        'ABERTO/FECHADA',
        'ABERTO E FECHADA',
        'ABERTA E FECHADO',
        'ABERTA E FECHADA',
    ]

    if (fechadoVariants.includes(upper)) return 'ABERTO E FECHADO'
    if (upper === 'ABERTA') return 'ABERTO'

    return upper
}

export function normalizeCityKey(val: unknown) {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        const obj = val as Record<string, unknown>
        if ('municipio' in obj && !('municipio_uf' in obj)) {
            const { municipio, ...rest } = obj
            return { municipio_uf: municipio, ...rest }
        }
    }
    return val
}
