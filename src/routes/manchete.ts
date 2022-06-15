import { Router } from "express"
import mancheteController from "../controllers/mancheteController"

import jwtValidation from "../middlewares/jwtValidation"

const mancheteRouter = Router()

mancheteRouter.post('/', jwtValidation.validate, mancheteController.newManchete)

export default mancheteRouter