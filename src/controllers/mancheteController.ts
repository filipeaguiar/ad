import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient

export default class mancheteController {
  
  static async getAllManchetes (req: Request, res: Response) {
    const allManchetes = await prisma.manchete.findMany()
    res.send(allManchetes)
  }
  
  static async newManchete (req: Request, res: Response) {
    const { title, description, link, expiration } = req.body
    const manchete = await prisma.manchete.create({
      data: {
        title,
        description,
        link,
        expiration
      }
    })

    res.json(manchete)
  }
  
  static async getManchete (req: Request, res: Response) {
    const { id } = req.params
    const manchete = await prisma.manchete.findUnique({
      where: {
        id
      }
    })

    res.json(manchete)
  }
  
  static async editManchete (req: Request, res: Response) {
    const { id } = req.params
    const { title, description, link, expiration } = req.body
    const manchete = await prisma.manchete.update({
      where: {
        id
      },
      data: {
        title,
        description,
        link,
        expiration
      }
    })

    res.json(manchete)
  }
  
  static async deleteManchete (req: Request, res: Response) {
    const { id } = req.params
    const manchete = await prisma.manchete.delete({
      where: {
        id
      }
    })

    res.json({
      "msg": `Post ${id} deleted`
    })
  }
}