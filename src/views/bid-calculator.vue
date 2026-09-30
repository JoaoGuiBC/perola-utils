<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { PhPlusCircle, PhTrash } from '@phosphor-icons/vue'

import { currencyFormatter } from '@/utils/currency-formatter'
import { useBidSuggesterStore } from '@/stores/bid-suggester-store'

const store = useBidSuggesterStore()
const { values } = storeToRefs(store)

const competitorBid = defineModel<number>('competitor-bid')
const percentage = defineModel<number | undefined>('percentage')
const dialogRef = ref<HTMLDialogElement | null>(null)
const newPercentage = ref<number | undefined>()

const suggestedBid = computed(() => {
    if (!competitorBid.value || !percentage.value) return ''

    const suggestedBid = competitorBid.value - (competitorBid.value / 100) * percentage.value

    return currencyFormatter(suggestedBid)
})

function formatPercentage(value: number) {
    return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`
}

const selectPercentage = (val: number) => {
    percentage.value = val
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
    }
}

function openPercentageDialog() {
    newPercentage.value = undefined
    dialogRef.value?.showModal()
}

async function addPercentage() {
    const value = newPercentage.value

    if (
        value === undefined ||
        !Number.isFinite(value) ||
        value <= 0 ||
        values.value.some((item) => item.value === value)
    ) {
        return
    }

    values.value = [...values.value, { label: formatPercentage(value), value }]

    await store.save()

    selectPercentage(value)
    dialogRef.value?.close()
}

async function removePercentage(value: number) {
    values.value = values.value.filter((item) => item.value !== value)

    if (percentage.value === value) {
        percentage.value = values.value[0]?.value
    }

    await store.save()
}

onMounted(async () => {
    await store.init()

    if (!values.value.some((item) => item.value === percentage.value)) {
        percentage.value = values.value[0]?.value
    }
})
</script>

<template>
    <main class="flex flex-col items-center gap-4 py-6 px-4 flex-1">
        <h1 class="text-primary font-semibold text-lg mb-6 drop-shadow-md drop-shadow-primary/30">
            CALCULADORA DE LANCES
        </h1>

        <div class="flex flex-col h-fit items-center justify-center">
            <span class="font-semibold text-sm opacity-90">Porcentagem</span>
            <div class="dropdown dropdown-bottom dropdown-center">
                <div
                    tabindex="0"
                    role="button"
                    class="select select-sm border-0 text-base w-24 flex items-center justify-center cursor-pointer"
                >
                    {{ percentage === undefined ? 'Selecionar' : formatPercentage(percentage) }}
                </div>
                <ul
                    tabindex="0"
                    class="dropdown-content z-30 menu p-2 mt-1 shadow-xl bg-base-200 rounded-box w-40"
                >
                    <li v-for="item in values" :key="item.value">
                        <div class="flex items-center gap-1 p-0">
                            <button
                                type="button"
                                :class="[
                                    'btn btn-sm btn-ghost flex-1 justify-center',
                                    { active: item.value === percentage },
                                ]"
                                @click="selectPercentage(item.value)"
                            >
                                {{ item.label }}
                            </button>
                            <button
                                type="button"
                                class="btn btn-xs btn-circle btn-ghost text-secondary"
                                :aria-label="`Excluir ${item.label}`"
                                @click.stop="removePercentage(item.value)"
                            >
                                <PhTrash class="size-4" />
                            </button>
                        </div>
                    </li>

                    <li>
                        <button
                            type="button"
                            class="justify-center gap-1 text-primary"
                            @click="openPercentageDialog"
                        >
                            <PhPlusCircle class="size-4" />
                            Adicionar porcentagem
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <div class="flex items-center gap-4 justify-center w-80">
            <span>LANCE CONCORRENTE:</span>
            <input
                id=""
                name=""
                type="number"
                v-model="competitorBid"
                class="input input-sm bg-base-300/50 p-2 rounded-field w-28 outline-0 text-center text-base"
            />
        </div>

        <div class="flex items-center gap-4 justify-center w-80">
            <span>SEU LANCE:</span>
            <strong class="w-28 text-center">{{ suggestedBid }}</strong>
        </div>
    </main>

    <dialog ref="dialogRef" class="modal">
        <div class="modal-box max-w-sm p-4 relative">
            <h2 class="text-lg/tight font-semibold mb-4">Adicionar porcentagem</h2>

            <label for="new-percentage" class="fieldset-label">Porcentagem</label>
            <input
                id="new-percentage"
                v-model.number="newPercentage"
                type="number"
                min="0.01"
                step="0.01"
                class="input input-sm w-full"
                autofocus
                @keyup.enter="addPercentage"
            />

            <button
                type="button"
                class="btn btn-md btn-secondary btn-soft mt-6"
                @click="addPercentage"
            >
                ADICIONAR
            </button>

            <button
                type="button"
                aria-label="close-modal"
                class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1"
                @click="dialogRef?.close()"
            >
                ✕
            </button>
        </div>

        <form method="dialog" class="modal-backdrop">
            <button>FECHAR</button>
        </form>
    </dialog>
</template>
