<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import Table from '@/components/bid-suggester-table.vue'

import { RowSchemaType, tableSchema } from '@/schemas/table-data-schema'
import { readXLSXFile } from '@/utils/xlsx-file-reader'
import { getCurrentWebview } from '@tauri-apps/api/webview'

const tableData = ref<Array<RowSchemaType>>([])
const isDragging = ref(false)
const screenContent = ref<'error' | 'success' | undefined>()
const errorMessage = ref('')

async function readFile(file: File) {
    try {
        const xlsxData = await readXLSXFile(file)
        const mappedData = xlsxData.map((row) => {
            return { item: row[1], produto: row[3], minimo: row[9] }
        })

        const { success, data } = tableSchema.safeParse(mappedData)

        if (!success) {
            errorMessage.value = 'ERRO NA ESTRUTURA DA PLANILHA'
            screenContent.value = 'error'
            return
        }

        tableData.value = data
        screenContent.value = 'success'

        return
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : String(error)
        screenContent.value = 'error'
        return
    }
}

async function handleFileInput(event: InputEvent) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xlsm')) {
        errorMessage.value = 'FORMATO DE ARQUIVO INVÁLIDO'
        screenContent.value = 'error'
        return
    }

    await readFile(file)
}

let unlisten: (() => void) | null = null

onMounted(async () => {
    unlisten = await getCurrentWebview().onDragDropEvent(async (event) => {
        if (event.payload.type === 'enter') {
            isDragging.value = true
        }
        if (event.payload.type === 'leave') {
            isDragging.value = false
        }

        if (event.payload.type === 'drop') {
            isDragging.value = false
            const filePath = event.payload.paths[0]

            if (!filePath.endsWith('.xlsx') && !filePath.endsWith('.xlsm')) {
                errorMessage.value = 'FORMATO DE ARQUIVO INVÁLIDO'
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
        <h1 class="text-primary font-semibold text-lg drop-shadow-md drop-shadow-primary/30">
            AJUSTE DE LOTE
        </h1>

        <fieldset class="fieldset mt-2 mb-3">
            <legend v-if="!isDragging" class="fieldset-legend p-0">
                Selecione ou arraste o .xlsx ou .xlsm
            </legend>
            <legend v-else class="fieldset-legend p-0">Solte o arquivo</legend>

            <input
                type="file"
                accept=".xlsx,.xlsm"
                :class="[
                    'file-input file-input-neutral file-input-md w-84 drop-shadow-sm transition-all',
                    { 'border-dashed border-primary bg-primary/10': isDragging },
                ]"
                @input="(event) => handleFileInput(event)"
            />
        </fieldset>

        <section class="flex flex-col items-center" v-if="screenContent === 'error'">
            <strong>Ocorreu o seguinte problema:</strong>
            <span>{{ errorMessage }}</span>
        </section>

        <Table v-if="screenContent === 'success'" :table-data="tableData" />
    </main>
</template>
