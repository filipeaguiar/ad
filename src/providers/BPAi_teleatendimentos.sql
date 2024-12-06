SELECT 
to_char(atendimentos.dt_consulta, 'YYYYMMDD') AS DATA_PROCEDIMENTO,
atendimentos.numero AS NUM_CONSULTA,
atendimentos.pac_codigo,
servidores_dados.cartao_sus_cns AS CNS,
servidores_pessoas.nome AS PROFISSIONAL_NOME,
servidores_dados.cbo_principal AS CBO,
pacientes.nro_cartao_saude AS PACIENTE_CARTAO_SUS,
pacientes.nome AS PACIENTE_NOME,
LEFT(pacientes.sexo, 1) AS PACIENTE_SEXO_BIOLOGICO,
to_char(pacientes.dt_nascimento, 'YYYYMMDD') AS PACIENTE_DATA_NASCIMENTO,
pacientes.nac_codigo AS PACIENTE_NACIONALIDADE,
substring(pacientes_dados.cidade_codigo_ibge::text, 1, 6) as CIDADE,
CASE
  WHEN PACIENTES.COR = 'B' THEN '01'
  WHEN PACIENTES.COR = 'P' THEN '02'
  WHEN PACIENTES.COR = 'M' THEN '03'
  WHEN PACIENTES.COR = 'A' THEN '04'
  WHEN PACIENTES.COR = 'I' THEN '05'
  ELSE '99'
END AS PACIENTE_COR,
pacientes_dados.cep AS CEP,
pacientes_dados.bcl_clo_lgr_codigo AS COD_LOGRADOURO,
'' AS CID, -- Substituir pelo CID do procedimento
1 AS PROCEDIMENTO_QUANTIDADE,
CASE
      WHEN servidores_dados.cbo_principal like '2231%' THEN 0301010307
      WHEN servidores_dados.cbo_principal like '2251%' THEN 0301010307
      WHEN servidores_dados.cbo_principal like '2252%' THEN 0301010307
      WHEN servidores_dados.cbo_principal like '2253%' THEN 0301010307
      ELSE 0301010315
    END as procedimento_sus, -- Substituir pelo CASE que informará o Procedimento SUS
pacientes_dados.uf AS UF,
pacientes_dados.logradouro AS LOGRADOURO,
pacientes_dados.nro_logradouro AS NRO,
pacientes_dados.compl_logradouro AS COMPLEMENTO,
pacientes_dados.bairro AS BAIRRO,
'TELEATENDIMENTO' AS TIPO_REGISTRO



FROM agh.aac_consultas AS atendimentos

LEFT OUTER JOIN agh.aac_grade_agendamen_consultas AS grades
  ON grades.seq = atendimentos.grd_seq

LEFT OUTER JOIN public.vw_paciente AS pacientes
  ON atendimentos.pac_codigo = pacientes.codigo

LEFT OUTER JOIN public.vw_dados_pacientes AS pacientes_dados
  ON atendimentos.pac_codigo = pacientes_dados.pac_codigo

LEFT OUTER JOIN agh.rap_servidores AS servidores
  ON grades.pre_ser_matricula = servidores.matricula
  AND grades.pre_ser_vin_codigo = servidores.vin_codigo

LEFT OUTER JOIN agh.rap_pessoas_fisicas AS servidores_pessoas
  ON servidores.pes_codigo = servidores_pessoas.codigo

LEFT OUTER JOIN public.vw_cbo_cns_pivot servidores_dados
  ON servidores.pes_codigo = servidores_dados.pes_codigo

WHERE 
  atendimentos.numero IS NOT NULL
  AND atendimentos.ret_seq = 10
  AND grades.esp_seq IN (582, 579, 1488, 1782, 1972, 1970, 1974, 1968, 1976, 1958, 1977, 1980, 1978, 1982, 1983, 2034, 1994, 1988, 2016, 1992, 2036, 1998, 2000, 2002, 2006, 2005, 1996, 2004, 2014, 2030, 2032, 2038, 2040, 2039, 2037)
  AND atendimentos.pac_codigo != 1000001
  AND atendimentos.dt_consulta BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999'

ORDER BY dthr_inicio desc
