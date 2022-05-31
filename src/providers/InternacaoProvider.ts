import SQLHelper from "../helpers/sqlHelper";
import db from "../resources/postgres";
import path from 'path'

export default class InternacaoProvider {
  static async getInternacoes(): Promise<any> {
    const file = path.join(__dirname, 'SQL/internacao.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.pool.query(SQL)
      return result.rows
    } catch (error) {
      console.log(error)
    }
  }
}
