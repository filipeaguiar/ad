import { Request, Response } from 'express'

export default class userController {
    static async login(req: Request, res: Response, next) {
        res.send(res.locals)
    }

    static async getUsers(req: Request, res: Response, next) {
        res.status(403).send({ message: "Forbidden" })
    }
}