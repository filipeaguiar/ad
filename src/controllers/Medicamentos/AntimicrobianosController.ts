import { Request, Response } from 'express'
import MaterialProvider from '../../providers/Medicamentos/AntimicrobianosProvider'

export default class medicamentosAntimicrobianosController {
  static async getMedicamentos(req: Request, res: Response, next) {
    res.send(await MaterialProvider.getMedicamentos())
  }
}