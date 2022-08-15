import { Router } from "express"
import leitoController from "../controllers/leitoController"

const leitosRouter = Router()

leitosRouter.get('/', leitoController.getLeitos)

export default leitosRouter