import { Router } from "express"
import relatorioExamesSUSController from "../controllers/relatorioExamesSUS"

const relatorioExamesRouter = Router()

relatorioExamesRouter.get('/:mesAno', relatorioExamesSUSController.getRelatorioExames)

export default relatorioExamesRouter