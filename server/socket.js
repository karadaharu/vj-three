var express = require('express');
var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gen = require('./generate');
var fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(path.resolve('draw.html'));
});
app.get('/controller', function(req, res){
  res.sendFile(path.resolve('controller.html'));
});
app.get('/sample', function(req, res){
  res.sendFile(path.resolve('shader.html'));
});
app.get('/sample2', function(req, res){
  res.sendFile(path.resolve('morph.html'));
});

var port = process.env.PORT || 8080;
app.use(express.static('public'));
http.listen(port, function(){
  console.log('listening on *:'+toString(port));
});

var img_path = path.resolve('./public/img/');


gen.build( (bot) => {
  var bot = bot;
  io.on('connection', function(socket){
    fs.readdir(img_path, (err, files) => {
      socket.emit("file_change", files);
    });
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

    fs.watch(img_path, { encoding: 'buffer' }, (eventType, filename) => {
      fs.readdir(img_path, (err, files) => {
        socket.broadcast.emit("file_change", files);
      })
    });

  });
});
