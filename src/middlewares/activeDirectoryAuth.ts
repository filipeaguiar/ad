import config from '../config/adConfig'
import activeDirectory from 'activedirectory'
import jwt from 'jsonwebtoken'

const ad = new activeDirectory(config)

export default class activeDirectoryAuthMiddleware {
  static async authenticateUser(req, res, next) {
    const { name, password } = req.body
    const username = 'EBSERHNET\\' + name
    try {
      await ad.authenticate(username, password,
        (err, auth) => {
          if (auth) {
            let groups: Array<string>
            ad.getGroupMembershipForUser(req.body.name + '@ebserh.gov.br', (err, adGroups) => {
              groups = adGroups.map(g => g.cn)
              const payload = {
                name: name,
                groups: groups
              }
              const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
              res.locals.token = "BEARER " + token
              console.log(`Token issued to: ${JSON.stringify(payload)}`)
              next()
            })

          }
          else {
            res.status(403).send({ msg: 'User not authenticated', error: err })
          }
        })
    } catch (err) {
      return res.status(500).send({ message: "ERROR " + err })
    }
  }
}