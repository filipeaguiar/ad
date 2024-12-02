(SELECT TO_CHAR(PROCEDIMENTOS.DTHR_VALIDA,
         'YYYYMMDD') AS DATA_PROCEDIMENTO,
       PROCEDIMENTOS.CON_NUMERO AS NUM_CONSULTA,
       PROCEDIMENTOS.PAC_CODIGO,
       SERVIDORES_CNS.VALOR AS CNS,
       SERVIDORES_INFO.NOME AS PROFISSIONAL_NOME,
       SERVIDORES_CBO1.VALOR AS CBO,
       PACIENTES.NRO_CARTAO_SAUDE AS PACIENTE_CARTAO_SUS,
       PACIENTES.NOME AS PACIENTE_NOME,
       PACIENTES.SEXO_BIOLOGICO AS PACIENTE_SEXO_BIOLOGICO,
       TO_CHAR(PACIENTES.DT_NASCIMENTO,
         'YYYYMMDD') AS PACIENTE_DATA_NASCIMENTO,
       PACIENTES.NAC_CODIGO AS PACIENTE_NACIONALIDADE,
       CASE
           WHEN CIDADES.COD_IBGE IS NULL THEN CIDADES2.COD_IBGE::text
            ELSE CIDADES.COD_IBGE::text
             END AS CIDADE,
       CASE
           WHEN PACIENTES.COR = 'B' THEN '01'
            WHEN PACIENTES.COR = 'P' THEN '02'
            WHEN PACIENTES.COR = 'M' THEN '03'
            WHEN PACIENTES.COR = 'A' THEN '04'
            WHEN PACIENTES.COR = 'I' THEN '05'
            ELSE '99'
             END AS PACIENTE_COR,
       CASE
           WHEN PACIENTES_ENDERECO.CEP IS NULL THEN PACIENTES_ENDERECO.BCL_CLO_CEP
            ELSE PACIENTES_ENDERECO.CEP
             END AS CEP,
       TIPO_LOGRADOUROS.CODIGO_BASE_SUS AS COD_LOGRADOURO,
       REPLACE(CID.CODIGO,
         '.',
         '') AS CID,
       PROCEDIMENTOS.QUANTIDADE AS PROCEDIMENTO_QUANTIDADE,
       FATURAMENTO_PROCEDIMENTOS.COD_TABELA AS PROCEDIMENTO_SUS,
       CASE
           WHEN CIDADES.UF_SIGLA IS NOT NULL THEN CIDADES.UF_SIGLA
            ELSE CIDADES2.UF_SIGLA
             END AS UF,
       CASE
           WHEN PACIENTES_ENDERECO.LOGRADOURO IS NOT NULL THEN PACIENTES_ENDERECO.LOGRADOURO
            ELSE LOGRADOUROS.NOME
             END AS LOGRADOURO,
       PACIENTES_ENDERECO.NRO_LOGRADOURO AS NRO,
       PACIENTES_ENDERECO.COMPL_LOGRADOURO AS COMPLEMENTO,
       BAIRROS.descricao AS BAIRRO,
       'PROCEDIMENTO' AS TIPO_REGISTRO
  FROM AGH.MAM_PROC_REALIZADOS AS PROCEDIMENTOS
  LEFT OUTER JOIN AGH.FAT_CONV_GRUPO_ITENS_PROCED AS FATURAMENTO_GRUPOS
    ON FATURAMENTO_GRUPOS.PHI_SEQ = PROCEDIMENTOS.PHI_SEQ
  LEFT OUTER JOIN AGH.FAT_ITENS_PROCED_HOSPITALAR AS FATURAMENTO_PROCEDIMENTOS
    ON FATURAMENTO_PROCEDIMENTOS.PHO_SEQ = FATURAMENTO_GRUPOS.IPH_PHO_SEQ
   AND FATURAMENTO_PROCEDIMENTOS.SEQ = FATURAMENTO_GRUPOS.IPH_SEQ
  LEFT OUTER JOIN AGH.FAT_PROCEDIMENTOS_REGISTRO AS FATURAMENTO_REGISTROS
    ON FATURAMENTO_REGISTROS.COD_PROCEDIMENTO = FATURAMENTO_PROCEDIMENTOS.COD_TABELA
  LEFT OUTER JOIN AGH.FAT_CBOS AS CBOS
    ON CBOS.SEQ = PROCEDIMENTOS.CBO
  LEFT OUTER JOIN AGH.AIP_PACIENTES AS PACIENTES
    ON PACIENTES.CODIGO = PROCEDIMENTOS.PAC_CODIGO
  LEFT OUTER JOIN AGH.RAP_SERVIDORES AS SERVIDORES
    ON SERVIDORES.MATRICULA = PROCEDIMENTOS.SER_MATRICULA
    AND SERVIDORES.VIN_CODIGO = PROCEDIMENTOS.SER_VIN_CODIGO
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CNS
    ON SERVIDORES_CNS.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CNS.TII_SEQ = 7
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CBO1
    ON SERVIDORES_CBO1.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CBO1.TII_SEQ = 2
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CBO2
    ON SERVIDORES_CBO2.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CBO2.TII_SEQ = 3
  LEFT OUTER JOIN AGH.RAP_PESSOAS_FISICAS AS SERVIDORES_INFO
    ON SERVIDORES_INFO.CODIGO = SERVIDORES.PES_CODIGO
  LEFT OUTER JOIN AGH.AIP_ENDERECOS_PACIENTES PACIENTES_ENDERECO
    ON PACIENTES.CODIGO = PACIENTES_ENDERECO.PAC_CODIGO
   AND PACIENTES_ENDERECO.TIPO_ENDERECO = 'R'
  LEFT OUTER JOIN AGH.AAC_CONSULTAS AS CONSULTAS
    ON CONSULTAS.NUMERO = PROCEDIMENTOS.CON_NUMERO
  LEFT OUTER JOIN AGH.AIP_CIDADES AS CIDADES
    ON PACIENTES_ENDERECO.CDD_CODIGO = CIDADES.CODIGO
  LEFT OUTER JOIN AGH.AIP_CEP_LOGRADOUROS AS CEP
    ON CEP.CEP = 
      (CASE
        WHEN PACIENTES_ENDERECO.CEP IS NOT NULL THEN PACIENTES_ENDERECO.CEP
        ELSE PACIENTES_ENDERECO.BCL_CLO_CEP
      END)
  LEFT OUTER JOIN AGH.AIP_LOGRADOUROS AS LOGRADOUROS
    ON LOGRADOUROS.CODIGO = CEP.LGR_CODIGO
  LEFT OUTER JOIN AGH.AIP_CIDADES AS CIDADES2
    ON CIDADES2.CODIGO = LOGRADOUROS.CDD_CODIGO
  LEFT OUTER JOIN AGH.AIP_TIPO_LOGRADOUROS AS TIPO_LOGRADOUROS
    ON TIPO_LOGRADOUROS.CODIGO = LOGRADOUROS.TLG_CODIGO
  LEFT OUTER JOIN AGH.AGH_CIDS AS CID
    ON CID.SEQ = PROCEDIMENTOS.CID_SEQ
  LEFT OUTER JOIN AGH.AIP_BAIRROS_CEP_LOGRADOURO as BAIRROS_CEP ON
    (CASE
        WHEN PACIENTES_ENDERECO.CEP IS NOT NULL THEN PACIENTES_ENDERECO.CEP
        ELSE PACIENTES_ENDERECO.BCL_CLO_CEP
    END) = BAIRROS_CEP.clo_cep
  LEFT OUTER JOIN AGH.aip_bairros as BAIRROS ON
    BAIRROS.codigo = BAIRROS_CEP.bai_codigo
 WHERE PROCEDIMENTOS.DTHR_VALIDA BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
   AND CONSULTAS.RET_SEQ = 10
   AND PROCEDIMENTOS.PHI_SEQ IS NOT NULL
   AND FATURAMENTO_REGISTROS.COD_REGISTRO = '02'
   AND CONSULTAS.PAC_CODIGO <> 1000001
   AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA <> '301010072'
   AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA <> '301010048'
   AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA <> '101010028')
