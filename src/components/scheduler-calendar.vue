<script setup lang="ts">
import { ref } from 'vue'
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'

import { formatDate } from '@/utils/date-formatter'

const scheduleDate = defineModel({ type: String, default: '' })

const isCalendarOpen = ref(false)

function toggleCalendar() {
    isCalendarOpen.value = !isCalendarOpen.value
}

function handleDateSelect(event: Event) {
    const target = event.target as HTMLElement & { value: string }
    scheduleDate.value = target.value
    isCalendarOpen.value = false
}
</script>

<template>
    <div class="relative inline-block transition-all">
        <button class="input input-border cursor-pointer w-[284px]" @click="toggleCalendar">
            <span class="w-full text-center cursor-pointer font-medium">
                {{ scheduleDate ? formatDate(new Date(scheduleDate)) : 'SELECIONE O DIA' }}
            </span>
        </button>
        <Transition name="calendar">
            <div
                v-if="isCalendarOpen"
                class="absolute z-999 mt-0.5 bg-base-200 rounded-box shadow-lg"
            >
                <calendar-date class="cally" @change="handleDateSelect" :value="scheduleDate">
                    <PhCaretLeft
                        weight="fill"
                        class="size-4"
                        aria-label="Previous"
                        slot="previous"
                    />
                    <PhCaretRight weight="fill" class="size-4" aria-label="Next" slot="next" />
                    <calendar-month></calendar-month>
                </calendar-date>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.calendar-enter-active,
.calendar-leave-active {
    transition:
        opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        scale 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top center;
}

.calendar-enter-from,
.calendar-leave-to {
    opacity: 0;
    scale: 95%;
}

.calendar-enter-to,
.calendar-leave-from {
    opacity: 1;
    scale: 100%;
}
</style>
