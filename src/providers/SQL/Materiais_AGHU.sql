SELECT
	mat.codigo
	,mat.nome
	,case
		when opme.mat_codigo is not null then 'Sim'
		else 'Não'
	end as "OPME?"
	,case
		when opme.mat_codigo is not null then 0
		else avg(egg.custo_medio_ponderado)
	end as "Valor Unitário"
	,mat.cod_mat_antigo AS "Cod Master"
	
FROM agh.sco_materiais mat
INNER JOIN 	agh.sce_estq_gerais 		egg ON mat.codigo = egg.mat_codigo
left join
(
	select distinct ege.mat_codigo
	from agh.sce_estq_almoxs 		ege
	where ege.alm_seq = 19 and ege.ind_situacao = 'A'
) opme on mat.codigo = opme.mat_codigo
WHERE egg.dt_competencia >= date_trunc('month', CURRENT_DATE)
group by 1, 2, opme.mat_codigo
