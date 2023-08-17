import { Request, Response } from "express"
import RelatorioExamesSUS from "../providers/RelatorioExamesSUS"

export default class relatorioExamesSUSController {
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   */
  static async getRelatorioExames(req: Request, res: Response, next) {
    res.send(await RelatorioExamesSUS.getRelatorioExames(req.params.mesAno))
  }
}