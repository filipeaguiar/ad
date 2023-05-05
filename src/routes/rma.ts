import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import rmaController from "../controllers/rmaController"

const rmaRouter = Router()

rmaRouter.get('/', rmaController.getRMA)

export default rmaRouter
