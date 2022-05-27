import postgresPool from "../resources/postgres";

export default class RelatorioConsultasProvider {
  static async getRelatorioConsultas(mesAno): Promise<any> {
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
        SELECT UNIDADES.DESCRICAO AS ZONA,
              CONDICOES.DESCRICAO AS CONDICAO,
              CASE
                  WHEN CONSULTAS.IND_SIT_CONSULTA = 'M' THEN 'MARCADA'
                    WHEN CONSULTAS.IND_SIT_CONSULTA = 'L' THEN 'LIVRE'
                    WHEN CONSULTAS.IND_SIT_CONSULTA = 'G' THEN 'GERADA'
                    WHEN CONSULTAS.IND_SIT_CONSULTA = 'E' THEN 'EXCLUIDA'
                    ELSE CONSULTAS.IND_SIT_CONSULTA
                    END AS MARCACAO,
              CASE
                  WHEN CONSULTAS.RET_SEQ = 20 THEN 'AGUARDANDO ATENDIMENTO'
                    WHEN CONSULTAS.RET_SEQ = 60 THEN 'EM ATENDIMENTO'
                    WHEN CONSULTAS.RET_SEQ = 9  THEN 'PACIENTE AGENDADO'
                    WHEN CONSULTAS.RET_SEQ = 10 THEN 'PACIENTE ATENDIDO'
                    WHEN CONSULTAS.RET_SEQ = 50 THEN 'PACIENTE DESISTIU DA CONSULTA'
                    WHEN CONSULTAS.RET_SEQ = 40 THEN 'PACIENTE FALTOU'
                    WHEN CONSULTAS.RET_SEQ = 30 THEN 'PROFISSIONAL FALTOU'
                    WHEN CONSULTAS.RET_SEQ IS NULL THEN ''
                    END AS STATUS,
                    count (*) as Quantidade
          FROM AGH.AAC_CONSULTAS AS CONSULTAS
          LEFT OUTER JOIN AGH.AAC_CONDICAO_ATENDIMENTOS AS CONDICOES
            ON CONSULTAS.FAG_CAA_SEQ = CONDICOES.SEQ
          LEFT OUTER JOIN AGH.AAC_GRADE_AGENDAMEN_CONSULTAS AS GRADES
            ON GRADES.SEQ = CONSULTAS.GRD_SEQ
          LEFT OUTER JOIN AGH.AGH_UNIDADES_FUNCIONAIS AS UNIDADES
            ON UNIDADES.SEQ = GRADES.USL_UNF_SEQ
        WHERE UNIDADES.TUF_SEQ = 2
        AND CONSULTAS.DT_CONSULTA BETWEEN '${startDate}' AND '${endDate} 23:59:59.999999'
        AND (CONSULTAS.ind_sit_consulta = 'M' or CONSULTAS.ind_sit_consulta = 'L')
        GROUP BY 1,2,3,4      
      `)
      return result.rows
    }
    catch (err) {
      console.log(err)
      return err.message
    }
  }
}