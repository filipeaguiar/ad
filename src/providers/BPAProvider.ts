import db from '../resources/postgres'
import SQLHelper from '../helpers/sqlHelper'
import path from 'path'

export default class BPAProvider {

    static async getBPAi(mesAno: string, procedimentosBPAc: string, procedimentosPAB: string) {
        const { startDate, endDate } = SQLHelper.generateDates(mesAno)
        const file = path.join(__dirname, 'SQL/BPAi.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate, procedimentosBPAc, procedimentosPAB })
        try {
            const result = await db.pool.query(SQL)
            console.log('TOTAL', '\x1b[41m', 'BPAi', '\x1b[0m', '\x1b[31m', result.rows.length, '\x1b[0m')
            result.rows = result.rows.filter(row => !(procedimentosBPAc.includes(row.procedimento_sus)))
            result.rows = result.rows.filter(row => !(procedimentosPAB.includes(row.procedimento_sus)))
            console.log('FILTR', '\x1b[41m', 'BPAi', '\x1b[0m', '\x1b[33m', result.rows.length, '\x1b[0m')
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }
    static async getBPAc(mesAno: string, procedimentosBPAc: string, procedimentosPAB: string) {
        const { startDate, endDate } = SQLHelper.generateDates(mesAno)
        const file = path.join(__dirname, 'SQL/BPAc.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate, procedimentosBPAc, procedimentosPAB })
        try {
            const result = await db.pool.query(SQL)
            console.log('TOTAL', '\x1b[43m', 'BPAc', '\x1b[0m', '\x1b[31m', result.rows.length, '\x1b[0m')
            result.rows = result.rows.filter(row => (procedimentosBPAc.includes(row.procedimento_sus)))
            result.rows = result.rows.filter(row => !(procedimentosPAB.includes(row.procedimento_sus)))
            console.log('FILTR', '\x1b[43m', 'BPAc', '\x1b[0m', '\x1b[33m', result.rows.length, '\x1b[0m')
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }
}