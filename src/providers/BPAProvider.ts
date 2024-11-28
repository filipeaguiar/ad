import db from '../resources/postgres'
import SQLHelper from '../helpers/sqlHelper'
import path from 'path'
import { isEqual } from 'lodash'

export default class BPAProvider {

    static async getBPAi(mesAno: string, procedimentosBPAc: string, procedimentosPAB: string) {
        const { startDate, endDate } = SQLHelper.generateDates(mesAno)
        const file = path.join(__dirname, 'SQL/BPAi.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate, procedimentosBPAc, procedimentosPAB })
        try {
            console.time('BPAi')
            console.log('Enviando consulta SQL BPAi')
            const result = await db.pool.query(SQL)
            console.timeEnd('BPAi')
            console.time('FiltroBPAi')
            console.log('TOTAL', '\x1b[41m', 'BPAi', '\x1b[0m', '\x1b[31m', result.rows.length, '\x1b[0m')
            // result.rows = result.rows.filter(row => !(procedimentosBPAc.includes(row.procedimento_sus)))
            result.rows = result.rows.filter(row => !(procedimentosPAB.includes(row.procedimento_sus)))
            console.log('FILTR', '\x1b[41m', 'BPAi', '\x1b[0m', '\x1b[33m', result.rows.length, '\x1b[0m')
            console.timeEnd('FiltroBPAi')
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }
    static async getBPAc(mesAno: string, procedimentosBPAc: string, procedimentosPAB: string) {
        const { startDate, endDate } = SQLHelper.generateDates(mesAno)
        const file = path.join(__dirname, 'SQL/BPAc.sql')
        const consultas = path.join(__dirname, 'SQL/BPAc_consultas.sql')
        const exames = path.join(__dirname, 'SQL/BPAc_exames.sql')
        const procedimentos = path.join(__dirname, 'SQL/BPAc_procedimentos.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate, procedimentosBPAc, procedimentosPAB })
        const SQL_consultas = await SQLHelper.createQuery(consultas, { startDate, endDate, procedimentosBPAc, procedimentosPAB })
        const SQL_exames = await SQLHelper.createQuery(exames, { startDate, endDate, procedimentosBPAc, procedimentosPAB })
        const SQL_procedimentos = await SQLHelper.createQuery(procedimentos, { startDate, endDate, procedimentosBPAc, procedimentosPAB })
        try {
            console.time('Antigo')
            const result = await db.pool.query(SQL)
            console.timeEnd('Antigo')
            console.time('Novo')
            const [ result_consultas, result_exames, result_procedimentos ] = await Promise.all([
              await db.pool.query(SQL_consultas),
              await db.pool.query(SQL_exames),
              await db.pool.query(SQL_procedimentos),
            ])
            let resultado = result_consultas.rows.concat(result_procedimentos.rows, result_exames.rows)
            console.timeEnd('Novo')
            console.log('TOTAL', '\x1b[43m', 'BPAc', '\x1b[0m', '\x1b[31m', result.rows.length, '\x1b[0m')
            result.rows = result.rows.filter(row => (procedimentosBPAc.includes(row.procedimento_sus)))
            result.rows = result.rows.filter(row => !(procedimentosPAB.includes(row.procedimento_sus)))
            resultado = resultado.filter(row => (procedimentosBPAc.includes(row.procedimento_sus)))
            resultado = resultado.filter(row => !(procedimentosPAB.includes(row.procedimento_sus)))
            console.log(isEqual(result.rows, resultado))
            console.log('FILTR', '\x1b[43m', 'BPAc', '\x1b[0m', '\x1b[33m', result.rows.length, '\x1b[0m')
            return resultado
        } catch (error) {
            console.log(error)
        }
    }
}
