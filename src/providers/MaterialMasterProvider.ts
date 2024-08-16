import db from '../resources/oracle'
import path from 'path'
import SQLHelper from '../helpers/sqlHelper'

export default class MaterialMasterProvider {
  static async getMaterial() {
    const pool = await db.run()
    const file = path.join(__dirname, 'SQL/Materiais_Master.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await pool.execute(SQL)
      const columns = ['Cod Master', 'Valor Unitário']

      const formattedRows = result.rows.map(row => {
        let obj = {}

        columns.forEach((coluna, index) => {
          obj[coluna] = row[index]
        })
        return obj
      })
      return formattedRows
    }
    catch (err) {
      console.log(err)
    }
  }
}
