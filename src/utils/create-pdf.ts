import dayjs from 'dayjs'
import { PDF } from '@libpdf/core'

import { convertRGB } from './convert-rgb'
import { type AuctionFullInfo } from '@/schemas/auction'
import { type Company } from '@/stores/ai-config-store'

const TOTAL_AUCTION_SLOTS = 5

const CONFIG_PER_COMPANY = [
    {
        COMPANY: 'perola',
        LOGO_PATH: '/perola_logo.png',
        COLORS: {
            WHITE: convertRGB(255, 255, 255),
            BLACK: convertRGB(0, 0, 0),
            RED: convertRGB(240, 64, 64),
            SOFT_BLUE: convertRGB(217, 226, 243),
            BLUE: convertRGB(142, 170, 219),
            DARK_BLUE: convertRGB(68, 114, 196),
            DARKEST_BLUE: convertRGB(31, 56, 100),
        },
    },
    {
        COMPANY: 'arlimed',
        LOGO_PATH: '/arlimed_logo.png',
        COLORS: {
            WHITE: convertRGB(255, 255, 255),
            BLACK: convertRGB(0, 0, 0),
            RED: convertRGB(240, 64, 64),
            SOFT_BLUE: convertRGB(211, 235, 218),
            BLUE: convertRGB(128, 195, 146),
            DARK_BLUE: convertRGB(61, 135, 82),
            DARKEST_BLUE: convertRGB(31, 68, 40),
        },
    },
]

const emptyAuction: AuctionFullInfo = {
    municipio_uf: '',
    hora: '',
    plataforma: '',
    pe: '',
    validade_proposta: '',
    sistema: null,
    uasg: null,
    garantia: false,
    pede_amostra: null,
    produtos_ofertados: [],
    docs: false,
}

export async function createPDF(auctions: AuctionFullInfo[], scheduleDate: Date, company: Company) {
    const date = dayjs(scheduleDate).add(5, 'hour')

    const pdf = PDF.create()

    let currentAuctionIndex = 0
    const splitAuctions = auctions.reduce(
        (acc: Array<AuctionFullInfo[]>, cur) => {
            if (acc[currentAuctionIndex].length === 5) {
                acc.push([cur])
                currentAuctionIndex++
            } else {
                acc[currentAuctionIndex].push(cur)
            }

            return acc
        },
        [[]] as AuctionFullInfo[][],
    )

    for (const auctionArray of splitAuctions) {
        await createPage(auctionArray, date, pdf, company)
    }

    const pdfName = `PROGRAMAÇÃO DO DIA ${date.format('DD-MM')}`

    pdf.setTitle(pdfName)

    const bytes = await pdf.save()
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = pdfName
    link.click()

    URL.revokeObjectURL(url)
}

