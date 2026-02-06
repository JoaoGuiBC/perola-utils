<script setup lang="ts">
import Navbar from './components/nav-bar.vue'
import ThemeSelector from './components/theme-selector.vue'
</script>

<template>
    <div class="flex p-4">
        <ThemeSelector />

        <Navbar />

        <RouterView />
    </div>
</template>