UNION
-- Exames ↓
(
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
) 
UNION
-- PDT ↓
(SELECT 
to_char(descricoes.dthr_conclusao, 'YYYYMMDD') AS DATA_PROCEDIMENTO,
atendimentos.seq AS NUM_CONSULTA,
pacientes.pac_codigo,
SERVIDORES_CNS.VALOR AS CNS,
SERVIDORES_INFO.NOME AS PROFISSIONAL_NOME,
SERVIDORES_CBO1.VALOR AS CBO,
pacientes.nro_cartao_saude AS PACIENTE_CARTAO_SUS,
pacientes.nome AS PACIENTE_NOME,
LEFT(pacientes.sexo, 1) AS PACIENTE_SEXO_BIOLOGICO,
TO_CHAR(PACIENTES.DT_NASCIMENTO,'YYYYMMDD') AS PACIENTE_DATA_NASCIMENTO,
pacientes.nac_codigo AS PACIENTE_NACIONALIDADE,
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
'' as CID,
1 as PROCEDIMENTO_QUANTIDADE,
procedimentos_sus.cod_tabela as PROCEDIMENTO_SUS,
pacientes.uf as UF,
pacientes.logradouro as LOGRADOURO,
pacientes.nro_logradouro as NRO,
pacientes.compl_logradouro as COMPLEMENTO,
pacientes.bairro as BAIRRO,
'PDT' as TIPO_REGISTRO

FROM agh.pdt_descricoes AS descricoes

LEFT OUTER JOIN agh.mbc_cirurgias AS cirurgias
ON cirurgias.seq = descricoes.crg_seq

LEFT OUTER JOIN agh.agh_atendimentos AS atendimentos
ON cirurgias.atd_seq = atendimentos.seq

LEFT OUTER JOIN agh.pdt_procs as procedimentos_realizados
ON procedimentos_realizados.ddt_seq = descricoes.seq

LEFT OUTER JOIN agh.pdt_proc_diag_teraps AS procedimentos
ON procedimentos.seq = procedimentos_realizados.dpt_seq

LEFT OUTER JOIN agh.mbc_procedimento_cirurgicos AS procedimentos_cadastros
ON procedimentos_cadastros.seq = procedimentos.pci_seq

LEFT OUTER JOIN agh.fat_proced_hosp_internos AS procedimentos_faturamento
ON procedimentos_faturamento.pci_seq = procedimentos_cadastros.seq

LEFT OUTER JOIN public.vw_fat_associacao_procedimentos AS procedimentos_sus
ON procedimentos_faturamento.seq = procedimentos_sus.phi_seq 
AND cpg_cph_csp_seq = 2

LEFT OUTER JOIN public.vw_dados_pacientes as pacientes
ON cirurgias.pac_codigo = pacientes.pac_codigo

-- Dados profissional
LEFT OUTER JOIN AGH.RAP_SERVIDORES AS SERVIDORES
    ON SERVIDORES.MATRICULA = DESCRICOES.SER_MATRICULA
    AND SERVIDORES.VIN_CODIGO = DESCRICOES.SER_VIN_CODIGO
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CNS
    ON SERVIDORES_CNS.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CNS.TII_SEQ = 7
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CBO1
    ON SERVIDORES_CBO1.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CBO1.TII_SEQ = 2
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CBO2
    ON SERVIDORES_CBO2.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CBO2.TII_SEQ = 3
  LEFT OUTER JOIN AGH.RAP_PESSOAS_FISICAS AS SERVIDORES_INFO
    ON SERVIDORES_INFO.CODIGO = SERVIDORES.PES_CODIGO

WHERE
-- Excluir Miguel (paciente teste)
pacientes.prontuario <> 10000016

-- Período
AND descricoes.dthr_execucao BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999')
UNION
(
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
)
UNION
(
SELECT
  -- Regras de Negócio de Consultas:
  -- Caso o profissional seja médico clínico ou professor, aplicar procedimento 03.01.01.007-2
  -- Para os demais, aplicar procedimento 03.01.01.004-8
  TO_CHAR(PROCEDIMENTOS.dt_consulta,
         'YYYYMMDD') AS DATA_PROCEDIMENTO,
       PROCEDIMENTOS.NUMERO AS NUM_CONSULTA,
       PROCEDIMENTOS.PAC_CODIGO,
      SERVIDORES_CNS.VALOR AS CNS,
       SERVIDORES_INFO.NOME AS PROFISSIONAL_NOME,
       SERVIDORES_CBO1.VALOR AS CBO,
       PACIENTES.NRO_CARTAO_SAUDE AS PACIENTE_CARTAO_SUS,
       PACIENTES.NOME AS PACIENTE_NOME,
       PACIENTES.SEXO_BIOLOGICO AS PACIENTE_SEXO_BIOLOGICO,
       TO_CHAR(PACIENTES.DT_NASCIMENTO,
         'YYYYMMDD') AS PACIENTE_DATA_NASCIMENTO,
       PACIENTES.NAC_CODIGO AS PACIENTE_NACIONALIDADE,
CASE
           WHEN CIDADES.COD_IBGE IS NULL THEN CIDADES2.COD_IBGE::text
            ELSE CIDADES.COD_IBGE::text
             END AS CIDADE,
       CASE
           WHEN PACIENTES.COR = 'B' THEN '01'
            WHEN PACIENTES.COR = 'P' THEN '02'
            WHEN PACIENTES.COR = 'M' THEN '03'
            WHEN PACIENTES.COR = 'A' THEN '04'
            WHEN PACIENTES.COR = 'I' THEN '05'
            ELSE '99'
             END AS PACIENTE_COR,
       CASE
           WHEN PACIENTES_ENDERECO.CEP IS NULL THEN PACIENTES_ENDERECO.BCL_CLO_CEP
            ELSE PACIENTES_ENDERECO.CEP
             END AS CEP,
       TIPO_LOGRADOUROS.CODIGO_BASE_SUS AS COD_LOGRADOURO,
       '' as CID,
       1 AS PROCEDIMENTO_QUANTIDADE,
 CASE
    WHEN SERVIDORES_CBO1.valor like '2231%' THEN 0301010072
    WHEN SERVIDORES_CBO1.valor like '2251%' THEN 0301010072
    WHEN SERVIDORES_CBO1.valor like '2252%' THEN 0301010072
    WHEN SERVIDORES_CBO1.valor like '2253%' THEN 0301010072
    ELSE 0301010048
  END as procedimento_sus,

       CASE
           WHEN CIDADES.UF_SIGLA IS NOT NULL THEN CIDADES.UF_SIGLA
            ELSE CIDADES2.UF_SIGLA
             END AS UF,
       CASE
           WHEN PACIENTES_ENDERECO.LOGRADOURO IS NOT NULL THEN PACIENTES_ENDERECO.LOGRADOURO
            ELSE LOGRADOUROS.NOME
             END AS LOGRADOURO,
       PACIENTES_ENDERECO.NRO_LOGRADOURO AS NRO,
       PACIENTES_ENDERECO.COMPL_LOGRADOURO AS COMPLEMENTO,
       BAIRROS.descricao AS BAIRRO,
       'CONSULTAS' AS TIPO_REGISTRO,*

 --  'CONSULTAS' as tipo_registro
from
agh.aac_consultas as PROCEDIMENTOS -- Informações da Grade
LEFT OUTER JOIN AGH.AIP_PACIENTES AS PACIENTES
    ON PACIENTES.CODIGO = PROCEDIMENTOS.PAC_CODIGO
LEFT JOIN agh.rap_servidores as servidores on servidores.matricula = (
      CASE
        WHEN PROCEDIMENTOS.ser_matricula_atendido IS NOT NULL THEN PROCEDIMENTOS.ser_matricula_atendido
        WHEN PROCEDIMENTOS.ser_matricula_alterado IS NOT NULL THEN PROCEDIMENTOS.ser_matricula_alterado
        WHEN PROCEDIMENTOS.ser_matricula_consultado IS NOT NULL THEN PROCEDIMENTOS.ser_matricula_consultado
        WHEN PROCEDIMENTOS.ser_matricula IS NOT NULL THEN PROCEDIMENTOS.ser_matricula
        ELSE NULL
      END
    )
    AND servidores.vin_codigo = (
      CASE
        WHEN PROCEDIMENTOS.ser_matricula_atendido IS NOT NULL THEN PROCEDIMENTOS.ser_vin_codigo_atendido
        WHEN PROCEDIMENTOS.ser_matricula_alterado IS NOT NULL THEN PROCEDIMENTOS.ser_vin_codigo_alterado
        WHEN PROCEDIMENTOS.ser_matricula_consultado IS NOT NULL THEN PROCEDIMENTOS.ser_vin_codigo_consultado
        WHEN PROCEDIMENTOS.ser_matricula IS NOT NULL THEN PROCEDIMENTOS.ser_vin_codigo
        ELSE NULL
      END
    ) 
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CNS
    ON SERVIDORES_CNS.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CNS.TII_SEQ = 7
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CBO1
    ON SERVIDORES_CBO1.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CBO1.TII_SEQ = 2
  LEFT OUTER JOIN AGH.RAP_PESSOA_TIPO_INFORMACOES SERVIDORES_CBO2
    ON SERVIDORES_CBO2.PES_CODIGO = SERVIDORES.PES_CODIGO
   AND SERVIDORES_CBO2.TII_SEQ = 2
 LEFT OUTER JOIN AGH.RAP_PESSOAS_FISICAS AS SERVIDORES_INFO
    ON SERVIDORES_INFO.CODIGO = SERVIDORES.PES_CODIGO
  LEFT OUTER JOIN AGH.AIP_ENDERECOS_PACIENTES PACIENTES_ENDERECO
    ON PACIENTES.CODIGO = PACIENTES_ENDERECO.PAC_CODIGO
   AND PACIENTES_ENDERECO.TIPO_ENDERECO = 'R'
  AND SERVIDORES_CBO2.TII_SEQ = 3
LEFT OUTER JOIN AGH.AIP_CIDADES AS CIDADES
    ON PACIENTES_ENDERECO.CDD_CODIGO = CIDADES.CODIGO
  LEFT OUTER JOIN AGH.AIP_CEP_LOGRADOUROS AS CEP
    ON CEP.CEP = 
      (CASE
        WHEN PACIENTES_ENDERECO.CEP IS NOT NULL THEN PACIENTES_ENDERECO.CEP
        ELSE PACIENTES_ENDERECO.BCL_CLO_CEP
      END)
  LEFT OUTER JOIN AGH.AIP_LOGRADOUROS AS LOGRADOUROS
    ON LOGRADOUROS.CODIGO = CEP.LGR_CODIGO
  LEFT OUTER JOIN AGH.AIP_CIDADES AS CIDADES2
    ON CIDADES2.CODIGO = LOGRADOUROS.CDD_CODIGO
  LEFT OUTER JOIN AGH.AIP_TIPO_LOGRADOUROS AS TIPO_LOGRADOUROS
    ON TIPO_LOGRADOUROS.CODIGO = LOGRADOUROS.TLG_CODIGO
  LEFT OUTER JOIN AGH.AIP_BAIRROS_CEP_LOGRADOURO as BAIRROS_CEP ON
    (CASE
        WHEN PACIENTES_ENDERECO.CEP IS NOT NULL THEN PACIENTES_ENDERECO.CEP
        ELSE PACIENTES_ENDERECO.BCL_CLO_CEP
    END) = BAIRROS_CEP.clo_cep
  LEFT OUTER JOIN AGH.aip_bairros as BAIRROS ON
    BAIRROS.codigo = BAIRROS_CEP.bai_codigo
 
WHERE
(
dt_consulta between '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
)
and PROCEDIMENTOS.ret_seq = 10
and PROCEDIMENTOS.pac_codigo <> 1000001
and SERVIDORES_CBO1.valor is not null
and PROCEDIMENTOS.grd_seq NOT IN (582, 579, 1488, 1782, 1972, 1970, 1974, 1968, 1976, 1958, 1977, 1980, 1978, 1982, 1983, 2034, 1994, 1988, 2016, 1992, 2036, 1998, 2000, 2002, 2006, 2005, 1996, 2004, 2014, 2030, 2032, 2038, 2040, 2039, 2037)
--group by
--1,
--2,
--3
)
