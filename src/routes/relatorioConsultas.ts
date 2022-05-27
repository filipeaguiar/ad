import { Router } from "express"
import relatorioConsultasController from "../controllers/relatorioConsultasController"

const relatorioConsultasRouter = Router()

relatorioConsultasRouter.get('/', relatorioConsultasController.getRelatorioConsultas)

export default relatorioConsultasRouter