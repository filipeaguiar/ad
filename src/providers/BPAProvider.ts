import postgresPool from "../resources/postgres"

export default class BPAProvider {
    /**
     * @param { string } mesAno  - Mês e ano a serem consultados, no formato YYYY-MM
     * @returns {Array|object} array contendo as linhas da consulta
     */
    static async getBPAi(mesAno) {
        const startDate = new Date(
            new Date(`${mesAno}-01`).getFullYear(),
            new Date(`${mesAno}-01`).getMonth() + 1, 1)
            .toISOString().split('T')[0]
        const endDate = new Date(
            new Date(`${mesAno}-01`).getFullYear(),
            new Date(`${mesAno}-01`).getMonth() + 2, 0)
            .toISOString().split('T')[0]
        try {
            const result = await postgresPool.pool.query(`
            SELECT
            to_char(procedimentos.dthr_valida, 'YYYYMMDD') as Data_Procedimento,
            procedimentos.con_numero as Num_Consulta,
            procedimentos.pac_codigo,
            servidores_CNS.valor as CNS,
            servidores_info.nome as Profissional_Nome,
            CASE
                WHEN servidores_CBO2.valor is NULL THEN servidores_CBO1.valor
                ELSE servidores_CBO2.valor
            END as CBO,
            pacientes.nro_cartao_saude as Paciente_Cartao_SUS,
            Pacientes.NOME as Paciente_Nome,
            Pacientes.SEXO_BIOLOGICO as Paciente_Sexo_Biologico,
            to_char(Pacientes.DT_NASCIMENTO, 'YYYYMMDD') as Paciente_Data_Nascimento,
            Pacientes.NAC_CODIGO as Paciente_Nacionalidade,
            CASE 
                WHEN Cidades.cod_ibge is NULL THEN Cidades2.cod_ibge
                ELSE Cidades.cod_ibge
            END as Cidade,
            Pacientes.COR as Paciente_Cor,
            CASE
                WHEN Pacientes_Endereco.cep is NULL THEN Pacientes_Endereco.bcl_clo_cep
                ELSE Pacientes_Endereco.cep
            END as CEP,
            Tipo_Logradouros.codigo_base_sus as Cod_Logradouro,
            replace(CID.codigo, '.', '') as CID,
            procedimentos.quantidade as Procedimento_Quantidade,
            faturamento_procedimentos.cod_tabela as procedimento_sus

            FROM agh.mam_proc_realizados as procedimentos
            LEFT OUTER JOIN agh.fat_conv_grupo_itens_proced as faturamento_grupos 
                on faturamento_grupos.phi_seq = procedimentos.phi_seq
            LEFT OUTER JOIN agh.fat_itens_proced_hospitalar as faturamento_procedimentos 
                on faturamento_procedimentos.pho_seq = faturamento_grupos.iph_pho_seq
                and faturamento_procedimentos.seq = faturamento_grupos.iph_seq
            LEFT OUTER JOIN agh.fat_procedimentos_registro as faturamento_registros
                on faturamento_registros.cod_procedimento =  faturamento_procedimentos.cod_tabela
            LEFT OUTER JOIN agh.fat_cbos as cbos
                on cbos.seq = procedimentos.cbo
            LEFT OUTER JOIN agh.aip_pacientes as pacientes 
                on pacientes.codigo = procedimentos.pac_codigo
            LEFT OUTER JOIN agh.rap_servidores as servidores
                on servidores.matricula = procedimentos.ser_matricula
                and servidores.vin_codigo = procedimentos.ser_vin_codigo
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CNS
                on servidores_CNS.pes_codigo = servidores.pes_codigo
                AND servidores_CNS.tii_seq = 7
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CBO1
                ON servidores_CBO1.pes_codigo = servidores.pes_codigo
                AND servidores_CBO1.tii_seq = 2
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes servidores_CBO2
                ON servidores_CBO2.pes_codigo = servidores.pes_codigo
                AND servidores_CBO2.tii_seq = 3	
            LEFT OUTER JOIN agh.rap_pessoas_fisicas as servidores_info
                on servidores_info.codigo = servidores.pes_codigo
            LEFT OUTER JOIN AGH.AIP_ENDERECOS_PACIENTES Pacientes_Endereco 
                ON Pacientes.CODIGO = Pacientes_Endereco.PAC_CODIGO
                AND Pacientes_Endereco.tipo_endereco = 'R'
            LEFT OUTER JOIN agh.aac_consultas as consultas
                ON consultas.numero = procedimentos.con_numero
            LEFT OUTER JOIN agh.aip_cidades as Cidades
                ON Pacientes_Endereco.cdd_codigo = Cidades.codigo
            LEFT OUTER JOIN agh.aip_cep_logradouros as CEP
                ON CEP.cep = Pacientes_Endereco.bcl_clo_cep
            LEFT OUTER JOIN agh.aip_logradouros as Logradouros
                ON Logradouros.codigo = CEP.lgr_codigo
            LEFT OUTER JOIN agh.aip_cidades as Cidades2
                ON Cidades2.codigo = Logradouros.cdd_codigo
            LEFT OUTER JOIN agh.aip_tipo_logradouros as Tipo_Logradouros
                ON Tipo_Logradouros.codigo = Logradouros.tlg_codigo
            LEFT OUTER JOIN agh.agh_cids as CID
                ON CID.seq = procedimentos.cid_seq
            WHERE 
                procedimentos.dthr_valida BETWEEN '${startDate} 00:00:00' and '${endDate} 23:59:59.999999'
                AND consultas.ret_seq = 10
                AND procedimentos.phi_seq IS NOT NULL
                AND faturamento_procedimentos.cod_tabela NOT IN
                    (SELECT cod_procedimento FROM
                        agh.fat_procedimentos_registro
                        WHERE cod_registro = '01')
                AND faturamento_registros.cod_registro = '02'
                AND consultas.pac_codigo <> 1000001
            `)
            return (result.rows)
        } catch (err) {
            return (err.message)
        }
    }
    /**
     * @param { string } mesAno  - Mês e ano a serem consultados, no formato YYYY-MM
     * @returns {Array|object} array contendo as linhas da consulta
     */
    static async getBPAc(mesAno) {
        const startDate = new Date(
            new Date(`${mesAno}-01`).getFullYear(),
            new Date(`${mesAno}-01`).getMonth() + 1, 1)
            .toISOString().split('T')[0]
        const endDate = new Date(
            new Date(`${mesAno}-01`).getFullYear(),
            new Date(`${mesAno}-01`).getMonth() + 2, 0)
            .toISOString().split('T')[0]
        try {
            const result = await postgresPool.pool.query(`
                (SELECT 
                CASE
                    WHEN servidores_informacoes_cbo2.valor is NULL THEN servidores_informacoes_cbo.valor
                    ELSE servidores_informacoes_cbo2.valor
                END as CBO,
                date_part('year', age(pacientes.dt_nascimento)) as idade,
                count(*) as quantidade,
                -- Regras de Negócio de Consultas:
                -- Caso o profissional seja médico clínico ou professor, aplicar procedimento 03.01.01.007-2
                -- Para os demais, aplicar procedimento 03.01.01.004-8

                CASE
                    WHEN (servidores_informacoes_cbo2.valor like '2251%') or (servidores_informacoes_cbo.valor like '2251%') THEN 0301010072
                    WHEN (servidores_informacoes_cbo2.valor like '2345%') or (servidores_informacoes_cbo.valor like '2345%') THEN 0301010072
                    ELSE 0301010048
                END as procedimento_sus
                -------------------------------------------------------------------

                from agh.aac_consultas as consultas
                -- Informações da Grade
                LEFT JOIN agh.aac_grade_agendamen_consultas as grades ON grades.seq = consultas.grd_seq
                -- Pega informações do retorno, pra saber status da consulta
                LEFT JOIN agh.aac_retornos ret ON ret.seq = consultas.ret_seq 
                -- Informações do Profissional (Dados de Servidor)
                LEFT JOIN agh.rap_servidores as servidores on 
                    servidores.matricula = 
                        (CASE
                            WHEN consultas.ser_matricula_atendido IS NOT NULL THEN consultas.ser_matricula_atendido
                            WHEN consultas.ser_matricula_alterado IS NOT NULL THEN consultas.ser_matricula_alterado	
                            WHEN consultas.ser_matricula_consultado IS NOT NULL THEN consultas.ser_matricula_consultado	
                            WHEN consultas.ser_matricula IS NOT NULL THEN consultas.ser_matricula
                            ELSE NULL
                        END)
                    AND servidores.vin_codigo = 
                        (CASE
                            WHEN consultas.ser_matricula_atendido IS NOT NULL THEN consultas.ser_vin_codigo_atendido
                            WHEN consultas.ser_matricula_alterado IS NOT NULL THEN consultas.ser_vin_codigo_alterado	
                            WHEN consultas.ser_matricula_consultado IS NOT NULL THEN consultas.ser_vin_codigo_consultado	
                            WHEN consultas.ser_matricula IS NOT NULL THEN consultas.ser_vin_codigo
                            ELSE NULL
                        END)

                -- Informações do Profissional (Dados Pessoais)
                LEFT JOIN agh.rap_pessoas_fisicas as pessoas on servidores.pes_codigo = pessoas.codigo

                -- Pega o CNS do Profissional
                LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cns on (
                servidores_informacoes_cns.pes_codigo = pessoas.codigo AND servidores_informacoes_cns.tii_seq = 7
                )
                -- Pega o CBO PRIMARIO do Profissional
                LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo on (
                servidores_informacoes_cbo.pes_codigo = pessoas.codigo AND servidores_informacoes_cbo.tii_seq = 2
                )

                -- Pega o CBO SECUNDARIO do Profissional
                LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo2 on (
                servidores_informacoes_cbo2.pes_codigo = pessoas.codigo AND servidores_informacoes_cbo2.tii_seq = 3
                )
                -- Pega o CBO TERCIARIO do Profissional
                LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes as servidores_informacoes_cbo3 on (
                servidores_informacoes_cbo3.pes_codigo = pessoas.codigo AND servidores_informacoes_cbo3.tii_seq = 4
                )

                LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = consultas.pac_codigo

                where 
                (dt_consulta between '${startDate} 00:00:00' and '${endDate} 23:59:59.999999')
                and ret.descricao <> 'PACIENTE AGENDADO'
                and ret.descricao <> 'AGUARDANDO ATENDIMENTO'
                and ret.descricao <> 'PACIENTE FALTOU'
                and ret.descricao <> 'PROFISSIONAL FALTOU'
                and ret.descricao <> 'EM ATENDIMENTO'
                and ret.descricao <> 'PACIENTE DESISTIU CONS'
                and consultas.pac_codigo <> 1000001
                group by 1, 2, 4)
                UNION
                (SELECT
                    cbos.codigo as cbo,
                    date_part('year', age(pacientes.dt_nascimento)) as idade,
                    SUM(procedimentos.quantidade) as quantidade,
                    faturamento_procedimentos.cod_tabela as procedimento_sus
                FROM agh.mam_proc_realizados as procedimentos
                LEFT OUTER JOIN agh.fat_conv_grupo_itens_proced as faturamento_grupos 
                    on faturamento_grupos.phi_seq = procedimentos.phi_seq
                LEFT OUTER JOIN agh.fat_itens_proced_hospitalar as faturamento_procedimentos 
                    on faturamento_procedimentos.pho_seq = faturamento_grupos.iph_pho_seq
                    and faturamento_procedimentos.seq = faturamento_grupos.iph_seq
                LEFT OUTER JOIN agh.fat_procedimentos_registro as faturamento_registros
                    on faturamento_registros.cod_procedimento =  faturamento_procedimentos.cod_tabela
                LEFT OUTER JOIN agh.fat_cbos as cbos
                    on cbos.seq = procedimentos.cbo
                LEFT OUTER JOIN agh.aip_pacientes as pacientes on pacientes.codigo = procedimentos.pac_codigo
                WHERE 
                procedimentos.dthr_valida BETWEEN '${startDate} 00:00:00' AND '${endDate} 23:59:59.999999'
                AND procedimentos.cbo IS NOT NULL
                AND procedimentos.phi_seq IS NOT NULL
                AND faturamento_registros.cod_registro = '01'
                AND procedimentos.pac_codigo <> 1000001

                group by 1, 2, 4)
                order by 4 desc, 3 desc, 1 asc                
            `)
            return (result.rows)
        } catch (err) {
            return (err.message)
        }
    }
    /**
     * @param { string } start  - data no formato YYYY-MM-DD
     * @param { string } end  - data no formato YYYY-MM-DD
     * @returns {Array|object} array contendo as linhas da consulta
     */
    static async getBPAiByPeriod(start, end): Promise<any> {
        try {
            const result = await postgresPool.pool.query(`
            select
            CONSULTA.NUMERO as Num_Consulta,
            Paciente.PRONTUARIO as Paciente_Prontuario,
            Profissional_Informacoes_CNS.valor as Profissional_CNS,
            Profissional_Servidor_Dados_Pessoais.NOME as Profissional_Nome,
            Profissional_Informacoes_CBO.valor as Profissional_CBO,
            Paciente.NRO_CARTAO_SAUDE as Paciente_Cartao_SUS,
            Paciente.NOME as Paciente_Nome,
            Paciente.SEXO_BIOLOGICO as Paciente_Sexo_Biologico,
            Paciente.DT_NASCIMENTO as Paciente_Data_Nascimento,
            Paciente.NAC_CODIGO as Paciente_Nacionalidade,
            Paciente.COR as Paciente_Cor,
            Paciente_Endereco.BCL_CLO_CEP as Paciente_Endereco_CEP,
            Paciente_Endereco_Cidade.UF_SIGLA as Paciente_Endereço_UF,
            Paciente_Endereco_Cidade.NOME as Paciente_Endereço_Cidade,
            Paciente_Endereco.TIPO_ENDERECO as Paciente_Endereço_Tipo_Logradouro,
            Paciente_Endereco_Logradouro.NOME as Paciente_Endereço_Logradouro,
            Paciente_Endereco.NRO_LOGRADOURO as Paciente_Endereço_Numero,
            Paciente_Endereco.COMPL_LOGRADOURO as Paciente_Endereço_Complemento,
            Paciente_Endereco.BAIRRO as Paciente_Endereco_Bairro,
            Paciente_Contato.DDD as Paciente_Telefone_DDD,-- DIFERE
            Paciente_Contato.NRO_FONE as Paciente_Telefone_Numero,
            CONSULTA.DT_CONSULTA as Data_Consulta,
            fat_itens_proced.cod_tabela as Procedimento_Codigo,
            MAM_Procedimento_Realizado.QUANTIDADE as Procedimento_Quantidade,
            replace(CIDS.codigo, '.', '') as CID
            from
            AGH.AAC_CONSULTAS CONSULTA
            left outer join AGH.AAC_CONDICAO_ATENDIMENTOS Condicao_Atendimento on CONSULTA.FAG_CAA_SEQ = Condicao_Atendimento.SEQ
            inner join AGH.AAC_GRADE_AGENDAMEN_CONSULTAS Grade on CONSULTA.GRD_SEQ = Grade.SEQ
            inner join AGH.AGH_EQUIPES Grade_Equipe on Grade.EQP_SEQ = Grade_Equipe.SEQ
            inner join AGH.RAP_SERVIDORES Pofissional_Responsavel on Grade_Equipe.SER_MATRICULA = Pofissional_Responsavel.MATRICULA
            and Grade_Equipe.SER_VIN_CODIGO = Pofissional_Responsavel.VIN_CODIGO
            inner join AGH.RAP_PESSOAS_FISICAS Pofissional_Responsavel_Dados_Pessoais on Pofissional_Responsavel.PES_CODIGO = Pofissional_Responsavel_Dados_Pessoais.CODIGO
            left outer join AGH.RAP_QUALIFICACOES Pofissional_Responsavel_Qualificacoes on Pofissional_Responsavel_Dados_Pessoais.CODIGO = Pofissional_Responsavel_Qualificacoes.PES_CODIGO
            left outer join AGH.AGH_UNIDADES_FUNCIONAIS Unidade_Funcional on Pofissional_Responsavel.UNF_SEQ_LOTACAO = Unidade_Funcional.SEQ
            left outer join AGH.AGH_ALAS Unidade_Funcional_Ala on Unidade_Funcional.IND_ALA = Unidade_Funcional_Ala.CODIGO
            left outer join AGH.AGH_ESPECIALIDADES Especialidade_Grade on Grade.ESP_SEQ = Especialidade_Grade.SEQ
            left outer join AGH.AGH_ESPECIALIDADES Especialidade_Grade_2 on Especialidade_Grade.ESP_SEQ = Especialidade_Grade_2.SEQ
            left outer join AGH.AGH_PROF_ESPECIALIDADES Profissional_Especialidade on Grade.PRE_ESP_SEQ = Profissional_Especialidade.ESP_SEQ
            and Grade.PRE_SER_MATRICULA = Profissional_Especialidade.SER_MATRICULA
            and Grade.PRE_SER_VIN_CODIGO = Profissional_Especialidade.SER_VIN_CODIGO
            left outer join AGH.RAP_SERVIDORES Profissional_Servidor on Profissional_Especialidade.SER_MATRICULA = Profissional_Servidor.MATRICULA
            and Profissional_Especialidade.SER_VIN_CODIGO = Profissional_Servidor.VIN_CODIGO
            left outer join AGH.RAP_PESSOAS_FISICAS Profissional_Servidor_Dados_Pessoais on Profissional_Servidor.PES_CODIGO = Profissional_Servidor_Dados_Pessoais.CODIGO
            inner join AGH.AGH_UNIDADES_FUNCIONAIS Grade_Unidade_Funcional on Grade.USL_UNF_SEQ = Grade_Unidade_Funcional.SEQ
            left outer join AGH.AIP_PACIENTES Paciente on CONSULTA.PAC_CODIGO = Paciente.CODIGO
            left outer join AGH.AIP_CONTATOS_PACIENTES Paciente_Contato on Paciente.CODIGO = Paciente_Contato.PAC_CODIGO
            left outer join AGH.AIP_ENDERECOS_PACIENTES Paciente_Endereco on Paciente.CODIGO = Paciente_Endereco.PAC_CODIGO
            left outer join AGH.AIP_BAIRROS_CEP_LOGRADOURO Paciente_Endereco_Bairro on Paciente_Endereco.BCL_BAI_CODIGO = Paciente_Endereco_Bairro.BAI_CODIGO
            and Paciente_Endereco.BCL_CLO_CEP = Paciente_Endereco_Bairro.CLO_CEP
            and Paciente_Endereco.BCL_CLO_LGR_CODIGO = Paciente_Endereco_Bairro.CLO_LGR_CODIGO
            left outer join AGH.AIP_BAIRROS Paciente_Endereco_Bairro2 on Paciente_Endereco_Bairro.BAI_CODIGO = Paciente_Endereco_Bairro2.CODIGO
            left outer join AGH.AIP_LOGRADOUROS Paciente_Endereco_Logradouro on Paciente_Endereco_Bairro.CLO_LGR_CODIGO = Paciente_Endereco_Logradouro.CODIGO
            left outer join AGH.AIP_CIDADES Paciente_Endereco_Cidade on Paciente_Endereco_Logradouro.CDD_CODIGO = Paciente_Endereco_Cidade.CODIGO
            left outer join AGH.AIP_CIDADES Paciente_Endereco_Cidade2 on Paciente_Endereco_Cidade.COD_CIDADE = Paciente_Endereco_Cidade2.CODIGO
            left outer join AGH.AIP_UFS Paciente_Endereco_UF on Paciente_Endereco_Cidade2.UF_SIGLA = Paciente_Endereco_UF.SIGLA
            left outer join AGH.AIP_PAISES Paciente_Endereco_Pais on Paciente_Endereco_UF.PAS_SIGLA = Paciente_Endereco_Pais.SIGLA
            left outer join AGH.AIP_TIPO_LOGRADOUROS Paciente_Endereco_Logradouro_Tipo on Paciente_Endereco_Logradouro.TLG_CODIGO = Paciente_Endereco_Logradouro_Tipo.CODIGO
            left outer join AGH.AIP_TITULO_LOGRADOUROS aiptitulol53_ on Paciente_Endereco_Logradouro.TIT_CODIGO = aiptitulol53_.CODIGO
            left outer join AGH.AIP_CEP_LOGRADOUROS Paciente_Endereco_Logradouro_CEP on Paciente_Endereco_Bairro.CLO_CEP = Paciente_Endereco_Logradouro_CEP.CEP
            and Paciente_Endereco_Bairro.CLO_LGR_CODIGO = Paciente_Endereco_Logradouro_CEP.LGR_CODIGO
            left outer join AGH.AIP_LOGRADOUROS Paciente_Endereco_Logradouro_CEP2 on Paciente_Endereco_Logradouro_CEP.LGR_CODIGO = Paciente_Endereco_Logradouro_CEP2.CODIGO
            left outer join AGH.AIP_CIDADES aipcidades56_ on Paciente_Endereco.CDD_CODIGO = aipcidades56_.CODIGO
            left outer join AGH.AIP_LOGRADOUROS Paciente_Endereco_Logradouro_CEP3 on Paciente_Endereco.BCL_CLO_LGR_CODIGO = Paciente_Endereco_Logradouro_CEP3.CODIGO
            left outer join AGH.AIP_UFS Paciente_Endereco_UF2 on Paciente_Endereco.UF_SIGLA = Paciente_Endereco_UF2.SIGLA
            left outer join AGH.AIP_PACIENTE_DADO_CLINICOS Paciente_Dados_Clinicos on Paciente.CODIGO = Paciente_Dados_Clinicos.PAC_CODIGO
            left outer join AGH.AIP_PACIENTES_DADOS_CNS Paciente_Dados_CNS on Paciente.CODIGO = Paciente_Dados_CNS.PAC_CODIGO       
            left outer join AGH.AIP_GRUPO_FAMILIAR_PACIENTES Paciente_Grupo_Familiar on Paciente.CODIGO = Paciente_Grupo_Familiar.PAC_CODIGO
            left outer join AGH.AAC_PAGADORES Pagador on CONSULTA.FAG_PGD_SEQ = Pagador.SEQ
            left outer join AGH.FAT_PROCED_AMB_REALIZADOS Faturamento_Procedimento_Realizado on CONSULTA.NUMERO = Faturamento_Procedimento_Realizado.PRH_CON_NUMERO
            left outer join AGH.AAC_CONSULTA_PROCED_HOSPITALAR Consulta_Procedimento_Hospitalar on CONSULTA.NUMERO = Consulta_Procedimento_Hospitalar.CON_NUMERO
            left outer join AGH.FAT_PROCED_HOSP_INTERNOS Procedimento_Interno on Consulta_Procedimento_Hospitalar.PHI_SEQ = Procedimento_Interno.SEQ
            left outer join AGH.MAM_PROC_REALIZADOS MAM_Procedimento_Realizado on CONSULTA.NUMERO = MAM_Procedimento_Realizado.CON_NUMERO
            left outer join AGH.AAC_RETORNOS Retorno on CONSULTA.RET_SEQ = Retorno.SEQ
            inner join AGH.RAP_SERVIDORES Servidor_Cadastro on CONSULTA.SER_MATRICULA = Servidor_Cadastro.MATRICULA
            and CONSULTA.SER_VIN_CODIGO = Servidor_Cadastro.VIN_CODIGO
            left outer join AGH.RAP_PESSOAS_FISICAS Servidor_Cadastro_Dados_Pessoais on Servidor_Cadastro.PES_CODIGO = Servidor_Cadastro_Dados_Pessoais.CODIGO
            left outer join AGH.AAC_SITUACAO_CONSULTAS Situacao_Consulta on CONSULTA.STC_SITUACAO = Situacao_Consulta.SITUACAO
            left outer join AGH.AAC_TIPO_AGENDAMENTOS Tipo_Agendamento on CONSULTA.FAG_TAG_SEQ = Tipo_Agendamento.SEQ
            LEFT OUTER JOIN AGH.FAT_CONV_GRUPO_ITENS_PROCED fat_grupo ON Faturamento_Procedimento_Realizado.PRH_PHI_SEQ = fat_grupo.phi_seq
            LEFT OUTER JOIN AGH.FAT_ITENS_PROCED_HOSPITALAR fat_itens_proced ON fat_grupo.IPH_PHO_SEQ = fat_itens_proced.PHO_SEQ
            AND fat_grupo.IPH_SEQ = fat_itens_proced.SEQ 
            --	LEFT OUTER JOIN
            --		agh.fat_cbos CBO
            --			on CBO.seq = Faturamento_Procedimento_Realizado.PRH_PHI_SEQ
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes Profissional_Informacoes_CBO on (
                Profissional_Informacoes_CBO.pes_codigo = Profissional_Servidor_Dados_Pessoais.codigo
                AND Profissional_Informacoes_CBO.tii_seq = 2
            )
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes Profissional_Informacoes_CNS on (
                Profissional_Informacoes_CNS.pes_codigo = Profissional_Servidor_Dados_Pessoais.codigo
                AND Profissional_Informacoes_CNS.tii_seq = 7
            )
            LEFT OUTER JOIN agh.agh_cids as CIDS
                on CIDS.seq = Faturamento_Procedimento_Realizado.cid_seq
            where
            CONSULTA.DT_CONSULTA between '${start}' and '${end}'
            order by
            Paciente.NOME asc,
            Paciente.PRONTUARIO asc,
            CONSULTA.DT_CONSULTA asc
            `)
            return (result.rows)
        } catch (err) {
            console.error(err.message)
            return (err.message)
        }
    }

