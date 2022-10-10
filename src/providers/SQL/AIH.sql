SELECT
internacoes.seq,
'' AS nro_aih,
'01' AS tipo_aih,
'202209' AS apresentacao_aih, -- Inserir variável com a data
pacientes.prontuario AS paciente_prontuario,
to_char(internacoes.dthr_internacao, 'YYYYMMDD') AS data_internacao,
to_char(internacoes.dthr_alta_medica, 'YYYYMMDD') AS data_saida,
'E260000001' AS orgao_emissor,
pacientes.nro_cartao_saude AS paciente_cartao_sus,
dados_paciente.nome AS paciente_nome,
to_char(dados_paciente.dt_nascimento, 'YYYYMMDD') AS paciente_nascimento,
substring(dados_paciente.sexo, 1, 1) AS paciente_sexo,
dados_paciente.nome_mae AS paciente_nome_mae,
CASE
  WHEN dados_paciente.idade < 18 THEN dados_paciente.nome_mae
  ELSE dados_paciente.nome
END AS paciente_nome_responsavel,
--dados_paciente.nome_mae AS paciente_nome_responsavel,
dados_paciente.tipo_logradouro AS paciente_tipo_logradouro,
dados_paciente.logradouro AS paciente_logradouro,
dados_paciente.nro_logradouro AS paciente_numero_logradouro,
dados_paciente.compl_logradouro AS paciente_complemento_logradouro,
dados_paciente.bairro AS paciente_bairro,
dados_paciente.cep AS paciente_cep,
dados_paciente.ddd_fone_residencial AS paciente_fone_ddd,
dados_paciente.fone_residencial AS paciente_fone,
dados_paciente.nac_codigo AS paciente_nacionalidade,
dados_paciente.cidade_codigo_ibge AS paciente_cidade,
dados_paciente.uf AS paciente_uf,
dados_paciente.cep AS paciente_cep,
dados_paciente.grau_instrucao AS paciente_grau_instrucao,
CASE
  WHEN dados_paciente.cor = 'B' THEN '01'
  WHEN dados_paciente.cor = 'P' THEN '02'
  WHEN dados_paciente.cor = 'M' THEN '03'
  WHEN dados_paciente.cor = 'A' THEN '04'
  WHEN dados_paciente.cor = 'I' THEN '05'
  ELSE '99'
END AS paciente_cor,
dados_paciente.etnia AS paciente_etnia,
'4' AS paciente_documento_tipo,
dados_paciente.cpf AS paciente_documento_numero,
procedimentos.cod_tabela AS procedimento_solicitado,
'2' AS procedimento_mudanca,
'02' AS procedimento_modalidade, -- 02 Hospitalar, 03 Hosp Dia, 04 At. Domiciliar
CASE
  WHEN procedimentos.cod_tabela::text LIKE '4%' THEN '01'
  WHEN 
    (procedimentos.cod_tabela::text LIKE '30310%' OR procedimentos.cod_tabela::text LIKE '411%') 
      AND 
    (cids.codigo LIKE 'O%' OR cids.codigo LIKE 'Z30.2') 
  THEN '02'
  WHEN procedimentos.cod_tabela::text LIKE '3%' THEN '03'
  WHEN (procedimentos.cod_tabela::text LIKE '30117%' OR cids.codigo LIKE 'F%') THEN '05'
  WHEN procedimentos.cod_tabela::text LIKE '303010215%' THEN '06'
  WHEN (procedimentos.cod_tabela::text LIKE '30316%' AND dados_paciente.idade < 18) THEN '07'
  ELSE '00'
END AS procedimento_tipo_leito,
replace(cids.codigo, '.', '') AS procedimento_cid,
replace(internacoes.tam_codigo, '.', '') AS procedimento_motivo_encerramento,
pessoas.pes_cpf AS procedimento_documento_solicitante,
pessoas.pes_cpf AS procedimento_documento_responsavel,
pessoas.pes_cpf AS procedimento_documento_autorizador,
'' AS aih_anterior,
'' AS aih_posterior

FROM agh.ain_internacoes AS internacoes

--- DADOS DO ATENDIMENTO ---
LEFT OUTER JOIN agh.agh_atendimentos AS atendimentos
ON atendimentos.int_seq = internacoes.seq

LEFT OUTER JOIN agh.ain_cids_internacao AS cids_internacao
ON cids_internacao.int_seq = internacoes.seq
AND cids_internacao.ind_prioridade_cid = 'P'

LEFT OUTER JOIN agh.agh_cids as cids
ON cids_internacao.cid_seq = cids.seq
-------------------------

--- DADOS DO SERVIDOR ---
LEFT OUTER JOIN agh.v_rap_servidores AS servidores
ON servidores.matricula = internacoes.ser_matricula_professor
AND servidores.vin_codigo = internacoes.ser_vin_codigo_professor

LEFT OUTER JOIN agh.v_rap_pessoa_fisica AS pessoas
ON pessoas.pes_codigo = servidores.pes_codigo
-------------------------

--- DADOS DO PACIENTE ---
LEFT OUTER JOIN public.vw_dados_paciente AS pacientes
ON pacientes.pac_codigo = internacoes.pac_codigo

LEFT OUTER JOIN public.vw_dados_pacientes AS dados_paciente
ON dados_paciente.pac_codigo = pacientes.pac_codigo
-------------------------

--- DADOS FATURAMENTO ---
LEFT OUTER JOIN agh.fat_contas_internacao AS contas
ON contas.int_seq = internacoes.seq

LEFT OUTER JOIN agh.fat_itens_proced_hospitalar AS procedimentos
ON internacoes.iph_pho_seq = procedimentos.pho_seq
AND internacoes.iph_seq = procedimentos.seq
-------------------------

WHERE internacoes.dthr_alta_medica BETWEEN '2022-09-16 00:00:00' AND '2022-09-30 23:59:59.999999'
AND pacientes.prontuario <> '10000016'
-- and internacoes.seq = 148104
-- and internacoes.seq = 148104