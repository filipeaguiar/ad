import { Request, Response } from 'express'
import AntimicrobianosProvider from '../providers/Medicamentos/AntimicrobianosProvider'
import MedicamentosDetalhadoProvider from '../providers/Medicamentos/DetalhadoProvider'
import MedicamentosSumarizadosProvider from '../providers/Medicamentos/SumarizadoProvider'

export default class medicamentosAntimicrobianosController {
  static async getMedicamentosAntimicrobianos(req: Request, res: Response, next) {
    res.send(await AntimicrobianosProvider.getMedicamentos())
  }

  static async getMedicamentosSumarizados(req: Request, res: Response, next) {
    res.send(await MedicamentosSumarizadosProvider.getMedicamentos(req.params.mesAno))
  }

  static async getMedicamentosDetalhado(req: Request, res: Response, next) {
    res.send(await MedicamentosDetalhadoProvider.getMedicamentosDetalhado(req.params.mesAno))
  }
}