<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import { createPDF } from '@/utils/create-pdf'
import { type AuctionFullInfo } from '@/schemas/auction'
import { useDaySchedulerStore } from '@/stores/day-scheduler-store'

import InfoSection from './day-scheduler-info-section.vue'
import InfoLine from './day-scheduler-info-line.vue'
import InfoInput from './day-scheduler-info-input.vue'
import InfoRadio from './day-scheduler-info-radio.vue'
import InfoCheckbox from './day-scheduler-info-checkbox.vue'
import InfoToggle from './day-scheduler-info-toggle.vue'

const PRODUCT_ORDER = ['MEDICAMENTO', 'MATERIAL', 'SORO', 'FRALDA']

const fullInfoAuctions = ref<Array<AuctionFullInfo>>([])
const isLoading = ref(false)

const store = useDaySchedulerStore()
const { currentView, auctions, scheduleDate } = storeToRefs(store)

const sortProducts = (val: string[] | undefined) => {
    if (!val) return []
    return [...val].sort((a, b) => PRODUCT_ORDER.indexOf(a) - PRODUCT_ORDER.indexOf(b))
}

async function handleSubmit() {
    isLoading.value = true
    await createPDF(fullInfoAuctions.value, new Date(scheduleDate.value))
    isLoading.value = false

    auctions.value = []
    scheduleDate.value = ''
    currentView.value = 'insert_files'
}

onMounted(() => {
    fullInfoAuctions.value = auctions.value.map((auction) => ({
        ...auction,
        garantia: !!auction.garantia,
        docs: false,
        produtos_ofertados: [],
    }))
})
</script>

<template>
    <div class="relative flex flex-col w-full mt-2 pb-8 px-1.5 gap-5 overflow-y-auto">
        <InfoSection
            v-for="(auction, index) in fullInfoAuctions"
            :key="`${auction.municipio_uf} - ${auction.pe}`"
            :title="`${index + 1}º EDITAL`"
        >
            <InfoLine>
                <InfoInput
                    label="MUNICÍPIO"
                    :id="`city-${index}`"
                    colSpan="col-span-8"
                    v-model="auction.municipio_uf"
                />
                <InfoInput
                    label="PE"
                    :id="`pe-${index}`"
                    colSpan="col-span-4"
                    v-model="auction.pe"
                />
            </InfoLine>

            <InfoLine>
                <InfoInput
                    label="HORA"
                    :id="`time-${index}`"
                    colSpan="col-span-5"
                    v-model="auction.hora"
                />
                <InfoInput
                    label="VALIDADE"
                    :id="`validity-${index}`"
                    colSpan="col-span-4"
                    v-model="auction.validade_proposta"
                />

                <InfoToggle
                    label="GARANTIA"
                    activeText="sim"
                    inactiveText="não"
                    v-model="auction.garantia"
                    class="col-span-3"
                />
            </InfoLine>

            <InfoLine>
                <InfoInput
                    label="PLATAFORMA"
                    :id="`platform-${index}`"
                    colSpan="col-span-5"
                    v-model="auction.plataforma"
                />

                <div class="flex flex-col col-span-7">
                    <span class="text-sm/tight">SISTEMA</span>

                    <div class="flex gap-2.5 items-center pl-1 h-full">
                        <InfoRadio
                            :id="`open-${index}`"
                            :name="`bid-type-${index}`"
                            label="ABERTO"
                            value="ABERTO"
                            v-model="auction.sistema"
                        />
                        <InfoRadio
                            :id="`open-closed-${index}`"
                            :name="`bid-type-${index}`"
                            label="ABERTO/FECHADO"
                            value="ABERTO E FECHADO"
                            v-model="auction.sistema"
                        />
                    </div>
                </div>
            </InfoLine>

            <InfoLine>
                <div class="flex flex-col col-span-5">
                    <span class="text-sm/tight">AMOSTRA</span>

                    <div
                        class="flex flex-col min-[600px]:flex-row gap-1.5 min-[600px]:gap-2.5 items-start min-[600px]:items-center justify-center min-[600px]:justify-start pl-1 h-full"
                    >
                        <InfoRadio
                            :id="`yes-${index}`"
                            :name="`sample-${index}`"
                            label="SIM"
                            value="SIM"
                            v-model="auction.pede_amostra"
                        />
                        <InfoRadio
                            :id="`no-${index}`"
                            :name="`sample-${index}`"
                            label="NÃO"
                            value="NÃO"
                            v-model="auction.pede_amostra"
                        />
                        <InfoRadio
                            :id="`maybe-${index}`"
                            :name="`sample-${index}`"
                            label="PODERÁ"
                            value="PODERÁ"
                            v-model="auction.pede_amostra"
                        />
                    </div>
                </div>

                <InfoInput
                    label="UASG"
                    :id="`uasg-${index}`"
                    colSpan="col-span-7"
                    v-model="auction.uasg"
                />
            </InfoLine>

            <InfoLine>
                <div class="flex flex-col col-span-9">
                    <span class="text-sm/tight mb-0.5">PRODUTOS OFERTADOS</span>

                    <div
                        class="flex flex-col min-[600px]:flex-row gap-1.5 min-[600px]:gap-2.5 items-start min-[600px]:items-center"
                    >
                        <InfoCheckbox
                            :id="`medicine-${index}`"
                            label="MEDICAMENTO"
                            value="MEDICAMENTO"
                            :modelValue="auction.produtos_ofertados"
                            @update:modelValue="
                                (val) => (auction.produtos_ofertados = sortProducts(val))
                            "
                        />
                        <InfoCheckbox
                            :id="`material-${index}`"
                            label="MATERIAL"
                            value="MATERIAL"
                            :modelValue="auction.produtos_ofertados"
                            @update:modelValue="
                                (val) => (auction.produtos_ofertados = sortProducts(val))
                            "
                        />
                        <InfoCheckbox
                            :id="`serum-${index}`"
                            label="SORO"
                            value="SORO"
                            :modelValue="auction.produtos_ofertados"
                            @update:modelValue="
                                (val) => (auction.produtos_ofertados = sortProducts(val))
                            "
                        />
                        <InfoCheckbox
                            :id="`diaper-${index}`"
                            label="FRALDA"
                            value="FRALDA"
                            :modelValue="auction.produtos_ofertados"
                            @update:modelValue="
                                (val) => (auction.produtos_ofertados = sortProducts(val))
                            "
                        />
                    </div>
                </div>

                <InfoToggle
                    label="DOCS"
                    activeText="sim"
                    inactiveText="não"
                    v-model="auction.docs"
                    class="col-span-3"
                />
            </InfoLine>
        </InfoSection>

        <button
            type="button"
            :disabled="isLoading"
            class="fixed btn btn-primary btn-sm bottom-4 w-24 drop-shadow-sm drop-shadow-primary/80 right-10"
            @click="handleSubmit"
        >
            <span v-if="isLoading" class="loading loading-ring" />
            <span v-else>SALVAR</span>
        </button>
    </div>
</template>
