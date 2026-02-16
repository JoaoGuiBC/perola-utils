<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'

import { formatFileSize } from '@/utils/format-file-size'

const { file, index, handleRemoveFile } = defineProps<{
    file: File
    index: number
    handleRemoveFile: (index: number) => void
}>()
</script>

<template>
    <div class="stat relative py-2 px-3">
        <button
            aria-label="remove-item-button"
            type="button"
            class="btn btn-xs btn-secondary btn-soft flex items-center justify-center btn-circle absolute shadow top-1 right-1"
            @click="() => handleRemoveFile(index)"
        >
            <PhX :size="14" weight="bold" class="flex items-center justify-center leading-none" />
        </button>
        <div class="stat-title">Arquivo {{ index + 1 }}</div>
        <div class="stat-value text-base">{{ file.name }}</div>
        <div class="stat-desc">{{ formatFileSize(file.size) }}</div>
    </div>
</template>
