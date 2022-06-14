const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "Tour Management System",
});

module.exports = pool;