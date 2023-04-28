import { Request, Response } from 'express'
import InternacaoUtiProvider from '../providers/InternacaoUtiProvider'

export default class InternacaoUtiController {
  static async getInternacaoUti(req: Request, res: Response, next) {
    res.send(await InternacaoUtiProvider.getInternacaoUTI())
  }
}
