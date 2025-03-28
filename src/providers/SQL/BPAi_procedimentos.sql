SELECT TO_CHAR(PROCEDIMENTOS.DTHR_VALIDA,
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
   AND FATURAMENTO_PROCEDIMENTOS.COD_TABELA <> '101010028'
