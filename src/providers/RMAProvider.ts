import db from "../resources/postgres"

export default class RMAProvider {
    /**
     * @param { string } start  - data no formato YYYY-MM-DD
     * @param { string } end  - data no formato YYYY-MM-DD
     * @returns {Array|object} array contendo as linhas da consulta
     */

    static async getRMAByPeriod(start, end): Promise<any> {
        try {
            const result = await db.pool.query(`
            SELECT 
            dfe.numero AS "nro_nf",
            dfe.tipo as tipo_nota,
            dfe.numero_nota_empenho as "nro_empenho", 
            to_char(dfe.dt_entrada, 'dd-MM-YYYY'::text) AS data_entrada,
            date_part('month'::text, dfe.dt_geracao) AS "mes_geracao",
            to_char(dfe.dt_geracao, 'dd-MM-YYYY'::text) AS data_geracao,
            to_char(dfe.dt_emissao, 'dd-MM-YYYY'::text) AS data_emissao,
            dfe.valor_total_nf AS "valor_nf",
            grp.codigo AS "cod_grupo_material",
            grp.descricao AS "grp_material",
            alm.descricao AS "almoxarifado",
            frn.razao_social AS "fornecedor",
            frn.cgc as "cnpj"
            FROM agh.sce_documento_fiscal_entradas dfe
            FULL JOIN agh.sco_fornecedores frn ON dfe.seq = frn.numero
            FULL JOIN agh.sce_nota_recebimentos rec ON dfe.seq = rec.dfe_seq
            FULL JOIN agh.sce_movimento_materiais mov ON rec.afn_numero = mov.nro_doc_geracao
            FULL JOIN agh.sco_materiais mat ON mov.mat_codigo = mat.codigo
            FULL JOIN agh.sco_grupos_materiais grp ON mat.gmt_codigo = grp.codigo
            FULL JOIN agh.sce_almoxarifados alm ON mov.alm_seq = alm.seq
            WHERE
            (mov.historico::text <> 'null'::text) AND (dfe.numero_nota_empenho::text <> 'null') AND (dfe.dt_entrada between '${start}' and '${end}' )
            ORDER BY
            dfe.dt_entrada, dfe.numero;
            `)
            return (result.rows)
        } catch (err) {
            console.error(err.message)
            return (err.message)
        }
    }

    /**
     * @returns {Array|object} array contendo as linhas da consulta
     */
    static async getRMA() {
        try {
            const result = await db.pool.query(`
            SELECT 
            dfe.numero AS "nro_nf",
            dfe.tipo as tipo_nota,
            dfe.numero_nota_empenho as "nro_empenho", 
            to_char(dfe.dt_entrada, 'dd-MM-YYYY'::text) AS data_entrada,
            date_part('month'::text, dfe.dt_geracao) AS "mes_geracao",
            to_char(dfe.dt_geracao, 'dd-MM-YYYY'::text) AS data_geracao,
            to_char(dfe.dt_emissao, 'dd-MM-YYYY'::text) AS data_emissao,
            dfe.valor_total_nf AS "valor_nf",
            grp.codigo AS "cod_grupo_material",
            grp.descricao AS "grp_material",
            alm.descricao AS "almoxarifado",
            frn.razao_social AS "fornecedor",
            frn.cgc as "cnpj"
            FROM agh.sce_documento_fiscal_entradas dfe
            FULL JOIN agh.sco_fornecedores frn ON dfe.seq = frn.numero
            FULL JOIN agh.sce_nota_recebimentos rec ON dfe.seq = rec.dfe_seq
            FULL JOIN agh.sce_movimento_materiais mov ON rec.afn_numero = mov.nro_doc_geracao
            FULL JOIN agh.sco_materiais mat ON mov.mat_codigo = mat.codigo
            FULL JOIN agh.sco_grupos_materiais grp ON mat.gmt_codigo = grp.codigo
            FULL JOIN agh.sce_almoxarifados alm ON mov.alm_seq = alm.seq
            WHERE
            (mov.historico::text <> 'null'::text) AND (dfe.numero_nota_empenho::text <> 'null')
            ORDER BY
            dfe.dt_entrada, dfe.numero;
            `)
            return (result.rows)
        } catch (err) {
            console.error(err.message)
            return (err.message)
        }
    }
}