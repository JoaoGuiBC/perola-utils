<script setup lang="ts">
defineProps<{
    title: string
    itemsList: Array<string>
}>()
</script>

<template>
    <div
        class="flex flex-col items-center w-full rounded-box px-4 py-2 shadow-xl shadow-base-content/10"
    >
        <span class="text-sm min-w-fit font-medium">{{ title }}</span>

        <div class="flex flex-col mb-3 w-full">
            <span
                v-for="item in itemsList"
                :key="item"
                class="mb-0.5 pb-0.5 border-b border-base-content/50"
            >
                {{ item }}
            </span>
        </div>
    </div>
</template>
