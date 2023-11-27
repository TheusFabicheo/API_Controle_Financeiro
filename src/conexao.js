const {Pool} = require('pg');
const dotenv = require('dotenv');

dotenv.config()

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: process.env.DB_PSW,
    port: 5432,
    database: 'dindin'
})

module.exports = pool;