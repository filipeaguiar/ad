import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import axios from 'axios'

function getSchema(obj) {
  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      return { type: "array", items: getSchema(obj[0]) };
    } else {
      return { type: "array", items: "unknown" };
    }
  } else if (obj !== null && typeof obj === "object") {
    const schema = { type: "object", properties: {} };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        schema.properties[key] = getSchema(obj[key]);
      }
    }
    return schema;
  } else {
    return { type: typeof obj };
  }
}
export default class dashboardController {
  /**
   * 
   * @param res Objeto Response do ExpressJS
   * @returns Retorna um array com todos os links de painéis cadastrados no banco de dados
   * @description Método responsável por retornar todos os links de Painéis cadastrados no banco de dados
   */
  static async getLinks(req: Request, res: Response) {
    const prisma = new PrismaClient()
    const links = await prisma.link.findMany()
    res.json(links)
  }

  /**
   * 
   * @param req Objeto Request do ExpressJS
   * @param res Objeto Response do ExpressJS
   * @returns Insere um link de Painel no banco de dados
   * @description Método responsável por inserir um link de Painel no banco de dados
   */
  static async createLink(req: Request, res: Response) {
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
   * @returns Atualiza um link de Painel no banco de dados
   * @description Método responsável por atualizar um link de Painel do banco de dados
   */
  static async updateLink(req: Request, res: Response) {
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
   * @returns Remove um link de Painel do banco de dados
   * @description Método responsável por remover um link de Painel do banco de dados
   */
  static async deleteLink(req: Request, res: Response) {
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

  static async getMetabaseData(req: Request, res: Response) {
    dotenv.config()
    const { METABASE_URL, METABASE_KEY } = process.env

    let collections, dashboards, models
    let options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': METABASE_KEY
      }
    }

    try {
      // GET /api/collection/ - Lista todas as coleções
      collections = await axios.get(`${METABASE_URL}/collection/?personal-only=true`, options)
      let personalCollections = collections.data.filter(collection => collection.personal_owner_id !== null)
      console.log(collections.data.length)
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao buscar coleções do Metabase' })
    }

    try {
      // GET /api/dashboard/ - Lista todos os dashboards
      dashboards = await axios.get(`${METABASE_URL}/dashboard/`, options)
    } catch (error) {
      console.error('Erro ao buscar dashboards do Metabase:', error)
      return res.status(400).json({ message: 'Erro ao buscar dashboards do Metabase' })
    }

    try {
      // GET /api/card/?type=model - lista todos os modelos
      models = await axios.get(`${METABASE_URL}/card/`, options)
    } catch (error) {
      console.error('Erro ao buscar modelos do Metabase:', error)
      return res.status(400).json({ message: 'Erro ao buscar modelos do Metabase' })
    }

    // Dashboards não pessoais
    const personalCollectionIds = collections.data.map(collection => collection.id)
    const nonPersonalDashboards = dashboards.data.filter(
      dashboard => !personalCollectionIds.includes(dashboard.collection_id)
    )


    // Modelos não pessoais
    const nonPersonalModels = models.data.filter(
      model => !personalCollectionIds.includes(model.collection_id) && model.type === 'model'
    )

    let count = 1
    nonPersonalModels.forEach(model => {
      console.log(count)
      count++
    })
    res.json({
      collections: collections.data.length,
      dashboards: nonPersonalDashboards.length,
      models: nonPersonalModels.length
    })
  }
}
