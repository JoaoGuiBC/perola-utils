<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { PhGearSix } from '@phosphor-icons/vue'

import { useAiConfigStore } from '@/stores/ai-config-store'

import AiSectionModal from './ai-section-modal.vue'

const store = useAiConfigStore()
const { isModalOpen } = storeToRefs(store)

onMounted(async () => {
    await store.init()
})
</script>

<template>
    <button
        type="button"
        class="btn btn-square btn-accent text-accent-content cursor-pointer group"
        @click="store.isModalOpen = !isModalOpen"
    >
        <PhGearSix class="size-6 group-hover:rotate-90 transition-transform duration-300" />
    </button>

    <AiSectionModal />
</template>
