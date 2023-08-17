import db from "../resources/postgres";
import SQLHelper from "../helpers/sqlHelper"
import path from 'path'

export default class RelatorioExamesSUS {
  static async getRelatorioExames(mesAno: string): Promise<any> {
    const { startDate, endDate } = SQLHelper.generateDates(mesAno)
    const file = path.join(__dirname, 'SQL/Exames-SemSUS.sql')
    const SQL = await SQLHelper.createQuery(file, { startDate, endDate })

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