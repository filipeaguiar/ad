with leitos_desocupados as (
	select uf.descricao, l.lto_id
	from		agh.ain_leitos l
	inner join	agh.agh_unidades_funcionais uf 		on uf.seq = l.unf_seq
	where 	l.ind_situacao = 'A'
	and	uf.ind_sit_unid_func = 'A'
	and	uf.ind_unid_internacao = 'S'

	EXCEPT 

	select * from (
		select 	distinct on (i.seq)   
			uf.descricao unidade  
			,case when mi.lto_lto_id is null then '0000' else mi.lto_lto_id end as leito  

		from 		agh.ain_internacoes i   
		inner join 	agh.ain_movimentos_internacao mi	on mi.int_seq = i.seq  
		inner join	agh.agh_unidades_funcionais uf 		on uf.seq = mi.unf_seq  

		where	dthr_alta_medica is null  
		and	mi.tmi_seq != 41 -- Atualização de Internação  

		order by i.seq  
			,mi.dthr_lancamento desc -- Se mudar a ordenação pode quebrar a consulta pelo distinct on  
		) ocupados

	order by 1, 2
)

select   
	censo.*   
	,se.seq  
  
from (  
	select 	distinct on (i.seq)   
		uf.descricao as "Unidade"
		,case when mi.lto_lto_id is null then '0000' else mi.lto_lto_id end as "Leito"
		,p.prontuario  as "Prontuário"
		,i.seq   as "Internação"
		,cids.codigos as "Códigos"
		,cids.descricoes as "Descrições"
		,p.nome  as "Paciente"
		,to_char(mi.dthr_lancamento, 'dd/mm/yyyy HH24:MI') as "Data"  
		,e.nome_especialidade  as "Especialidade"
		--,mi.tmi_seq  
		--,tmi.descricao  
		--,se.seq   
		,at.seq atendimento  
  
	from 		agh.ain_internacoes i   
	inner join 	agh.aip_pacientes p 			on i.pac_codigo = p.codigo  
	inner join 	agh.ain_movimentos_internacao mi	on mi.int_seq = i.seq  
	inner join 	agh.ain_tipos_mvto_internacao tmi 	on tmi.seq = mi.tmi_seq  
	inner join	agh.agh_unidades_funcionais uf 		on uf.seq = mi.unf_seq  
	inner join	agh.agh_especialidades e 		on e.seq = i.esp_seq  
	inner join 	agh.agh_atendimentos at			on i.seq = at.int_seq  
	inner join	(  
				SELECT *
				FROM (
					SELECT atendimento, STRING_AGG(cids.cid, ' / ') as codigos, STRING_AGG(cids.descricao, ' / ') as descricoes
					FROM (
						SELECT 
							atd.seq as "atendimento" --"Internação"
							,cid.codigo as "cid"
							,cid.descricao
						FROM agh.agh_atendimentos atd
						INNER JOIN agh.ain_internacoes inte ON atd.int_seq = inte.seq
						INNER JOIN agh.ain_cids_internacao cint ON inte.seq = cint.int_seq 
						INNER JOIN agh.agh_cids cid ON (cint.cid_seq = cid.seq)
						WHERE atd.seq is not null
						UNION
						SELECT 
							atd.seq -- "Prescrição"
							,cid.codigo
							,cid.descricao
						FROM agh.agh_atendimentos atd
						INNER JOIN agh.mpm_cid_atendimentos cia ON atd.seq = cia.atd_seq 
						INNER JOIN agh.agh_cids cid ON (cia.cid_seq = cid.seq)
						WHERE atd.seq is not null
						UNION
						SELECT 
							diag.atd_seq -- "Diagnostico"
							,cid.codigo
							,cid.descricao
						FROM agh.mam_diagnosticos diag 
						INNER JOIN agh.agh_cids cid ON (diag.cid_seq = cid.seq)
						WHERE diag.atd_seq is not null
					) as cids
				GROUP BY atendimento	
				) as cids
			)	as cids			on cids.atendimento = at.seq  
  
	where	dthr_alta_medica is null  
	and	mi.tmi_seq != 41 -- Atualização de Internação  
  
	order by i.seq  
		,mi.dthr_lancamento desc -- Se mudar a ordenação pode quebrar a consulta pelo distinct on  
) censo  
  
left join (  
	select	  
		se.seq  
		,se.atd_seq  
	from agh.ael_solicitacao_exames se  
	inner join agh.ael_item_solicitacao_exames ise on se.seq = ise.soe_seq  
	where 	ise.ufe_ema_exa_sigla = 'ITS'  
	and	ise.sit_codigo = 'LI'  
	)	se					on censo.atendimento = se.atd_seq  
  
UNION

Select *, null, null, null, null, null, null, null, null, null from leitos_desocupados
--order by censo.unidade, censo.leito
 order by 1, 2