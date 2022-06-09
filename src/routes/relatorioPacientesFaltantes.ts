import { Router } from "express"
import relatorioPacientesFaltantesController from "../controllers/relatorioPacientesFaltantesController"
import jwtValidation from "../middlewares/jwtValidation"

const relatorioPacientesFaltantesRouter = Router()

relatorioPacientesFaltantesRouter.get('/:mesAno', jwtValidation.validate, relatorioPacientesFaltantesController.getRelatorioPacientesFaltantes)

export default relatorioPacientesFaltantesRouter