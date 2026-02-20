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
        opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
        scale 0.5s
            linear(
                0,
                0.01 1%,
                0.042 2.1%,
                0.093 3.2%,
                0.167 4.4%,
                0.337 6.6%,
                0.843 12.4%,
                0.971 14.1%,
                1.074 15.7%,
                1.158 17.3%,
                1.217 18.8%,
                1.259 20.3%,
                1.285 21.9%,
                1.291 24.2%,
                1.265 26.7%,
                1.212 29.3%,
                1.06 35.3%,
                0.994 38.3%,
                0.944 41.6%,
                0.918 45%,
                0.915 47.4%,
                0.922 50.1%,
                1.001 61.6%,
                1.023 68%,
                1.023 73.6%,
                0.995 89%,
                1
            ),
        transform 0.5s
            linear(
                0,
                0.01 1%,
                0.042 2.1%,
                0.093 3.2%,
                0.167 4.4%,
                0.337 6.6%,
                0.843 12.4%,
                0.971 14.1%,
                1.074 15.7%,
                1.158 17.3%,
                1.217 18.8%,
                1.259 20.3%,
                1.285 21.9%,
                1.291 24.2%,
                1.265 26.7%,
                1.212 29.3%,
                1.06 35.3%,
                0.994 38.3%,
                0.944 41.6%,
                0.918 45%,
                0.915 47.4%,
                0.922 50.1%,
                1.001 61.6%,
                1.023 68%,
                1.023 73.6%,
                0.995 89%,
                1
            );
    transform-origin: top center;
}

.calendar-enter-from,
.calendar-leave-to {
    opacity: 0;
    scale: 90%;
    transform: translateY(-10px);
}

.calendar-enter-to,
.calendar-leave-from {
    opacity: 1;
    scale: 100%;
    transform: translateY(0);
}
</style>
