import MaterialEstoqueController from "../controllers/materialEstoqueController"
import { Router } from "express"

const opmeRouter = Router()

opmeRouter.get('/', MaterialEstoqueController.getMaterialEstoque)

export default opmeRouter
