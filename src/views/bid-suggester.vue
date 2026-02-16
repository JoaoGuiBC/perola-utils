<script setup lang="ts">
import { ref } from 'vue'

import Table from '@/components/bid-suggester-table.vue'

import { RowSchemaType, tableSchema } from '@/schemas/table-data-schema'
import { readXLSXFile } from '@/utils/xlsx-file-reader'

const tableData = ref<Array<RowSchemaType>>([])

async function readFile(file: File) {
    try {
        const xlsxData = await readXLSXFile(file)
        const mappedData = xlsxData.map((row) => {
            return { item: row[1], produto: row[3], minimo: row[9] }
        })

        const { success, data } = tableSchema.safeParse(mappedData)

        if (!success) return

        tableData.value = data

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
        return console.error('FORMATO DE ARQUIVO INVÁLIDO')
    }

    try {
        await readFile(file)
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <main class="flex flex-col items-center py-6 px-6 flex-1">
        <h1 class="text-primary font-semibold text-lg drop-shadow-md drop-shadow-primary/30">
            SUGESTÕES DE LANCES FECHADOS
        </h1>

        <fieldset class="fieldset mt-2 mb-3">
            <legend class="fieldset-legend p-0">Selecione o .xlsx</legend>
            <input
                type="file"
                accept=".xlsx"
                class="file-input file-input-neutral file-input-md w-84 drop-shadow-sm"
                @input="(event) => handleFileInput(event)"
            />
        </fieldset>

        <Table :table-data="tableData" />
    </main>
</template>
