export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0b'

    const units = ['b', 'kb', 'mb', 'gb']
    const k = 1024
    const decimals = 1

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = bytes / Math.pow(k, i)

    if (i === 0) {
        return `${size}${units[i]}`
    }

    const formatted = size.toFixed(decimals)
    const value = formatted.endsWith('.0') ? Math.floor(size) : formatted

    return `${value}${units[i]}`
}
