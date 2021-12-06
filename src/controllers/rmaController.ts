import { Request, Response } from 'express'
import RMAProvider from '../providers/RMAProvider'

export default class rmaController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getRMA(req: Request, res: Response, next) {
        const { start, end } = req.query
        if (!start || !end) {
            res.send(await RMAProvider.getRMA())
        }
        else { 
            res.send(await RMAProvider.getRMAByPeriod(start, end))
        }
    }
}