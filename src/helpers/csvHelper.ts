const getTotal = function (Array: any[], field: string): number {
  return Array.reduce((acc, curr) => {
    return acc + curr[field]
  }, 0)
}

export default class csvHelper {
  static getTotal = getTotal
}