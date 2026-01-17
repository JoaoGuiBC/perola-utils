<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core'
import { onMounted, onUnmounted, ref } from 'vue'

import { tableSchema, RowSchemaType } from '@/schemas/register-files-table-schema'
import { readXLSXFile } from '@/utils/xlsx-file-reader'
import { getCurrentWebview } from '@tauri-apps/api/webview'

const screenContent = ref<'none' | 'error' | 'info'>('none')

const errorMessage = ref("nada")

const withoutRegisterList = ref<Array<string>>([])
const notFoundRegisterList = ref<Array<string>>([])

const isDragging = ref(false)

interface RegisterResponseWithMessage {
    WithMessage: {
        message: string,
    }
}

interface RegisterResponseWithItems {
    WithItems: {
        not_found: Array<RowSchemaType>
    }
}

async function readFile(file: File) {
    const onlyNumbersRegex = /^\d+$/

    try {
        const xlsxData = await readXLSXFile(file)
        const mappedData = xlsxData.map(row => {
            return { item: row[1], produto: row[3], registro: row[5], fornecedor: row[4] }
        })

        const itemsWithRegister = mappedData.filter(row =>
            onlyNumbersRegex.test(String(row.registro)) || row.fornecedor === "CONFORT" || row.fornecedor === "LIPY"
        )
        const itemsWithoutRegister = mappedData.filter(row =>
            !onlyNumbersRegex.test(String(row.registro)) && row.fornecedor !== "CONFORT" && row.fornecedor !== "LIPY"
        )

        const { success: withRegisterSuccess, data: withRegisterData } = tableSchema.safeParse(itemsWithRegister)
        const { success: withoutRegisterSuccess, data: withoutRegisterData } = tableSchema.safeParse(itemsWithoutRegister)

        if (!withRegisterSuccess || !withoutRegisterSuccess) return

        const result = await invoke<RegisterResponseWithMessage | RegisterResponseWithItems>(
            'get_register_files', { items: withRegisterData, itemsWithoutRegister: withoutRegisterData }
        )
        
        if ('WithMessage' in result) {
            errorMessage.value = result.WithMessage.message
            screenContent.value = 'error'
            return
        }

        if ('WithItems' in result) {
            withoutRegisterList.value = itemsWithoutRegister.map(item => {
                return `${item.item} - ${item.produto} - ${item.registro}`
            })

            notFoundRegisterList.value = result.WithItems.not_found.map(item => {
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

async function handleFileInput(event: InputEvent) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (!file) return
    
    if (!file.name.endsWith('.xlsx')) {
        errorMessage.value = "FORMATO DE ARQUIVO INVÁLIDO"
        screenContent.value = 'error'
        return
    }

    try {
        await readFile(file)
    } catch (error) {
        errorMessage.value = "ERRO AO LER O ARQUIVO"
        screenContent.value = 'error'
        console.error(error)
    }
}

let unlisten: (() => void) | null = null

onMounted(async () => {
    unlisten = await getCurrentWebview().onDragDropEvent(async event => {
        if (event.payload.type === 'enter') {
            isDragging.value = true
        }
        if (event.payload.type === 'leave') {
            isDragging.value = false
        }

        if (event.payload.type === 'drop') {
            isDragging.value = false
            const filePath = event.payload.paths[0]

            if (!filePath.endsWith('.xlsx')) {
                errorMessage.value = "FORMATO DE ARQUIVO INVÁLIDO"
                screenContent.value = 'error'
                return
            }

            const { convertFileSrc } = await import('@tauri-apps/api/core')
            const fileUrl = convertFileSrc(filePath)
            const response = await fetch(fileUrl)
            const blob = await response.blob()
            const file = new File([blob], filePath.split('\\').pop() || 'file.xlsx')
            
            await readFile(file) 
        }
    })
})

onUnmounted(() => {
    if (unlisten) unlisten()
})
</script>

<template>
    <main class="flex flex-col items-center py-6 px-6 flex-1">
        <h1 class="text-primary font-semibold text-lg drop-shadow-md drop-shadow-primary/30">BUSCADOR DE REGISTROS</h1>

        <fieldset class="fieldset mt-2 mb-3">
            <legend v-if="!isDragging" class="fieldset-legend p-0">
                Selecione ou arraste o .xlsx
            </legend>
            <legend v-else class="fieldset-legend p-0">
                Solte o arquivo
            </legend>

            <input
                type="file"
                accept=".xlsx"
                :class="[
                    'file-input file-input-neutral file-input-md w-84 drop-shadow-sm transition-all',
                    { 'border-dashed border-primary bg-primary/10': isDragging }
                ]"
                @input="(event) => handleFileInput(event)"
            />
        </fieldset>

        <section class="flex flex-col items-center" v-if="screenContent === 'error'">
            <strong>Ocorreu o seguinte problema:</strong>
            <span>{{ errorMessage }}</span>
        </section>

        <section class="flex flex-col items-center text-sm w-2xl" v-if="screenContent === 'info'">
            <strong class="text-base/tight">Informações:</strong>
            <p class="text-xs/tight mb-2">Essas informações também podem ser vistas no arquivo 'log.txt'</p>

            <div class="flex gap-2">
                <span class="text-sm min-w-fit">Registros de busca manual:</span>

                <div class="flex flex-col mb-3">
                    <span
                        class="mb-0.5 pb-0.5 border-b border-base-content/50"
                        v-for="item in withoutRegisterList"
                    >
                        {{ item }}
                    </span>
                </div>
            </div>

            <div class="flex gap-2">
                <span class="text-sm min-w-fit">Registros não encontrados:</span>

                <div class="flex flex-col">
                    <span
                        class="mb-0.5 pb-0.5 border-b border-base-content/50"
                        v-for="item in notFoundRegisterList"
                    >
                        {{ item }}
                    </span>
                </div>
            </div>
        </section>

    </main>
</template>
