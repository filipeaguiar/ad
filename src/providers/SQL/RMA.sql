SELECT
  mat.gmt_codigo cod_grupo,
  grupo.descricao AS grupo,
  nf.tipo as tipo_nota,
  TO_CHAR(nf.dt_geracao, 'YYYY-MM-DD') AS dt_geracao,
  TO_CHAR(dt_entrada,'YYYY-MM-DD') AS dt_entrada,
  TO_CHAR(dt_emissao,'YYYY-MM-DD') AS dt_emissao,
  nf.numero AS nota_fiscal,
  razao_social AS fornecedor,
  fo.cgc AS cnpj,
  mat.codigo AS codigo_material,
  mat.nome,
  item.quantidade,
  item.valor AS valor_total
FROM
  agh.sce_documento_fiscal_entradas nf,
  agh.sco_fornecedores fo,
  agh.sce_item_nrs item,
  agh.sco_materiais mat,
  agh.sce_nota_recebimentos nota,
  agh.sco_grupos_materiais grupo
WHERE
  nf.frn_numero = fo.numero
  AND item.mat_codigo = mat.codigo
  AND nota.dfe_seq = nf.seq
  AND item.nrs_seq = nota.seq
  AND mat.gmt_codigo = grupo.codigo
  AND nota.ind_estorno = 'N';
