import { Request, Response } from 'express'
import ProcedimentosProvider from '../providers/ProcedimentosProvider'

export default class procedimentosController {
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   */
  static async getProcedimentos(req: Request, res: Response, next) {
    res.send(await ProcedimentosProvider.getProcedimentos())
  }
}