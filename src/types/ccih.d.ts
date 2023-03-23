type censo = {
  Unidade: string,
  Leito: string,
  Prontuário: number,
  Internação: number,
  Códigos: string,
  Descrições: string,
  Paciente: string,
  Data: string,
  Especialidade: string,
  atendimento: number,
  resultados?: resultados[]
  seq: string
}

type resultados = {
  solicitacao: number,
  material: string,
  germe: string,
  dh_liberacao: string,
  drogas: string
}

export { censo, resultados }