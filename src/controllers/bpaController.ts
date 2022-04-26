import { Request, Response } from 'express'
import BPAProvider from '../providers/BPAProvider'
import fs from 'fs'
import { parse } from 'csv'

// const BPAcFile = (array: Array<Object>) => {
//     array.forEach((item, linha) => {
//         console.log(`O conteúdo da linha ${linha} é:`)
//         console.log(item)
//     })
// }

const BPAiMagnetico = async function (mesAno: String, file: any) {
    const parser = parse({
        delimiter: ';',
        from_line: 2
    })
    var data = ''
    var arrayData = []
    var pageNumber = 1
    var lineNumber = 0
    var sumOfProcedimentos = 0
    var sumOfQuantidade = 0
    var totalLineNumber = 0

    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(parser)
            .on('data', (row) => {
                if (lineNumber < 99) {
                    lineNumber++
                } else {
                    lineNumber = 1
                    pageNumber++
                }
                totalLineNumber++
                sumOfProcedimentos += row[1]
                arrayData.push(row)
                data += '03'
                data += '0000396'
                data += mesAno
                data += row[3].toString().padStart(15, '0')
                data += row[5].toString().padStart(6, '0')
                data += row[0]
                data += pageNumber.toString().padStart(3, '0')
                data += lineNumber.toString().padStart(2, '0')
                data += row[14]?.toString().padStart(10, '0')
                data += row[6].toString().padStart(15, '0')
                data += row[8].padStart(1, ' ')
                data += ''.padStart(6, ' ')
                data += ''.padStart(4, ' ')
                data += ''.padStart(3, ' ')
                data += row[13]?.toString().padStart(3, '0')
                data += ''.padStart(2, ' ')
                data += ''.padStart(13, ' ')
                data += 'BPA'
                data += row[7]?.substring(0, 30).padEnd(30, ' ')
                data += row[9]
                data += ''.padEnd(2, ' ')
                data += ''.padEnd(4, ' ')
                data += row[10].toString().padStart(3, '0')
                data += ''.padStart(3, ' ')
                data += ''.padStart(3, ' ')
                data += ''.padStart(8, ' ')
                data += ''.padStart(4, ' ')
                data += ''.padStart(14, ' ')
                data += row[12]?.toString().padStart(8, ' ')
                data += ''.padStart(3, ' ')
                data += ''.padStart(30, ' ')
                data += ''.padStart(10, ' ')
                data += ''.padStart(5, ' ')
                data += ''.padStart(30, ' ')
                data += ''.padStart(11, ' ')
                data += ''.padStart(40, ' ')
                data += ''.padStart(10, ' ')
                data += '\r\n'

            })
            .on('end', () => {
                resolve({
                    arrayData,
                    sumOfProcedimentos,
                    linhas: totalLineNumber,
                    pageNumber,
                    data
                })
            })
    })
}

const BPAcMagnetico = async function (mesAno: String, file: any) {
    const parser = parse({
        delimiter: ';',
        from_line: 2
    })
    var data = ''
    var arrayData = []
    var pageNumber = 1
    var lineNumber = 0
    var sumOfProcedimentos = 0
    var sumOfQuantidade = 0
    var totalLineNumber = 0
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(parser)
            .on('data', (row) => {
                if (lineNumber < 20) {
                    lineNumber++
                } else {
                    lineNumber = 1
                    pageNumber++
                }
                totalLineNumber++
                sumOfProcedimentos += row[1]
                arrayData.push(row)
                // Linha BPAC
                data += '02'
                // CNES
                data += '0000396'
                data += mesAno
                data += row[0].toString().padEnd(6, ' ')
                data += pageNumber.toString().padStart(3, '0')
                data += lineNumber.toString().padStart(2, '0')
                data += row[3].toString().padStart(10, '0')
                data += row[1].toString().padStart(3, '0')
                data += row[2].toString().padStart(6, '0')
                data += 'BPA'
                data += '\r\n'
            })
            .on('end', () => {
                const somatorio = [...new Set(arrayData.map(x => x.procedimento))].reduce((anterior, atual) => parseInt(anterior) + parseInt(atual), 0)
                resolve({
                    somatorio,
                    arrayData,
                    sumOfProcedimentos,
                    linhas: totalLineNumber,
                    pageNumber,
                    data
                })
            })
    })
}

export default class bpaController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getBPA(req: Request, res: Response, next) {
        const { start, end, atendimento } = req.query
        if (!start || !end) {
            res.send(await BPAProvider.getBPA(atendimento))
        }
        else {
            res.send(await BPAProvider.getBPAiByPeriod(start, end))
        }
    }

    static async getBPAc(req: Request, res: Response, next) {
        const BPAc = await BPAProvider.getBPAc(req.params.mesAno)
        res.send(BPAc)
    }

    static async getBPAi(req: Request, res: Response, next) {
        const BPAi = await BPAProvider.getBPAi(req.params.mesAno)
        res.send(BPAi)
    }

    static async getBPAMagnetico(req: Request, res: Response, next) {
        const bpacFile = `${req.app.locals.__basedir}/bpa/${req.params.mesAno.substring(0, 4)}-${req.params.mesAno.substring(4, 6)}-BPAc.csv`
        const bpaiFile = `${req.app.locals.__basedir}/bpa/${req.params.mesAno.substring(0, 4)}-${req.params.mesAno.substring(4, 6)}-BPAi.csv`
        const bpac: any = await BPAcMagnetico(req.params.mesAno, bpacFile)
        const bpai: any = await BPAiMagnetico(req.params.mesAno, bpaiFile)
        res.send(bpac.data + bpai.data)
    }
}