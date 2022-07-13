import { Request, Response } from 'express'
import BPAProvider from '../providers/BPAProvider'
import fs from 'fs'
import { parse } from 'csv'
import csvtojson from 'csvtojson'


/**
 * @param key Chave do array cujos valores devem ser somados
 * @param array Array de objetos
 * @returns soma dos valores
 */
const sumBy = (key: number | string, array: Array<any>) => {
    return array.reduce((acc, curr) => {
        return acc + parseInt(curr[key])
    }, 0)
}

function calcAge(dateString: string): number {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    var birthday = +new Date(`${year}-${month}-${day}`)
    return ~~((Date.now() - birthday) / (31557600000))
}

/**
 * @param competencia Competência a ser gerada
 * @param linhas Linhas do arquivo
 * @param paginas numero de paginas
 * @param validation código de validação
 * @returns cabeçalho do arquivo
 */
const generateHeader = (competencia: string, linhas: number, paginas: number, validation: number) => {
    let header = ''
    header += `01#BPA#${competencia}${linhas.toString().padStart(6, '0')}${paginas.toString().padStart(6, '0')}${validation}`
    header += 'UFPE - HOSPITAL DAS CLÍNICAS        24134488000299UFPE - HOSPITAL DAS CLÍNICAS            ED01.03\r\n'
    return header
}

/**
 * 
 * @param bpacSumProcedimentos Soma dos códigos procedimentos
 * @param bpacTotalProcedimentos Total de Procedimentos realizados
 * @param bpaiSumProcedimentos Soma dos códigos dos procedimentos
 * @param bpaiTotalProcedimentos Total de Procedimentos Realizados
 * @returns código de validação do arquivo
 */
const generateValidation = (
    bpacSumProcedimentos: number,
    bpacTotalProcedimentos: number,
    bpaiSumProcedimentos: number,
    bpaiTotalProcedimentos: number) => {

    const validation = Math.floor((
        bpacSumProcedimentos +
        bpacTotalProcedimentos +
        bpaiSumProcedimentos +
        bpaiTotalProcedimentos
    ) % 1111) + 1111
    // log all params to console
    console.log('bpacSumProcedimentos', bpacSumProcedimentos)
    console.log('bpacTotalProcedimentos', bpacTotalProcedimentos)
    console.log('bpaiSumProcedimentos', bpaiSumProcedimentos)
    console.log('bpaiTotalProcedimentos', bpaiTotalProcedimentos)
    return validation
}

/**
 * 
 * @param mesAno Mes e Ano da competência
 * @param file Caminho do arquivo
 * @returns Objeto com os dados do arquivo formatados
 */
