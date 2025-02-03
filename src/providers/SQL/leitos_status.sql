SELECT distinct
  on (extratos.lto_lto_id) extratos.lto_lto_id,
  --extratos.criado_em, 
  codigo.descricao as status,
  tipo_leito.descricao AS tipo,
  pacientes.prontuario
FROM
  agh.ain_extrato_leitos as extratos
  LEFT OUTER JOIN agh.ain_leitos as leitos on extratos.lto_lto_id = leitos.lto_id
  LEFT OUTER JOIN agh.ain_tipo_classificacao_leito as classificacao on leitos.tpclsfcclto_seq = classificacao.seq
  LEFT OUTER JOIN agh.ain_tipo_leito_clinica as tipo_clinica on classificacao.tpltoclnc_seq = tipo_clinica.seq
  LEFT OUTER JOIN agh.ain_tipos_leitos as tipo_leito on tipo_clinica.tplto_seq = tipo_leito.seq
  LEFT JOIN agh.AIN_TIPOS_MVTO_LEITO codigo ON codigo.codigo = extratos.tml_codigo
  LEFT JOIN agh.ain_internacoes as internacoes on extratos.int_seq = internacoes.seq
  LEFT JOIN agh.aip_pacientes as pacientes on internacoes.pac_codigo = pacientes.codigo
WHERE
  leitos.ind_situacao = 'A'
order by
  lto_lto_id,
  extratos.criado_em desc
