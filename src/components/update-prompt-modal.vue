<script lang="ts" setup>
import { ref, watch } from 'vue'

const { updatePromptFunction } = defineProps<{
    updatePromptFunction: () => Promise<void>
}>()

const isLoading = ref(false)
const updated = ref(false)
const dialogRef = ref<HTMLDialogElement | null>(null)

const prompt = defineModel('prompt', { type: String, default: '' })
const open = defineModel('open', { type: Boolean, default: false })

watch(open, (value) => {
    if (value) {
        dialogRef.value?.showModal()
    } else {
        dialogRef.value?.close()
    }
})

function handleClose() {
    open.value = false
}

async function handleUpdatePrompt() {
    if (prompt.value.length < 10) return

    isLoading.value = true
    updated.value = false

    await updatePromptFunction()

    updated.value = true
    isLoading.value = false
}
</script>

<template>
    <dialog ref="dialogRef" id="update_prompt_modal" class="modal" @close="handleClose">
        <div class="modal-box max-w-none w-8/12 p-4 relative">
            <header class="flex items-center gap-2">
                <h3 class="text-lg font-bold">PROMPT</h3>

                <Transition name="success-text">
                    <span v-if="updated" class="text-xs">ATUALIZADO!</span>
                </Transition>
            </header>

            <textarea
                class="textarea textarea-ghost w-full min-h-36 bg-base-200"
                placeholder="prompt"
                v-model="prompt"
            />

            <button
                type="button"
                class="btn btn-xs btn-secondary btn-soft mt-2 transition-all"
                :disabled="isLoading"
                @click="handleUpdatePrompt"
            >
                <span v-if="isLoading" class="loading loading-ring" />
                {{ isLoading ? 'SALVANDO' : 'SALVAR' }}
            </button>

            <button
                type="button"
                aria-label="close-modal"
                class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1"
                @click="handleClose"
            >
                ✕
            </button>
        </div>

        <form method="dialog" class="modal-backdrop">
            <button>FECHAR</button>
        </form>
    </dialog>
</template>

<style scoped>
.calendar-enter-active,
.calendar-leave-active {
    transition: opacity 0.5s
        linear(
            0,
            0.01 1%,
            0.042 2.1%,
            0.093 3.2%,
            0.167 4.4%,
            0.337 6.6%,
            0.843 12.4%,
            0.971 14.1%,
            1.074 15.7%,
            1.158 17.3%,
            1.217 18.8%,
            1.259 20.3%,
            1.285 21.9%,
            1.291 24.2%,
            1.265 26.7%,
            1.212 29.3%,
            1.06 35.3%,
            0.994 38.3%,
            0.944 41.6%,
            0.918 45%,
            0.915 47.4%,
            0.922 50.1%,
            1.001 61.6%,
            1.023 68%,
            1.023 73.6%,
            0.995 89%,
            1
        );
}

.calendar-enter-from,
.calendar-leave-to {
    opacity: 0;
}

.calendar-enter-to,
.calendar-leave-from {
    opacity: 1;
}
</style>
