SELECT 
atendimentos.int_seq, 
'' AS nro_aih,
exames.cartao_sus_cns AS procedimento_documento_solicitante,
exames.cbo_principal AS solicitante_cbo,
procedimentosus.cod_tabela as procedimento_sus,
count(*) AS quantidade

FROM public.vw_exames AS exames

--- Dados dos atendimentos
LEFT OUTER JOIN agh.agh_atendimentos AS atendimentos
ON exames.atd_seq = atendimentos.seq
-------------------------

--- Dados da internação/atendimento
LEFT OUTER JOIN agh.ain_internacoes AS internacoes
ON atendimentos.int_seq = internacoes.seq

--- DADOS FATURAMENTO ---
LEFT OUTER JOIN agh.fat_proced_hosp_internos AS procedimentos 
    ON exames.ufe_ema_man_seq = procedimentos.ema_man_seq
    AND exames.sigla_exame = procedimentos.ema_exa_sigla
LEFT OUTER JOIN public.vw_fat_associacao_procedimentos as procedimentosus
ON procedimentosus.phi_seq = procedimentos.seq
AND procedimentosus.cpg_cph_csp_seq = (select max(cpg_cph_csp_seq) from public.vw_fat_associacao_procedimentos)
AND exames.sigla_exame = procedimentosus.exame_sigla
-------------------------

WHERE atendimentos.seq in (
SELECT 
atendimentos.seq
FROM agh.ain_internacoes AS internacoes
LEFT OUTER JOIN agh.agh_atendimentos AS atendimentos
ON atendimentos.int_seq = internacoes.seq
WHERE internacoes.dthr_alta_medica BETWEEN '#startDate' AND '#endDate 23:59:59.999999'
)

GROUP BY 1,2,3,4,5

ORDER BY 1