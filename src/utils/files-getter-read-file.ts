import { Ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { readXLSXFile } from './xlsx-file-reader'

import { RowSchemaType, tableSchema } from '@/schemas/register-files-table-schema'

interface RegisterResponseWithMessage {
    WithMessage: {
        message: string
    }
}

interface RegisterResponseWithItems {
    WithItems: {
        not_found: Array<RowSchemaType>
    }
}

export async function readFile(
    file: File,
    errorMessage: Ref<string, string>,
    screenContent: Ref<'none' | 'error' | 'info', 'none' | 'error' | 'info'>,
    withoutRegisterList: Ref<string[], string[]>,
    notFoundRegisterList: Ref<string[], string[]>,
) {
    const onlyNumbersRegex = /^\d+$/

    try {
        const xlsxData = await readXLSXFile(file)
        const mappedData = xlsxData.map((row) => {
            return { item: row[1], produto: row[3], registro: row[5], fornecedor: row[4] }
        })

        const itemsWithRegister = mappedData.filter(
            (row) =>
                onlyNumbersRegex.test(String(row.registro)) ||
                row.fornecedor === 'CONFORT' ||
                row.fornecedor === 'LIPY',
        )
        const itemsWithoutRegister = mappedData.filter(
            (row) =>
                !onlyNumbersRegex.test(String(row.registro)) &&
                row.fornecedor !== 'CONFORT' &&
                row.fornecedor !== 'LIPY',
        )

        const { success: withRegisterSuccess, data: withRegisterData } =
            tableSchema.safeParse(itemsWithRegister)
        const { success: withoutRegisterSuccess, data: withoutRegisterData } =
            tableSchema.safeParse(itemsWithoutRegister)

        if (!withRegisterSuccess || !withoutRegisterSuccess) return

        const result = await invoke<RegisterResponseWithMessage | RegisterResponseWithItems>(
            'get_register_files',
            { items: withRegisterData, itemsWithoutRegister: withoutRegisterData },
        )

        if ('WithMessage' in result) {
            errorMessage.value = result.WithMessage.message
            screenContent.value = 'error'
            return
        }

        if ('WithItems' in result) {
            withoutRegisterList.value = itemsWithoutRegister.map((item) => {
                return `${item.item} - ${item.produto} - ${item.registro}`
            })

            notFoundRegisterList.value = result.WithItems.not_found.map((item) => {
                return `${item.item} - ${item.produto} - ${item.registro}`
            })

            screenContent.value = 'info'
            return
        }

        screenContent.value = 'none'
        return
    } catch (error) {
        throw error
    }
}
