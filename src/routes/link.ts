import { Router } from 'express'
import dashboardController from '../controllers/dashboardController'
import jwtValidation from '../middlewares/jwtValidation'

const dashboardRouter = Router()

dashboardRouter.get('/links', dashboardController.getLinks)
dashboardRouter.post('/links', jwtValidation.validate, dashboardController.createLink)
dashboardRouter.put('/links', jwtValidation.validate, dashboardController.updateLink)
dashboardRouter.delete('/links/:id', jwtValidation.validate, dashboardController.deleteLink)
dashboardRouter.get('/links/metabase', dashboardController.getMetabaseData)

export default dashboardRouter
