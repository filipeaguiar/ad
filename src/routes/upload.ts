import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import uploadController from "../controllers/uploadController"

const uploadRouter = Router()

uploadRouter.post('/upload', uploadController.upload)
uploadRouter.get('/list', uploadController.getListFiles)

export default uploadRouter