import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { PG_USER, PG_PASSWORD, PG_DB, PG_HOST, PG_PORT } = process.env

export default class db {
    public static pool = new Pool({
        user: PG_USER,
        password: PG_PASSWORD,
        host: PG_HOST,
        port: Number(PG_PORT),
        database: PG_DB
    })
}
