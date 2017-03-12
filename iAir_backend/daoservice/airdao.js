var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host: '118.89.26.25',
    user: 'root',
    password: 'Zheng1@06',
    database: 'iair',
    port: 3306
});

exports.dataCenter = function(sql, fn) {
    pool.getConnection(function(err, conn) {
        console.log("test");
        if (err) {
            console.log("pool ==>" + err);
            return fn(err);
        } else {
            conn.query(sql, function(err, res) {
                conn.release();
                return fn(res);
            });
        }
    });
};