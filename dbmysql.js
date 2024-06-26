require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Xatolik yuz berdi:', err.stack);
  } else {
    console.log('MySQL-ga ulanish hosil qilindi');
  }
});

module.exports = connection;