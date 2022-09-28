SELECT
  '' AS nro_aih,
  '01' AS tipo_aih,
  '202209' AS apresentacao_aih,
  -- Inserir variável com a data
  pacientes.prontuario AS paciente_prontuario,
  to_char(internacoes.dthr_internacao, 'YYYYMMDD') AS data_internacao,
  to_char(internacoes.dthr_alta_medica, 'YYYYMMDD') AS data_saida,
  'E260000001' AS orgao_emissor,
  pacientes.nro_cartao_saude AS paciente_cartao_sus,
  pessoas.pes_nome AS paciente_nome,
  to_char(dados_paciente.dt_nascimento, 'YYYYMMDD') AS paciente_nascimento,
  substring(dados_paciente.sexo, 1, 1) AS paciente_sexo,
  dados_paciente.nome_mae AS paciente_nome_mae,
  dados_paciente.nome_mae AS paciente_nome_responsavel,
  dados_paciente.tipo_logradouro AS paciente_tipo_logradouro,
  dados_paciente.logradouro AS paciente_logradouro,
  dados_paciente.nro_logradouro AS paciente_numero_logradouro,
  dados_paciente.compl_logradouro AS paciente_complemento_logradouro,
  dados_paciente.bairro AS paciente_bairro,
  dados_paciente.cep AS paciente_cep,
  dados_paciente.ddd_fone_residencial AS paciente_fone_ddd,
  dados_paciente.fone_residencial AS paciente_fone,
  dados_paciente.nac_codigo AS paciente_nacionalidade,
  dados_paciente.cor AS paciente_cor,
  dados_paciente.etnia AS paciente_etnia,
  '4' AS paciente_documento_tipo,
  dados_paciente.cpf AS paciente_documento_numero,
  procedimentos.cod_tabela AS procedimento_solicitado,
  '2' AS procedimento_mudanca,
  '02' AS procedimento_modalidade,
  -- 02 Hospitalar, 03 Hosp Dia, 04 At. Domiciliar
  '00' AS procedimento_tipo_leito,
  replace(vinternacoes.cid_primario, '.', '') AS procedimento_cid,
  replace(internacoes.tam_codigo, '.', '') AS procedimento_motivo_encerramento,
  pessoas.pes_cpf AS procedimento_documento_solicitante,
  pessoas.pes_cpf AS procedimento_documento_responsavel,
  pessoas.pes_cpf AS procedimento_documento_autorizador,
  '' AS aih_anterior,
  '' AS aih_posterior
FROM
  agh.ain_internacoes AS internacoes --- DADOS DO ATENDIMENTO ---
  LEFT OUTER JOIN agh.agh_atendimentos AS atendimentos ON atendimentos.int_seq = internacoes.seq
  LEFT OUTER JOIN agh.v_ain_internacao AS vinternacoes ON vinternacoes.nro_internacao = internacoes.seq -------------------------
  --- DADOS DO SERVIDOR ---
  LEFT OUTER JOIN agh.v_rap_servidores AS servidores ON servidores.matricula = internacoes.ser_matricula_professor
  AND servidores.vin_codigo = internacoes.ser_vin_codigo_professor
  LEFT OUTER JOIN agh.v_rap_pessoa_fisica AS pessoas ON pessoas.pes_codigo = servidores.pes_codigo -------------------------
  --- DADOS DO PACIENTE ---
  LEFT OUTER JOIN public.vw_dados_paciente AS pacientes ON pacientes.pac_codigo = internacoes.pac_codigo
  LEFT OUTER JOIN public.vw_dados_pacientes AS dados_paciente ON dados_paciente.pac_codigo = pacientes.pac_codigo -------------------------
  --- DADOS FATURAMENTO ---
  LEFT OUTER JOIN agh.fat_contas_internacao AS contas ON contas.int_seq = internacoes.seq
  LEFT OUTER JOIN agh.fat_itens_proced_hospitalar AS procedimentos ON internacoes.iph_pho_seq = procedimentos.pho_seq
  AND internacoes.iph_seq = procedimentos.seq -------------------------
WHERE
  internacoes.dthr_alta_medica BETWEEN '#startDate 00:00:00'
  AND '#endDate 23:59:59.999999'
  AND pacientes.prontuario <> '10000016' -- and internacoes.seq = 148104
  -- and internacoes.seq = 148104
  -- LIMIT 10