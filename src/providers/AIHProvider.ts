import db from "../resources/postgres"
import SQLHelper from "../helpers/sqlHelper"
import path from 'path'

export default class AIHProvider {

    static async getAIH(startDate, endDate) {
        const file = path.join(__dirname, 'SQL/AIH.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate })
        try {
            const result = await db.pool.query(SQL)
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }

    static async getAIHexames(startDate, endDate) {
        const file = path.join(__dirname, 'SQL/AIH-exames.sql')
        const SQL = await SQLHelper.createQuery(file, { startDate, endDate })
        try {
            const result = await db.pool.query(SQL)
            return result.rows
        } catch (error) {
            console.log(error)
        }
    }
}