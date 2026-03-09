<script setup lang="ts">
import { onMounted } from 'vue'
import { load, Store } from '@tauri-apps/plugin-store'
import { PhCheck, PhX } from '@phosphor-icons/vue'

import UpdatePromptModal from './update-prompt-modal.vue'

let store: Store

const prompt = defineModel('prompt', { type: String, default: '' })
const isPromptModalOpen = defineModel('isPromptModalOpen', { type: Boolean, default: false })
const currentModel = defineModel('currentModel', { type: String, default: '' })
const currentModelError = defineModel('currentModelError', { type: Boolean, default: false })

async function updatePrompt() {
    await store.set('prompt', prompt.value)
    await store.save()
}

async function updateModel() {
    await store.set('model', currentModel.value)
    await store.save()
}

onMounted(async () => {
    store = await load('settings.json')
    const savedPrompt = (await store.get<string>('prompt')) || ''
    const savedModel = (await store.get<string>('model')) || ''

    prompt.value = savedPrompt
    currentModel.value = savedModel
})
</script>

<template>
    <div>
        <span
            class="flex items-center justify-center gap-1 transition-all cursor-default text-xs font-semibold drop-shadow-sm"
        >
            <template v-if="prompt">PROMPT ENCONTRADO <PhCheck weight="bold" /></template>
            <template v-else>PROMPT NÃO ENCONTRADO <PhX weight="bold" /></template>
            <button
                type="button"
                class="cursor-pointer text-[0.64rem] opacity-70"
                @click="isPromptModalOpen = true"
            >
                - ATUALIZAR
            </button>
        </span>

        <form
            class="relative flex items-center border rounded-field w-56 my-1.5 border-base-300 data-[error=true]:border-error transition-all"
            :data-error="currentModelError"
            @submit.prevent="updateModel"
        >
            <label
                for="model-input"
                class="absolute -top-1.5 left-1.5 bg-base-100 px-0.5 text-[0.5rem] text-base-content/90"
            >
                MODELO USADO
            </label>

            <input
                name="model-input"
                id="model-input"
                type="text"
                class="input input-ghost input-xs text-center text-base-content/65"
                placeholder="preenchimento obrigatório"
                v-model="currentModel"
            />

            <button
                type="submit"
                class="text-[0.64rem] pr-2 font-semibold cursor-pointer text-base-content/75"
            >
                SALVAR
            </button>
        </form>
    </div>

    <UpdatePromptModal
        v-model:open="isPromptModalOpen"
        :update-prompt-function="updatePrompt"
        v-model:prompt="prompt"
    />
</template>
