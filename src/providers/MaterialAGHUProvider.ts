import db from '../resources/postgres'
import path from 'path'
import SQLHelper from '../helpers/sqlHelper'

export default class MaterialAGHUProvider {
  static async getMaterial() {
    const file = path.join(__dirname, 'SQL/Materiais_AGHU.sql')
    const SQL = await SQLHelper.createQuery(file)
    try {
      const result = await db.pool.query(SQL)
      return result.rows
    }
    catch(err) {
      console.log(err)
    }
  }
}
