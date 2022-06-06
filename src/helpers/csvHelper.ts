import fs from 'fs/promises'

const readCSV = (filename: string) => {
  console.log(filename)
}

export default class csvHelper {
  static readCSV = readCSV
}