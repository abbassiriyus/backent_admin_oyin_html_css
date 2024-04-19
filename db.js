require('dotenv').config()
const pg =require('pg');

const { Pool,Client } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL ,
})

// const pool = new Client({
//     user: "abbasuz1_abbas",
//     host: "localhost",
//     database: "abbasuz1_oyin",
//     password: "(R}7,P=dgv*Yn",
// })
  

pool.connect(err => {
    if(err) {
        console.log(err);
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool