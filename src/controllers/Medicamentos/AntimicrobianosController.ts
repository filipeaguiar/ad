import { Request, Response } from 'express'
import MaterialProvider from '../../providers/Medicamentos/AntimicrobianosProvider'

/**
 * Classe para listagem de medicamentos antimicrobianos.
 */
export default class MedicamentosAntimicrobianosController {
  /**
   * Lista os medicamentos antimicrobianos.
   * @param req - o objeto de requisição.
   * @param res - o objeto de resposta.
   * @param next - A próxima função de middleware.
   * @returns Uma lista de medicamentos antimicrobianos.
   */
  static async getMedicamentos(req: Request, res: Response, next) {
    res.send(await MaterialProvider.getMedicamentos())
  }
}