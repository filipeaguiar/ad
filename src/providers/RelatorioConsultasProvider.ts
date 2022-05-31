import db from "../resources/postgres";
import SQLHelper from "../helpers/sqlHelper"
import path from 'path'

export default class RelatorioConsultasProvider {
  static async getRelatorioConsultas(mesAno: string): Promise<any> {
    const { startDate, endDate } = SQLHelper.generateDates(mesAno)
    const file = path.join(__dirname, 'SQL/relatorio_consultas.sql')
    const SQL = await SQLHelper.runQuery(file, { startDate, endDate })

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