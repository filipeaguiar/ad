import postgresPool from "../resources/postgres";

export default class InternacaoProvider {
  static async getInternacoes(): Promise<any> {
    try {
      const result = await postgresPool.pool.query(`
        SELECT
          internacoes.seq,
          especialidades.nome_especialidade enfermaria,
          internacoes.lto_lto_id as numero_leito,
          internacoes.dthr_internacao as data_internacao,
          (internacoes.dthr_alta_medica::date - internacoes.dthr_internacao::date) as tempo_ocupacao,
          leitos.ind_acompanhamento_ccih as ccih
        FROM agh.ain_internacoes as internacoes
        LEFT OUTER JOIN agh.agh_especialidades as especialidades
          ON especialidades.seq = internacoes.esp_seq
        LEFT OUTER JOIN agh.ain_leitos as leitos
          ON internacoes.lto_lto_id = leitos.lto_id
        WHERE leitos.ind_situacao = 'A'
        ORDER BY tempo_ocupacao
      `)
      return result.rows
    }
    catch (err) {
      console.log(err)
      return err.message
    }
  }
}