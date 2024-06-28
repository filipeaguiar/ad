
import { Request, Response } from 'express'
import ProntuarioProvider from '../providers/ProntuarioProvider'

export default class prontuarioController {
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   */
  static async getProntuario(req: Request, res: Response, next) {
    res.send(await ProntuarioProvider.getProntuario(req.params.prontuario))
  }
}