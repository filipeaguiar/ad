import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

interface Prontuario {
  id: string,
  numero: string,
  paciente: string,
  idade: string,
  arquivo: string
}

export default class ProntuarioProvider {
  static async getProntuario(prontuario: string): Promise<Prontuario> {
    const secret = process.env.SECRET
    const token = jwt.sign( { "numero": prontuario}, secret, { algorithm: 'HS256'})
    const api = process.env.API_URL
    return {
      id: prontuario,
      numero: prontuario,
      paciente: "Não suportado pela API",
      idade: "Não suportado pela API",
      arquivo: `${api}${token}`
    }
  }
}