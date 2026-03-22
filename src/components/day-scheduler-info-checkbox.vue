<script setup lang="ts">
const model = defineModel<string[]>()

defineProps<{
    label: string
    id: string
    value: string
}>()
</script>

<template>
    <label :for="id" class="flex items-center gap-1 cursor-pointer">
        <input
            :id="id"
            type="checkbox"
            :value="value"
            v-model="model"
            class="checkbox checkbox-xs checkbox-primary"
        />
        <span class="text-xs/tight">{{ label }}</span>
    </label>
</template>
