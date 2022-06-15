import { Router } from "express"
import jwtValidation from "../middlewares/jwtValidation"
import userController from "../controllers/userController"
import activeDirectoryAuthMiddleware from "../middlewares/activeDirectoryAuth"


const userRouter = Router()

userRouter.post('/login', activeDirectoryAuthMiddleware.authenticateUser, userController.login)
userRouter.get('/verify', jwtValidation.validate, userController.getUsers)


export default userRouter