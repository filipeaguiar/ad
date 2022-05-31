import db from "../resources/postgres"
import path from 'path'
import SQLHelper from "../helpers/sqlHelper"

export default class MaterialProvider {
  static async getMaterial(): Promise<any> {
    const file = path.join(__dirname, 'SQL/material.sql')
    const SQL = await SQLHelper.runQuery(file)

    try {
      const result = await db.pool.query(SQL)
      return result.rows
    } catch (error) {
      console.log(error)
    }
  }
}