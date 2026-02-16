import dayjs from 'dayjs'

export function formatDate(date: Date) {
    return dayjs(date).add(5, 'hour').format('DD/MM/YYYY')
}
