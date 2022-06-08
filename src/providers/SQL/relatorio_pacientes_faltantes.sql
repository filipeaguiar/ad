SELECT
consultas.pac_codigo AS codigo_paciente,
consultas.dt_consulta AS data_consulta,
pacientes.cpf AS CPF,
pacientes.nro_cartao_saude AS CNS,
enderecos.cep AS CEP,
enderecos.bcl_clo_cep as CEP_Alternativo
FROM agh.aac_consultas AS consultas
LEFT OUTER JOIN agh.aip_pacientes AS pacientes
ON pacientes.codigo = consultas.pac_codigo
LEFT OUTER JOIN agh.aip_enderecos_pacientes AS enderecos
ON enderecos.pac_codigo = pacientes.codigo
WHERE 
consultas.dt_consulta BETWEEN '#startDate' AND '#endDate 23:59:59.999999'
AND consultas.ind_sit_consulta = 'M'
AND ((pacientes.cpf IS NULL) OR (pacientes.nro_cartao_saude IS NULL) OR ((enderecos.cep IS NULL) AND (enderecos.bcl_clo_cep IS NULL))) 