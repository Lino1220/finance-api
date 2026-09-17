const { Pool, types } = require('pg');
require('dotenv').config();

types.setTypeParser(1082, valor => valor);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function testarConexao() {
    try {
        const resultado = await pool.query('SELECT NOW()');
        console.log('✅ Conectado ao PostgreSQL');
        console.log('🕒 Hora do banco:', resultado.rows[0].now);
    } catch (erro) {
        console.error('❌ Erro ao conectar ao PostgreSQL:', erro.message);
    }
}

testarConexao();

module.exports = pool;