import db from "../resources/postgres"
import path from 'path'
import SQLHelper from "../helpers/sqlHelper"

export default class RMAProvider {
    static async getRMAByPeriod(start: string, end: string): Promise<any> {
        const file = path.join(__dirname, 'SQL/RMA_periodo.sql')
        const SQL = await SQLHelper.createQuery(file, { start, end })

        try {
            const result = await db.pool.query(SQL)
            return (result.rows)
        } catch (err) {
            console.error(err.message)
            return (err.message)
        }
    }

    static async getRMA(): Promise<any> {
        const file = path.join(__dirname, 'SQL/RMA.sql')
        const SQL = await SQLHelper.createQuery(file)

        try {
            const result = await db.pool.query(SQL)
            return result.rows
        } catch (err) {
            console.error(err.message)
        }
    }
}