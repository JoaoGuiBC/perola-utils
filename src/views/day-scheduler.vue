<script setup lang="ts">
import 'cally'

import { onMounted, onUnmounted, ref } from 'vue'

import { getCurrentWebview } from '@tauri-apps/api/webview'

import { extractEditalData } from '@/utils/llm-extractor'
import { createPDF } from '@/utils/create-pdf'

import { Auction, auctionSchema } from '@/schemas/auction'

import SchedulerCalendar from '@/components/scheduler-calendar.vue'
import SchedulerFileStat from '@/components/scheduler-file-stat.vue'
import DaySchedulerAiSection from '@/components/day-scheduler-ai-section.vue'

const isDragging = ref(false)
const selectedFiles = ref<Array<File>>([])
const parsingErrors = ref<Array<{ index: number; fileName: string; error: string }>>([])
const isLoading = ref(false)
const currentProcessingFile = ref(0)
const auctions = ref<Array<Auction>>([])

const prompt = defineModel('prompt', { type: String, default: '' })
const scheduleDate = defineModel('scheduleDate', { type: String, default: '' })
const currentModel = defineModel('currentModel', { type: String, default: '' })
const currentModelError = defineModel('currentModelError', { type: Boolean, default: false })

async function createSchedule() {
    if (!currentModel.value) {
        currentModelError.value = true
        return
    } else {
        currentModelError.value = false
    }

    console.log(scheduleDate.value)
    console.log(selectedFiles.value.length)
    console.log(prompt.value)
    if (!scheduleDate.value || selectedFiles.value.length === 0 || !prompt.value) return

    isLoading.value = true

    for (const i in selectedFiles.value) {
        try {
            const index = Number(i)
            const file = selectedFiles.value[index]

            currentProcessingFile.value = index + 1

            const response = await extractEditalData(file, prompt.value, currentModel.value)

            const { success, data, error } = auctionSchema.safeParse(response)

            console.log(response)
            console.log(error)

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

    if (auctions.value.length > 0) await createPDF(auctions.value, new Date(scheduleDate.value))

    selectedFiles.value = []
    auctions.value = []
    scheduleDate.value = ''

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
    <main class="flex flex-col items-center pt-6 pb-10 px-4 flex-1 max-h-screen">
        <h1 class="text-primary font-semibold text-lg drop-shadow-md drop-shadow-primary/30">
            PROGRAMAÇÃO DO DIA
        </h1>

        <fieldset class="fieldset mt-2 mb-3">
            <legend v-if="true" class="fieldset-legend p-0">
                Selecione ou arraste os arquivos .pdf
                <span class="underline underline-offset-2 text-primary">(MÁXIMO DE 5)</span>
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

        <DaySchedulerAiSection
            v-model:prompt="prompt"
            v-model:current-model="currentModel"
            v-model:current-model-error="currentModelError"
        />

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

        <button
            type="button"
            :disabled="isLoading"
            class="btn transition-all"
            @click="createSchedule"
        >
            <span v-if="isLoading" class="loading loading-ring" />
            {{ isLoading ? 'GERANDO' : 'GERAR PROGRAMAÇÃO' }}
        </button>
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
    </main>
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
