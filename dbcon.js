const mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'us-cdbr-iron-east-05.cleardb.net',
    user            : 'b50f19280fb654',
    password        : '77bd6415',
    database        : 'heroku_5cf74b198e26c53',
    port            : '3306'
});

module.exports.pool = pool;