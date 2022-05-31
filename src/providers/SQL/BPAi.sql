SELECT
  to_char(procedimentos.dthr_valida, 'YYYYMMDD') as Data_Procedimento,
  procedimentos.con_numero as Num_Consulta,
  procedimentos.pac_codigo,
  servidores_CNS.valor as CNS,
  servidores_info.nome as Profissional_Nome,
  CASE
    WHEN servidores_CBO2.valor is NULL THEN servidores_CBO1.valor
    ELSE servidores_CBO2.valor
  END as CBO,
  pacientes.nro_cartao_saude as Paciente_Cartao_SUS,
  Pacientes.NOME as Paciente_Nome,
  Pacientes.SEXO_BIOLOGICO as Paciente_Sexo_Biologico,
  to_char(Pacientes.DT_NASCIMENTO, 'YYYYMMDD') as Paciente_Data_Nascimento,
  Pacientes.NAC_CODIGO as Paciente_Nacionalidade,
  CASE
    WHEN Cidades.cod_ibge is NULL THEN Cidades2.cod_ibge
    ELSE Cidades.cod_ibge
  END as Cidade,
  Pacientes.COR as Paciente_Cor,
  CASE
    WHEN Pacientes_Endereco.cep is NULL THEN Pacientes_Endereco.bcl_clo_cep
    ELSE Pacientes_Endereco.cep
  END as CEP,
  Tipo_Logradouros.codigo_base_sus as Cod_Logradouro,
  replace(CID.codigo, '.', '') as CID,
  procedimentos.quantidade as Procedimento_Quantidade,
  faturamento_procedimentos.cod_tabela as procedimento_sus
FROM
  agh.mam_proc_realizados as procedimentos
  LEFT OUTER JOIN agh.fat_conv_grupo_itens_proced as faturamento_grupos on faturamento_grupos.phi_seq = procedimentos.phi_seq
  LEFT OUTER JOIN agh.fat_itens_proced_hospitalar as faturamento_procedimentos on faturamento_procedimentos.pho_seq = faturamento_grupos.iph_pho_seq
  and faturamento_procedimentos.seq = faturamento_grupos.iph_seq
  LEFT OUTER JOIN agh.fat_procedimentos_registro as faturamento_registros on faturamento_registros.cod_procedimento = faturamento_procedimentos.cod_tabela
  LEFT OUTER JOIN agh.fat_cbos as cbos on cbos.seq = procedimentos.cbo
  LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = procedimentos.pac_codigo
  LEFT OUTER JOIN agh.rap_servidores as servidores on servidores.matricula = procedimentos.ser_matricula
  and servidores.vin_codigo = procedimentos.ser_vin_codigo
  LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CNS on servidores_CNS.pes_codigo = servidores.pes_codigo
  AND servidores_CNS.tii_seq = 7
  LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CBO1 ON servidores_CBO1.pes_codigo = servidores.pes_codigo
  AND servidores_CBO1.tii_seq = 2
  LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CBO2 ON servidores_CBO2.pes_codigo = servidores.pes_codigo
  AND servidores_CBO2.tii_seq = 3
  LEFT OUTER JOIN agh.rap_pessoas_fisicas as servidores_info on servidores_info.codigo = servidores.pes_codigo
  LEFT OUTER JOIN AGH.AIP_ENDERECOS_PACIENTES Pacientes_Endereco ON Pacientes.CODIGO = Pacientes_Endereco.PAC_CODIGO
  AND Pacientes_Endereco.tipo_endereco = 'R'
  LEFT OUTER JOIN agh.aac_consultas as consultas ON consultas.numero = procedimentos.con_numero
  LEFT OUTER JOIN agh.aip_cidades as Cidades ON Pacientes_Endereco.cdd_codigo = Cidades.codigo
  LEFT OUTER JOIN agh.aip_cep_logradouros as CEP ON CEP.cep = Pacientes_Endereco.bcl_clo_cep
  LEFT OUTER JOIN agh.aip_logradouros as Logradouros ON Logradouros.codigo = CEP.lgr_codigo
  LEFT OUTER JOIN agh.aip_cidades as Cidades2 ON Cidades2.codigo = Logradouros.cdd_codigo
  LEFT OUTER JOIN agh.aip_tipo_logradouros as Tipo_Logradouros ON Tipo_Logradouros.codigo = Logradouros.tlg_codigo
  LEFT OUTER JOIN agh.agh_cids as CID ON CID.seq = procedimentos.cid_seq
WHERE
  procedimentos.dthr_valida BETWEEN '#startDate 00:00:00'
  and '#endDate 23:59:59.999999'
  AND consultas.ret_seq = 10
  AND procedimentos.phi_seq IS NOT NULL
  AND faturamento_procedimentos.cod_tabela NOT IN (
    SELECT
      cod_procedimento
    FROM
      agh.fat_procedimentos_registro
    WHERE
      cod_registro = '01'
  )
  AND faturamento_registros.cod_registro = '02'
  AND consultas.pac_codigo <> 1000001