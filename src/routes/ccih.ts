import { Router } from 'express'
import jwtValidation from '../middlewares/jwtValidation'
import ccihController from '../controllers/ccihController'

const ccihRouter = Router()

ccihRouter.get('/resultados', jwtValidation.validate, ccihController.getResultados)
ccihRouter.get('/censo', jwtValidation.validate, ccihController.getCenso)
ccihRouter.get('/', jwtValidation.validate, ccihController.getCcih)

export default ccihRouter