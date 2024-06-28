import { Router } from "express"
import prontuarioController from "../controllers/prontuarioController"

const prontuarioRouter = Router()

prontuarioRouter.get('/:prontuario', prontuarioController.getProntuario)

export default prontuarioRouter