<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { PhPlus } from '@phosphor-icons/vue'

import { createPDF } from '@/utils/create-pdf'
import { type AuctionFullInfo } from '@/schemas/auction'
import { useDaySchedulerStore } from '@/stores/day-scheduler-store'

import InfoSection from './day-scheduler-info-section.vue'
import InfoLine from './day-scheduler-info-line.vue'
import InfoInput from './day-scheduler-info-input.vue'
import InfoRadio from './day-scheduler-info-radio.vue'
import InfoCheckbox from './day-scheduler-info-checkbox.vue'
import InfoToggle from './day-scheduler-info-toggle.vue'

interface FullInfoAuction extends AuctionFullInfo {
    isDeleted: boolean
}

const PRODUCT_ORDER = ['MEDICAMENTO', 'MATERIAL', 'SORO', 'FRALDA']

const fullInfoAuctions = ref<Array<FullInfoAuction>>([])
const isLoading = ref(false)

const store = useDaySchedulerStore()
const { currentView, auctions, scheduleDate } = storeToRefs(store)

const sortProducts = (val: string[] | undefined) => {
    if (!val) return []
    return [...val].sort((a, b) => PRODUCT_ORDER.indexOf(a) - PRODUCT_ORDER.indexOf(b))
}

async function handleSubmit() {
    isLoading.value = true

    const auctionsToProcess = fullInfoAuctions.value.filter((a) => !a.isDeleted)

    await createPDF(auctionsToProcess, new Date(scheduleDate.value))
    isLoading.value = false

    auctions.value = []
    scheduleDate.value = ''
    currentView.value = 'insert_files'
}

function addNewAuction() {
    fullInfoAuctions.value.push({
        docs: false,
        garantia: false,
        isDeleted: false,
        produtos_ofertados: [],
        hora: null,
        municipio_uf: null,
        pe: null,
        pede_amostra: null,
        plataforma: null,
        sistema: null,
        uasg: null,
        validade_proposta: null,
    })
}

function deleteAuction(auction: FullInfoAuction, auctionIndex: number) {
    if (!auction.municipio_uf) {
        fullInfoAuctions.value = fullInfoAuctions.value.filter((_, index) => index !== auctionIndex)
        return
    }

    fullInfoAuctions.value = fullInfoAuctions.value.map((item) => {
        if (item.municipio_uf === auction.municipio_uf)
            return { ...auction, isDeleted: !auction.isDeleted }

        return item
    })
}

function handleCancelOperation() {
    fullInfoAuctions.value = []
    auctions.value = []
    store.clean()
}

onMounted(() => {
    fullInfoAuctions.value = auctions.value.map((auction) => ({
        ...auction,
        garantia: !!auction.garantia,
        docs: false,
        produtos_ofertados: [],
        isDeleted: false,
    }))
})
</script>

<template>
    <div class="relative flex flex-col w-full mt-2 pb-8 px-1.5 gap-5 overflow-y-auto">
        <InfoSection
            v-for="(auction, index) in fullInfoAuctions"
            :key="index"
            :title="`${index + 1}º EDITAL`"
            :isDeleted="auction.isDeleted"
            @toggle-delete="() => deleteAuction(auction, index)"
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

        <button type="button" class="btn btn-circle btn-sm btn-primary" @click="addNewAuction">
            <PhPlus class="size-5" weight="bold" />
        </button>

        <div class="fixed flex gap-2 bottom-4 right-13 z-50">
            <button
                type="button"
                class="btn bg-base-100 btn-sm border-none"
                @click="handleCancelOperation"
            >
                CANCELAR
            </button>
            <button
                type="button"
                :disabled="isLoading"
                class="btn btn-primary btn-sm w-24 drop-shadow-sm drop-shadow-primary/80"
                @click="handleSubmit"
            >
                <span v-if="isLoading" class="loading loading-ring" />
                <span v-else>SALVAR</span>
            </button>
        </div>
    </div>
</template>
