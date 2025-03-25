import Express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import compression from 'compression'
import activeDirectoryAuthMiddleware from './middlewares/activeDirectoryAuth'
import userRouter from './routes/user'
import rmaRouter from './routes/rma'
import materialRouter from './routes/material'
import bpaRouter from './routes/bpa'
import aihRouter from './routes/aih'
import uploadRouter from './routes/upload'
import internacaoRouter from './routes/internacao'
import procedimentosRouter from './routes/procedimentos'
import relatorioConsultasRouter from './routes/relatorioConsultas'
import relatorioPacientesFaltantesRouter from './routes/relatorioPacientesFaltantes'
import medicamentosRouter from './routes/medicamentos'
//import mancheteRouter from './routes/manchete'
import leitosRouter from './routes/leitos'
import ccihRouter from './routes/ccih'
import relatorioExamesRouter from './routes/relatorioExames'
import dashboardRouter from './routes/link'
import prontuarioRouter from './routes/prontuario'
import opmeRouter from './routes/opme'
import metabaseRouter from './routes/metabase'
import path from 'path'

/**
 * @imports
 *  ExpressJS - Framework de backend
 *  dotenv - permite ler variáveis de ambiente definidas no arquivo .env
 *  cors - permite requisições externas à api
 *  activeDirectoryMiddleware - Middleware que autentica o usuário no AD e retorna um JWT
 *  routes - rotas de aplicação 
 */

/**
 * Carrega as variáveis de ambiente do arquivo .env para process.env
 */
dotenv.config()

// Cria a instância do Express
const app: Express.Application = Express()

// configura os middlewares 
app.use(cors())
app.use(Express.json())
app.use(compression())
app.locals.__basedir = path.join(__dirname, 'static')
app.locals.__imagedir = process.env.UPLOAD_PATH

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
//app.use('/api/manchete', mancheteRouter)
app.use('/api/ccih', ccihRouter)
app.use('/api/relatorioexames', relatorioExamesRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/opme', opmeRouter)
app.use('/api/metabase', metabaseRouter)
app.use('/api/prontuario', prontuarioRouter)
app.use(Express.urlencoded({ extended: true }))
app.use(require('connect-history-api-fallback')())

app.use('/img', Express.static(__dirname + '/static/img'))
//app.get('*', (req, res) => res.redirect('/'))

// Rota genérica, que redireciona todas as requisições para o /
app.use('/', Express.static(__dirname + '/static'))
// Inicia a aplicação ouvindo na porta definida
app.listen(process.env.PORT || 3000, () => { console.log("Express Listening on port: " + process.env.PORT || 3000) })
