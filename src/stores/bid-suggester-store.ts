import { ref } from 'vue'
import { defineStore } from 'pinia'

import { load, Store as TauriStore } from '@tauri-apps/plugin-store'

let tauriStore: TauriStore

type PercentageValue = { label: string; value: number }

export const useBidSuggesterStore = defineStore('bid_suggester', () => {
    const values = ref<PercentageValue[]>([])

    async function init() {
        tauriStore = await load('settings.json')

        const inMemoryValues = (await tauriStore.get<PercentageValue[]>('bid_values')) || []

        values.value = inMemoryValues
    }

    async function save() {
        await tauriStore.set('bid_values', values.value)

        await tauriStore.save()
    }

    return {
        values,
        init,
        save,
    }
})
