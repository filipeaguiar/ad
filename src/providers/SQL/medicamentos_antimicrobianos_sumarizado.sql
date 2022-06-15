-- Medicamentos Antimicrobianos Sumarizado
select  med.descricao med_descr, med.concentracao concentracao, umm2.descricao unid, med.tpr_sigla apres, pmd.vad_sigla via, sum(ime.qtde_calc_sist_24h) med_calc_pm, unf.descricao unid_func
        from    agh.afa_medicamentos med 
            left join agh.mpm_unidade_medida_medicas umm2 on 
                med.umm_seq = umm2.seq
            inner join agh.mpm_item_prescricao_mdtos ime on 
                med.mat_codigo = ime.med_mat_codigo
            inner join agh.mpm_prescricao_mdtos pmd on
                pmd.atd_seq = ime.pmd_atd_seq and
                pmd.seq = ime.pmd_seq  and 
                pmd.seq = (select max(pmd_.seq) 
                         from agh.mpm_prescricao_mdtos pmd_ 
                         where pmd_.atd_seq = pmd.atd_seq 
                           and pmd_.seq = pmd.seq
                           and pmd_.dthr_inicio = pmd.dthr_inicio) 
            inner join agh.agh_atendimentos atd on 
                atd.seq = ime.pmd_atd_seq and
                atd.seq = pmd.atd_seq
            inner join agh.agh_unidades_funcionais unf on 
                unf.seq = atd.unf_seq
            inner join agh.mpm_prescricao_medicas pme on
                pme.atd_seq = atd.seq and 
                pme.seq = pmd.pme_seq
        where med.tum_sigla in ('B', 'M') 
          and med.ind_situacao = 'A'
          and pmd.dthr_inicio::date between '#startDate' and '#endDate 23:59:59.999999'
        group by  med.mat_codigo, med.descricao, med.concentracao, umm2.descricao, med.tpr_sigla, pmd.vad_sigla, unf.descricao
        order by unf.descricao, med.descricao