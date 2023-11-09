(
  SELECT
    --CASE
    --    WHEN servidores_informacoes_cbo2.valor is NULL THEN servidores_informacoes_cbo.valor
    --    ELSE servidores_informacoes_cbo2.valor
    --END as CBO,
    servidores_informacoes_cbo.valor as CBO,
    date_part('year', age(pacientes.dt_nascimento)) as idade,
    count(*) as quantidade,
    -- Regras de Negócio de Consultas:
    -- Caso o profissional seja médico clínico ou professor, aplicar procedimento 03.01.01.007-2
    -- Para os demais, aplicar procedimento 03.01.01.004-8
    CASE
      WHEN servidores_informacoes_cbo.valor like '2231%' THEN 0301010072
      WHEN servidores_informacoes_cbo.valor like '2251%' THEN 0301010072
      WHEN servidores_informacoes_cbo.valor like '2252%' THEN 0301010072
      WHEN servidores_informacoes_cbo.valor like '2253%' THEN 0301010072
      ELSE 0301010048
    END as procedimento_sus,
    'CONSULTAS' as tipo_registro
  from
    agh.aac_consultas as consultas -- Informações da Grade
    LEFT JOIN agh.aac_grade_agendamen_consultas as grades ON grades.seq = consultas.grd_seq -- Pega informações do retorno, pra saber status da consulta
    LEFT JOIN agh.aac_retornos ret ON ret.seq = consultas.ret_seq -- Informações do Profissional (Dados de Servidor)
    LEFT JOIN agh.rap_servidores as servidores on servidores.matricula = (
      CASE
        WHEN consultas.ser_matricula_atendido IS NOT NULL THEN consultas.ser_matricula_atendido
        WHEN consultas.ser_matricula_alterado IS NOT NULL THEN consultas.ser_matricula_alterado
        WHEN consultas.ser_matricula_consultado IS NOT NULL THEN consultas.ser_matricula_consultado
        WHEN consultas.ser_matricula IS NOT NULL THEN consultas.ser_matricula
        ELSE NULL
      END
    )
    AND servidores.vin_codigo = (
      CASE
        WHEN consultas.ser_matricula_atendido IS NOT NULL THEN consultas.ser_vin_codigo_atendido
        WHEN consultas.ser_matricula_alterado IS NOT NULL THEN consultas.ser_vin_codigo_alterado
        WHEN consultas.ser_matricula_consultado IS NOT NULL THEN consultas.ser_vin_codigo_consultado
        WHEN consultas.ser_matricula IS NOT NULL THEN consultas.ser_vin_codigo
        ELSE NULL
      END
    ) -- Informações do Profissional (Dados Pessoais)
    LEFT JOIN agh.rap_pessoas_fisicas as pessoas on servidores.pes_codigo = pessoas.codigo -- Pega o CNS do Profissional
    LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cns on (
      servidores_informacoes_cns.pes_codigo = pessoas.codigo
      AND servidores_informacoes_cns.tii_seq = 7
    ) -- Pega o CBO PRIMARIO do Profissional
    LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo on (
      servidores_informacoes_cbo.pes_codigo = pessoas.codigo
      AND servidores_informacoes_cbo.tii_seq = 2
    ) -- Pega o CBO SECUNDARIO do Profissional
    LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo2 on (
      servidores_informacoes_cbo2.pes_codigo = pessoas.codigo
      AND servidores_informacoes_cbo2.tii_seq = 3
    ) -- Pega o CBO TERCIARIO do Profissional
    LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo3 on (
      servidores_informacoes_cbo3.pes_codigo = pessoas.codigo
      AND servidores_informacoes_cbo3.tii_seq = 4
    )
    LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = consultas.pac_codigo
  where
    (
      dt_consulta between '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
    )
    and ret.descricao <> 'PACIENTE AGENDADO'
    and ret.descricao <> 'AGUARDANDO ATENDIMENTO'
    and ret.descricao <> 'PACIENTE FALTOU'
    and ret.descricao <> 'PROFISSIONAL FALTOU'
    and ret.descricao <> 'EM ATENDIMENTO'
    and ret.descricao <> 'PACIENTE DESISTIU CONS'
    and consultas.pac_codigo <> 1000001
    and servidores_informacoes_cbo.valor is not null
    and consultas.grd_seq NOT IN (582, 579, 1488, 1782, 1972, 1970, 1974, 1968, 1976, 1958, 1977, 1980, 1978, 1982, 1983, 2034, 1994, 1988, 2016, 1992, 2036, 1998, 2000, 2002, 2006, 2005, 1996, 2004, 2014, 2030, 2032, 2038, 2040, 2039, 2037)
  group by
    1,
    2,
    4
)
UNION
(
  SELECT
    cbos.codigo as cbo,
    date_part('year', age(pacientes.dt_nascimento)) as idade,
    SUM(procedimentos.quantidade) as quantidade,
    faturamento_procedimentos.cod_tabela as procedimento_sus,
    'PROCEDIMENTOS' as tipo_registro
  FROM
    agh.mam_proc_realizados as procedimentos
    LEFT OUTER JOIN agh.fat_conv_grupo_itens_proced as faturamento_grupos on faturamento_grupos.phi_seq = procedimentos.phi_seq
    LEFT OUTER JOIN agh.fat_itens_proced_hospitalar as faturamento_procedimentos on faturamento_procedimentos.pho_seq = faturamento_grupos.iph_pho_seq
    and faturamento_procedimentos.seq = faturamento_grupos.iph_seq
    LEFT OUTER JOIN agh.fat_procedimentos_registro as faturamento_registros on faturamento_registros.cod_procedimento = faturamento_procedimentos.cod_tabela
    LEFT OUTER JOIN agh.fat_cbos as cbos on cbos.seq = procedimentos.cbo
    LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = procedimentos.pac_codigo
  WHERE
    procedimentos.dthr_valida BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
    AND procedimentos.cbo IS NOT NULL
    AND procedimentos.phi_seq IS NOT NULL
    AND faturamento_registros.cod_registro = '02'
    AND procedimentos.pac_codigo <> 1000001
    AND cbos.codigo IS NOT NULL
  group by
    1,
    2,
    4
)
UNION
-- Exames ↓
(
with profissionais_liberacao as (
	SELECT distinct on (cse_t.solicitacao,cse_t.situacao)
		cse_t.solicitacao,	
		cse_t.situacao,	
		cast( SUBSTRING(cse_t.profissional_liberacao, 4, 7) as integer)  as matricula,
		cast( SUBSTRING(cse_t.profissional_liberacao, 1, 3) as integer) as vinculo
	FROM agh.lws_com_solicitacao_exames  cse_t 	
	WHERE 	cse_t.situacao = 'L'   
	AND	data_hora_liberacao BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
	AND	cse_t.profissional_liberacao != 'admin'
	ORDER BY 1,2,3,4,id desc
),
cbo_temp as (
	SELECT DISTINCT on (cbo.pes_codigo)
		cbo.pes_codigo
		,cbo.valor AS cbo_principal
	FROM vw_informacoes_complementares cbo 
	WHERE cbo.descricao::text = 'CBO PRINCIPAL'::text
)

 

SELECT 
--       exames.num_solicitacao,
--       exames.seqp item_solicitacao,
--       exames.cbo_principal AS cbo_view,
       CASE WHEN cbo_lib_c.cbo_principal is not null then cbo_lib_c.cbo_principal ELSE cbos_result.cbo_principal END AS cbo,
--       cbos_result.cbo_principal as cbo_lib,
--       pf_result.nome as nome_lib,
--       cbo_lib_c.cbo_principal as cbo_lib_c,
--       pf_lib_c.nome as nome_lib_c,
       pacientes.idade as idade,
       count(*) as quantidade,
       procedimentosus.cod_tabela as procedimento_sus,
       'EXAMES' as tipo_registro
  FROM PUBLIC.VW_EXAMES AS 				exames
  LEFT JOIN PUBLIC.VW_DADOS_PACIENTES AS 		pacientes	ON pacientes.PAC_CODIGO = exames.PAC_CODIGO
  LEFT JOIN agh.fat_proced_hosp_internos AS 		procedimentos	ON exames.ufe_ema_man_seq = procedimentos.ema_man_seq AND exames.sigla_exame = procedimentos.ema_exa_sigla
  LEFT JOIN public.vw_fat_associacao_procedimentos as 	procedimentosus	ON procedimentosus.phi_seq = procedimentos.seq
			AND procedimentosus.cpg_cph_csp_seq = (select max(cpg_cph_csp_seq) from public.vw_fat_associacao_procedimentos)
			AND exames.sigla_exame = procedimentosus.exame_sigla
  LEFT JOIN agh.agh_atendimentos as 			atendimentos	ON atendimentos.seq = exames.atd_seq
  LEFT JOIN agh.rap_servidores srv_result ON srv_result.matricula = exames.profissional_liberacao AND srv_result.vin_codigo = exames.vinc_liberacao
  LEFT JOIN agh.rap_pessoas_fisicas pf_result ON pf_result.codigo = srv_result.pes_codigo
  LEFT JOIN cbo_temp cbos_result ON cbos_result.pes_codigo = srv_result.pes_codigo
  LEFT JOIN profissionais_liberacao prof_lib_c on prof_lib_c.solicitacao = concat(lpad(exames.num_solicitacao::varchar, 8, '0'), lpad(exames.seqp::varchar, 3, '0'))
  LEFT JOIN agh.rap_servidores srv_lib_c ON srv_lib_c.matricula = prof_lib_c.matricula AND srv_lib_c.vin_codigo = prof_lib_c.vinculo
  LEFT JOIN agh.rap_pessoas_fisicas pf_lib_c ON pf_lib_c.codigo = srv_lib_c.pes_codigo
  LEFT JOIN cbo_temp cbo_lib_c ON cbo_lib_c.pes_codigo = srv_lib_c.pes_codigo
  WHERE exames.dthr_liberada between '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
   AND exames.SIT_CODIGO = 'LI' -- LIBERADO
   AND exames.PRONTUARIO <> '10000016'
   AND exames.PRONTUARIO <> '20618740'
   AND (
    atendimentos.origem = 'A'
    OR
    exames.unid_func_executora like 'UAP:%'
   )
  GROUP BY 1, 2, 4, 5
)
order by
  1 asc,
  2 asc,
  3 asc,
  5 asc