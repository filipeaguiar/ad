import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export default class jwtValidation {
    static validate(req: Request, res: Response, next: NextFunction) {
        var bearer: string = req.headers['authorization']
        if (!bearer) {
            res.status(403).redirect('/')
            return
        }

        bearer = bearer.substring(7, req.headers['authorization'].length)

        jwt.verify(bearer, process.env.JWT_SECRET, (err, userInfo) => {
            if (err) {
                res.status(403).send({ error: err })
                return
            }
            res.locals.userInfo = userInfo
            next()
        })
    }
}