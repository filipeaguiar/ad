import fsp from 'fs/promises'
import path from 'path'

const procedimentosBPA = async (filename: string) => {
  const filePath = path.join(__dirname, `../static/sigtap/${filename}`)
  const fileBuffer = await fsp.readFile(filePath, 'latin1')
  const fileContent = fileBuffer.toString()
  let registros = []
  fileContent.split('\r\n').forEach(r => {
    registros.push({
      procedimento: r.substring(0, 10),
      registro: r.substring(10, 12)
    })
  })
  const registrosBPA = registros.filter(r => r.registro === '01')
  const bpac = registrosBPA.map(r => `'${r.procedimento}'`)
  return bpac.join(', ')

}

export default class SIGTAPHelper {
  static procedimentosBPA = procedimentosBPA
}
