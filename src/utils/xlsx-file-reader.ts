import * as XLSX from 'xlsx'

export async function readXLSXFile(file: File): Promise<(string | number)[][]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                if (!e.target?.result) {
                    throw new Error('Erro ao ler arquivo')
                }

                const dataBuffer = new Uint8Array(e.target.result as ArrayBuffer)
                const workbook = XLSX.read(dataBuffer, { type: 'array' })

                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]

                const rawData = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, { 
                    header: 1,
                    defval: '',
                    blankrows: false,
                })

                const filteredData = rawData.filter(row => row[0] !== '0000')

                resolve(filteredData)
            } catch (error) {
                throw error
            }
        }
        
        reader.onerror = () => reject('Erro ao ler arquivo')
        reader.readAsArrayBuffer(file)
    })
}
