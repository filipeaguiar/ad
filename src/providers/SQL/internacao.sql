SELECT
  internacoes.seq,
  especialidades.nome_especialidade enfermaria,
  pacientes.prontuario,
  internacoes.lto_lto_id as numero_leito,
  internacoes.dthr_internacao as data_internacao,
  (
    internacoes.dthr_alta_medica :: date - internacoes.dthr_internacao :: date
  ) as tempo_ocupacao,
  internacoes.dthr_alta_medica as data_alta,
  leitos.ind_acompanhamento_ccih as ccih,
  observacoes.descricao as observacao
FROM
  agh.ain_internacoes as internacoes
  LEFT OUTER JOIN agh.agh_especialidades as especialidades ON especialidades.seq = internacoes.esp_seq
  LEFT OUTER JOIN agh.ain_leitos as leitos ON internacoes.lto_lto_id = leitos.lto_id
  LEFT OUTER JOIN agh.ain_observacoes_censo as observacoes ON observacoes.int_seq = internacoes.seq
  LEFT OUTER JOIN agh.aip_pacientes as pacientes on internacoes.pac_codigo = pacientes.codigo
WHERE
  leitos.ind_situacao = 'A'
ORDER BY
  tempo_ocupacao
  