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
