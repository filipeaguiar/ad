import { Router } from "express"
import materialController from '../controllers/materialController'
import jwtValidation from "../middlewares/jwtValidation"

const materialRouter = Router()

materialRouter.get('/',jwtValidation.validate, materialController.getMaterial)

export default materialRouter