async function createPage(
    auctions: AuctionFullInfo[],
    date: dayjs.Dayjs,
    pdf: PDF,
    company: Company,
) {
    const config = CONFIG_PER_COMPANY.find((c) => c.COMPANY === company) || CONFIG_PER_COMPANY[0]
    const COLORS = config.COLORS

    const paddedAuctions: AuctionFullInfo[] = [
        ...auctions,
        ...Array.from({ length: Math.max(0, TOTAL_AUCTION_SLOTS - auctions.length) }, () => ({
            ...emptyAuction,
        })),
    ]

    const page = pdf.addPage({ size: 'a4' })

    const headerFontResponse = await fetch('/WDXLLubrifontTC-Regular.ttf')
    const headerFontBytes = new Uint8Array(await headerFontResponse.arrayBuffer())
    const headerFont = pdf.embedFont(headerFontBytes)

    const textFontResponse = await fetch('/InterTight-VariableFont_wght.ttf')
    const textFontBytes = new Uint8Array(await textFontResponse.arrayBuffer())
    const textFont = pdf.embedFont(textFontBytes)

    const LogoResponse = await fetch(config.LOGO_PATH)
    const logoBytes = new Uint8Array(await LogoResponse.arrayBuffer())
    const logoImage = pdf.embedPng(logoBytes)

    page.drawImage(logoImage, {
        x: 211.5,
        y: 760,
        width: 172,
    })

    page.drawText('SETOR DE LICITAÇÕES', {
        x: 0,
        y: 738,
        size: 18,
        maxWidth: 595,
        alignment: 'center',
        color: COLORS.BLACK,
        font: headerFont,
    })

    page.drawRectangle({
        x: 32.5,
        y: 712,
        width: 531,
        height: 20,
        color: COLORS.DARK_BLUE,
        borderColor: COLORS.BLUE,
        borderWidth: 1,
        cornerRadius: 2,
    })

    page.drawText(`PROGRAMAÇÃO DO DIA - ____ /____ /____`, {
        x: 32.5,
        y: 716,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: COLORS.WHITE,
        font: textFont,
    })

    page.drawText(`${date.format('DD')}`, {
        x: 90,
        y: 717,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: COLORS.WHITE,
        font: textFont,
    })

    page.drawText(`${date.format('MM')}`, {
        x: 125.5,
        y: 717,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: COLORS.WHITE,
        font: textFont,
    })

    page.drawText(`${date.format('YY')}`, {
        x: 160,
        y: 717,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: COLORS.WHITE,
        font: textFont,
    })

    page.drawRectangle({
        x: 329,
        y: 717,
        width: 18,
        height: 5,
        color: COLORS.DARK_BLUE,
    })

    paddedAuctions.forEach((pe, index) => {
        const reductionValue = 110 * index
        page.drawSvgPath(`M 0,15 L 0,2 A 2,2 0 0,1 2,0 L 529,0 A 2,2 0 0,1 531,2 L 531,15 Z`, {
            x: 32.5,
            y: 708 - reductionValue,
            color: COLORS.SOFT_BLUE,
            borderColor: COLORS.BLUE,
            borderWidth: 1,
        })

        page.drawText('MUNICÍPIO:', {
            x: 38,
            y: 697 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText(pe.municipio_uf ?? '', {
            x: 95,
            y: 697 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('PE:', {
            x: 280,
            y: 697 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText(pe.pe ?? '', {
            x: 298,
            y: 697 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawRectangle({
            x: 32.5,
            y: 678 - reductionValue,
            width: 531,
            height: 15,
            color: COLORS.WHITE,
            borderColor: COLORS.BLUE,
            borderWidth: 1,
        })

        page.drawText('HORA:', {
            x: 37,
            y: 682 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText(pe.hora ?? '', {
            x: 72,
            y: 682 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('VALIDADE DA PROPOSTA:', {
            x: 280,
            y: 682 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText(pe.validade_proposta ?? '', {
            x: 400,
            y: 682 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('GARANTIA:', {
            x: 445,
            y: 682 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        if (pe.garantia) {
            page.drawText('SIM', {
                x: 499,
                y: 682 - reductionValue,
                size: 8,
                alignment: 'left',
                color: COLORS.RED,
                font: textFont,
            })
            page.drawLine({
                start: { x: 499, y: 680.5 - reductionValue },
                end: { x: 512.2, y: 680.5 - reductionValue },
                color: COLORS.RED,
                thickness: 1,
            })
        }

        page.drawRectangle({
            x: 32.5,
            y: 663 - reductionValue,
            width: 531,
            height: 15,
            color: COLORS.SOFT_BLUE,
            borderColor: COLORS.BLUE,
            borderWidth: 1,
        })

        page.drawText('PLATAFORMA:', {
            x: 37,
            y: 667 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText(pe.plataforma ?? '', {
            x: 105,
            y: 667 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('SISTEMA:', {
            x: 280,
            y: 667 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('ABERTO [   ]', {
            x: 325,
            y: 667 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('ABERTO/FECHADO [   ]', {
            x: 385,
            y: 667 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        if (pe.sistema === 'ABERTO') {
            page.drawText('●', {
                x: 358.2,
                y: 667 - reductionValue,
                size: 8,
                alignment: 'left',
                color: COLORS.RED,
                font: textFont,
            })
        }

        if (pe.sistema === 'ABERTO E FECHADO') {
            page.drawText('●', {
                x: 456.5,
                y: 667 - reductionValue,
                size: 8,
                alignment: 'left',
                color: COLORS.RED,
                font: textFont,
            })
        }

        page.drawRectangle({
            x: 32.5,
            y: 648 - reductionValue,
            width: 531,
            height: 15,
            color: COLORS.WHITE,
            borderColor: COLORS.BLUE,
            borderWidth: 1,
        })

        page.drawText('PEDE AMOSTRA:', {
            x: 37,
            y: 651.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('SIM [   ]', {
            x: 114,
            y: 652.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('NÃO [   ]', {
            x: 155,
            y: 652.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('PODERÁ [   ]', {
            x: 196.5,
            y: 652.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        if (pe.pede_amostra === 'SIM') {
            page.drawText('●', {
                x: 131,
                y: 652.5 - reductionValue,
                size: 8,
                alignment: 'left',
                color: COLORS.RED,
                font: textFont,
            })
        }

        if (pe.pede_amostra === 'NÃO') {
            page.drawText('●', {
                x: 175,
                y: 652.5 - reductionValue,
                size: 8,
                alignment: 'left',
                color: COLORS.RED,
                font: textFont,
            })
        }

        if (pe.pede_amostra === 'PODERÁ') {
            page.drawText('●', {
                x: 230,
                y: 652.5 - reductionValue,
                size: 8,
                alignment: 'left',
                color: COLORS.RED,
                font: textFont,
            })
        }

        page.drawText('UASG:', {
            x: 280,
            y: 651.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText(pe.uasg || '', {
            x: 313,
            y: 652.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawText('ATESTADO:', {
            x: 445,
            y: 651.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        page.drawSvgPath(`M 0,0 L 531,0 L 531,43 A 2,2 0 0,1 529,45 L 2,45 A 2,2 0 0,1 0,43 Z`, {
            x: 32.5,
            y: 648 - reductionValue,
            color: COLORS.SOFT_BLUE,
            borderColor: COLORS.BLUE,
            borderWidth: 1,
        })

        page.drawText('OBSERVAÇÃO:', {
            x: 37,
            y: 635.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: COLORS.BLACK,
            font: textFont,
        })

        if (pe.produtos_ofertados.length > 0) {
            page.drawText(pe.produtos_ofertados.join(' - '), {
                x: 106,
                y: 635.5 - reductionValue,
                size: 8,
                maxWidth: 531,
                alignment: 'left',
                color: COLORS.DARKEST_BLUE,
                font: textFont,
            })
        }

        if (pe.docs) {
            page.drawText('DOCS', {
                x: 300,
                y: 634.5 - reductionValue,
                size: 9,
                maxWidth: 531,
                alignment: 'left',
                color: COLORS.RED,
                font: textFont,
            })

            page.drawLine({
                start: { x: 300, y: 633 - reductionValue },
                end: { x: 324, y: 633 - reductionValue },
                color: COLORS.RED,
                thickness: 1.5,
            })
        }
    })

    page.drawText('PREGÕES COM RETORNO HOJE', {
        x: 0,
        y: 146,
        size: 14,
        maxWidth: 595,
        alignment: 'center',
        color: COLORS.DARKEST_BLUE,
        font: headerFont,
    })

    page.drawLine({
        start: { x: 222, y: 143 },
        end: { x: 372.7, y: 143 },
        color: COLORS.DARKEST_BLUE,
        thickness: 2,
    })

    Array.from({ length: 5 }).forEach((_, index) => {
        const reductionValue = 25 * index
        page.drawText('MUNICÍPIO:', {
            x: 37,
            y: 125 - reductionValue,
            size: 8,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(25, 25, 25),
            font: textFont,
        })

        page.drawText('PE:', {
            x: 240,
            y: 125 - reductionValue,
            size: 8,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(25, 25, 25),
            font: textFont,
        })

        page.drawText('HORÁRIO:', {
            x: 350,
            y: 125 - reductionValue,
            size: 8,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(25, 25, 25),
            font: textFont,
        })

        page.drawText('COMEÇOU DIA:', {
            x: 435,
            y: 125 - reductionValue,
            size: 8,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(25, 25, 25),
            font: textFont,
        })

        page.drawLine({
            start: { x: 37, y: 120 - reductionValue },
            end: { x: 558, y: 120 - reductionValue },
            color: convertRGB(25, 25, 25),
            thickness: 1,
        })
    })
}
