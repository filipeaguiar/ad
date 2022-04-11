import { Request, Response } from 'express'
import BPAProvider from '../providers/BPAProvider'


const BPAcFile = (array: Array<Object>) => {
    array.forEach((item, linha) => {
        console.log(`O conteúdo da linha ${linha} é:`)
        console.log(item)
    })
}

export default class bpaController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @param next Objeto que representa o próximo middleware a ser executado
     */
    static async getBPA(req: Request, res: Response, next) {
        const { start, end, atendimento } = req.query
        if (!start || !end) {
            res.send(await BPAProvider.getBPA(atendimento))
        }
        else {
            res.send(await BPAProvider.getBPAiByPeriod(start, end))
        }
    }

    static async getBPAc(req: Request, res: Response, next) {
        const BPAc = await BPAProvider.getBPAc(req.params.mesAno)
        console.log(BPAc)
        BPAcFile(BPAc)
        res.send(BPAc)
    }
}