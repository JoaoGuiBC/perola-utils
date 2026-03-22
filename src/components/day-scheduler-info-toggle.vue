<script setup lang="ts">
import { PhCheck, PhX } from '@phosphor-icons/vue'

const model = defineModel<boolean>()

defineProps<{
    label: string
    activeText: string
    inactiveText: string
}>()
</script>

<template>
    <div class="flex flex-col">
        <span class="text-sm/tight">{{ label }}</span>

        <div class="flex gap-1 items-center pl-1 h-full">
            <label class="toggle text-base-content">
                <input type="checkbox" v-model="model" />
                <PhX weight="bold" />
                <PhCheck weight="bold" />
            </label>

            <span class="leading-none text-sm">
                {{ model ? activeText : inactiveText }}
            </span>
        </div>
    </div>
</template>
