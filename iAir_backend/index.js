var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var db = require('./daoservice/airdao.js');
var port = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/data', function (req, res) {
   fs.readFile( __dirname + "/" + "data.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.get('/airdata', function(req, res) {
    //needed refactor
    console.log(req.query.user_id.length);
//    if (req.query.user_id.length > 2) {
//        var sql = 'select title, url from airdata WHERE airdata in ' + req.query.param + ' and id > 21090139 order by date desc limit 100';
        sql = 'select * from airdata order by create_time desc limit 1';
        var dataArr = [];
        var dataObj = {};
        db.dataCenter(sql, function(rows) {
            if (!(typeof rows === "undefined")) {
                for (var i = 0; i < rows.length; i++) {
                    dataArr.push({
                        air_type: rows[i].air_type,
                        air_value: rows[i].air_value
                    });
                    dataObj = req.query.callback +'('+rows[i].air_value+')';
//                   dataObj = 'test({"temp":'+rows[i].air_value+'})';
                    console.log(rows[i].create_time);
                }

            }
            console.log(dataObj);
            res.send(dataObj);
        });
//    }
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
