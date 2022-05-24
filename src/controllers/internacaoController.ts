import { Request, Response } from 'express'
import InternacaoProvider from '../providers/InternacaoProvider'

export default class internacaoController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getInternacao(req: Request, res: Response, next) {
        res.send(await InternacaoProvider.getInternacoes())
    }
}