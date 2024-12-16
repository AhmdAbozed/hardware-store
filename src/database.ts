//There is a DB for testing and one for production, ENV variable determines which should pg use

import dotenv from 'dotenv'

import pg from "pg";

const { Pool } = pg;

let client= new Pool();

dotenv.config()

const {
    PG_HOST,
    PG_DB,
    PG_TEST_DB,
    PG_USER,
    PG_PASS,
    ENV
} = process.env



if (ENV == 'dev'){
 client = new Pool({
    host: PG_HOST,
    database: PG_DB,
    user: PG_USER,
    password: PG_PASS
})
}

if (ENV == 'test'){
    client = new Pool({
        host: PG_HOST,
        database: PG_TEST_DB,
        user: PG_USER,
        password: PG_PASS
    })
}

export default client