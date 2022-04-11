import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import userController from "../controllers/userController"


const userRouter = Router()

userRouter.post('/login', userController.login)
userRouter.get('/', jwtValidation.validate, userController.getUsers)


export default userRouter