import jwt from 'jsonwebtoken'

export default class jwtValidation {
    static validate( req, res, next) {
        var bearer: string = req.headers['authorization']
        if (!bearer) {
            res.status(403).send({msg: 'Missing Auth Token'})
            return
        }

        bearer = bearer.substring(7, req.headers['authorization'].lenght)

        jwt.verify(bearer, process.env.JWT_SECRET, (err, userInfo) =>{
            if(err) {
                res.status(403).send({error: err})
                return
            }
            res.locals.userInfo = userInfo
            next()
        })
    }
}