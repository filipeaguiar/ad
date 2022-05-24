import { Router } from "express"
import procedimentosController from '../controllers/procedimentosController'

const procedimentosRouter = Router()

procedimentosRouter.get('/', procedimentosController.getProcedimentos)

export default procedimentosRouter