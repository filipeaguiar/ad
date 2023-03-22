import db from "../resources/postgres"
import path from 'path'
import SQLHelper from "../helpers/sqlHelper"
import { censo, resultados } from '../types/ccih'

export default class ccihProvider {
  static async getResultados(): Promise<any> {
    const file = path.join(__dirname, 'SQL/exames_resultados_gestan.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.poolGestam.query(SQL)
      const resultados: resultados[] = result.rows
      return resultados
    } catch (err) {
      console.log(err.message)
    }
  }

  static async getCenso(): Promise<any> {
    const file = path.join(__dirname, 'SQL/censo_x_exames.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.pool.query(SQL)
      const censo_internacao: censo[] = result.rows
      return censo_internacao
    } catch (err) {
      console.log(err.message)
    }
  }
}