    /**
     * @param { number } atendimento  - número do atendimento
     * @returns {Array|object} array contendo as linhas da consulta
     */
    static async getBPA(atendimento) {
        try {
            const result = await postgresPool.pool.query(`
            select
            CONSULTA.NUMERO as Num_Consulta,
            Paciente.PRONTUARIO as Paciente_Prontuario,
            Profissional_Informacoes_CNS.valor as Profissional_CNS,
            Profissional_Servidor_Dados_Pessoais.NOME as Profissional_Nome,
            Profissional_Informacoes_CBO.valor as Profissional_CBO,
            Paciente.NRO_CARTAO_SAUDE as Paciente_Cartao_SUS,
            Paciente.NOME as Paciente_Nome,
            Paciente.SEXO_BIOLOGICO as Paciente_Sexo_Biologico,
            Paciente.DT_NASCIMENTO as Paciente_Data_Nascimento,
            Paciente.NAC_CODIGO as Paciente_Nacionalidade,
            Paciente.COR as Paciente_Cor,
            Paciente_Endereco.BCL_CLO_CEP as Paciente_Endereco_CEP,
            Paciente_Endereco_Cidade.UF_SIGLA as Paciente_Endereço_UF,
            Paciente_Endereco_Cidade.NOME as Paciente_Endereço_Cidade,
            Paciente_Endereco.TIPO_ENDERECO as Paciente_Endereço_Tipo_Logradouro,
            Paciente_Endereco_Logradouro.NOME as Paciente_Endereço_Logradouro,
            Paciente_Endereco.NRO_LOGRADOURO as Paciente_Endereço_Numero,
            Paciente_Endereco.COMPL_LOGRADOURO as Paciente_Endereço_Complemento,
            Paciente_Endereco.BAIRRO as Paciente_Endereco_Bairro,
            Paciente_Contato.DDD as Paciente_Telefone_DDD,-- DIFERE
            Paciente_Contato.NRO_FONE as Paciente_Telefone_Numero,
            CONSULTA.DT_CONSULTA as Data_Consulta,
            fat_itens_proced.cod_tabela as Procedimento_Codigo,
            MAM_Procedimento_Realizado.QUANTIDADE as Procedimento_Quantidade,
            replace(CIDS.codigo, '.', '') as CID
            from
            AGH.AAC_CONSULTAS CONSULTA
            left outer join AGH.AAC_CONDICAO_ATENDIMENTOS Condicao_Atendimento on CONSULTA.FAG_CAA_SEQ = Condicao_Atendimento.SEQ
            inner join AGH.AAC_GRADE_AGENDAMEN_CONSULTAS Grade on CONSULTA.GRD_SEQ = Grade.SEQ
            inner join AGH.AGH_EQUIPES Grade_Equipe on Grade.EQP_SEQ = Grade_Equipe.SEQ
            inner join AGH.RAP_SERVIDORES Pofissional_Responsavel on Grade_Equipe.SER_MATRICULA = Pofissional_Responsavel.MATRICULA
            and Grade_Equipe.SER_VIN_CODIGO = Pofissional_Responsavel.VIN_CODIGO
            inner join AGH.RAP_PESSOAS_FISICAS Pofissional_Responsavel_Dados_Pessoais on Pofissional_Responsavel.PES_CODIGO = Pofissional_Responsavel_Dados_Pessoais.CODIGO
            left outer join AGH.RAP_QUALIFICACOES Pofissional_Responsavel_Qualificacoes on Pofissional_Responsavel_Dados_Pessoais.CODIGO = Pofissional_Responsavel_Qualificacoes.PES_CODIGO
            left outer join AGH.AGH_UNIDADES_FUNCIONAIS Unidade_Funcional on Pofissional_Responsavel.UNF_SEQ_LOTACAO = Unidade_Funcional.SEQ
            left outer join AGH.AGH_ALAS Unidade_Funcional_Ala on Unidade_Funcional.IND_ALA = Unidade_Funcional_Ala.CODIGO
            left outer join AGH.AGH_ESPECIALIDADES Especialidade_Grade on Grade.ESP_SEQ = Especialidade_Grade.SEQ
            left outer join AGH.AGH_ESPECIALIDADES Especialidade_Grade_2 on Especialidade_Grade.ESP_SEQ = Especialidade_Grade_2.SEQ
            left outer join AGH.AGH_PROF_ESPECIALIDADES Profissional_Especialidade on Grade.PRE_ESP_SEQ = Profissional_Especialidade.ESP_SEQ
            and Grade.PRE_SER_MATRICULA = Profissional_Especialidade.SER_MATRICULA
            and Grade.PRE_SER_VIN_CODIGO = Profissional_Especialidade.SER_VIN_CODIGO
            left outer join AGH.RAP_SERVIDORES Profissional_Servidor on Profissional_Especialidade.SER_MATRICULA = Profissional_Servidor.MATRICULA
            and Profissional_Especialidade.SER_VIN_CODIGO = Profissional_Servidor.VIN_CODIGO
            left outer join AGH.RAP_PESSOAS_FISICAS Profissional_Servidor_Dados_Pessoais on Profissional_Servidor.PES_CODIGO = Profissional_Servidor_Dados_Pessoais.CODIGO
            inner join AGH.AGH_UNIDADES_FUNCIONAIS Grade_Unidade_Funcional on Grade.USL_UNF_SEQ = Grade_Unidade_Funcional.SEQ
            left outer join AGH.AIP_PACIENTES Paciente on CONSULTA.PAC_CODIGO = Paciente.CODIGO
            left outer join AGH.AIP_CONTATOS_PACIENTES Paciente_Contato on Paciente.CODIGO = Paciente_Contato.PAC_CODIGO
            left outer join AGH.AIP_ENDERECOS_PACIENTES Paciente_Endereco on Paciente.CODIGO = Paciente_Endereco.PAC_CODIGO
            left outer join AGH.AIP_BAIRROS_CEP_LOGRADOURO Paciente_Endereco_Bairro on Paciente_Endereco.BCL_BAI_CODIGO = Paciente_Endereco_Bairro.BAI_CODIGO
            and Paciente_Endereco.BCL_CLO_CEP = Paciente_Endereco_Bairro.CLO_CEP
            and Paciente_Endereco.BCL_CLO_LGR_CODIGO = Paciente_Endereco_Bairro.CLO_LGR_CODIGO
            left outer join AGH.AIP_BAIRROS Paciente_Endereco_Bairro2 on Paciente_Endereco_Bairro.BAI_CODIGO = Paciente_Endereco_Bairro2.CODIGO
            left outer join AGH.AIP_LOGRADOUROS Paciente_Endereco_Logradouro on Paciente_Endereco_Bairro.CLO_LGR_CODIGO = Paciente_Endereco_Logradouro.CODIGO
            left outer join AGH.AIP_CIDADES Paciente_Endereco_Cidade on Paciente_Endereco_Logradouro.CDD_CODIGO = Paciente_Endereco_Cidade.CODIGO
            left outer join AGH.AIP_CIDADES Paciente_Endereco_Cidade2 on Paciente_Endereco_Cidade.COD_CIDADE = Paciente_Endereco_Cidade2.CODIGO
            left outer join AGH.AIP_UFS Paciente_Endereco_UF on Paciente_Endereco_Cidade2.UF_SIGLA = Paciente_Endereco_UF.SIGLA
            left outer join AGH.AIP_PAISES Paciente_Endereco_Pais on Paciente_Endereco_UF.PAS_SIGLA = Paciente_Endereco_Pais.SIGLA
            left outer join AGH.AIP_TIPO_LOGRADOUROS Paciente_Endereco_Logradouro_Tipo on Paciente_Endereco_Logradouro.TLG_CODIGO = Paciente_Endereco_Logradouro_Tipo.CODIGO
            left outer join AGH.AIP_TITULO_LOGRADOUROS aiptitulol53_ on Paciente_Endereco_Logradouro.TIT_CODIGO = aiptitulol53_.CODIGO
            left outer join AGH.AIP_CEP_LOGRADOUROS Paciente_Endereco_Logradouro_CEP on Paciente_Endereco_Bairro.CLO_CEP = Paciente_Endereco_Logradouro_CEP.CEP
            and Paciente_Endereco_Bairro.CLO_LGR_CODIGO = Paciente_Endereco_Logradouro_CEP.LGR_CODIGO
            left outer join AGH.AIP_LOGRADOUROS Paciente_Endereco_Logradouro_CEP2 on Paciente_Endereco_Logradouro_CEP.LGR_CODIGO = Paciente_Endereco_Logradouro_CEP2.CODIGO
            left outer join AGH.AIP_CIDADES aipcidades56_ on Paciente_Endereco.CDD_CODIGO = aipcidades56_.CODIGO
            left outer join AGH.AIP_LOGRADOUROS Paciente_Endereco_Logradouro_CEP3 on Paciente_Endereco.BCL_CLO_LGR_CODIGO = Paciente_Endereco_Logradouro_CEP3.CODIGO
            left outer join AGH.AIP_UFS Paciente_Endereco_UF2 on Paciente_Endereco.UF_SIGLA = Paciente_Endereco_UF2.SIGLA
            left outer join AGH.AIP_PACIENTE_DADO_CLINICOS Paciente_Dados_Clinicos on Paciente.CODIGO = Paciente_Dados_Clinicos.PAC_CODIGO
            left outer join AGH.AIP_PACIENTES_DADOS_CNS Paciente_Dados_CNS on Paciente.CODIGO = Paciente_Dados_CNS.PAC_CODIGO       
            left outer join AGH.AIP_GRUPO_FAMILIAR_PACIENTES Paciente_Grupo_Familiar on Paciente.CODIGO = Paciente_Grupo_Familiar.PAC_CODIGO
            left outer join AGH.AAC_PAGADORES Pagador on CONSULTA.FAG_PGD_SEQ = Pagador.SEQ
            left outer join AGH.FAT_PROCED_AMB_REALIZADOS Faturamento_Procedimento_Realizado on CONSULTA.NUMERO = Faturamento_Procedimento_Realizado.PRH_CON_NUMERO
            left outer join AGH.AAC_CONSULTA_PROCED_HOSPITALAR Consulta_Procedimento_Hospitalar on CONSULTA.NUMERO = Consulta_Procedimento_Hospitalar.CON_NUMERO
            left outer join AGH.FAT_PROCED_HOSP_INTERNOS Procedimento_Interno on Consulta_Procedimento_Hospitalar.PHI_SEQ = Procedimento_Interno.SEQ
            left outer join AGH.MAM_PROC_REALIZADOS MAM_Procedimento_Realizado on CONSULTA.NUMERO = MAM_Procedimento_Realizado.CON_NUMERO
            left outer join AGH.AAC_RETORNOS Retorno on CONSULTA.RET_SEQ = Retorno.SEQ
            inner join AGH.RAP_SERVIDORES Servidor_Cadastro on CONSULTA.SER_MATRICULA = Servidor_Cadastro.MATRICULA
            and CONSULTA.SER_VIN_CODIGO = Servidor_Cadastro.VIN_CODIGO
            left outer join AGH.RAP_PESSOAS_FISICAS Servidor_Cadastro_Dados_Pessoais on Servidor_Cadastro.PES_CODIGO = Servidor_Cadastro_Dados_Pessoais.CODIGO
            left outer join AGH.AAC_SITUACAO_CONSULTAS Situacao_Consulta on CONSULTA.STC_SITUACAO = Situacao_Consulta.SITUACAO
            left outer join AGH.AAC_TIPO_AGENDAMENTOS Tipo_Agendamento on CONSULTA.FAG_TAG_SEQ = Tipo_Agendamento.SEQ
            LEFT OUTER JOIN AGH.FAT_CONV_GRUPO_ITENS_PROCED fat_grupo ON Faturamento_Procedimento_Realizado.PRH_PHI_SEQ = fat_grupo.phi_seq
            LEFT OUTER JOIN AGH.FAT_ITENS_PROCED_HOSPITALAR fat_itens_proced ON fat_grupo.IPH_PHO_SEQ = fat_itens_proced.PHO_SEQ
            AND fat_grupo.IPH_SEQ = fat_itens_proced.SEQ 
            --	LEFT OUTER JOIN
            --		agh.fat_cbos CBO
            --			on CBO.seq = Faturamento_Procedimento_Realizado.PRH_PHI_SEQ
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes Profissional_Informacoes_CBO on (
                Profissional_Informacoes_CBO.pes_codigo = Profissional_Servidor_Dados_Pessoais.codigo
                AND Profissional_Informacoes_CBO.tii_seq = 2
            )
            LEFT OUTER JOIN agh.rap_pessoa_tipo_informacoes Profissional_Informacoes_CNS on (
                Profissional_Informacoes_CNS.pes_codigo = Profissional_Servidor_Dados_Pessoais.codigo
                AND Profissional_Informacoes_CNS.tii_seq = 7
            )
            LEFT OUTER JOIN agh.agh_cids as CIDS
                on CIDS.seq = Faturamento_Procedimento_Realizado.cid_seq
            where
            consulta.numero = ${atendimento}
            order by
            Paciente.NOME asc,
            Paciente.PRONTUARIO asc,
            CONSULTA.DT_CONSULTA asc
            `)
            return (result.rows)
        } catch (err) {
            console.error(err.message)
            return (err.message)
        }
    }

}