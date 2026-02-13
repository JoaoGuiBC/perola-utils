import { rgb } from '@libpdf/core'

export function convertRGB(R: number, G: number, B: number) {
    return rgb(R / 255, G / 255, B / 255)
}
