import { Router } from "express"
import relatorioPacientesFaltantesController from "../controllers/relatorioPacientesFaltantesController"

const relatorioPacientesFaltantesRouter = Router()

relatorioPacientesFaltantesRouter.get('/:mesAno', relatorioPacientesFaltantesController.getRelatorioPacientesFaltantes)

export default relatorioPacientesFaltantesRouter