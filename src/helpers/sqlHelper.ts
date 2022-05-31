import fs from 'fs'

const runQuery = async (filename: string, args?: Object) => {
  let query = await (await fs.promises.readFile(filename)).toString()
  if ( typeof args !== 'undefined' ) {
    Object.entries(args).forEach(([key, value]) => {
      const keyString = `#${key}`
      const pattern = RegExp(keyString, 'g')
      query = query.replace(pattern, value)
    }, {})
  }
  return query
}

const generateDates = (anoMes) => {
  const startDate = new Date(
    new Date(`${anoMes}-01`).getFullYear(),
    new Date(`${anoMes}-01`).getMonth() + 1, 1)
    .toISOString().split('T')[0]
  const endDate = new Date(
    new Date(`${anoMes}-01`).getFullYear(),
    new Date(`${anoMes}-01`).getMonth() + 2, 0)
    .toISOString().split('T')[0]
  return { startDate, endDate }
}

export default class SQLHelper {
  static runQuery = runQuery
  static generateDates = generateDates
}
