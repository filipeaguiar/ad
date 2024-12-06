with profissionais_liberacao as (
    select distinct on (cse_t.solicitacao,cse_t.situacao)
	cse_t.solicitacao,	
	--SUBSTRING(cse_t.solicitacao, 1, 8) as soe,
	--SUBSTRING(cse_t.solicitacao, 9, 3) as seqp,
	--cse_t.id_amostra,
--	cse_t.id,
	cse_t.situacao,	
	cast( cast(SUBSTRING(cse_t.profissional_liberacao, 4, 7) as text) as integer)  as matricula,
	cast( cast(SUBSTRING(cse_t.profissional_liberacao, 1, 3) as text) as integer) as vinculo
	--MAX(id) as pk_id
    from agh.lws_com_solicitacao_exames  cse_t 	
	--inner join (
	--	SELECT solicitacao, MAX(id) as id FROM agh.lws_com_solicitacao_exames where solicitacao like '00155600%'  GROUP BY solicitacao
	--) AS maximo on maximo.solicitacao = cse_t.solicitacao and  maximo.id = cse_t.id
    --inner join  agh.lws_com_solicitacao_exames cse_t on uf.seq = l.unf_seq
    where  cse_t.situacao = 'L'   
	  and  cse_t.profissional_liberacao != 'admin'
	--and cse_t.solicitacao like '%185492%'	
	--GROUP BY 1,2,3,4,5
	order by 1,2,3,4,id desc
),
 cbocns_temp as (
SELECT DISTINCT on (tmp.pes_codigo, cns.valor)
	tmp.pes_codigo,
    cbo.valor AS cbo_principal,
    cns.valor AS cartao_sus_cns
   FROM ( SELECT DISTINCT vw_informacoes_complementares.pes_codigo
           FROM vw_informacoes_complementares) tmp
     JOIN vw_informacoes_complementares cbo ON tmp.pes_codigo = cbo.pes_codigo AND cbo.descricao::text = 'CBO PRINCIPAL'::text
     JOIN vw_informacoes_complementares cns ON tmp.pes_codigo = cns.pes_codigo AND cns.descricao::text = 'CARTAO SUS (CNS)'::text
)

