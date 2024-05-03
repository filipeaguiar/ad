import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export default class dashboardController {
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   * @returns Retorna um array com todos os links de painéis cadastrados no banco de dados
   * @description Método responsável por retornar todos os links de Painéis cadastrados no banco de dados
   */
  static async getLinks(req: Request, res: Response, next) {
    const prisma = new PrismaClient()
    const links = await prisma.link.findMany()
    res.json(links)
  }

  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   * @returns Insere um link de Painel no banco de dados
   * @description Método responsável por inserir um link de Painel no banco de dados
   */
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

  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   * @returns Atualiza um link de Painel no banco de dados
   * @description Método responsável por atualizar um link de Painel do banco de dados
   */
  static async updateLink(req: Request, res: Response, next) {
    const prisma = new PrismaClient()
    const { id, title, url, icon } = req.body
    try {
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
    } catch (error) {
      res.status(400).json({ message: 'Link não encontrado' })
    }
  }
  
  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @param next Objeto que representa o próximo middleware a ser executado
   * @returns Remove um link de Painel do banco de dados
   * @description Método responsável por remover um link de Painel do banco de dados
   */
  static async deleteLink(req: Request, res: Response, next) {
    const prisma = new PrismaClient()
    const id = req.params.id
    try {
      const link = await prisma.link.delete({
        where: {
          id: parseInt(id)
        }
      })
      res.json(link)
    } catch (error) {
      res.status(400).json({ message: 'Link não encontrado' })
    }
  }
}