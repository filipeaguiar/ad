import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import bpaController from "../controllers/bpaController"

const rmaRouter = Router()

rmaRouter.get('/', jwtValidation.validate, bpaController.getBPA)
rmaRouter.get('/c/:mesAno', jwtValidation.validate, bpaController.getBPAc)
rmaRouter.get('/i/:mesAno', jwtValidation.validate, bpaController.getBPAi)
rmaRouter.get('/magnetico/:mesAno', jwtValidation.validate, bpaController.getBPAMagnetico)


export default rmaRouter