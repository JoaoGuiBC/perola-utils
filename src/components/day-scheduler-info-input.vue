<script setup lang="ts">
const model = defineModel<string | null>()

defineProps<{
    label: string
    id?: string
    colSpan?: string
    type?: string
}>()
</script>

<template>
    <label :for="id" class="flex flex-col" :class="colSpan || 'col-span-full'">
        <span class="text-sm/tight pl-1">{{ label }}</span>
        <input v-model="model" :id="id" :type="type || 'text'" class="w-full input input-sm" />
    </label>
</template>
