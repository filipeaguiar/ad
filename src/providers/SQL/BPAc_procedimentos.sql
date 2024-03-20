
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
    AND faturamento_registros.cod_registro = '02'
    AND procedimentos.pac_codigo <> 1000001
    AND cbos.codigo IS NOT NULL
  group by
    1,
    2,
    4
