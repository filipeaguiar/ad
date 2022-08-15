import { Request, Response } from 'express'
import LeitoProvider from '../providers/LeitosProvider'

export default class leitoController {
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   */
  static async getLeitos(req: Request, res: Response, next) {
    res.send(await LeitoProvider.getLeitos())
  }
}