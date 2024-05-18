const mysql = require('mysql2')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'getapet',
})

module.exports = pool

/* function hello(){
const sql = `INSERT INTO catioro (nome) VALUES ('13')`
pool.query(sql,function(err,data){
    if(err){
        console.log(err)
        return
    }
})
}
 */