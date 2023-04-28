import { Router } from "express"
import internacaoController from '../controllers/internacaoController'
import InternacaoUtiController from "../controllers/internacaoUtiController"

const internacaoRouter = Router()

internacaoRouter.get('/', internacaoController.getInternacao)
internacaoRouter.get('/uti', InternacaoUtiController.getInternacaoUti)

export default internacaoRouter