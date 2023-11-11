const mysql = require('mysql2');
// require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker_db'
});

db.on('error', (err)=>{
    console.log('- STATS MYsql2 connection died:', err);
});

module.exports = db;