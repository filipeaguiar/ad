import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import bpaController from "../controllers/bpaController"

const rmaRouter = Router()

rmaRouter.get('/', jwtValidation.validate, bpaController.getBPA)

export default rmaRouter