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
   --AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA NOT IN (#procedimentosBPAc)
   --AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA NOT IN (#procedimentosPAB)
   AND FATURAMENTO_REGISTROS.COD_REGISTRO = '02'
   AND CONSULTAS.PAC_CODIGO <> 1000001
   AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA <> '301010072'
   AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA <> '301010048'
   AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA <> '101010028')
UNION
-- Exames ↓
(
SELECT 
       to_char(exames.dthr_liberada,'YYYYMMDD') AS DATA_PROCEDIMENTO,
       exames.PAC_CODIGO,
       exames.num_solicitacao as num_consulta,
       exames.CARTAO_SUS_CNS as cns,
       exames.profissional_solicitante as PROFISSIONAL_NOME,
       exames.cbo_principal AS CBO,
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
 
  WHERE exames.dthr_liberada BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999' -- PERIODO
   AND exames.SIT_CODIGO = 'LI' -- LIBERADO
   AND exames.PRONTUARIO <> '10000016'
   AND exames.PRONTUARIO <> '20618740'
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
  ON grades.ser_matricula = servidores.matricula
  AND grades.ser_vin_codigo = servidores.vin_codigo

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