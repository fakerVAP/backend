const {Pool} = require('pg')

const pool = new Pool({
    user: "postgres",
    host: "db.vjhrwtjkbyvtrayjifdr.supabase.co",
    database: "postgres",
    password:"Duongchan123@",
    port:5432
})
module.exports = pool