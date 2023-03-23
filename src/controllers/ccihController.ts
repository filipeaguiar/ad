import { Request, Response } from 'express'
import ccihProvider from '../providers/ccihProvider'
import { censo, resultados } from '../types/ccih'

function jsonToCsv(array) {
  const cabecalho = Object.keys(array[0]).map(campo => `"${campo}"`).join(';');
  const conteudo = array.map(objeto => Object.values(objeto).map(valor => valor === null ? '' : `"${valor}"`).join(';')).join('\n');

  return cabecalho + '\n' + conteudo;
}

function flattenArray(array) {
  const temp = []

  array.forEach(internacao => {
    internacao.material = ''
    internacao.germe = ''
    internacao.dh_liberacao = ''
    internacao.drogas = ''

    if (internacao.resultados.lenght !== 0) {
      internacao.resultados.forEach((resultado, indice) => {

        const i = indice + 1
        let drogas = resultado.drogas.split('/')
        drogas = drogas.map(e => {
          e.replaceAll(' ', '')
          e = `${i}. ${e}`
          return e
        })
        drogas = drogas.join(' ')
        internacao.material = `${internacao.material} ${i}. [${resultado.material}]`
        internacao.germe = `${internacao.germe} ${i}. [${resultado.germe}]`
        internacao.dh_liberacao = `${internacao.dh_liberacao} ${i}. [${resultado.dh_liberacao}]`
        internacao.drogas = `${internacao.drogas} ${i}. [${resultado.drogas}]`
      })
    }
    temp.push(internacao)
  })


  const returnValue = temp.map(({
    Unidade,
    Leito,
    Prontuário,
    Internação,
    Códigos,
    Descrições,
    Paciente,
    Data,
    Especialidade,
    atendimento,
    seq,
    material,
    germe,
    dh_liberacao,
    drogas
  }) => ({
    Unidade,
    Leito,
    Prontuário,
    Internação,
    Códigos,
    Descrições,
    Paciente,
    Data,
    Especialidade,
    atendimento,
    seq,
    material,
    germe,
    dh_liberacao,
    drogas
  })
  )

  return returnValue

}

export default class ccihController {
  static async getResultados(req: Request, res: Response, next) {
    res.send(await ccihProvider.getResultados())
  }

  static async getCenso(req: Request, res: Response, next) {
    res.send(await ccihProvider.getCenso())
  }

  static async getCcih(req: Request, res: Response, next) {
    const censo = await ccihProvider.getCenso()
    const resultados = await ccihProvider.getResultados()
    const resultArray = []

    censo.forEach((internacao: censo) => {
      internacao.resultados = []
      resultados.forEach((resultado) => {
        let internacaoSolicitacoes = []
        if (internacao.seq) {
          internacaoSolicitacoes = internacao.seq?.split(',')
        }
        if (internacaoSolicitacoes.includes(resultado.solicitacao.toString())) {
          console.log(internacaoSolicitacoes)
          internacao.resultados.push(resultado)
        }
      })
      resultArray.push(internacao)
    })

    res.send(jsonToCsv(flattenArray(resultArray)))

  }
}