const BPAiMagnetico = async function (mesAno: String, file: any) {
    const csvOptions = {
        delimiter: ';',
    }
    var pageNumber = 1
    var lineNumber = 0
    const outputJSON = await csvtojson(csvOptions).fromFile(file)
    let printable = ''
    var arrayData = []
    var pageNumber = 1
    var lineNumber = 0
    var totalLinhas = 0

    outputJSON.forEach(el => {
        if (lineNumber < 99) {
            lineNumber++
        } else {
            lineNumber = 1
            pageNumber++
        }
        totalLinhas++
        printable += '03'
        // CNES
        printable += '0000396'
        // Competência
        printable += mesAno
        // CNS Profissional
        printable += el['cns'].toString().padStart(15, ' ')
        // CBO Profissional
        printable += el['cbo'].toString().padStart(6, '0')
        // Data de Atendimento
        printable += el['data_procedimento']
        // Folha BPA
        printable += pageNumber.toString().padStart(3, '0')
        // Linha na Folha do BPA
        printable += lineNumber.toString().padStart(2, '0')
        // Código do Procedimento
        printable += el['procedimento_sus']?.toString().padStart(10, '0')
        // CNS do Paciente
        printable += el['paciente_cartao_sus'].toString().padStart(15, ' ')
        // Sexo do Paciente
        printable += el['paciente_sexo_biologico'].padStart(1, ' ')
        // COD IBGE do Município
        printable += el['cidade'].toString().padStart(6, ' ').substring(0, 6)
        // CID-10
        printable += el['cid'].padEnd(4, ' ')
        // Idade
        printable += calcAge(el['paciente_data_nascimento']).toString().padStart(3, '0')
        // Quantidade de Procedimentos
        printable += el['procedimento_quantidade'].toString().padStart(6, '0')
        // Caráter de Atendimento
        printable += '01'
        // Autorização do Estabelecimento
        printable += ''.padStart(13, ' ')
        // Origem das informações
        printable += 'BPA'
        // Nome do Paciente
        printable += el['paciente_nome']?.substring(0, 30).padEnd(30, ' ')
        // Data de Nascimento do Paciente
        printable += el['paciente_data_nascimento']?.toString().padStart(8, ' ')
        // Raça/Cor
        printable += el['paciente_cor'] ? el['paciente_cor'].padStart(2, '0') : 99
        // Etnia
        printable += ''.padEnd(4, ' ')
        // Nacionalidade
        printable += el['paciente_nacionalidade'].toString().padStart(3, '0')
        // Código do Serviço
        printable += ''.padStart(3, ' ')
        // Código de classificação
        printable += ''.padStart(3, ' ')
        // Sequência de Equipe
        printable += ''.padStart(8, ' ')
        // Área da Equipe
        printable += ''.padStart(4, ' ')
        // CNPJ 
        printable += ''.padStart(14, ' ')
        // CEP Paciente
        printable += el['cep']?.toString().padStart(8, ' ')
        // Cod Logradouro Paciente
        printable += el['cod_logradouro'].toString().padStart(3, '0')
        // Endereço do Paciente
        printable += el['logradouro'].padEnd(30, ' ')
        // Complemento do Endereço do Paciente
        printable += el['complemento'].padEnd(10, ' ')
        // Número do Endereço
        printable += el['nro'].padStart(5, ' ')
        // Bairro do Endereço
        printable += el['bairro'].padEnd(30, ' ')
        // Telefone do Paciente
        printable += ''.padStart(11, ' ')
        // Email do Paciente
        printable += ''.padStart(40, ' ')
        // Identificação Nacional de Equipes
        printable += ''.padStart(10, ' ')
        // Fim da linha
        printable += '\r\n'
    })

    const parser = parse({
        delimiter: ';',
        from_line: 2
    })

    var data = ''
    var arrayData = []
    var pageNumber = 1
    var lineNumber = 0
    var totalLinhas = 0
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .on('error', (err) => {
                resolve({
                    arrayData: [],
                    somaProcedimentos: 0,
                    totalProcedimentos: 0,
                    totalPaginas: 0,
                    totalLinhas: 0,
                    data: ''
                })
            })
            .pipe(parser)
            .on('data', (row) => {
                try {
                    if (lineNumber < 99) {
                        lineNumber++
                    } else {
                        lineNumber = 1
                        pageNumber++
                    }
                    totalLinhas++
                    arrayData.push(row)
                    // Linha de Produção
                    data += '03'
                    // CNES
                    data += '0000396'
                    // Competência
                    data += mesAno
                    // CNS Profissional
                    data += row[3].toString().padStart(15, ' ')
                    // CBO Profissional
                    data += row[5].toString().padStart(6, '0')
                    // Data de Atendimento
                    data += row[0]
                    // Folha BPA
                    data += pageNumber.toString().padStart(3, '0')
                    // Linha na Folha do BPA
                    data += lineNumber.toString().padStart(2, '0')
                    // Código do Procedimento
                    data += row[17]?.toString().padStart(10, '0')
                    // CNS do Paciente
                    data += row[6].toString().padStart(15, ' ')
                    // Sexo do Paciente
                    data += row[8].padStart(1, ' ')
                    // COD IBGE do Município
                    data += row[11].toString().padStart(6, '+').substring(0, 6)
                    // CID-10
                    data += row[15].padEnd(4, ' ')
                    // Idade
                    data += ''.padStart(3, ' ')
                    // Quantidade de Procedimentos
                    data += row[16].toString().padStart(6, '0')
                    // Caráter de Atendimento
                    data += ''.padStart(2, ' ')
                    // Autorização do Estabelecimento
                    data += ''.padStart(13, '01')
                    // Origem das informações
                    data += 'BPA'
                    // Nome do Paciente
                    data += row[7]?.substring(0, 30).padEnd(30, ' ')
                    // Data de Nascimento do Paciente
                    data += row[9]?.toString().padStart(8, ' ')
                    // Raça/Cor
                    data += ''.padEnd(2, ' ')
                    // Etnia
                    data += ''.padEnd(4, ' ')
                    // Nacionalidade
                    data += row[10].toString().padStart(3, '0')
                    // Código do Serviço
                    data += ''.padStart(3, ' ')
                    // Código de classificação
                    data += ''.padStart(3, ' ')
                    // Sequência de Equipe
                    data += ''.padStart(8, ' ')
                    // Área da Equipe
                    data += ''.padStart(4, ' ')
                    // CNPJ 
                    data += ''.padStart(14, ' ')
                    // CEP Paciente
                    data += row[13]?.toString().padStart(8, ' ')
                    // Cod Logradouro Paciente
                    data += row[14].toString().padStart(3, '0')
                    // Endereço do Paciente
                    data += ''.padStart(30, ' ')
                    // Complemento do Endereço do Paciente
                    data += ''.padStart(10, ' ')
                    // Número do Endereço
                    data += ''.padStart(5, ' ')
                    // Bairro do Endereço
                    data += ''.padStart(30, ' ')
                    // Telefone do Paciente
                    data += ''.padStart(11, ' ')
                    // Email do Paciente
                    data += ''.padStart(40, ' ')
                    // Identificação Nacional de Equipes
                    data += ''.padStart(10, ' ')
                    // Fim da linha
                    data += '\r\n'
                } catch (error) {
                    console.log(error)
                }

            })
            .on('end', () => {
                resolve({
                    arrayData,
                    somaProcedimentos: sumBy(17, arrayData),
                    totalProcedimentos: sumBy(16, arrayData),
                    totalPaginas: pageNumber,
                    totalLinhas: totalLinhas,
                    data,
                    printable
                })
            })
    })
}

