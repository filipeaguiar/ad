import { Request, Response } from 'express'
import BPAProvider from '../providers/BPAProvider'
import fs from 'fs'
import { parse } from 'csv'
import csvtojson from 'csvtojson'
import SIGTAPHelper from '../helpers/sigtapHelper'


const procedimentosBPAc = async () => {
    const procedimentos = await SIGTAPHelper.procedimentosBPA('rl_procedimento_registro.txt')
    return procedimentos
}

const procedimentosPAB = async () => {
    const procedimentos = await SIGTAPHelper.procedimentosPAB('tb_procedimento.txt')
    return procedimentos
}

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

/**
 * 
 * @param dateString 
 * @returns number: idade
 */
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

    // A fórmula de geração do código consta no documento PDF do DATASUS que descreve o layout do arquivo
    const validation = Math.floor((
        bpacSumProcedimentos +
        bpacTotalProcedimentos +
        bpaiSumProcedimentos +
        bpaiTotalProcedimentos
    ) % 1111) + 1111
    return validation
}

/**
 * 
 * @param mesAno Mes e Ano da competência
 * @param file Caminho do arquivo
 * @returns Objeto com os dados do arquivo formatados
 */
const BPAiMagnetico = async function(mesAno: String, file: any) {
    try {
        const csvOptions = {
            delimiter: ';'
        }
        var pageNumber = 1
        var lineNumber = 0
        let outputJSON = await csvtojson(csvOptions).fromFile(file)

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
            printable += el['cns']?.toString().substring(0, 15).padStart(15, ' ')
            // CBO Profissional
            printable += el['cbo']?.toString().substring(0, 6).padStart(6, '0')
            // Data de Atendimento
            printable += el['data_procedimento']?.substring(0, 8).padStart(8, ' ')
            // Folha BPA
            printable += pageNumber.toString().padStart(3, '0')
            // Linha na Folha do BPA
            printable += lineNumber.toString().padStart(2, '0')
            // Código do Procedimento
            printable += el['procedimento_sus']?.toString().substring(0, 10).padStart(10, '0')
            // CNS do Paciente
            printable += el['paciente_cartao_sus']?.toString().substring(0, 15).padStart(15, ' ')
            // Sexo do Paciente
            printable += el['paciente_sexo_biologico']?.substring(0, 1).padStart(1, ' ')
            // COD IBGE do Município
            printable += el['cidade']?.toString().substring(0, 6).padStart(6, ' ')
            // CID-10
            printable += el['cid']?.substring(0, 4).padEnd(4, ' ')
            // Idade
            printable += calcAge(el['paciente_data_nascimento']).toString().substring(0, 3).padStart(3, '0') || '000'
            // Quantidade de Procedimentos
            printable += el['procedimento_quantidade']?.toString().substring(0, 6).padStart(6, '0')
            // Caractere de Atendimento
            printable += '01'
            // Autorização do Estabelecimento
            printable += ''.padStart(13, ' ')
            // Origem das informações
            printable += 'BPA'
            // Nome do Paciente
            printable += el['paciente_nome']?.substring(0, 30).padEnd(30, ' ')
            // Data de Nascimento do Paciente
            printable += el['paciente_data_nascimento']?.toString().substring(0, 8).padStart(8, ' ')
            // Raça/Cor
            printable += el['paciente_cor'] ? el['paciente_cor'].substring(0, 2).padStart(2, '0') : 99
            // Etnia
            printable += ''.padEnd(4, ' ')
            // Nacionalidade
            printable += el['paciente_nacionalidade']?.toString().substring(0, 3).padStart(3, '0')
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
            printable += el['cep']?.toString().substring(0, 8).padStart(8, ' ')
            // Cod Logradouro Paciente
            printable += el['cod_logradouro']?.toString().substring(0, 3).padStart(3, '0')
            // Endereço do Paciente
            printable += el['logradouro']?.substring(0, 30).padEnd(30, ' ')
            // Complemento do Endereço do Paciente
            printable += el['complemento']?.substring(0, 10).padEnd(10, ' ')
            // Número do Endereço
            printable += el['nro']?.substring(0, 5).padStart(5, ' ')
            // Bairro do Endereço
            printable += el['bairro']?.substring(0, 30).padEnd(30, ' ')
            // Telefone do Paciente
            printable += ''.padStart(11, ' ')
            // Email do Paciente
            printable += ''.padStart(40, ' ')
            // Identificação Nacional de Equipes
            printable += ''.padStart(10, ' ')
            // Fim da linha
            printable += '\r\n'
            arrayData.push(el)
        })

        const parser = parse({
            delimiter: ';',
            from_line: 2
        })

        return {
            arrayData,
            somaProcedimentos: sumBy('procedimento_quantidade', arrayData),
            totalProcedimentos: sumBy('procedimento_sus', arrayData),
            data: printable,
            totalPaginas: pageNumber,
            totalLinhas: totalLinhas
        }
    } catch (err) {
        console.log(err)
    }
}

/**
 * 
 * @param mesAno Mes e Ano da competência
 * @param file Caminho do arquivo
 * @returns Objeto com os dados do arquivo formatados
 */
const BPAcMagnetico = async function(mesAno: String, file: any) {
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

    static async getBPAc(req: Request, res: Response, next) {
        const [listaBPAc, listaPAB] = await Promise.all([
            procedimentosBPAc(),
            procedimentosPAB()
        ])
        const BPAc = await BPAProvider.getBPAc(req.params.mesAno, listaBPAc, listaPAB)
        res.send(BPAc)
    }

    static async getBPAi(req: Request, res: Response, next) {
        const [listaBPAc, listaPAB] = await Promise.all([
            procedimentosBPAc(),
            procedimentosPAB()
        ])
        const BPAi = await BPAProvider.getBPAi(req.params.mesAno, listaBPAc, listaPAB)
        res.send(BPAi)
    }

    static async getBPAMagnetico(req: Request, res: Response, next) {
        try {
            const competencia = req.params.mesAno.substring(0, 4) + '-' + req.params.mesAno.substring(4, 6)
            const bpacFile = `${req.app.locals.__basedir}/bpa/${competencia}-BPAc.csv`
            const bpaiFile = `${req.app.locals.__basedir}/bpa/${competencia}-BPAi.csv`
            const [bpac, bpai]: any = await Promise.all([
                BPAcMagnetico(req.params.mesAno, bpacFile),
                BPAiMagnetico(req.params.mesAno, bpaiFile)
            ])
            // const bpac: any = await BPAcMagnetico(req.params.mesAno, bpacFile)
            // const bpai: any = await BPAiMagnetico(req.params.mesAno, bpaiFile)
            const validation = generateValidation(
                bpac.somaProcedimentos,
                bpac.totalProcedimentos,
                bpai.somaProcedimentos,
                bpai.totalProcedimentos
            )
            const totalPaginas = parseInt(bpac.totalPaginas) + parseInt(bpai.totalPaginas)
            const totalLinhas = parseInt(bpac.totalLinhas) + parseInt(bpai.totalLinhas)

            const header = generateHeader(req.params.mesAno, totalLinhas, totalPaginas, validation)
            res.charset = 'iso-8859-1';
            res.setHeader('Content-type', 'text/plain; charset=iso-8859-1');
            const bpamagnetico = Buffer.from(header + bpac.data + bpai.data, 'latin1')
            res.send(bpamagnetico)
        } catch (err) {
            res.send(err.message)
        }
    }
}
