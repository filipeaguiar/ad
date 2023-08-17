SELECT 
       exames.sigla_exame,
       exames.nome_exame,
       count(1)
  FROM PUBLIC.VW_EXAMES AS exames
  LEFT JOIN PUBLIC.VW_DADOS_PACIENTE AS pacientes
    ON pacientes.PAC_CODIGO = exames.PAC_CODIGO
  LEFT OUTER JOIN agh.fat_proced_hosp_internos AS procedimentos 
    ON exames.ufe_ema_man_seq = procedimentos.ema_man_seq
    AND exames.sigla_exame = procedimentos.ema_exa_sigla
    LEFT OUTER JOIN public.vw_fat_associacao_procedimentos as procedimentosus
    ON procedimentosus.phi_seq = procedimentos.seq
    AND procedimentosus.cpg_cph_csp_seq = (select max(cpg_cph_csp_seq) from public.vw_fat_associacao_procedimentos)
    AND exames.sigla_exame = procedimentosus.exame_sigla
  LEFT OUTER JOIN agh.agh_atendimentos as atendimentos ON atendimentos.seq = exames.atd_seq
 WHERE exames.dthr_liberada BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999' -- PERIODO
   AND exames.SIT_CODIGO = 'LI' -- LIBERADO
   AND exames.PRONTUARIO <> '10000016'
   AND exames.PRONTUARIO <> '20618740'
   -- AND atendimentos.origem = 'A'
   AND procedimentosus.cod_tabela IS NULL
 GROUP BY 1,2 
 ORDER BY 3 DESC