import { ref } from 'vue'
import { defineStore } from 'pinia'

import { type Auction } from '@/schemas/auction'

type CurrentView = 'insert_files' | 'edit_info'

export const useDaySchedulerStore = defineStore('day_scheduler', () => {
    const scheduleDate = ref('')
    const currentView = ref<CurrentView>('insert_files')
    const auctions = ref<Array<Auction>>([])

    function clean() {
        scheduleDate.value = ''
        currentView.value = 'insert_files'
        auctions.value = []
    }

    return { scheduleDate, currentView, auctions, clean }
})
