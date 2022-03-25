/**
 * Imports:
 *  ExpressJS - Framework de backend
 *  dotenv - permite ler variáveis de ambiente definidas no arquivo .env
 *  cors - permite requisições externas à api
 *  activeDirectoryMiddleware - Middleware que autentica o usuário no AD e retorna um JWT
 *  routes - rotas de aplicação 
 */

import  Express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import activeDirectoryAuthMiddleware from './middlewares/activeDirectoryAuth'
import userRouter from './routes/user'
import rmaRouter from './routes/rma'
import materialRouter from './routes/material'
import bpaRouter from './routes/bpa'
import uploadRouter from './routes/upload'
import path from 'path'

/**
 * Carrega as variáveis de ambiente do arquivo .env para process.env
 */
dotenv.config()
console.log(process.env.UPLOAD_PATH)

// Cria a instância do Express
const app = Express()

// configura os middlewares 
app.use(cors())
app.use(Express.json())
app.locals.__basedir = path.join(__dirname, 'static')

// rota raiz
app.get('/', (req,res) =>{
    res.json({
        msg: "Server Running"
    })
})

// routes
app.use('/users/login', activeDirectoryAuthMiddleware.authenticateUser)
app.use('/rma', rmaRouter)
app.use('/users', userRouter)
app.use('/material', materialRouter)
app.use('/bpa', bpaRouter)
app.use('/file', uploadRouter)
app.use(Express.urlencoded({extended: true}))
// inicia a aplicação ouvindo na porta definida
app.listen(process.env.PORT || 3000)
