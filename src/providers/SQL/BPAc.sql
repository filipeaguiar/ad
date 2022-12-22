(
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
  group by
    1,
    2,
    4
)
UNION
(
  SELECT
    cbos.codigo as cbo,
    date_part('year', age(pacientes.dt_nascimento)) as idade,
    SUM(procedimentos.quantidade) as quantidade,
    faturamento_procedimentos.cod_tabela as procedimento_sus,
    'PROCEDIMENTOS' as tipo_registro
  FROM
    agh.mam_proc_realizados as procedimentos
    LEFT OUTER JOIN agh.fat_conv_grupo_itens_proced as faturamento_grupos on faturamento_grupos.phi_seq = procedimentos.phi_seq
    LEFT OUTER JOIN agh.fat_itens_proced_hospitalar as faturamento_procedimentos on faturamento_procedimentos.pho_seq = faturamento_grupos.iph_pho_seq
    and faturamento_procedimentos.seq = faturamento_grupos.iph_seq
    LEFT OUTER JOIN agh.fat_procedimentos_registro as faturamento_registros on faturamento_registros.cod_procedimento = faturamento_procedimentos.cod_tabela
    LEFT OUTER JOIN agh.fat_cbos as cbos on cbos.seq = procedimentos.cbo
    LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = procedimentos.pac_codigo
  WHERE
    procedimentos.dthr_valida BETWEEN '#startDate 00:00:00' AND '#endDate 23:59:59.999999'
    AND procedimentos.cbo IS NOT NULL
    AND procedimentos.phi_seq IS NOT NULL
    AND procedimentos.pac_codigo <> 1000001
    AND cbos.codigo IS NOT NULL
  group by
    1,
    2,
    4
)
UNION
-- Exames ↓
(
SELECT 
       exames.cbo_principal AS cbo,
       pacientes.idade as idade,
       count(*) as quantidade,
       procedimentosus.cod_tabela as procedimento_sus,
       'EXAMES' as tipo_registro
  
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
   AND atendimentos.origem = 'A'
  GROUP BY 1, 2, 4
)
order by
  1 asc,
  2 asc,
  3 asc,
  5 asc