import { Router } from "express"
import mancheteController from "../controllers/mancheteController"
import jwtValidation from "../middlewares/jwtValidation"

const mancheteRouter = Router()

mancheteRouter.get('/', mancheteController.getAllManchetes)
mancheteRouter.get('/:id', jwtValidation.validate, mancheteController.getManchete)
mancheteRouter.post('/', jwtValidation.validate, mancheteController.newManchete)
mancheteRouter.put('/:id', jwtValidation.validate, mancheteController.editManchete)
mancheteRouter.delete('/:id', jwtValidation.validate, mancheteController.deleteManchete)

export default mancheteRouter