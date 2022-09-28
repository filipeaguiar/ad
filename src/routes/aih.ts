import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import aihController from "../controllers/aihController"

const aihRouter = Router()

aihRouter.get('/:mesAno', jwtValidation.validate, aihController.getAIH)


export default aihRouter