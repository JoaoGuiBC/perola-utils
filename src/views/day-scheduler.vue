<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useDaySchedulerStore } from '@/stores/day-scheduler-store'

import DaySchedulerInsertFilesView from '@/components/day-scheduler-insert-files-view.vue'
import DaySchedulerEditInfoView from '@/components/day-scheduler-edit-info-view.vue'

const store = useDaySchedulerStore()
const { currentView } = storeToRefs(store)
</script>

<template>
    <main class="flex flex-col items-center pt-6 pb-10 px-4 flex-1 max-h-screen">
        <h1 class="text-primary font-semibold text-lg drop-shadow-md drop-shadow-primary/30">
            PROGRAMAÇÃO DO DIA
        </h1>

        <DaySchedulerInsertFilesView v-if="currentView === 'insert_files'" />
        <DaySchedulerEditInfoView v-if="currentView === 'edit_info'" />
    </main>
</template>
