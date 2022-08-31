SELECT
  internacoes.seq,
  especialidades.nome_especialidade enfermaria,
  CASE
    WHEN (especialidades.nome_especialidade = 'OBSTETRÍCIA' AND internacoes.lto_lto_id IS NULL) THEN 'EX-COB'
    WHEN (especialidades.nome_especialidade = 'NEONATOLOGIA' AND internacoes.lto_lto_id IS NULL) THEN 'EX-UCIN'
    ELSE unidades.descricao
  END as unidade_funcional,
  pacientes.prontuario,
  CASE
    WHEN internacoes.lto_lto_id IS NULL THEN '0000'
    ELSE internacoes.lto_lto_id
  END as numero_leito,
  internacoes.dthr_internacao as data_internacao,
  (
    internacoes.dthr_alta_medica :: date - internacoes.dthr_internacao :: date
  ) as tempo_ocupacao,
  internacoes.dthr_alta_medica as data_alta,
  CASE
   WHEN leitos.ind_acompanhamento_ccih is null then 'S'
   ELSE leitos.ind_acompanhamento_ccih
  END as ccih,
  observacoes.descricao as observacao,
  internacoes.ind_saida_pac as alta
FROM
  agh.ain_internacoes as internacoes
  LEFT OUTER JOIN agh.agh_especialidades as especialidades ON especialidades.seq = internacoes.esp_seq
  LEFT OUTER JOIN agh.ain_leitos as leitos ON internacoes.lto_lto_id = leitos.lto_id
  LEFT OUTER JOIN agh.agh_unidades_funcionais as unidades ON unidades.seq = leitos.unf_seq
  LEFT OUTER JOIN agh.ain_observacoes_censo as observacoes ON observacoes.int_seq = internacoes.seq
  LEFT OUTER JOIN agh.aip_pacientes as pacientes on internacoes.pac_codigo = pacientes.codigo
WHERE
  (leitos.ind_situacao = 'A'
  or internacoes.lto_lto_id is null)
ORDER BY
  tempo_ocupacao