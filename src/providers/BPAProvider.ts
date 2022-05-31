import db from "../resources/postgres"
import SQLHelper from "../helpers/sqlHelper"
import path from 'path'

export default class BPAProvider {
    static async getBPAi(mesAno: string) {
        const { startDate, endDate } = SQLHelper.generateDates(mesAno)
        const file = path.join(__dirname, 'SQL/BPAi.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate })
        try {
            const result = await db.pool.query(SQL)
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }
    static async getBPAc(mesAno: string) {
        const { startDate, endDate } = SQLHelper.generateDates(mesAno)
        const file = path.join(__dirname, 'SQL/BPAc.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate })
        console.log(startDate, endDate)
        try {
            const result = await db.pool.query(SQL)
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }
}