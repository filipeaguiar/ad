/**
 * Imports:
 *  ExpressJS - Framework de backend
 *  dotenv - permite ler variáveis de ambiente definidas no arquivo .env
 *  cors - permite requisições externas à api
 *  activeDirectoryMiddleware - Middleware que autentica o usuário no AD e retorna um JWT
 *  routes - rotas de aplicação 
 */

import Express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import activeDirectoryAuthMiddleware from './middlewares/activeDirectoryAuth'
import userRouter from './routes/user'
import rmaRouter from './routes/rma'
import materialRouter from './routes/material'
import bpaRouter from './routes/bpa'
import aihRouter from './routes/aih'
import uploadRouter from './routes/upload'
import internacaoRouter from './routes/internacao'
import path from 'path'
import procedimentosRouter from './routes/procedimentos'
import relatorioConsultasRouter from './routes/relatorioConsultas'
import relatorioPacientesFaltantesRouter from './routes/relatorioPacientesFaltantes'
import medicamentosRouter from './routes/medicamentos'
import mancheteRouter from './routes/manchete'
import leitosRouter from './routes/leitos'


/**
 * Carrega as variáveis de ambiente do arquivo .env para process.env
 */
dotenv.config()

// Cria a instância do Express
const app: Express.Application = Express()

// configura os middlewares 
app.use(cors())
app.use(Express.json())
app.use('/', Express.static(__dirname + '/static'))
app.locals.__basedir = path.join(__dirname, 'static')

// routes
//app.use('/api/users/login', activeDirectoryAuthMiddleware.authenticateUser)
app.use('/api/rma', rmaRouter)
app.use('/api/users', userRouter)
app.use('/api/material', materialRouter)
app.use('/api/bpa', bpaRouter)
app.use('/api/aih', aihRouter)
app.use('/api/file', uploadRouter)
app.use('/api/internacao', internacaoRouter)
app.use('/api/leitos', leitosRouter)
app.use('/api/procedimentos', procedimentosRouter)
app.use('/api/relatorioconsultas', relatorioConsultasRouter)
app.use('/api/relatoriopacientesfaltantes', relatorioPacientesFaltantesRouter)
app.use('/api/medicamentos', medicamentosRouter)
app.use('/api/manchete', mancheteRouter)
app.use(Express.urlencoded({ extended: true }))
app.use(require('connect-history-api-fallback')())
// Rota genérica, que redireciona todas as requisições para o /
app.get('*', (req, res) => res.redirect('/'))
// Inicia a aplicação ouvindo na porta definida
app.listen(process.env.PORT || 3000, () => { console.log("Express Listening on port: " + process.env.PORT || 3000) })
