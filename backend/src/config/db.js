const { Pool } = require('pg');

/*const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres', // must exist
    user: process.env.USER || undefined, // macOS username
    password: null
});*/

const pool = new Pool({
    host: 'postgresql',
    port: 5432,
    database: 'appdb',
    user: 'appuser',
    password: 'apppass'
});

module.exports = pool;

