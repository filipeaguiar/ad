import { Router } from "express"
import internacaoController from '../controllers/internacaoController'

const internacaoRouter = Router()

internacaoRouter.get('/', internacaoController.getInternacao)

export default internacaoRouter