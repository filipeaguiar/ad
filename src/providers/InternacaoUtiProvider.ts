import db from '../resources/postgres'
import path from 'path'
import SQLHelper from '../helpers/sqlHelper'

export default class InternacaoUtiProvider {
  static async getInternacaoUTI(): Promise<any> {
    const file = path.join(__dirname, 'SQL/internacao_uti.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.pool.query(SQL)
      return result.rows

    } catch (error) {
      console.log(error)
    }
  }
}