import dotenv from 'dotenv'
import axios from 'axios'
import SQLHelper from '../helpers/sqlHelper'
import path from 'path'
import db from '../resources/postgres'

dotenv.config()

interface Card {
  id: number
  name: string
  type: string
  created_at: string
}

interface CardMetadata {
  questions: number
  dashboards: number
  models: number
}

interface CardByYearMonth {
  questions: number,
  yearMonth: string
}

interface CardInfo {
  metadata: CardMetadata
  cards: Card[]
  questionsByYearMonth?: CardByYearMonth[],
  dashboardsByYearMonth?: CardByYearMonth[],
  modelsByYearMonth?: CardByYearMonth[]
}

export default class MetabaseProvider {

  static async getMetabaseViews() {
    const file = path.join(__dirname, 'SQL/metabase_views.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.poolMetabase.query(SQL)
      return (result.rows)
    } catch (err) {
      console.error(err.message)
      return (err.message)
    }
  }

  static async getMetabaseUsers() {
    const file = path.join(__dirname, 'SQL/metabase_users.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.poolMetabase.query(SQL)
      return (result.rows)
    } catch (err) {
      console.error(err.message)
      return (err.message)
    }
  }

  static async getMetabaseDashboardViews() {
    const file = path.join(__dirname, 'SQL/metabase_dashboard_views.sql')
    const SQL = await SQLHelper.createQuery(file)

    try {
      const result = await db.poolMetabase.query(SQL)
      return (result.rows)
    } catch (err) {
      console.error(err.message)
      return (err.message)
    }
  }

  static async getMetabaseCards() {
    const { METABASE_URL, METABASE_KEY } = process.env

    let cards
    let dashboards
    let options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': METABASE_KEY
      }
    }

    try {
      // GET /api/card/ - Lista todos os cards
      cards = await axios.get(`${METABASE_URL}/card/`, options)
    } catch (error) {
      console.error('Erro ao buscar cards do Metabase:', error)
      return []
    }

    try {
      // GET /api/dashboard - Lista todos os dashboards
      dashboards = await axios.get(`${METABASE_URL}/dashboard/`, options)
      dashboards = dashboards.data
      // remove dashboards que estão arquivados
      dashboards = dashboards.filter(dashboard => dashboard.archived === false)

    } catch (error) {
      console.error('Erro ao buscar dashboards do Metabase:', error)
    }

    let cardInfo: CardInfo = {
      metadata: {
        questions: 0,
        dashboards: 0,
        models: 0
      },
      cards: []
    }

    const activeCards = cards.data.filter(card => card.collection?.archived === false)
    let filteredCards = []

    activeCards.forEach(card => {
      const formattedCard: Card = {
        id: card.id,
        name: card.name,
        type: card.type || null,
        created_at: card.created_at
      }
      filteredCards.push(formattedCard)
    })

    const questions = filteredCards.filter(card => card.type === 'question')
    const models = filteredCards.filter(card => card.type === 'model')

    const questionsLenght = questions.length
    const dashboardsLength = dashboards.length
    const modelsLenght = models.length

    // Agrupar perguntas por mês em conformidade com a interface CardByYearMonth
    let questionsByYearMonth: CardByYearMonth[] = []
    questions.forEach(question => {
      const date = new Date(question.created_at)
      const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      const index = questionsByYearMonth.findIndex(item => item.yearMonth === yearMonth)
      if (index === -1) {
        questionsByYearMonth.push({ questions: 1, yearMonth })
      } else {
        questionsByYearMonth[index].questions++
      }
    })
    questionsByYearMonth.sort((a, b) => {
      return a.yearMonth > b.yearMonth ? 1 : -1
    })

    // Agrupar dashboards por mês em conformidade com a interface CardByYearMonth
    let dashboardsByYearMonth: CardByYearMonth[] = []
    dashboards.forEach(dashboard => {
      const date = new Date(dashboard.created_at)
      const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      const index = dashboardsByYearMonth.findIndex(item => item.yearMonth === yearMonth)
      if (index === -1) {
        dashboardsByYearMonth.push({ questions: 1, yearMonth })
      } else {
        dashboardsByYearMonth[index].questions++
      }
    })
    dashboardsByYearMonth.sort((a, b) => {
      return a.yearMonth > b.yearMonth ? 1 : -1
    })


    // Agrupar modelos por mês em conformidade com a interface CardByYearMonth
    let modelsByYearMonth: CardByYearMonth[] = []
    models.forEach(model => {
      const date = new Date(model.created_at)
      const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      const index = modelsByYearMonth.findIndex(item => item.yearMonth === yearMonth)
      if (index === -1) {
        modelsByYearMonth.push({ questions: 1, yearMonth })
      } else {
        modelsByYearMonth[index].questions++
      }
    })
    modelsByYearMonth.sort((a, b) => {
      return a.yearMonth > b.yearMonth ? 1 : -1
    })

    cardInfo.modelsByYearMonth = modelsByYearMonth
    cardInfo.questionsByYearMonth = questionsByYearMonth
    cardInfo.dashboardsByYearMonth = dashboardsByYearMonth

    cardInfo.metadata = {
      questions: questionsLenght,
      dashboards: dashboardsLength,
      models: modelsLenght
    }

    cardInfo.cards = filteredCards
    return cardInfo
  }
}
