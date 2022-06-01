import fs from 'fs'

const createQuery = async (filename: string, args?: Object): Promise<string> => {
  let query: string = await (await fs.promises.readFile(filename)).toString()
  if (typeof args !== 'undefined') {
    Object.entries(args).forEach(([key, value]) => {
      const keyString = `#${key}`
      const pattern = RegExp(keyString, 'g')
      query = query.replace(pattern, value)
    }, {})
  }
  return query
}

const generateDates = (anoMes): Object => {
  const startDate: string = new Date(
    new Date(`${anoMes}-01`).getFullYear(),
    new Date(`${anoMes}-01`).getMonth() + 1, 1)
    .toISOString().split('T')[0]
  const endDate: string = new Date(
    new Date(`${anoMes}-01`).getFullYear(),
    new Date(`${anoMes}-01`).getMonth() + 2, 0)
    .toISOString().split('T')[0]
  return { startDate, endDate }
}

export default class SQLHelper {
  static createQuery = createQuery
  static generateDates = generateDates
}
