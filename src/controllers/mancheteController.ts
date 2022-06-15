/** TODO all  */
import { Request, Response } from 'express'
import DBClient from '../resources/prisma'

const prisma = DBClient.instance

export default class mancheteController {
  static async newManchete(req: Request, res: Response, next) {
    const manchete = await prisma.manchete.create({
      data: {
        ...req.body
      }
    })

    res.status(201).json(manchete)
  }
}