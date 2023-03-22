import { Request, Response } from 'express'
import ccihProvider from '../providers/ccihProvider'

export default class ccihController {
  static async getResultados(req: Request, res: Response, next) {
    res.send(await ccihProvider.getResultados())
  }

  static async getCenso(req: Request, res: Response, next) {
    res.send(await ccihProvider.getCenso())
  }

  static async getCcih(req: Request, res: Response, next) {
    const censo = await ccihProvider.getCenso()
    const resultados = await ccihProvider.getResultados()
    const temp = []
    for (let c of censo) {
      for (let r of resultados) {
        if (r.solicitacao === c.seq) {
          // Criar o array resultados se não existir
          if (!c.resultados) {
            c.resultados = []
          }
          // Adicionar o objeto r ao array resultados
          c.resultados.push(r)
          temp.push(c)
        }
        else {
          temp.push(c)
        }
      }
    }
    res.send(temp)
  }
}