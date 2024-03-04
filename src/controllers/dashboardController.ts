import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export default class dashboardController {
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   */

  
  static async getLinks(req: Request, res: Response, next) {
    const prisma = new PrismaClient()
    const links = await prisma.link.findMany()
    res.json(links)
  }

  static async createLink(req: Request, res: Response, next) {
    const prisma = new PrismaClient()
    const { title, url, icon } = req.body
    const link = await prisma.link.create({
      data: {
        icon,
        title,
        url
      }
    })
    res.json(link)
  }

  static async updateLink(req: Request, res: Response, next) {
    const prisma = new PrismaClient()
    const { id, title, url, icon } = req.body
    const link = await prisma.link.update({
      where: {
        id
      },
      data: {
        icon,
        title,
        url
      }
    })
    res.json(link)
  }

}