/**
 * 
 * @param mesAno Mes e Ano da competência
 * @param file Caminho do arquivo
 * @returns Objeto com os dados do arquivo formatados
 */
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
    var totalLinhas = 0
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .on('error', (err) => {
                resolve({
                    arrayData: [],
                    somaProcedimentos: 0,
                    totalProcedimentos: 0,
                    totalPaginas: 0,
                    totalLinhas: 0,
                    data: ''
                })
            })
            .pipe(parser)
            .on('data', (row) => {
                if (lineNumber < 20) {
                    lineNumber++
                } else {
                    lineNumber = 1
                    pageNumber++
                }
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
                    arrayData,
                    somaProcedimentos: sumBy(3, arrayData),
                    totalProcedimentos: sumBy(2, arrayData),
                    totalPaginas: pageNumber,
                    totalLinhas: totalLinhas,
                    data
                })
            })
    })
}

export default class bpaController {
    // /**
    //  * 
    //  * @param req Objeto Request do ExpressJS
    //  * @param res Objeto Response do ExpressJS
    //  * @param next Objeto que representa o próximo middleware a ser executado
    //  */
    // static async getBPA(req: Request, res: Response, next) {
    //     const { start, end, atendimento } = req.query
    //     if (!start || !end) {
    //         res.send(await BPAProvider.getBPA(atendimento))
    //     }
    //     else {
    //         res.send(await BPAProvider.getBPAiByPeriod(start, end))
    //     }
    // }

    static async getBPAc(req: Request, res: Response, next) {
        const BPAc = await BPAProvider.getBPAc(req.params.mesAno)
        res.send(BPAc)
    }

    static async getBPAi(req: Request, res: Response, next) {
        const BPAi = await BPAProvider.getBPAi(req.params.mesAno)
        res.send(BPAi)
    }

    static async getBPAMagnetico(req: Request, res: Response, next) {
        const competencia = req.params.mesAno.substring(0, 4) + '-' + req.params.mesAno.substring(4, 6)
        const bpacFile = `${req.app.locals.__basedir}/bpa/${competencia}-BPAc.csv`
        const bpaiFile = `${req.app.locals.__basedir}/bpa/${competencia}-BPAi.csv`
        const bpac: any = await BPAcMagnetico(req.params.mesAno, bpacFile)
        const bpai: any = await BPAiMagnetico(req.params.mesAno, bpaiFile)
        const validation = generateValidation(
            bpac.somaProcedimentos,
            bpac.totalProcedimentos,
            bpai.somaProcedimentos,
            bpai.totalProcedimentos
        )
        const totalPaginas = parseInt(bpac.totalPaginas) + parseInt(bpai.totalPaginas)
        const totalLinhas = parseInt(bpac.totalLinhas) + parseInt(bpai.totalLinhas)

        const header = generateHeader(req.params.mesAno, totalLinhas, totalPaginas, validation)

        res.send(header + bpac.data + bpai.data)
    }
}