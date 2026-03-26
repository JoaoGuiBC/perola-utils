<script setup lang="ts">
import 'cally'

import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'

import { getCurrentWebview } from '@tauri-apps/api/webview'

import { auctionSchema } from '@/schemas/auction'
import { extractEditalData } from '@/utils/llm-extractor'

import { useAiConfigStore } from '@/stores/ai-config-store'
import { useDaySchedulerStore } from '@/stores/day-scheduler-store'

import SchedulerCalendar from '@/components/scheduler-calendar.vue'
import SchedulerFileStat from '@/components/scheduler-file-stat.vue'
import DaySchedulerAiSection from '@/components/day-scheduler-ai-section.vue'

const daySchedulerStore = useDaySchedulerStore()
const { currentView, auctions, scheduleDate } = storeToRefs(daySchedulerStore)

const aiConfigStore = useAiConfigStore()
const { api_key, prompt, selected_model, selected_provider } = storeToRefs(aiConfigStore)

const isDragging = ref(false)
const selectedFiles = ref<Array<File>>([])
const parsingErrors = ref<Array<{ index: number; fileName: string; error: string }>>([])
const configWarn = ref(false)
const isLoading = ref(false)
const currentProcessingFile = ref(0)

async function createSchedule() {
    configWarn.value = !aiConfigStore.isConfigSet()
    if (configWarn.value) return

    if (!scheduleDate.value || selectedFiles.value.length === 0) return

    isLoading.value = true

    for (const i in selectedFiles.value) {
        try {
            const index = Number(i)
            const file = selectedFiles.value[index]

            currentProcessingFile.value = index + 1

            const LLMConfig = {
                apiKey: api_key.value,
                model: selected_model.value,
                prompt: prompt.value,
                provider: selected_provider.value,
            }
            const response = await extractEditalData(file, LLMConfig)

            const { success, data } = auctionSchema.safeParse(response)

            if (!success) {
                parsingErrors.value = [
                    ...parsingErrors.value,
                    {
                        index: index + 1,
                        fileName: file.name,
                        error: 'IA RETORNOU DADOS EM FORMATO NÃO RECONHECIDO',
                    },
                ]
                continue
            }

            auctions.value = [...auctions.value, data]
        } catch (error: unknown) {
            const parsedError = error as Error
            const index = Number(i)
            const file = selectedFiles.value[index]

            parsingErrors.value = [
                ...parsingErrors.value,
                { index: index + 1, fileName: file.name, error: parsedError.message },
            ]
            continue
        }
    }

    if (auctions.value.length > 0) currentView.value = 'edit_info'

    selectedFiles.value = []

    currentProcessingFile.value = 0
    isLoading.value = false
}

function handleFileInput(event: InputEvent) {
    const target = event.target as HTMLInputElement
    const files = target.files

    if (!files) return

    handleInsertFile(Array.from(files))
}

function handleInsertFile(files: Array<File>) {
    for (const file of files) {
        if (file.type !== 'application/pdf') continue

        selectedFiles.value = [...selectedFiles.value, file]
    }
}

function handleRemoveFile(fileIndex: number) {
    selectedFiles.value = selectedFiles.value.filter((_, index) => index !== fileIndex)
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
            const filePaths = event.payload.paths

            const { convertFileSrc } = await import('@tauri-apps/api/core')

            const files: Array<File> = await Promise.all(
                filePaths
                    .filter((path) => path.endsWith('.pdf'))
                    .map(async (path, index) => {
                        const fileUrl = convertFileSrc(path)
                        const response = await fetch(fileUrl)
                        const blob = await response.blob()

                        return new File(
                            [blob],
                            path.split(/[/\\]/).pop() || `edital_${index + 1}.pdf`,
                            { type: 'application/pdf' },
                        )
                    }),
            )

            handleInsertFile(files)
        }
    })
})

onUnmounted(() => {
    if (unlisten) unlisten()
})
</script>

<template>
    <fieldset class="fieldset mt-2 mb-3">
        <legend v-if="!isDragging" class="fieldset-legend p-0">
            Selecione ou arraste os arquivos .pdf
        </legend>
        <legend v-else class="fieldset-legend p-0">Solte o arquivo</legend>

        <input
            type="file"
            accept="application/pdf"
            multiple
            :class="[
                'file-input file-input-neutral file-input-md w-84 drop-shadow-sm transition-all',
                { 'border-dashed border-primary bg-primary/10': isDragging },
            ]"
            @input="handleFileInput"
        />
    </fieldset>

    <SchedulerCalendar v-model="scheduleDate" />

    <TransitionGroup
        name="stat-list"
        tag="div"
        class="stats shadow mt-2 mb-4 bg-secondary/25 transition-all max-w-md md:max-w-xl md:min-[864px]:max-w-3xl"
    >
        <SchedulerFileStat
            v-for="(file, index) in selectedFiles"
            :key="`${file.name} - ${file.lastModified}`"
            :file="file"
            :index="index"
            :handle-remove-file="handleRemoveFile"
        />
    </TransitionGroup>

    <div class="flex items-center justify-center gap-1.5">
        <button
            type="button"
            :disabled="isLoading"
            class="btn transition-all"
            @click="createSchedule"
        >
            <span v-if="isLoading" class="loading loading-ring" />
            {{ isLoading ? 'GERANDO' : 'GERAR PROGRAMAÇÃO' }}
        </button>

        <DaySchedulerAiSection />
    </div>

    <p v-if="configWarn" class="underline w-80 text-center leading-tight mt-2 mb-3">
        CHEQUE AS CONFIGURAÇÕES ANTES DE PROSSEGUIR
    </p>

    <legend class="leading-none text-xs text-primary" v-if="currentProcessingFile > 0">
        lendo arquivo {{ currentProcessingFile }} de {{ selectedFiles.length }}
    </legend>

    <div
        v-if="parsingErrors.length > 0"
        class="flex flex-col items-center justify-center max-w-md mt-5 border border-error bg-error/15 p-2 rounded-box shadow-lg"
    >
        <strong class="text-xs mb-1 text-center text-error">
            OCORREU ERRO NOS SEGUINTES ARQUIVOS:
        </strong>
        <p class="text-xs mb-1 last:mb-0" v-for="file in parsingErrors" :key="file.index">
            ARQUIVO {{ file.index }} - {{ file.fileName }}: {{ file.error }}
        </p>
    </div>
</template>

<style lang="css" scoped>
.stat-list-enter-active,
.stat-list-leave-active {
    transition:
        opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        scale 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top center;
}

.stat-list-enter-from,
.stat-list-leave-to {
    opacity: 0;
    scale: 95%;
}

.stat-list-enter-to,
.stat-list-leave-from {
    opacity: 1;
    scale: 100%;
}
</style>
