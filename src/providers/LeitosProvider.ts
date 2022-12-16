import db from "../resources/postgres";
import path from 'path'
import SQLHelper from "../helpers/sqlHelper";

export default class LeitosProvider {
  static async getLeitos(): Promise<any> {
    const file = path.join(__dirname, 'SQL/leitos_status.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.pool.query(SQL)
      return result.rows
    } catch (error) {
      console.log(error)
    }
  }
}
