import db from "../../resources/postgres"
import path from 'path'
import SQLHelper from "../../helpers/sqlHelper"

export default class MedicamentosDetalhadoProvider {
  static async getMedicamentosDetalhado(mesAno: string): Promise<any> {
    const { startDate, endDate } = SQLHelper.generateDates(mesAno)
    const file = path.join(__dirname, '../SQL/medicamentos_antimicrobianos_detalhado.sql')
    const SQL = await SQLHelper.createQuery(file, { startDate, endDate })

    try {
      const result = await db.pool.query(SQL)
      return result.rows
    } catch (error) {
      console.log(error)
    }
  }
}