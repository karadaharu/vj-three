(function(){
  window.Socket = function(){
    // 1.イベントとコールバックの定義
    this.io = io();
    this.io.on("connected", function() {});
    this.io.on("publish", (data) => { 
      console.log(data);
    });
  }

  window.Socket.prototype.addMessage = function(msg) {
    this.msg = msg;
    // console.log(msg);
    // var m = document.getElementById("message");
    // m.textContent = msg;
  };

  window.Socket.prototype.getSentence = function() {
    console.log('getget');
    this.socketio.emit('get');
  }

  var socket = new window.Socket();


  var Controller = function() {
    this.sound_limit = 0.1;
    this.is_gif = false;
  }
  
  var controller = new Controller();
  var gui = new dat.GUI({
  });
  
  var sound_limit = gui.add(controller, 'sound_limit', 0, 255);
  var is_gif = gui.add(controller, 'is_gif');

  sound_limit.onFinishChange(function(value){
    socket.io.emit('change', {sound_limit:value});
  });

  is_gif.onFinishChange(function(value){
    socket.io.emit('change', {is_gif:value});
  });

})();

