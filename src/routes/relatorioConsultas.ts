import { Router } from "express"
import relatorioConsultasController from "../controllers/relatorioConsultasController"

const relatorioConsultasRouter = Router()

relatorioConsultasRouter.get('/:mesAno', relatorioConsultasController.getRelatorioConsultas)

export default relatorioConsultasRouter