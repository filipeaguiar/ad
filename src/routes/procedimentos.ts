import { Router } from "express"
import procedimentosController from '../controllers/procedimentosController'
import jwtValidation from "../middlewares/jwtValidation"

const procedimentosRouter = Router()

procedimentosRouter.get('/', procedimentosController.getProcedimentos)

export default procedimentosRouter