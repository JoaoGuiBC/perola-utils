<script setup lang="ts">
const model = defineModel<string | number | boolean | null>()

defineProps<{
    label: string
    id: string
    name: string
    value: string | number | boolean | null
}>()
</script>

<template>
    <label class="flex items-center gap-1 cursor-pointer" :for="id">
        <input
            :id="id"
            type="radio"
            :name="name"
            :value="value"
            v-model="model"
            class="radio radio-primary radio-xs"
        />
        <span class="text-xs/snug">{{ label }}</span>
    </label>
</template>
