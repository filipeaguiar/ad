import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {
    PG_USER,
    PG_PASSWORD,
    PG_DB,
    PG_HOST,
    PG_PORT,
    PG_GESTAN_USER,
    PG_GESTAN_PASSWORD,
    PG_GESTAN_DB,
    PG_GESTAN_HOST,
    PG_GESTAN_PORT,
    PG_METABASE_USER,
    PG_METABASE_PASSWORD,
    PG_METABASE_DB,
    PG_METABASE_HOST,
    PG_METABASE_PORT
} = process.env


export default class db {
    public static pool = new Pool({
        user: PG_USER,
        password: PG_PASSWORD,
        host: PG_HOST,
        port: Number(PG_PORT),
        database: PG_DB,
        ssl: false,
        max: 5,
        idleTimeoutMillis: 30000
    })

    public static poolGestam = new Pool({
        user: PG_GESTAN_USER,
        password: PG_GESTAN_PASSWORD,
        host: PG_GESTAN_HOST,
        port: Number(PG_GESTAN_PORT),
        database: PG_GESTAN_DB
    })

    public static poolMetabase = new Pool({
        user: PG_METABASE_USER,
        password: PG_METABASE_PASSWORD,
        host: PG_METABASE_HOST,
        port: Number(PG_METABASE_PORT),
        database: PG_METABASE_DB
    })
}
