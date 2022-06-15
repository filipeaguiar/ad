-- Medicamentos Antimicrobianos Detalhado       
    select 
      pessoas.nome as Profissional, 
      pac.nome as paciente, 
      med.descricao medicamento_descricao, 
      med.concentracao concentracao, 
      umm2.descricao unidade, 
      med.tpr_sigla apresentacao, 
      atd.prontuario, 
      pmd.dthr_inicio inicio_pm, 
      pmd.dthr_inicio_tratamento::date dt_inicio_tratamento, 
      pmd.vad_sigla via, 
      pmd.observacao,
      ime.dose, 
      umm.descricao unid_prescr,  
      pmd.frequencia, 
      ime.qtde_calc_sist_24h med_calc, 
      unf.descricao unid_func
        from    agh.afa_medicamentos med 
            left join agh.mpm_unidade_medida_medicas umm2 on 
                med.umm_seq = umm2.seq
            inner join agh.mpm_item_prescricao_mdtos ime on 
                med.mat_codigo = ime.med_mat_codigo
            inner join agh.afa_forma_dosagens fds on
                fds.seq = ime.fds_seq and 
                fds.med_mat_codigo = med.mat_codigo
            left join agh.mpm_unidade_medida_medicas umm on
                umm.seq = fds.umm_seq
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
            inner join agh.aip_pacientes pac on
                atd.pac_codigo = pac.codigo
            inner join agh.agh_unidades_funcionais unf on 
                unf.seq = atd.unf_seq
            inner join agh.mpm_prescricao_medicas pme on
                pme.atd_seq = atd.seq and 
                pme.seq = pmd.pme_seq
            left join agh.rap_servidores as servidores on
                servidores.matricula = pmd.ser_matricula
                and servidores.vin_codigo = pmd.ser_vin_codigo
            left join agh.rap_pessoas_fisicas as pessoas on
                servidores.pes_codigo = pessoas.codigo
        where med.tum_sigla in ('B', 'M') 
          and med.ind_situacao = 'A'
          and pmd.dthr_inicio::date between '#startDate' and '#endDate 23:59:59.999999'
        order by pac.nome, pme.criado_em::date, unf.descricao