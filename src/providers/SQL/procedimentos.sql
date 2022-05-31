SELECT
          procedimentos.dthr_valida as data_procedimento,
          servidores_cbo1.valor as CBO,
          procedimentos.quantidade as Procedimento_Quantidade,
          faturamento_procedimentos.cod_tabela as procedimento_sus
        FROM
          agh.mam_proc_realizados as procedimentos
          LEFT OUTER JOIN agh.fat_conv_grupo_itens_proced as faturamento_grupos on faturamento_grupos.phi_seq = procedimentos.phi_seq
          LEFT OUTER JOIN agh.fat_itens_proced_hospitalar as faturamento_procedimentos on faturamento_procedimentos.pho_seq = faturamento_grupos.iph_pho_seq
          and faturamento_procedimentos.seq = faturamento_grupos.iph_seq
          LEFT OUTER JOIN agh.fat_procedimentos_registro as faturamento_registros on faturamento_registros.cod_procedimento = faturamento_procedimentos.cod_tabela
          LEFT OUTER JOIN agh.fat_cbos as cbos on cbos.seq = procedimentos.cbo
          LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = procedimentos.pac_codigo
          LEFT OUTER JOIN agh.rap_servidores as servidores on servidores.matricula = procedimentos.ser_matricula
          and servidores.vin_codigo = procedimentos.ser_vin_codigo
          LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CNS on servidores_CNS.pes_codigo = servidores.pes_codigo
          AND servidores_CNS.tii_seq = 7
          LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CBO1 ON servidores_CBO1.pes_codigo = servidores.pes_codigo
          AND servidores_CBO1.tii_seq = 2
          LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CBO2 ON servidores_CBO2.pes_codigo = servidores.pes_codigo
          AND servidores_CBO2.tii_seq = 3
          LEFT OUTER JOIN agh.rap_pessoas_fisicas as servidores_info on servidores_info.codigo = servidores.pes_codigo
          LEFT OUTER JOIN AGH.AIP_ENDERECOS_PACIENTES Pacientes_Endereco ON Pacientes.CODIGO = Pacientes_Endereco.PAC_CODIGO
          AND Pacientes_Endereco.tipo_endereco = 'R'
          LEFT OUTER JOIN agh.aac_consultas as consultas ON consultas.numero = procedimentos.con_numero
          LEFT OUTER JOIN agh.aip_cidades as Cidades ON Pacientes_Endereco.cdd_codigo = Cidades.codigo
          LEFT OUTER JOIN agh.aip_cep_logradouros as CEP ON CEP.cep = Pacientes_Endereco.bcl_clo_cep
          LEFT OUTER JOIN agh.aip_logradouros as Logradouros ON Logradouros.codigo = CEP.lgr_codigo
          LEFT OUTER JOIN agh.aip_cidades as Cidades2 ON Cidades2.codigo = Logradouros.cdd_codigo
          LEFT OUTER JOIN agh.aip_tipo_logradouros as Tipo_Logradouros ON Tipo_Logradouros.codigo = Logradouros.tlg_codigo
          LEFT OUTER JOIN agh.agh_cids as CID ON CID.seq = procedimentos.cid_seq
        WHERE
          consultas.ret_seq = 10
          AND procedimentos.phi_seq IS NOT NULL
          AND faturamento_procedimentos.cod_tabela NOT IN (
            SELECT
              cod_procedimento
            FROM
              agh.fat_procedimentos_registro
            WHERE
              cod_registro = '01'
          )
          AND faturamento_registros.cod_registro = '02'
          AND consultas.pac_codigo <> 1000001
        UNION
        (
          SELECT
            consultas.dt_consulta as data_procedimento,
            servidores_informacoes_cbo.valor as CBO,
            1 as procedimento_quantidade,
            CASE
              WHEN servidores_informacoes_cbo.valor like '2231%' THEN 0301010072
              WHEN servidores_informacoes_cbo.valor like '2251%' THEN 0301010072
              WHEN servidores_informacoes_cbo.valor like '2252%' THEN 0301010072
              WHEN servidores_informacoes_cbo.valor like '2253%' THEN 0301010072
              ELSE 0301010048
            END as procedimento_sus
          from
            agh.aac_consultas as consultas -- Informações da Grade
            LEFT JOIN agh.aac_grade_agendamen_consultas as grades ON grades.seq = consultas.grd_seq -- Pega informações do retorno, pra saber status da consulta
            LEFT JOIN agh.aac_retornos ret ON ret.seq = consultas.ret_seq -- Informações do Profissional (Dados de Servidor)
            LEFT JOIN agh.rap_servidores as servidores on servidores.matricula = (
              CASE
                WHEN consultas.ser_matricula_atendido IS NOT NULL THEN consultas.ser_matricula_atendido
                WHEN consultas.ser_matricula_alterado IS NOT NULL THEN consultas.ser_matricula_alterado
                WHEN consultas.ser_matricula_consultado IS NOT NULL THEN consultas.ser_matricula_consultado
                WHEN consultas.ser_matricula IS NOT NULL THEN consultas.ser_matricula
                ELSE NULL
              END
            )
            AND servidores.vin_codigo = (
              CASE
                WHEN consultas.ser_matricula_atendido IS NOT NULL THEN consultas.ser_vin_codigo_atendido
                WHEN consultas.ser_matricula_alterado IS NOT NULL THEN consultas.ser_vin_codigo_alterado
                WHEN consultas.ser_matricula_consultado IS NOT NULL THEN consultas.ser_vin_codigo_consultado
                WHEN consultas.ser_matricula IS NOT NULL THEN consultas.ser_vin_codigo
                ELSE NULL
              END
            ) -- Informações do Profissional (Dados Pessoais)
            LEFT JOIN agh.rap_pessoas_fisicas as pessoas on servidores.pes_codigo = pessoas.codigo -- Pega o CNS do Profissional
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cns on (
              servidores_informacoes_cns.pes_codigo = pessoas.codigo
              AND servidores_informacoes_cns.tii_seq = 7
            ) -- Pega o CBO PRIMARIO do Profissional
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo on (
              servidores_informacoes_cbo.pes_codigo = pessoas.codigo
              AND servidores_informacoes_cbo.tii_seq = 2
            ) -- Pega o CBO SECUNDARIO do Profissional
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo2 on (
              servidores_informacoes_cbo2.pes_codigo = pessoas.codigo
              AND servidores_informacoes_cbo2.tii_seq = 3
            ) -- Pega o CBO TERCIARIO do Profissional
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo3 on (
              servidores_informacoes_cbo3.pes_codigo = pessoas.codigo
              AND servidores_informacoes_cbo3.tii_seq = 4
            )
            LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = consultas.pac_codigo
          where
            ret.descricao <> 'PACIENTE AGENDADO'
            and ret.descricao <> 'AGUARDANDO ATENDIMENTO'
            and ret.descricao <> 'PACIENTE FALTOU'
            and ret.descricao <> 'PROFISSIONAL FALTOU'
            and ret.descricao <> 'EM ATENDIMENTO'
            and ret.descricao <> 'PACIENTE DESISTIU CONS'
            and consultas.pac_codigo <> 1000001
            and servidores_informacoes_cbo.valor is not null
        )
        UNION
        (
          SELECT
            procedimentos.dthr_valida as data_procedimento,
            cbos.codigo as cbo,
            procedimentos.quantidade as procedimentos_quantidade,
            faturamento_procedimentos.cod_tabela as procedimento_sus
          FROM
            agh.mam_proc_realizados as procedimentos
            LEFT OUTER JOIN agh.fat_conv_grupo_itens_proced as faturamento_grupos on faturamento_grupos.phi_seq = procedimentos.phi_seq
            LEFT OUTER JOIN agh.fat_itens_proced_hospitalar as faturamento_procedimentos on faturamento_procedimentos.pho_seq = faturamento_grupos.iph_pho_seq
            and faturamento_procedimentos.seq = faturamento_grupos.iph_seq
            LEFT OUTER JOIN agh.fat_procedimentos_registro as faturamento_registros on faturamento_registros.cod_procedimento = faturamento_procedimentos.cod_tabela
            LEFT OUTER JOIN agh.fat_cbos as cbos on cbos.seq = procedimentos.cbo
            LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = procedimentos.pac_codigo
          WHERE
            procedimentos.cbo IS NOT NULL
            AND procedimentos.phi_seq IS NOT NULL
            AND faturamento_registros.cod_registro = '01'
            AND procedimentos.pac_codigo <> 1000001
            AND cbos.codigo IS NOT NULL
        )