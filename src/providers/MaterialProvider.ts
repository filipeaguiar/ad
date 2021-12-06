import postgresPool from "../resources/postgres"

export default class MaterialProvider {
  /**
   * @returns {Array|object} array contendo as linhas da consulta
   */
  static async getMaterial() {
    try {
      const result = await postgresPool.pool.query(`
            select
    a.seq
    ,a.descricao
    ,m.GMT_CODIGO as "Grupo SIAFI"
    ,m.CODIGO as "Codigo do Material"
    ,replace(m.NOME, '"', '') as "Material"
    ,ea.UMD_CODIGO as "Unidade de Medida"
    ,lm.codigo as "Lote"
    ,to_char(lm.dt_validade, 'dd/mm/yyyy') as "Data de Validade"
    ,ea.QTDE_BLOQUEADA as "Quantidade Bloqueada"
    ,ea.QTDE_DISPONIVEL as "Quantidade Disponivel"
    ,ea.QTDE_BLOQUEADA + ea.QTDE_DISPONIVEL as "Saldo"
    ,NULL as "Quantidade Contada"
    ,eg.custo_medio_ponderado as "Custo Medio"
    ,(eg.custo_medio_ponderado * (ea.QTDE_BLOQUEADA + ea.QTDE_DISPONIVEL)) as "Valor"
    FROM        AGH.SCE_ALMOXARIFADOS a
    INNER JOIN  AGH.SCE_ESTQ_ALMOXS ea      ON (a.seq = ea.alm_seq)
    INNER JOIN  AGH.SCO_MATERIAIS m         ON (ea.MAT_CODIGO = m.CODIGO)
    INNER JOIN  agh.sce_estq_gerais eg      ON (eg.mat_codigo = m.codigo and eg.qtde <> 0)
    LEFT JOIN   agh.sce_lotes_materiais lm  ON (lm.mat_codigo = m.codigo and lm.seq = ea.lote_seq)
    WHERE   ((COALESCE(ea.qtde_disponivel, 0) + COALESCE(ea.qtde_bloqueada, 0)) > 0) 
    AND   m.IND_SITUACAO = 'A'
    AND   m.IND_ESTOCAVEL = 'S' 
    AND   ea.IND_SITUACAO = 'A'
    ORDER BY    a.seq, m.GMT_CODIGO asc, m.codigo asc;
    `)
      return (result.rows)
    } catch (err) {
      console.error(err.message)
      return (err.message)
    }
  }
}