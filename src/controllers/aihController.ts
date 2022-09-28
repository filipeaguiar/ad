import { Request, Response } from 'express'
import AIHProvider from '../providers/AIHProvider'
import fs from 'fs'
import { parse } from 'csv'
import csvtojson from 'csvtojson'

export default class AIHController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getAIH(req: Request, res: Response, next) {
        const AIH = await AIHProvider.getAIH(req.params.mesAno)
        res.send(AIH)
    }
}