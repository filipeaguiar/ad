import { Router } from "express"
import medicamentosAntimicrobianosController from '../controllers/medicamentosController'
import jwtValidation from "../middlewares/jwtValidation"

const medicamentosRouter = Router()

medicamentosRouter.get('/antimicrobianos', jwtValidation.validate, medicamentosAntimicrobianosController.getMedicamentosAntimicrobianos)
medicamentosRouter.get('/sumarizados/:mesAno', jwtValidation.validate, medicamentosAntimicrobianosController.getMedicamentosSumarizados)
medicamentosRouter.get('/detalhado/:mesAno', jwtValidation.validate, medicamentosAntimicrobianosController.getMedicamentosDetalhado)

export default medicamentosRouter