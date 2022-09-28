import db from "../resources/postgres"
import SQLHelper from "../helpers/sqlHelper"
import path from 'path'

export default class AIHProvider {

    static async getAIH(mesAno: string) {
        const { startDate, endDate } = SQLHelper.generateDates(mesAno)
        const file = path.join(__dirname, 'SQL/AIH.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate })
        try {
            const result = await db.pool.query(SQL)
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }
}