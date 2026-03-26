import { ref } from 'vue'
import { defineStore } from 'pinia'

import { load, Store as TauriStore } from '@tauri-apps/plugin-store'

let tauriStore: TauriStore

export const useAiConfigStore = defineStore('ai_config', () => {
    const isModalOpen = ref(false)

    const prompt = ref('')
    const selected_provider = ref('')
    const api_key = ref('')
    const selected_model = ref('')
    const model_list = ref<string[]>([])

    async function init() {
        tauriStore = await load('settings.json')

        const inMemoryPrompt = (await tauriStore.get<string>('prompt')) || ''
        const inMemorySelectedProvider =
            (await tauriStore.get<'gemini' | 'anthropic'>('selected_provider')) || 'gemini'
        const inMemoryApiKey = (await tauriStore.get<string>('api_key')) || ''
        const inMemorySelectedModel = (await tauriStore.get<string>('selected_model')) || ''
        const inMemoryModelList = (await tauriStore.get<string[]>('model_list')) || []

        console.log(inMemorySelectedModel)

        prompt.value = inMemoryPrompt
        selected_provider.value = inMemorySelectedProvider
        api_key.value = inMemoryApiKey
        selected_model.value = inMemorySelectedModel
        model_list.value = inMemoryModelList
    }

    async function save() {
        await tauriStore.set('prompt', prompt.value)
        await tauriStore.set('selected_provider', selected_provider.value)
        await tauriStore.set('api_key', api_key.value)
        await tauriStore.set('selected_model', selected_model.value)
        await tauriStore.set('model_list', model_list.value)

        tauriStore.save()
    }

    function isConfigSet() {
        return (
            !!prompt.value && !!selected_provider.value && !!api_key.value && !!selected_model.value
        )
    }

    return {
        isModalOpen,
        prompt,
        selected_provider,
        api_key,
        selected_model,
        model_list,
        init,
        save,
        isConfigSet,
    }
})
