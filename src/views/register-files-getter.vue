<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getCurrentWebview } from '@tauri-apps/api/webview'

import { readFile } from '@/utils/files-getter-read-file'
import FileGetterInfoCard from '@/components/file-getter-info-card.vue'

const screenContent = ref<'none' | 'error' | 'info'>('none')

const errorMessage = ref('nada')

const withoutRegisterList = ref<Array<string>>([])
const notFoundRegisterList = ref<Array<string>>([])

const isDragging = ref(false)

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
        await readFile(file, errorMessage, screenContent, withoutRegisterList, notFoundRegisterList)
    } catch (error) {
        errorMessage.value = 'ERRO AO LER O ARQUIVO'
        screenContent.value = 'error'
        console.error(error)
    }
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

            await readFile(
                file,
                errorMessage,
                screenContent,
                withoutRegisterList,
                notFoundRegisterList,
            )
        }
    })
})

onUnmounted(() => {
    if (unlisten) unlisten()
})
</script>

<template>
    <main class="flex flex-col items-center py-6 px-4 h-screen w-full">
        <h1 class="text-primary font-semibold text-lg drop-shadow-md drop-shadow-primary/30">
            BUSCADOR DE REGISTROS
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

        <section
            class="flex flex-col items-center text-sm w-full max-w-3xl p-4 flex-1 min-h-0 overflow-y-auto"
            v-if="screenContent === 'info'"
        >
            <strong class="text-base/tight">Informações:</strong>
            <p class="text-xs/tight mb-4">
                Essas informações também podem ser vistas no arquivo 'log.txt'
            </p>

            <FileGetterInfoCard
                class="mb-5"
                title="Registros de busca manual"
                :items-list="withoutRegisterList"
            />

            <FileGetterInfoCard
                title="Registros não encontrados"
                :items-list="notFoundRegisterList"
            />
        </section>
    </main>
</template>
