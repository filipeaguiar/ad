SELECT 
distinct on (extratos.lto_lto_id)  extratos.lto_lto_id, 
--extratos.criado_em, 
CASE 
WHEN extratos.tml_codigo = 0 THEN 'DESOCUPADO'
WHEN extratos.tml_codigo = 10 THEN 'BLOQUEIO FAMILIARES'
WHEN extratos.tml_codigo = 14 THEN 'BLOQUEIO ACOMPANHANTE'
WHEN extratos.tml_codigo = 16 THEN 'OCUPADO'
WHEN extratos.tml_codigo = 21 THEN 'LIMPEZA'
WHEN extratos.tml_codigo = 22 THEN 'MANUTENCAO'
WHEN extratos.tml_codigo = 23 THEN 'ISOLAMENTO (INFECCAO)'
WHEN extratos.tml_codigo = 24 THEN 'BLOQUEIO ADMINISTRATIVO'
WHEN extratos.tml_codigo = 25 THEN 'DESATIVADO'
WHEN extratos.tml_codigo = 26 THEN 'ENGENHARIA CLINICA'
WHEN extratos.tml_codigo = 29 THEN 'TECNICO'
WHEN extratos.tml_codigo = 30 THEN 'PATOLOGIA'
WHEN extratos.tml_codigo = 31 THEN 'RESERVADO'
WHEN extratos.tml_codigo = 32 THEN 'ALOCACAO TEMPORARIA'
WHEN extratos.tml_codigo = 33 THEN 'BLOQUEIO HOTELARIA'
WHEN extratos.tml_codigo = 34 THEN 'PERTENCES PACIENTE'
WHEN extratos.tml_codigo = 60 THEN 'LEITO LIBERADO POR ALTA'
END as status
FROM agh.ain_extrato_leitos as extratos
LEFT OUTER JOIN agh.ain_leitos as leitos on extratos.lto_lto_id = leitos.lto_id
WHERE leitos.ind_situacao = 'A'
order by lto_lto_id, criado_em desc