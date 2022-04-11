import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import rmaController from "../controllers/rmaController"

const rmaRouter = Router()

rmaRouter.get('/', jwtValidation.validate, rmaController.getRMA)

export default rmaRouter