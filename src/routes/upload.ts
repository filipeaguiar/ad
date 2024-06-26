import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import uploadController from "../controllers/uploadController"

const uploadRouter = Router()

uploadRouter.post('/upload', uploadController.upload)
uploadRouter.post('/upload-image', uploadController.uploadImg)
uploadRouter.get('/list', uploadController.getBPAList)
uploadRouter.delete('/delete', uploadController.delete)

export default uploadRouter