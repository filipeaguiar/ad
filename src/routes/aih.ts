import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import aihController from "../controllers/aihController"

const aihRouter = Router()

aihRouter.get('/:mesAno', jwtValidation.validate, aihController.getAIH)
aihRouter.get('/', jwtValidation.validate, aihController.getAIH)
aihRouter.get('/sisaih/:fileName', jwtValidation.validate, aihController.getSISAIH)


export default aihRouter