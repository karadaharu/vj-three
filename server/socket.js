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
app.get('/controller', function(req, res){
  res.sendFile(path.resolve('controller.html'));
});
app.use(express.static('public'));
http.listen(3000, function(){
  console.log('listening on *:3000');
});


gen.build( (bot) => {
  var bot = bot;
  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('get', () => {
      var msg = bot.gen_sentence();
      console.log(msg);
      socket.emit("publish", {value: msg});
    });

    socket.on('change', (values) => {
      console.log(values);
      socket.broadcast.emit("onchange", values);
    });
  });
});
