import { Request, Response } from 'express'
import MaterialProvider from '../providers/MaterialProvider'

export default class materialController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getMaterial(req: Request, res: Response, next) {
            res.send(await MaterialProvider.getMaterial())
    }
}