<script setup lang="ts">
import { PhTrash, PhArrowsCounterClockwise } from '@phosphor-icons/vue'

defineProps<{
    title: string
    isDeleted?: boolean
}>()

defineEmits<{
    (e: 'toggle-delete'): void
}>()
</script>

<template>
    <section
        class="flex flex-col px-2 py-2.5 gap-2 rounded-box shadow-lg shadow-base-content/10 transition-colors"
        :class="{ 'bg-error/10 opacity-75 grayscale-[0.3]': isDeleted }"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <h2
                    class="text-lg font-semibold"
                    :class="isDeleted ? 'text-error line-through' : 'text-base-content/90'"
                >
                    {{ title }}
                </h2>
                <span v-if="isDeleted" class="badge badge-error badge-sm">REMOVIDO</span>
            </div>

            <button
                type="button"
                class="btn btn-sm btn-circle btn-ghost"
                :class="isDeleted ? 'text-base-content' : 'text-error'"
                @click="$emit('toggle-delete')"
                :title="isDeleted ? 'Restaurar' : 'Remover'"
            >
                <PhArrowsCounterClockwise v-if="isDeleted" class="w-4 h-4" />
                <PhTrash v-else class="w-4 h-4" />
            </button>
        </div>

        <div
            class="flex flex-col gap-2 transition-all"
            :class="{ 'opacity-50 pointer-events-none select-none': isDeleted }"
        >
            <slot />
        </div>
    </section>
</template>
