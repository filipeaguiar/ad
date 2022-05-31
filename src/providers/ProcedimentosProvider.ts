import db from "../resources/postgres";
import path from 'path'
import SQLHelper from '../helpers/sqlHelper'

export default class ProcedimentosProvider {
  static async getProcedimentos(): Promise<any> {
    const file = path.join(__dirname, 'SQL/procedimentos.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.pool.query(SQL)
      return result.rows
    }
    catch (err) {
      console.log(err)
      return err.message
    }
  }
}