import { Request, Response } from "express"
import RelatorioPacientesFaltantesProvider from "../providers/RelatorioPacientesFaltantesProvider"

export default class relatorioPacientesFaltantesController {
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   */
  static async getRelatorioPacientesFaltantes(req: Request, res: Response, next) {
    res.send(await RelatorioPacientesFaltantesProvider.getRelatorioPacientesFaltantes(req.params.mesAno))
  }
}