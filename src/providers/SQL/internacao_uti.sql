SELECT
  paciente.nome AS paciente,
  to_char(movimentos.dthr_lancamento,'DD/MM/YYYY') AS internacao,
  unidades.descricao AS unidade
--  count(*)
FROM
  agh.ain_movimentos_internacao movimentos
LEFT OUTER JOIN agh.agh_unidades_funcionais unidades
ON
  unidades.seq = movimentos.unf_seq
INNER JOIN agh.ain_internacoes internacoes 
ON 
  movimentos.int_seq = internacoes.seq 
INNER JOIN agh.aip_pacientes paciente
ON internacoes.pac_codigo = paciente.codigo
WHERE
  (
    movimentos.unf_seq = 10
    OR movimentos.unf_seq = 115
    OR movimentos.unf_seq = 14
  )
  -- AND movimentos.dthr_lancamento BETWEEN '2023-03-01' AND '2023-03-31 23:59:59.9999'
  AND movimentos.tmi_seq != 21
ORDER BY
  movimentos.dthr_lancamento DESC,
  unidades.descricao ASC 