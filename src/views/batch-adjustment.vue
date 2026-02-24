<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getCurrentWebview } from '@tauri-apps/api/webview'

import { readFile, BatchedItems } from '@/utils/batch-adjustment-read-file'
import { currencyFormatter } from '@/utils/currency-formatter'

const isDragging = ref(false)
const screenContent = ref<'error' | 'success' | undefined>()
const errorMessage = ref('')
const formMessage = ref('')
const itemsList = ref<Array<BatchedItems>>([])

async function handleFileInput(event: InputEvent) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xlsm')) {
        errorMessage.value = 'FORMATO DE ARQUIVO INVÁLIDO'
        screenContent.value = 'error'
        return
    }

    try {
        itemsList.value = await readFile(file, errorMessage, screenContent)
        screenContent.value = 'success'
    } catch (error) {
        errorMessage.value = 'ERRO AO LER O ARQUIVO'
        screenContent.value = 'error'
        console.error(error)
    }
}

function calculate() {
    if (itemsList.value.some((batch) => !batch.wonPrice || batch.wonPrice <= 0)) {
        formMessage.value = 'PREENCHA TODOS OS VALORES GANHOS!'
        return
    }

    const newValues = itemsList.value.map((batch) => {
        const ratio = batch.wonPrice / batch.originalPrice

        const newBatchValue = batch.items.map((item) => {
            return {
                ...item,
                unityWonPrice: item.unityOriginalPrice * ratio,
                totalWonPrice: item.totalOriginalPrice * ratio,
            }
        })

        return { ...batch, items: newBatchValue }
    })

    itemsList.value = newValues
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

            itemsList.value = await readFile(file, errorMessage, screenContent)
            screenContent.value = 'success'
        }
    })
})

onUnmounted(() => {
    if (unlisten) unlisten()
})
</script>

<template>
    <main class="flex flex-col items-center pt-6 pb-10 px-4 flex-1 max-h-screen">
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

        <section class="flex flex-col flex-1 h-[82%]" v-if="screenContent === 'success'">
            <div class="flex w-full items-center justify-end mb-2 gap-2">
                <span v-if="formMessage" class="text-xs text-error">{{ formMessage }}</span>
                <button type="button" class="btn btn-sm btn-soft btn-primary" @click="calculate">
                    CALCULAR
                </button>
            </div>

            <div class="overflow-x-auto rounded-box border border-base-content/12 bg-base-200">
                <table class="table table-sm table-pin-rows overflow-x-scroll">
                    <template
                        v-for="{ batch, items, originalPrice, wonPrice } in itemsList"
                        :key="batch"
                    >
                        <thead>
                            <tr>
                                <th colspan="7" class="bg-base-300 text-lg">
                                    <div class="flex items-center">
                                        <span class="mr-auto">LOTE {{ batch }}</span>
                                        <span class="text-xs/tight font-medium">
                                            VALOR ATUAL:
                                        </span>
                                        <input
                                            type="text"
                                            class="input input-xs w-24 ml-2 mr-8 font-medium cursor-default"
                                            :value="currencyFormatter(originalPrice)"
                                            readonly
                                        />
                                        <span class="text-xs/tight font-medium">VALOR GANHO:</span>
                                        <input
                                            type="number"
                                            class="input input-xs w-28 ml-2 font-medium"
                                            :value="wonPrice"
                                            @input="
                                                (e) => {
                                                    const value = (e.target as HTMLInputElement)
                                                        .value
                                                    itemsList = itemsList.map((item) => {
                                                        if (item.batch !== batch) return item
                                                        return {
                                                            ...item,
                                                            wonPrice: Number(value),
                                                        }
                                                    })
                                                }
                                            "
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="py-0 m-0 text-xs bg-base-100">
                                <th>ITEM</th>
                                <th>NOME</th>
                                <th>QNT</th>
                                <th class="text-center">UNIT.</th>
                                <th class="text-center">TOTAL</th>
                                <th class="text-center">UNIT. ATUAL.</th>
                                <th class="text-center">TOTAL ATUAL.</th>
                            </tr>

                            <tr v-for="item in items" :key="`${item.item} - ${item.name}`">
                                <td class="text-center">{{ item.item }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.quantity }}</td>
                                <td class="text-center">
                                    {{ currencyFormatter(item.unityOriginalPrice) }}
                                </td>
                                <td class="text-center">
                                    {{ currencyFormatter(item.totalOriginalPrice) }}
                                </td>
                                <td class="text-center">
                                    {{
                                        item.unityWonPrice > 0
                                            ? currencyFormatter(item.unityWonPrice)
                                            : ''
                                    }}
                                </td>
                                <td class="text-center">
                                    {{
                                        item.totalWonPrice > 0
                                            ? currencyFormatter(item.totalWonPrice)
                                            : ''
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </table>
            </div>
        </section>
    </main>
</template>
