SELECT 
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
AND descricoes.dthr_execucao BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
