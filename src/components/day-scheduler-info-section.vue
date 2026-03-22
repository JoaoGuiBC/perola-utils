<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>

<template>
    <section class="flex flex-col px-2 py-2.5 gap-2 rounded-box shadow-lg shadow-base-content/10">
        <h2 class="text-lg font-semibold text-base-content/90">{{ title }}</h2>

        <slot />
    </section>
</template>
