import { Request, Response } from "express"
import RelatorioConsultasProvider from "../providers/RelatorioConsultasProvider"

export default class relatorioConsultasController {
  /**
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   */
  static async getRelatorioConsultas(req: Request, res: Response, next) {
    res.send(await RelatorioConsultasProvider.getRelatorioConsultas(req.params.mesAno))
  }
}