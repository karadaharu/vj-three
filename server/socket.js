var express = require('express');
var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gen = require('./generate');
var sample3 = require('./sample3');

app.get('/', function(req, res){
  res.sendFile(path.resolve('draw.html'));
});
app.use(express.static('public'));
http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  var s = socket;
  console.log('a user connected');

  gen.build( (bot) => {
    var msg = bot.gen_sentence();
    console.log(msg);
    s.emit("publish", {value: msg});
  });
});


// // 1.モジュールオブジェクトの初期化
// var fs = require("fs");
// var server = require("http").createServer(function(req, res) {
//      res.writeHead(200, {"Content-Type":"text/html"});
//      var output = fs.readFileSync("./draw.html", "utf-8");
//      res.end(output);
// }).listen(8080);
// var io = require("socket.io").listen(server);
//
// // ユーザ管理ハッシュ
// var userHash = {};
//
// 2.イベントの定義
// io.sockets.on("connection", function (socket) {
// //
// //   // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
// //   socket.on("connected", function (name) {
// //     var msg = name + "が入室しました";
// //     userHash[socket.id] = name;
// //     io.sockets.emit("publish", {value: msg});
// //   });
// //
//   // メッセージ送信カスタムイベント
//   // socket.on("publish", function (data) {
//   //   io.sockets.emit("publish", {value:data.value});
//   // });
//
//   gen.build( (bot) => {
//     var msg = bot.gen_sentence();
//     io.sockets.emit("publish", {value: msg});
//   });
//
//
//   // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
//   socket.on("disconnect", function () {
//     if (userHash[socket.id]) {
//       var msg = userHash[socket.id] + "が退出しました";
//       delete userHash[socket.id];
//       io.sockets.emit("publish", {value: msg});
//     }
//   });
// });
