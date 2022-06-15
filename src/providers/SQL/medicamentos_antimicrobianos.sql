    select med.mat_codigo, med.descricao med_descr, med.concentracao concentracao, umm2.descricao unid, med.tpr_sigla apres 
        from agh.afa_medicamentos med 
        left join agh.mpm_unidade_medida_medicas umm2 on 
        med.umm_seq = umm2.seq
        left join agh.afa_tipo_uso_mdtos tmd on med.tum_sigla = tmd.sigla
        left join agh.afa_tipo_apres_mdtos tmt on tmt.sigla = med.tpr_sigla
        where med.tum_sigla in ('B','M') 
        and med.ind_situacao = 'A'
        order by med.descricao