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

    static async getMetabaseUsers(req: Request, res: Response, next) {
        res.send(await MetabaseProvider.getMetabaseUsers())
    }

    static async getMetabaseViews(req: Request, res: Response, next) {
        const views = await MetabaseProvider.getMetabaseViews()
        if (req.params.anoMes) {
            const anoMes = req.params.anoMes
            let viewsFiltered = views.filter(view => view.month.includes(anoMes))
            res.send(viewsFiltered)
        }
        else {
            res.send(views)
        }
    }

    static async getMetabaseDashboardViews(req: Request, res: Response, next) {
        const views = await MetabaseProvider.getMetabaseDashboardViews()
        if (req.params.anoMes) {
            const anoMes = req.params.anoMes
            const viewsFiltered = views.filter(view => view.month.includes(anoMes))
            res.send(viewsFiltered)
        }
        else {
            res.send(views)
        }
    }
}