SELECT 
       to_char(exames.dthr_liberada,'YYYYMMDD') AS DATA_PROCEDIMENTO,
       exames.PAC_CODIGO,
       exames.num_solicitacao as num_consulta,
       --exames.CARTAO_SUS_CNS as cns,
	   case 
        when (pf_result.nome is null or pf_result.nome != 'AGHU') then
            cbocns_result.CARTAO_SUS_CNS
        else
            cbocns_inter.CARTAO_SUS_CNS
        end cns,
       --exames.profissional_solicitante as PROFISSIONAL_NOME,	  
	   case 
        when (pf_result.nome is null or pf_result.nome != 'AGHU') then
            --INITCAP(pf_result.nome)
			pf_result.nome
        else
            pf_inter.nome
        end PROFISSIONAL_NOME,
       --exames.cbo_principal AS CBO,
	   case 
        when (pf_result.nome is null or pf_result.nome != 'AGHU') then
            cbocns_result.cbo_principal
        else
            cbocns_inter.cbo_principal
        end CBO,
       exames.nro_cartao_saude AS PACIENTE_CARTAO_SUS,
       exames.nome_paciente AS PACIENTE_NOME,
       SUBSTRING(pacientes.sexo, 1, 1) as PACIENTE_SEXO_BIOLOGICO,
       CONCAT(SUBSTRING(exames.dt_nascimento, 7, 4),SUBSTRING(exames.dt_nascimento, 4, 2),SUBSTRING(exames.dt_nascimento, 1, 2)) AS PACIENTE_DATA_NASCIMENTO,
       pacientes.nac_codigo as PACIENTE_NACIONALIDADE,
       substring(pacientes.cidade_codigo_ibge::text, 1, 6) as CIDADE,
       CASE
        WHEN pacientes.cor = 'B' THEN '01'
        WHEN pacientes.cor = 'P' THEN '02'
        WHEN pacientes.cor = 'M' THEN '03'
        WHEN pacientes.cor = 'A' THEN '04'
        WHEN pacientes.cor = 'I' THEN '05'
        ELSE '99'
       END AS PACIENTE_COR,
       pacientes.cep as CEP,
       pacientes.tlg_codigo as COD_LOGRADOURO,
       translate(exames.codigo_cid[1], '.', '') as CID,
       1 as PROCEDIMENTO_QUANTIDADE,
       procedimentosus.cod_tabela as PROCEDIMENTO_SUS,
       pacientes.uf as UF,
       pacientes.logradouro as LOGRADOURO,
       pacientes.nro_logradouro as NRO,
       pacientes.compl_logradouro as COMPLEMENTO,
       pacientes.bairro as BAIRRO,
       'EXAMES' as TIPO_REGISTRO
   
  FROM PUBLIC.VW_EXAMES AS exames
  
  LEFT JOIN PUBLIC.VW_DADOS_PACIENTES AS pacientes
    ON pacientes.PAC_CODIGO = exames.PAC_CODIGO
  
  LEFT OUTER JOIN agh.fat_proced_hosp_internos AS procedimentos 
    ON exames.ufe_ema_man_seq = procedimentos.ema_man_seq
    AND exames.sigla_exame = procedimentos.ema_exa_sigla
  
  LEFT OUTER JOIN public.vw_fat_associacao_procedimentos as procedimentosus
    ON procedimentosus.phi_seq = procedimentos.seq
    AND procedimentosus.cpg_cph_csp_seq = (select max(cpg_cph_csp_seq) from public.vw_fat_associacao_procedimentos)
    AND exames.sigla_exame = procedimentosus.exame_sigla
  
  LEFT OUTER JOIN agh.agh_atendimentos as atendimentos ON atendimentos.seq = exames.atd_seq
  
  inner join agh.ael_extrato_item_solics eis on eis.sit_codigo = 'LI' and exames.soe_seq = eis.ise_soe_seq and exames.seqp = eis.ise_seqp 
	     AND eis.seqp = (select max(eis_t.seqp) as seqp from agh.ael_extrato_item_solics eis_t 
                         where eis_t.sit_codigo = 'LI' and eis_t.ise_soe_seq = exames.soe_seq and eis_t.ise_seqp = exames.seqp)	  
						 
  left join profissionais_liberacao cse on cse.solicitacao = concat(lpad(eis.ise_soe_seq::varchar, 8, '0'), lpad(eis.ise_seqp::varchar, 3, '0'))
  
  LEFT JOIN agh.rap_servidores srv_inter ON srv_inter.matricula = cse.matricula AND srv_inter.vin_codigo = cse.vinculo
  LEFT JOIN agh.rap_pessoas_fisicas pf_inter ON pf_inter.codigo = srv_inter.pes_codigo
  LEFT JOIN vw_qualificacoes_pivot qual_inter ON qual_inter.pes_codigo = pf_inter.codigo
  LEFT JOIN cbocns_temp cbocns_inter ON cbocns_inter.pes_codigo = srv_inter.pes_codigo
  
  LEFT JOIN agh.rap_servidores srv_result ON srv_result.matricula = eis.ser_matricula_eh_responsabilid AND srv_result.vin_codigo = eis.ser_vin_codigo_eh_responsabili
  LEFT JOIN agh.rap_pessoas_fisicas pf_result ON pf_result.codigo = srv_result.pes_codigo
  LEFT JOIN vw_qualificacoes_pivot qual_result ON qual_result.pes_codigo = pf_result.codigo
  LEFT JOIN cbocns_temp cbocns_result ON cbocns_result.pes_codigo = srv_result.pes_codigo
 
  WHERE exames.dthr_liberada BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999'  -- PERIODO
   AND exames.SIT_CODIGO = 'LI' -- LIBERADO
   AND exames.PRONTUARIO <> '10000016'
   AND exames.PRONTUARIO <> '20618740'
   --and (cbocns_inter.cbo_principal is null and  cbocns_result.cbo_principal is null)
   --and exames.num_solicitacao = '185492' 
   AND (
    atendimentos.origem = 'A'
    OR
    exames.unid_func_executora like 'UAP:%'
   )
  --AND atendimentos.origem = 'A'
  --AND procedimentosus.cod_tabela NOT IN (#procedimentosBPAc)
  --AND procedimentosus.cod_tabela NOT IN (#procedimentosPAB)
 ORDER BY exames.NOME_PACIENTE,
          exames.SIGLA_EXAME,
          exames.TIPO_COLETA,
          exames.SIT_ITEM_SOLICITACOES

