import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import aihController from "../controllers/aihController"

const aihRouter = Router()

aihRouter.get('/exames/', jwtValidation.validate, aihController.getAIHexames)
aihRouter.get('/:mesAno', jwtValidation.validate, aihController.getAIH)
aihRouter.get('/', jwtValidation.validate, aihController.getAIH)
aihRouter.get('/sisaih/:fileName', jwtValidation.validate, aihController.getSISAIH)
aihRouter.get('/relatorio/:data/:usuario', jwtValidation.validate, aihController.getRelatorio)


export default aihRouter