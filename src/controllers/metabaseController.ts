import { Request, Response } from 'express'
import MetabaseProvider from '../providers/MetabaseProvider'

export default class metabaseController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getMetabaseCards(req: Request, res: Response, next) {
        res.send(await MetabaseProvider.getMetabaseCards())
    }
}
