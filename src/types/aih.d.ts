type AIHExame = {
  int_seq: string,
  nro_aih: string,
  profissional_documento: string,
  profissional_cbo: string,
  procedimento_sus: string,
  quantidade: string
}

type AIHInternacao = {
  seq: number,
  nro_aih: string,
  tipo_aih: string,
  apresentacao_aih: string,
  paciente_prontuario: number,
  unidade_funcional: string,
  especialidade_sigla: string,
  data_internacao: string,
  data_saida: string,
  orgao_emissor: string,
  paciente_cartao_sus: string,
  paciente_nome: string,
  paciente_nascimento: string,
  paciente_sexo: string,
  paciente_nome_mae: string,
  paciente_nome_responsavel: string,
  paciente_tipo_logradouro: string,
  paciente_logradouro: string,
  paciente_numero_logradouro: number,
  paciente_complemento_logradouro: string,
  paciente_bairro: string,
  paciente_cep: number,
  paciente_fone_ddd: any,
  paciente_fone: any,
  paciente_nacionalidade: number,
  paciente_cidade: number,
  paciente_uf: string,
  paciente_grau_instrucao: number,
  paciente_cor: string,
  paciente_etnia: any,
  paciente_documento_tipo: string,
  paciente_documento_numero: string,
  procedimento_solicitado: string,
  procedimento_mudanca: string,
  procedimento_modalidade: string,
  procedimento_tipo_leito: string,
  procedimento_cid: string,
  procedimento_cid_secundario: string,
  procedimento_motivo_encerramento: string,
  procedimento_documento_solicitante: string,
  procedimento_documento_responsavel: string,
  procedimento_documento_diretor_clinico: string,
  procedimento_documento_autorizador: string,
  aih_anterior: string,
  aih_posterior: string
}

export { AIHExame, AIHInternacao }