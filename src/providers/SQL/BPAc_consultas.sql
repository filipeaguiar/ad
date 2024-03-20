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
