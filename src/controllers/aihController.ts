import { Request, Response } from 'express'
import AIHProvider from '../providers/AIHProvider'
import fs from 'fs'
import { parse } from 'csv'
import csvtojson from 'csvtojson'

const SISAIH = async (mesAno: String, file: any) => {
    try {
        const csvOptions = {
            delimiter: ';'
        }
        let outputJSON = await csvtojson(csvOptions).fromFile(file)

        let printable = ''

        outputJSON.forEach(el => {
            printable += ''.padStart(8, '0') // Num lote
            printable += ''.padStart(3, '0') // Quantidade
            printable += mesAno.padEnd(6, ' ') // Competência
            printable += '000' // Sequencial
            printable += el['orgao_emissor'] // Órgão emissor da AIH
            printable += '0000396' // CNES do HC-UFPE
            printable += '261160' // Código do Município
            printable += el['nro_aih'].padEnd(13, ' ') // Número da AIH
            printable += '01' // Tipo AIH: Principal
            printable += el['procedimento_tipo_leito'] // Tipo do leito -- precisa ser investigado
            printable += ''.padEnd(45, '0') // Filler
            printable += el['procedimento_modalidade'] // Modalidade da AIH -- precisa ser investigado
            printable += '000' // Sequencial de AIH de continuidade
            printable += el['aih_posterior'].padStart(13, '0')
            printable += el['aih_anterior'].padStart(13, '0')
            printable += el['data_internacao'].padStart(6, ' ') // Data Autorização -- precisa ser investigado
            printable += el['data_internacao'].padStart(6, ' ')
            printable += el['data_saida'].padStart(6, ' ')
            //printable += el['data_alta'].padStart(6, ' ') // Essa ou a data de saída?
            printable += el['procedimento_solicitado'].padStart(10, '0') // Procedimento Solicitado -- É o mesmo que Proc. Principal???
            printable += el['procedimento_mudanca']
            printable += el['procedimento_solicitado'].padStart(10, '0') // Procedimento Principal
            //printable += el['procedimento_carater_atendimento'].padStart(2, '0')
            printable += '00' // Carater de atendimento -- Investigar
            printable += el['procedimento_motivo_encerramento'].padStart(2, '0')
            printable += '1'
            printable += el['procedimento_documento_solicitante'].padStart(15, '0')
            printable += '1'
            printable += el['procedimento_documento_responsavel'].padStart(15, '0')
            printable += '2'
            printable += el['procedimento_documento_diretor_clinico'].padStart(15, '0') // Filipe Carrilho
            printable += '2'
            printable += el['procedimento_documento_autorizador'].padStart(15, '0') // Glauber Leitão
            printable += el['procedimento_cid'].padStart(4, ' ') // CID
            /*printable += el['paciente_nome'].padEnd(70, ' ')
            printable += el['paciente_nascimento'].padStart(8, '0')
            printable += el['paciente_sexo'].padStart(1, 'M')
            printable += el['paciente_cor'].padStart(2, '0')
            printable += el['paciente_nome_mae'].padEnd(70, ' ')
            printable += el['paciente_nome_responsavel'].padEnd(70, ' ')
            printable += '4' // Tipo do documento do paciente: CPF
            printable += el['paciente_etnia'].padStart(4, '0')
            printable += '00000' // Solicitação de liberação
            printable += '00' // Filler
            printable += el['paciente_cartao_sus'].padStart(15, '0')
            printable += el['paciente_nacionalidade'].padStart(3, '0')
            printable += el['paciente_tipo_logradouro'].padStart(3, '0')
            printable += el['paciente_logradouro'].padEnd(50, ' ')
            printable += el['paciente_numero_logradouro'].padStart(7, '0')
            printable += el['paciente_complemento_logradouro'].substring(0, 15).padEnd(15, ' ')
            printable += el['paciente_bairro'].padEnd(30, ' ')
            printable += el['paciente_cidade'].substring(0, 6).padEnd(6, ' ')
            printable += el['paciente_uf'].padEnd(2, ' ')
            printable += el['paciente_cep'].padEnd(8, ' ')
            printable += el['paciente_prontuario'].padStart(15, '0')
            printable += '0000' // Numero da Enfermaria
            printable += '0000' // Numero do Leito
            printable += ''.padEnd(730, '0')
            printable += el['paciente_grau_instrucao'].padStart(1, '0')
            printable += ''.padEnd(4, ' ') // Cid Notificação - Laqueadura
            printable += '00' // Método Contraceptivo
            printable += '00' // Método Contraceptivo Laqueadura
            printable += '1' //
            printable += ''.padEnd(35, ' ')
            printable += ''.padStart(12, '0')
            printable += el['paciente_documento_numero'].padStart(32, '0')
            printable += el['paciente_fone_ddd'].padStart(2, '0')
            printable += el['paciente_fone'].padStart(9, '0')
            printable += ''.padEnd(50, ' ')
            for (let i = 0; i < 8; i++) {
                printable += ''.padEnd(4, ' ')
                printable += '0'
            }

            */
            printable += '\r\n'
        })
        return {
            data: printable
        }
    }
    catch (err) {
        console.log(err)
    }
}

export default class AIHController {
    /**
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getAIH(req: Request, res: Response, next) {
        console.log(req.query)
        const AIH = await AIHProvider.getAIH(req.query.startDate, req.query.endDate)
        res.send(AIH)
    }

    /**
     * @param mesAno Mes e Ano da competência
     * @param file Caminho do arquivo
     * @returns Objeto com os dados do arquivo formatados
     */

    static async getSISAIH(req: Request, res: Response, next) {
        try {
            const competencia = req.params.fileName.substring(0, 4) + req.params.fileName.substring(5, 7)
            const aihFile = `${req.app.locals.__basedir}/aih/${req.params.fileName}`
            const sisaihContent: any = await SISAIH(competencia, aihFile)
            res.charset = 'iso-8859-1';
            res.setHeader('Content-type', 'text/plain; charset=iso-8859-1')
            const sisaih = Buffer.from(sisaihContent.data, 'latin1')
            res.send(sisaih)
        } catch (err) {
            res.send(err.message)
        }
    }
}