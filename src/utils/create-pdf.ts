import dayjs from 'dayjs'
import { PDF } from '@libpdf/core'

import { convertRGB } from './convert-rgb'
import { Auction } from '@/schemas/auction'

const TOTAL_AUCTION_SLOTS = 5

const emptyAuction: Auction = {
    municipio_uf: '',
    hora: '',
    plataforma: '',
    pe: '',
    validade_proposta: '',
    sistema: null,
    uasg: null,
    garantia: null,
    pede_amostra: null,
}

export async function createPDF(auctions: Auction[], scheduleDate: Date) {
    const date = dayjs(scheduleDate).add(5, 'hour')

    const paddedAuctions: Auction[] = [
        ...auctions,
        ...Array.from({ length: Math.max(0, TOTAL_AUCTION_SLOTS - auctions.length) }, () => ({
            ...emptyAuction,
        })),
    ]

    const pdf = PDF.create()
    const page = pdf.addPage({ size: 'a4' })

    const headerFontResponse = await fetch('/WDXLLubrifontTC-Regular.ttf')
    const headerFontBytes = new Uint8Array(await headerFontResponse.arrayBuffer())
    const headerFont = pdf.embedFont(headerFontBytes)

    const textFontResponse = await fetch('/InterTight-VariableFont_wght.ttf')
    const textFontBytes = new Uint8Array(await textFontResponse.arrayBuffer())
    const textFont = pdf.embedFont(textFontBytes)

    const LogoResponse = await fetch('/perola_logo.png')
    const logoBytes = new Uint8Array(await LogoResponse.arrayBuffer())
    const perolaLogo = pdf.embedPng(logoBytes)

    page.drawImage(perolaLogo, {
        x: 211.5,
        y: 760,
        width: 172,
    })

    page.drawText('SETOR DE LICITAÇÕES', {
        x: 0,
        y: 735,
        size: 18,
        maxWidth: 595,
        alignment: 'center',
        color: convertRGB(0, 0, 0),
        font: headerFont,
    })

    page.drawRectangle({
        x: 32.5,
        y: 710,
        width: 531,
        height: 18,
        color: convertRGB(68, 114, 196),
        borderColor: convertRGB(142, 170, 219),
        borderWidth: 1,
    })

    page.drawText(`PROGRAMAÇÃO DO DIA - ____ /____ /____`, {
        x: 32.5,
        y: 713,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: convertRGB(255, 255, 255),
        font: textFont,
    })

    page.drawText(`${date.format('DD')}`, {
        x: 90,
        y: 714,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: convertRGB(255, 255, 255),
        font: textFont,
    })

    page.drawText(`${date.format('MM')}`, {
        x: 125.5,
        y: 714,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: convertRGB(255, 255, 255),
        font: textFont,
    })

    page.drawText(`${date.format('YY')}`, {
        x: 160,
        y: 714,
        size: 16,
        maxWidth: 531,
        alignment: 'center',
        color: convertRGB(255, 255, 255),
        font: textFont,
    })

    page.drawRectangle({
        x: 329,
        y: 715,
        width: 18,
        height: 5,
        color: convertRGB(68, 114, 196),
    })

    paddedAuctions.forEach((pe, index) => {
        const reductionValue = 110 * index
        page.drawRectangle({
            x: 32.5,
            y: 695 - reductionValue,
            width: 531,
            height: 15,
            color: convertRGB(217, 226, 243),
            borderColor: convertRGB(142, 170, 219),
            borderWidth: 1,
        })

        page.drawText('MUNICÍPIO:', {
            x: 38,
            y: 699 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText(pe.municipio_uf ?? '', {
            x: 95,
            y: 699 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('PE:', {
            x: 280,
            y: 699 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText(pe.pe ?? '', {
            x: 298,
            y: 699 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawRectangle({
            x: 32.5,
            y: 680 - reductionValue,
            width: 531,
            height: 15,
            color: convertRGB(255, 255, 255),
            borderColor: convertRGB(142, 170, 219),
            borderWidth: 1,
        })

        page.drawText('HORA:', {
            x: 37,
            y: 684 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText(pe.hora ?? '', {
            x: 72,
            y: 684 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('VALIDADE DA PROPOSTA:', {
            x: 280,
            y: 684 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText(pe.validade_proposta ?? '', {
            x: 400,
            y: 684 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('GARANTIA:', {
            x: 445,
            y: 684 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        if (pe.garantia) {
            page.drawText('SIM', {
                x: 499,
                y: 684 - reductionValue,
                size: 8,
                alignment: 'left',
                color: convertRGB(0, 0, 0),
                font: textFont,
            })
        }

        page.drawRectangle({
            x: 32.5,
            y: 665 - reductionValue,
            width: 531,
            height: 15,
            color: convertRGB(217, 226, 243),
            borderColor: convertRGB(142, 170, 219),
            borderWidth: 1,
        })

        page.drawText('PLATAFORMA:', {
            x: 37,
            y: 669 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText(pe.plataforma ?? '', {
            x: 105,
            y: 669 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('SISTEMA:', {
            x: 280,
            y: 669 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('ABERTO [   ]', {
            x: 325,
            y: 669 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('ABERTO/FECHADO [   ]', {
            x: 385,
            y: 669 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        if (pe.sistema === 'ABERTO') {
            page.drawText('●', {
                x: 358.2,
                y: 669 - reductionValue,
                size: 8,
                alignment: 'left',
                color: convertRGB(240, 64, 64),
                font: textFont,
            })
        }

        if (pe.sistema === 'ABERTO E FECHADO') {
            page.drawText('●', {
                x: 456.5,
                y: 669 - reductionValue,
                size: 8,
                alignment: 'left',
                color: convertRGB(240, 64, 64),
                font: textFont,
            })
        }

        page.drawRectangle({
            x: 32.5,
            y: 650 - reductionValue,
            width: 531,
            height: 15,
            color: convertRGB(255, 255, 255),
            borderColor: convertRGB(142, 170, 219),
            borderWidth: 1,
        })

        page.drawText('PEDE AMOSTRA:', {
            x: 37,
            y: 653.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('SIM [   ]', {
            x: 114,
            y: 654.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('NÃO [   ]', {
            x: 155,
            y: 654.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('PODERÁ [   ]', {
            x: 196.5,
            y: 654.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        if (pe.pede_amostra === 'SIM') {
            page.drawText('●', {
                x: 131,
                y: 654.5 - reductionValue,
                size: 8,
                alignment: 'left',
                color: convertRGB(240, 64, 64),
                font: textFont,
            })
        }

        if (pe.pede_amostra === 'NÃO') {
            page.drawText('●', {
                x: 175,
                y: 654.5 - reductionValue,
                size: 8,
                alignment: 'left',
                color: convertRGB(240, 64, 64),
                font: textFont,
            })
        }

        if (pe.pede_amostra === 'PODERÁ') {
            page.drawText('●', {
                x: 230,
                y: 654.5 - reductionValue,
                size: 8,
                alignment: 'left',
                color: convertRGB(240, 64, 64),
                font: textFont,
            })
        }

        page.drawText('UASG:', {
            x: 280,
            y: 653.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText(pe.uasg || '', {
            x: 313,
            y: 654.5 - reductionValue,
            size: 8,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawText('ATESTADO:', {
            x: 445,
            y: 653.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })

        page.drawRectangle({
            x: 32.5,
            y: 605 - reductionValue,
            width: 531,
            height: 45,
            color: convertRGB(217, 226, 243),
            borderColor: convertRGB(142, 170, 219),
            borderWidth: 1,
        })

        page.drawText('OBSERVAÇÃO:', {
            x: 37,
            y: 637.5 - reductionValue,
            size: 10,
            maxWidth: 531,
            alignment: 'left',
            color: convertRGB(0, 0, 0),
            font: textFont,
        })
    })

    page.drawText('PREGÕES COM RETORNO HOJE', {
        x: 0,
        y: 148,
        size: 14,
        maxWidth: 595,
        alignment: 'center',
        color: convertRGB(31, 56, 100),
        font: headerFont,
    })

    page.drawLine({
        start: { x: 222, y: 145 },
        end: { x: 372.7, y: 145 },
        color: convertRGB(31, 56, 100),
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

    pdf.setTitle('PROGRAMAÇÃO DO DIA')

    const bytes = await pdf.save()
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'PROGRAMAÇÃO DO DIA.pdf'
    link.click()

    URL.revokeObjectURL(url)
}
